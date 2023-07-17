import { Video } from "expo-av";
import React from "react";
import { StyleSheet } from "react-native";
import { View, Text, StyleProp, ViewStyle } from "react-native";
import TimeButton from "./TimeButton";

interface VideoControlsProps {
  videoRef: React.RefObject<Video>;
  style?: StyleProp<ViewStyle>;
}

export default function VideoControls({ videoRef, style }: VideoControlsProps) {
  return (
    <View style={style}>
      <TimeButton videoRef={videoRef} type="rewind" interval={10000} />
      <TimeButton videoRef={videoRef} type="forward" interval={10000} />
    </View>
  );
}
