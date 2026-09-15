import { describe, it, expect } from 'vitest';
import { handleStripeWebhookPayload, simulateStripeCheckout } from '../services/stripeService';

describe('Stripe Billing & Family Pairing Service (No Kajabi)', () => {
  it('handles checkout.session.completed and generates pairing record', () => {
    const event: any = {
      id: 'evt_test_1',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          customer: 'cus_test_999',
          customer_email: 'parent@example.com',
          metadata: { child_name: 'Leo' }
        }
      }
    };

    const result = handleStripeWebhookPayload(event, 'none');
    expect(result.updatedStatus).toBe('active');
    expect(result.pairingRecord).toBeDefined();
    expect(result.pairingRecord?.code).toMatch(/^FEAR-\d{4}$/);
    expect(result.pairingRecord?.parentEmail).toBe('parent@example.com');
  });

  it('handles customer.subscription.deleted by setting canceled', () => {
    const event: any = {
      id: 'evt_test_2',
      type: 'customer.subscription.deleted',
      data: { object: { id: 'sub_123' } }
    };

    const result = handleStripeWebhookPayload(event, 'active');
    expect(result.updatedStatus).toBe('canceled');
  });

  it('handles customer.subscription.updated for past_due status', () => {
    const event: any = {
      id: 'evt_test_3',
      type: 'customer.subscription.updated',
      data: { object: { id: 'sub_123', status: 'past_due' } }
    };

    const result = handleStripeWebhookPayload(event, 'active');
    expect(result.updatedStatus).toBe('past_due');
  });

  it('simulates direct Stripe checkout session with family pairing code', () => {
    const checkout = simulateStripeCheckout('mom@example.com', 'Alex');
    expect(checkout.status).toBe('active');
    expect(checkout.pairingCode).toMatch(/^FEAR-\d{4}$/);
    expect(checkout.customerId).toContain('cus_');
  });
});
