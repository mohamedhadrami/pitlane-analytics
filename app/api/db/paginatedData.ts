// @/app/api/db/paginatedData

import { sql } from "@vercel/postgres";
import { NextRequest } from "next/server";

function buildWhereClause(queryParams: URLSearchParams, validKeys: string[]): { clause: string, params: Record<string, string>, unusedParams: Record<string, string> } {
  const conditions: string[] = [];
  const params: Record<string, string> = {};
  const unusedParams: Record<string, string> = {};

  queryParams.forEach((value, key) => {
    if (validKeys.includes(key)) {
      conditions.push(`${key}='${value}'`);
      params[key] = value;
    } else if (!["orderByColumn", "cursor", "limit", "latest"].includes(key)) {
      unusedParams[key] = value;
    }
  });

  const clause = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';
  return { clause, params, unusedParams };
}

function buildPaginationMetadata(request: NextRequest, tableName: string, query: string, totalCount: number, limit: number, cursor: number, params: Record<string, string>, unusedParams: Record<string, string>) {
  const totalPages = Math.ceil(totalCount / limit);
  const currentPage = Math.floor(cursor / limit) + 1;
  const nextCursor = currentPage < totalPages ? cursor + limit : null;
  const prevCursor = cursor > 0 ? Math.max(0, cursor - limit) : null;

  const { protocol, hostname, port } = request.nextUrl;
  const baseURL = `${protocol}//${hostname}${port ? `:${port}` : ''}`;

  const serializeParams = (additionalParams: Record<string, string>) => {
    const searchParams = new URLSearchParams(params);
    Object.entries(additionalParams).forEach(([key, value]) => {
      searchParams.set(key, value);
    });
    return searchParams.toString();
  };

  return {
    totalItems: totalCount,
    totalPages,
    currentPage,
    query,
    nextPage: nextCursor ? `${baseURL}/api/db/tables/${tableName}?${serializeParams({ cursor: nextCursor.toString(), limit: limit.toString() })}` : null,
    prevPage: prevCursor ? `${baseURL}/api/db/tables/${tableName}?${serializeParams({ cursor: prevCursor.toString(), limit: limit.toString() })}` : null,
    params,
    unusedParams
  };
}

export default async function getPaginatedData(
  request: NextRequest,
  tableName: string,
  queryParams: URLSearchParams,
  validKeys: string[]
): Promise<{ metadata: any, data: any }> {
  let orderKey = queryParams.get('orderByColumn') || undefined;
  let cursor = parseInt(queryParams.get('cursor') || '0');
  let limit = parseInt(queryParams.get('limit') || '20');

  cursor = isNaN(cursor) || cursor < 0 ? 0 : cursor;
  limit = isNaN(limit) || limit < 1 || limit > 100 ? 20 : limit;

  const { clause: whereClause, params, unusedParams } = buildWhereClause(queryParams, validKeys);

  const orderClause = orderKey ? ` ORDER BY ${orderKey}` : '';
  const limitClause = ` LIMIT ${limit}`;
  const offsetClause = ` OFFSET ${cursor}`;

  const query = `SELECT * FROM ${tableName}${whereClause}${orderClause}${limitClause}${offsetClause};`.trim().replace(/\s+/g, ' ');

  try {
    const result = await sql.query(query);

    const countQuery = `SELECT COUNT(*) FROM ${tableName}${whereClause}`;
    const totalCountRes = await sql.query(countQuery);
    const totalCount = parseInt(totalCountRes.rows[0]?.count || '0', 10);

    const metadata = buildPaginationMetadata(request, tableName, query, totalCount, limit, cursor, params, unusedParams);
    return { metadata, data: result.rows };
  } catch (error) {
    throw { error: (error as Error).message, query };
  }
}
