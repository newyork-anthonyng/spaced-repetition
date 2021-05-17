import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

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

  const height = animation.current.interpolate({
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
            height
          }
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  progressBar: {
    height: '100%',
    width: 20,
    backgroundColor: 'white',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 5,
    flexDirection: 'Column',
    justifyContent: 'Flex-End'
  }
});

export default ProgressBar;
