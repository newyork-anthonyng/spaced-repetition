import React from "react";
import { View, Image, Pressable, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import speaker from "../assets/speaker.png";
import { createMachine } from "xstate";
import { useMachine } from "@xstate/react";

const machine = createMachine({
  id: "speaker",
  initial: "idle",
  states: {
    idle: {
      on: {
        play: "playing",
      },
    },
    playing: {
      entry: "playSound",
      on: {
        done: "idle",
      },
    },
  },
});

function Speaker({ src, onPlay }) {
  const [state, send] = useMachine(machine, {
    actions: {
      playSound,
    },
  });

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      { uri: src },
      {},
      (status) => {
        if (status.didJustFinish) {
          send("done");
        }
      }
    );

    await sound.playAsync();
    if (onPlay) {
      onPlay();
    }
  }

  function handlePress() {
    send("play");
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={handlePress} style={styles.pressable}>
        <Image source={speaker} style={styles.image} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    backgroundColor: "white",
    borderRadius: 25,
    width: 175,
  },
  pressable: {
    padding: 30,
  },
  image: {
    height: 100,
    width: 100,
  },
});

export default Speaker;
