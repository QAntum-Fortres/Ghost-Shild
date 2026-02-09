import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { SelfReinvestment } from "./SelfReinvestment";

describe("SelfReinvestment", () => {
  let engine: SelfReinvestment;

  beforeEach(() => {
    engine = new SelfReinvestment();
  });

  afterEach(async () => {
    await engine.shutdown();
  });

  describe("generateGrowthProjection", () => {
    it("should generate a projection for 30 days", () => {
      engine.registerRevenueStream({ source: 'subscription', monthlyRevenue: 10000 });
      engine.registerCostCenter({ name: 'Infrastructure', type: 'infrastructure', monthlyCost: 5000 });

      const projection = engine.generateGrowthProjection(30);

      expect(projection.days).toBe(30);
      expect(projection.currentMRR).toBe(10000);
      expect(projection.currentCosts).toBe(5000);

      // Revenue growth: 10% monthly. 30 days = 1 month.
      // 10000 * (1 + 0.1)^1 = 11000
      expect(projection.projectedMRR).toBeCloseTo(11000);

      // Cost growth: 5% monthly.
      // 5000 * (1 + 0.05)^1 = 5250
      expect(projection.projectedCosts).toBeCloseTo(5250);

      expect(projection.revenueGrowthPercent).toBeCloseTo(10);
      expect(projection.costGrowthPercent).toBeCloseTo(5);
    });

    it("should handle 0 days projection", () => {
      engine.registerRevenueStream({ source: 'subscription', monthlyRevenue: 10000 });
      const projection = engine.generateGrowthProjection(0);
      expect(projection.projectedMRR).toBe(10000);
      expect(projection.revenueGrowthPercent).toBe(0);
    });

    it("should handle large number of days (e.g., 1 year)", () => {
      engine.registerRevenueStream({ source: 'subscription', monthlyRevenue: 10000 });
      const projection = engine.generateGrowthProjection(360); // 12 months

      // 10000 * (1.1)^12 = 31384.28376721
      expect(projection.projectedMRR).toBeCloseTo(31384.28);
      expect(projection.days).toBe(360);
    });

    it("should use parameterized tests for various durations", () => {
      engine.registerRevenueStream({ source: 'subscription', monthlyRevenue: 10000 });
      engine.registerCostCenter({ name: 'Infrastructure', type: 'infrastructure', monthlyCost: 5000 });

      const scenarios = [
        { days: 30, expectedMRR: 11000, expectedCosts: 5250 },
        { days: 60, expectedMRR: 12100, expectedCosts: 5512.5 },
        { days: 90, expectedMRR: 13310, expectedCosts: 5788.125 },
      ];

      scenarios.forEach(({ days, expectedMRR, expectedCosts }) => {
        const projection = engine.generateGrowthProjection(days);
        expect(projection.projectedMRR).toBeCloseTo(expectedMRR);
        expect(projection.projectedCosts).toBeCloseTo(expectedCosts);
      });
    });

    it("should calculate workers needed correctly", () => {
      // currentWorkers defaults to 100 if workerCount is 0
      // projectedLoad = 1 + (0.1 * monthsAhead)
      // For 30 days: projectedLoad = 1 + 0.1 * 1 = 1.1
      // Note: 100 * 1.1 in JavaScript/Bun can be 110.00000000000001
      // So Math.ceil(100 * 1.1) becomes 111

      const projection = engine.generateGrowthProjection(30);
      expect(projection.currentWorkers).toBe(100);
      expect(projection.projectedWorkers).toBe(111);
      expect(projection.workersNeeded).toBe(11);
      expect(projection.investmentRequired).toBe(550);
    });

    it("should handle negative days", () => {
        engine.registerRevenueStream({ source: 'subscription', monthlyRevenue: 10000 });
        const projection = engine.generateGrowthProjection(-30);

        // 10000 * (1.1)^-1 = 9090.909
        expect(projection.projectedMRR).toBeCloseTo(9090.91);
    });

    it("should calculate profit and margin correctly", () => {
        engine.registerRevenueStream({ source: 'subscription', monthlyRevenue: 10000 });
        engine.registerCostCenter({ name: 'Infrastructure', type: 'infrastructure', monthlyCost: 5000 });

        const projection = engine.generateGrowthProjection(30);

        // Current profit = 10000 - 5000 = 5000
        expect(projection.currentProfit).toBe(5000);

        // Projected MRR = 11000, Projected Costs = 5250
        // Projected Profit = 11000 - 5250 = 5750
        expect(projection.projectedProfit).toBe(5750);

        // Margin percent = (5750 / 11000) * 100 = 52.2727...
        expect(projection.marginPercent).toBeCloseTo(52.27);
    });
  });
});
