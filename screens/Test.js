import React from "react";
import { StyleSheet, View, Text } from "react-native";
import ProgressBar from "../components/ProgressBar";
import machine from "../machines/test";
import { useMachine } from "@xstate/react";
import Speaker from "../components/Speaker";
import MultipleChoice from "../components/MultipleChoice";
import CorrectImage from "../components/CorrectImage";
import IncorrectImage from "../components/IncorrectImage";
import CompletedScreen from "../components/CompletedScreen";
import { Audio } from "expo-av";
import CallToAction from "../components/CallToAction";

const celebrationAudios = [
  require("../assets/audio/correct1.m4a"),
  require("../assets/audio/correct2.m4a"),
  require("../assets/audio/correct3.m4a"),
];
function getRandomCorrectAudioNoise() {
  const randomIndex = Math.floor(Math.random() * celebrationAudios.length);
  const item = celebrationAudios[randomIndex];

  return item;
}

async function playIncorrectAudio() {
  const { sound } = await Audio.Sound.createAsync(
    require("../assets/audio/incorrect.m4a")
  );
  await sound.playAsync();
}

async function playCorrectAudio() {
  const { sound } = await Audio.Sound.createAsync(getRandomCorrectAudioNoise());
  await sound.playAsync();
}

function Test() {
  const [state, send] = useMachine(machine, {
    actions: {
      playIncorrectAudio: playIncorrectAudio,
      playCorrectAudio: playCorrectAudio,
    },
  });
  const { context } = state;

  const currentIndex = context.currentIndex;
  const items = context.items || [];
  const currentItem = items[currentIndex] || {};
  const choices = currentItem.choices || [];
  const audioSource = currentItem.audio;
  const percentage = (currentIndex / items.length) * 100;

  function handleMultipleChoicePress(choice) {
    return () => {
      if (choice === currentItem.answer) {
        send("CORRECT");
      } else {
        send("WRONG");
      }
    };
  }

  function handleCorrectImageAnimationEnd() {
    send("NEXT");
  }

  function handleIncorrectImageAnimationEnd() {
    send("NEXT");
  }

  function handlePlay() {
    send("LISTEN");
  }

  let body = choices.map((choice, index) => (
    <MultipleChoice
      key={index}
      title={choice}
      onPress={handleMultipleChoicePress(choice)}
    />
  ));

  const shouldShowChoices = state.matches("idle");
  const shouldShowSpeaker = ["idle", "readyToListen"].some(state.matches);

  if (state.matches("loading")) {
    return <Text>Loading...</Text>;
  }

  if (state.matches("empty")) {
    return <Text>Empty...</Text>;
  }

  return (
    <View style={styles.app}>
      <View style={styles.leftContainer}>
        <ProgressBar percentage={percentage} />
      </View>

      <View style={styles.rightContainer}>
        {state.matches("complete") ? (
          <CompletedScreen />
        ) : (
          <React.Fragment>
            {shouldShowSpeaker && (
              <View style={{ marginBottom: 52 }}>
                <Speaker src={audioSource} onPlay={handlePlay} />
                {
                  state.matches('readyToListen') && (
                    <View
                      style={{ position: 'absolute', bottom: -100, right: -90, zIndex: 1 }}
                      pointerEvents='none'
                    >
                      <CallToAction />
                    </View>
                  )
                }
              </View>
            )}

            {shouldShowChoices && body}

            {state.matches("correct") && (
              <CorrectImage onEnd={handleCorrectImageAnimationEnd} />
            )}
            {state.matches("incorrect") && (
              <IncorrectImage onEnd={handleIncorrectImageAnimationEnd} />
            )}
          </React.Fragment>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    position: "absolute",
    top: 10,
    right: 0,
    left: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#F2F2F2",
  },
  leftContainer: {
    height: "100%",
    width: "25%",
  },
  rightContainer: {
    height: "100%",
    marginTop: 50,
    marginLeft: 20,
  },
});

export default Test;
