
"use client"

import { MeetingParams } from "@/interfaces/openF1";
import { fetchCurrentSeason } from "@/services/ergastApi";
import { fetchMeeting } from "@/services/openF1Api";
import { findNextRace } from "@/utils/helpers";
import { Spacer } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Watch } from "react-loader-spinner";
import Link from 'next/link';

interface CountdownTimerProps {
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<{ timeRemaining: CountdownTimerProps }> = ({ timeRemaining }) => {
  return (
    <div className="flex justify-center gap-3 text-center">
      {timeRemaining.weeks > 0 && (
        <div className="flex flex-col items-center">
          <span>{timeRemaining.weeks}</span>
          <span>{timeRemaining.weeks === 1 ? "Week" : "Weeks"}</span>
        </div>
      )}
      {timeRemaining.days > 0 && (
        <div className="flex flex-col items-center">
          <span>{timeRemaining.days}</span>
          <span>{timeRemaining.days === 1 ? "Day" : "Days"}</span>
        </div>
      )}
      {timeRemaining.hours > 0 && (
        <div className="flex flex-col items-center">
          <span>{timeRemaining.hours}</span>
          <span>{timeRemaining.hours === 1 ? "Hour" : "Hours"}</span>
        </div>
      )}
      {timeRemaining.minutes > 0 && (
        <div className="flex flex-col items-center">
          <span>{timeRemaining.minutes}</span>
          <span>{timeRemaining.minutes === 1 ? "Minute" : "Minutes"}</span>
        </div>
      )}
      {timeRemaining.seconds > 0 && (
        <div className="flex flex-col items-center">
          <span>{timeRemaining.seconds}</span>
          <span>{timeRemaining.seconds === 1 ? "Second" : "Seconds"}</span>
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

    if (nextRaceIndex !== 0 && meeting == null) {
      fetchData();
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
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-center text-4xl font-light mb-10">Welcome to Pitlane Analytics!</h1>
      {timeUntilNextRace && (
        <div className="flex justify-center items-center mb-10">
          <div className="p-5 rounded shadow-lg">
            <div className="flex items-center mb-4">
              <Watch
                visible={true}
                height="50"
                color="#e10600"
                ariaLabel="watch-loading"
              />
              <div className="ml-5">
                <h2 className="text-2xl">Time until the</h2>
                <h2 className="text-2xl font-bold">{meeting?.meeting_name}</h2>
                <CountdownTimer timeRemaining={timeUntilNextRace} />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        <div className="p-5 border rounded shadow-lg hover:shadow-2xl transition-shadow">
          <Link href="/analytics">
            
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p>Explore in-depth race analytics and data.</p>
            
          </Link>
        </div>
        <div className="p-5 border rounded shadow-lg hover:shadow-2xl transition-shadow">
          <Link href="/schedule">
            
              <h3 className="text-xl font-semibold mb-2">Schedule</h3>
              <p>Check the full race schedule and upcoming events.</p>
            
          </Link>
        </div>
        <div className="p-5 border rounded shadow-lg hover:shadow-2xl transition-shadow">
          <Link href="/championship">
          
              <h3 className="text-xl font-semibold mb-2">Championship</h3>
              <p>View the latest standings in the championship.</p>
          
          </Link>
        </div>
      </div>
      <div className="p-5 border rounded shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Latest News</h2>
        <div>
          {/* Integrate news fetching logic here */}
          <p>No news available at the moment.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
