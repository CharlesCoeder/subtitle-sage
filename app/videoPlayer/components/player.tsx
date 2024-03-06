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
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [seekValue, setSeekValue] = useState(0);

  // Show/hide controls after tapping the screen
  const handleTap = () => {
    setControlsVisible(!controlsVisible);
  };

  // Passed to PlayPause control
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Passed to TimeButton control
  const seekVideo = (ms: number, isForward: boolean) => {
    let newTime = isForward ? currentTime + ms : currentTime - ms;
    newTime = isForward ? Math.min(newTime, duration) : Math.max(newTime, 0);
    const newSeekValue = duration > 0 ? newTime / duration : 0;
    setSeekValue(newSeekValue);
  };

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={styles.container}>
        <VLCPlayer
          ref={videoRef}
          source={{ uri: decodedURI }}
          style={styles.video}
          paused={!isPlaying}
          seek={seekValue}
          onLoad={(videoInfo) => {
            setDuration(videoInfo.duration);
          }}
          onProgress={(videoInfo) => {
            setCurrentTime(videoInfo.currentTime);
          }}
        />
        <VideoControls
          visible={controlsVisible}
          videoRef={videoRef}
          hideControls={() => setControlsVisible(false)}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          seekVideo={seekVideo}
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
