"use client"

import { MeetingParams } from "@/interfaces/openF1";
import { fetchCurrentSeason } from "@/services/ergastApi";
import { fetchMeeting } from "@/services/openF1Api";
import { findNextRace } from "@/utils/helpers";
import { Spacer } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Hourglass, Watch } from "react-loader-spinner";

interface CountdownTimerProps {
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<{ timeRemaining: CountdownTimerProps }> = ({ timeRemaining }) => {

  return (
    <div className="flex justify-end gap-3">
      {timeRemaining.weeks != 0 && (
        <div className="flex flex-col items-center">
          <span>{timeRemaining.weeks}</span>
          <span>{timeRemaining.weeks == 1 ? "Week" : "Weeks"}</span>
        </div>
      )}
      {timeRemaining.days && (
        <div className="flex flex-col items-center">
          <span>{timeRemaining.days}</span>
          <span>{timeRemaining.days == 1 ? "Day" : "Days"}</span>
        </div>
      )}
      {timeRemaining.hours && (
        <div className="flex flex-col items-center">
          <span>{timeRemaining.hours}</span>
          <span>{timeRemaining.hours == 1 ? "Hour" : "Hours"}</span>
        </div>
      )}
      {timeRemaining.minutes && (
        <div className="flex flex-col items-center">
          <span>{timeRemaining.minutes}</span>
          <span>{timeRemaining.minutes == 1 ? "Week" : "Minutes"}</span>
        </div>
      )}
      {timeRemaining.seconds && (
        <div className="flex flex-col items-center">
          <span>{timeRemaining.seconds}</span>
          <span>{timeRemaining.seconds == 1 ? "Second" : "Seconds"}</span>
        </div>
      )}
    </div>
  )
}



const Home: React.FC = () => {
  const [data, setData] = useState<any>();
  const [currentRace, setCurrentRace] = useState<any>();
  const [nextRaceIndex, setNextRaceIndex] = useState<number>(0);
  const [meeting, setMeeting] = useState<MeetingParams | null>(null);
  const [gmtOffset, setGmtOffset] = useState<any>(null);
  const [timeUntilNextRace, setTimeUntilNextRace] = useState<CountdownTimerProps>();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    let timerId: NodeJS.Timeout;

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

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const params: MeetingParams = {
        meeting_name: data?.MRData.RaceTable.Races[nextRaceIndex].raceName
      }
      const apiData = await fetchMeeting(params);
      setGmtOffset(apiData[0].gmtOffset);
      setMeeting(apiData[0]);
    }

    if (nextRaceIndex) {
      if (meeting == null) {
        fetchData();
      }
    }

  }, [data?.MRData.RaceTable.Races, meeting, nextRaceIndex])

  useEffect(() => {
    if (data) {
      const raceIndex = findNextRace(data?.MRData.RaceTable.Races);
      setNextRaceIndex(raceIndex);
      setCurrentRace(data?.MRData.RaceTable.Races[raceIndex])
    }
  }, [currentTime, data]);

  useEffect(() => {
    if (currentRace) {
      // TODO: Use gmt offset
      const raceDate = new Date(currentRace.FirstPractice.date + "T" + currentRace.FirstPractice.time);

      const timeDiff = raceDate.getTime() - currentTime.getTime();
      const weeks = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7));
      const days = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setTimeUntilNextRace({ weeks, days, hours, minutes, seconds });
    }
  }, [currentTime, currentRace])

  return (
    <div className="m-5">
      <h1 className="text-center font-light text-2xl">Welcome to Pitlane Analytics!</h1>
      {timeUntilNextRace && (
        <div className="flex ml-auto font-extralight w-fit">
          <Watch
            visible={true}
            height="50"
            color="#e10600"
            ariaLabel="watch-loading"
            wrapperStyle={{}}
            wrapperClass="items-center"
          />
          <div className="flex flex-col">
            <div className="flex">
              <h2 className="">Time until the</h2>
              <Spacer x={1} />
              <h2 className="font-bold">{meeting?.meeting_name}</h2>
            </div>
            <CountdownTimer timeRemaining={timeUntilNextRace} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
