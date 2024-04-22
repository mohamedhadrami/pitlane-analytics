// components/Round.tsx

import React, { useState, useEffect } from "react";
import { fetchRaceResults } from "../../services/ergastApi";
import { fetchCountryFlagByName } from "../../services/countryApi";
import { MeetingParams } from "../../interfaces/openF1";
import { fetchMeeting } from "../../services/openF1Api";
import { driverImage, trackImage } from "../../utils/helpers";

function formatDateRange(startDate: string, endDate: string) {
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "2-digit" };
  const formattedStartDate = new Date(startDate.replace(/-/g, "/")).toLocaleDateString("en-US", options);
  const formattedEndDate = new Date(endDate.replace(/-/g, "/")).toLocaleDateString("en-US", options);
  const startMonthDay = formattedStartDate.substr(0, 3) + " " + formattedStartDate.substr(4);
  const endMonthDay = formattedEndDate.substr(0, 3) + " " + formattedEndDate.substr(4);
  return (startMonthDay + (startMonthDay === endMonthDay ? "" : ` - ${endMonthDay}`));
}

const ResultsContainer: React.FC<{ results: any }> = ({ results }) => {
  return (
    <>
      <h3 key={`${results.round}-results-title`}>Race Results</h3>
      <div
        key={`${results.round}-results-container`}
      //className={styles.resultsContainer}
      >
        <div>
          <img
            src={driverImage(
              results[1].Driver.givenName,
              results[1].Driver.familyName
            )}
            //className={styles.driverImage}
          />
          <p key={`${results.round}-2`}>2. {results[1].Driver.code}</p>
        </div>
        <div>
          <img
            src={driverImage(
              results[0].Driver.givenName,
              results[0].Driver.familyName
            )}
            style={{ width: '125px', height: '125px' }}
          //className={styles.driverImage}
          />
          <p key={`${results.round}-1`}>1. {results[0].Driver.code}</p>
        </div>
        <div>
          <img
            src={driverImage(
              results[2].Driver.givenName,
              results[2].Driver.familyName
            )}
          //className={styles.driverImage}
          />
          <p key={`${results.round}-3`}>3. {results[2].Driver.code}</p>
        </div>
      </div>
    </>
  );
};

const Round: React.FC<{ raceData: any }> = ({ raceData }) => {
  const [results, setResults] = useState<any>(null);
  const [meeting, setMeeting] = useState<MeetingParams>(null);
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
      //className={styles.roundCard}
      key={`${raceData.round}-container`}
      onClick={handleCardClick}
    >
      <div
      //className={styles.topRow}
      >
        <p key={`${raceData.date}`}>{raceDates}</p>
        <img src={flagData?.png} style={{ width: "50px", height: "auto", borderRadius: "4px" }} />
      </div>

      <h2
        key={`${raceData.round}-title`}
      >{`Round ${raceData.round} - ${raceData.raceName}`}</h2>

      <p style={{ textAlign: "center" }}>{meeting?.meeting_official_name}</p>
      <div
      //className={styles.topRow}
      >
        <p key={`${raceData.Circuit.Location.locality}`}>
          {`${raceData.Circuit.Location.locality}, ${raceData.Circuit.Location.country}`}
        </p>
        <p>{raceData.Circuit.circuitName}</p>
      </div>
      <img src={trackImage(raceData.Circuit.Location.locality, raceData.Circuit.Location.country)} className=""/*{styles.trackImage}*/ />

      {results && <ResultsContainer results={results} />}
    </div>
  );
};

export default Round;
