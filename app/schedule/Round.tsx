// components/Round.tsx

import React, { useState, useEffect } from "react";
import { fetchRaceResults } from "../../services/ergastApi";
import { fetchCountryFlagByName } from "../../services/countryApi";
import { MeetingParams } from "../../interfaces/openF1";
import { fetchMeeting } from "../../services/openF1Api";
import { driverImage, trackImage } from "../../utils/helpers";
import { Divider, Spacer } from "@nextui-org/react";
import { Minus } from "lucide-react";

function formatDateRange(startDate: string, endDate: string) {
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "2-digit" };
  const formattedStartDate = new Date(startDate.replace(/-/g, "/")).toLocaleDateString("en-US", options);
  const formattedEndDate = new Date(endDate.replace(/-/g, "/")).toLocaleDateString("en-US", options);
  const startMonthDay = formattedStartDate.substr(0, 3) + " " + formattedStartDate.substr(4);
  const endMonthDay = formattedEndDate.substr(0, 3) + " " + formattedEndDate.substr(4);
  return (startMonthDay + (startMonthDay === endMonthDay ? "" : ` - ${endMonthDay}`));
}


const Round: React.FC<{ raceData: any }> = ({ raceData }) => {
  const [results, setResults] = useState<any>(null);
  const [meeting, setMeeting] = useState<MeetingParams>();
  const [raceDates, setRaceDates] = useState<any>(null);
  const [flagData, setFlagData] = useState<any>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const raceResults = await fetchRaceResults(
          raceData.season,
          raceData.round
        );
        const parsedData = raceResults.MRData.RaceTable.Races[0].Results;
        setResults(parsedData);
      } catch (error) {
        console.error("Error fetching race results", error);
      }
    };

    const raceDate = new Date(raceData.date + " " + raceData.time);
    const currentDate = new Date();

    if (raceDate < currentDate) {
      fetchResults();
    }
  }, [raceData]);

  useEffect(() => {
    const getFlag = async () => {
      try {
        let countryName = raceData.Circuit.Location.country;
        if (countryName === "UK") countryName = "United Kingdom";
        else if (countryName === "China") countryName = "Zhōngguó";
        const flagApiData = await fetchCountryFlagByName(countryName);
        setFlagData(flagApiData);
      } catch (error) {
        console.error("Error fetching race results", error);
      }
    };

    getFlag();
    setRaceDates(formatDateRange(raceData.FirstPractice.date, raceData.date));
  }, [raceData]);

  useEffect(() => {
    const getMeeting = async () => {
      try {
        const params: MeetingParams = {
          meeting_name: raceData.raceName,
        };
        const apiData = await fetchMeeting(params);
        setMeeting(apiData.pop());
      } catch (error) {
        console.error("Error fetching race results", error);
      }
    };

    getMeeting();
  }, [raceData]);

  const handleCardClick = () => {
    console.log(raceData.raceName);
  };

  return (
    <div
      className="bg-zinc-800 lg:w-3xl rounded-lg p-5"
      key={`${raceData.round}-container`}
      onClick={handleCardClick}
    >
      <div className="flex flex-row items-center justify-between">
        <p key={`${raceData.date}`} className="font-extralight">{raceDates}</p>
        <img src={flagData?.png} className="w-12 h-auto rounded" />
      </div>
      <span key={`${raceData.round}-title`} className="flex justify-center">
        <span className="font-extralight">{`Round ${raceData.round}`}</span>
        <Spacer x={1} /><Minus className="font-thin"/><Spacer x={1} />
        <span className="font-light">{raceData.raceName}</span>
      </span>
      <p className="text-center font-small">{meeting?.meeting_official_name}</p>

      <Divider className="my-3" />

      <div className="flex flex-row items-center justify-between">
        <p key={`${raceData.Circuit.Location.locality}`}>
          {`${raceData.Circuit.Location.locality}, ${raceData.Circuit.Location.country}`}
        </p>
        <p>{raceData.Circuit.circuitName}</p>
      </div>
      <div className="flex justify-center">
        <img src={trackImage(raceData.Circuit.Location.locality, raceData.Circuit.Location.country)} />
      </div>

      {results && <ResultsContainer results={results} />}
    </div>
  );
};

export default Round;




const ResultsContainer: React.FC<{ results: any }> = ({ results }) => {
  const driverClasses = "flex flex-col items-center gap-2"
  const driverImageClasses = "rounded-full"

  return (
    <div>
      <Divider className="my-3" />
      <h3 key={`${results.round}-results-title`} className="text-center font-light text-lg m-3">Race Results</h3>
      <div key={`${results.round}-results-container`} className="flex flex-row justify-center gap-5">
        <div className={driverClasses}>
          <img
            src={driverImage(
              results[1].Driver.givenName,
              results[1].Driver.familyName
            )}
            className={driverImageClasses}
          />
          <span key={`${results.round}-2`} className="flex items-center">
            <span className="font-extralight">2</span>
            <Spacer x={2} />
            <Divider orientation="vertical" className="h-5" />
            <Spacer x={2} />
            <span className="font-bold">{results[1].Driver.code}</span>
          </span>
        </div>
        <div className={driverClasses}>
          <img
            src={driverImage(
              results[0].Driver.givenName,
              results[0].Driver.familyName
            )}
            className={`${driverImageClasses} w-32`}
          />
          <span key={`${results.round}-2`} className="flex items-center">
            <span className="font-extralight">1</span>
            <Spacer x={2} />
            <Divider orientation="vertical" className="h-5" />
            <Spacer x={2} />
            <span className="font-bold">{results[0].Driver.code}</span>
          </span>
        </div>
        <div className={driverClasses}>
          <img
            src={driverImage(
              results[2].Driver.givenName,
              results[2].Driver.familyName
            )}
            className={driverImageClasses}
          />
          <span key={`${results.round}-2`} className="flex items-center">
            <span className="font-extralight">2</span>
            <Spacer x={2} />
            <Divider orientation="vertical" className="h-5" />
            <Spacer x={2} />
            <span className="font-bold">{results[2].Driver.code}</span>
          </span>
        </div>
      </div>
    </div>
  );
};