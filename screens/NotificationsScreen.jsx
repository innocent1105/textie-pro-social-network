import React, { useEffect, useState, useRef} from "react";
import { View, Text, Button, Pressable, TextArea, Animated,ImageBackground, TouchableWithoutFeedback , TextInput, Image, StyleSheet, ActivityIndicator,TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNav from "./components/BottomNav";
import ChatUser from "./components/ChatUser";
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RefreshControl } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const NotificationsScreen = ()=>{

    let navigation = useNavigation();
    const [isLoggedIn, setIsLoggedIn] = useState(null); 
    const [user_id , setUserId] = useState(null);

    let server_api_base_url = "http://192.168.165.234/textiepro/apis/";

    const getToken = async () => {
        try {
            const token = await SecureStore.getItemAsync('user_session');
            // console.log('Loaded token:', token);
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
            // console.log('Loaded user_id:', token);
            setUserId(parseInt(token.replace(/\D/g, ""), 10))
            return token;
        } catch (e) {
            console.error('Failed to get token', e);
            return null;
        }
    };


    const [fetchingData , setFetchData] = useState(true);

   
    const [refreshing, setRefreshing] = useState(true);


    const getUserData = async () => {
        try {
          const res = await axios.post(`${server_api_base_url}notifications.php`, {
            user_id: user_id
          });
          
          console.log(res.data);
          setFetchData(res.data);
        } catch (fetchError) {
          console.log("getUserData error:", fetchError);
        }
    };
 

   

    useEffect(() => {
        getToken();
        getUserId();
    }, []);
    
    useEffect(() => {
        if (isLoggedIn === "false") {
            navigation.navigate('Login');
        }
    }, [isLoggedIn]);


    const onRefresh = async () => {
        setRefreshing(true);
   
        setRefreshing(false);
    };


    useEffect(() => {
        if (user_id) {
            getUserData();
            setRefreshing(false);
        }
    }, [user_id]);


   
       
    return (
        <View>
            <View className =" absolute border border-gray-200 p-4 pb-2 pt-12">
                <View className ="flex flex-row justify-between gap-2">
                    <View className ="w-1/2 flex flex-row">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 pt-1">
                          <Entypo name="chevron-left" size={24} color="#0E3386" />
                      </TouchableOpacity>
                        <MaskedView
                            maskElement={
                                <View className="bg-transparent">
                                <Text className="text-2xl font-bold text-black">Notifications</Text>
                                </View>
                            }
                            >
                            <LinearGradient
                                colors={['#1C39BB', '#1877F2']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="h-8"
                            >
                                <Text className="text-2xl font-bold opacity-0">Notifications</Text>
                            </LinearGradient>
                        </MaskedView>
                    </View>
                    <View className ="  w-1/2  flex flex-row justify-end px-10">
                        <TouchableOpacity onPress={() => {navigation.navigate("Settings")}} className =" p-2 rounded-sm flex justify-center">
                            <Feather name="settings" size={20} color="#0E3386" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                className="bg-white mt-24 mb-12 py-2"
                >
                {Array.isArray(fetchingData) && fetchingData.length > 0 ? (
                    fetchingData.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                navigation.navigate("Chat", {
                                Chat: {
                                    username: item.username,
                                    userId: item.other_user,
                                    image: item.profile,
                                },
                                });
                            }}
                            className="bg-white mx-4 my-2 rounded-xl shadow-sm border border-gray-100 p-4"
                            >
                      
                            <View className="flex flex-row justify-between items-center">
                                <View className="flex flex-row items-center">
                                <Text className="text-gray-900 font-semibold text-sm capitalize">
                                    {item.type}
                                </Text>
                                <Text className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                                    {new Date(item.date).toLocaleDateString()}
                                </Text>
                                </View>
                                <MaterialIcons name="keyboard-arrow-right" size={22} color="#9CA3AF" />
                            </View>

                            <View className="mt-3 flex flex-row items-center">
                                <Image
                                className="w-12 h-12 rounded-full"
                                source={{
                                    uri: `${server_api_base_url}/profilepictures/${item.profile}`,
                                }}
                                />
                                <View className="ml-3 flex-1">
                                <Text className="text-gray-800 font-semibold">{item.username}</Text>
                                {item.status ? (
                                    <Text className="text-gray-500 text-xs mt-0.5">Sent you a message</Text>
                                ) : null}
                                </View>
                            </View>

                            <View className="mt-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                                <Text className="text-gray-700 text-sm">{item.message}</Text>
                            </View>
                        </TouchableOpacity>

                    ))
                ) : (
                    <View className="p-4">
                    <Text className="text-gray-500 text-center">No notifications found.</Text>
                    </View>
                )}
                </ScrollView>

            </View>
        </View>
    )
}

export default NotificationsScreen;