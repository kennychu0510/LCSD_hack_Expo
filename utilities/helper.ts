import moment from 'moment'
import VenueOptions from '../assets/venueOptions.min.json';


type Unpacked<T> = T extends (infer U)[] ? U : T;
export type Venue = Unpacked<typeof VenueOptions>;


export function getToday() {
  if (moment().get('hour') > 21) {
    return moment().add(1, 'd');
  }
  return moment();
}

export function getVenueByValue(value: string): Venue | undefined {
  return VenueOptions.find((item) => item.venueValue === value);
}

export function getVenueForEnquiry(venueValue: string, sportValue: string | null | undefined): Venue | undefined {
  if (!sportValue || !venueValue) return undefined
  return VenueOptions.find(item => item.venueValue === venueValue && item.sportValue === sportValue )
}

export function parseEnquiryOptionForInject(enquiryOption: {venue: Venue, date: Date}): EnquiryInputOption {
  return {
    sport: Number(enquiryOption.venue.sportValue),
    facility_type: Number(enquiryOption.venue.facilityTypeValue),
    area: enquiryOption.venue.areaValue,
    venue: Number(enquiryOption.venue.venueValue),
    date: moment(enquiryOption.date).format('YYYYMMDD'),
    venueName: enquiryOption.venue.venueName,
  };
}

export enum Status {
  AVAILABLE = 'A',
  UNAVAILABLE = 'U',
}

function getStatus(input: string): Status {
  if (input.trim().length > 0) {
    return Status.UNAVAILABLE;
  }
  return Status.AVAILABLE;
}

function parseTimeString(time: string): string {
  return time.trim().replace(':', '');
}

export function getVenueValueByName(name: string) {
  return VenueOptions.find((item) => item.venueName === name)?.venueValue;
}

export function getAllSportsInVenue(value: string): Venue[] {
  return VenueOptions.filter((item) => item.venueValue === value);
}