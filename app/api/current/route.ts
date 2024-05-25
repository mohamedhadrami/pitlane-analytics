import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const hostname = request.nextUrl.hostname;
    const port = request.nextUrl.port || (request.nextUrl.protocol === 'https:' ? '443' : '80');
    const baseURL = `${request.nextUrl.protocol}//${hostname}${port ? `:${port}` : ''}`;

    const data = {
        season: new Date().getFullYear(),
        routes: {
            season: `${baseURL}/api/current/season`,
            races: `${baseURL}/api/current/races`,
            driverStandings: `${baseURL}/api/current/driverStandings`
        }
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
