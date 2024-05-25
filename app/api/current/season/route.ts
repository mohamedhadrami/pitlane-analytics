// yourApiHandler.ts

import { RacesKeys } from '@/interfaces/ergast';
import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params: Record<string, string> = {};
    let info = '';

    searchParams.forEach((value, key) => {
      if (key === 'year') {
        info = 'The year parameter won\'t affect the results.';
      } else if (RacesKeys.includes(key)) {
        params[key] = value;
      } else {
        throw new Error(`Invalid query parameter: ${key}`);
      }
    });

    let conditions = '';
    if (Object.keys(params).length > 0) {
      conditions = ' AND ' + Object.keys(params).map(key => `${key}='${params[key]}'`).join(' AND ');
    }

    const year = new Date().getFullYear();
    const query = `SELECT * FROM races WHERE year=${year}${conditions};`;
    const result = await sql.query(query);
    const data = {
      season: year,
      races: result.rows,
      metadata: {
        query,
        params,
        info
      }
    };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
