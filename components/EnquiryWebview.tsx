import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { LCSD_URL } from '../utilities/constants';
import {
  Venue,
  parseEnquiryOptionForInject,
} from '../utilities/helper';
import { setDropdown } from '../injectedScripts/enquiry';
import Button from './Button';
import type { EnquiryResult } from './EnquiryResultModal';
import {
  INITIAL_SCRIPT,
  CHECK_CURRENT_URL,
} from '../injectedScripts/initialScript';
import Loading from './Loading';
import useRecentEnquiries from '../hooks/useRecentEnquiries';

type EnquiryOption = {
  venue: Venue;
  date: Date;
};

type Props = {
  style?: StyleProp<ViewStyle>;
  enquiryOption: EnquiryOption;
  setEnquiryResult: React.Dispatch<React.SetStateAction<EnquiryResult | null>>;
  visible: boolean;
  goToResults: () => void;
  setIsEnquiring: React.Dispatch<React.SetStateAction<boolean>>;
};

const EnquiryWebview = (props: Props) => {
  const { enquiryOption, setEnquiryResult, goToResults, setIsEnquiring } =
    props;
  const webviewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);
  const [alertShown, setAlertShown] = useState(false);
  const { recordEnquiry } = useRecentEnquiries();

console.log(enquiryOption)
  function onEnquire() {
    const web = webviewRef.current;
    setIsEnquiring(true);
    if (!enquiryOption.venue) {
      Alert.alert('Please Select a Venue and Facility!');
      return;
    }
    setEnquiryResult(null);
    const parsedOptions = parseEnquiryOptionForInject(enquiryOption);
    console.log({parsedOptions})
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
          const enquiryResults = data.message as any as ISession;
          const { timeSlots } = enquiryResults;
          console.log(timeSlots);
          if (!timeSlots || !Array.isArray(timeSlots)) {
            break;
          }
          setEnquiryResult((currentEnquiry) => {
            if (currentEnquiry) {
              return {
                ...currentEnquiry,
                timeSlots: [...currentEnquiry.timeSlots, ...timeSlots],
              };
            }
            return {
              date: enquiryOption.date,
              enquiryTime: new Date(),
              timeSlots,
              venue: enquiryOption.venue!,
            };
          });

          break;
        case 'done':
          setLoading(false);
          setIsEnquiring(false);
          goToResults();
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

  function reloadWebview() {
    setLoading(false);
    setKey((key) => key + 1);
  }

  return (
    <View style={{ flex: 1 }}>
      {props.visible && (
        <View style={styles.buttonContainer}>
          <Button
            label={'Reload'}
            variant="secondary"
            onPress={reloadWebview}
          />
          <Button label={'Enquire'} onPress={onEnquire} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <WebView
          key={key}
          ref={webviewRef}
          source={{ uri: LCSD_URL.ENQUIRY }}
          style={[{ flex: 1 }, props.style]}
          onMessage={(event: WebViewMessageEvent) => handleOnMessage(event)}
          injectedJavaScript={INITIAL_SCRIPT}
          injectedJavaScriptForMainFrameOnly={false}
          setSupportMultipleWindows={false}
          originWhitelist={['*']}
          javaScriptCanOpenWindowsAutomatically
          onNavigationStateChange={(e) => {
            // console.log({ url: e.url });
            if (e.url.includes('/retry') || e.url.includes('/busy')) {
              if (alertShown) return;
              setAlertShown(true);
              Alert.alert(
                'Unable to enquiry',
                'LCSD is currently unavailable',
                [
                  {
                    text: 'Reload',
                    onPress: reloadWebview,
                  },
                  {
                    text: 'Ok',
                  },
                ]
              );
            } else if (e.url.includes('/tokenVerifyFailed')) {
              setAlertShown(true);
              Alert.alert(
                'Token Verify Failed',
                'Please reload and try again',
                [
                  {
                    text: 'Reload',
                    onPress: reloadWebview,
                  },
                  {
                    text: 'Ok',
                  },
                ]
              );
            } else {
              webviewRef.current?.injectJavaScript(CHECK_CURRENT_URL);
            }
          }}
        />
        {loading && <Loading />}
      </View>
    </View>
  );
};

export default EnquiryWebview;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
});
