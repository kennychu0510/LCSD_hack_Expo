import { Entypo, MaterialCommunityIcons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import _ from 'lodash';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import SportCard from '../components/SportCard';
import useEnquiryContext from '../hooks/useEnquiryContext';
import { ITimeSlot } from '../utilities/resultParser';
import { getSportIcon } from '../utilities/sportIcon';
const Results = () => {
  const enquiryResult = useEnquiryContext();
  const result = enquiryResult.enquiry;
  const [timeslotDetail, setTimeslotDetail] = useState<ITimeSlot | null>(null);

  if (!result) return null;

  const timeslotGroupByFacility = Object.values(_.groupBy(result.timeSlots, 'facilityName'));
  const availableTimes = _.uniqBy(result.timeSlots, 'start');

  console.log(JSON.stringify(result));

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{ alignSelf: 'center' }}>
          <SportCard icon={getSportIcon(result?.venue.sportName)} name={result.venue.sportName} />
        </View>
        <View style={styles.resultsContainer}>
          <View style={styles.row}>
            <MaterialIcons name="date-range" size={24} color="black" style={styles.icon} />
            <Text style={styles.text}>{result.date.toLocaleDateString()}</Text>
          </View>
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="office-building-marker-outline"
              size={24}
              color="black"
              style={styles.icon}
            />
            <Text style={[styles.text, { textAlign: 'right' }]}>{result.venue.venueName}</Text>
          </View>
          <View style={styles.row}>
            <Entypo name="location-pin" size={24} color="black" style={styles.icon} />
            <Text style={[styles.text, { textAlign: 'right' }]}>{result.venue.address}</Text>
          </View>

          {result.timeSlots.length === 0 ? (
            <Text style={[styles.text, styles.bold, { marginTop: 10 }]}>No Sessions Available</Text>
          ) : (
            <>
              <Text style={[styles.text, styles.bold, { marginTop: 10 }]}>Available Sessions</Text>
              <Text>
                Enquired at {result.enquiryTime.toLocaleDateString()}{' '}
                {result.enquiryTime.toLocaleTimeString()}
              </Text>
              <View style={styles.scheduleContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <View>
                    <View style={styles.cell}>
                      <Text style={{ textAlign: 'center' }}>No.</Text>
                    </View>

                    {availableTimes.map((time) => (
                      <View style={styles.cell} key={time.start}>
                        <Text key={time.start} style={{ textAlign: 'center' }}>
                          {`${time.start} ~ ${time.end}`}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <ScrollView horizontal bounces={false}>
                    <View style={{ flexDirection: 'row' }}>
                      {timeslotGroupByFacility.map((timeSlots) => (
                        <View key={getCourtNo(timeSlots.at(0)?.facilityName ?? '')}>
                          <View style={[styles.cell, styles.timeSlot]}>
                            <Text>{getCourtNo(timeSlots.at(0)?.facilityName ?? '')}</Text>
                          </View>
                          {_.uniqBy(timeSlots, 'start').map((slot, idx) => (
                            <TouchableOpacity
                              key={slot.start}
                              onPress={() => setTimeslotDetail(slot)}>
                              <View
                                style={[
                                  styles.cell,
                                  styles.timeSlot,
                                  { backgroundColor: slot.status === 'A' ? '#90ee90' : 'pink' },
                                ]}>
                                <Text>{slot.status}</Text>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
      <Modal visible={!!timeslotDetail} transparent statusBarTranslucent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setTimeslotDetail(null)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.6)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={styles.detailCard}>
              <View style={{ alignSelf: 'center', marginBottom: 10 }}>
                <SportCard
                  icon={getSportIcon(result?.venue.sportName)}
                  name={result.venue.sportName}
                />
              </View>
              <View style={styles.row}>
                <MaterialIcons name="date-range" size={24} color="black" style={styles.icon} />
                <Text style={styles.text}>{result.date.toLocaleDateString()}</Text>
              </View>
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name="office-building-marker-outline"
                  size={24}
                  color="black"
                  style={styles.icon}
                />
                <Text style={[styles.text, { textAlign: 'right' }]}>{result.venue.venueName}</Text>
              </View>
              <View style={styles.row}>
                <Entypo name="location-pin" size={24} color="black" style={styles.icon} />
                <Text style={[styles.text, { textAlign: 'right' }]}>
                  {result.venue.address.trim()}
                </Text>
              </View>
              <View style={styles.row}>
                <Entypo name="info" size={22} color="black" />
                <Text style={styles.text}>{timeslotDetail?.facilityName}</Text>
              </View>
              <View style={styles.row}>
                <AntDesign name="clockcircleo" size={22} color="black" />
                <Text
                  style={styles.text}>{`${timeslotDetail?.start} ~ ${timeslotDetail?.end}`}</Text>
              </View>
              <View style={[styles.row, { justifyContent: 'center' }]}>
                {timeslotDetail?.status === 'A' ? (
                  <Text style={[styles.text, { color: '#90ee90', fontWeight: 'bold' }]}>
                    AVAILABLE
                  </Text>
                ) : (
                  <Text style={[styles.text, { color: 'red', fontWeight: 'bold' }]}>
                    UNAVAILABLE
                  </Text>
                )}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default Results;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingVertical: 10,
  },
  resultsContainer: {
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  text: {
    fontSize: 20,
    flexShrink: 1,
  },
  bold: {
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 10,
  },
  headerRow: {
    backgroundColor: '#f1f8ff',
    height: 80,
  },
  cell: {
    borderWidth: 1,
    padding: 5,
    width: 100,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeSlot: {
    width: 30,
  },
  scheduleContainer: {
    marginVertical: 5,
  },
  detailCard: {
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
  },
});

function getCourtNo(input: string): string {
  return input.split('.').at(1)?.trim() ?? '';
}
