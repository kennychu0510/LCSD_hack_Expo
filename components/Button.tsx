import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '../utilities/theme';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
};

type Variant = 'primary' | 'secondary' | 'tertiary'

const Button = (props: Props) => {
  const variant = props.variant ?? 'primary'
  
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={[styles.container, getButtonVariant(variant)]}>
        <Text style={styles.text}>{props.label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  text: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  primrayButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary,
  },
  tertiaryButton: {
    backgroundColor: Colors.tertiary,
  },
});

function getButtonVariant(variant: Variant): StyleProp<ViewStyle>  {
  switch (variant) {
    case 'primary':
      return styles.primrayButton
    case 'secondary':
      return styles.secondaryButton
    case 'tertiary':
      return styles.tertiaryButton
    default:
      return styles.primrayButton
  }
}
