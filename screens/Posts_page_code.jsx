import React, { useEffect, useState} from "react";
import { View, Text, Button, Pressable, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PostBottomNav from "./components/PostsBottomNav";
import ChatUser from "./components/ChatUser";
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';


const PostsScreen = ()=>{
    let navigation = useNavigation();
    const [isLoggedIn, setIsLoggedIn] = useState(null); 
    const [user_id , setUserId] = useState(null);

    let server_api_base_url = "http://192.168.122.234/textiepro/apis/";
    let uri = server_api_base_url + "profile_pictures/default-pp.png";
    const getToken = async () => {
        try {
            const token = await SecureStore.getItemAsync('user_session');
            console.log('Loaded token:', token);
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
            setUserId(token)
            // return token;
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
        if (isLoggedIn === false) {
          navigation.navigate('Login');
        }
      }, [isLoggedIn]);

      // fetch data

      const [users, setUsers] = useState([]);
      let getUserUrl = "chat_user.php";
      getUserUrl = server_api_base_url + getUserUrl;
      console.log("Base url : ", getUserUrl);

      const getChatUsers = async ()=>{
        const res = await axios.post(getUserUrl, {
            user_id: user_id
        });

        // console.log(res.data);
        setUsers(res.data);
      }

      getChatUsers();


        // let users = [
        //     ["752900", "Inno", "default-pp.png"],
        //     ["750100", "victor", "default-pp.png"],
        //     ["168300", "victor", "default-pp.png"],
        // ];
    


    return (
       <View className =" flex-1 bg-white">
        <View>
          <View className=" absolute bg-white w-full right-0 flex flex-row justify-between gap-2 mt-8 p-4">
              <View className ="w-1/2">
                  <Text className =" text-2xl font-bold">Textie pro</Text>
              </View>
              <View className ="  w-1/2 flex flex-row pr-5 justify-end">
                <View className =" p-2 rounded-sm flex justify-center">
                  <Feather name="plus" size={20} color="black" />
                </View>
                <View className =" p-2 rounded-sm flex justify-center ml-2">
                  <Feather name="search" size={20} color="black" />
                </View>
              </View>
          
          </View>
        

          <View className=" mt-24 ">
              <ScrollView 
                className = " mt-2 bg-white"
                showsVerticalScrollIndicator={false}
              >
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className=" py-2 flex-row gap-2" 
                >
                <View className=" pl-4">
                  <View
                    key={10}
                    className="border-2 border-gray-300 bg-gray-200 rounded-full w-14 h-14 p-1 justify-center items-center overflow-hidden"
                  >
                        <Feather name="plus" size={20} color="#111" />
                  </View>
                </View>
              

                <View
                  key={0}
                  className="border-2 border-gray-200 rounded-full w-14 h-14 p-1 justify-center items-center overflow-hidden"
                >
                  <Image className = "w-12 h-12 rounded-full border border-gray-400" source={{ uri: `http://192.168.122.234/textiepro/apis/profilepictures/image (5).png` }} />
                </View>

                <View
                  key={1}
                  className="border-2 border-gray-200 rounded-full w-14 h-14 p-1 justify-center items-center overflow-hidden"
                >
                  <Image className = "w-12 h-12 rounded-full border border-gray-400" source={{ uri: `http://192.168.122.234/textiepro/apis/profilepictures/image (1).png` }} />
                </View>

                <View
                  key={2}
                  className="border-2 border-gray-200 rounded-full w-14 h-14 p-1 justify-center items-center overflow-hidden"
                >
                  <Image className = "w-12 h-12 rounded-full border border-gray-400" source={{ uri: `http://192.168.122.234/textiepro/apis/profilepictures/image (4).png` }} />
                </View>

                <View
                  key={3}
                  className="border-2 border-gray-200 rounded-full w-14 h-14 p-1 justify-center items-center overflow-hidden"
                >
                  <Image className = "w-12 h-12 rounded-full border border-gray-400" source={{ uri: `http://192.168.122.234/textiepro/apis/profilepictures/gta (2).png` }} />
                </View>

                <View
                  key={4}
                  className="border-2 border-gray-200 rounded-full w-14 h-14 p-1 justify-center items-center overflow-hidden"
                >
                  <Image className = "w-12 h-12 rounded-full border border-gray-400" source={{ uri: `http://192.168.122.234/textiepro/apis/profilepictures/default-pp.png` }} />
                </View>
                <View
                  key={5}
                  className="border-2 border-gray-200 rounded-full w-14 h-14 p-1 justify-center items-center overflow-hidden"
                >
                  <Image className = "w-12 h-12 rounded-full border border-gray-400" source={{ uri: `http://192.168.122.234/textiepro/apis/profilepictures/default-pp.png` }} />
                </View>

                <View
                  key={6}
                  className="border-2 border-gray-200 rounded-full w-14 h-14 p-1 justify-center items-center overflow-hidden"
                >
                  <Image className = "w-12 h-12 rounded-full border border-gray-400" source={{ uri: `http://192.168.122.234/textiepro/apis/profilepictures/default-pp.png` }} />
                </View>

                <View
                  key={7}
                  className="border-2 border-gray-200 rounded-full w-14 h-14 p-1 justify-center items-center overflow-hidden"
                >
                  <Image className = "w-12 h-12 rounded-full border border-gray-400" source={{ uri: `http://192.168.122.234/textiepro/apis/profilepictures/default-pp.png` }} />
                </View>

                <View className="pl-2"></View>
                </ScrollView>

                {/*  Posts */}

                <View className=" border border-gray-100 rounded-2xl m-2 p-2">
                  <View className =" flex flex-row justify-between">
                    <View className = " flex gap-2 flex-row w-3/5 ">
                        <View>
                            <Image className = " w-10 h-10 rounded-full " source={{ uri: `http://192.168.122.234/textiepro/apis/profilepictures/default-pp.png` }} />
                        </View>
                        <View className =" w-full h-11 overflow-hidden">
                            <Text className = " pt-1 text-md font-bold text-gray-700">Victor M.</Text>
                            <Text className = " text-xs w-3/4 overflow-auto text-gray-400">27th may, 2024</Text>
                        </View>
                    </View>
                    <View className =" p-2 rounded-sm flex justify-center ml-2">
                      <Entypo name="dots-three-vertical" size={14} color="#ccc" />
                    </View>
                  </View>
                  

                  <View className =" mt-2">
                    <Text className =" px-1 pb-1 text-gray-500">
                      Has anyone tried to upload videos? I was request for such a feature i think they need to look into it. 
                    </Text>
                
                  </View>

                  <View className =" flex flex-row justify-between ">
                    <View className ="mt-4 pt-4 px-2 flex flex-row justify-start gap-7">
                      <View className =" rounded-full flex flex-row justify-center ml-2">
                        <MaterialCommunityIcons name="heart-outline" size={24} color="#4169E1" />
                        <Text style ={ styles.post_stat_heart } className =" text-sm font-bold p-1 text-skyblue-700">1.4k</Text>
                      </View>
                      <View className =" rounded-full flex flex-row justify-center ml-2">
                        <MaterialCommunityIcons name="comment-processing-outline" size={24} color="#0039a6" />
                        <Text className =" text-sm font-bold p-1 text-indigo-700">276</Text>
                      </View>
                      <View className =" rounded-full flex flex-row justify-center ml-2">
                        <AntDesign name="retweet" size={22} color="#72A0C1" />
                      </View>
                    </View>

                    <View className =" mt-4 pt-4 px-2 flex flex-row justify-start gap-7">
                   
                      <View className =" rounded-full flex flex-row justify-center ml-2">
                        <Entypo name="link" size={20} color="#72A0C1" />
                      </View>
                    </View>
                  </View>
                  
                  
                </View>



                <View className=" border border-gray-100 rounded-2xl m-2 p-2">
                  <View className =" flex flex-row justify-between">
                    <View className = " flex gap-2 flex-row w-3/5 ">
                        <View>
                            <Image className = " w-10 h-10 rounded-full " source={{ uri: `http://192.168.122.234/textiepro/apis/profilepictures/20241213_140818.jpg` }} />
                        </View>
                        <View className =" w-full h-11 overflow-hidden">
                            <Text className = " pt-1 text-md font-bold text-gray-700">Innocent Mugwadi</Text>
                            <Text className = " text-xs w-3/4 overflow-auto text-gray-400">23 may, 2024</Text>
                        </View>
                    </View>
                    <View className =" p-2 rounded-sm flex justify-center ml-2">
                      <Entypo name="dots-three-vertical" size={14} color="#ccc" />
                    </View>
                  </View>
                  

                  <View className =" mt-2">
                    <Text className =" pl-2 pb-2">Hello there </Text>
                    <View className =" h-96 ">
                      <Image style = { styles.post_image } className = " w-full object-cover rounded-xl " source={{ uri: `http://192.168.122.234/textiepro/apis/profilepictures/20241213_140818.jpg` }} />
                    </View>
                  </View>


                  <View className =" flex flex-row justify-between ">
                    <View className ="mt-4 pt-4 px-2 flex flex-row justify-start gap-7">
                      <View className =" rounded-full flex flex-row justify-center ml-2">
                        <MaterialCommunityIcons name="heart-outline" size={24} color="#4169E1" />
                        <Text style ={ styles.post_stat_heart } className =" text-sm font-bold p-1 text-skyblue-700">1.4k</Text>
                      </View>
                      <View className =" rounded-full flex flex-row justify-center ml-2">
                        <MaterialCommunityIcons name="comment-processing-outline" size={24} color="#0039a6" />
                        <Text className =" text-sm font-bold p-1 text-indigo-700">276</Text>
                      </View>
                      <View className =" rounded-full flex flex-row justify-center ml-2">
                        <AntDesign name="retweet" size={22} color="#72A0C1" />
                      </View>
                    </View>

                    <View className =" mt-4 pt-4 px-2 flex flex-row justify-start gap-7">
                   
                      <View className =" rounded-full flex flex-row justify-center ml-2">
                        <Entypo name="link" size={20} color="#72A0C1" />
                      </View>
                    </View>
                  </View>
                </View>



                <View className=" border border-gray-100 rounded-2xl m-2 p-2">
                  <View className =" flex flex-row justify-between">
                    <View className = " flex gap-2 flex-row w-3/5 ">
                        <View>
                            <Image className = " w-10 h-10 rounded-full " source={{ uri: `http://192.168.122.234/textiepro/apis/profilepictures/gta (1).png` }} />
                        </View>
                        <View className =" w-full h-11 overflow-hidden">
                            <Text className = " pt-1 text-md font-bold text-gray-700">Jack</Text>
                            <Text className = " text-xs w-3/4 overflow-auto text-gray-400">23 may, 2024</Text>
                        </View>
                    </View>
                    <View className =" p-2 rounded-sm flex justify-center ml-2">
                      <Entypo name="dots-three-vertical" size={14} color="#ccc" />
                    </View>
                  </View>
                  

                  <View className =" mt-2">
                    <Text className =" pl-2 pb-2">Hello there ! </Text>
                    <View className =" h-96 ">
                      <Image style = { styles.post_image } className = " w-full object-cover rounded-xl " source={{ uri: `http://192.168.122.234/textiepro/apis/profilepictures/gta (1).png` }} />
                    </View>
                  </View>

                  <View className =" flex flex-row justify-between ">
                    <View className ="mt-4 pt-4 px-2 flex flex-row justify-start gap-7">
                      <View className =" rounded-full flex flex-row justify-center ml-2">
                        <MaterialCommunityIcons name="heart-outline" size={24} color="#4169E1" />
                        <Text style ={ styles.post_stat_heart } className =" text-sm font-bold p-1 text-skyblue-700">46</Text>
                      </View>
                      <View className =" rounded-full flex flex-row justify-center ml-2">
                        <MaterialCommunityIcons name="comment-processing-outline" size={24} color="#0039a6" />
                        <Text className =" text-sm font-bold p-1 text-indigo-700">13</Text>
                      </View>
                      <View className =" rounded-full flex flex-row justify-center ml-2">
                        <AntDesign name="retweet" size={22} color="#72A0C1" />
                      </View>
                    </View>

                    <View className =" mt-4 pt-4 px-2 flex flex-row justify-start gap-7">
                   
                      <View className =" rounded-full flex flex-row justify-center ml-2">
                        <Entypo name="link" size={20} color="#72A0C1" />
                      </View>
                    </View>
                  </View>
                </View>

                <View className =" mt-36"></View>
              </ScrollView>
          </View>
        </View>
    

          
        
          <PostBottomNav/>
       </View>
    )
}

const styles = StyleSheet.create({
  post_image: {
    height : "100%"
  },
  post_stat_heart : {
    color : "#4169E1"
  },
});

export default PostsScreen;









