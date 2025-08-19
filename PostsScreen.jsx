import React, { useEffect, useState} from "react";
import { View, Text, Button, Pressable,FlatList, Image, ImageBackground, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PostBottomNav from "./components/PostsBottomNav";
import ChatUser from "./components/ChatUser";
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import UploadPostScreen from "./Upload";
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RefreshControl } from 'react-native';
import { BlurView } from 'expo-blur';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


const PostsScreen = ()=>{
    let navigation = useNavigation();
    const [isLoggedIn, setIsLoggedIn] = useState(null); 
    const [user_id , setUserId] = useState(null);

    const [refreshing, setRefreshing] = useState(false);
  
    
    let server_api_base_url = "http://192.168.226.234/textiepro/apis/";
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


      const goToUploads = ()=>{
        navigation.navigate('UploadPost');
        console.log("Uploads")
      }

      const OpenPost = (postData)=>{
        navigation.navigate('OpenPost', { Post : postData});
      }
      // fetch data

      const [users, setUsers] = useState([]);
      let getUserUrl = "chat_user.php";
      getUserUrl = server_api_base_url + getUserUrl;


      const [posts, setPosts] = useState([]);

      let getPostsUrl = "posts.php";
      getPostsUrl = server_api_base_url + getPostsUrl;

      // console.log(posts)
      let posts_id = 1;
      const [stories, setStories] = useState([]);
      const [likedPosts, setLikedPosts] = useState({});


      const getPosts = async () => {
        try {
          const res = await axios.post(getPostsUrl, { user_id });


          const uniqueItems = res.data.filter(
            (newItem) => !posts.some(existing => existing.id === newItem.id)
          );


          setPosts(res.data);
          setStories(stories => [...stories, ...uniqueItems]);
         

        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };
      
      
      useEffect(() => {
        if (user_id) {
          getPosts();
        }
      }, [user_id])
      
      // const fetchPosts = async ()=>{
      //   const value = await AsyncStorage.getItem(`posts`);
      //   console.log("posts", value);
      //   if(value !== null){
      //     setPosts(JSON.parse(value));
      //     await getPosts();
      //   }else{
      //     await getPosts();
      //   }
      // }

      // fetchPosts();
    

      const [like, setLike] = useState(false);

   
      const onRefresh = async () => {
        setRefreshing(true);
        await getPosts();
        setRefreshing(false);
      };
  
      const toggleLike = (postId) => {
        setLikedPosts(prev => ({
          ...prev,
          [postId]: !prev[postId]
        }));
      };

      const OpenMatchProfile = (post) =>{
        const id = post.user_id;
        const name = post.username;
        const image = post.pp;

        navigation.navigate("LikedUser", { User : {
            user_id : user_id,
            id : id,
            name: name,
            image: image
        }})

        console.log(user_id)
      } 
      
     
    return (
       <View className =" flex-1 bg-white">
        <View>
          
        <View className="absolute top-0 left-0 right-0 z-10">
          <BlurView
            intensity={95}
            tint="light"
            className="w-full flex-row justify-between items-center px-4 pt-12 pb-4"
          >
            {/* Gradient "Posts" Title */}
            <MaskedView
              maskElement={
                <Text className="text-2xl font-bold text-black">Discover</Text>
              }
            >
              <LinearGradient
                colors={['#1C39BB', '#1877F2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="h-8"
              >
                <Text className="text-2xl font-bold opacity-0">Discover</Text>
              </LinearGradient>
            </MaskedView>

            {/* Buttons */}
            <View className="flex-row space-x-2">
              <TouchableOpacity onPress={goToUploads} className="p-2 rounded-sm">
                <Feather name="plus" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Settings')} className="p-2 rounded-sm">
                <Feather name="settings" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
            

          <View className=" mt-0 pb-0">
          { posts.length < 1 ? (
            <ScrollView className="  h-screen pt-24">

              <View className=" p-4">
                <View className=" flex flex-row gap-1">
                  <View className=" h-11 w-11 rounded-full bg-gray-200"></View>
                  <View className=" pt-2">
                    <View className=" h-4 w-48 rounded bg-gray-200"></View>
                    <View className=" h-3 w-36 rounded mt-1 bg-gray-200"></View>
                  </View>
                </View>

                <View className=" p-2 py-44 mt-2 bg-gray-200 rounded-md"></View>
              
              </View>
              <View className=" p-4">
                <View className=" flex flex-row gap-1">
                  <View className=" h-11 w-11 rounded-full bg-gray-200"></View>
                  <View className=" pt-2">
                    <View className=" h-4 w-48 rounded bg-gray-200"></View>
                    <View className=" h-3 w-36 rounded mt-1 bg-gray-200"></View>
                  </View>
                </View>

                <View className=" p-2 py-44 mt-2 bg-gray-200 rounded-md"></View>
              
              </View>
              <View className=" p-4">
                <View className=" flex flex-row gap-1">
                  <View className=" h-11 w-11 rounded-full bg-gray-200"></View>
                  <View className=" pt-2">
                    <View className=" h-4 w-48 rounded bg-gray-200"></View>
                    <View className=" h-3 w-36 rounded mt-1 bg-gray-200"></View>
                  </View>
                </View>

                <View className=" p-2 py-44 mt-2 bg-gray-200 rounded-md"></View>
              
              </View>
              </ScrollView>
          ) : (
          <View>
          
          <FlatList
            className=" "
            data={[{ type: 'header' }, ...[...posts].toReversed()]}
            keyExtractor={(item, index) => `header-${index + posts_id}`}
            contentContainerStyle={{ padding: 2 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              if (item.type === 'header') {
                posts_id++;
                return (
               <View className=" mt-24" onPress={() => OpenPost(item)}>
                   <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="py-2 flex-row gap-2"
                  >
                    
                    <TouchableOpacity onPress={goToUploads} className="pl-4">
                      <View className="border-2 border-gray-300 bg-gray-200 rounded-full w-14 h-14 p-1 justify-center items-center overflow-hidden">
                        <Feather name="plus" size={20} color="#111" />
                      </View>
                    </TouchableOpacity>

                    {stories.map((filename, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() =>OpenMatchProfile(filename)}
                        className="border-2 border-gray-200 rounded-full w-14 h-14 p-1 justify-center items-center overflow-hidden"
                      >
                        <Image
                          className="w-12 h-12 rounded-full border border-gray-400"
                          source={{
                            uri: `${server_api_base_url}/profilepictures/${filename.pp}`,
                          }}
                        />
                      </TouchableOpacity>
                    ))}

                    <View className="pl-2" />
                    
                  </ScrollView>
               </View>
                );
              }

              // timeline posts
              const images = typeof item.images === 'string' ? JSON.parse(item.images) : [];
              const firstImage = images.length > 0 ? images[0].replace(/\\/g, '') : null;
              let datetime = item.date;
              const date = new Date(datetime);

              if (isNaN(date.getTime())) return "Invalid date";

              const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              };

              datetime = date.toLocaleString('en-US', options);

              return (
                <View className="border border-gray-100 rounded-2xl m-1 p-2">
                  <View className="flex flex-row justify-between">
                    <TouchableOpacity onPress={() => OpenPost(item)} className="flex gap-2 flex-row w-3/5">
                      <View>
                        <Image
                          className="w-10 h-10 rounded-full"
                          source={{ uri: `${server_api_base_url}profilepictures/${item.pp}` }}
                        />
                      </View>
                      <View className="w-full h-11 overflow-hidden">
                        <Text className="pt-1 text-md font-bold text-gray-700">{item.username}</Text>
                        <Text className="text-xs w-3/4 overflow-auto text-gray-400">{datetime}</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => OpenPost(item)} className="p-2 rounded-sm flex justify-center ml-2">
                      <Entypo name="dots-three-vertical" size={14} color="#ccc" />
                    </TouchableOpacity>
                  </View>

                  <View className="mt-2">
                    {item.text && (
                      <TouchableOpacity onPress={() => OpenPost(item)}>
                        <Text className="pl-2 pb-2">{item.text}</Text>
                      </TouchableOpacity>
                    )}
                    {images.length > 0 ? (
                      <ImageBackground
                        source={{ uri: `${server_api_base_url}uploads/${firstImage}` }}
                        resizeMode="cover"
                        className="w-full h-96 rounded-xl overflow-hidden"
                        
                      >
                        <View className="flex flex-col justify-between h-full">
                          <View className="flex flex-row rounded-full overflow-hidden justify-end">
                         
                          </View>

                          <BlurView
                                intensity={50}
                                tint="light" className="flex-row items-center justify-between px-3 py-2">
                            <TouchableOpacity onPress={() => toggleLike(item.id)} className="flex-row rounded-full overflow-hidden items-center space-x-1 ">
                              <BlurView
                                intensity={90}
                                tint="light"
                                className="flex-row space-x-4 rounded-full px-8 py-2"
                              >
                                
                                <MaskedView
                                  maskElement={
                                    <View className="items-center justify-center">
                                      <FontAwesome
                                        name="heart"
                                        size={24}
                                        color={likedPosts[item.id] ? "#E91E63" : "black"} // pink if liked, black otherwise
                                      />

                                      {/* <Feather name="heart" size={24} color="black" /> */}
                              
                                    </View>
                                  }
                                >
                                  <LinearGradient
                                    colors={likedPosts[item.id] ? ['#bbb', '#1F75FE', '#ccc'] : ['#ccc', '#222', '#ccc']}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 0 }}
                                    className="w-6 h-6"
                                  />

                                </MaskedView>

                              </BlurView>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => OpenPost(item)} className="flex-row rounded-full overflow-hidden items-center space-x-1 ">
                              <BlurView
                                intensity={90}
                                tint="light"
                                className="flex-row space-x-4 rounded-full px-8 py-2"
                              >
                                
                                <MaskedView
                                  maskElement={
                                    <View className="items-center justify-center">
                                      {/* <FontAwesome name="heart" size={24} color="black" /> */}
                                      <FontAwesome6 name="rectangle-list" size={24} color="black" />
                                    </View>
                                  }
                                >
                                  <LinearGradient
                                    colors={['#ccc', '#000','#ccc']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    className="w-6 h-6"
                                  />
                                </MaskedView>

                              </BlurView>
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-row rounded-full overflow-hidden items-center space-x-1 ">
                              <BlurView
                                intensity={90}
                                tint="light"
                                className="flex-row space-x-4 rounded-full px-8 py-2"
                              >
                                
                                <MaskedView
                                  maskElement={
                                    <View className="items-center justify-center">
                                     <Feather name="share" size={24} color="black" />
                                    </View>
                                  }
                                >
                                  <LinearGradient
                                    colors={['#ccc', '#000','#ccc']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    className="w-6 h-6"
                                  />
                                </MaskedView>

                              </BlurView>
                            </TouchableOpacity>

                          </BlurView>
                        </View>
                      </ImageBackground>
                    ) : (
                     <View>
                     <View className="flex flex-col justify-between">
                          <View className="flex flex-row rounded-full overflow-hidden justify-end">
                         
                          </View>

                          <BlurView
                                intensity={50}
                                tint="light" className="flex-row items-center justify-between px-3 py-2">
                            <TouchableOpacity onPress={() => toggleLike(item.id)} className="flex-row rounded-full overflow-hidden items-center space-x-1 ">
                              <BlurView
                                intensity={90}
                                tint="light"
                                className="flex-row space-x-4 rounded-full px-8 py-2"
                              >
                                
                                <MaskedView
                                  maskElement={
                                    <View className="items-center justify-center">
                                      <FontAwesome
                                        name="heart"
                                        size={24}
                                        color={likedPosts[item.id] ? "#E91E63" : "black"} // pink if liked, black otherwise
                                      />

                                      {/* <Feather name="heart" size={24} color="black" /> */}
                              
                                    </View>
                                  }
                                >
                                  <LinearGradient
                                    colors={likedPosts[item.id] ? ['#bbb', '#1F75FE', '#ccc'] : ['#ccc', '#222', '#ccc']}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 0 }}
                                    className="w-6 h-6"
                                  />

                                </MaskedView>

                              </BlurView>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => OpenPost(item)} className="flex-row rounded-full overflow-hidden items-center space-x-1 ">
                              <BlurView
                                intensity={90}
                                tint="light"
                                className="flex-row space-x-4 rounded-full px-8 py-2"
                              >
                                
                                <MaskedView
                                  maskElement={
                                    <View className="items-center justify-center">
                                      {/* <FontAwesome name="heart" size={24} color="black" /> */}
                                      <FontAwesome6 name="rectangle-list" size={24} color="black" />
                                    </View>
                                  }
                                >
                                  <LinearGradient
                                    colors={['#ccc', '#000','#ccc']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    className="w-6 h-6"
                                  />
                                </MaskedView>

                              </BlurView>
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-row rounded-full overflow-hidden items-center space-x-1 ">
                              <BlurView
                                intensity={90}
                                tint="light"
                                className="flex-row space-x-4 rounded-full px-8 py-2"
                              >
                                
                                <MaskedView
                                  maskElement={
                                    <View className="items-center justify-center">
                                     <Feather name="share" size={24} color="black" />
                                    </View>
                                  }
                                >
                                  <LinearGradient
                                    colors={['#ccc', '#000','#ccc']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    className="w-6 h-6"
                                  />
                                </MaskedView>

                              </BlurView>
                            </TouchableOpacity>

                          </BlurView>
                        </View>
                     </View>
                     )}


                  </View>

                

                </View>
              );
            }}
          />
          <View className=" border mb-44"></View>

        </View>
          )}
          



          </View>
        </View>
    

          
        
          <PostBottomNav/>
       </View>
    )
}



export default PostsScreen;









const styles = StyleSheet.create({
  post_image: {
    height : "100%"
  },
  post_stat_heart : {
    color : "#4169E1"
  },
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurContainer: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
});