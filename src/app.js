const express = require('express');
const bodyParser = require('body-parser');
const dataSet = require('../static/const');

const app = express();
app.use(bodyParser.json());

const products = dataSet;

const calculateTotalPrice = (items) => {
    let totalPrice = 0;
    items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
            totalPrice += product.price * item.quantity;
        }
    });
    return totalPrice;
};

const applyDiscount = (totalPrice) => {
    const appleDiscountQuantity = 3;
    const appleDiscountPrice = 130;

    const appleCount = Math.floor(totalPrice / products[0].price);
    const discountedAppleCount = Math.floor(appleCount / appleDiscountQuantity);
    const remainingAppleCount = appleCount % appleDiscountQuantity;

    const discountedPrice =
        discountedAppleCount * appleDiscountPrice +
        remainingAppleCount * products[0].price;

    return discountedPrice;
};

const authenticate = (req, res, next) => {
    // auth logic to check if the user is logged in or not
    next();
};

const validateRequest = (req, res, next) => {
    const { items, userDetails } = req.body;

    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Invalid items' });

    if (
        typeof userDetails !== 'object' ||
        !userDetails.name ||
        !userDetails.email
    ) return res.status(400).json({ error: 'Invalid userDetails' });

    next();
};

app.post('/checkout', authenticate, validateRequest, (req, res, next) => {
    try {
        const { items, userDetails } = req.body;

        const totalPrice = calculateTotalPrice(items);
        const totalAfterDiscount = applyDiscount(totalPrice);

        const receipt = {
            items,
            totalPrice,
            totalAfterDiscount,
            userDetails,
            timestamp: new Date(),
        };
        res.json(receipt);
    } catch (err) { next(err) };
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
