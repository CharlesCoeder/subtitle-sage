import React from "react";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import Back from "../../assets/back.svg";

export default function BackToHome() {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/",
    });
  };

  return (
    <Pressable onPress={handlePress}>
      <Back fill="white" width={80} height={80} />
    </Pressable>
  );
}
