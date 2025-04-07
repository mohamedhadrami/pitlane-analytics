
import type React from "react";
import Marquee from "react-fast-marquee";
import { Thermometer, Droplets, ThermometerSun, AirVent, Wind, Milestone, MoveUp, CloudRainWind } from "lucide-react";
import { getWindDirection } from "@/utils/telemetry/telemetryUtils";
import { trackImage } from "../../utils/helpers";
import { Divider, Image } from "@heroui/react";
import { useLiveSettings } from "@/context/LiveSettingsContext";
import type { LiveSessionInfo, LiveWeatherData } from "@/types/liveTiming.types";

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
                                    <span>{Number.parseInt(weather.AirTemp).toFixed(2)} °C</span>
                                </div>
                                <Divider orientation="vertical" />
                                <div className="inline-block">
                                    <Droplets className="inline-block h-4" />
                                    <span className={labelClasses}>Humidity</span>
                                    <span>{Number.parseInt(weather?.Humidity).toFixed(2)}%</span>
                                </div>
                                <Divider orientation="vertical" />
                                <div className="inline-block">
                                    <ThermometerSun className="inline-block h-4" />
                                    <span className={labelClasses}>Track Temp</span>
                                    <span>{Number.parseInt(weather?.TrackTemp).toFixed(2)} °C</span>
                                </div>
                                <Divider orientation="vertical" />
                                <div className="inline-block">
                                    <AirVent className="inline-block h-4" />
                                    <span className={labelClasses}>Pressure</span>
                                    <span>{Number.parseInt(weather?.Pressure).toFixed(2)} mbar</span>
                                </div>
                                <Divider orientation="vertical" />
                                <div className="inline-block">
                                    <Wind className="inline-block h-4" />
                                    <span className={labelClasses}>Wind Speed</span>
                                    <span>{Number.parseInt(weather?.WindSpeed).toFixed(2)} m/s</span>
                                </div>
                                <Divider orientation="vertical" />
                                <div className="inline-block">
                                    <Milestone className="inline-block h-4" />
                                    <span className={labelClasses}>Wind Direction</span>
                                    <span>{getWindDirection(Number.parseInt(weather?.WindDirection))}
                                        <MoveUp className="inline-block h-4" style={{
                                            transform: `rotate(${weather?.WindDirection}deg)`,
                                        }} /></span>
                                </div>
                                <Divider orientation="vertical" />
                                <div className="inline-block">
                                    <CloudRainWind className="inline-block h-4" />
                                    <span className={labelClasses}>Rain</span>
                                    <span>{Number.parseInt(weather?.Rainfall)? "Dance and you shall recieved" : "No rain"}</span>
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