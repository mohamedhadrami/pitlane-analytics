import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

const dangerousKeywords = /(\bDROP\b|\bDELETE\b|\bTRUNCATE\b|\bALTER\b|\bUPDATE\b)/i;

export async function POST(request: NextRequest) {
  try {
    const { query, params } = await request.json();

    if (dangerousKeywords.test(query)) {
      return NextResponse.json({ error: "Dangerous SQL query detected." }, { status: 400 });
    }
    const result = await sql.query(query, params);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
