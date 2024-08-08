import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = new URLSearchParams(request.nextUrl.searchParams);
  const url = searchParams.get('url');

  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    const data = await response.json();
    console.log(url)
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
