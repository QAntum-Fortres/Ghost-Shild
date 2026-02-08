/**
 * GATEKEEPER SYSTEM v1.0.0
 * CYBERPUNK PAYMENT GATEWAY SIMULATION
 * COPYRIGHT QANTUM NEXUS 2025
 */

class PaymentGateway {
    constructor() {
        this.premiumKey = 'veritas_premium_access';
        this.modal = null;
        this.overlay = null;
        this.init();
    }

    init() {
        // Check if premium access exists
        if (!localStorage.getItem(this.premiumKey)) {
            this.renderPaywall();
        } else {
            console.log("ACCESS GRANTED: Premium user identified.");
        }

        // Expose method globally for buttons
        window.processPayment = (method) => this.processPayment(method);
    }

    renderPaywall() {
        // Create Overlay
        this.overlay = document.createElement('div');
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
                    > WAITING FOR INPUT...
                </div>
            </div>
        `;

        document.body.appendChild(this.overlay);

        // Block scrolling
        document.body.style.overflow = 'hidden';
    }

    async processPayment(method) {
        const statusEl = document.getElementById('payment-status');
        if (!statusEl) return;

        // Simulation Sequence
        statusEl.innerHTML = `> INITIATING HANDSHAKE WITH ${method.toUpperCase()}...`;
        await this.sleep(800);

        statusEl.innerHTML = `> VERIFYING BIOMETRICS...`;
        await this.sleep(1200);

        statusEl.innerHTML = `> ESTABLISHING SECURE CONNECTION [TLS 1.3]...`;
        await this.sleep(1000);

        statusEl.innerHTML = `> PROCESSING TRANSACTION...`;
        await this.sleep(1500);

        if (Math.random() > 0.05) { // 95% Success Rate
            statusEl.innerHTML = `<span style="color: #0f0;">> TRANSACTION APPROVED. ACCESS GRANTED.</span>`;
            statusEl.style.borderColor = '#0f0';

            await this.sleep(1000);

            // Unlock
            localStorage.setItem(this.premiumKey, 'true');
            this.unlock();
        } else {
            statusEl.innerHTML = `<span style="color: #f00;">> TRANSACTION FAILED. INSUFFICIENT FUNDS.</span>`;
            statusEl.style.borderColor = '#f00';
        }
    }

    unlock() {
        if (this.overlay) {
            this.overlay.style.opacity = '0';
            setTimeout(() => {
                this.overlay.remove();
                document.body.style.overflow = 'auto';
            }, 500);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    new PaymentGateway();
});
