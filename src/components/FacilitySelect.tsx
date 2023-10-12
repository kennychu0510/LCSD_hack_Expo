import { SearchBar } from '@rneui/themed';
import React, { useMemo, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';

import sports from '../../assets/sports.json';
import SportCard from '../components/SportCard';
import { getAllSportsInVenue } from '../utilities/helper';
import { getSportIcon } from '../utilities/sportIcon';

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
  const sortedSports = sportsWithIcon.filter((sport) => sport.name.includes(searchValue));

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
      <SearchBar
        value={searchValue}
        onChangeText={setSearchValue}
        platform="ios"
        placeholder="Facility"
        containerStyle={{ paddingHorizontal: 10 }}
      />
      <FlatList
        data={filteredSports}
        numColumns={3}
        contentContainerStyle={{ padding: 5 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => setFacility(item)}>
            <SportCard {...item} selected={selectedFacility?.value === item.value} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default FacilitySelect;
