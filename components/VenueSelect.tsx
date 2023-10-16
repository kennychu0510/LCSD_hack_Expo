import _ from 'lodash';
import React, { useState, useMemo } from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  TextInput,
} from 'react-native';
import Images from '../assets/index';
import VenueOptions from '../assets/venueOptions.min.json';
import Tick from './Tick';
import LCSDMap from './LCSDMap';
import useRecentEnquiries from '../hooks/useRecentEnquiries';
import { getVenueByValue } from '../utilities/helper';

type Props = {
  setVenue: (venue: string) => void;
  venue: string;
  facility: ISport | null;
  clearFacility: () => void;
};

function getFilteredVenues() {}

//@ts-ignore
const SortedVenues = _.sortBy(VenueOptions, ['venueName']);

const VenueSelect = (props: Props) => {
  const { setVenue, venue, facility, clearFacility } = props;
  const [searchValue, setSearchValue] = useState('');
  const [mapOpen, setMapOpen] = useState(false);

  const filteredVenues = useMemo(() => {
    if (!facility) {
      return SortedVenues.filter((item) =>
        item.venueName.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    return SortedVenues.filter(
      (venue) => venue.sportValue === facility.value
    ).filter((item) =>
      item.venueName.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, []);

  const uniqueVenues = _.uniqBy(filteredVenues, 'venueValue');

  function onSetVenue(venue: string) {
    clearFacility();
    setVenue(venue);
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 15,
          marginBottom: 10,
          alignItems: 'center',
        }}>
        <TextInput
          style={styles.searchBar}
          placeholderTextColor={'#888'}
          placeholder="Find a venue"
          value={searchValue}
          onChangeText={setSearchValue}
        />
        <TouchableOpacity onPress={() => setMapOpen(true)}>
          <Image source={Images.map} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={uniqueVenues}
        ListHeaderComponent={
          <Text style={[styles.label, { marginHorizontal: 15 }]}>
            Available Venues
          </Text>
        }
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.venueContainer}
            onPress={() => setVenue(item.venueValue)}>
            <Text
              style={[
                styles.venueName,
                venue === item.venueValue && { color: 'green' },
              ]}>
              {item.venueName}
            </Text>
            {venue === item.venueValue && <Tick />}
          </TouchableOpacity>
        )}
      />
      {mapOpen && (
        <LCSDMap onClose={() => setMapOpen(false)} setVenue={onSetVenue} />
      )}
    </View>
  );
};

export default VenueSelect;

const styles = StyleSheet.create({
  venueContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  venueName: {
    fontSize: 16,
    flexShrink: 1,
  },
  searchBar: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginVertical: 10,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
