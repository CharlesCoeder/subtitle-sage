import React, { useEffect, useState } from "react";
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
}

export default function PlayPause({ videoRef }: PlayPauseProps) {
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
          setIsPlaying(status.isPlaying);
        }
      });
    }
  }, [videoRef]);

  const handlePress = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (isAVPlaybackStatusSuccess(status) && status.isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
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
