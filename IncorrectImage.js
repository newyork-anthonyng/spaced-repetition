import React from 'react';
import { Text, StyleSheet, View, Animated } from 'react-native';

function IncorrectImage({ onEnd }) {
  const xPosition = React.useRef(new Animated.Value(-500)).current;

  React.useEffect(() => {
    const entry = Animated.spring(xPosition, {
      toValue: 0,
      useNativeDriver: false
    });
    const exit = Animated.spring(xPosition, {
      toValue: 500,
      duration: 100,
      useNativeDriver: false
    });

    Animated.sequence([
      entry, exit
    ]).start(() => {
      if (onEnd) {
        onEnd();
      }
    });
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { left: xPosition }
      ]}
    >
      <Text style={styles.text}>🙀👎</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 400,
    top: 200
  },
  text: {
    fontSize: 100
  }
});

export default IncorrectImage;
