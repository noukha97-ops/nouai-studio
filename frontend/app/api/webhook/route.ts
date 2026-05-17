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
      console.error("❌ Invalid Signature!");
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const email = payload.data.attributes.user_email;

    if (eventName === 'order_created') {
      // ✅ KHO TSHIAB: Tshuaj xyuas variant_id kom zoo kom txhob Crash
      const attributes = payload.data.attributes;
      const variantId = attributes.variant_id ? attributes.variant_id.toString() : "";
      const variantName = attributes.variant_name || "Unknown";
      
      let amountToAdd = 100; // Default

      // Check raws li IDs uas koj muaj
      if (variantId === "1659730") {
        amountToAdd = 500;
      } else if (variantId === "1659734") {
        amountToAdd = 1500;
      } else if (variantId === "1657526") {
        amountToAdd = 100;
      }

      console.log(`🔔 Webhook Received: ${eventName} | User: ${email}`);
      console.log(`📦 Variant: ${variantName} (ID: ${variantId}) | Adding: ${amountToAdd} CR`);

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
          last_variant_id: variantId,
          updated_at: admin.firestore.FieldValue.serverTimestamp()
        });
      });

      await batch.commit();
      console.log(`✅ SUCCESS: ${amountToAdd} credits added to ${email}`);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    // Kho kom pom qhov Error tiag tiag hauv terminal
    console.error("🔥 Webhook Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}