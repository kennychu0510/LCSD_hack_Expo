import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const Loading = () => {
  return (
    <View style={[styles.loadingScreen, StyleSheet.absoluteFill]}>
      <ActivityIndicator size="large" />
      {/* {showCancel && (
        <View style={styles.cancel}>
          <Button
            title="Cancel"
            onPress={onCancel}
          ></Button>
        </View>
      )} */}
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  loadingScreen: {
    position: 'absolute',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
});
