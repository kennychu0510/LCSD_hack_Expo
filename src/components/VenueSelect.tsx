import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { SearchBar } from '@rneui/themed';
import { Entypo } from '@expo/vector-icons';
import { SCREEN_HEIGHT } from '../utilities/constants';
import VenueOptions from '../../assets/venueOptions.json';
import _ from 'lodash';

type Props = {
  setVenue: React.Dispatch<React.SetStateAction<string>>;
  venue: string;
  facilities: ISport[];
};

const Venues = _.uniqBy(VenueOptions, 'venueValue');
const SortedVenues = _.sortBy(Venues, ['venueName']);

const VenueSelect = (props: Props) => {
  const { setVenue, venue, facilities } = props;
  const [searchValue, setSearchValue] = useState('');

  const facility = facilities.at(0);
  const filteredVenues = SortedVenues.filter((item) => item.venueName.includes(searchValue)).filter((venue) => venue.facilityTypeName.includes(facility?.name ?? ''));

  const [offset, setOffset] = useState(0);

  return (
    <>
      <SearchBar value={searchValue} onChangeText={setSearchValue} platform='ios' containerStyle={{ paddingHorizontal: 10 }} placeholder='Venue' />
      <FlatList
        onLayout={(e) => {
          setOffset(e.nativeEvent.layout.y);
          console.log(e.nativeEvent.layout.y)
        }}
        style={{ height: SCREEN_HEIGHT - offset - 75 }}
        contentContainerStyle={{ paddingBottom: offset + 75 + 10 }}
        data={filteredVenues}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.venueContainer} onPress={() => setVenue(item.venueValue)}>
            <Text style={[styles.venueName, venue === item.venueValue && { color: 'green' }]}>{item.venueName}</Text>
            {venue === item.venueValue && <Entypo name='check' size={24} color='green' />}
          </TouchableOpacity>
        )}
      />
    </>
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
});
