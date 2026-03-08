import { NextResponse } from 'next/server';
import { stripe, isStripeConfigured } from '@/lib/stripe';

export async function POST(request: Request) {
  if (!isStripeConfigured || !stripe) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 503 }
    );
  }

  try {
    const { customerId } = await request.json();

    if (!customerId) {
      return NextResponse.json(
        { error: 'No Stripe customer ID found' },
        { status: 400 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe portal error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
