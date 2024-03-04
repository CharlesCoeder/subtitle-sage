import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { VLCPlayer } from "react-native-vlc-media-player";

interface VideoControlsProps {
  videoRef: React.RefObject<VLCPlayer>;
  visible: boolean;
  hideControls: () => void;
}

export default function VideoControls({
  videoRef,
  visible,
  hideControls,
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
        {/* Controls to go here */}
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
