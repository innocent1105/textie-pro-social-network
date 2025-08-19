import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Vibration } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const server_api_base_url = "http://192.168.6.234/textiepro/apis/";

const SuggestedUser = ({ id, username, image, time, message, type, status, sender }) => {

  const navigation = useNavigation();
  const [vibrateState, setVibrateState] = useState(true);

  const openChat = () => {
    const ChatUserDetails = { userId: id, username, image };
    navigation.navigate("Chat", { Chat: ChatUserDetails });
  };

 
  // useEffect(() => {
  //   if (status === "sent" && sender === false && vibrateState) {
  //     Vibration.vibrate(350);
  //     setTimeout(() => Vibration.vibrate(350), 300);
  //     setVibrateState(false);
  //   }
  // }, [status, sender, vibrateState]);

  const MessageStatusView = () => {
    if (!sender) {
      if (status === "sent") {
        return (
          <View className="flex flex-row justify-end">
            <View className="p-1 px-2 rounded-full bg-green-400">
              <Text className="text-center font-medium text-xs">1+</Text>
            </View>
          </View>
        );
      }
      return null;
    }

    let icon = null;
    if (status === "sent") {
      icon = <MaterialIcons name="check" size={14} color="gray" />;
    } else if (status === "delivered") {
      icon = <MaterialCommunityIcons name="check-all" size={14} color="gray" />;
    } else if (status === "seen") {
      icon = <MaterialCommunityIcons name="check-all" size={14} color="#007FFF" />;
    }

    return (
      <View className="flex flex-row justify-end p-2">
        {icon}
      </View>
    );
  };

  return (
    <TouchableOpacity onPress={openChat}>
      <View className="flex flex-row justify-between mb-0 p-2 px-3">
        {/* Left: Profile and Info */}
        <View className="flex flex-row gap-2 w-3/5">
          <Image
            className="w-12 h-12 rounded-full"
            source={{ uri: `${server_api_base_url}/profilepictures/${image}` }}
          />
          <View className="w-full h-11 overflow-hidden">
            <Text className="pt-2 text-md font-medium text-gray-700">{username}</Text>
            <Text className="text-xs w-3/4 text-gray-400 overflow-hidden">{message}</Text>
          </View>
        </View>

        {/* Right: Time and Status */}
        <View className="w-2/5 flex justify-end items-end">
          <Text className="pt-2 text-xs text-gray-400">{time}</Text>
          <MessageStatusView />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SuggestedUser;
