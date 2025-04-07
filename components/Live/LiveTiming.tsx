// @/components/Dashboard/LiveTiming.tsx

import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
	Progress,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from '@heroui/react';
import SectorSegment from './SectorSegments';
import { getCompoundComponent } from '@/components/Tyres';
import { useLiveSettings } from '../../context/LiveSettingsContext';
import { Minus } from 'lucide-react';
import type {
	LiveCarData,
	LiveCarDataEntryDataChannels,
	LiveCurrentTyres,
	LiveDriver,
	LiveDriverList,
	LiveLapSeries,
	LiveTimingAppData,
	LiveTimingAppDataLineData,
	LiveTimingDataF1,
	LiveTimingDataF1LineData,
	LiveTimingStats,
	LiveTimingStatsLine,
	LiveTyreStintSeries,
	StintInfo,
} from '@/types/liveTiming.types';
import {
	buildStyles,
	CircularProgressbar,
	CircularProgressbarWithChildren,
} from 'react-circular-progressbar';

interface LiveTimingProps {
	drivers: LiveDriverList;
	currentTyres: LiveCurrentTyres;
	tyreStintSeries: LiveTyreStintSeries;
	timingAppData: LiveTimingAppData;
	timingDataF1: LiveTimingDataF1;
	timingStats: LiveTimingStats;
	lapSeries: LiveLapSeries;
	carData: LiveCarData;
}

