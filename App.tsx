import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigator/RootNavigator';
import { ThemeProvider, createTheme } from '@rneui/themed';
import 'react-native-gesture-handler';

const theme = createTheme({
  mode: 'light',
});

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
