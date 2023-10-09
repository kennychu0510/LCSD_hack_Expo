import React, { createContext, useContext } from 'react';
import { Venue } from '../utilities/helper';
import { ITimeSlot } from '../utilities/resultParser';

export type Enquiry = {
  date: Date;
  timeSlots: ITimeSlot[];
  venue: Venue;
  enquiryTime: Date;
};

export const EnquiryContext = createContext<{
  enquiry: Enquiry | null;
  setEnquiry: React.Dispatch<React.SetStateAction<Enquiry | null>>;
}>({
  enquiry: null,
  setEnquiry: () => {},
});

const useEnquiryContext = () => {
  const enquiryContext = useContext(EnquiryContext);
  return enquiryContext;
};

export default useEnquiryContext;

