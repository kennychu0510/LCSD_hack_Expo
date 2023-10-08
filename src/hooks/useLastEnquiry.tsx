import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';
import moment from 'moment';

const ZEnquiry = z.object({
  date: z.date(),
  venue: z.string(),
  facility: z.object({
    venue: z.string(),
    name: z.string(),
  }),
});

type Enquiry = z.infer<typeof ZEnquiry>;

const useLastEnquiry = () => {
  const [lastEnquiry, setLastEnquiry] = useState<Enquiry | null>(null);

  useEffect(() => {
    async function getLastEnquiry() {
      try {
        const storedPreviousOptions = await AsyncStorage.getItem('lastEnquiry');
        if (storedPreviousOptions !== null) {
          const json = JSON.parse(storedPreviousOptions);
          const parsedEnquiry = await ZEnquiry.parseAsync({
            date: moment(json).toDate(),
            venue: json.venue,
            facility: json.facility,
          });
          setLastEnquiry(parsedEnquiry);
        }
      } catch (error) {
        console.log('failed to retrieve last enquiry', error);
      }
    }
  }, []);

  async function saveLastEnquiry(enquiry: Enquiry) {
    try {
      await AsyncStorage.setItem('lastEnquiry', JSON.stringify(enquiry));
    } catch (error) {
      console.log('failed to save last enquiry', error);
    }
  }

  return { lastEnquiry, saveLastEnquiry };
};

export default useLastEnquiry;

