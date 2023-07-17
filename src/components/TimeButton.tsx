import React from "react";
import { Pressable } from "react-native";
import Forward from "../../assets/forward.svg";
import Rewind from "../../assets/rewind.svg";
import {
  Video,
  AVPlaybackStatus,
  AVPlaybackStatusSuccess,
  AVPlaybackStatusError,
} from "expo-av";

interface TimeButtonProps {
  type: string;
  videoRef: React.RefObject<Video>;
  interval: number;
}

export default function TimeButton({
  type,
  videoRef,
  interval,
}: TimeButtonProps) {
  function isAVPlaybackStatusSuccess(
    status: AVPlaybackStatus
  ): status is AVPlaybackStatusSuccess {
    return !(status as AVPlaybackStatusError).error;
  }

  const rewindTenSeconds = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (isAVPlaybackStatusSuccess(status)) {
        const newPosition = Math.max(0, status.positionMillis - interval); // Don't go below 0
        await videoRef.current.setPositionAsync(newPosition);

        // If the video has reached the end, start playback
        const isEndOfVideo =
          status.durationMillis &&
          status.positionMillis >= status.durationMillis;
        if (isEndOfVideo) {
          await videoRef.current.playAsync();
        }
      }
    }
  };

  const fastForwardTenSeconds = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (isAVPlaybackStatusSuccess(status)) {
        let newPosition = status.positionMillis + interval;
        if (status.durationMillis) {
          newPosition = Math.min(newPosition, status.durationMillis); // Don't go beyond the video duration
        }
        await videoRef.current.setPositionAsync(newPosition);
      }
    }
  };

  const commonProps = { fill: "white", width: 80, height: 80 };
  const svg =
    type === "forward" ? (
      <Forward {...commonProps} />
    ) : (
      <Rewind {...commonProps} />
    );

  return (
    <Pressable
      onPress={type === "forward" ? fastForwardTenSeconds : rewindTenSeconds}
    >
      {svg}
    </Pressable>
  );
}
