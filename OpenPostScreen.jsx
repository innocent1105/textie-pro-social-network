import React, { useEffect, useState} from "react";
import { View, Text, Button, Pressable,TextInput, Image, StyleSheet,   ActivityIndicator ,
  Keyboard,TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PostBottomNav from "./components/PostsBottomNav";
import ChatUser from "./components/ChatUser";
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import UploadPostScreen from "./Upload";
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';


const OpenPostScreen = ({ route })=>{
    let navigation = useNavigation();
    const [isLoggedIn, setIsLoggedIn] = useState(null); 
    const [user_id , setUserId] = useState(null);

    const { Post } = route.params;
    const postId = Post.id;
    const postUserId = Post.user_id;
    const PostUsername = Post.username;
    const postText = Post.text;
    const postImages = Post.images;
    const [postLikes, setPostLikes] = useState(parseInt(Post.likes) || 0);
    const postComments = Post.comments || 0;
    const postShares = Post.shares || 0;
    const postDate = Post.date;


    const images = typeof Post.images === 'string' ? JSON.parse(Post.images) : [];
    const firstImage = images.length > 0 ? images[0].replace(/\\/g, '') : null;



    let server_api_base_url = "http://192.168.13.234/textiepro/apis/";
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
            setUserId(parseInt(token.replace(/\D/g, ""), 10))
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

    const [like, setLike] = useState(false);

    const likePost = async (postId)=>{
        // if(like){
        //   setLike(false);
        // }else{
        //   setLike(true);
        // }

        const res = await axios.post(server_api_base_url + "like.php", {
            user_id : user_id,
            post : postId
        })


        if(res.data == "liked"){
          setLike(true);
          setPostLikes(postLikes + 1);
        }else{
          setLike(false);
          setPostLikes(postLikes - 1);
        }
    }

    const [CommentFixedHeader, setCommentFixedHeader] = useState(false); 
   
    const [commentText, setcommentText] = ("");
    const submitComment = (postId, user_id)=>{

    }

    const useKeyboardStatus = () => {
      const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    
      useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
          setKeyboardVisible(true);
          setCommentFixedHeader(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
          setKeyboardVisible(false);
          setCommentFixedHeader(false);
        });
  
      }, []);
    
      return isKeyboardVisible;
    };
  
    const keyboardVisible = useKeyboardStatus();
  
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(true);


    return (
        <View className =" flex-1 bg-white">
            <View>
                { CommentFixedHeader ? (
                  <TouchableWithoutFeedback >
                      <View className="absolute top-72 py-4 pt-16 z-20 left-0 right-0 bg-white flex-row justify-between items-center px-4 border-b border-blue-300">
                      <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 pt-1">
                          <Entypo name="chevron-left" size={24} color="black" />
                      </TouchableOpacity>
                      <View className ="w-1/2">
                          <Text className =" text-2xl font-bold">Secret Code</Text>
                      </View>
                      <View className ="  w-1/2 flex flex-row pr-5 justify-end">
                      
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                ) : (
                  <View className=" absolute border-b border-gray-300 bg-white w-full right-0 flex flex-row justify-between gap-2 mt-8 p-4">
                      <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 pt-1">
                          <Entypo name="chevron-left" size={24} color="black" />
                      </TouchableOpacity>
                      <View className ="w-1/2">
                          <Text className =" text-2xl font-bold">Secret Code</Text>
                      </View>
                      <View className ="  w-1/2 flex flex-row pr-5 justify-end">
                       
                      </View>
                  </View>
                )}
                


                <View className =" mt-24 pt-4 ">
                <ScrollView 
                    className = " bg-white"
                    showsVerticalScrollIndicator={false}
                >

                <View className=" mt-4">
                  <View className =" flex flex-row justify-between px-2">
                    <TouchableOpacity onPress={() => OpenPost()} className = " flex gap-2 flex-row w-3/5 ">
                        <View>
                            <Image className = " w-10 h-10 rounded-full " source={{ uri: `${server_api_base_url}profilepictures/${Post.pp}` }} />
                        </View>
                        <View className =" w-full h-11 overflow-hidden">
                            <Text className = " pt-1 text-md font-bold text-gray-700">{PostUsername}</Text>
                            <Text className = " text-xs w-3/4 overflow-auto text-gray-400">{postDate}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => OpenPost()} className =" p-2 rounded-sm flex justify-center ml-2">
                      <Entypo name="dots-three-vertical" size={14} color="#ccc" />
                    </TouchableOpacity>
                  </View>
                  

                  <View className =" mt-2">
                    

                    { images.length > 0 ? (
                      <View>
                        <TouchableOpacity onPress={() => OpenPost()}>
                          <Text className =" pl-2 pb-2">{postText}</Text>
                        </TouchableOpacity>
                        <View className =" h-96 ">
                          <Image style = { styles.post_image } className = " w-full object-cover " source={{ uri: `${server_api_base_url}uploads/${firstImage}` }} />
                        </View>
                      </View>
                    ) : (
                      <View className =" border-b border-gray-200 pb-4">
                        <TouchableOpacity onPress={() => OpenPost()}>
                            <Text className =" pl-4 pb-2">{postText}</Text>
                          </TouchableOpacity>
                      </View>
                    )}
                  

                  </View>


                  <View className =" flex flex-row justify-between border-b  border-gray-300 pb-2 px-2">
                    <View className ="mt-4 pt-2 px-2 flex flex-row justify-start gap-7">

                      <TouchableOpacity onPress={() => likePost(postId)} className =" rounded-full flex flex-row justify-center ml-2">
                        { like ? (
                          <MaterialCommunityIcons name="heart" size={24} color="#4169E1" />
                        ) : (
                          <View>
                            <MaterialCommunityIcons name="heart-outline" size={24} color="#4169E1" />
                          </View>
                        )}
                        
                        <Text style ={ styles.post_stat_heart } className =" text-sm font-bold p-1 text-skyblue-700">{postLikes}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => goToUploads()} className =" rounded-full flex flex-row justify-center ml-2">
                        <MaterialCommunityIcons name="comment-processing-outline" size={24} color="#0039a6" />
                        <Text className =" text-sm font-bold p-1 text-indigo-700">276</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => goToUploads()} className =" rounded-full flex flex-row justify-center ml-2">
                        <AntDesign name="retweet" size={22} color="#72A0C1" />
                      </TouchableOpacity>
                    </View>

                    <View className =" mt-4 pt-4 px-2 flex flex-row justify-start gap-7">
                   
                      <View className =" rounded-full flex flex-row justify-center ml-2">
                        <Entypo name="link" size={20} color="#72A0C1" />
                      </View>
                    </View>
                  </View>

                  <View className="mb-40 mt-4">
                    { loadingComments ? (
                      <View><Text className =" text-blue-500 font-bold text-sm text-center">Loading comments...</Text></View>
                    ) : (
                      <View className=" m-2 px-2">
                        <View className =" flex flex-row justify-between">
                            <TouchableOpacity onPress={() => goToUploads()} className = " flex gap-2 flex-row w-3/5 ">
                                <View>
                                    <Image className = " w-8 h-8 rounded-full " source={{ uri: `http://192.168.160.234/textiepro/apis/profilepictures/default-pp.png` }} />
                                </View>
                                <View className =" w-full h-11 overflow-hidden">
                                    <Text className = " text-md font-bold text-gray-700">Victor M.</Text>
                                    <Text className = " text-xs w-3/4 overflow-auto text-gray-400">27th may, 2024</Text>
                                </View>
                            </TouchableOpacity>
                            <View className =" rounded-sm text-gray-300 flex justify-center mr-2 mb-2">
                                <MaterialCommunityIcons name="window-close" size={18} color="#999" />
                            </View>
                        </View>
                    

                        <View className =" ">
                            <Text className =" px-1 pb-1 text-gray-500">
                            Has anyone tried to upload videos? I was request for such a feature i think they need to look into it. 
                            </Text>
                        
                        </View>
                    </View>
                    )}
                    


                  </View>
                </View>
                </ScrollView>
                </View>
            </View>

            <View className=" absolute bottom-0 rounded-t-3xl  flex-row items-center px-2 py-2 bg-gray-100">
              <TextInput
                value={commentText}
                onChangeText={setcommentText}
                placeholder="Add a comment 🤭"
                className="flex-1 bg-white mb-14 rounded-full px-4 py-2 border border-gray-300 text-base"
              
              />
              <TouchableOpacity
                onPress={submitComment(postId, user_id)}
                className="ml-2 mb-14 px-2 py-2 bg-blue-500 rounded-full"
              >
                <Text className="text-white font-semibold">
                  <FontAwesome5 name="arrow-circle-up" size={24} color="white" />
                </Text>
              </TouchableOpacity>
            </View>
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

export default OpenPostScreen;









