import { Alert, Modal, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useRef, useState } from 'react';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { LCSD_URL } from '../utilities/constants';
import moment from 'moment';
import { setDropdown } from '../injectedScripts/enquiry';
import { Venue, getUserAgent, htmlResultsBuilder, parseEnquiryOptionForInject } from '../utilities/helper';
import { INITIAL_SCRIPT } from '../injectedScripts/initialScript';
import { Button, ListItem, SearchBar } from '@rneui/themed';
import Loading from './LoadingModal';
import { ISession, getSession } from '../utilities/resultParser';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigator/RootNavigator';
import { SCRIPT_FUNCTIONS } from '../injectedScripts/common';
import useEnquiryContext, { Enquiry } from '../hooks/useEnquiryContext';

type Props = {
  enquiredVenue: Venue | undefined;
  date: Date;
};

const EnquiryWebview = (props: Props) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { setEnquiry } = useEnquiryContext();
  const { enquiredVenue, date } = props;
  const [results, setResults] = useState<string>('');
  const resultsRecord = useRef<any>({});
  const webviewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);

  function onClear() {
    setResults('');
    resultsRecord.current = {};
  }

  function onEnquire() {
    onClear();

    const web = webviewRef.current;

    if (!enquiredVenue) {
      Alert.alert('Please Select a Venue');
      return;
    }

    setEnquiry({
      date,
      timeSlots: [],
      enquiryTime: new Date(),
      venue: enquiredVenue,
    });

    const parsedOptions = parseEnquiryOptionForInject(enquiredVenue, date);
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
          console.log({schedule})
          const parsedSession = getSession(schedule);
          if (parsedSession) {
            const { timeSlots } = parsedSession;
            console.log({ timeSlots });
            setEnquiry((currentEnquiry) => {
              if (currentEnquiry) {
                return {
                  ...currentEnquiry,
                  timeSlots: [...currentEnquiry.timeSlots, ...timeSlots],
                };
              }
              return {
                date,
                enquiryTime: new Date(),
                timeSlots,
                venue: enquiredVenue!,
              };
            });
          }
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
          Alert.alert('Booking Details Retrieved', undefined, [{ text: 'See Results', onPress: goToResults }]);
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

  function onReload() {
    setLoading(false);
    setKey((key) => key + 1);
  }

  function goToResults() {
    navigation.navigate('Results');
  }

  return (
    <>
      <View style={styles.row}>
        <Button onPress={onReload} color={'warning'}>
          Reload
        </Button>
        <Button onPress={onEnquire}>Enquire</Button>
      </View>
      <View style={{ flex: 1 }}>
        <WebView
          key={key}
          ref={webviewRef}
          style={{ flex: 1 }}
          source={{ uri: LCSD_URL.ENQUIRY }}
          onMessage={(event: WebViewMessageEvent) => handleOnMessage(event)}
          injectedJavaScript={INITIAL_SCRIPT}
          injectedJavaScriptForMainFrameOnly={false}
          setSupportMultipleWindows={false}
          originWhitelist={['*']}
          javaScriptCanOpenWindowsAutomatically={true}
          userAgent={getUserAgent()}
        />
        <View style={{ paddingHorizontal: 20, backgroundColor: '#FFF', paddingTop: 20 }}>
          <Button onPress={goToResults}>Results</Button>
        </View>

        {loading && <Loading />}
      </View>
    </>
  );
};

export default EnquiryWebview;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
  },
});
