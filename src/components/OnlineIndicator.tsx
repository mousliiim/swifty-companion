import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { OnlineIndicatorProps } from "@/types";

export const OnlineIndicator: React.FC<OnlineIndicatorProps> = ({
  size = 8,
  color = "#10b981",
}) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const blink = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => blink());
    };

    blink();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={[
        styles.onlineIndicator,
        {
          opacity: fadeAnim,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          shadowColor: color,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  onlineIndicator: {
    marginLeft: 8,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 3,
  },
});
