type ISport = {
  value: string;
  name: string;
}

type Data = {
  type: string;
  message: string;
};

type ResultsFromEnquiry = {
  venue: string,
  session: string,
  schedule: string
}

type ResultsFromAuthPage = {
  original: string;
  cleaned: string;
  options: AuthButtonData[];
  path: string;
};

type DropdownOption = {
  areaName: string;
  areaValue: string;
  facilityTypeName: string;
  facilityTypeValue: string;
  sportName: string;
  sportValue: string;
  venueName: string;
  venueValue: string;
  locationValue: string;
  locationName: string;
};

type EnquiryInputOption = {
  sport: number;
  facility_type: number;
  area: string;
  venue: number;
  date: string;
  venueName: string;
};
