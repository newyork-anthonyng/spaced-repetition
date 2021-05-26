import React from 'react';
import { View, Button, Image, Pressable, StyleSheet, Text } from 'react-native';
import { Audio } from 'expo-av';
import speaker from '../assets/speaker.png';

function Speaker({ src, onPlay }) {
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(src);

    await sound.playAsync();
    if (onPlay) {
      onPlay();
    }
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={playSound}
      >
        <Image
          source={speaker}
          style={styles.image}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowOffset: {
      width: 8,
      height: 8
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 25,
    width: 175
  },
  image: {
    height: 100,
    width: 100
  }
});

export default Speaker;
