import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from '@rneui/themed';
import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import WebView, { WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';

import Loading from './LoadingModal';
import useEnquiryContext from '../hooks/useEnquiryContext';
import { setDropdown } from '../injectedScripts/enquiry';
import { INITIAL_SCRIPT } from '../injectedScripts/initialScript';
import { RootStackParamList } from '../navigator/RootNavigator';
import { LCSD_URL } from '../utilities/constants';
import { Venue, getUserAgent, parseEnquiryOptionForInject } from '../utilities/helper';
import { getSession } from '../utilities/resultParser';

type Props = {
  enquiredVenue: Venue | undefined;
  date: Date;
};

const EnquiryWebview = (props: Props) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { setEnquiry } = useEnquiryContext();
  const { enquiredVenue, date } = props;
  const webviewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);
  const [alertShown, setAlertShown] = useState(false);

  function onEnquire() {
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
          const { schedule } = enquiryResults;
          console.log({ schedule });
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
          break;
        case 'done':
          setLoading(false);
          navigation.navigate('Results');
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

  return (
    <>
      <View style={styles.row}>
        <Button onPress={onReload} color="warning">
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
          javaScriptCanOpenWindowsAutomatically
          userAgent={getUserAgent()}
          onNavigationStateChange={(e) => {
            console.log(e.url);
            if (e.url.includes('/retry')) {
              if (alertShown) return;
              setAlertShown(true);
              Alert.alert('Unable to enquiry', 'LCSD is currently unavailable', [
                {
                  text: 'Reload',
                  onPress: onReload,
                },
                {
                  text: 'Ok',
                },
              ]);
            } else if (e.url.includes('/dispatchFlow.do')) {
              if (!!enquiredVenue) {
                onEnquire();
              }
            } else if (e.url.includes('/tokenVerifyFailed')) {
              setAlertShown(true);
              Alert.alert('Token Verify Failed', 'Please reload and try again', [
                {
                  text: 'Reload',
                  onPress: onReload,
                },
                {
                  text: 'Ok',
                },
              ]);
            }
          }}
        />
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
