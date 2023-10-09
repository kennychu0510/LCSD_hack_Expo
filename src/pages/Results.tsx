import { Entypo, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import _ from 'lodash';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import SportCard from '../components/SportCard';
import useEnquiryContext from '../hooks/useEnquiryContext';
import { getSportIcon } from '../utilities/sportIcon';

const Results = () => {
  const enquiryResult = useEnquiryContext();
  const result = enquiryResult.enquiry;

  if (!result) return null;

  const timeslotGroupByFacility = Object.values(_.groupBy(result.timeSlots, 'facilityName'));
  const availableTimes = _.uniqBy(result.timeSlots, 'start');

  console.log(JSON.stringify(result))

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{ alignSelf: 'center' }}>
          <SportCard icon={getSportIcon(result?.venue.sportName)} name={result.venue.sportName} />
        </View>
        <View style={styles.resultsContainer}>
          <View style={styles.row}>
            <MaterialIcons name='date-range' size={24} color='black' style={styles.icon} />
            <Text style={styles.text}>{result.date.toLocaleDateString()}</Text>
          </View>
          <View style={styles.row}>
            <MaterialCommunityIcons name='office-building-marker-outline' size={24} color='black' style={styles.icon} />
            <Text style={[styles.text, { textAlign: 'right' }]}>{result.venue.venueName}</Text>
          </View>
          <View style={styles.row}>
            <Entypo name='location-pin' size={24} color='black' style={styles.icon} />
            <Text style={[styles.text, { textAlign: 'right' }]}>{result.venue.address}</Text>
          </View>

          {result.timeSlots.length === 0 ? (
            <Text style={[styles.text, styles.bold, { marginTop: 10 }]}>No Sessions Available</Text>
          ) : (
            <>
              <Text style={[styles.text, styles.bold, { marginTop: 10 }]}>Available Sessions</Text>
              <Text>
                Enquired at {result.enquiryTime.toLocaleDateString()} {result.enquiryTime.toLocaleTimeString()}
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
                            <View key={slot.start} style={[styles.cell, styles.timeSlot, { backgroundColor: slot.status === 'A' ? '#90ee90' : 'pink' }]}>
                              <Text>{slot.status}</Text>
                            </View>
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
});

function getCourtNo(input: string): string {
  return input.split('.').at(1)?.trim() ?? '';
}
