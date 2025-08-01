import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from "expo-linear-gradient"; 

const MatchingPref1 = () => {
  const navigation = useNavigation();

  const words = [
    "Funny 😂",
    "Ambitious 🚀",
    "Open 🤝",
    "Loyal 🐶",
    "Open minded 🧠",
    "Adventurous 🧭",
    "Creative 🎨",
    "Kind ❤️",
    "Sporty 🏋️‍♂️",
    "Spiritual 🧘",
    "Curious 🔍",
    "Book lover 📚",
    "Foodie 🍕",
    "Animal lover 🐾",
    "Chill 😎",
    "Talkative 🗣️",
    "Music lover 🎶",
    "Nature lover 🌿",
    "Funny 😄",
    "Caring 🤗",
    "Gamer 🎮",
    "Dancer 💃",
    "Fashionable 👗",
    "Hardworking 💼",
    "Intellectual 🧠",
    "Any 🤷‍♂️"
  ];
  
  const [selected, setSelected] = useState(
    words.reduce((acc, word) => ({ ...acc, [word]: false }), {})
  );

  const [preferences, setPreferences] = useState([]);

  const toggleWord = (word) => {
    setSelected((prev) => ({
      ...prev,
      [word]: !prev[word],
    }));

    setPreferences((prevPrefs) => {
      if (prevPrefs.includes(word)) {
        // Remove the word if it's already selected
        return prevPrefs.filter((item) => item !== word);
      } else {
        // Add the word if it's not already selected
        return [...prevPrefs, word];
      }
    });
  };

  useEffect(() => {
    console.log("Preferences updated:", preferences);
  }, [preferences]);

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
              What are your interests?
            </Text>
            <Text className="text-xl font-semibold text-white px-4 pt-0 pb-4">
              Select any that apply.🤗
            </Text>
          </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          <View className="flex flex-row flex-wrap gap-2 px-4">
            {words.map((word) => (
              <TouchableOpacity
                key={word}
                onPress={() => toggleWord(word)}
                className={` border-2 border-purple-950 rounded-full px-6 py-3 ${
                  selected[word] ? "bg-purple-800" : "bg-black"
                }`}
              >
                <Text className="text-white font-medium">{word}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity onPress={()=> {navigation.navigate("AgeRange")}} className=" absolute flex flex-row bottom-24 right-7 p-3 px-6 bg-purple-900 rounded-full">
            <Text className=" text-white mr-2">Next</Text>
            <AntDesign name="arrowright" size={20} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>
    </ImageBackground>
  );
};

export default MatchingPref1;
