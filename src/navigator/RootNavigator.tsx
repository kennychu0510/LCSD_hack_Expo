import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import Landing from '../pages/Landing';
import Results from '../pages/Results';

const Stack = createStackNavigator();

export type RootStackParamList = {
  Home: undefined;
  Results: undefined;
};

const RootNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Landing}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Results" component={Results} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
