import { Button, SearchBar } from '@rneui/themed';
import React, { useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import sports from '../../assets/sports.json';
import SportCard from '../components/SportCard';
import { SCREEN_HEIGHT } from '../utilities/constants';
import { getSportIcon } from '../utilities/sportIcon';

const sportsByAlphabetical = [...sports].sort((a, b) => {
  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;
  return 0;
});

const sportsWithIcon = sportsByAlphabetical.map((item) => ({ ...item, icon: getSportIcon(item.name) }));

type Props = {
  selectedFacility: ISport | null;
  setFacilities: (sport: ISport) => void;
  onReset: () => void;
};

const FacilitySelect = (props: Props) => {
  const { setFacilities: setFacility, selectedFacility, onReset } = props;
  const [searchValue, setSearchValue] = useState('');
  const sortedSports = sportsWithIcon.filter((sport) => sport.name.includes(searchValue));
  const [offset, setOffset] = useState(0);

  return (
    <>
      <SearchBar value={searchValue} onChangeText={setSearchValue} platform='ios' placeholder='Facility' containerStyle={{ paddingHorizontal: 10 }} />
      <FlatList
        onLayout={(e) => {
          setOffset(e.nativeEvent.layout.y);
        }}
        data={sortedSports}
        numColumns={3}
        style={{ height: SCREEN_HEIGHT - offset }}
        contentContainerStyle={{ padding: 5, paddingBottom: offset + 10 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => setFacility(item)}>
            <SportCard {...item} selected={selectedFacility?.value === item.value} />
          </TouchableOpacity>
        )}
      />
    </>
  );
};

export default FacilitySelect;
