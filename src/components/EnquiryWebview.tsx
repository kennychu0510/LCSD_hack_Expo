import { Alert, Modal, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useRef, useState } from 'react';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { LCSD_URL } from '../utilities/constants';
import moment from 'moment';
import { setDropdown } from '../injectedScripts/enquiry';
import { Venue, getUserAgent, htmlResultsBuilder, parseEnquiryOptionForInject } from '../utilities/helper';
import { SCROLL_SLIDER_TO_VIEW } from '../injectedScripts/scrollSliderToView';
import { Button, ListItem, SearchBar } from '@rneui/themed';
import Loading from './LoadingModal';

type Props = {
  enquiryOption: Venue | undefined;
  date: Date;
};

const EnquiryWebview = (props: Props) => {
  const { enquiryOption, date } = props;
  const [results, setResults] = useState<string>('');
  const resultsRecord = useRef<any>({});
  const webviewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [key, setKey] = useState(0);

  function onClear() {
    setResults('');
    resultsRecord.current = {};
  }

  function onViewResults() {
    setShowResultsModal(true);
  }

  function onEnquire() {
    onClear();

    const web = webviewRef.current;

    if (!enquiryOption) {
      Alert.alert('Please Select a Venue');
      return;
    }

    const parsedOptions = parseEnquiryOptionForInject(enquiryOption, date);
    setLoading(true);
    web?.injectJavaScript(setDropdown(parsedOptions));
  }

  function handleOnMessage(event: WebViewMessageEvent) {
    try {
      const data = JSON.parse(event.nativeEvent.data) as Data;
      switch (data.type) {
        case 'debug':
          // console.log(data.message);
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
          Alert.alert('Booking Details Retrieved', undefined, [{ text: 'See Results', onPress: onViewResults }]);
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
          injectedJavaScript={SCROLL_SLIDER_TO_VIEW}
          injectedJavaScriptForMainFrameOnly={true}
          setSupportMultipleWindows={false}
          originWhitelist={['*']}
          javaScriptCanOpenWindowsAutomatically={true}
          userAgent={getUserAgent()}
        />
        <View style={{ alignItems: 'center', backgroundColor: '#FFF' }}>
          <Button onPress={() => setShowResultsModal(true)}>Results</Button>
        </View>

        {showResultsModal && (
          <Modal visible={showResultsModal} transparent={false} animationType='slide'>
            <SafeAreaView style={{ flex: 1 }}>
              <View style={{ alignItems: 'flex-start', margin: 10 }}>
                <Button title='Close' onPress={() => setShowResultsModal(false)}></Button>
              </View>
              <WebView
                source={{
                  html: htmlResultsBuilder({
                    html: results,
                    date: moment(date).format('MMM DD YYYY (dddd)'),
                    details: JSON.stringify(enquiryOption),
                  }),
                }}
                onMessage={(event: WebViewMessageEvent) => handleOnMessage(event)}
              />
            </SafeAreaView>
          </Modal>
        )}
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
