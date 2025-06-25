import React, { useEffect, useState, useRef} from "react";
import { View, Text, Button, Pressable, FlatList, TextArea, Animated,ImageBackground, TouchableWithoutFeedback , TextInput, Image, StyleSheet, ActivityIndicator,TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNav from "./components/BottomNav";
import ChatUser from "./components/ChatUser";
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Foundation from '@expo/vector-icons/Foundation';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

const ViewImageScreen = ({ route })=>{
    const { SelectedImage } = route.params;

    console.log(SelectedImage)

    let navigation = useNavigation();
    const [isLoggedIn, setIsLoggedIn] = useState(null); 
    const [user_id , setUserId] = useState(null);

    let server_api_base_url = "http://192.168.38.234/textiepro/apis/";

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
            console.log('Loaded user_id:', token);
            setUserId(parseInt(token.replace(/\D/g, ""), 10))
            return token;
        } catch (e) {
            console.error('Failed to get token', e);
            return null;
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



       
    return (
    <View className =" ">
          <View className =" absolute  border-gray-200 p-4 pb-2 pt-12">
                <View className ="flex flex-row justify-between gap-2">
                    <View className ="w-1/2 flex flex-row">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 pt-1">
                          <Entypo name="chevron-left" size={24} color="#0E3386" />
                      </TouchableOpacity>
                        {/* <MaskedView
                            maskElement={
                                <View className="bg-transparent">
                                <Text className="text-2xl font-bold text-black">Profile</Text>
                                </View>
                            }
                            >
                            <LinearGradient
                                colors={['#1C39BB', '#1877F2']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="h-8"
                            >
                                <Text className="text-2xl font-bold opacity-0">Profile</Text>
                            </LinearGradient>
                        </MaskedView> */}
                    </View>
                    {/* <View className ="  w-1/2  flex flex-row justify-end px-10">
                        <TouchableOpacity onPress={() => { console.log("heelo")}} className =" p-2 rounded-sm flex justify-center">
                        <Feather name="settings" size={20} color="#0E3386" />
                        </TouchableOpacity>
                    </View> */}
                </View>
            </View>

            <ImageBackground
                className =" h-screen border border-gray-200 mt-28 z-50"
                source={require('../assets/loading.jpg')}
                resizeMode="cover"
            >
                <View
                    style={ styles.imageInView}
                    className ="">
                        <Image
                            source={{ uri: `${server_api_base_url}/uploads/${SelectedImage}`}}
                            className="w-full h-full object-cover"
                        />
                </View>
            </ImageBackground>
           
      </View>
    )
}


const styles = StyleSheet.create({
    imageInView: {
      height: "80%",
    }
})
export default ViewImageScreen;