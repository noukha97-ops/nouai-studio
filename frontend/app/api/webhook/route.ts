import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// 1. Txuas rau Supabase nrog Service Role Key kom hla tau RLS Policies
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    // 2. Nyeem cov ntaub ntawv (Raw Body) los ntawm Lemon Squeezy
    const rawBody = await req.text();
    const signature = req.headers.get('x-signature') || '';
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || "my-super-secret-nouai";

    // 3. Check Signature (Kev ruaj ntseg kom tsis txhob muaj neeg tuaj Hack koj lub API)
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(rawBody).digest('hex');

    if (signature !== digest) {
      console.error("❌ Invalid Webhook Signature!");
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const email = payload.data.attributes.user_email;

    console.log(`🔔 Webhook Event: ${eventName} | User: ${email}`);

    // 4. Khiav hauj lwm thaum muaj neeg them nyiaj xong (order_created)
    if (eventName === 'order_created') {
      const creditsToAdd = 100; // Koj hloov tau raws li tus nqi pob khoom

      // A. Sim nrhiav user los ntawm Email hauv Supabase
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (profile) {
        // --- YOG TIAS MUAJ USER LAWM: Ntxiv Credits ntxiv rau tus qub ---
        const newCredits = Number(profile.credits || 0) + creditsToAdd;
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ credits: newCredits })
          .eq('id', profile.id);

        if (updateError) throw updateError;
        console.log(`✅ Updated: Added ${creditsToAdd} credits to existing user ${email}`);

      } else {
        // --- YOG TIAS TSIS TAU MUAJ USER (Firebase User tshiab): Tsim profile tshiab tam sim ---
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: `ls_${crypto.randomBytes(8).toString('hex')}`, // Tsim ID tshiab rau nws
            email: email,
            credits: creditsToAdd
          });

        if (insertError) throw insertError;
        console.log(`✨ Created: New profile and added ${creditsToAdd} credits for ${email}`);
      }
    }

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("🔥 Webhook Crash:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}