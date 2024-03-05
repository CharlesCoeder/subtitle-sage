import React from "react";
import { Pressable } from "react-native";
import Play from "../../../assets/play.svg";
import Pause from "../../../assets/pause.svg";

interface PlayPauseProps {
  isPlaying: boolean;
  togglePlay: () => void;
}

const commonProps = { fill: "white", width: 80, height: 80 };

export default function PlayPause({ isPlaying, togglePlay }: PlayPauseProps) {
  return (
    <Pressable onPress={togglePlay}>
      {isPlaying ? <Pause {...commonProps} /> : <Play {...commonProps} />}
    </Pressable>
  );
}
