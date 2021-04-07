import React, { useRef } from "react";
import { Animated, View, StyleSheet, PanResponder, Text } from "react-native";

function Square({ startingX, startingY }) {
  const pan = useRef(new Animated.ValueXY({ x: startingX, y: startingY })).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: startingX,
          y: startingY
        });
      },
      onPanResponderMove: Animated.event([
        null,
        {
          dx: pan.x,
          dy: pan.y
        }
      ]),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        Animated.spring(pan, { toValue: { x: startingX, y: startingY } }).start();
      }
    })
  ).current;

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [{ translateX: pan.x }, { translateY: pan.y }]
        }}
        {...panResponder.panHandlers}
      >
        <View style={styles.box} />
      </Animated.View>
    </View>
  );
}

const App = () => {
  return (
    <View>
      <Square startingX={200} startingY={100} />
      <Square startingX={0} startingY={0} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: "bold"
  },
  box: {
    height: 150,
    width: 150,
    backgroundColor: "blue",
    borderRadius: 5
  }
});

export default App;
