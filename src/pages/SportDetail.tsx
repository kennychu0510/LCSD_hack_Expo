import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import SportCard from '../components/SportCard';
import { RootStackParamList } from '../navigator/RootNavigator';
import useSetHeader from '../hooks/useSetHeader';
import { SharedElement } from 'react-navigation-shared-element';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

const MaxDate = moment().add(8, 'd').toDate();
const Today = new Date();

type EnquiryOption = {
  date: Date;
};

const SportDetail = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const sportCard = route.params.sportCard;
  const [date, setDate] = useState<Date>(Today);

  useSetHeader(sportCard.name);

  return (
    <View style={{ flex: 1, paddingHorizontal: 10 }}>
      <View style={styles.topSection}>
        <SharedElement id={sportCard.name}>
          <SportCard {...sportCard} />
        </SharedElement>
      </View>
      <View style={styles.row}>
        <Text style={{ fontSize: 20 }}>Date</Text>
        <DateTimePicker
          value={date}
          maximumDate={MaxDate}
          minimumDate={Today}
          onChange={(_, date) => {
            date && setDate(date);
          }}
        />
      </View>
    </View>
  );
};

export default SportDetail;

const styles = StyleSheet.create({
  topSection: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
});
