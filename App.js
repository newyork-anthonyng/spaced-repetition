// https://stackoverflow.com/questions/47551462/how-to-drag-and-drop-with-multiple-view-in-react-native
import React from 'react';
import { Image, Animated, PanResponder, StyleSheet, View, Text, Alert, Button } from 'react-native';
import car from './assets/car.jpg';
import ProgressBar from './ProgressBar';
import flashcardMachine from './machine';
import { useMachine } from '@xstate/react';
import { Audio } from 'expo-av';


function MyAudio({ src }) {
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync({
      uri: src
    });

    await sound.playAsync();
  }

  return (
    <View>
      <Button title="Play Sound" onPress={playSound} />
    </View>
  );
}


function DraggableView({ startingX, startingY, children, onRelease }) {
  const animated = React.useRef(
    new Animated.ValueXY({ x: startingX, y: startingY })
  ).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      Animated.spring(animated).reset();

      animated.setOffset({
        x: animated.x._value,
        y: animated.y._value
      });
    },
    onPanResponderMove: Animated.event([
      null,
      {
        dx: animated.x,
        dy: animated.y
      }
    ]),
    onPanResponderRelease: () => {
      animated.flattenOffset();
      Animated.spring(
        animated,
        {
          toValue: { x: startingX, y: startingY },
          bounciness: 15
        }
      ).start();

      if (onRelease) {
        onRelease();
      }
    }
  });

  return (
    <View>
      <Animated.View
        {...panResponder.panHandlers}
        style={[animated.getLayout(), styles.box]}
      >
        {children}
      </Animated.View>
    </View>
  );
}

function App() {
  const [state, send] = useMachine(flashcardMachine);

  const { context } = state;

  const currentIndex = context.currentIndex;
  const currentItem = context.items[currentIndex] || {};
  const choices = currentItem.choices;
  const percentage = (currentIndex / context.items.length) * 100;

  function handleRelease(choice) {
    return () => {
      if (choice === currentItem.answer) {
        send('CORRECT');
      } else {
        send('WRONG');
      }
    }
  }

  function handleSuccessNextPress() {
    send("NEXT");
  }

  function handleFailureNextPress() {
    send("NEXT");
  }

  let body;
  if (state.matches('idle')) {
    body = choices.map((choice, index) => (
      <DraggableView
        key={index}
        startingX={0}
        startingY={index * 100}
        onRelease={handleRelease(choice)}
      >
        <Text>{choice}</Text>
      </DraggableView>
    ));
  } else if (state.matches('success')) {
    body = <>
      <Text>Success!!!</Text>
      <Button
        title="Next"
        onPress={handleSuccessNextPress}
      />
    </>
  } else if (state.matches('failure')) {
    body = (
      <React.Fragment>
        <Text>Failed :(</Text>
        <Button title="Try again" onPress={handleFailureNextPress} />
      </React.Fragment>
    );
  } else if (state.matches('complete')) {
    body = <Text>Completed!</Text>;
  } else {
    return null;
  }

  return (
    <View style={styles.app}>
      <View style={styles.leftContainer}>
        <ProgressBar percentage={percentage} />
      </View>

      <View style={styles.rightContainer}>
        <MyAudio src={'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3'} />
        {body}
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
