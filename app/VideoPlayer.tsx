import React from "react";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { Video } from "expo-av";
import { useLocalSearchParams } from "expo-router";

export default function VideoPlayer() {
  const video = React.useRef(null);
  const { videoURI } = useLocalSearchParams();

  if (!videoURI || Array.isArray(videoURI)) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Video
        useNativeControls
        ref={video}
        style={styles.video}
        source={{ uri: videoURI }}
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
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
});
