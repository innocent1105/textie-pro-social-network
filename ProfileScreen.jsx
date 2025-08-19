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

const HomeScreen = ()=>{

    let navigation = useNavigation();
    const [isLoggedIn, setIsLoggedIn] = useState(null); 
    const [user_id , setUserId] = useState(null);

    let server_api_base_url = "http://192.168.141.234/textiepro/apis/";

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

    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");

    const [phoneNumber, setphoneNumber] = useState("");
    const [whatsapp, setwhatsapp] = useState("");
    const [password, setpassword] = useState("");
    const [pp, setPP] = useState('');
    const [dob, setDOB] = useState("");
    const [gender, setGender] = useState("");
    const [occupation, setOccupation] = useState("");

    const [city, setCity] = useState(``);

    const [fetchingData , setFetchData] = useState(true);
    const [myData, setMyData] = useState([]);
   
    const [refreshing, setRefreshing] = useState(false);


    const getUserData = async () => {
        try {
          const res = await axios.post(`${server_api_base_url}edit_profile.php`, {
            user_id: user_id,
            request_type: "getUserData",
          });
      
          const data = res.data[0]; // assuming res.data is an array with at least one item
          console.log(res.data);
      
          await AsyncStorage.setItem("user_data", JSON.stringify(data)); // ✅ Save only the data[0] object
      
          setMyData(data);
          setUsername(data[1]);
          setFullname(data[2]);
          setEmail(data[3]);
          setphoneNumber(data[4]);
          setPP(`${server_api_base_url}profilepictures/${data[5]}`);
          setFetchData(false);
        } catch (fetchError) {
          console.log("getUserData error:", fetchError);
        }
      };
      
      const fetchUserData = async () => {
        try {
          const value = await AsyncStorage.getItem("user_data");
      
          if (value !== null) {
            const data = JSON.parse(value); // ✅ properly parse the value
            setMyData(data);
            setUsername(data[1]);
            setFullname(data[2]);
            setEmail(data[3]);
            setphoneNumber(data[4]);
            setDOB(data[7]);
            setCity(data[8]);
            setPP(`${server_api_base_url}profilepictures/${data[5]}`);
            setFetchData(false);
      
            console.log("Fetched user from AsyncStorage");
          }
        } catch (fetchOfflineData) {
          console.log("AsyncStorage read error:", fetchOfflineData);
        }
      
        // Always try to refresh from server after loading local data
        await getUserData();
      };
      


    useEffect(() => {
        if (user_id !== null) {
            fetchUserData();
        }
    }, [user_id]);

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
        fetchUserData();
        await getUserData();
        setRefreshing(false);
    };

    const [loadingPosts, setLoadingPosts] = useState(false);
    const [matches, setMatches] = useState([]);

    const [loadingSwipes, setLoadingSwipes] = useState(false);
    const [Swipes, setSwipes] = useState([]);

    const getSwipes = async () => {
        const res = await axios.post(`${server_api_base_url}matches.php`, {
            user_id : user_id,
        });
        
        setSwipes(res.data.flat());
        // console.log(res.data);
    }

    getSwipes();

    const editMyProfile = () =>{
        navigation.navigate("EditProfile");
        console.log("edit profile")
    }

    const OpenMatchProfile = (swipeIndex) =>{
        const id = Swipes[swipeIndex].user_id;
        const name = Swipes[swipeIndex].username;
        const image = Swipes[swipeIndex].pp;

        navigation.navigate("LikedUser", { User : {
            user_id : user_id,
            id : id,
            name: name,
            image: image
        }})

        console.log(user_id)
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
                    className = " bg-white mt-24 mb-12">

                    <ImageBackground
                        className =" p-4 pb-2"
                        source={require('../assets/images/chatbg3.jpg')}
                        resizeMode="cover"
                        style={{ flex: 1 }}
                    >
                        <View className =" p-2 flex flex-row justify-center">
                           <View className =" flex flex-row justify-center p-1 border-4 border-gray-100 rounded-full ">
                                <Image
                                    source={{ uri: `${pp}` }}
                                    className="w-28 h-28 object-cover rounded-full"
                                />
                           </View>
                        </View>
                        <View className =" mb-4">
                            <Text className =" font-bold text-lg text-center text-blue-950">{username}</Text>
                            <Text className =" font-bold text-sm text-center text-blue-950">{dob} years - Lives in Lusaka</Text>
                        </View>
                        <View className =" flex flex-row justify-center gap-8 p-2 ">
                            <TouchableOpacity className=" p-2" onPress={()=> {}}>
                                <Text className =" font-bold text-blue-950">My Stories</Text>
                            </TouchableOpacity> 

                            <TouchableOpacity className =" border border-gray-200 p-2 px-10 bg-white rounded-md" onPress={()=> editMyProfile()}>
                                <Text className =" font-bold text-blue-950">Edit Profile</Text>
                            </TouchableOpacity>

                        </View>
                    </ImageBackground>

                    <View className="">
                        {Swipes.length > 0 ? (
                            <View>
                                <Text className =" font-bold p-4 text-gray-400">Matched profiles</Text>
                                <View>
                                    {Swipes.map((swipe, swipeIndex) => {
                                        return (
                                            <View key={swipeIndex} className=" ">
                                                <TouchableOpacity  onPress={()=>OpenMatchProfile(swipeIndex)} className=" p-2 flex flex-row justify-between gap-2">
                                                    <View className=" flex flex-row justify-between gap-2">
                                                        <View className =" border-2 border-gray-200 rounded-full">
                                                            <Image
                                                                source={{ uri: `${server_api_base_url}profilepictures/${swipe.pp}` }}
                                                                className="w-12 h-12 object-cover rounded-full"
                                                            />
                                                        </View>
                                                        <View className =" pt-2">
                                                            <Text className =" text-sm font-medium text-gray-700">{swipe.username}</Text>
                                                            <Text className =" text-xs font-medium text-gray-500"> {swipe.years} years - Lives in {swipe.city}</Text>
                                                        </View>
                                                    </View>

                                                </TouchableOpacity> 
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        ) : (
                            <View className=" flex flex-row justify-between">
                                <Text className =" font-bold p-4 text-gray-400">
                                    No Matched profiles 
                                </Text>
                                <Text onPress={()=>{}} className =" font-bold p-4 text-gray-500">
                                    Open Swipes 
                                </Text>
                            </View>
                        )}
                        


                    </View>
                </ScrollView> 
            </View>
        </View>
    )
}

export default HomeScreen;