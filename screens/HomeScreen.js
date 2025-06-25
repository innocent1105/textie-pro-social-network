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

const HomeScreen = ()=>{
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
      }

      getChatUsers();


     

      const [searchText, setSearchText] = useState("");

      const [searchBarIsOn, setSearchBarIsOn] = useState(false);
      const [searchBtnIsClicked, setSearchBtnClick ] = useState(false);

      
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
                        <View className ="  w-1/2 flex flex-row pr-5 justify-end">
                           
                            <TouchableOpacity onPress={() => {setSearchBtnClick(true); setSearchBarIsOn(true)}} className =" p-2 rounded-sm flex justify-center ml-2">
                                <Feather name="search" size={20} color="black" />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {navigation.navigate("Settings")}} className =" p-2 rounded-sm flex justify-center ml-2">
                                <Feather name="settings" size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {searchBtnIsClicked ? (
                        <View className =" border-2 text-gray-800 rounded-3xl mt-4 border-gray-300">
                        {/* <Text className = " text-sm text-gray-400 ">What's on your mind?</Text> */}
                        <TextInput
                    
                            placeholderTextColor={"#999"}
                            value={searchText}
                            onChangeText={setSearchText}
                            onFocus={() => setSearchBarIsOn(true)}
                            onBlur={() => {setSearchBarIsOn(false); setSearchBtnClick(false)}}
                            className=" text-sm font-medium px-4 text-gray-800"
                        />
                    </View>
                    ) : (
                        <Text></Text>
                    )}

                    { searchBarIsOn ? (
                        <TouchableWithoutFeedback onPress={( )=> { Keyboard.dismiss; setSearchBarIsOn(false)}}>
                            <View>
                                <Text className = "  mt-2 px-2 text-xs text-gray-500">Search results</Text>
                                <View className =" border p-4 h-20 mt-2 border-gray-200 rounded-md">
                                    <Text className = "  mt-2 px-2 text-xs text-gray-500">Feature in development</Text>
                                </View>
                            </View>
                            
                        </TouchableWithoutFeedback>
                    ) : (
                        <Text></Text>
                    )}
                        
                
                </View>


                    

                <ScrollView className = {searchBarIsOn ? ( " bg-white mt-96 mb-32" ) : ( " bg-white mt-24 mb-32")}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className=" py-2 flex-row gap-2" 
                >
                    <TouchableOpacity onPress={() => goToUploads()} className=" pl-4">
                    <View
                        key={0}
                        className="border-2 border-gray-300 bg-gray-200 rounded-full w-14 h-14 p-1 justify-center items-center overflow-hidden"
                    >
                            <Feather name="plus" size={20} color="#111" />
                    </View>
                    </TouchableOpacity>
                

                    <TouchableOpacity onPress={() => goToUploads()} 
                    key={1}
                    className="border-2 border-gray-200 rounded-full w-14 h-14 p-1 justify-center items-center overflow-hidden"
                    >
                    <Image className = "w-12 h-12 rounded-full border border-gray-400" source={{ uri: `${server_api_base_url}/profilepictures/gta (2).png` }} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => goToUploads()} 
                    key={2}
                    className="border-2 border-gray-200 rounded-full w-14 h-14 p-1 justify-center items-center overflow-hidden"
                    >
                    <Image className = "w-12 h-12 rounded-full border border-gray-400" source={{ uri: `${server_api_base_url}/profilepictures/image (1).png` }} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => goToUploads()} 
                    key={3}
                    className="border-2 border-gray-200 rounded-full w-14 h-14 p-1 justify-center items-center overflow-hidden"
                    >
                    <Image className = "w-12 h-12 rounded-full border border-gray-400" source={{ uri: `${server_api_base_url}/profilepictures/20241213_140818.jpg` }} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => goToUploads()} 
                    key={4}
                    className="border-2 border-gray-200 rounded-full w-14 h-14 p-1 justify-center items-center overflow-hidden"
                    >
                    <Image className = "w-12 h-12 rounded-full border border-gray-400" source={{ uri: `${server_api_base_url}/profilepictures/image (4).png` }} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => goToUploads()} 
                    key={5}
                    className="border-2 border-gray-200 rounded-full w-14 h-14 p-1 justify-center items-center overflow-hidden"
                    >
                    <Image className = "w-12 h-12 rounded-full border border-gray-400" source={{ uri: `${server_api_base_url}/profilepictures/image (5).png` }} />
                    </TouchableOpacity>



                    <View className="pl-2"></View>
                </ScrollView>

                    {loadingUsers ? (
                        <View>
                            <ActivityIndicator size="small" className="mt-20" color="" />
                            <View className =" flex flex-row justify-center first-letter text-blue-500 mb-2 mt-2">
                            <Text className =" text-md text-center font-bold text-blue-500">Loading messages...</Text>
                            </View>
                        </View>
                    ) : (
                        <View>
                        { users.length > 0 ? (
                            <View>
                                {users.map(([id,username, image, time, message, type, status,sender], index)=>{
                                    n += 2
                                    return(
                                        <ChatUser
                                            id={id}
                                            username={username}
                                            message={message}
                                            time={time}
                                            status={status}
                                            sender = {sender}
                                            image={image}
                                            key={0 + n}
                                        />
                                    
                                    )}
                                )}
                            </View>
                        ) : (
                            <View className=" mt-28 w-full bottom-10 p-4">
                            <View>
                                <ActivityIndicator size="small" className="mt-20" color="" />
                                <View className =" flex flex-row justify-center first-letter text-blue-500 mb-2 mt-2">
                                <Text className =" text-md text-center font-bold text-blue-500">Please wait...</Text>
                                </View>
                            </View>
                                
                            {/* <Animated.View entering={FadeInUp.duration(600).springify()}>
                                <LinearGradient
                                    colors={["#4FADF7", "#3B82F6", "#1D4ED8"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="rounded-2xl mx-4 mt-6 p-6 shadow-xl"
                                >
                                    <View className="items-center justify-center space-y-3">
                                    <Text className="text-white text-2xl font-bold text-center">
                                        No Conversations Yet
                                    </Text>
                                    <Text className="text-white text-center text-base px-2">
                                        Start matching or messaging people to see your conversations here!
                                    </Text>

                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.navigate("Swipe")
                                        }}
                                        className="mt-4 bg-white/20 px-6 py-2 rounded-full border border-white"
                                    >
                                        <Text className="text-white font-semibold">Find Matches</Text>
                                    </TouchableOpacity>
                                    </View>
                                </LinearGradient>
                            </Animated.View> */}
                               
                            </View>
                        )}
                        </View>
                    )}
                    

             
                    
                    


                    

                    
                    
                </ScrollView>



                {/* <Text className = " bg-blue-800">Hello there. Home screen Here!!</Text> */}
            </View>
            <BottomNav/>
        </View>
    )
}

export default HomeScreen;