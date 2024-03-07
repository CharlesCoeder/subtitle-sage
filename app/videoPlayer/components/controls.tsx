import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { VLCPlayer } from "react-native-vlc-media-player";
import PlayPause from "./playPause";
import BackToHome from "./toHome";
import TimeButton from "./timeButton";
import Scrubber from "./scrubber";

interface VideoControlsProps {
  videoRef: React.RefObject<VLCPlayer>;
  visible: boolean;
  isPlaying: boolean;
  position: number;
  setIsPlaying: (boolean: boolean) => void;
  hideControls: () => void;
  togglePlay: () => void;
  timeSeek: (ms: number, isForward: boolean) => void;
  setSeekValue: (newSeekValue: number) => void;
}

export default function VideoControls({
  visible,
  isPlaying,
  position,
  setIsPlaying,
  hideControls,
  togglePlay,
  timeSeek,
  setSeekValue,
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
        <View style={styles.topControls}>
          <BackToHome />
        </View>

        <View style={styles.middleControls}>
          <TimeButton isForward={false} timeSeek={timeSeek} />
          <PlayPause isPlaying={isPlaying} togglePlay={togglePlay} />
          <TimeButton isForward={true} timeSeek={timeSeek} />
        </View>

        <View style={styles.bottomControls}>
          <Scrubber
            position={position}
            setSeekValue={setSeekValue}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />
        </View>
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
    bottom: 0,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
  },
  topControls: {
    alignSelf: "flex-start",
    width: "100%",
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  middleControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomControls: {
    width: "100%",
  },
});
