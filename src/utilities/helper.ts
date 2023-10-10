import moment from 'moment';

import { USER_AGENT } from './constants';
import { legendHTML } from './legend';
import VenueOptions from '../../assets/venueOptions.json';

type Unpacked<T> = T extends (infer U)[] ? U : T;
export type Venue = Unpacked<typeof VenueOptions>;

export function getVenue(sport: ISport): Venue | undefined {
  return VenueOptions.find((item) => item.sportValue === sport.value);
}

export function parseEnquiryDetail(venue: string): DropdownOption {
  return JSON.parse(venue) as DropdownOption;
}

export function htmlResultsBuilder(props: { html: string; date: string; details: string }) {
  const { html, date, details } = props;
  try {
    const parsedDetails = parseEnquiryDetail(details);
    return /* HTML */ `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <title>Results</title>
          <style>
            #searchResultTable tr td:first-child {
              display: none;
            }

            #searchResultTable {
              width: auto !important;
            }

            td.resultTable-Header {
              background-color: #e3e3e3;
              border-right: 1px solid #ffffff;
              border-bottom: 1px solid #ffffff;
              text-align: center;
              min-width: 80px;
            }

            TABLE.resultTable {
              background-color: #f2f2f2;
            }

            TABLE.resultTable3 {
              background-color: #f2f2f2;
            }

            TABLE.resultTable TD {
              border-right: 1px solid #ffffff;
              border-bottom: 1px solid #ffffff;
              text-align: center;
            }

            div.timeslotCell {
              text-align: center;
              font-size: 1em;
              vertical-align: middle;
            }

            .timeslotCellPeak {
              text-align: center;
              font-size: 1em;
              background-color: #ffffcc;
              vertical-align: middle;
            }

            .timeslotCellNonPeak {
              text-align: center;
              font-size: 1em;
              background-color: #ccffcc;
              vertical-align: middle;
            }

            .timeslotCellNotAvailable {
              text-align: center;
              font-size: 1em;
              background-color: silver;
              vertical-align: middle;
            }

            .timeslotTitle {
              width: 40%;
              float: left;
              font-size: 1em;
            }

            .red {
              color: 'red';
            }
          </style>
        </head>
        <body>
          <h1>${parsedDetails.sportName}</h1>
          <h2>${date}</h2>
          ${html} ${legendHTML}
        </body>
      </html>
    `;
  } catch (error) {
    console.log(error);
    return '';
  }
}

export function getAllVenues() {
  const venueMap = new Map<string, Venue>();
  for (const venue of VenueOptions) {
    if (venueMap.has(venue.venueName)) {
      continue;
    }

    venueMap.set(venue.venueName, venue);
  }
  const venueArray = Array.from(venueMap, ([key, value]) => ({
    name: key,
    value: value.venueValue,
  })).sort((a, b) => {
    if (a.name < b.name) return -1;
    return 1;
  });

  return venueArray;
}

export function getVenueByValue(value: string): Venue | undefined {
  return VenueOptions.find((item) => item.venueValue === value);
}

export function getEnquiryOption(facility: ISport | null, venueValue: string): Venue | undefined {
  if (!facility || !venueValue) return undefined;
  return VenueOptions.find(
    (item) => item.sportValue === facility.value && item.venueValue === venueValue
  );
}

export function parseEnquiryOptionForInject(option: Venue, date: Date): EnquiryInputOption {
  return {
    sport: Number(option.sportValue),
    facility_type: Number(option.facilityTypeValue),
    area: option.areaValue,
    venue: Number(option.venueValue),
    date: moment(date).format('YYYYMMDD'),
    venueName: option.venueName,
  };
}

export function getUserAgent(): string {
  const length = USER_AGENT.length;
  return USER_AGENT[Math.floor(Math.random() * length)];
}

export function getAllSportsInVenue(value: string): Venue[] {
  return VenueOptions.filter((item) => item.venueValue === value);
}