const LiveTiming: React.FC<LiveTimingProps> = ({
	drivers,
	currentTyres,
	tyreStintSeries,
	timingAppData,
	timingStats,
	timingDataF1,
	lapSeries,
	carData,
}) => {
	const { settings } = useLiveSettings();

	const defaultSettings = {
		showFastestLap: true,
		showTyre: true,
		showGapToLeader: true,
		showStintNumber: true,
		showSectors: true,
	};

	const [isShowFastestLap, setIsShowFastestLap] = useState(defaultSettings.showFastestLap);
	const [isShowTyre, setIsShowTyre] = useState(defaultSettings.showTyre);
	const [isShowGapToLeader, setIsShowGapToLeader] = useState(defaultSettings.showGapToLeader);
	const [isShowStintNumber, setIsShowStintNumber] = useState(defaultSettings.showStintNumber);
	const [isShowSectors, setIsShowSectors] = useState(defaultSettings.showSectors);
	const [tableKey, setTableKey] = useState(0);

	const headers = [
		{ name: 'Position', uid: 'position', visible: true },
		{ name: 'Gap', uid: 'gap', visible: true },
		{ name: 'Tyre', uid: 'tyre', visible: true },
		{ name: 'Lap Time', uid: 'lapTime', visible: true },
		{ name: 'Sectors', uid: 'sectors', visible: isShowSectors },
		{ name: 'Telemetry', uid: 'telemetry', visible: true },
	];

	useEffect(() => {
		const findSetting = (name: string) =>
			settings.find(setting => setting.name === name)?.value;

		setIsShowFastestLap(findSetting('Show Fastest Lap') ?? defaultSettings.showFastestLap);
		setIsShowTyre(findSetting('Show Tyre') ?? defaultSettings.showTyre);
		setIsShowGapToLeader(findSetting('Show Gap To Leader') ?? defaultSettings.showGapToLeader);
		setIsShowStintNumber(findSetting('Show Stint Number') ?? defaultSettings.showStintNumber);
		setIsShowSectors(findSetting('Show Sectors') ?? defaultSettings.showSectors);
		setTableKey(prevKey => prevKey + 1);
	}, [
		settings,
		defaultSettings.showFastestLap,
		defaultSettings.showTyre,
		defaultSettings.showGapToLeader,
		defaultSettings.showStintNumber,
		defaultSettings.showSectors,
	]);

	const [sortedDrivers, setSortedDrivers] = useState<LiveDriver[]>([]);

	useEffect(() => {
		const driverArray = Object.values(drivers);

		const driversWithPositions = driverArray.map(driver => {
			const lastPosition = lapSeries[driver.RacingNumber]?.LapPosition.pop();
			return { ...driver, lastPosition: Number.parseInt(lastPosition || '0', 10) };
		});

		const sorted = driversWithPositions.sort((a, b) => a.lastPosition - b.lastPosition);

		setSortedDrivers(sorted);
	}, [drivers, lapSeries]);

	const classNames = useMemo(
		() => ({
			th: ['bg-transparent text-foreground text-sm font-extralight border-b border-divider'],
			tr: ['rounded-full border-b-1 border-default-300 last:border-none'],
			td: ['text-foreground !bg-black'],
			table: ['rounded-xl bg-black'],
		}),
		[]
	);

	const renderCell = (
		columnKey: React.Key,
		driver: LiveDriver,
		lap: LiveTimingDataF1LineData,
		stints: StintInfo[],
		timingStat: LiveTimingStatsLine,
		data: LiveCarDataEntryDataChannels
	): React.ReactNode => {
		switch (columnKey) {
			case 'position':
				return (
					<div className="flex justify-center gap-1">
						<span className="text-center">{driver.RacingNumber}</span>
						<span style={{ color: `#${driver.TeamColour}`, textAlign: 'center' }}>
							{driver.Tla}
						</span>
					</div>
				);
			case 'lapTime':
				return (
					<div className="flex flex-col">
						{lap?.LastLapTime ? (
							<div className="">{lap.LastLapTime.Value}</div>
						) : (
							<div className="mx-auto">
								<Minus />
							</div>
						)}
						{isShowFastestLap ? (
							timingStat.PersonalBestLapTime && timingStat.PersonalBestLapTime?.Position === 1 ? (
								<div className="flex flex-row justify-center gap-1 text-[#FF00FF]">
									{timingStat.PersonalBestLapTime.Value}{' '}
									{`(${timingStat.PersonalBestLapTime.Lap})`}
								</div>
							) : (
								<div className="font-thin flex flex-row justify-center gap-1">
									{timingStat.PersonalBestLapTime?.Value}{' '}
									{`(${timingStat.PersonalBestLapTime.Lap})`}
								</div>
							)
						) : (
							''
						)}
					</div>
				);
			case 'gap':
				return (
					<div className="flex flex-col">
						{lap.IntervalToPositionAhead && (
							<span
								className={`${lap.IntervalToPositionAhead.Catching ? 'text-success' : ''}`}
							>
								{lap.IntervalToPositionAhead.Value}
							</span>
						)}
						<span className="">{lap.TimeDiffToPositionAhead}</span>
						{isShowGapToLeader ? (
							<span className="font-thin">{lap.GapToLeader}</span>
						) : (
							''
						)}
						{isShowGapToLeader ? (
							<span className="font-thin">{lap.TimeDiffToFastest}</span>
						) : (
							''
						)}
					</div>
				);
			case 'tyre': {
				const stint = stints.pop();
				const tyreAge = stint?.TotalLaps;
				return (
					<div className="flex flex-col mx-auto">
						{isShowTyre && stint ? (
							<div className="flex justify-center gap-1 items-center">
								<div className="w-[25px]">
									{getCompoundComponent(stint?.Compound)}
								</div>
								<div className="">{tyreAge}</div>
							</div>
						) : (
							''
						)}
						{isShowStintNumber ? (
							<div className="font-thin text-center">Pit {lap.NumberOfPitStops}</div>
						) : (
							''
						)}
					</div>
				);
			}
			case 'sectors':
				return <SectorSegment sectors={lap.Sectors} />;
			case 'telemetry': {
				let drsColor: string;
				switch (data['45']) {
					case 0:
						drsColor = '#a0a0a0';
						break; // 'DRS off',
					case 1:
						drsColor = '#a0a0a0';
						break; // 'DRS off',
					case 2:
						drsColor = '#000000';
						break; // '?',
					case 3:
						drsColor = '#000000';
						break; // '?',
					case 8:
						drsColor = '#ffff00';
						break; // 'Detected, eligible once in activation zone',
					case 9:
						drsColor = '#000000';
						break; // '?',
					case 10:
						drsColor = '#FFFFFF';
						break; // 'DRS on',
					case 12:
						drsColor = '#FFFFFF';
						break; // 'DRS on',
					case 14:
						drsColor = '#00ff00';
						break; // 'DRS activated',
					default:
						drsColor = '#000000';
						break;
				}
				return (
					<div className="flex flex-row items-center">
						{/*<CircularProgressbarWithChildren
                            value={speed}
                            maxValue={360}
                            minValue={0}
                            strokeWidth={10}
                            styles={buildStyles({
                                rotation: 0.75,
                                strokeLinecap: 'round',
                                pathColor: `rgba(0, 0, 255, ${speed / 360})`,
                                trailColor: '#fff',
                                pathTransitionDuration: 0.5,
                            })}
                            circleRatio={0.75}
                            className="rotate-[315deg]"
                        >
                            {speed}
                        </CircularProgressbarWithChildren>*/}

						<div className="flex flex-col w-1/3 items-center">
							<p className="flex flex-row gap-1">
								{data['2']}
								<span className="font-thin">km/h</span>
							</p>
							<p className="font-thin">{data['3']}</p>
						</div>
						<div className="flex flex-col gap-2 w-1/2 items-center">
							<Progress
								color="secondary"
								size="sm"
								radius="sm"
								value={data['0']}
								maxValue={15000}
							/>
							<Progress color="success" size="sm" radius="sm" value={data['4']} />
							<Progress color="danger" size="sm" radius="sm" value={data['5']} />
						</div>
						<div style={{ color: drsColor }} className="">
							DRS
						</div>
					</div>
				);
			}
		}
	};

	const renderRow = (driver: LiveDriver) => {
		const lap = timingDataF1.Lines[driver.RacingNumber];

		let isGreyedOut = false; //lap.KnockedOut;
		if (!lap) isGreyedOut = true;

		const stints = tyreStintSeries.Stints[driver.RacingNumber];
		const timingStat = timingStats.Lines[driver.RacingNumber];
		const data = carData.Entries[carData.Entries.length - 1]?.Cars[driver.RacingNumber]?.Channels;

		return (
			<TableRow key={driver.RacingNumber} className={isGreyedOut ? 'brightness-[0.35]' : ''}>
				{headers
					.filter(header => header.visible)
					.map(header => (
						<TableCell key={header.uid} className="bg-[#111] text-center">
							{renderCell(header.uid, driver, lap, stints, timingStat, data)}
						</TableCell>
					))}
			</TableRow>
		);
	};

	return (
		<>
			<Table
				key={tableKey}
				aria-label="Live timing data"
				classNames={classNames}
				className="max-screen-xs"
				removeWrapper
			>
				<TableHeader columns={headers.filter(header => header.visible)}>
					{header => (
						<TableColumn key={header.uid} className="text-center">
							{header.name}
						</TableColumn>
					)}
				</TableHeader>
				<TableBody items={sortedDrivers}>{driver => renderRow(driver)}</TableBody>
			</Table>
		</>
	);
};

export default LiveTiming;
