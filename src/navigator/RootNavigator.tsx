import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import Landing from '../pages/Landing';
import SportDetail from '../pages/SportDetail';
import { SportCardProps } from '../components/SportCard';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

const Stack = createSharedElementStackNavigator();

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
      <Stack.Screen
        name='Detail'
        component={SportDetail}
        sharedElements={(route) => {
          return [route.params.sportCard.name];
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({});
