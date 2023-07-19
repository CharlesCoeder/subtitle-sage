import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useLocalSearchParams } from "expo-router";
import VideoControls from "../src/components/VideoControls";

export default function VideoPlayer() {
  const [controlsVisible, setControlsVisible] = useState(false);

  const video = useRef(null);
  const { videoURI, subtitleURI } = useLocalSearchParams();

  useEffect(() => {
    if (controlsVisible) {
      const timer = setTimeout(() => {
        setControlsVisible(false);
      }, 3000); // Hide controls after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [controlsVisible]);

  const hideControls = () => {
    setControlsVisible(false);
  };

  if (!videoURI || Array.isArray(videoURI)) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => setControlsVisible((prevState) => !prevState)}
      >
        <Video
          ref={video}
          style={styles.video}
          source={{ uri: videoURI }}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={true}
        />
      </TouchableWithoutFeedback>
      <VideoControls
        controlsVisible={controlsVisible}
        videoRef={video}
        style={styles.controls}
        hideControls={hideControls}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  video: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },

  controls: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
});
