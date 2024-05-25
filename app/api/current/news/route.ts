
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {

        const url = 'https://f1-latest-news.p.rapidapi.com/news';
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '443fce2a98msh8cf5831238ce4c4p101ff0jsne341cc22e25a',
                'x-rapidapi-host': 'f1-latest-news.p.rapidapi.com'
            }
        };

        const response = await fetch(url, options);
        const data = await response.json();

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
