// https://stackoverflow.com/questions/47551462/how-to-drag-and-drop-with-multiple-view-in-react-native
import React from 'react';
import { Image, Animated, StyleSheet, View, Text, Alert, Button } from 'react-native';
import ProgressBar from './ProgressBar';
import flashcardMachine from './machine';
import { useMachine } from '@xstate/react';
import Speaker from './Speaker';
import DraggableView from './DraggableView';
import CorrectImage from './CorrectImage';
import IncorrectImage from './IncorrectImage';

function App() {
  const [state, send] = useMachine(flashcardMachine);
  const { context } = state;

  const currentIndex = context.currentIndex;
  const currentItem = context.items[currentIndex] || {};
  const choices = currentItem.choices;
  const percentage = (currentIndex / context.items.length) * 100;

  function handleRelease(choice) {
    return (coords) => {
      const isInsideZone = coords.y < 150;
      if (!isInsideZone) return;

      if (choice === currentItem.answer) {
        send('CORRECT');
      } else {
        send('WRONG');
      }
    }
  }

  function handleCorrectImageAnimationEnd() {
    send('NEXT');
  }

  function handleIncorrectImageAnimationEnd() {
    send('NEXT');
  }

  let body = choices.map((choice, index) => (
    <DraggableView
      key={index}
      startingX={0}
      startingY={index * 100}
      onRelease={handleRelease(choice)}
    >
      <Text>{choice}</Text>
    </DraggableView>
  ));

  return (
    <View style={styles.app}>
      <View style={styles.leftContainer}>
        <ProgressBar percentage={percentage} />
      </View>

      <View style={styles.rightContainer}>
        <Speaker src={'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3'} />
        {body}

        {state.matches('correct') && (
          <CorrectImage onEnd={handleCorrectImageAnimationEnd} />
        )}
        {state.matches('incorrect') && (
          <IncorrectImage onEnd={handleIncorrectImageAnimationEnd} />
        )}

        <Text style={styles.debug}>>{JSON.stringify(state.value, null, 2)}</Text>
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  debug: {
    position: "absolute",
    bottom: 0
  },
  app: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "row"
  },
  box: {
    backgroundColor: "#61dafb",
    width: 80,
    height: 80,
    borderRadius: 4,
    position: "absolute"
  },
  leftContainer: {
    height: '100%',
    width: '25%'
  },
  rightContainer: {}
});

export default App;
