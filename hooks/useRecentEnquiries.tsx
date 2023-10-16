import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import _ from 'lodash';

const recentEnquiriesKey = 'recent-enquiries';
const MAX_RECENT_ENQURIES = 3;

const useRecentEnquires = () => {
  const [recentEnquires, setRecentEnquires] = useState<string[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem(recentEnquiriesKey);
        if (value !== null) {
          const recentEnquires = JSON.parse(value) as string[];
          setRecentEnquires(recentEnquires);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getData();
  }, []);

  async function storeEnquiry(enquiries: string[]) {
    try {
      await AsyncStorage.setItem(recentEnquiriesKey, JSON.stringify(enquiries));
    } catch (e) {
      // saving error
      console.log(e);
    }
  }

  function recordEnquiry(venueValue: string) {
    const updatedEnquires = [
      venueValue,
      ...recentEnquires.filter((item) => item !== venueValue),
    ].slice(0, 3);
    setRecentEnquires(updatedEnquires);
    storeEnquiry(updatedEnquires);
  }

  const clearAll = async () => {
  try {
    await AsyncStorage.clear()
  } catch(e) {
    // clear error
  }

  console.log('Done.')
}

  return { recentEnquires, recordEnquiry };
};

export default useRecentEnquires;
