import React, { useEffect, useState} from "react";
import { View, TextInput, Button, Text,  ActivityIndicator, Switch, ScrollView, ImageBackground, Pressable  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';


const LoginScreen = ()=>{
    let navigation = useNavigation();



    return (
        <ImageBackground
            className=" bg-black"
            source={require('../assets/images/models/model1.jpg')}
            resizeMode="cover"
            style={{ flex: 1 }}
        >
            <View className=" mt-20 p-2">

            </View>

            <View className=" mt-10 p-4">
                <Text className=" text-white text-6xl font-bold">
                    Connecting to the world has never been this Better 
                </Text>
                <Text className=" text-white text-sm font-bold">
                    The people you're looking for, are looking
                </Text><Text className=" text-white text-sm font-bold">
                    for you!
                </Text>
            </View>

            <View className=" absolute bottom-28 w-full px-4">
                <Pressable android_ripple={{ color: '#222' }} onPress={()=>{ navigation.navigate("MainLogin")}} className=" bg-black px-4 rounded-full text-center border p-4">
                    <Text className=" font-semibold text-center text-white text-xl">Get Started</Text>
                </Pressable>
            </View>
          
        </ImageBackground>
    )
}

export default LoginScreen;