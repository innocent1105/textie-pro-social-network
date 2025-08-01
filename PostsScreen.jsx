import React, { useEffect, useState} from "react";
import { View, Text, Button, Pressable,FlatList, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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

const PostsScreen = ()=>{
    let navigation = useNavigation();
    const [isLoggedIn, setIsLoggedIn] = useState(null); 
    const [user_id , setUserId] = useState(null);

    let server_api_base_url = "http://192.168.141.234/textiepro/apis/";
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
      const getPosts = async () => {
        try {
          const res = await axios.get(getPostsUrl, {
            params: { user_id: user_id } 
          });
          setPosts(res.data); 
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };
      

      getPosts();

      const [like, setLike] = useState(false);

      const likePost = async (postId) => {
        try {
          const res = await axios.post(server_api_base_url + "like.php", {
            user_id: user_id,
            post: postId,
          });
      
          const isLiked = res.data === "liked";
      
          setPosts((prevPosts) =>
            prevPosts.map((post) => {
              if (post.id === postId.toString()) {
                let currentLikes = parseInt(post.likes || 0);
      
                return {
                  ...post,
                  likes: isLiked ? currentLikes + 1 : currentLikes - 1,
                  likedByUser: isLiked,
                };
              }
              return post;
            })
          );
        } catch (error) {
          console.error("Failed to like post:", error);
        }
      };
      

    return (
       <View className =" flex-1 bg-white">
        <View>
          
          <View className=" absolute bg-white">
            <View className=" w-full right-0 flex flex-row justify-between gap-2 mt-8 p-4">
                <View className ="w-1/2">
                  <MaskedView
                      maskElement={
                          <View className="bg-transparent">
                          <Text className="text-2xl font-bold text-black">Posts</Text>
                          </View>
                      }
                      >
                      <LinearGradient
                          colors={['#1C39BB', '#1877F2']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          className="h-8"
                      >
                          <Text className="text-2xl font-bold opacity-0">Posts</Text>
                      </LinearGradient>
                  </MaskedView>

                </View>
                <View className ="  w-1/2 flex flex-row pr-5 justify-end">
                  <TouchableOpacity onPress={() => goToUploads()} className =" p-2 rounded-sm flex justify-center">
                    <Feather name="plus" size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {navigation.navigate("Settings")}} className =" p-2 rounded-sm flex justify-center ml-2">
                    <Feather name="settings" size={20} color="black" />
                  </TouchableOpacity>
                </View>
            </View>

            
          
          </View>
        

          <View className=" mt-24 pb-32">
          <FlatList
            data={[{ type: 'header' }, ...[...posts].reverse()]}
            keyExtractor={(item, index) => item.id?.toString() || `header-${index}`}
            contentContainerStyle={{ padding: 2 }}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              if (item.type === 'header') {
                return (
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

                    {[
                      "gta (2).png",
                      "image (1).png",
                      "20241213_140818.jpg",
                      "gta (1).png",
                      "image (4).png",
                      "image (5).png",
                    ].map((filename, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={goToUploads}
                        className="border-2 border-gray-200 rounded-full w-14 h-14 p-1 justify-center items-center overflow-hidden"
                      >
                        <Image
                          className="w-12 h-12 rounded-full border border-gray-400"
                          source={{
                            uri: `${server_api_base_url}/profilepictures/${filename}`,
                          }}
                        />
                      </TouchableOpacity>
                    ))}

                    <View className="pl-2" />
                  </ScrollView>
                );
              }

              // timeline posts
              const images = typeof item.images === 'string' ? JSON.parse(item.images) : [];
              const firstImage = images.length > 0 ? images[0].replace(/\\/g, '') : null;
             

              return (
                <View className="border border-gray-100 rounded-2xl m-1 p-2">
                  <View className="flex flex-row justify-between">
                    <TouchableOpacity onPress={OpenPost} className="flex gap-2 flex-row w-3/5">
                      <View>
                        <Image
                          className="w-10 h-10 rounded-full"
                          source={{ uri: `${server_api_base_url}profilepictures/${item.pp}` }}
                        />
                      </View>
                      <View className="w-full h-11 overflow-hidden">
                        <Text className="pt-1 text-md font-bold text-gray-700">{item.username}</Text>
                        <Text className="text-xs w-3/4 overflow-auto text-gray-400">{item.date}</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={OpenPost} className="p-2 rounded-sm flex justify-center ml-2">
                      <Entypo name="dots-three-vertical" size={14} color="#ccc" />
                    </TouchableOpacity>
                  </View>

                  <View className="mt-2">
                    {item.text && (
                      <TouchableOpacity onPress={() => {}}>
                        <Text className="pl-2 pb-2">{item.text}</Text>
                      </TouchableOpacity>
                    )}
                    {images.length > 0 && (
                      <TouchableOpacity onPress={() => OpenPost(item)} className="h-96">
                        <Image
                          source={{ uri: `${server_api_base_url}uploads/${firstImage}` }}
                          style={styles.post_image}
                          className="w-full object-cover rounded-xl"
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View className="flex flex-row justify-between">
                    <View className="mt-4 pt-4 px-2 flex flex-row justify-start gap-7">

                      { like ? (
                        <TouchableOpacity onPress={()=>likePost(index)} className="rounded-full flex flex-row justify-center ml-2">
                          <MaterialCommunityIcons name="heart" size={24} color="#4169E1" />
                          <Text className="text-sm font-bold p-1 text-skyblue-700">{item.likes || "0"}</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity onPress={()=>likePost(item.id)} className="rounded-full flex flex-row justify-center ml-2">
                          <MaterialCommunityIcons name="heart-outline" size={24} color="#4169E1" />
                          <Text className="text-sm font-bold p-1 text-skyblue-700">{item.likes || "0"}</Text>
                        </TouchableOpacity>
                      )}
                      

                      <TouchableOpacity onPress={goToUploads} className="rounded-full flex flex-row justify-center ml-2">
                        <MaterialCommunityIcons name="comment-processing-outline" size={24} color="#0039a6" />
                        <Text className="text-sm font-bold p-1 text-indigo-700">{item.comments || "0"}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={goToUploads} className="rounded-full flex flex-row justify-center ml-2">
                        <AntDesign name="retweet" size={22} color="#72A0C1" />
                      </TouchableOpacity>
                    </View>

                    <View className="mt-4 pt-4 px-2 flex flex-row justify-start gap-7">
                      <View className="rounded-full flex flex-row justify-center ml-2">
                        <Entypo name="link" size={20} color="#72A0C1" />
                      </View>
                    </View>
                  </View>
                </View>
              );
            }}
          />

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









