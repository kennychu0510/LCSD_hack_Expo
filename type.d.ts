type ISport = {
  value: string;
  name: string;
};

type EnquiryInputOption = {
  sport: number;
  facility_type: number;
  area: string;
  venue: number;
  date: string;
  venueName: string;
};

type ITimeSlot = {
  status: string;
  start: string;
  end: string;
  facilityName: string;
};

/* WEBVIEW */

type ResultsFromEnquiry = {
  venue: string;
  session: string;
  schedule: string;
};

type Data = {
  type: string;
  message: string;
};

/* RESULTS */

type ISession = {
  venue: string;
  timeSlots: ITimeSlot[];
};