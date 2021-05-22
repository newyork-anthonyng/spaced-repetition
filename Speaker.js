import React from 'react';
import { View, Button, Image, Pressable, StyleSheet, Text } from 'react-native';
import { Audio } from 'expo-av';
import speaker from './assets/speaker.png';

function Speaker({ src, onPlay }) {
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync({
      uri: src
    });

    await sound.playAsync();
    if (onPlay) {
      onPlay();
    }
  }

  return (
    <View>
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
  image: {
    height: 100,
    width: 100,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
  }
});

export default Speaker;
