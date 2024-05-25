// @/app/api/db/tables

import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const result = await sql`
      SELECT
          table_name
      FROM
          information_schema.tables
      WHERE
          table_type = 'BASE TABLE'
      AND
          table_schema NOT IN ('pg_catalog', 'information_schema');
      `;

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}