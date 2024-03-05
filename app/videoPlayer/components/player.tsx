import React, { useRef, useState } from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { VLCPlayer } from "react-native-vlc-media-player";
import VideoControls from "./controls";

interface VideoPlayerProps {
  videoURI: string;
}

export default function VideoPlayer({ videoURI }: VideoPlayerProps) {
  const videoRef = useRef<VLCPlayer>(null);
  const decodedURI = decodeURIComponent(videoURI);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleTap = () => {
    setControlsVisible(!controlsVisible);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={styles.container}>
        <VLCPlayer
          ref={videoRef}
          source={{ uri: decodedURI }}
          style={styles.video}
          paused={!isPlaying}
        />
        <VideoControls
          visible={controlsVisible}
          videoRef={videoRef}
          hideControls={() => setControlsVisible(false)}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
        />
      </View>
    </TouchableWithoutFeedback>
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
  },
});
