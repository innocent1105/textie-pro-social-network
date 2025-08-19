import React, { useEffect, useState, useRef} from "react";
import { View, Text, Button, Pressable, Platform , KeyboardAvoidingView, TextArea, Animated,ImageBackground, TouchableWithoutFeedback , TextInput, Image, StyleSheet, ActivityIndicator,TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';


import BottomNav from "./components/BottomNav";
import ChatUser from "./components/ChatUser";
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

import {Country , State, City} from 'country-state-city';
import { Navigation } from "swiper/modules";

const SettingsScreen = ()=>{
    let navigation = useNavigation();

   



    const [isLoggedIn, setIsLoggedIn] = useState(true); 
    const [user_id , setUserId] = useState(null);

    console.log(user_id)
    let server_api_base_url = "http://192.168.165.234/textiepro/apis/";

    const getToken = async () => {
        try {
            const token = await SecureStore.getItemAsync('user_session');
            console.log('Loaded token:', token);
            if(token === null){
                navigation.navigate('Login');
                setIsLoggedIn(false);
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
        if (isLoggedIn === false) {
          navigation.navigate('Login');
        }
      }, [isLoggedIn]);
    

       
    return (
       <View>
          <View className =" absolute right-0 left-0 border-b border-gray-200 p-4 pb-2 pt-12">
                <View className =" w-full flex flex-row justify-between gap-2">
                    <View className ="flex flex-row">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 pt-1">
                          <Entypo name="chevron-left" size={24} color="#0E3386" />
                      </TouchableOpacity>
                        <MaskedView
                            maskElement={
                                <View className="bg-transparent">
                                    <Text className="text-2xl font-bold text-black">Settings</Text>
                                </View>
                            }
                            >
                            <LinearGradient
                                colors={['#1C39BB', '#1877F2']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="h-8"
                            >
                                <Text className="text-2xl font-bold opacity-0">Settings</Text>
                            </LinearGradient>
                        </MaskedView>
                        
                    </View>
                    <View className="">
                   
                    </View>
                </View>
            </View>

            <ScrollView className=" mt-24 p-4">
                <Text className=" m-2 font-semibold text-gray-700">Account Settings</Text>

                <TouchableOpacity onPress={()=>{navigation.navigate("MatchingPref1")}} className=" my-1 border-2 border-gray-300 text-gray-300 bg-gray-200 rounded-md w-full flex flex-row">
                    <View className=" p-2 w-1/5 justify-center flex flex-row">
                        <View className=" flex flex-col justify-center">
                            <MaterialCommunityIcons name="heart-plus" size={28} color="" />
                        </View>
                    </View>
                    <View className="p-2 px-0 w-4/5 pt-3">
                        <Text className=" font-semibold ">Matching Preferences</Text>
                        <Text className=" text-xs text-gray-500 pr-4">
                            Control matches and the people you interact with based on your 
                            personal Preferences.
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{navigation.navigate("EditProfile")}} className=" my-1 border-2 border-gray-300 text-gray-300 bg-gray-200 rounded-md w-full flex flex-row">
                    <View className=" p-2 w-1/5 justify-center flex flex-row">
                        <View className=" flex flex-col justify-center">
                            <FontAwesome6 name="user-circle" size={24} color="" />
                        </View>
                    </View>
                    <View className="p-2 px-0 w-4/5 pt-3">
                        <Text className=" font-semibold ">Profile settings</Text>
                        <Text className=" text-xs text-gray-500 pr-4">
                           Manage profile picture username, contact details.
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{}} className=" my-1 border-2 border-gray-300 text-gray-300 bg-gray-200 rounded-md w-full flex flex-row">
                    <View className=" p-2 w-1/5 justify-center flex flex-row">
                        <View className=" flex flex-col justify-center">
                            <Feather name="eye" size={24} color="black" />
                        </View>
                    </View>
                    <View className="p-2 px-0 w-4/5 pt-3">
                        <Text className=" font-semibold ">Privacy and Visibility</Text>
                        <Text className=" text-xs text-gray-500 pr-4">
                            Manage your privacy and Visibility by controlling who is able to view your profile.
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{}} className=" my-1 border-2 border-gray-300 text-gray-300 bg-gray-200 rounded-md w-full flex flex-row">
                    <View className=" p-2 w-1/5 justify-center flex flex-row">
                        <View className=" flex flex-col justify-center">
                            <Feather name="lock" size={24} color="black" />
                        </View>
                    </View>
                    <View className="p-2 px-0 w-4/5 pt-3">
                        <Text className=" font-semibold ">Password and Security</Text>
                        <Text className=" text-xs text-gray-500 pr-4">
                            Manage your passwords, login credentials and Security.
                        </Text>
                    </View>
                </TouchableOpacity>

                <Text className=" m-2 mt-4 font-semibold text-gray-700">Logout</Text>

                <TouchableOpacity 
                    onPress={ async ()=>{
                        try {
                            await AsyncStorage.removeItem("chats");
                            console.log("Chats deleted");
                        } catch (error) {
                            console.error("Error deleting chats:", error);
                        }
                        await AsyncStorage.clear();

                        const keys = ['user_id', 'token'];
                        for (const key of keys) {
                            await SecureStore.deleteItemAsync(key);
                        }
                        console.log("logged out");
                        setIsLoggedIn(false);
                    }}

                    className=" my-1 border-2 border-gray-300 text-gray-300 bg-gray-200 rounded-md w-full flex flex-row"
                >
                    <View className=" p-2 w-1/5 justify-center flex flex-row">
                        <View className=" flex flex-col justify-center">
                            <Feather name="log-out" size={24} color="" />
                        </View>
                    </View>
                    <View className="p-2 px-0 w-4/5 pt-3">
                        <Text className=" font-semibold ">Logout</Text>
                        <Text className=" text-xs text-gray-500 pr-4">
                            Logout from this account - All data from your account will be removed from this device.
                        </Text>
                    </View>
                </TouchableOpacity>

                <Text className=" m-2 mt-4 font-semibold text-gray-700">Deactivation</Text>


                <TouchableOpacity onPress={()=>{}} className=" my-1 border-2 border-red-500 text-gray-300 bg-red-50 rounded-md w-full flex flex-row">
                    <View className=" p-2 w-1/5 justify-center flex flex-row">
                        <View className=" flex flex-col justify-center">
                            <MaterialCommunityIcons name="delete-forever" size={24} color="#DC143C" />
                        </View>
                    </View>
                    <View className="p-2 px-0 w-4/5 pt-3">
                        <Text className=" font-semibold text-gray-800">Account Deactivation</Text>
                        <Text className=" text-xs text-gray-500 pr-4">
                            Deactivating your account will opt-you-out from the platform permanently. 
                            All data from this account will be lost.
                        </Text>
                    </View>
                </TouchableOpacity>
                




            </ScrollView>


       </View>
    )
}

export default SettingsScreen;