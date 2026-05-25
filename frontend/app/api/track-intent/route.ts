import { NextResponse } from 'next/server';

// Qhov no yog kom Vercel paub tias file no yog ib tug valid module
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Ntawm no yog qhov chaw koj tuaj yeem sau rau Supabase los yog Database
    // Placeholder xwb yog tias koj tseem tsis tau sau logic
    console.log("Tracking data received:", body);

    return NextResponse.json({ message: "Tracked successfully" }, { status: 200 });
  } catch (error) {
    console.error("Tracking API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Ntxiv GET rau kom muaj test link
export async function GET() {
  return NextResponse.json({ status: "API is working" });
}