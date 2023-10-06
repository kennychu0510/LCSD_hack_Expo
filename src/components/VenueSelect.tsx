import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { getAllVenues } from '../utilities/helper';
import { SearchBar } from '@rneui/themed';
import { Entypo } from '@expo/vector-icons';
import { SCREEN_HEIGHT } from '../utilities/constants';
const venues = getAllVenues();

type Props = {
  setVenue: React.Dispatch<React.SetStateAction<string>>;
  venue: string;
};

const VenueSelect = (props: Props) => {
  const { setVenue, venue } = props;
  const [searchValue, setSearchValue] = useState('');
  const filteredVenue = venues.filter((item) => item.name.includes(searchValue));
  const [offset, setOffset] = useState(0);

  return (
    <View>
      <SearchBar value={searchValue} onChangeText={setSearchValue} platform='ios' containerStyle={{ paddingHorizontal: 10 }} placeholder='Venue' />
      <FlatList
        onLayout={(e) => {
          setOffset(e.nativeEvent.layout.y);
        }}
        style={{ height: SCREEN_HEIGHT - offset }}
        data={filteredVenue}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.venueContainer} onPress={() => setVenue(item.value)}>
            <Text style={[styles.venueName, venue === item.value && { color: 'green' }]}>{item.name}</Text>
            {venue === item.value && <Entypo name='check' size={24} color='green' />}
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
});
