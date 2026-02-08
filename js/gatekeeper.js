/**
 * GATEKEEPER SYSTEM v1.2.0
 * CYBERPUNK PAYMENT GATEWAY & REDIRECT ENGINE
 * COPYRIGHT QANTUM NEXUS 2025
 */

class PaymentGateway {
    constructor() {
        this.premiumKey = 'veritas_premium_access';
        this.overlay = null;

        // PAYMENT DESTINATIONS (Placeholder professional links)
        this.endpoints = {
            'stripe_basic': 'https://buy.stripe.com/test_basic_tier_link',
            'stripe_premium': 'https://buy.stripe.com/test_premium_tier_link',
            'paypal_premium': 'https://www.paypal.com/checkoutnow?token=SIMULATED_TOKEN',
            'crypto_premium': 'https://commerce.coinbase.com/checkout/simulated'
        };

        this.init();
    }

    init() {
        // Expose methods globally for proper button interaction
        window.processPayment = (method) => this.processPayment(method);
        window.simulatePayment = (method) => this.processPayment(method); // Alias for legacy HTML

        // Check if premium access already exists
        if (!localStorage.getItem(this.premiumKey)) {
            // Wait for DOM to be ready before checking/rendering
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.enforcePaywall());
            } else {
                this.enforcePaywall();
            }
        } else {
            console.log("ACCESS GRANTED: Premium user identified.");
            this.removeExistingPaywall();
        }
    }

    enforcePaywall() {
        // Check if the paywall markup already exists in the DOM (static HTML)
        const existingOverlay = document.getElementById('paywall-overlay');

        if (existingOverlay) {
            this.overlay = existingOverlay;
            this.overlay.style.display = 'flex'; // Ensure it's visible
            document.body.style.overflow = 'hidden';
        } else {
            this.renderPaywall();
        }
    }

    removeExistingPaywall() {
        const existingOverlay = document.getElementById('paywall-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        document.body.style.overflow = 'auto';
    }

    renderPaywall() {
        // Create Overlay
        this.overlay = document.createElement('div');
        this.overlay.id = 'paywall-overlay';
        this.overlay.className = 'paywall-overlay';

        // Create Modal HTML
        this.overlay.innerHTML = `
            <div class="paywall-modal">
                <div class="modal-header">
                    <div class="warning-icon">⚠️</div>
                    <h2>RESTRICTED ACCESS</h2>
                    <p>This module requires QANTUM CLEARANCE LEVEL 5.</p>
                </div>
                
                <div class="pricing-tiers">
                    <div class="tier standard">
                        <h3>OPERATOR</h3>
                        <div class="price">$49.99<span>/mo</span></div>
                        <ul>
                            <li>Basic Metrics Access</li>
                            <li>Standard Latency</li>
                            <li>9-5 Support</li>
                        </ul>
                        <button onclick="processPayment('stripe_basic')" class="btn-pay">INITIATE STRIPE</button>
                    </div>
                    
                    <div class="tier premium glitch-border">
                        <div class="recommended-badge">RECOMMENDED</div>
                        <h3>ARCHITECT</h3>
                        <div class="price">$199<span>/mo</span></div>
                        <ul>
                            <li>Full Neural Access</li>
                            <li>Zero Latency Channel</li>
                            <li>24/7 AI Support</li>
                            <li>Autonomous Thought Engine</li>
                        </ul>
                        <button onclick="processPayment('stripe_premium')" class="btn-pay primary">INITIATE STRIPE</button>
                        <button onclick="processPayment('paypal_premium')" class="btn-pay secondary">PAYPAL EXPRESS</button>
                        <button onclick="processPayment('crypto_premium')" class="btn-pay crypto">CRYPTO (ETH/SOL)</button>
                    </div>
                </div>

                <div class="terminal-status" id="payment-status">
                    > WAITING FOR SECURE INPUT...
                </div>
            </div>
        `;

        document.body.appendChild(this.overlay);

        // Block scrolling
        document.body.style.overflow = 'hidden';
    }

    async processPayment(method) {
        // Handle both dynamic and static ID scenarios
        const statusEl = document.getElementById('payment-status');
        if (!statusEl) return;

        // Visual Feedback
        statusEl.innerHTML = `> INITIATING HANDSHAKE WITH ${method.toUpperCase()}...`;
        statusEl.style.color = '#00ffcc';

        await this.sleep(1000);
        statusEl.innerHTML = `> GENERATING CHECKOUT SESSION...`;
        await this.sleep(1500);

        statusEl.innerHTML = `> REDIRECTING TO SECURE GATEWAY...`;
        await this.sleep(1000);

        // REAL REDIRECT ENGINE - NO MORE SIMULATIONS
        const targetUrl = this.endpoints[method] || this.endpoints['stripe_premium'];

        console.log(`GATEKEEPER: Executing hard redirect to ${targetUrl}`);
        window.location.href = targetUrl;
    }

    unlock() {
        if (this.overlay) {
            this.overlay.style.opacity = '0';
            setTimeout(() => {
                this.overlay.remove();
                document.body.style.overflow = 'auto'; // Restore scrolling
            }, 500);
        } else {
            // Fallback if overlay wasn't stored in 'this' (e.g. static HTML case)
            const el = document.getElementById('paywall-overlay');
            if (el) {
                el.style.opacity = '0';
                setTimeout(() => { el.remove(); document.body.style.overflow = 'auto'; }, 500);
            }
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize on Load
// We invoke it immediately to bind window functions, but logic runs on DOMContentLoaded inside init if needed
new PaymentGateway();
