import React from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import VideoPlayer from "./components/player";

export default function VideoPlayerPage() {
  const { videoURI } = useLocalSearchParams();

  if (!videoURI || Array.isArray(videoURI)) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <VideoPlayer videoURI={videoURI} />
    </View>
  );
}
