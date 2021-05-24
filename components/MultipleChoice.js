import React from 'react';
import { Animated, StyleSheet, View, Text, Button, Pressable } from 'react-native';

function MultipleChoice({ onPress, title }) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onPress}>
        <Text style={styles.text}>{title}</Text>
    </Pressable>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowOffset: {
      width: 3,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    width: 195,
    marginBottom: 30
  },
  text: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 30
  }
});

export default MultipleChoice;
