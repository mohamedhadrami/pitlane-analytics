
import React from "react";
import Marquee from "react-fast-marquee";
import { Thermometer, Droplets, ThermometerSun, AirVent, Wind, Milestone, MoveUp, CloudRainWind } from "lucide-react";
import { MeetingParams, SessionParams, WeatherParams } from "../../interfaces/openF1";
import { getWindDirection } from "../../utils/telemetryUtils";
import { trackImage } from "../../utils/helpers";
import { Divider, Image } from "@nextui-org/react";
import { useLiveSettings } from "@/context/LiveSettingsContext";

const labelClasses = "text-gray-400 mr-3";

const TopBanner: React.FC<{ meeting: MeetingParams, session: SessionParams, weather: WeatherParams }> = ({ meeting, session, weather }) => {
    const { settings } = useLiveSettings();
    const findSetting = (name: string) => settings.find(setting => setting.name === name);
    const isShowSessionInfo = findSetting('Show Session Info')?.value;
    const isShowWeather = findSetting('Show Weather')?.value;

    const trackImageSrc = trackImage(meeting.location, meeting.country_name);

    return (
        <Marquee pauseOnHover={true} loop={0} speed={100}>
            {weather && (
                <div className="flex items-center space-x-4 text-small pl-4 py-1">
                    {isShowSessionInfo && (
                        <>
                            <Image src={trackImageSrc} radius="none" className="h-7 inline-block" alt="track image" />
                            <div className="inline-block">{session?.session_name}</div>
                            <div className="inline-block font-extralight">{meeting?.meeting_official_name}</div>
                            <div className="inline-block font-extralight">{meeting?.location}, {meeting?.country_name}</div>
                            <Image src={trackImageSrc} radius="none" className="h-7 inline-block" alt="track image" />
                        </>
                    )
                    }
                    {isShowWeather && (
                        <>
                            <h4 className="inline-block">Weather</h4>
                            <div className="flex space-x-4 font-extralight h-5">
                                <div className="inline-block">
                                    <Thermometer className="inline-block h-4" />
                                    <span className={labelClasses}>Temperature</span>
                                    <span>{weather?.air_temperature?.toFixed(2)} °C</span>
                                </div>
                                <Divider orientation="vertical" />
                                <div className="inline-block">
                                    <Droplets className="inline-block h-4" />
                                    <span className={labelClasses}>Humidity</span>
                                    <span>{weather?.humidity?.toFixed(2)}%</span>
                                </div>
                                <Divider orientation="vertical" />
                                <div className="inline-block">
                                    <ThermometerSun className="inline-block h-4" />
                                    <span className={labelClasses}>Track Temp</span>
                                    <span>{weather?.track_temperature?.toFixed(2)} °C</span>
                                </div>
                                <Divider orientation="vertical" />
                                <div className="inline-block">
                                    <AirVent className="inline-block h-4" />
                                    <span className={labelClasses}>Pressure</span>
                                    <span>{weather?.pressure?.toFixed(2)} mbar</span>
                                </div>
                                <Divider orientation="vertical" />
                                <div className="inline-block">
                                    <Wind className="inline-block h-4" />
                                    <span className={labelClasses}>Wind Speed</span>
                                    <span>{weather?.wind_speed?.toFixed(2)} m/s</span>
                                </div>
                                <Divider orientation="vertical" />
                                <div className="inline-block">
                                    <Milestone className="inline-block h-4" />
                                    <span className={labelClasses}>Wind Direction</span>
                                    <span>{getWindDirection(weather?.wind_direction)}
                                        <MoveUp className="inline-block h-4" style={{
                                            transform: `rotate(${weather?.wind_direction}deg)`,
                                        }} /></span>
                                </div>
                                <Divider orientation="vertical" />
                                <div className="inline-block">
                                    <CloudRainWind className="inline-block h-4" />
                                    <span className={labelClasses}>Rain</span>
                                    <span>{weather?.rainfall ? "Dance and you shall recieved" : "No rain"}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </Marquee>
    );
};

export default TopBanner;