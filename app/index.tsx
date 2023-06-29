import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Button from "../src/components/Button";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";

export default function App() {
  const router = useRouter();

  const chooseFileAsync = async () => {
    let result = await DocumentPicker.getDocumentAsync();

    if (result.type === "success") {
      router.push({
        pathname: "/VideoPlayer",
        params: { videoURI: encodeURIComponent(result.uri) },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Subtitle Sage</Text>
      <View style={styles.buttonContainer}>
        <Button
          label="Select video"
          color="#ff7a5a"
          onPress={chooseFileAsync}
        />
        <Button
          label="Select subtitles"
          color="#018fac"
          onPress={chooseFileAsync}
        />
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
    paddingTop: 50,
  },

  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  buttonContainer: {
    alignItems: "center",
    width: "80%",
    marginBottom: 20,
  },

  video: {
    flex: 1,
  },
});
