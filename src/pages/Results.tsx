import { AntDesign, Entypo, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import _ from 'lodash';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SportCard from '../components/SportCard';
import useEnquiryContext from '../hooks/useEnquiryContext';
import { SCREEN_HEIGHT } from '../utilities/constants';
import { ITimeSlot } from '../utilities/resultParser';
import { getSportIcon } from '../utilities/sportIcon';
const Results = () => {
  const enquiryResult = useEnquiryContext();
  const result = enquiryResult.enquiry;
  const [timeslotDetail, setTimeslotDetail] = useState<ITimeSlot | null>(null);
  const insets = useSafeAreaInsets();
  const timeslotScrollRef = useRef<ScrollView>(null);
  const headerScrollRef = useRef<ScrollView>(null);
  const headerRowRef = useRef<View>(null);
  const [headerPageY, setHeaderPageY] = useState(SCREEN_HEIGHT);
  const [showFixedHeader, setShowFixedHeader] = useState(false);

  if (!result) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#444' }}>There are no previous records</Text>
      </View>
    );
  }

  const timeslotGroupByFacility = Object.values(_.groupBy(result.timeSlots, 'facilityName'));
  const availableTimes = _.uniqBy(result.timeSlots, 'start');

  return (
    <View style={styles.container}>
      <ScrollView
        scrollEventThrottle={1}
        onScroll={(e) => {
          const { y } = e.nativeEvent.contentOffset;
          setShowFixedHeader(y > headerPageY - 3 * 30);
        }}>
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
              <Text style={{ textAlign: 'right' }}>{moment(result.enquiryTime).fromNow()}</Text>
              <View style={styles.scheduleContainer}>
                <View
                  style={{ flexDirection: 'row' }}
                  onLayout={() => {
                    headerRowRef.current?.measure((x, y, width, height, pageX, pageY) => {
                      setHeaderPageY(pageY);
                    });
                  }}>
                  <View>
                    <View style={[styles.cell]} ref={headerRowRef}>
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
                  <ScrollView
                    horizontal
                    bounces={false}
                    ref={timeslotScrollRef}
                    scrollEventThrottle={16}
                    onScroll={(e) => {
                      const { x, y } = e.nativeEvent.contentOffset;
                      headerScrollRef.current?.scrollTo({ x, y: 0, animated: false });
                    }}>
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
      {showFixedHeader && (
        <View
          style={{
            position: 'absolute',
            top: insets.top,
            flexDirection: 'row',
            marginHorizontal: 15,
            backgroundColor: '#FFF',
          }}>
          <View style={[styles.cell]}>
            <Text style={{ textAlign: 'center' }}>No.</Text>
          </View>
          <ScrollView ref={headerScrollRef} showsHorizontalScrollIndicator={false} horizontal>
            {timeslotGroupByFacility.map((item) => (
              <View style={[styles.cell, styles.timeSlot]} key={item.at(0)?.facilityName}>
                <Text>{getCourtNo(item.at(0)?.facilityName ?? '')}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

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
              <Text style={{ color: '#333', textAlign: 'right' }}>
                {moment(result.enquiryTime).fromNow()}
              </Text>
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
