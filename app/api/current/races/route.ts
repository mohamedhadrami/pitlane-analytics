import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    let queryParams = new URLSearchParams(request.nextUrl.searchParams);
    const year = new Date().getFullYear();;
    const query = `SELECT * FROM races WHERE year=${year};`
    const result = await sql.query(query);
    const data = {
        params: queryParams,
        season: year,
        races: result.rows
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
