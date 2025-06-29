// import express from 'express';
// import Stripe from 'stripe';
// import ordersController from '../controllers/Orders.js';

// const router = express.Router();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // שים לב: express.raw חובה לפני express.json
// router.post(
//   '/',
//   express.raw({ type: 'application/json' }),
//   async (req, res) => {
//     console.log("🎯 Webhook route hit!");
//     const sig = req.headers['stripe-signature'];
//     let event;

//     try {
//       console.log('🔔 Webhook received:', req.body);
//       event = stripe.webhooks.constructEvent(
//         req.body,
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET
//       );
//     } catch (err) {
//       console.error('❌ Webhook Error:', err.message);
//       return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     // אם זה תשלום שהושלם
//     if (event.type === 'checkout.session.completed') {
//       console.log('✔ תשלום הושלם בהצלחה!');
//       const session = event.data.object;

//       const userId = session.metadata.userId;
//       const email = session.customer_email;
//       const orderedBookIds = JSON.parse(session.metadata.orderedBookIds);
//       const stripeSessionId = session.id;

//       const reqForAdd = {
//         body: {
//           userId,
//           email,
//           orderedBookIds,
//           stripeSessionId
//         }
//       };

//       try {
//         // אל תעבירי את res המקורי! תעבירי res דמה:
//         await ordersController.add(reqForAdd, {
//           status: () => ({ json: () => { } }),
//           json: () => { },
//         });
//         console.log('✔ תשלום התקבל ונשמרה הזמנה');
//       } catch (err) {
//         console.error('❌ שגיאה בשמירת ההזמנה מתוך Webhook:', err);
//         return res.status(500).send('Internal Server Error');
//       }
//     }

//     // שולחת תשובה ל-Stripe (חייב)
//     res.status(200).send();
//   }
// );

// export default router;
import express from 'express';
import webhookController from '../controllers/webhook.js';

const router = express.Router();

router.post(
  '/',
  express.raw({ type: 'application/json' }),
  webhookController.handleStripeWebhook
);

export default router;
