import {
  countries,
  getEmojiFlag,
  TCountryCode,
  TContinentCode,
} from "countries-list";

export interface CountryInfo {
  name: string;
  native: string;
  phone: string;
  continent: TContinentCode;
  capital: string;
  currency: string[];
  languages: string[];
  code: TCountryCode;
  flagEmoji: string;
}
/**
 * Retrieves country data and formats it into an array of CountryInfo objects.
 */
export function countryData(): CountryInfo[] {
  const codes = Object.keys(countries) as TCountryCode[];
  return codes.map((code) => {
    const data = countries[code];
    const emoji = getEmojiFlag(code);

    // Convert phone number array to comma-separated string
    const phoneString = data.phone.join(",");

    return {
      name: data.name,
      native: data.native,
      phone: phoneString,
      continent: data.continent,
      capital: data.capital,
      currency: data.currency,
      languages: data.languages,
      code: code,
      flagEmoji: emoji,
    };
  });
}
