import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Button, ListItem } from '@rneui/themed';
import moment from 'moment';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import sportIcons from '../../assets/sportIcons';
import EnquiryWebview from '../components/EnquiryWebview';
import FacilitySelect from '../components/FacilitySelect';
import VenueSelect from '../components/VenueSelect';
import useEnquiryContext from '../hooks/useEnquiryContext';
import { RootStackParamList } from '../navigator/RootNavigator';
import { IS_ANDROID, IS_IOS } from '../utilities/constants';
import { getEnquiryOption, getVenueByValue } from '../utilities/helper';
import { getSportIcon } from '../utilities/sportIcon';

const MaxDate = moment().add(7, 'd').toDate();
const Today = getToday();

function getToday() {
  if (moment().get('hour') > 21) {
    return moment().add(1, 'd').toDate();
  }
  return moment().toDate();
}

type LandingScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const Landing = () => {
  const navigation = useNavigation<LandingScreenNavigationProp>();
  const [selectedDate, setSelectedDate] = useState(Today);
  const [selectedFacility, setSelectedFacility] = useState<ISport | null>(null);
  const [facilityExpanded, setFacilityExpanded] = useState(false);
  const [venueExpanded, setVenueExpanded] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { enquiry } = useEnquiryContext();
  const [isEnquiring, setIsEnquiring] = useState(false);

  function onResetFacilities() {
    setSelectedFacility(null);
  }

  function onSetFacility(facility: ISport) {
    setSelectedFacility(facility);
    setFacilityExpanded(false);
  }

  function onSetVenue(venue: string) {
    setSelectedVenue(venue);
    setVenueExpanded(false);
  }

  function onSetDate(date: Date) {
    setSelectedDate(date);
    setShowDatePicker(false);
  }

  function goToResults() {
    navigation.navigate('Results');
  }

  function onChangeTab(tab: 'facility' | 'venue') {
    if (tab === 'facility') {
      setVenueExpanded(false)
      setFacilityExpanded(state => !state)
    } else {
      setFacilityExpanded(false)
      setVenueExpanded(state => !state)
    }
  }

  function clearFacility() {
    setSelectedFacility(null)
  }

  const enquiredVenue = getEnquiryOption(selectedFacility, selectedVenue);
  const tabExpanded = facilityExpanded || venueExpanded;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity
          disabled={IS_IOS}
          style={[styles.row, { paddingBottom: 5 }]}
          onPress={() => setShowDatePicker(true)}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialIcons name="date-range" size={24} color="black" style={{ marginRight: 20 }} />
            <Text style={{ fontSize: 20 }}>Date</Text>
          </View>
          {IS_IOS ? (
            <DateTimePicker
              value={selectedDate}
              maximumDate={MaxDate}
              minimumDate={Today}
              onChange={(_, date) => {
                date && onSetDate(date);
              }}
            />
          ) : (
            showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                maximumDate={MaxDate}
                minimumDate={Today}
                onChange={(_, date) => {
                  date && onSetDate(date);
                }}
              />
            )
          )}
          {IS_ANDROID && <Text style={{ fontSize: 20 }}>{selectedDate.toLocaleDateString()}</Text>}
        </TouchableOpacity>
        <ListItem.Accordion
          content={
            <>
              <Image
                source={
                  selectedFacility ? getSportIcon(selectedFacility.name) : sportIcons.lcsd_logo
                }
                style={{ width: 24, height: 24, resizeMode: 'contain' }}
              />
              <Text style={[styles.tabLabel, { color: selectedFacility ? '#000' : '#555' }]}>
                {selectedFacility?.name ?? 'Select a Facility'}
              </Text>
            </>
          }
          isExpanded={facilityExpanded}
          onPress={() => onChangeTab('facility')}
        />

        <ListItem.Accordion
          content={
            <>
              <MaterialCommunityIcons
                name="office-building-marker-outline"
                size={24}
                color="black"
              />
              <Text style={[styles.tabLabel, { color: selectedVenue ? '#000' : '#555' }]}>
                {getVenueByValue(selectedVenue)?.venueName ?? 'Select a Venue'}
              </Text>
            </>
          }
          isExpanded={venueExpanded}
          onPress={() => onChangeTab('venue')}
        />

        {facilityExpanded && (
          <FacilitySelect
            setFacility={onSetFacility}
            selectedFacility={selectedFacility}
            onReset={onResetFacilities}
            selectedVenue={selectedVenue}
            clearFacility={clearFacility}
          />
        )}
        {venueExpanded && (
          <VenueSelect setVenue={onSetVenue} venue={selectedVenue} facility={selectedFacility} clearFacility={clearFacility} />
        )}

        <View style={{ position: tabExpanded ? 'absolute' : 'relative', flex: 1, zIndex: -1 }}>
          <EnquiryWebview
            date={selectedDate}
            enquiredVenue={enquiredVenue}
            setIsEnquiring={setIsEnquiring}
          />
          {!!enquiry && !isEnquiring && (
            <View style={{ paddingHorizontal: 20, backgroundColor: '#FFF', paddingTop: 20 }}>
              <Button onPress={goToResults}>Last Enquiry Result</Button>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Landing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabLabel: {
    flex: 1,
    fontSize: 20,
    marginLeft: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
  },
});
