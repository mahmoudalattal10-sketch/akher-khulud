/**
 * Formats the hotel distance based on the city according to Diafat standards.
 * 
 * @param distance - The distance value (string or number)
 * @param city - The city name (Arabic or English)
 * @returns Formatted string with appropriate suffix
 */
export const formatHotelDistance = (distance: string | number | undefined, city: string | undefined): string => {
    if (distance === undefined || distance === null || distance === '') return '';

    // Extract number if it's a string like "500m" or "500 m" or "0.5km"
    const rawDistStr = distance.toString().replace(/[^0-9.]/g, '');
    if (!rawDistStr) return distance.toString();

    let rawValue = parseFloat(rawDistStr);

    // 1. Normalize to METERS first
    // If input is small (< 15), assume it's KM and convert to Meters
    if (rawValue > 0 && rawValue < 15) {
        rawValue = rawValue * 1000;
    }

    // 2. Determine Unit and Label
    let displayValue: string;
    let unit = 'م';

    if (rawValue > 800) {
        // Convert back to KM and format (e.g. 900 -> 0.9, 1200 -> 1.2)
        displayValue = (rawValue / 1000).toFixed(1).replace(/\.0$/, '');
        unit = 'كم';
    } else {
        displayValue = Math.round(rawValue).toString();
        unit = 'م';
    }

    const cityLower = (city || '').toLowerCase();

    // Logic from requirements:
    // 1. Makkah -> X [Unit] من الحرم المكي
    // 2. Madinah -> X [Unit] من المسجد النبوي
    // 3. Other -> X [Unit] من المركز

    let suffix = 'من المركز';

    if (cityLower.includes('مكة') || cityLower.includes('makkah') || cityLower.includes('mecca')) {
        suffix = 'من الحرم المكي';
    } else if (cityLower.includes('المدينة') || cityLower.includes('madinah') || cityLower.includes('medina')) {
        suffix = 'من المسجد النبوي';
    }

    return `${displayValue} ${unit} ${suffix}`;
};
