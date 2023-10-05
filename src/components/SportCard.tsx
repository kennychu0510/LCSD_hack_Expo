import { Dimensions, Image, ImageProps, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';

const ITEM_WIDTH = (Dimensions.get('window').width - 5 * 2) / 3;

export type SportCardProps = {
  name: string;
  icon: ImageProps;
};

const SportCard = (props: SportCardProps) => {
  const { name, icon } = props;
  return (
    <View style={styles.sportItemContainer}>
      <View style={styles.sportCard}>
        <View style={{ justifyContent: 'center', alignItems: 'center', height: 50 }}>
          <Image source={icon} style={styles.icon} />
        </View>
        <Text style={styles.sportName}>{name}</Text>
      </View>
    </View>
  );
};

export default SportCard;

const styles = StyleSheet.create({
  sportItemContainer: {
    flexShrink: 1,
    width: ITEM_WIDTH,
    height: 140,
  },
  sportName: {
    textAlign: 'center',
  },
  sportCard: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#FFF',
    flex: 1,
    justifyContent: 'space-around',
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});
