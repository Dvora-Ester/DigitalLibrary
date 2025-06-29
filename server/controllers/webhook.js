import Stripe from 'stripe';
import ordersController from './orders.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const userId = session.metadata.userId;
    const email = session.customer_email;
    const orderedBookIds = JSON.parse(session.metadata.orderedBookIds);
    const stripeSessionId = session.id;

    const reqForAdd = {
      body: {
        userId,
        email,
        orderedBookIds,
        stripeSessionId
      }
    };

    try {
      // הרצת add מה־ordersController עם res דמה
      await ordersController.add(reqForAdd, {
        status: () => ({ json: () => {} }),
        json: () => {},
      });
      console.log('✔ תשלום התקבל ונשמרה הזמנה');
    } catch (err) {
      console.error('❌ שגיאה בשמירת ההזמנה מתוך Webhook:', err);
      return res.status(500).send('Internal Server Error');
    }
  }

  res.status(200).send();
};

export default {
  handleStripeWebhook,
};
