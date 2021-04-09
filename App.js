import React from 'react';
import { Animated, PanResponder, StyleSheet, View } from 'react-native';

const startingX = 100;
const startingY = 100;
function DraggableView() {
  const animated = React.useRef(
    new Animated.ValueXY({ x: startingX, y: startingY })
  ).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      console.log('onPanResponderGrant');
      console.log('x', animated.x._value, animated.x._offset);
      console.log('y', animated.y._value, animated.y._offset);
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
      console.log('onPanResponderRelease');
      console.log('x', animated.x._value, animated.x._offset);
      console.log('y', animated.y._value, animated.y._offset);
      animated.flattenOffset();
      // Animated.spring(
      //   animated,
      //   { toValue: { x: startingX, y: startingY } }
      // ).start();
    }
  });

  return (
    <View style={styles.container}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[animated.getLayout(), styles.box]}
      />
    </View>
  );
}

function App() {
  return <DraggableView />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    backgroundColor: "#61dafb",
    width: 80,
    height: 80,
    borderRadius: 4,
  },
});

export default App;
