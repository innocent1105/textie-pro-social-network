import React from "react";
import { View, Text, Button, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Octicons from '@expo/vector-icons/Octicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const PostsBottomNav = () => {
  const navigation = useNavigation();

  const goToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
   
<View className="absolute bottom-0 w-full">

  
  <BlurView
    intensity={100}
    tint="light"
    className="w-full p-1 pb-10 bg-white"
    style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
  >
    <View className="flex flex-row justify-between mx-6 py-2 items-center">
      <Pressable
        className="p-4  bg-white rounded-md items-center"
        onPress={() => goToScreen("Posts")}
      >
        <Entypo name="home" size={24} color="#1E90FF" />
      </Pressable>

      <Pressable
        className="p-4 rounded-md items-center"
        onPress={() => goToScreen("Home")}
      >
        <Ionicons name="chatbubble-ellipses" size={24} color="#002147" />
      </Pressable>

      <Pressable
        className="p-4 rounded-md items-center"
        onPress={() => goToScreen("Swipe")}
      >
        <FontAwesome5 name="fire-alt" size={36} color="#002147" />
      </Pressable>

      <Pressable
        className="p-4 rounded-md items-center"
        onPress={() => goToScreen("Home")}
      >
        <MaterialCommunityIcons name="heart-plus" size={28} color="#002147" />
      </Pressable>

      <Pressable
        className="p-4 rounded-md items-center"
        onPress={() => goToScreen("Profile")}
      >
        <FontAwesome5 name="user-alt" size={24} color="#002147" />
      </Pressable>
    </View>
  </BlurView>
</View>
  
  );
};

export default PostsBottomNav;
