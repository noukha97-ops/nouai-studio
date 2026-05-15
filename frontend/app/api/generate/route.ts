import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Siv Service Role kom hla tau RLS
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json(); // Nhiav user los ntawm email (Firebase email)

    // 1. Check seb user tshuav credits pes tsawg?
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('email', email)
      .single();

    if (fetchError || !profile) {
      return NextResponse.json({ error: "Nrhiav tsis pom koj lub npe hauv database!" }, { status: 404 });
    }

    if (profile.credits <= 0) {
      return NextResponse.json({ error: "Koj Creditsหม้ด lawm! Thov mus top up uantej." }, { status: 403 });
    }

    // 2. --- NTAU NO KOJ LUB AI CODE YUAV KHIAV (Piv txwv: Generate Image) ---
    // const aiResult = await generateAIImage(...); 

    // 3. Thaum AI khiav xong, wb "HAK" (Minus) 1 credit
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('email', email);

    if (updateError) throw updateError;

    return NextResponse.json({ 
      success: true, 
      message: "AI Generated xong lawm!",
      remainingCredits: profile.credits - 1 
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}