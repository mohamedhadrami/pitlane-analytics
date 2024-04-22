// app/schedule

"use client"

import CurrentRound from "@/components/Schedule/CurrentRound";
import Round from "@/components/Schedule/Round";
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
                setNextRaceIndex(i); // Set the index of the next race
                break;
            }
        }
    };

    return (
        <>
            <h1 key="schedule-title">Schedule</h1>
            {data ? (
                <div className="" key="schedule-container">
                    {data?.MRData.RaceTable.Races.map((round: any, index: number) => (
                        // Render the CurrentRound component if it's the next race, otherwise render the Round component
                        nextRaceIndex === index ? (
                            <CurrentRound raceData={round} key={`race-comp-${round.round}`} />
                        ) : (
                            <Round raceData={round} key={`race-comp-${round.round}`} />
                        )
                    ))}
                </div>
            ) : (
                <Loading />
            )}
        </>
    )
}

export default Page;
