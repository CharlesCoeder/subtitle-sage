import React from "react";
import { Pressable } from "react-native";
import Play from "../../assets/play.svg";
import Pause from "../../assets/pause.svg";
import {
  Video,
  AVPlaybackStatus,
  AVPlaybackStatusSuccess,
  AVPlaybackStatusError,
} from "expo-av";

interface PlayPauseProps {
  videoRef: React.RefObject<Video>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PlayPause({
  videoRef,
  isPlaying,
  setIsPlaying,
}: PlayPauseProps) {
  function isAVPlaybackStatusSuccess(
    status: AVPlaybackStatus
  ): status is AVPlaybackStatusSuccess {
    return !(status as AVPlaybackStatusError).error;
  }

  const handlePress = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (isAVPlaybackStatusSuccess(status)) {
        if (isPlaying) {
          await videoRef.current.pauseAsync();
          setIsPlaying(false);
        } else {
          await videoRef.current.playAsync();
          setIsPlaying(true);
        }
      }
    }
  };

  const commonProps = { fill: "white", width: 80, height: 80 };

  return (
    <Pressable onPress={handlePress}>
      {isPlaying ? <Pause {...commonProps} /> : <Play {...commonProps} />}
    </Pressable>
  );
}
