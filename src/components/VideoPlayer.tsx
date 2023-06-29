import React from "react";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { Video } from "expo-av";

interface VideoPlayerProps {
  source: string;
}

export default function VideoPlayer({ source }: VideoPlayerProps) {
  const video = React.useRef(null);

  return (
    <View style={styles.container}>
      <Video
        useNativeControls
        ref={video}
        style={styles.video}
        source={{ uri: source }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  video: {
    flex: 1,
    width: 320,
    height: 200,
    alignSelf: "center",
    position: "relative",
  },
});
