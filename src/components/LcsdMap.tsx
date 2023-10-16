import { Alert, Modal, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { LCSD_URL } from '../utilities/constants';
import { Button } from '@rneui/themed';
import { MapScript } from '../injectedScripts/map/MapScript';
import { getVenueValueByName } from '../utilities/helper';

const LcsdMap = ({
  onClose,
  setVenue,
}: {
  onClose: () => void;
  setVenue: (venue: string) => void;
}) => {
  function handleOnMessage(event: WebViewMessageEvent) {
    try {
      const data = JSON.parse(event.nativeEvent.data) as Data;
      switch (data.type) {
        case 'debug':
          console.log(data.message);
          break;
        case 'enquireVenue':
          const venue = data.message;
          const value = getVenueValueByName(venue);
          if (value) {
            setVenue(value);
            onClose();
          } else {
            Alert.alert('could not find venue for ', venue);
          }
      }
    } catch (error) {
      console.log('could not parse json', error);
    }
  }
  return (
    <Modal animationType="slide" visible>
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          onMessage={(event: WebViewMessageEvent) => handleOnMessage(event)}
          source={{ uri: LCSD_URL.MAP }}
          injectedJavaScript={MapScript}
          injectedJavaScriptForMainFrameOnly={false}
          setSupportMultipleWindows={false}
          originWhitelist={['*']}
          javaScriptCanOpenWindowsAutomatically
        />
        <View style={{ margin: 20, backgroundColor: '#FFF' }}>
          <Button onPress={onClose}>Close</Button>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default LcsdMap;

const styles = StyleSheet.create({});
