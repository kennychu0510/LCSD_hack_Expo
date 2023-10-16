import React, { useMemo, useState } from 'react';
import {
  FlatList,
  TouchableOpacity,
  View,
  TextInput,
  StyleSheet,
  Text,
} from 'react-native';

import sports from '../assets/sports.json';
import SportCard from '../components/SportCard';
import { getSportIcon } from '../utilities/sportIcon';
import { getAllSportsInVenue, getVenueByValue } from '../utilities/helper';
import useRecentEnquires from '../hooks/useRecentEnquiries';

const sportsByAlphabetical = [...sports].sort((a, b) => {
  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;
  return 0;
});

const sportsWithIcon = sportsByAlphabetical.map((item) => ({
  ...item,
  icon: getSportIcon(item.name),
}));

type Props = {
  selectedFacility: ISport | null;
  setFacility: (sport: ISport) => void;
  onReset: () => void;
  selectedVenue: string;
};

const FacilitySelect = (props: Props) => {
  const { setFacility, selectedFacility, selectedVenue } = props;
  const [searchValue, setSearchValue] = useState('');
  const sortedSports = sportsWithIcon.filter((sport) =>
    sport.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const filteredSports = useMemo(() => {
    if (selectedVenue) {
      const exclusiveSports = getAllSportsInVenue(selectedVenue);
      return sortedSports.filter((sport) =>
        exclusiveSports.find((item) => item.sportValue === sport.value)
      );
    }
    return sortedSports;
  }, [selectedVenue, sortedSports]);

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={styles.searchBar}
        placeholderTextColor={'#888'}
        placeholder="Find a facility"
        value={searchValue}
        onChangeText={setSearchValue}
      />

      <FlatList
        ListHeaderComponent={
          <Text style={[styles.label, { marginHorizontal: 10 }]}>
            Available Facilities
          </Text>
        }
        data={filteredSports}
        numColumns={3}
        contentContainerStyle={{ padding: 5 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => setFacility(item)}>
            <SportCard
              {...item}
              selected={selectedFacility?.value === item.value}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default FacilitySelect;

const styles = StyleSheet.create({
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
    marginHorizontal: 15,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
