import { Entypo } from '@expo/vector-icons';
import { Button, SearchBar } from '@rneui/themed';
import _ from 'lodash';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import VenueOptions from '../../assets/venueOptions.json';
import LcsdMap from './LcsdMap';
import { FontAwesome } from '@expo/vector-icons';

type Props = {
  setVenue: (venue: string) => void;
  venue: string;
  facility: ISport | null;
  clearFacility: () => void;
};

const SortedVenues = _.sortBy(VenueOptions, ['venueName']);

const VenueSelect = (props: Props) => {
  const { setVenue, venue, facility, clearFacility } = props;
  const [searchValue, setSearchValue] = useState('');
  const [showMap, setShowMap] = useState(false);

  const filteredVenues = SortedVenues.filter((venue) =>
    venue.sportValue.includes(facility?.value ?? '')
  ).filter((item) => item.venueName.includes(searchValue));
  const uniqueVenues = _.uniqBy(filteredVenues, 'venueValue');

  function onSetVenueViaMap(venue: string) {
    setVenue(venue);
    clearFacility();
  }

  return (
    <View style={{ flex: 1 }}>
      <SearchBar
        value={searchValue}
        onChangeText={setSearchValue}
        platform="ios"
        containerStyle={{ paddingHorizontal: 10 }}
        placeholder="Venue"
      />
      <FlatList
        data={uniqueVenues}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.venueContainer} onPress={() => setVenue(item.venueValue)}>
            <Text style={[styles.venueName, venue === item.venueValue && { color: 'green' }]}>
              {item.venueName}
            </Text>
            {venue === item.venueValue && <Entypo name="check" size={24} color="green" />}
          </TouchableOpacity>
        )}
      />
      <View style={{ margin: 20 }}>
        <Button
          iconRight
          icon={
            <FontAwesome style={{ marginHorizontal: 20 }} name="map-o" size={24} color="white" />
          }
          onPress={() => setShowMap(true)}>
          Find on Map
        </Button>
      </View>
      {showMap && <LcsdMap onClose={() => setShowMap(false)} setVenue={onSetVenueViaMap} />}
    </View>
  );
};

export default VenueSelect;

const styles = StyleSheet.create({
  venueContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  venueName: {
    fontSize: 20,
    flexShrink: 1,
  },
  tabContainer: {},
});
