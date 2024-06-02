import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {

    const searchParams = new URLSearchParams(request.nextUrl.searchParams);
    const meetingKey = searchParams.get('meetingKey');
    let url;

    if (!meetingKey) {
        url = "https://api.formula1.com/v1/event-tracker";
    } else {
        url = `https://api.formula1.com/v1/event-tracker/meeting/${meetingKey}`;
    }

    const headers = {
        apikey: 'qPgPPRJyGCIPxFT3el4MF7thXHyJCzAP',
        locale: 'en'
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
