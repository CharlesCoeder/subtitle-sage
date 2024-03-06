import React from "react";
import { Pressable } from "react-native";
import Forward from "../../../assets/forward.svg";
import Rewind from "../../../assets/rewind.svg";

interface TimeButtonProps {
  isForward: boolean;
  timeSeek: (ms: number, isForward: boolean) => void;
}

export default function TimeButton({ isForward, timeSeek }: TimeButtonProps) {
  const handlePress = () => {
    const ms = 10000;
    timeSeek(ms, isForward);
  };

  const commonProps = { fill: "white", width: 80, height: 80 };
  const svg = isForward ? (
    <Forward {...commonProps} />
  ) : (
    <Rewind {...commonProps} />
  );

  return <Pressable onPress={handlePress}>{svg}</Pressable>;
}
