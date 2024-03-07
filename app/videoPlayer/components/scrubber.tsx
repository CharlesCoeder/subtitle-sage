import React, { useEffect, useState } from "react";
import Slider from "@react-native-community/slider";

interface ScrubberProps {
  position: number;
  isPlaying: boolean;
  setIsPlaying: (boolean: boolean) => void;
  setSeekValue: (newSeekValue: number) => void;
}

export default function Scrubber({
  position,
  isPlaying,
  setIsPlaying,
  setSeekValue,
}: ScrubberProps) {
  const [wasPlaying, setWasPlaying] = useState(false);

  // To do:
  // when the video is already playing during scrub start,
  // keep the play button symbol at all times!

  // this function pauses the video during sliding,
  // which creates a weird glitchy look where the button goes playing -> pause -> playing
  const handleSlidingStart = () => {
    setWasPlaying(isPlaying);
    setIsPlaying(false);
  };

  const handleSlidingComplete = (value: number) => {
    setSeekValue(value);
    if (wasPlaying) {
      setIsPlaying(true);
    }
  };

  return (
    <Slider
      style={{ width: "100%", height: 40 }}
      value={position}
      onSlidingStart={handleSlidingStart}
      onSlidingComplete={handleSlidingComplete}
      maximumTrackTintColor="#000000"
      minimumTrackTintColor="#ffffff"
      thumbTintColor="#ffffff"
    />
  );
}
