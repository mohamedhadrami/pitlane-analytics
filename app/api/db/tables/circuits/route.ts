// @/app/api/db/tables/circuits

import { NextRequest, NextResponse } from "next/server";
import getPaginatedData from "../../paginatedData";
import { CircuitKeys } from "@/interfaces/ergast";


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let orderByColumn = searchParams.get('orderByColumn') || undefined;
  let cursor = parseInt(searchParams.get('cursor') || '0');
  let limit = parseInt(searchParams.get('limit') || '20');

  if (isNaN(cursor) || cursor < 0) cursor = 0;
  if (isNaN(limit) || limit < 1 || limit > 100) limit = 20;

  const tableName = 'circuits';

  try {
    const { metadata, data } = await getPaginatedData(request, tableName, searchParams, CircuitKeys);

    return NextResponse.json({ metadata, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}