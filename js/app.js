// VERITAS - The Universal Validator Logic
// Powered by validator.js

document.addEventListener('DOMContentLoaded', () => {
    // PAYWALL LOGIC
    const paywallOverlay = document.getElementById('paywall-overlay');
    const paymentStatus = document.getElementById('payment-status');
    const statusText = document.getElementById('status-text');

    // Check for existing "license"
    const hasAccess = localStorage.getItem('veritas_premium_access');

    if (!hasAccess) {
        paywallOverlay.classList.add('active');
    }

    // Expose simulation function globally
    window.simulatePayment = (provider) => {
        const btns = document.querySelectorAll('.pay-btn');
        btns.forEach(b => b.style.opacity = '0.5');
        btns.forEach(b => b.disabled = true);

        paymentStatus.style.display = 'block';

        const steps = [
            "HANDSHAKING SECURE SERVER...",
            "VERIFYING CRYPTOGRAPHIC SIGNATURE...",
            "ALLOCATING DEDICATED ENTROPY POOL...",
            "ACCESS GRANTED."
        ];

        let step = 0;
        const interval = setInterval(() => {
            if (step >= steps.length) {
                clearInterval(interval);
                completePayment();
            } else {
                statusText.textContent = steps[step];
                step++;
            }
        }, 800);
    };

    function completePayment() {
        localStorage.setItem('veritas_premium_access', 'true');
        statusText.style.color = '#00f3ff';

        setTimeout(() => {
            paywallOverlay.style.opacity = '0';
            setTimeout(() => {
                paywallOverlay.classList.remove('active');
                paywallOverlay.style.display = 'none'; // Ensure it's gone
            }, 500);
        }, 500);
    }

    const input = document.getElementById('validator-input');
    const resultsPanel = document.getElementById('results-panel');
    const resultGrid = document.querySelector('.result-grid');
    const sanitizedOutput = document.getElementById('sanitized-output');
    const charCount = document.getElementById('char-count');
    const copyBtn = document.getElementById('copy-btn');
    const entropyLabel = document.getElementById('entropy-val');

    // Debounce function
    let timeout = null;
    const debounce = (func, wait) => {
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    input.addEventListener('input', debounce((e) => {
        const value = e.target.value.trim();
        validateInput(value);
        updateMetrics(value);
    }, 300));

    input.addEventListener('focus', () => {
        resultsPanel.classList.add('active');
    });

    copyBtn.addEventListener('click', () => {
        const text = sanitizedOutput.textContent;
        navigator.clipboard.writeText(text).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "COPIED TO CLIPBOARD";
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        });
    });

    function updateMetrics(value) {
        charCount.textContent = `${value.length} chars`;
        if (value.length > 1000) {
            entropyLabel.className = 'danger';
            entropyLabel.textContent = 'HIGH (Potential Buffer Overflow)';
        } else {
            entropyLabel.className = 'safe';
            entropyLabel.textContent = 'SAF';
        }
    }

    function validateInput(value) {
        // Clear previous results
        resultGrid.innerHTML = '';

        if (!value) {
            resultGrid.innerHTML = '<div class="pill pending">Awaiting Input...</div>';
            sanitizedOutput.textContent = '// Enter input above';
            return;
        }

        // Call Backend API
        fetch('/api/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ input: value })
        })
        .then(response => response.json())
        .then(data => {
            const results = data.results;
            const checks = [
                { label: 'EMAIL', key: 'isEmail' },
                { label: 'URL', key: 'isURL' },
                { label: 'IP ADDRESS', key: 'isIP' },
                { label: 'S.W.I.F.T CODE', key: 'isBIC' },
                { label: 'CREDIT CARD', key: 'isCreditCard' },
                { label: 'CRYPTOCURRENCY', key: 'isBtcAddress' }, // Simplification
                { label: 'ETH ADDRESS', key: 'isEthereumAddress' },
                { label: 'UUID', key: 'isUUID' },
                { label: 'JWT TOKEN', key: 'isJWT' },
                { label: 'MAC ADDRESS', key: 'isMACAddress' },
                { label: 'PORT', key: 'isPort' },
                { label: 'JSON', key: 'isJSON' },
                { label: 'BASE64', key: 'isBase64' },
                { label: 'HEX COLOR', key: 'isHexColor' },
                { label: 'SEMVER', key: 'isSemVer' }
            ];

            let validCount = 0;

            checks.forEach(item => {
                if (results[item.key]) {
                    validCount++;
                    addPill(item.label, true);
                }
            });

            // If nothing matched
            if (validCount === 0) {
                addPill('UNKNOWN FORMAT', false);
                addPill('POSSIBLE MASKING', false);
            }

            // Sanitized Output
            sanitizedOutput.textContent = data.sanitized;

            // Update Entropy from backend if available, else client side logic remains
            if (data.entropy) {
                 // You could update entropy UI here if you wanted to precise it
            }

        })
        .catch(err => {
            console.error('Validation API Error:', err);
            resultGrid.innerHTML = '<div class="pill invalid">API ERROR</div>';
        });
    }

    function addPill(label, isValid) {
        const div = document.createElement('div');
        div.className = `pill ${isValid ? 'valid' : 'invalid'}`;
        div.innerHTML = `<span>${label}</span> <span>${isValid ? '✓' : '⚠'}</span>`;
        resultGrid.appendChild(div);
    }
});
