import { Entypo } from '@expo/vector-icons';
import { SearchBar } from '@rneui/themed';
import _ from 'lodash';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import VenueOptions from '../../assets/venueOptions.json';

type Props = {
  setVenue: (venue: string) => void;
  venue: string;
  facility: ISport | null;
};

const SortedVenues = _.sortBy(VenueOptions, ['venueName']);

const VenueSelect = (props: Props) => {
  const { setVenue, venue, facility } = props;
  const [searchValue, setSearchValue] = useState('');

  const filteredVenues = SortedVenues.filter((venue) =>
    venue.sportValue.includes(facility?.value ?? '')
  ).filter((item) => item.venueName.includes(searchValue));
  const uniqueVenues = _.uniqBy(filteredVenues, 'venueValue');

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
