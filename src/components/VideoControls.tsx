import React, { useState, useEffect } from "react";
import { StyleSheet, View, StyleProp, ViewStyle } from "react-native";
import TimeButton from "./TimeButton";
import PlayPause from "./PlayPause";
import Scrubber from "./Scrubber";
import {
  Video,
  AVPlaybackStatus,
  AVPlaybackStatusSuccess,
  AVPlaybackStatusError,
} from "expo-av";

interface VideoControlsProps {
  videoRef: React.RefObject<Video>;
  style?: StyleProp<ViewStyle>;
}

export default function VideoControls({ videoRef, style }: VideoControlsProps) {
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  function isAVPlaybackStatusSuccess(
    status: AVPlaybackStatus
  ): status is AVPlaybackStatusSuccess {
    return !(status as AVPlaybackStatusError).error;
  }

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (isAVPlaybackStatusSuccess(status)) {
          setPosition(status.positionMillis || 0);
          setDuration(status.durationMillis || 1);
          setIsPlaying(status.isPlaying);

          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        }
      });
    }
  }, [videoRef]);

  return (
    <View style={style}>
      <View style={styles.buttons}>
        <TimeButton videoRef={videoRef} type="rewind" interval={10000} />
        <PlayPause
          videoRef={videoRef}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
        <TimeButton videoRef={videoRef} type="forward" interval={10000} />
      </View>
      <Scrubber
        videoRef={videoRef}
        position={position}
        duration={duration}
        isPlaying={isPlaying}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
  },
});
