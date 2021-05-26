import React from 'react';
import { Image, Animated, StyleSheet, View } from 'react-native';
import star from '../assets/star.png';

function ProgressBar({ percentage }) {
  const animation = React.useRef(new Animated.Value(percentage));

  React.useEffect(() => {
    Animated.timing(
      animation.current, {
        toValue: percentage,
        duration: 100,
        useNativeDriver: false
      }
    ).start();
  }, [percentage]);

  const height = animation.current.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp'
  });

  return (
    <View style={styles.container}>
      <Image
        source={star}
        style={{ width: 64, height: 64 }}
      />
      <View style={styles.progressBar}>


        <Animated.View
          style={
            [StyleSheet.absoluteFill],
            {
              backgroundColor: '#92F07A',
              borderBottomLeftRadius: 50,
              borderBottomRightRadius: 50,
              height
            }
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    marginTop: 30,
    marginLeft: 10
  },
  progressBar: {
    height: '80%',
    width: 20,
    backgroundColor: '#E5E5E5',
    borderRadius: 50,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginLeft: 22
  }
});

export default ProgressBar;
