const axios = require('axios');
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
        metadata: {
          productIds: cartItems.map(item => item.productId).join(','), // Store the product IDs
        },
      });

      res.status(200).json({ url: session.url });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  webhook: async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const productIds = session.metadata.productIds.split(',');

      try {
        // Send a request to your backend to delete the products
        await Promise.all(productIds.map(async (productId) => {
          await axios.delete('http://localhost:5000/api/product/delete', {
            data: { id: productId }
          });
        }));
      } catch (error) {
        res.status(404).json({ error: error.message });
      }
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  }
};

module.exports = paymentController;
