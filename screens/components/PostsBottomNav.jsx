import React from "react";
import { View, Text, Button, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Octicons from '@expo/vector-icons/Octicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
const PostsBottomNav = () => {
  const navigation = useNavigation();

  const goToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View className="absolute bottom-0 w-full border border-gray-200 bg-white p-1 pb-16">
    <View className =" flex flex-row mx-6 justify-between p-1">
        <Pressable className=" border-gray-300 p-4 pt-6  rounded-md" title="Hello" onPress={() => goToScreen("Posts")} >
            <Entypo name="home" size={24} color="#B0C4DE" />
        </Pressable>
      
        <Pressable className=" border-gray-300 p-4 pt-6 rounded-md" title="Hello" onPress={() => goToScreen("Home")} >
            <Ionicons name="chatbubble-ellipses" size={24} color="#B0C4DE" />
        </Pressable>

        {/* <Pressable className=" border-gray-300 p-4 rounded-md" title="Hello" onPress={() => goToScreen("Swipe")} >
            <FontAwesome name="bandcamp" size={36} color="#1E90FF" />
        </Pressable> */}

        <Pressable className=" border-gray-300 p-4 rounded-md" title="Hello" onPress={() => goToScreen("Swipe")} >
            <FontAwesome5 name="fire-alt" size={36} color="#1E90FF" />
        </Pressable>


        <Pressable className=" border-gray-300 p-4 pt-6  rounded-md" title="Hello" onPress={() => goToScreen("Home")} >
            <MaterialCommunityIcons name="heart-plus" size={28} color="#B0C4DE" />
        </Pressable>

        <Pressable className="  border-gray-300 p-4 pt-6  rounded-md" title="Hello" onPress={() => goToScreen("Profile")} >
            <FontAwesome5 name="user-alt" size={24} color="#B0C4DE" />
        </Pressable>
    </View>

  </View>
  );
};

export default PostsBottomNav;
