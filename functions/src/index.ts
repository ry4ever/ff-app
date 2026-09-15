import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

admin.initializeApp();
const db = admin.firestore();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16' as any,
});

/**
 * Stripe Webhook Handler (Phase 2 & Phase 7)
 * Listens for customer.subscription events and syncs status directly to Firestore
 */
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let event: Stripe.Event;

  try {
    if (endpointSecret && sig) {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } else {
      event = req.body;
    }
  } catch (err: any) {
    functions.logger.error('Stripe signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_email;
      const customerId = session.customer as string;

      if (customerEmail) {
        // Find or create parent user document
        const parentQuery = await db.collection('users').where('email', '==', customerEmail).get();
        if (!parentQuery.empty) {
          await parentQuery.docs[0].ref.update({
            subscriptionStatus: 'active',
            stripeCustomerId: customerId,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;
      const userQuery = await db.collection('users').where('stripeCustomerId', '==', customerId).get();
      if (!userQuery.empty) {
        await userQuery.docs[0].ref.update({
          subscriptionStatus: 'canceled',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;
      const status = sub.status === 'active' ? 'active' : sub.status === 'past_due' ? 'past_due' : 'canceled';

      const userQuery = await db.collection('users').where('stripeCustomerId', '==', customerId).get();
      if (!userQuery.empty) {
        await userQuery.docs[0].ref.update({
          subscriptionStatus: status,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
      break;
    }

    default:
      functions.logger.info(`Unhandled Stripe event type: ${event.type}`);
  }

  res.json({ received: true });
});

/**
 * AC 4.2: Milestone Trigger for 45-Day Streak Jersey Reward
 * Listens for athlete streak updates and triggers fulfillment when 45 days is reached.
 */
export const checkJerseyMilestone = functions.firestore
  .document('athletes/{athleteId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    const previousStreak = before.currentStreak || 0;
    const newStreak = after.currentStreak || 0;
    const isAlreadyEligible = before.jersey_reward_eligible;

    if (newStreak >= 45 && !isAlreadyEligible) {
      await change.after.ref.update({
        jersey_reward_eligible: true,
        jersey_unlocked_at: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Dispatch Saturday Sideline Fulfillment Notification & Alert
      await db.collection('fulfillment_orders').add({
        athleteId: context.params.athleteId,
        athleteName: after.name || 'Alex',
        parentId: after.parentId,
        streakDays: newStreak,
        status: 'pending_fulfillment',
        item: 'Official Fearless Footballer Streak Match Jersey',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  });

/**
 * Family Pairing Verification
 * Allows athlete device to pair with parent account using 6-digit code
 */
export const redeemFamilyPairingCode = functions.https.onCall(async (data, context) => {
  const code = (data.code || '').trim().toUpperCase();
  const athleteId = context.auth?.uid || data.athleteId;

  if (!code || !athleteId) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing pairing code or athlete ID');
  }

  const codeDoc = await db.collection('pairing_codes').doc(code).get();
  if (!codeDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Invalid pairing code');
  }

  const record = codeDoc.data()!;
  if (record.isRedeemed) {
    throw new functions.https.HttpsError('failed-precondition', 'Pairing code already redeemed');
  }

  // Link athlete to parent
  await db.collection('athletes').doc(athleteId).update({
    parentId: record.parentId,
    pairingCode: code,
    linkedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Mark pairing code redeemed
  await codeDoc.ref.update({
    isRedeemed: true,
    redeemedByAthleteId: athleteId,
    redeemedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, parentId: record.parentId };
});
