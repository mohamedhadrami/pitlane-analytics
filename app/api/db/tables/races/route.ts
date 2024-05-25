// @/app/api/db/tables/results

import { RacesKeys } from '@/interfaces/ergast';
import { NextRequest, NextResponse } from "next/server";
import getPaginatedData from "../../paginatedData";
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  let searchParams = new URLSearchParams(request.nextUrl.searchParams);
  const latest = searchParams.get('latest') === 'true';

  if (latest) {
    const today = new Date().toISOString();
    const race = (await sql.query(`SELECT race_id FROM races WHERE date < $1 ORDER BY date DESC LIMIT 1;`, [today])).rows[0];
    searchParams.set('race_id', race.race_id);
  }

  const tableName = 'races';

  try {
    const { metadata, data } = await getPaginatedData(request, tableName, searchParams, RacesKeys);

    return NextResponse.json({ metadata, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
