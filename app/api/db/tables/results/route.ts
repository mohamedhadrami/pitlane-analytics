// @/app/api/db/tables/results

import { ResultsKeys } from '@/interfaces/ergast';
import { NextRequest, NextResponse } from "next/server";
import getPaginatedData from "../../paginatedData";
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  const searchParams = new URLSearchParams(request.nextUrl.searchParams);
  const latest = searchParams.get('latest') === 'true';
  const year = searchParams.get('year');
  const name = searchParams.get('race_name');

  // Check if any required parameter is present
  const hasValidParams = latest || year || name || Array.from(searchParams.keys()).some(key => ResultsKeys.includes(key));

  if (!hasValidParams) {
    throw new Error('Must specify either both year and race_name, latest=true, or one of the ResultsKeys');
  }

  // Handle year and name or latest parameter to set race_id
  if ((year && name) || latest) {
    if (year && name) {
      const raceIdResult = await sql.query(`SELECT race_id FROM races WHERE year=$1 AND name=$2`, [year, name]);
      const raceId = raceIdResult.rows[0]?.race_id;
      if (!raceId) throw new Error('No race found for the specified year and name');
      searchParams.set('race_id', raceId);
    } else if (latest) {
      const today = new Date().toISOString();
      const raceIdResult = (await sql.query(`SELECT race_id FROM races WHERE date < $1 ORDER BY date DESC LIMIT 1;`, [today])).rows[0];
      const raceId = raceIdResult.race_id;
      if (!raceId) throw new Error('No latest race found');
      searchParams.set('race_id', raceId);
    }
  }

  const tableName = 'results';

  try {
    const { metadata, data } = await getPaginatedData(request, tableName, searchParams, ResultsKeys);
    return NextResponse.json({ metadata, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message, test: "hello" }, { status: 500 });
  }
}
