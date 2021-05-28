import React from "react";
import { StyleSheet, View, Text } from "react-native";
import tutorialMachine from "../tutorialMachine";
import { useMachine } from "@xstate/react";
import Button from "../components/MultipleChoice";

function Tutorial({ navigation }) {
  const [state, send] = useMachine(tutorialMachine);
  const { context } = state;

  const currentIndex = context.currentIndex;
  const currentItem = context.items[currentIndex] || {};

  function handleNextPress() {
    send("next");
  }

  if (state.matches('complete')) {
    return (
      <View>
        <Button title="Take test" onPress={() => {
          navigation.navigate('Test');
        }} />
      </View>
    );
  }

  return (
    <View style={styles.app}>
      <View style={styles.rightContainer}>
        <Text>{JSON.stringify(state.value, null, 2)}</Text>
        <Text>{currentItem.text}</Text>
        <Button onPress={handleNextPress} title="Next" />
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

export default Tutorial;
