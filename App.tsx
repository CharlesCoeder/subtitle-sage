import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Button from "./src/components/Button";

export default function App() {
  const onPress = () => {
    alert("Button was pressed!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Subtitle Sage</Text>
      <View style={styles.buttonContainer}>
        <Button label="Select video" color="#ff7a5a" onPress={onPress} />
        <Button label="Select subtitles" color="#018fac" onPress={onPress} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  buttonContainer: {},
});
