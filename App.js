import React from "react";
import { StyleSheet, View } from "react-native";
import ProgressBar from "./components/ProgressBar";
import flashcardMachine from "./machine";
import { useMachine } from "@xstate/react";
import Speaker from "./components/Speaker";
import MultipleChoice from "./components/MultipleChoice";
import CorrectImage from "./components/CorrectImage";
import IncorrectImage from "./components/IncorrectImage";
import CompletedScreen from "./components/CompletedScreen";
import TutorialScreen from './screens/Tutorial';
import TestScreen from './screens/Test';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Test" component={TestScreen} />
        <Stack.Screen name="Tutorial" component={TutorialScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
