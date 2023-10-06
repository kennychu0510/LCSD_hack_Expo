import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useRef, useState } from 'react';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { LCSD_URL } from '../utilities/constants';
import moment from 'moment';
import { setDropdown } from '../injectedScripts/enquiry';
import { Venue } from '../utilities/helper';


type Props = {
  venue: Venue[];
  date: Date;
};

const EnquiryWebview = (props: Props) => {
  const { venue, date } = props;
  const [results, setResults] = useState<string>('');
  const resultsRecord = useRef<any>({});
  const webviewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(false);

  function onClear() {
    setResults('');
    resultsRecord.current = {};
  }

  function onEnquire() {
    onClear();

    const web = webviewRef.current;

    if (!venue) {
      Alert.alert('Please Select Venue');
      return;
    }

    if (!date) {
      Alert.alert('Please Select a Date');
      return;
    }

    const selectedOptions = venue

    if (!selectedOptions) {
      Alert.alert('Invalid Option');
      return;
    }

    const parsedOptions: EnquiryInputOption[] = selectedOptions.map(item => ({
      sport: Number(item.sportValue),
      facility_type: Number(item.facilityTypeValue),
      area: item.areaValue,
      venue: Number(item.venueValue),
      date: moment(date).format('YYYYMMDD'),
      venueName: item.venueName,
    }));
    console.log(parsedOptions);

    setLoading(true);
    web?.injectJavaScript(setDropdown(parsedOptions));
  }

  function handleOnMessage(event: WebViewMessageEvent) {
    try {
      const data = JSON.parse(event.nativeEvent.data) as Data;
      switch (data.type) {
        case 'debug':
          console.log(data.message);
          break;
        case 'results':
          const enquiryResults = data.message as any as ResultsFromEnquiry;
          const { venue, schedule, session } = enquiryResults;
          console.log(schedule);
          if (!resultsRecord.current[venue]) {
            setResults(
              (results) =>
                results +
                `
              <h1><u>${venue}</u></h1><h2>${session}</h2><div>${schedule}</div>
            `
            );
            resultsRecord.current[venue] = true;
          } else {
            setResults(
              (results) =>
                results +
                `
              <h2>${session}</h2><div>${schedule}</div>
            `
            );
          }
          break;
        case 'done':
          Alert.alert('Booking Details Retrieved', undefined, [{ text: 'See Results', onPress: () => {} }]);
          setLoading(false);
          break;

        case 'error':
          Alert.alert(data.message);
          setLoading(false);
          break;
        case 'can enquire':
          onEnquire();
      }
    } catch (error) {
      console.log('could not parse json', error);
    }
  }

  return <WebView ref={webviewRef} style={{ flex: 1 }} source={{ uri: LCSD_URL.ENQUIRY }} onMessage={(event: WebViewMessageEvent) => handleOnMessage(event)} />;
};

export default EnquiryWebview;

const styles = StyleSheet.create({});
