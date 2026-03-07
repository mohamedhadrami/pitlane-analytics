
import type React from "react";
import Marquee from "react-fast-marquee";
import { Thermometer, Droplets, ThermometerSun, AirVent, Wind, Milestone, MoveUp, CloudRainWind } from "lucide-react";
<<<<<<< HEAD
import { getWindDirection } from "../../utils/telemetryUtils";
=======
import { getWindDirection } from "@/utils/telemetry/telemetryUtils";
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
import { trackImage } from "../../utils/helpers";
import { Divider, Image } from "@heroui/react";
import { useLiveSettings } from "@/context/LiveSettingsContext";
<<<<<<< HEAD
import { LiveSessionInfo, LiveWeatherData } from "@/interfaces/liveTiming.type";
=======
import type { LiveSessionInfo, LiveWeatherData } from "@/types/liveTiming.types";
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c

const labelClasses = "text-gray-400 mr-3";

const TopBanner: React.FC<{ session: LiveSessionInfo, weather: LiveWeatherData }> = ({ session, weather }) => {
    const { settings } = useLiveSettings();
    const findSetting = (name: string) => settings.find(setting => setting.name === name);
    const isShowSessionInfo = findSetting('Show Session Info')?.value;
    const isShowWeather = findSetting('Show Weather')?.value;

    const trackImageSrc = trackImage(session.Meeting.Location, session.Meeting.Country.Name);

    return (
        <Marquee pauseOnHover={true} loop={0} speed={75} className="z-50">
            {weather && (
                <div className="flex items-center space-x-4 text-small pl-4 py-1">
                    {isShowSessionInfo && (
                        <>
                            <Image src={trackImageSrc} radius="none" className="h-7 inline-block" alt="track image" />
                            <div className="inline-block">{session?.Name}</div>
                            <div className="inline-block font-extralight">{session?.Meeting.OfficialName}</div>
                            <div className="inline-block font-extralight">{session?.Meeting.Location}, {session?.Meeting.Country.Name}</div>
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
<<<<<<< HEAD
                                    <span>{parseInt(weather.AirTemp).toFixed(2)} °C</span>
=======
                                    <span>{Number.parseInt(weather.AirTemp).toFixed(2)} °C</span>
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
                                </div>
                                <Divider orientation="vertical" />
                                <div className="inline-block">
                                    <Droplets className="inline-block h-4" />
                                    <span className={labelClasses}>Humidity</span>
<<<<<<< HEAD
                                    <span>{parseInt(weather?.Humidity).toFixed(2)}%</span>
=======
                                    <span>{Number.parseInt(weather?.Humidity).toFixed(2)}%</span>
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
                                </div>
                                <Divider orientation="vertical" />
                                <div className="inline-block">
                                    <ThermometerSun className="inline-block h-4" />
                                    <span className={labelClasses}>Track Temp</span>
<<<<<<< HEAD
                                    <span>{parseInt(weather?.TrackTemp).toFixed(2)} °C</span>
=======
                                    <span>{Number.parseInt(weather?.TrackTemp).toFixed(2)} °C</span>
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
                                </div>
                                <Divider orientation="vertical" />
                                <div className="inline-block">
                                    <AirVent className="inline-block h-4" />
                                    <span className={labelClasses}>Pressure</span>
<<<<<<< HEAD
                                    <span>{parseInt(weather?.Pressure).toFixed(2)} mbar</span>
=======
                                    <span>{Number.parseInt(weather?.Pressure).toFixed(2)} mbar</span>
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
                                </div>
                                <Divider orientation="vertical" />
                                <div className="inline-block">
                                    <Wind className="inline-block h-4" />
                                    <span className={labelClasses}>Wind Speed</span>
<<<<<<< HEAD
                                    <span>{parseInt(weather?.WindSpeed).toFixed(2)} m/s</span>
=======
                                    <span>{Number.parseInt(weather?.WindSpeed).toFixed(2)} m/s</span>
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
                                </div>
                                <Divider orientation="vertical" />
                                <div className="inline-block">
                                    <Milestone className="inline-block h-4" />
                                    <span className={labelClasses}>Wind Direction</span>
<<<<<<< HEAD
                                    <span>{getWindDirection(parseInt(weather?.WindDirection))}
=======
                                    <span>{getWindDirection(Number.parseInt(weather?.WindDirection))}
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
                                        <MoveUp className="inline-block h-4" style={{
                                            transform: `rotate(${weather?.WindDirection}deg)`,
                                        }} /></span>
                                </div>
                                <Divider orientation="vertical" />
                                <div className="inline-block">
                                    <CloudRainWind className="inline-block h-4" />
                                    <span className={labelClasses}>Rain</span>
<<<<<<< HEAD
                                    <span>{parseInt(weather?.Rainfall)? "Dance and you shall recieved" : "No rain"}</span>
=======
                                    <span>{Number.parseInt(weather?.Rainfall)? "Dance and you shall recieved" : "No rain"}</span>
>>>>>>> a228fa74733b8a69d6e4daf52175562fcf0c156c
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