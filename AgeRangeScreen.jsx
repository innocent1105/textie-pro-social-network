import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from "expo-linear-gradient";
import Carousel, { TAnimationStyle } from "react-native-reanimated-carousel";
import { interpolate } from "react-native-reanimated";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { SlideItem } from "./components/SlideItem";
import { getImages } from "./utils/get-images";
import { Dimensions } from "react-native";
import * as Haptics from 'expo-haptics';
import { Vibration } from 'react-native';


const PAGE_WIDTH = Dimensions.get("window").width;



const vibrateLight = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

const vibrateHeavy = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
};

const vibrate = (x) => {
    Vibration.vibrate(x); // vibrates for 100ms
};

const AgeRange = () => {
  const navigation = useNavigation();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const itemSize = 80;
  const centerOffset = PAGE_WIDTH / 2 - itemSize / 2;

  const animationStyle = useCallback(
    (value) => {
      "worklet";

      const itemGap = interpolate(value, [-3, -2, -1, 0, 1, 2, 3], [-30, -15, 0, 0, 0, 15, 30]);

      const translateX =
        interpolate(value, [-1, 0, 1], [-itemSize, 0, itemSize]) +
        centerOffset -
        itemGap;

      const translateY = interpolate(value, [-1, -0.5, 0, 0.5, 1], [60, 45, 40, 45, 60]);

      const scale = interpolate(value, [-1, -0.5, 0, 0.5, 1], [0.8, 0.85, 1.1, 0.85, 0.8]);

      return {
        transform: [
          { translateX },
          { translateY },
          { scale },
        ],
      };
    },
    [centerOffset]
  );

  useEffect(() => {
    console.log("Selected age range index:", selectedIndex);
  }, [selectedIndex]);

  const [saving, setSaving ] = useState(false);
  return (
    <ImageBackground
      source={require("../assets/images/models/cloud.jpg")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={["rgba(255,255,255,0)", "#000"]}
        style={{ flex: 1, justifyContent: "space-between " }}
      >
        <View className="absolute z-50 mt-10">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-4 flex flex-row"
          >
            <Entypo name="chevron-left" size={25} color="#fff" />
            <Text className="text-white font-semibold pt-1 pl-2">Back</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-28">
          <Text className="text-5xl font-semibold text-white p-4">
            What is your preferred age range?
          </Text>
          <Text className="text-xl font-semibold text-white px-4 pt-0 pb-4">
            Select any age range by sliding, then click to pick!🤗
          </Text>
        </View>

        {/* 👉 Carousel here */}
        <View style={{ marginTop: 20, height: PAGE_WIDTH }}>
          <Carousel
            className = " h-96"
            width={itemSize}
            height={itemSize}
            loop
            style={{ width: PAGE_WIDTH }}
            data={["18–24", "25–30", "31–35", "36–40", "41+"]}
            renderItem={({ index }) => (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => {setSelectedIndex(index); vibrate(100);}}
                containerStyle={{ flex: 1 }}
                style={{ flex: 1 }}
              >
                <View
                  style={{
                    backgroundColor: selectedIndex === index ? "#4B0082" : "#35005c5e",
                    flex: 1,
                    borderRadius: 50,
                    justifyContent: "center",
                    overflow: "auto",
                    alignItems: "center",
                  }}
                  className = ""
                >
                  <View style={{ width: "100%", height: "100%" }}>
                    <SlideItem index={index} data={["18–24", "25–30", "31–35", "36–40", "41+"]} />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )}
            customAnimation={animationStyle}
          />
        </View>

        <TouchableOpacity
          onPress={() => {console.log("Next with selected index:", selectedIndex); setSaving(true)}}
          className="absolute flex flex-row bottom-24 right-7 p-3 px-6 bg-purple-900 rounded-full"
        >
          {saving ? (
            <View>
                <ActivityIndicator color={"#fff"} />
            </View>
          ): (
            <View>
                <Text className="text-white mr-2">Save</Text>
            </View>
          )}
        </TouchableOpacity>

 

      </LinearGradient>
    </ImageBackground>
  );
};

export default AgeRange;
