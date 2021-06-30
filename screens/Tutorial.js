import React from "react";
import { StyleSheet, View, Text } from "react-native";
import machine from "../machines/tutorial";
import { useMachine } from "@xstate/react";
import Button from "../components/MultipleChoice";
import Speaker from "../components/Speaker";
import CallToAction from "../components/CallToAction";

function Tutorial({ navigation }) {
  const [state, send] = useMachine(machine, {
    actions: {
      onComplete: () => {
        navigation.navigate("Test");
      },
    },
  });
  const { context } = state;

  const currentIndex = context.currentIndex;
  const items = context.items || [];
  const currentItem = items[currentIndex] || {};
  const audioSource = currentItem.audio;

  function handleNextPress() {
    send("next");
  }

  function handlePlay() {
    send("listen");
  }

  if (state.matches("loading")) {
    return <Text>Loading...</Text>;
  }

  if (state.matches("empty")) {
    return <Text>Empty...</Text>;
  }

  return (
    <View style={styles.app}>
      <View style={styles.top}>
        <View style={styles.speaker}>
          <Speaker src={audioSource} onPlay={handlePlay} />

          {state.matches("ready") && (
            <View
              style={{ position: "absolute", right: -90, bottom: -100 }}
              pointerEvents="none"
            >
              <CallToAction />
            </View>
          )}
        </View>
        <Text style={styles.text}>{currentItem.text}</Text>
      </View>

      {state.matches('listened') && (
        <View style={styles.bottom}>
          <View>
            <Button onPress={handleNextPress} title="➡️" />
            <View
              style={{ position: "absolute", right: -90, bottom: -80 }}
              pointerEvents="none"
            >
              <CallToAction />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "#F2F2F2",
  },
  top: {
    display: "flex",
    alignItems: "center",
    marginBottom: 48,
    marginTop: 48,
  },
  speaker: {
    marginBottom: 24,
  },
  text: {
    fontSize: 48,
  },
  bottom: {
    display: "flex",
    alignItems: "center",
  },
});

export default Tutorial;
