import React, { useRef, useState } from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { OnProgressEventProps, VLCPlayer } from "react-native-vlc-media-player";
import VideoControls from "./controls";

interface VideoPlayerProps {
  videoURI: string;
}

export default function VideoPlayer({ videoURI }: VideoPlayerProps) {
  const videoRef = useRef<VLCPlayer>(null);
  const decodedURI = decodeURIComponent(videoURI);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [seekValue, setSeekValue] = useState(0);

  // Show/hide controls after tapping the screen
  const handleTap = () => {
    setControlsVisible(!controlsVisible);
  };

  // Passed to PlayPause control
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Passed to TimeButton control
  const timeSeek = (ms: number, isForward: boolean) => {
    let newTime = isForward ? currentTime + ms : currentTime - ms;
    newTime = isForward ? Math.min(newTime, duration) : Math.max(newTime, 0);
    let newSeekValue = newTime > 0 ? newTime / duration : 0;

    // if seek value is ALREADY 0 while rewinding to beginning,
    // then set seekValue to an arbitrarily small number
    // so that React will re-render the VLC player.
    if (
      !isForward &&
      newSeekValue === 0 &&
      currentTime !== 0 &&
      seekValue == 0
    ) {
      newSeekValue = 0.0000000001;
    }

    // likewise, if seek value is ALREADY 1 while seeking forward past the end,
    // then set seekValue to a number arbitrarily close to 1
    // so that React will re-render the VLC player.
    if (
      isForward &&
      newSeekValue === 1 &&
      currentTime !== duration &&
      seekValue === 1
    ) {
      newSeekValue = 0.9999999999;
    }
    setCurrentTime(newTime);
    setSeekValue(newSeekValue);
  };

  const handleProgress = (videoInfo: OnProgressEventProps) => {
    setCurrentTime(videoInfo.currentTime);

    //////////////////////////////////////////////
    // temporary workaround for disabling repeat /
    //////////////////////////////////////////////

    // note: repeat={false} prop does not work (on iOS at least)
    // permanently fix by contributing to react-native-vlc-media-player
    // the issue with this fix is it that it's not exactly precise and the video
    //  stops when the currentTime is within 500ms

    // it also relies on continues calls of the onProgress hook
    // which may be bad for performance.

    // onEnd prop also does not work, which is why I used onProgress as a hack
    if (duration - currentTime <= 500) {
      setIsPlaying(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={styles.container}>
        <VLCPlayer
          ref={videoRef}
          source={{ uri: decodedURI }}
          repeat={false}
          style={styles.video}
          paused={!isPlaying}
          seek={seekValue}
          onLoad={(videoInfo) => {
            setDuration(videoInfo.duration);
          }}
          onProgress={handleProgress}
        />
        <VideoControls
          visible={controlsVisible}
          videoRef={videoRef}
          hideControls={() => setControlsVisible(false)}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          timeSeek={timeSeek}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  video: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
