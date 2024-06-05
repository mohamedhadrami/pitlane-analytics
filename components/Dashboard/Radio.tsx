// @/components/Dashboard/Radio.tsx

// Based on Radio component in tdjsnelling's monaco


import { TeamRadioParams } from "@/interfaces/openF1";
import { useState, useRef, useEffect } from "react";

const pad = (n: number, l: number) => {
    let str = `${n}`;
    while (str.length < l) str = `0${str}`;
    return str;
};

const secondsToMinutes = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds - minutes * 60);
    return `${pad(minutes, 2)}:${pad(remaining, 2)}`;
};

const Radio: React.FC<{ radio: TeamRadioParams, teamColor: string }> = ({ radio, teamColor }) => {
    const [playing, setPlaying] = useState<boolean>(false);
    const [duration, setDuration] = useState<number>(0);
    const [progress, setProgress] = useState<number>(0);

    const audioRef = useRef<HTMLAudioElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const audioElement = audioRef.current;

        const handleEnd = () => {
            setPlaying(false);
            setProgress(0);
        };

        if (audioElement) {
            audioElement.addEventListener("ended", handleEnd);
        }

        return () => {
            if (audioElement) {
                audioElement.removeEventListener("ended", handleEnd);
            }
        };
    }, []);

    useEffect(() => {
        const audioElement = audioRef.current;

        if (playing && audioElement && typeof audioElement.play === "function") {
            audioElement.play();
            intervalRef.current = setInterval(() => {
                if (audioElement) {
                    setProgress(audioElement.currentTime);
                }
            }, 100);
        }
        if (!playing && audioElement && typeof audioElement.pause === "function") {
            audioElement.pause();
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    }, [playing]);

    const percent = (progress / duration) * 100;

    return (
        <>
            <button
                onClick={() => setPlaying((p) => !p)}
                className="inline-flex w-52 border-1 border-white px-3 py-1 mr-3"
                style={{
                    background: `linear-gradient(to right, ${teamColor ? teamColor : "#3F3F46"} ${percent}%, #000 ${percent}%)`,
                }}
            >
                {secondsToMinutes(progress)} / {secondsToMinutes(duration)}
            </button>
            <audio
                ref={audioRef}
                src={radio.recording_url}
                onLoadedMetadata={() => {
                    if (audioRef.current) {
                        setDuration(audioRef.current.duration);
                    }
                }}
                controls
                style={{ display: "none" }}
            />
        </>
    );
};

export default Radio;
