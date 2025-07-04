import express from 'express';
import webhookController from '../controllers/webhook.js';

const router = express.Router();

router.post(
  '/',
  express.raw({ type: 'application/json' }),
  webhookController.handleStripeWebhook
);

export default router;
