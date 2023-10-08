import { atom, selector } from 'recoil';
import { ISession, ITimeSlot } from './utilities/resultParser';
import { Venue } from './utilities/helper';
export type Enquiry = {
  date: Date,
  venue: Venue,
  timeSlots: ITimeSlot[]
  enquiryTime: Date
}


export const EnquiryResult = atom<Enquiry | null>({
  key: 'enquiryResults',
  default: null,
});

export const getResultsStore = selector({
  key: 'getEnquiryResults',
  get: ({ get }) => get(EnquiryResult),
});
