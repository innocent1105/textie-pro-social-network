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

const LikedUserScreen = ({ route })=>{
    const { User } = route.params;
    const likedUserName = User.name;
    const likedUserImage = User.image;
    const likedUserId = User.id;

    


    const [MessageDetails, setMessageDetails] = useState({});

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


    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    let getPostsUrl = "liked_user_posts.php";
    getPostsUrl = server_api_base_url + getPostsUrl;

    const getPosts = async () => {
        try {
            const res = await axios.post(getPostsUrl, {
                user_id : likedUserId 
            });
            setPosts(res.data);
            
            setLoadingPosts(false);
            console.log(res.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    // Run getPosts once user_id is available
    useEffect(() => {
        if (user_id) {
            getPosts();
        }
    }, [user_id]);


    getPosts();

    const OpenPost = (postData)=>{
        navigation.navigate('OpenPost', { Post : postData});
    }

    const viewImage = (image)=>{
        navigation.navigate('ViewImage', { SelectedImage : image});
        console.log(image)
    }
       
    const OpenMessages = (User)=>{
        navigation.navigate("Chat", { Chat : 
            {
                "username" : User.name,
                "userId" : User.id,
                "image" : User.image
            }
        });
    }

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
                        </MaskedView>
                    </View>
                    <View className ="  w-1/2  flex flex-row justify-end px-10">
                        <TouchableOpacity onPress={() => { console.log("heelo")}} className =" p-2 rounded-sm flex justify-center">
                        <Feather name="settings" size={20} color="#0E3386" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View>
            
                <ScrollView className = " bg-white mt-24 mb-12">
                    <ImageBackground
                        className =" p-4 pb-2"
                        source={require('../assets/images/chatbg3.jpg')}
                        resizeMode="cover"
                        style={{ flex: 1 }}
                    >
                        <View className =" p-2 flex flex-row justify-center">
                           <View className =" flex flex-row justify-center p-1 border-4 border-gray-200 rounded-full ">
                                <Image
                                    source={{ uri: `${server_api_base_url}/profilepictures/${likedUserImage}`}}
                                    className="w-28 h-28 object-cover rounded-full"
                                />
                           </View>
                        </View>
                        <View className =" mb-4">
                            <Text className =" font-bold text-lg text-center text-blue-950">{likedUserName}</Text>
                            <Text className =" font-bold text-sm text-center text-blue-950">23 years - Lives in Lusaka</Text>
                        </View>
                        <View className =" flex flex-row justify-center gap-8 p-2 ">
                            {/* <TouchableOpacity className=" p-2" onPress={()=> {}}>
                                <Text className =" font-bold text-blue-950">Follow </Text>
                            </TouchableOpacity> */}
                            {/* <TouchableOpacity className =" border border-gray-200 p-2 px-10 bg-white rounded-md" onPress={()=> {}}>
                                <Text className =" font-bold text-blue-950">Message</Text>
                            </TouchableOpacity> */}

                            <TouchableOpacity className=" p-2" onPress={()=> {}}>
                                <Text className =" font-bold text-blue-950">Follow</Text>
                            </TouchableOpacity> 

                            <TouchableOpacity className =" border border-gray-200 p-2 px-10 bg-white rounded-md" onPress={()=> OpenMessages(User)}>
                                <Text className =" font-bold text-blue-950">Message</Text>
                            </TouchableOpacity>

                        </View>
                    </ImageBackground>

                    <View className="">
                        <Text className =" font-bold p-4 text-gray-400">Posts</Text>

                        
                        { loadingPosts ? (
                            <View className ="">
                                <Text className =" font-bold p-4 text-center text-blue-500">Loading posts...</Text>
                            </View>
                        ) : (
                            <View >
                           { posts.length > 0 ? (
                            <View className="flex flex-wrap flex-row">
                            {posts.map((post, index) => {
                                    const images = typeof post.images === 'string' ? JSON.parse(post.images) : [];
                                    
                                    return images.length > 0 ? (
                                    images.map((image, imgIndex) => (
                                        <TouchableOpacity
                                            key={`${index}-${imgIndex}`}
                                            onPress={() => viewImage(images[imgIndex])}
                                            className="w-1/3 p-1"
                                        >
                                        <ImageBackground
                                            source={{ uri: `${server_api_base_url}uploads/${image.replace(/\\/g, '')}` }}
                                            className="h-40 rounded-lg overflow-hidden"
                                            imageStyle={{ borderRadius: 12 }} // Rounded corners inside ImageBackground
                                            resizeMode="cover"
                                        >
                                            {/* Overlay elements go here */}
                                            <View className="flex-1  justify-end p-2 bg-black/30 rounded-b-lg">
                                            <Text className="">
                                                <Ionicons name="play" size={24} color="#ccc" />
                                            </Text>
                                            </View>
                                        </ImageBackground>
                                        </TouchableOpacity>
                                    ))
                                    ) : null;
                                })
                                }
                            </View>
                           ) : (
                            <View className=" p-4 pt-0 text-center">
                                <Text className=" text-center text-gray-500 font-bold ">No stories from {likedUserName}</Text>
                            </View>
                           )}
                            </View>
                        )}
                        

                        

                         
                    </View>
                </ScrollView> 
            </View>
        </View>
    )
}

export default LikedUserScreen;