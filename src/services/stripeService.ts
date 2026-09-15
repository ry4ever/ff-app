import { PairingCodeRecord } from '../types';

export interface StripeSessionResult {
  sessionId: string;
  customerId: string;
  subscriptionId: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled';
  pairingCode: string;
  customerEmail: string;
  athleteName: string;
}

export function generatePairingCode(): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `FEAR-${randomDigits}`;
}

export function simulateStripeCheckout(
  customerEmail: string,
  athleteName: string = 'Alex'
): StripeSessionResult {
  const pairingCode = generatePairingCode();
  const sessionId = `cs_live_${Math.random().toString(36).substring(2, 15)}`;
  const customerId = `cus_${Math.random().toString(36).substring(2, 12)}`;
  const subscriptionId = `sub_${Math.random().toString(36).substring(2, 14)}`;

  return {
    sessionId,
    customerId,
    subscriptionId,
    status: 'active',
    pairingCode,
    customerEmail,
    athleteName
  };
}

export interface StripeWebhookEvent {
  id: string;
  type: 'checkout.session.completed' | 'customer.subscription.updated' | 'customer.subscription.deleted';
  data: {
    object: {
      id: string;
      customer?: string;
      customer_email?: string;
      status?: string;
      metadata?: {
        child_name?: string;
        parent_id?: string;
      };
    };
  };
}

export function handleStripeWebhookPayload(
  event: StripeWebhookEvent,
  currentStatus: string
): { updatedStatus: 'active' | 'past_due' | 'canceled' | 'none'; pairingRecord?: PairingCodeRecord } {
  switch (event.type) {
    case 'checkout.session.completed': {
      const email = event.data.object.customer_email || 'parent@example.com';
      const childName = event.data.object.metadata?.child_name || 'Alex';
      const code = generatePairingCode();

      return {
        updatedStatus: 'active',
        pairingRecord: {
          code,
          parentId: event.data.object.customer || 'cus_auto',
          parentEmail: email,
          athleteName: childName,
          createdAt: new Date().toISOString(),
          isRedeemed: false
        }
      };
    }

    case 'customer.subscription.updated': {
      const stripeStatus = event.data.object.status;
      if (stripeStatus === 'active') return { updatedStatus: 'active' };
      if (stripeStatus === 'past_due') return { updatedStatus: 'past_due' };
      if (stripeStatus === 'canceled') return { updatedStatus: 'canceled' };
      return { updatedStatus: 'active' };
    }

    case 'customer.subscription.deleted':
      return { updatedStatus: 'canceled' };

    default:
      return { updatedStatus: currentStatus as any };
  }
}
