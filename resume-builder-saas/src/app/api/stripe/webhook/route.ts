import { NextResponse } from 'next/server';
import { stripe, isStripeConfigured } from '@/lib/stripe';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  if (!isStripeConfigured || !stripe) {
    return NextResponse.json({ received: false, error: 'Stripe not configured' }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const customerId = session.customer as string;

        if (userId) {
          await supabase
            .from('profiles')
            .update({
              tier: 'pro',
              stripe_customer_id: customerId,
              stripe_subscription_id: session.subscription as string,
            })
            .eq('id', userId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const isActive = ['active', 'trialing'].includes(subscription.status);

        await supabase
          .from('profiles')
          .update({
            tier: isActive ? 'pro' : 'free',
            stripe_subscription_id: subscription.id,
          })
          .eq('stripe_customer_id', customerId);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await supabase
          .from('profiles')
          .update({
            tier: 'free',
            stripe_subscription_id: null,
          })
          .eq('stripe_customer_id', customerId);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook processing error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
