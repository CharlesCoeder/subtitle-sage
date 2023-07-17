import { Video } from "expo-av";
import React from "react";
import { View, Text, StyleProp, ViewStyle } from "react-native";
import TimeButton from "./TimeButton";
import PlayPause from "./PlayPause";

interface VideoControlsProps {
  videoRef: React.RefObject<Video>;
  style?: StyleProp<ViewStyle>;
}

export default function VideoControls({ videoRef, style }: VideoControlsProps) {
  return (
    <View style={style}>
      <TimeButton videoRef={videoRef} type="rewind" interval={10000} />
      <PlayPause videoRef={videoRef} />
      <TimeButton videoRef={videoRef} type="forward" interval={10000} />
    </View>
  );
}
