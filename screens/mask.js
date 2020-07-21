import React from "react";

import { View } from "react-native";

// Destructure face data given as argument
const Mask = ({
  face: {
    bounds: {
      origin: { x: containerX, y: containerY },
      size: { width: faceWidth, height: faceHeight },
    },
    leftEyePosition,
    rightEyePosition,
  },
}) => {
  // Define the helpers for calculating the correct positions
  const eyeWidth = faceWidth / 4;

  const translatedEyePositionX = (eyePosition) =>
    eyePosition.x - eyeWidth / 2 - containerX;
  const translatedEyePositionY = (eyePosition) =>
    eyePosition.y - eyeWidth / 2 - containerY;

  const translatedLeftEyePosition = {
    x: translatedEyePositionX(leftEyePosition),
    y: translatedEyePositionY(leftEyePosition),
  };
  const translatedRightEyePosition = {
    x: translatedEyePositionX(rightEyePosition),
    y: translatedEyePositionY(rightEyePosition),
  };

  // Define the style for the eye component

  const faceStyle = () => ({
    position: "absolute",
    left: containerX,
    top: containerY - faceHeight,
    borderRadius: 20,
    width: faceWidth,
    height: faceHeight,
    borderWidth: 5,
    borderColor: "white",
    backgroundColor: "transparent",
  });

  return (
    <View style={{ position: "absolute", left: containerX, top: containerY }}>
      {/* Add left eye */}
      <View style={{ ...faceStyle() }} />
      {/* Add right eye */}
    </View>
  );
};

export default Mask;
