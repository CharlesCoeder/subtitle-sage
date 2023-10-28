import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput } from "react-native";
import Button from "../src/components/Button";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import { unzip } from "react-native-zip-archive";
import { importTermBank } from "../src/database/imports/importTermBank";

type FileArray = {
  filename: string;
  content: string;
};

export default function App() {
  const router = useRouter();

  let videoURI = "";
  let subtitleURI = "";

  const selectFile = async () => {
    let result = await DocumentPicker.getDocumentAsync();
    if (!result.canceled) {
      return result.assets[0];
    }
    return null;
  };

  const handleDictionaryImport = async () => {
    // Open file selector and choose dictionary zip file
    const file = await selectFile();

    // Use react-native-zip-archive to unzip the file
    if (file && file.uri) {
      const targetUnzipDirectory = `${FileSystem.documentDirectory}unzipped/`;
      try {
        await FileSystem.makeDirectoryAsync(targetUnzipDirectory, {
          intermediates: true,
        });

        await unzip(file.uri, targetUnzipDirectory);

        // Now, read the unzipped contents & store in fileArray for import
        const fileEntries = await FileSystem.readDirectoryAsync(
          targetUnzipDirectory
        );

        const fileArray: FileArray[] = [];

        for (const filename of fileEntries) {
          const fileContent = await FileSystem.readAsStringAsync(
            `${targetUnzipDirectory}${filename}`
          );
          console.log(`File: ${filename}`);
          fileArray.push({ filename, content: fileContent });
        }

        // Call the necessary import function
        if (fileArray.length > 0) {
          importTermBank(fileArray);
        }
      } catch (error) {
        console.error("Error processing ZIP file:", error);
      }
    }
  };

  const updateURI = async (mediaType) => {
    const document = await selectFile();
    if (mediaType === "video" && document) {
      videoURI = encodeURIComponent(document.uri);
    } else if (mediaType === "subtitle" && document) {
      subtitleURI = encodeURIComponent(document.uri);
    }
  };

  const changePage = () => {
    if (videoURI && subtitleURI) {
      router.push({
        pathname: "/VideoPlayer",
        params: { videoURI, subtitleURI },
      });
    } else if (!videoURI && !subtitleURI) {
      alert("Please select video & subtitle files!");
    } else if (!videoURI) {
      alert("Please select video!");
    } else {
      alert("Please select subtitle!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Subtitle Sage</Text>
      <View style={styles.buttonContainer}>
        <Button
          label="Select video"
          color="#ff7a5a"
          onPress={() => {
            updateURI("video");
          }}
        />
        <Button
          label="Select subtitles"
          color="#018fac"
          onPress={() => {
            updateURI("subtitle");
          }}
        />
        <Button label="Let's go!" color="green" onPress={changePage} />
        <Button
          label="Import dictionary"
          color="#9842f5"
          onPress={() => {
            handleDictionaryImport();
          }}
        />
        <TextInput style={styles.input} placeholder="Search for a term!" />
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

  input: {
    width: 200,
    borderColor: "black",
    borderWidth: 1,
  },
});
