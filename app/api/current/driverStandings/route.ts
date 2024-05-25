// yourApiHandler.ts

import { DbDriverStandings, DbDrivers } from '@/interfaces/ergast';
import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const raceId = (await sql.query(`SELECT race_id FROM driver_standings ORDER BY race_id DESC LIMIT 1;`)).rows[0].race_id;

    const driversResult = await sql.query(`SELECT * FROM drivers`);
    const standingsResult = await sql.query(`SELECT * FROM driver_standings WHERE race_id=${raceId}`);

    const drivers = driversResult.rows;
    const standings = standingsResult.rows;

    const standingsWithData = standings.map((standing: DbDriverStandings) => {
      const driver = drivers.find((driver: DbDrivers) => driver.driver_id === standing.driver_id);
      return {
        position: standing.position,
        points: standing.points,
        wins: standing.wins,
        standing,
        driver: {
          full_name: `${driver.forename} ${driver.surname}`,
          ...driver
        }
      };
    });

    const data = {
      standings: standingsWithData,
    };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
