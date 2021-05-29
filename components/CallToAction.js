import React from 'react';
import { Animated, StyleSheet, View, Text } from 'react-native';

const MIN_VALUE = 1;
const MAX_VALUE = 1.3;

function CallToAction() {
  const pulseAnim = React.useRef(
    new Animated.Value(MIN_VALUE)
  ).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
          Animated.timing(pulseAnim, {
              toValue: MAX_VALUE,
              duration: 1000
          }),
          Animated.timing(pulseAnim, {
              toValue: MIN_VALUE,
              duration: 1000
          }),
          Animated.timing(pulseAnim, {
              toValue: MAX_VALUE,
              duration: 1000
          }),
          Animated.timing(pulseAnim, {
              toValue: MIN_VALUE,
              duration: 2000
          })
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <Animated.Text style={[
      styles.text,
      {
        transform: [
          { scale: pulseAnim },
          { rotateZ: '45deg' }
        ]
      }
    ]}>
      👈
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 96,
    zIndex: 1
  }
});

export default CallToAction;
