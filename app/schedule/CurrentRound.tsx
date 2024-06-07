import { useEffect, useState } from "react";
import { MeetingParams } from "../../interfaces/openF1";
import { fetchCountryFlagByName } from "../../services/countryApi";
import { fetchRaceResults } from "../../services/ergastApi";
import { fetchMeeting } from "../../services/openF1Api";
import { trackDetailedImage, trackImage } from "../../utils/helpers";
import { Chip, Divider, Image, Spacer } from "@nextui-org/react";
import { Minus } from "lucide-react";

function formatDateRange(startDate: string, endDate: string) {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "2-digit" };
    const formattedStartDate = new Date(startDate.replace(/-/g, "/")).toLocaleDateString("en-US", options);
    const formattedEndDate = new Date(endDate.replace(/-/g, "/")).toLocaleDateString("en-US", options);
    const startMonthDay = formattedStartDate.substr(0, 3) + " " + formattedStartDate.substr(4);
    const endMonthDay = formattedEndDate.substr(0, 3) + " " + formattedEndDate.substr(4);
    return (startMonthDay + (startMonthDay === endMonthDay ? "" : ` - ${endMonthDay}`));
}

function formatSessionTimeDetails(startTime: string, endTime: string, gmtOffset: string) {
    // Parse the GMT time
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    // Apply the GMT offset
    const offsetSign = gmtOffset[0];
    const offsetHours = parseInt(gmtOffset.slice(1, 3), 10);
    const offsetMinutes = parseInt(gmtOffset.slice(4, 6), 10);
    const offsetMilliseconds = (offsetHours * 60 + offsetMinutes) * 60 * 1000;
    const adjustedStartTime = new Date(startDate.getTime() + (offsetSign === '+' ? -offsetMilliseconds : offsetMilliseconds));
    const adjustedEndTime = new Date(endDate.getTime() + (offsetSign === '+' ? -offsetMilliseconds : offsetMilliseconds));

    // Format the adjusted time
    const formattedDate = adjustedStartTime.toLocaleDateString('en-US');
    const dayOfWeek = adjustedStartTime.toLocaleDateString('en-US', { weekday: 'long' }).slice(0, 3).toUpperCase();
    const formattedStartTimeWithOffset = adjustedStartTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const formattedEndTimeWithOffset = adjustedEndTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Get the time in the local timezone
    const localStartTime = new Date(startTime);
    const localEndTime = new Date(endTime);
    const formattedStartTimeInLocal = localStartTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const formattedEndTimeInLocal = localEndTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    return {
        formattedDate,
        dayOfWeek,
        formattedStartTimeWithOffset,
        formattedEndTimeWithOffset,
        formattedStartTimeInLocal,
        formattedEndTimeInLocal
    };
}

const CurrentRound: React.FC<{ raceData: any, meetings: MeetingParams[] }> = ({ raceData, meetings }) => {
    const [results, setResults] = useState<any>(null);
    const [meeting, setMeeting] = useState<MeetingParams>();
    const [raceDates, setRaceDates] = useState<string | null>(null);
    const [eventTracker, setEventTracker] = useState<any>();
    const [flagData, setFlagData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const eventTrackData = await fetch('/api/formula1/event-tracker');
            const eventTrackJson = await eventTrackData.json();
            setEventTracker(eventTrackJson);
            console.log(eventTrackJson)
        }
        fetchData();
    }, []);

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
        const currentMeeting = meetings.find(v => v.meeting_name === raceData.raceName);
        setMeeting(currentMeeting);
    }, [raceData, meetings]);

    const handleCardClick = () => {
        console.log(raceData.raceName);
    };

    return (
        <div
            className="bg-gradient-to-t from-zinc-700 to-[#222]
                        p-5 w-full
                        border-r-1 border-l-1"
            key={`${raceData.round}-container`}
            onClick={handleCardClick}
        >
            {raceData && eventTracker && (
                <>
                    <div className="flex flex-row items-center justify-between">
                        <p key={`${raceData.date}`} className="font-extralight">{raceDates}</p>
                        <Image src={flagData?.png} className="w-12 h-auto rounded" alt="flag image" />
                    </div>
                    <span key={`${raceData.round}-title`} className="flex justify-center">
                        <span className="font-extralight">{`Round ${raceData.round}`}</span>
                        <Spacer x={1} /><Minus className="font-thin" /><Spacer x={1} />
                        <span className="font-light">{raceData.raceName}</span>
                    </span>
                    <p className="text-center font-small">{eventTracker.race.meetingOfficialName}</p>

                    <Divider className="my-3" />

                    <div className="flex flex-row">
                        <div className="w-1/4">
                            {eventTracker.seasonContext.timetables.map((session: any) => {
                                const formattedTime = formatSessionTimeDetails(session.startTime, session.endTime, session.gmtOffset)
                                return (
                                    <div className="flex flex-row justify-evenly my-2" key={session.session}>
                                        <span>{session.description.toString().toUpperCase()}</span>
                                        <span className="font-thin">{formattedTime.dayOfWeek}</span>
                                        <Chip>{formattedTime.formattedStartTimeInLocal}-{formattedTime.formattedEndTimeInLocal}</Chip>
                                    </div>
                                )
                            })}
                        </div>
                        <Divider orientation="vertical" className="mx-1 h-50" />
                        <div className="mx-auto">
                            <div className="flex flex-row items-center justify-between">
                                <p key={`${raceData.Circuit.Location.locality}`}>
                                    {`${raceData.Circuit.Location.locality}, ${raceData.Circuit.Location.country}`}
                                </p>
                                <p>{raceData.Circuit.circuitName}</p>
                            </div>
                            <div className="flex justify-center">
                                <Image src={trackDetailedImage(raceData.Circuit.Location.locality, raceData.Circuit.Location.country)} alt="track image" />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>


    );
};

export default CurrentRound;
