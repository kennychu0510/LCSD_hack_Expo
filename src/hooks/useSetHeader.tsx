import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const useSetHeader = (header: string) => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      title: header,
    });
  }, []);
};

export default useSetHeader;

const styles = StyleSheet.create({});
