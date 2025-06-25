import React from "react";
import { View, Text, Button, Pressable, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Octicons from '@expo/vector-icons/Octicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const ChatUser = ({ id,username, image, time, message, type, status, sender })=>{
    let navigation = useNavigation();
    let server_api_base_url = "http://192.168.38.234/textiepro/apis/";
    const openChat = (userId, username, image)=>{
        let ChatUserDetails = {
            userId,
            username,
            image
        };

        navigation.navigate("Chat", { Chat : ChatUserDetails })
    }


    const MessageStatusView = ({ status, sender }) => {
        if (sender == false) {
            if (status == "sent") {
              return (
                <View className=" flex flex-row justify-end ">
                    <View className=" p-1 px-2 rounded-full bg-green-400 text-white">
                        <Text className=" text-center text-xm"> 1</Text>
                    </View>
                </View>
              )
            } else {
                return null
            }
          }

        let icon = null;
      
        if (status === "sent") {
          icon = <MaterialIcons name="check" size={14} color="gray" />;
        } else if (status === "seen") {
          icon = <MaterialCommunityIcons name="check-all" size={14} color="#007FFF" />;
        } else if (status === "delivered") {
          icon = <MaterialCommunityIcons name="check-all" size={14} color="gray" />;
        }
      
        return (
          <View className="flex flex-row justify-end p-2">
            <Text className="text-md font-bold">
              {icon}
            </Text>
          </View>
        );
      };
      
      

   









    return(
        <TouchableOpacity onPress={() => openChat(id, username, image)}>
            <View className = " flex flex-row justify-between  mb-0 p-2 px-3">
                <View className = " flex gap-2 flex-row w-3/5 ">
                    <View>
                        <Image className = " w-12 h-12 rounded-full " source={{ uri: `${server_api_base_url}/profilepictures/${image}` }} />
                    </View>
                    <View className =" w-full h-11 overflow-hidden">
                        <Text className = " pt-2 text-md font-medium text-gray-700">{username}</Text>
                        <Text className = " text-xs w-3/4 overflow-auto text-gray-400">{message}</Text>
                    </View>
                </View>

                <View className = " w-2/5 flex justify-end ">
                    <View>
                        <Text className = " pt-2 text-xs text-right text-gray-400">{time}</Text>

                       <MessageStatusView status={status} sender={sender}/>
                        
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}


export default ChatUser;