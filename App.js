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
import CompletedScreen from './CompletedScreen';

function App() {
  const [state, send] = useMachine(flashcardMachine);
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

  function handlePlay() {
    send('LISTEN');
  }

  let body = choices.map((choice, index) => (
    <DraggableView
      key={index}
      startingX={0}
      startingY={index * 100}
      onRelease={handleRelease(choice)}
    >
      <View style={styles.box}>
        <Text style={styles.draggableText}>{choice}</Text>
      </View>
    </DraggableView>
  ));

  const shouldShowChoices = state.matches('idle');
  const shouldShowSpeaker = ['idle', 'readyToListen'].some(state.matches);

  return (
    <View style={styles.app}>
      <View style={styles.leftContainer}>
        <ProgressBar percentage={percentage} />
      </View>

      <View style={styles.rightContainer}>
        {state.matches('complete') ? (
          <CompletedScreen />
        ) : (
          <React.Fragment>
            {
              shouldShowSpeaker && (
                <View style={{marginBottom: 52}}>
                  <Speaker
                    src={audioSource}
                    onPlay={handlePlay}
                  />
                </View>
              )
            }

            {shouldShowChoices && body}

            {state.matches('correct') && (
              <CorrectImage onEnd={handleCorrectImageAnimationEnd} />
            )}
            {state.matches('incorrect') && (
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
    backgroundColor: '#F2F2F2'
  },
  box: {
    width: 195,
    borderRadius: 4,
    position: "absolute",
    shadowOffset: {
      width: 8,
      height: 8
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    backgroundColor: '#F8F8F8'
  },
  draggableText: {
    fontSize: 30,
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  leftContainer: {
    height: '100%',
    width: '25%'
  },
  rightContainer: {
    height: '100%',
    marginTop: 50,
    marginLeft: 20
  }
});

export default App;
