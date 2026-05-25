import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 🔥 Siv SERVICE_ROLE_KEY txhawm rau kom nws sau tau rau hauv database 100% tsis raug RLS Block
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Nco ntsoov ntxiv tus key no hauv koj lub .env file ov
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, user_email, plan_name, price } = body;

    // Sau ntaub ntawv ncaj qha rau hauv lub table payment_intents li hauv daim duab Supabase
    const { data, error } = await supabaseAdmin
      .from('payment_intents')
      .insert([
        { 
          user_id: user_id || null, 
          user_email: user_email || 'Anonymous Click', 
          plan_name: plan_name || 'Clicked Topup Button', 
          price: price || '0'
        }
      ]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Supabase Write Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}