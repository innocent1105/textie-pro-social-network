import React, { useEffect, useState, useRef} from "react";
import { View, Text, Button, Pressable, TextArea, ImageBackground, TouchableWithoutFeedback , TextInput, Image, StyleSheet, ActivityIndicator,TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNav from "./components/BottomNav";
import ChatUser from "./components/ChatUser";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from "react-native-reanimated";
import AsyncStorage from '@react-native-async-storage/async-storage';
const HomeScreen = ()=>{
    let navigation = useNavigation();
    const [isLoggedIn, setIsLoggedIn] = useState(null); 
    const [user_id , setUserId] = useState(null);

    let server_api_base_url = "http://192.168.141.234/textiepro/apis/";

    const getToken = async () => {
        try {
            const token = await SecureStore.getItemAsync('user_session');
            console.log('Loaded token:', token);
            if(token === null){
          navigation.navigate('Login');

            }
            return token;
        } catch (e) {
            console.error('Failed to get token', e);
            return null;
        }
    };

    const getUserId = async () => {
        try {
            const token = await SecureStore.getItemAsync('user_id');
            setUserId(parseInt(token.replace(/\D/g, ""), 10))
 
            return token;
        } catch (e) {
            console.error('Failed to get token', e);
            return null;
        }
    };

    let [n , setN] = useState(0);

    useEffect(() => {
        getToken();
        getUserId();
      }, []);
    
      useEffect(() => {
        if (isLoggedIn === "false") {
          navigation.navigate('Login');
        }
      }, [isLoggedIn]);

      // fetch data
      const [loadingUsers, setLoadingUsers] = useState(true);

      const [users, setUsers] = useState([]);
      let getUserUrl = "chat_user.php";
      getUserUrl = server_api_base_url + getUserUrl;


      const getChatUsers = async ()=>{
        const res = await axios.post(getUserUrl, {
            user_id: user_id
        }, 5000);

        setUsers(res.data);
        setLoadingUsers(false);

        await AsyncStorage.setItem("chats", JSON.stringify(res.data));
      }

      

      const fetchMessages = async () => {
        try {
          const value = await AsyncStorage.getItem("chats");
          if (value !== null) {
            setUsers(JSON.parse(value));
            setLoadingUsers(false);
            console.log("Loaded chats from cache");
            await getChatUsers();
          } else {
            await getChatUsers();
          }
        } catch (error) {
          console.error("Failed to load chats from storage:", error);
         
          await getChatUsers();
        }
      };
      
      fetchMessages();

     


      
    return (
        <View className=" flex-1 bg-white">
            <View>
                <View className=" absolute bg-white w-full right-0  mt-8 p-4">
                    <View className ="flex flex-row justify-between gap-2">
                        <View className ="w-1/2">
                            <MaskedView
                                maskElement={
                                    <View className="bg-transparent">
                                    <Text className="text-2xl font-bold text-black">Messages</Text>
                                    </View>
                                }
                                >
                                <LinearGradient
                                    colors={['#1C39BB', '#1877F2']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    className="h-8"
                                >
                                    <Text className="text-2xl font-bold opacity-0">Messages</Text>
                                </LinearGradient>
                            </MaskedView>
                        </View>
                        <View className ="  w-1/2 flex flex-row justify-end px-4">
                            <TouchableOpacity onPress={() => {navigation.navigate("Settings")}} className =" p-2 rounded-sm flex justify-center">
                                <Feather name="settings" size={20} color="#111" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>


                    

                <ScrollView className = " bg-white mt-24 mb-32">
                
                {users.map((user => {
                    return (
                        <View key = {user[0]} className="">
                            <ChatUser
                                key={user[0]}      // id
                                id={user[0]}
                                username={user[1]}
                                image={user[2]}
                                time={user[3]}
                                message={user[4]}
                                type={user[5]}
                                status={user[6]}
                                sender={user[7]}
                            />
                        </View>
                        
                    )
                }))}

                
                    

             
                    
                    


                    

                    
                    
                </ScrollView>



                {/* <Text className = " bg-blue-800">Hello there. Home screen Here!!</Text> */}
            </View>
            <BottomNav/>
        </View>
    )
}

export default HomeScreen;