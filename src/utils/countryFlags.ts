
const countryFlags: { [key: string]: string } = {
  'United States': '🇺🇸',
  'Canada': '🇨🇦',
  'United Kingdom': '🇬🇧',
  'Australia': '🇦🇺',
  'Germany': '🇩🇪',
  'France': '🇫🇷',
  'Spain': '🇪🇸',
  'Italy': '🇮🇹',
  'Netherlands': '🇳🇱',
  'Sweden': '🇸🇪',
  'Norway': '🇳🇴',
  'Denmark': '🇩🇰',
  'Finland': '🇫🇮',
  'India': '🇮🇳',
  'China': '🇨🇳',
  'Japan': '🇯🇵',
  'South Korea': '🇰🇷',
  'Singapore': '🇸🇬',
  'Brazil': '🇧🇷',
  'Mexico': '🇲🇽',
  // Add more countries as needed
};

export function getCountryFlag(location: string | undefined): string {
  if (!location) return '';
  
  // Try to match country name in the location string
  const country = Object.keys(countryFlags).find(country => 
    location.toLowerCase().includes(country.toLowerCase())
  );
  
  return country ? countryFlags[country] : '🌎'; // Return globe emoji if no specific country flag found
}
