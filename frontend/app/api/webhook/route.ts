import { NextResponse } from 'next/server';
import crypto from 'crypto';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log("🚀 Firebase Admin Initialized Successfully");
  } catch (error: any) {
    console.error("❌ Firebase Admin Init Error:", error.message);
  }
}

const db = admin.firestore();

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-signature') || '';
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || "my-super-secret-nouai";

    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(rawBody).digest('hex');

    if (signature !== digest) {
      console.error("❌ Invalid Signature detected!");
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const email = payload.data.attributes.user_email;

    if (eventName === 'order_created') {
      const attributes = payload.data.attributes;
      
      // ✅ KHO TSHIAB LUB LOGIC KAWG: Nqa tus Nqi Nyiaj (Total) uas yog Cents los check hloov
      // 999 Cents = $9.99 | 3999 Cents = $39.99 | 9999 Cents = $99.99
      const totalCents = attributes.total ? parseInt(attributes.total.toString()) : 0;
      const variantName = attributes.variant_name || "Unknown";
      const variantId = attributes.variant_id ? attributes.variant_id.toString() : "EMPTY";
      
      let amountToAdd = 100; // Default

      // 🎯 Tshuaj xyuas raws li cov nqi nyiaj (Total Cents) uas txawv nkaus ntawm 3 lub packages
      if (totalCents === 3999) {
        amountToAdd = 500;   // Pob Pro Pack ($39.99)
      } else if (totalCents === 9999) {
        amountToAdd = 1500;  // Pob Studio Pack ($99.99)
      } else if (totalCents === 999) {
        amountToAdd = 100;   // Pob Starter Pack ($9.99)
      }

      console.log(`🔔 Webhook Processed | User: ${email}`);
      console.log(`📦 Order Total: ${totalCents} Cents | Variant Name: ${variantName} (ID: ${variantId})`);
      console.log(`🚀 Calculating Credits: Adding ${amountToAdd} CR to database`);

      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('email', '==', email).get();

      if (snapshot.empty) {
        console.error(`❌ User ${email} not found in Firestore`);
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const batch = db.batch();
      snapshot.forEach(doc => {
        batch.update(doc.ref, {
          credits: admin.firestore.FieldValue.increment(amountToAdd),
          last_purchase_variant: variantName,
          last_purchase_cents: totalCents,
          last_purchase_time: admin.firestore.FieldValue.serverTimestamp()
        });
      });

      await batch.commit();
      console.log(`✅ SUCCESS: ${amountToAdd} credits added to ${email} successfully!`);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("🔥 Webhook Crash:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}