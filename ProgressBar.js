import React from 'react';
import { Image, Animated, PanResponder, StyleSheet, View, Text, Alert, Button } from 'react-native';

function ProgressBar({ percentage }) {
  return (
    <View style={styles.progressBar}>
      <Animated.View
        style={
          [StyleSheet.absoluteFill],
          {
            backgroundColor: '#88ED4F',
            width: `${percentage}%`
          }
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  progressBar: {
    height: 20,
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 5,
    flexDirection: 'Row'
  }
});

export default ProgressBar;
