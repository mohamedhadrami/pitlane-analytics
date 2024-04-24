import { useEffect, useState } from "react";
import { MeetingParams } from "../../interfaces/openF1";
import { fetchCountryFlagByName } from "../../services/countryApi";
import { fetchRaceResults } from "../../services/ergastApi";
import { fetchMeeting } from "../../services/openF1Api";
import { trackImage } from "../../utils/helpers";

function formatDateRange(startDate: string, endDate: string) {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "2-digit" };
    const formattedStartDate = new Date(startDate.replace(/-/g, "/")).toLocaleDateString("en-US", options);
    const formattedEndDate = new Date(endDate.replace(/-/g, "/")).toLocaleDateString("en-US", options);
    const startMonthDay = formattedStartDate.substr(0, 3) + " " + formattedStartDate.substr(4);
    const endMonthDay = formattedEndDate.substr(0, 3) + " " + formattedEndDate.substr(4);
    return (startMonthDay + (startMonthDay === endMonthDay ? "" : ` - ${endMonthDay}`));
}

const CurrentRound: React.FC<{ raceData: any }> = ({ raceData }) => {
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
            className="w-full"
            key={`${raceData.round}-container`}
            onClick={handleCardClick}
        >
            <div
            //className={styles.topRow}
            >
                <p key={`${raceData.date}`}>{raceDates}</p>
                <h2 key={`${raceData.round}-title`}>
                    {`Round ${raceData.round} - ${raceData.raceName}`}
                </h2>
                <img src={flagData?.png} style={{ width: "50px", height: "auto", borderRadius: "4px" }} />
            </div>

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
        </div>
    );
};


export default CurrentRound;