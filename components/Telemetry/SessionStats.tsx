// components/Telemetry/SessionStats.tsx

import {
  faThermometer,
  faTint,
  faWater,
  faWind,
  faCompass,
  faArrowUp,
  faCloudRain,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../../styles/telemetry/session.module.css";
import { useEffect, useState } from "react";
import { calculateWeatherStats } from "../../utils/telemetryUtils";
import { MeetingParams, SessionParams } from "../../interfaces/openF1";
import { parseISODateAndTime, trackImage } from "../../utils/helpers";

interface SessionStatsProps {
  meeting: MeetingParams;
  sessionData: {
    session: SessionParams;
    pit: any[];
    position: any[];
    raceControl: any[];
    teamRadio: any[];
    weather: any[];
  };
}

const SessionStats: React.FC<SessionStatsProps> = ({
  sessionData,
  meeting,
}) => {
  const [weatherAvg, setWeatherAvg] = useState<any>(null);

  useEffect(() => {
    setWeatherAvg(calculateWeatherStats(sessionData.weather));
  }, [sessionData]);

  return (
    <>
      <h3>Session Stats</h3>
      <div className={styles.wrapper}>
        <div className={`${styles.meetingContainer} ${styles.statsContainer}`}>
          <h4>Circuit</h4>
          <p>
            {meeting.location}, {meeting.country_name}
          </p>
          <img src={trackImage(meeting.location, meeting.country_name)} />
        </div>

        <div className={`${styles.sessionContainer} ${styles.statsContainer}`}>
          <h4>Session</h4>
          <p>{sessionData.session.session_name}</p>
          <p>
            Start:{" "}
            {parseISODateAndTime(
              sessionData.session.date_start,
              sessionData.session.gmt_offset
            )}
          </p>
          <p>
            End:{" "}
            {parseISODateAndTime(
              sessionData.session.date_end,
              sessionData.session.gmt_offset
            )}
          </p>
        </div>

        <div className={styles.statsContainer}>
          <h4>Weather</h4>
          <div className={styles.weatherContent}>
            <div className={styles.weatherLabels}>
              Temperature <FontAwesomeIcon icon={faThermometer} /> <br />
              Humidity <FontAwesomeIcon icon={faTint} /> <br />
              Track Temp <FontAwesomeIcon icon={faThermometer} /> <br />
              Pressure <FontAwesomeIcon icon={faWater} /> <br />
              Wind Speed <FontAwesomeIcon icon={faWind} /> <br />
              Wind Direction <FontAwesomeIcon icon={faCompass} /> <br />
              Rain <FontAwesomeIcon icon={faCloudRain} />
            </div>
            <div className={styles.weatherStats}>
              {weatherAvg?.airTemperatureAvg.toFixed(2)} °C <br />
              {weatherAvg?.humidityAvg.toFixed(2)}% <br />
              {weatherAvg?.trackTempAvg.toFixed(2)} °C <br />
              {weatherAvg?.pressureAvg.toFixed(2)} mbar <br />
              {weatherAvg?.windSpeedAvg.toFixed(2)} m/s <br />
              <span style={{ display: "inline-block" }}>
                <FontAwesomeIcon
                  icon={faArrowUp}
                  style={{
                    transform: `rotate(${weatherAvg?.windDirectionAvg}deg)`,
                  }}
                />
              </span>{" "}
              <br />
              {weatherAvg?.rainAvg ? "It rained" : "No rain"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SessionStats;
