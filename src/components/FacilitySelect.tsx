import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import sports from '../../assets/sports.json';
import SportCard from '../components/SportCard';
import { getSportIcon } from '../utilities/sportIcon';
import { RootStackParamList } from '../navigator/RootNavigator';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Button, SearchBar } from '@rneui/themed';
import { SharedElement } from 'react-navigation-shared-element';

const sportsByAlphabetical = [...sports].sort((a, b) => {
  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;
  return 0;
});

const sportsWithIcon = sportsByAlphabetical.map((item) => ({ ...item, icon: getSportIcon(item.name) }));

type Props = {
  selectedFacilities: ISport[];
  setFacilities: (sport: ISport) => void;
  onReset: () => void;
};

const FacilitySelect = (props: Props) => {
  const { setFacilities: setFacility, selectedFacilities, onReset } = props;
  const [searchValue, setSearchValue] = useState('');
  const sortedSports = sportsWithIcon.filter((sport) => sport.name.includes(searchValue));

  return (
    <>
      <SearchBar value={searchValue} onChangeText={setSearchValue} platform='ios' placeholder='Facility' containerStyle={{paddingHorizontal: 10}}/>
      <Button onPress={onReset} style={{ paddingHorizontal: 20, paddingBottom: 10, backgroundColor: '#FFF' }}>
        Reset
      </Button>

      <FlatList
        data={sortedSports}
        numColumns={3}
        contentContainerStyle={{ padding: 5, paddingBottom: 130 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => setFacility(item)}>
            <SportCard {...item} selected={selectedFacilities.find((selected) => selected.value === item.value) !== undefined} />
          </TouchableOpacity>
        )}
      />
    </>
  );
};

export default FacilitySelect;
