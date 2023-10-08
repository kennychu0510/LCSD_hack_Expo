import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigator/RootNavigator';
import { ThemeProvider, createTheme } from '@rneui/themed';
import 'react-native-gesture-handler';
import { RecoilRoot } from 'recoil';

const theme = createTheme({
  mode: 'light',
});

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <RecoilRoot>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </RecoilRoot>
      </ThemeProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
