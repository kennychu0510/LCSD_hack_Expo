import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import sports from '../../assets/sports.json';
import SportCard from '../components/SportCard';
import { getSportIcon } from '../utilities/sportIcon';
import { RootStackParamList } from '../navigator/RootNavigator';
import type { StackNavigationProp } from '@react-navigation/stack';
import { SearchBar } from '@rneui/themed';

const sportsByAlphabetical = [...sports].sort((a, b) => {
  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;
  return 0;
});

const sportsWithIcon = sportsByAlphabetical.map((item) => ({ ...item, icon: getSportIcon(item.name) }));
type LandingScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const Landing = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigation = useNavigation<LandingScreenNavigationProp>();

  const sortedSports = sportsWithIcon.filter((sport) => sport.name.includes(searchValue));
  return (
    <View style={styles.container}>
      <SearchBar value={searchValue} onChangeText={setSearchValue} platform='ios' placeholder='Facility' />
      <FlatList
        data={sortedSports}
        numColumns={3}
        contentContainerStyle={{ paddingHorizontal: 5, paddingVertical: 5 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Detail', {
                sportCard: item,
              })
            }
          >
            <SportCard {...item} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Landing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
