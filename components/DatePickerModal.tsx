import { StyleSheet, Text, View, Modal, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import moment, { Moment } from 'moment';
import { SCREEN_WIDTH, DATE_FORMAT } from '../utilities/constants';
import Images from '../assets/index'
import { getToday } from '../utilities/helper'
import Tick from './Tick'

function getAvailableDates() {
  let start = 0
   if (moment().get('hour') > 21) {
     start = 1
   }
  const dates: Moment[] = [];
  for (let i = 0; i < 7; i++) {
    dates.push(moment().add('d', i));
  }
  return dates;
}

const availableDates = getAvailableDates();

type Props = {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  closeModal: () => void
};

function isSameDate(date1: Moment, date2: Moment) {
  return date1.isSame(date2, 'day')
}

const DatePickerModal = (props: Props) => {
  const { selectedDate, setSelectedDate, closeModal } = props;
  return (
    <Modal style={styles.root} transparent visible statusBarTranslucent animationType='fade'>
    <TouchableWithoutFeedback onPress={closeModal}>
      <View style={styles.background}>
        <View style={styles.container}>
          <Text style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>
            Pick a Date
          </Text>
          {availableDates.map((date) => (
            <TouchableOpacity
              key={date.toString()}
              onPress={() => setSelectedDate(date)}>
              <View style={styles.item}>
                <Text style={[styles.text, { fontWeight: isSameDate(moment(selectedDate), date) ? 'bold' : 'normal'}]}>{date.format(DATE_FORMAT)}</Text>
                {isSameDate(moment(selectedDate), date) && <Tick/>}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default DatePickerModal;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    width: SCREEN_WIDTH - 20,
  },
  item: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  text: {
    fontSize: 14
  }
});
