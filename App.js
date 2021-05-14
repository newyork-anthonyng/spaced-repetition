// https://stackoverflow.com/questions/47551462/how-to-drag-and-drop-with-multiple-view-in-react-native
import React from 'react';
import { Image, Animated, PanResponder, StyleSheet, View, Text, Alert } from 'react-native';
import car from './assets/car.jpg';

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
  function handleRelease() {
    Alert.alert(
        'You got it correct!',
        'Good job'
    );
  }

  function handleWrongAnswer() {
    Alert.alert(
        'You got it wrong!',
        'Try again'
    );
  }

  return (
    <View style={styles.app}>
      <Image
        source={car}
        style={{ width: 200, height: 200 }}
      />

    <DraggableView startingX={0} startingY={0} onRelease={handleRelease}>
        <Text>Car</Text>
      </DraggableView>
      <DraggableView startingX={0} startingY={100} onRelease={handleWrongAnswer}>
        <Text>Cat</Text>
      </DraggableView>
      <DraggableView startingX={0} startingY={200} onRelease={handleWrongAnswer}>
        <Text>Cat</Text>
      </DraggableView>
    </View>
  );
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
    // justifyContent: "center",
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
