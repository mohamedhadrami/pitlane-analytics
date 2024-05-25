// Interquartile Range Method
export const getIQRThresholds = (data: number[], multiplier: number): [number, number] => {
    const sorted = [...data].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length / 4)];
    const q3 = sorted[Math.floor((sorted.length * 3) / 4)];
    const iqr = q3 - q1;
    const lowerThreshold = q1 - multiplier * iqr;
    const upperThreshold = q3 + multiplier * iqr;
    return [lowerThreshold, upperThreshold];
};

// Z-Score Method
export const getZScoreThresholds = (data: number[], threshold: number = 3): [number, number] => {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const stdDev = Math.sqrt(data.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / data.length);
    const lowerThreshold = mean - threshold * stdDev;
    const upperThreshold = mean + threshold * stdDev;
    return [lowerThreshold, upperThreshold];
};

// Modified Z-Score Method
export const getModifiedZScoreThresholds = (data: number[], threshold: number = 3.5): [number, number] => {
    const median = data.sort((a, b) => a - b)[Math.floor(data.length / 2)];
    const mad = data.map(x => Math.abs(x - median)).sort((a, b) => a - b)[Math.floor(data.length / 2)];
    const modifiedZScores = data.map(x => 0.6745 * (x - median) / mad);
    const lowerThreshold = median - threshold * mad / 0.6745;
    const upperThreshold = median + threshold * mad / 0.6745;
    return [lowerThreshold, upperThreshold];
};

// Chauvenet's Criterion
export const getChauvenetThresholds = (data: number[]): [number, number] => {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const stdDev = Math.sqrt(data.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / data.length);
    const N = data.length;
    const criterion = 1 / (2 * N);
    const zValue = Math.abs(criterion);
    const lowerThreshold = mean - zValue * stdDev;
    const upperThreshold = mean + zValue * stdDev;
    return [lowerThreshold, upperThreshold];
};
