import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import SportCard from '../components/SportCard';
import { RootStackParamList } from '../navigator/RootNavigator';
import useSetHeader from '../hooks/useSetHeader';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

const SportDetail = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const sportCard = route.params.sportCard;

  useSetHeader(sportCard.name);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: 'center' }}>
        <SportCard {...sportCard} />
      </View>
    </View>
  );
};

export default SportDetail;

const styles = StyleSheet.create({});
