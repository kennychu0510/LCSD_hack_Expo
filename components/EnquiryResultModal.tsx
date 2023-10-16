import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import { Venue } from '../utilities/helper';
import Button from './Button';
import { getSportIcon } from '../utilities/sportIcon';
import SportCard from './SportCard';
import moment from 'moment';
import Images from '../assets/index';
import _ from 'lodash';
import { DATE_FORMAT } from '../utilities/constants'

export type EnquiryResult = {
  date: Date;
  timeSlots: ITimeSlot[];
  venue: Venue;
  enquiryTime: Date;
};

type Props = {
  closeModal: () => void;
  results: EnquiryResult;
};

const EnquiryResultModal = (props: Props) => {
  const { closeModal, results } = props;
  const [timeslotDetail, setTimeslotDetail] = useState<ITimeSlot | null>(null);

  const timeslotGroupByFacility = Object.values(
    _.groupBy(results?.timeSlots, 'facilityName')
  );
  const availableTimes = _.uniqBy(results?.timeSlots, 'start');

  console.log({results: props.results})

  return (
    <Modal visible animationType="fade">
      <SafeAreaView style={{ padding: 20, flex: 1 }}>
        <View style={styles.container}>
          <ScrollView scrollEventThrottle={1}>
            <View style={{ alignSelf: 'center' }}>
              <SportCard
                icon={getSportIcon(results?.venue.sportName ?? '')}
                name={results?.venue.sportName}
              />
            </View>

            <View style={styles.resultsContainer}>
              <View style={styles.row}>
              <Image source={Images.schedule} style={styles.icon} />
                <Text style={styles.text}>
                  {moment(results.date).format(DATE_FORMAT)}
                </Text>
              </View>
              <View style={styles.row}>
                <Image source={Images.venue} style={styles.icon} />
                <Text style={[styles.text, { textAlign: 'right' }]}>
                  {results?.venue.venueName}
                </Text>
              </View>

              {results?.timeSlots.length === 0 ? (
                <Text style={[styles.text, styles.bold, { marginTop: 10 }]}>
                  No Sessions Available
                </Text>
              ) : (
                <>
                  <Text style={[styles.text, styles.bold, { marginTop: 10 }]}>
                    Available Sessions
                  </Text>
                  <Text style={{ textAlign: 'right' }}>
                    {moment(results?.enquiryTime).fromNow()}
                  </Text>
                  <View style={styles.scheduleContainer}>
                    <View style={{ flexDirection: 'row' }}>
                      <View>
                        <View style={styles.cell}>
                          <Text style={{ textAlign: 'center' }}>No.</Text>
                        </View>

                        {availableTimes.map((time) => (
                          <View style={styles.cell} key={time.start}>
                            <Text
                              key={time.start}
                              style={{ textAlign: 'center' }}>
                              {`${time.start} ~ ${time.end}`}
                            </Text>
                          </View>
                        ))}
                      </View>
                      <ScrollView
                        horizontal
                        bounces={false}
                        scrollEventThrottle={16}>
                        <View style={{ flexDirection: 'row' }}>
                          {timeslotGroupByFacility.map((timeSlots) => (
                            <View
                              key={getCourtNo(
                                timeSlots.at(0)?.facilityName ?? ''
                              )}>
                              <View style={[styles.cell, styles.timeSlot]}>
                                <Text>
                                  {getCourtNo(
                                    timeSlots.at(0)?.facilityName ?? ''
                                  )}
                                </Text>
                              </View>
                              {_.uniqBy(timeSlots, 'start').map((slot, idx) => (
                                <TouchableOpacity
                                  key={slot.start}
                                  onPress={() => setTimeslotDetail(slot)}>
                                  <View
                                    style={[
                                      styles.cell,
                                      styles.timeSlot,
                                      {
                                        backgroundColor:
                                          slot.status === 'A'
                                            ? '#90ee90'
                                            : 'pink',
                                      },
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
                  icon={getSportIcon(results.venue.sportName)}
                  name={results.venue.sportName}
                />
              </View>
              <View style={styles.row}>
                <Image source={Images.schedule} style={styles.icon}/>
                <Text style={styles.text}>{moment(results.date).format(DATE_FORMAT)}</Text>
              </View>
              <View style={styles.row}>
                <Image source={Images.venue} style={styles.icon}/>
                <Text style={[styles.text, { textAlign: 'right' }]}>{results.venue.venueName}</Text>
              </View>
              <View style={styles.row}>
                <Image source={Images.lcsd_logo} style={styles.icon}/>
                <Text style={styles.text}>{timeslotDetail?.facilityName}</Text>
              </View>
              <View style={styles.row}>
                <Image source={Images.clock} style={styles.icon}/>
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
                {moment(results.enquiryTime).fromNow()}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
        </View>
        <View style={{padding: 20, alignItems: 'center'}}>
        <Button label={'Return'} onPress={closeModal} />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default EnquiryResultModal;

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
    width: 24,
    height: 24,
    resizeMode: 'contain',
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
