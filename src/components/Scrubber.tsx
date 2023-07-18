import React, { useState } from "react";
import Slider from "@react-native-community/slider";
import {
  Video,
  AVPlaybackStatus,
  AVPlaybackStatusSuccess,
  AVPlaybackStatusError,
} from "expo-av";

interface ScrubberProps {
  videoRef: React.RefObject<Video>;
  position: number;
  duration: number;
  isPlaying: boolean;
}

export default function Scrubber({
  videoRef,
  position,
  duration,
  isPlaying,
}: ScrubberProps) {
  const [wasPlayingBeforeScrubbing, setWasPlayingBeforeScrubbing] =
    useState(false);

  function isAVPlaybackStatusSuccess(
    status: AVPlaybackStatus
  ): status is AVPlaybackStatusSuccess {
    return !(status as AVPlaybackStatusError).error;
  }

  const handleSlidingStart = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (isAVPlaybackStatusSuccess(status)) {
        if (isPlaying) {
          setWasPlayingBeforeScrubbing(true);
          await videoRef.current.pauseAsync();
        } else {
          setWasPlayingBeforeScrubbing(false);
        }
      }
    }
  };

  const handleSlidingComplete = async (value: number) => {
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(value, {
        toleranceMillisAfter: 0,
        toleranceMillisBefore: 0,
      });
      if (wasPlayingBeforeScrubbing) {
        await videoRef.current.playAsync();
      }
    }
  };

  return (
    <Slider
      style={{ width: "100%", height: 40 }}
      minimumValue={0}
      maximumValue={duration}
      value={position}
      onSlidingStart={handleSlidingStart}
      onSlidingComplete={handleSlidingComplete}
      maximumTrackTintColor="#000000"
      minimumTrackTintColor="#ffffff"
      thumbTintColor="#ffffff"
    />
  );
}
