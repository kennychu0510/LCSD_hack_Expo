import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View, Image, Text } from 'react-native';
import sports from '../../assets/sports.json';
import SportCard from '../components/SportCard';
import { getSportIcon } from '../utilities/sportIcon';
import { RootStackParamList } from '../navigator/RootNavigator';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Button, ListItem, SearchBar } from '@rneui/themed';
import { SharedElement } from 'react-navigation-shared-element';
import sportIcons from '../../assets/sportIcons';
import FacilitySelect from '../components/FacilitySelect';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { WebView } from 'react-native-webview';
import { LCSD_URL } from '../utilities/constants';
import EnquiryWebview from '../components/EnquiryWebview';
import { Venue, getVenue } from '../utilities/helper';

const sportsByAlphabetical = [...sports].sort((a, b) => {
  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;
  return 0;
});

const MaxDate = moment().add(7, 'd').toDate();
const Today = new Date();

type LandingScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const Landing = () => {
  const [selectedFacilities, setSelectedFacility] = useState<ISport[]>([]);
  const [selectedDate, setSelectedDate] = useState(Today);

  const navigation = useNavigation<LandingScreenNavigationProp>();
  const [facilityExpanded, setFacilityExpanded] = useState(false);
  const [dateExpanded, setDateExpanded] = useState(false);

  function onSetFacilities(facility: ISport) {
    setSelectedFacility((facilities) => {
      if (facilities?.find((item) => item.value === facility.value)) {
        return facilities.filter((item) => item.value !== facility.value);
      } else {
        return [...facilities, facility];
      }
    });
  }

  function onResetFacilities() {
    setSelectedFacility([]);
  }

  const venues = selectedFacilities.map((item) => getVenue(item)).filter((item) => !!item) as Venue[];

  return (
    <View style={styles.container}>
      <ListItem.Accordion
        content={
          <>
            <Image source={sportIcons.lcsd_logo} style={{ width: 24, height: 24, resizeMode: 'contain' }} />
            <Text style={[styles.tabLabel, { color: selectedFacilities ? '#000' : '#555' }]}>{getFacilityDisplayName(selectedFacilities)}</Text>
          </>
        }
        isExpanded={facilityExpanded}
        onPress={() => setFacilityExpanded((state) => !state)}
      >
        <FacilitySelect setFacilities={onSetFacilities} selectedFacilities={selectedFacilities} onReset={onResetFacilities} />
      </ListItem.Accordion>
      <ListItem.Accordion
        content={
          <>
            <Ionicons name='time-outline' size={24} color='black' />
            <Text style={styles.tabLabel}>{selectedDate.toLocaleDateString()}</Text>
          </>
        }
        isExpanded={dateExpanded}
        onPress={() => setDateExpanded((state) => !state)}
      >
        <View style={styles.row}>
          <Text style={{ fontSize: 20 }}>Date</Text>
          <DateTimePicker
            value={selectedDate}
            maximumDate={MaxDate}
            minimumDate={Today}
            onChange={(_, date) => {
              date && setSelectedDate(date);
              setDateExpanded(false);
            }}
          />
        </View>
      </ListItem.Accordion>
      
      <EnquiryWebview date={selectedDate} venue={venues} />
    </View>
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

function getFacilityDisplayName(facilities: ISport[]): string {
  if (facilities.length === 0) return 'Select a Facility';
  if (facilities.length === 1) return facilities.at(0)!.name;
  return `${facilities.length} Facilities Selected`;
}
