import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider, createTheme } from '@rneui/themed';
import { useMemo, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import { Enquiry, EnquiryContext } from './src/hooks/useEnquiryContext';
import RootNavigator from './src/navigator/RootNavigator';
import enquiryResults from './sampleResults/enquiryResults.json';
import moment from 'moment';

const enquiryResultsForDebug = {
  ...enquiryResults,
  date: moment(enquiryResults.date).toDate(),
  enquiryTime: moment(enquiryResults.enquiryTime).toDate(),
};

const theme = createTheme({
  mode: 'light',
});

export default function App() {
  const [enquiry, setEnquiry] = useState<Enquiry | null>(enquiryResultsForDebug);
  const contextValue = useMemo(
    () => ({
      enquiry,
      setEnquiry,
    }),
    [enquiry, setEnquiry]
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle={'dark-content'} />
      <ThemeProvider theme={theme}>
        <EnquiryContext.Provider value={contextValue}>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </EnquiryContext.Provider>
      </ThemeProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
