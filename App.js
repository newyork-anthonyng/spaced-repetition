// https://stackoverflow.com/questions/47551462/how-to-drag-and-drop-with-multiple-view-in-react-native
import React from 'react';
import { Image, Animated, PanResponder, StyleSheet, View, Text, Alert, Button } from 'react-native';
import car from './assets/car.jpg';
import ProgressBar from './ProgressBar';
import flashcardMachine from './machine';
import { useMachine } from '@xstate/react';


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

  function handleRelease() {
    send('CORRECT');
    // Alert.alert(
    //     'You got it correct!',
    //     'Good job'
    // );
  }

  function handleWrongAnswer() {
    send('WRONG');
    // Alert.alert(
    //     'You got it wrong!',
    //     'Try again'
    // );
  }

  function handleSuccessNextPress() {
    send("NEXT");
  }

  const { context } = state;

  const currentIndex = context.currentIndex;
  const currentItem = context.items[currentIndex] || {};
  const choices = currentItem.choices;

  if (state.matches('idle')) {
    return (
      <View style={styles.app}>
        <Image
          source={car}
          style={{ width: 200, height: 200 }}
        />


        {
          choices.map((choice, index) => (
            <DraggableView startingX={0} startingY={index * 100} onRelease={handleRelease}>
              <Text>{choice}</Text>
            </DraggableView>
          ))
        }
        <ProgressBar percentage={25} />

      </View>
    );
  }

  if (state.matches('success')) {
    return (
      <View style={styles.app}>
        <Text>Success!!!</Text>
        <Button
          title="Next"
          onPress={handleSuccessNextPress}
        />
      </View>
    );
  }

  if (state.matches('failure')) {
    return (
      <View style={styles.app}>
        <Text>Failed :(</Text>
      </View>
    );
  }

  if (state.matches('complete')) {
    return (
      <View style={styles.app}>
        <Text>Completed!</Text>
      </View>
    );
  }


}

const styles = StyleSheet.create({
  app: {
    borderWidth: 1,
    borderColor: "red",
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center"
  },
  box: {
    backgroundColor: "#61dafb",
    width: 80,
    height: 80,
    borderRadius: 4,
    position: "absolute"
  },
});

export default App;
