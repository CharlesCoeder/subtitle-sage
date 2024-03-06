import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { VLCPlayer } from "react-native-vlc-media-player";
import PlayPause from "./playPause";
import BackToHome from "./toHome";
import TimeButton from "./timeButton";

interface VideoControlsProps {
  videoRef: React.RefObject<VLCPlayer>;
  visible: boolean;
  isPlaying: boolean;
  hideControls: () => void;
  togglePlay: () => void;
  timeSeek: (ms: number, isForward: boolean) => void;
}

export default function VideoControls({
  visible,
  isPlaying,
  hideControls,
  togglePlay,
  timeSeek,
}: VideoControlsProps) {
  // Hide controls after 3 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (visible) {
      timer = setTimeout(() => {
        hideControls();
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [visible, hideControls]);

  return visible ? (
    <TouchableWithoutFeedback onPress={hideControls}>
      <View style={styles.container}>
        <Text style={styles.placeholderText}>Video Controls Placeholder</Text>
        <BackToHome />
        <PlayPause isPlaying={isPlaying} togglePlay={togglePlay} />
        <TimeButton isForward={true} timeSeek={timeSeek} />
        <TimeButton isForward={false} timeSeek={timeSeek} />
      </View>
    </TouchableWithoutFeedback>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
  },
  placeholderText: {
    color: "white",
  },
});
