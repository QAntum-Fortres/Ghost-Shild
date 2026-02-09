const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const validator = require('validator');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Uncomment when key is available

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Validation Endpoint
app.post('/api/validate', (req, res) => {
    const { input } = req.body;

    if (!input) {
        return res.status(400).json({ error: 'No input provided' });
    }

    const results = {
        isEmail: validator.isEmail(input),
        isURL: validator.isURL(input),
        isIP: validator.isIP(input),
        isBIC: validator.isBIC(input),
        isCreditCard: validator.isCreditCard(input),
        isUUID: validator.isUUID(input),
        isJWT: validator.isJWT(input),
        isMACAddress: validator.isMACAddress(input),
        isPort: validator.isPort(input),
        isJSON: validator.isJSON(input),
        isBase64: validator.isBase64(input),
        isHexColor: validator.isHexColor(input),
        isSemVer: validator.isSemVer(input),
        // Add crypto checks if available in validator or custom logic
        isBtcAddress: validator.isBtcAddress ? validator.isBtcAddress(input) : false,
        isEthereumAddress: validator.isEthereumAddress ? validator.isEthereumAddress(input) : false,
    };

    // Calculate entropy (simple approximation)
    const uniqueChars = new Set(input).size;
    const entropy = uniqueChars / input.length;

    // Sanitization
    const sanitized = validator.escape(validator.trim(input));

    res.json({
        input,
        sanitized,
        results,
        entropy
    });
});

// Payment Session Endpoint
app.post('/api/create-checkout-session', async (req, res) => {
    const { paymentMethod } = req.body;

    // Simulate backend processing delay
    setTimeout(() => {
        // In a real app, you would create a Stripe session here:
        // const session = await stripe.checkout.sessions.create({ ... });
        // res.json({ url: session.url });

        // For now, return a success URL (or mock Stripe checkout URL)
        // Since we don't have real keys, we redirect to a success page

        let targetUrl = '/success.html';

        // Log the attempt
        console.log(`Processing payment for method: ${paymentMethod}`);

        res.json({ url: targetUrl });
    }, 1000);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
