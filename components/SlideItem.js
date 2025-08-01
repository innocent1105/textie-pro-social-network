import React from "react";
import { View, Text } from "react-native";

export const SlideItem = ({ index, data }) => {
  return (
    <View className="pt-8 flex flex-row justify-center">
      <Text className="text-white text-sm font-semibold">{data[index]}</Text>
    </View>
  );
};
