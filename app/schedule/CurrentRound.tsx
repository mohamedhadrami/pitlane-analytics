import { useEffect, useState } from "react";
import { MeetingParams } from "../../interfaces/openF1";
import { fetchCountryFlagByName } from "../../services/countryApi";
import { fetchRaceResults } from "../../services/ergastApi";
import { fetchMeeting } from "../../services/openF1Api";
import { trackImage } from "../../utils/helpers";
import { Divider, Image, Spacer } from "@nextui-org/react";
import { Minus } from "lucide-react";

function formatDateRange(startDate: string, endDate: string) {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "2-digit" };
    const formattedStartDate = new Date(startDate.replace(/-/g, "/")).toLocaleDateString("en-US", options);
    const formattedEndDate = new Date(endDate.replace(/-/g, "/")).toLocaleDateString("en-US", options);
    const startMonthDay = formattedStartDate.substr(0, 3) + " " + formattedStartDate.substr(4);
    const endMonthDay = formattedEndDate.substr(0, 3) + " " + formattedEndDate.substr(4);
    return (startMonthDay + (startMonthDay === endMonthDay ? "" : ` - ${endMonthDay}`));
}

function formatSessionDateAndTime(timeObject: any) {
    return `${timeObject.date} at ${timeObject.time}`
}

const CurrentRound: React.FC<{ raceData: any, meetings: MeetingParams[] }> = ({ raceData, meetings }) => {
    const [results, setResults] = useState<any>(null);
    const [meeting, setMeeting] = useState<MeetingParams>();
    const [raceDates, setRaceDates] = useState<any>(null);
    const [flagData, setFlagData] = useState<any>(null);

    const [firstPracticeDate, setFirstPracticeDate] = useState<any>();
    const [secondPracticeDate, setSecondPracticeDate] = useState<any>();
    const [thirdPracticeDate, setThirdPracticeDate] = useState<any>();
    const [qualifyingDate, setQualifyingDate] = useState<any>();
    const [raceDate, setRaceDate] = useState<any>();
    const [sprintShootoutDate, setSprintShootoutDate] = useState<any>();
    const [sprintDate, setSprintDate] = useState<any>();


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
        if (raceData.FirstPractice) setFirstPracticeDate(raceData.FirstPractice);
        if (raceData.SecondPractice) setSecondPracticeDate(raceData.SecondPractice);
        if (raceData.ThirdPractice) setThirdPracticeDate(raceData.ThirdPractice);
        if (raceData.Qualifying) setQualifyingDate(raceData.Qualifying);
        if (raceData) setRaceDate({"date": raceData.date, "time": raceData.time});
        if (raceData.Sprint) {
            setSecondPracticeDate(null)
            setSprintShootoutDate(raceData.SecondPractice);
            setSprintDate(raceData.Sprint);
        }

        getFlag();
        setRaceDates(formatDateRange(raceData.FirstPractice.date, raceData.date));
    }, [raceData]);

    useEffect(() => {
        const currentMeeting = meetings.find(v => v.meeting_name === raceData.raceName);
        setMeeting(currentMeeting);
    }, [raceData, meetings]);

    const handleCardClick = () => {
        console.log(raceData.raceName);
    };

    return (
        <div
            className="bg-zinc-800 p-5 w-full"
            key={`${raceData.round}-container`}
            onClick={handleCardClick}
        >
            <div className="flex flex-row items-center justify-between">
                <p key={`${raceData.date}`} className="font-extralight">{raceDates}</p>
                <Image src={flagData?.png} className="w-12 h-auto rounded" alt="flag image" />
            </div>
            <span key={`${raceData.round}-title`} className="flex justify-center">
                <span className="font-extralight">{`Round ${raceData.round}`}</span>
                <Spacer x={1} /><Minus className="font-thin" /><Spacer x={1} />
                <span className="font-light">{raceData.raceName}</span>
            </span>
            <p className="text-center font-small">{meeting?.meeting_official_name}</p>

            <Divider className="my-3" />

            <div className="flex flex-row">
                <div className="">
                {firstPracticeDate != null && (<div className="flex flex-row justify-evenly">
                        <span>First Practice</span><Spacer x={1} /><Minus className="font-thin" /><Spacer x={1} />
                        <span>{formatSessionDateAndTime(firstPracticeDate)}</span>
                    </div>)}
                    {secondPracticeDate != null && (<div className="flex flex-row justify-evenly">
                        <span>Second Practice</span><Spacer x={1} /><Minus className="font-thin" /><Spacer x={1} />
                        <span>{formatSessionDateAndTime(secondPracticeDate)}</span>
                    </div>)}
                    {thirdPracticeDate != null && (<div className="flex flex-row justify-evenly">
                        <span>Third Practice</span><Spacer x={1} /><Minus className="font-thin" /><Spacer x={1} />
                        <span>{formatSessionDateAndTime(thirdPracticeDate)}</span>
                    </div>)}
                    {qualifyingDate != null && (<div className="flex flex-row justify-evenly">
                        <span>Third Practice</span><Spacer x={1} /><Minus className="font-thin" /><Spacer x={1} />
                        <span>{formatSessionDateAndTime(qualifyingDate)}</span>
                    </div>)}
                    {sprintShootoutDate != null && (<div className="flex flex-row justify-evenly">
                        <span>Sprint Shootout</span><Spacer x={1} /><Minus className="font-thin" /><Spacer x={1} />
                        <span>{formatSessionDateAndTime(sprintShootoutDate)}</span>
                    </div>)}
                    {sprintDate != null && (<div className="flex flex-row justify-evenly">
                        <span>Sprint</span><Spacer x={1} /><Minus className="font-thin" /><Spacer x={1} />
                        <span>{formatSessionDateAndTime(sprintDate)}</span>
                    </div>)}
                    {raceDate != null && (<div className="flex flex-row justify-evenly">
                        <span>Race</span><Spacer x={1} /><Minus className="font-thin" /><Spacer x={1} />
                        <span>{formatSessionDateAndTime(raceDate)}</span>
                    </div>)}
                </div>
                <Divider orientation="vertical" className="mx-1 h-50" />
                <div className="border-white border-1">
                    <div className="flex flex-row items-center justify-between">
                        <p key={`${raceData.Circuit.Location.locality}`}>
                            {`${raceData.Circuit.Location.locality}, ${raceData.Circuit.Location.country}`}
                        </p>
                        <p>{raceData.Circuit.circuitName}</p>
                    </div>
                    <div className="flex justify-center">
                        <Image src={trackImage(raceData.Circuit.Location.locality, raceData.Circuit.Location.country)} alt="track image" />
                    </div>
                </div>
            </div>
        </div>
    );
};


export default CurrentRound;