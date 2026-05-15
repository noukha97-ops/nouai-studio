import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    if (!email) return NextResponse.json({ credits: 0 });

    const { data, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('email', email)
      .single();

    if (error || !data) return NextResponse.json({ credits: 0 });
    return NextResponse.json({ credits: data.credits });
  } catch (err) {
    return NextResponse.json({ credits: 0 });
  }
}