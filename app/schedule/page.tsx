// app/schedule

"use client"

import CurrentRound from "@/app/schedule/CurrentRound";
import Round from "@/app/schedule/Round";
import { fetchCurrentSeason } from "@/services/ergastApi";
import { useState, useEffect } from "react";
import Loading from "../../components/Loading";

const Page: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [nextRaceIndex, setNextRaceIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchDataFromApi = async () => {
            try {
                const apiData = await fetchCurrentSeason();
                setData(apiData);
                findNextRace(apiData.MRData.RaceTable.Races);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchDataFromApi();
    }, []);

    const findNextRace = (races: any[]) => {
        const currentDate = new Date();
        for (let i = 0; i < races.length; i++) {
            const raceDate = new Date(races[i].date + " " + races[i].time);
            if (raceDate > currentDate) {
                setNextRaceIndex(i);
                break;
            }
        }
    };

    return (
        <>
            <h1 key="schedule-title" className="text-3xl font-light p-5 text-center">Schedule</h1>
            <div className="flex justify-center">
                <div className="grid gap-5 md:grid-cols-2 max-w-screen-xl place-content-center p-7" key="schedule-container">
                    {data ? (
                        data?.MRData.RaceTable.Races.map((round: any, index: number) => (
                            nextRaceIndex === index ? (
                                <CurrentRound raceData={round} key={`race-comp-${round.round}`} />
                            ) : (
                                <Round raceData={round} key={`race-comp-${round.round}`} />
                            )
                        ))
                    ) : (
                        <Loading />
                    )}
                </div>
            </div>
        </>
    );

}

export default Page;
