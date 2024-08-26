const stripe = require('../config/stripe');

const paymentController = {
  createCheckoutSession: async (req, res) => {
    try {
      const { amount, currency, cartItems } = req.body;

      // Create a new Stripe Checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: cartItems.map(item => ({
          price_data: {
            currency,
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(item.price * 100), // Stripe expects the amount in cents
          },
          quantity: 1,
        })),
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
      });

      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = paymentController;
