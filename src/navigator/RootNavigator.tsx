import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import Landing from '../pages/Landing';
import SportDetail from '../pages/SportDetail';
import { SportCardProps } from '../components/SportCard';


const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Home: undefined;
  Detail: {
    sportCard: SportCardProps;
  };
};


const RootNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Home' component={Landing} options={{
        headerShown: false
      }}/>
      <Stack.Screen name='Detail' component={SportDetail} />
    </Stack.Navigator>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({});
