import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Yuav tsum siv Service Role Key hauv .env
);

export async function POST(req: Request) {
  try {
    const { userId, creditsToAdd, orderId } = await req.json();

    if (!userId) return NextResponse.json({ error: "Missing User ID" }, { status: 400 });

    // 1. Nrhiav User Profile
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (fetchError) throw fetchError;

    // 2. Ntxiv Credits
    const newCredits = (profile.credits || 0) + creditsToAdd;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', userId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, orderId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}