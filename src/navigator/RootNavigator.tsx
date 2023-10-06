import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import Landing from '../pages/Landing';
import { SportCardProps } from '../components/SportCard';

const Stack = createStackNavigator();

export type RootStackParamList = {
  Home: undefined;
  Detail: {
    sportCard: SportCardProps;
  };
};

const RootNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Home'
        component={Landing}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({});
