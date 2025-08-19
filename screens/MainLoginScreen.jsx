import React, { useEffect, useState} from "react";
import { View, TextInput, Button, Text, ActivityIndicator, Switch, ScrollView, ImageBackground, Pressable  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import AsyncStorage from '@react-native-async-storage/async-storage';

// let LoggedIn = false;

const MainLoginScreen = ()=>{
    let navigation = useNavigation();

    const saveSession = async (token, user)=>{
        await SecureStore.setItemAsync('user_session', token);
        await SecureStore.setItemAsync('user_id',  JSON.stringify(user));
    }


    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');

    
    let [formError, setFormError] = useState(false);
    let [backendResponse, setBResponse] = useState('');

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previous => !previous);

    const [loading, setLoadingForm] = useState(false);

    const handleSubmit = async ()=>{
        setLoadingForm(true);
        try{
            const res = await axios.post('http://192.168.165.234/textiepro/apis/login.php', {
                email: email,
                password: password
            });

            if(res.data.status == "success"){
           

                let user_id = res.data.user_id;
                saveSession("true", user_id);

                setFormError(false);
                setBResponse("");

                await AsyncStorage.removeItem("chats");

                navigation.navigate("Home");
                // alert(user_id)

                
            }else if(res.data == "error-1"){
                setFormError(true);
                setBResponse("No account found for this email");
            }else if(res.data == "wrong-password"){
                setFormError(true);
                setBResponse("Incorrect password");
            }else{
                setFormError(true);
                setBResponse("An unknown error occurred");
            }

            setLoadingForm(false);

        }catch(loginerror){
            console.log(loginerror)
        }
    };

    return (
        <ImageBackground
            source={require('../assets/images/models/model4.jpg')}
            resizeMode="cover"
            style={{ flex: 1 }}
        >
         <View className="mt-40 min-h-screen bg-white rounded-t-3xl shadow-lg">
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <Text className="text-blue-600 text-center text-3xl font-extrabold pt-10">
                Welcome Back
                </Text>
                <Text className="text-gray-400 text-center text-base font-medium mb-6">
                Enter your login details below
                </Text>

                {formError && (
                <Text className="text-red-500 mx-6 my-2 rounded-lg border border-red-300 bg-red-50 text-center py-2 px-3 text-sm font-semibold">
                    {backendResponse}
                </Text>
                )}

                <View className="px-6 space-y-5">
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-text"
                    className="border border-gray-200 text-gray-800 bg-gray-50 p-4 rounded-xl"
                    placeholderTextColor="#9CA3AF"
                />

                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    className="border border-gray-200 text-gray-800 bg-gray-50 p-4 rounded-xl"
                    placeholderTextColor="#9CA3AF"
                />

                <View className="flex-row justify-between items-center">
                    <Text className="text-gray-500 text-sm">
                    ✅ I agree to the terms of usage
                    </Text>
                    <Text className="text-blue-500 font-semibold text-sm">
                    Forgot password?
                    </Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#2563EB" />
                ) : (
                    <Pressable
                    onPress={handleSubmit}
                    className="bg-blue-600 py-4 rounded-xl shadow-sm active:opacity-80"
                    >
                    <Text className="text-white text-center font-semibold text-base">
                        Login
                    </Text>
                    </Pressable>
                )}

                <Text className="text-center text-sm text-gray-500 pt-6 border-t border-gray-100">
                    Don’t have an account?
                    <Text
                    className="text-blue-600 font-semibold"
                    onPress={() => navigation.navigate("Signup")}
                    >
                    {" "}Signup here
                    </Text>
                </Text>
                </View>
            </ScrollView>
            </View>

        </ImageBackground>
    )
}

export default MainLoginScreen;