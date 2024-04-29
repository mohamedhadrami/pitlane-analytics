// app/schedule

"use client"

import CurrentRound from "@/app/schedule/CurrentRound";
import Round from "@/app/schedule/Round";
import { fetchCurrentSeason } from "@/services/ergastApi";
import { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import { MeetingParams } from "@/interfaces/openF1";
import { fetchMeeting } from "@/services/openF1Api";
import { findNextRace } from "@/utils/helpers";

const Page: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [meetings, setMeeting] = useState<MeetingParams[]>([]);
    const [nextRaceIndex, setNextRaceIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchDataFromApi = async () => {
            try {
                const apiData = await fetchCurrentSeason();
                setData(apiData);
                const raceIndex = findNextRace(apiData.MRData.RaceTable.Races);
                setNextRaceIndex(raceIndex);
                const params: MeetingParams = {
                    year: 2024
                }
                const meetingsData = await fetchMeeting(params);
                setMeeting(meetingsData);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchDataFromApi();
    }, []);

    return (
        <>
            <h1 key="schedule-title" className="text-3xl font-light p-5 text-center">Schedule</h1>
            <div className="flex justify-center">
                <div className="">
                    {data ? (
                        <div className="max-w-screen-xl my-5 flex flex-wrap justify-evenly gap-3 px-15 pb-30">
                            {data?.MRData.RaceTable.Races.map((round: any, index: number) => (
                                nextRaceIndex === index ? (
                                    <CurrentRound
                                        key={`race-comp-${round.round}`}
                                        raceData={round}
                                        meetings={meetings}
                                    />
                                ) : (
                                    <Round
                                        raceData={round}
                                        key={`race-comp-${round.round}`}
                                        meetings={meetings}
                                    />
                                )
                            ))}
                        </div>
                    ) : (
                        <Loading />
                    )}
                </div>
            </div>
        </>

    );

}

export default Page;
