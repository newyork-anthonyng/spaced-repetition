import React from 'react';
import { Animated, PanResponder, View, StyleSheet } from 'react-native';

function DraggableView({ startingX, startingY, children, onRelease, disabled }) {
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
      ],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: (event) => {
      if (onRelease) {
        onRelease({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY });
      }

      animated.flattenOffset();
      Animated.spring(
        animated,
        {
          toValue: { x: startingX, y: startingY },
          bounciness: 15,
          useNativeDriver: false
        }
      ).start();
    }
  });

  return (
    <View pointerEvents={disabled ? 'none' : 'auto'}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[animated.getLayout(), styles.box]}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#61dafb",
    width: 80,
    height: 80,
    borderRadius: 4,
    position: "absolute"
  }
});

export default DraggableView;
