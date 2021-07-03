import React from "react";
import { Button, View } from "react-native";

function Home({ navigation }) {
  return (
    <View
      style={{
        position: "absolute",
        top: 32,
        right: 0,
        left: 0,
        bottom: 0,
        backgroundColor: "#F2F2F2",
      }}
    >
      <View style={{ marginBottom: 32 }}>
        <Button
          title="Go to Dots"
          onPress={() => navigation.navigate("Dots")}
        />
      </View>

      <Button
        title="Go to Words"
        onPress={() => navigation.navigate("Tutorial")}
      />
    </View>
  );
}

export default Home;
