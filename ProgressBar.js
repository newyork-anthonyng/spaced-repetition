import React from 'react';
import { Image, Animated, PanResponder, StyleSheet, View, Text, Alert, Button } from 'react-native';

function ProgressBar({ percentage }) {
  const animation = React.useRef(new Animated.Value(percentage));

  React.useEffect(() => {
    Animated.timing(
      animation.current, {
        toValue: percentage,
        duration: 100
      }
    ).start();
  }, [percentage]);

  const width = animation.current.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp'
  });

  return (
    <View style={styles.progressBar}>
      <Animated.View
        style={
          [StyleSheet.absoluteFill],
          {
            backgroundColor: '#88ED4F',
            width
          }
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  progressBar: {
    height: 20,
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 5,
    flexDirection: 'Row'
  }
});

export default ProgressBar;
