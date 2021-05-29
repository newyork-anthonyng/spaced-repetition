import React from "react";
import { StyleSheet, View, Alert } from "react-native";
import ProgressBar from "../components/ProgressBar";
import flashcardMachine from "../machine";
import { useMachine } from "@xstate/react";
import Speaker from "../components/Speaker";
import MultipleChoice from "../components/MultipleChoice";
import CorrectImage from "../components/CorrectImage";
import IncorrectImage from "../components/IncorrectImage";
import CompletedScreen from "../components/CompletedScreen";
import { Audio } from 'expo-av';

async function playIncorrectAudio() {
  const { sound } = await Audio.Sound.createAsync(
    require('../assets/audio/incorrect.m4a')
  );
  await sound.playAsync();
}

async function playCorrectAudio() {
  const { sound } = await Audio.Sound.createAsync(
    require('../assets/audio/correct.m4a')
  );
  await sound.playAsync();
}

function Test() {
  const [state, send] = useMachine(flashcardMachine, {
    actions: {
      playIncorrectAudio: playIncorrectAudio,
      playCorrectAudio: playCorrectAudio
    }
  });
  const { context } = state;

  const currentIndex = context.currentIndex;
  const currentItem = context.items[currentIndex] || {};
  const choices = currentItem.choices || [];
  const audioSource = currentItem.audio;
  const percentage = (currentIndex / context.items.length) * 100;

  function handleRelease(choice) {
    return (coords) => {
      const isInsideZone = coords.y < 200;
      if (!isInsideZone) return;

      if (choice === currentItem.answer) {
        send("CORRECT");
      } else {
        send("WRONG");
      }
    };
  }

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
    top: 0,
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
