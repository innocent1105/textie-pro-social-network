import React, { useEffect, useState} from "react";
import { View, Text, Button, Pressable, TextArea, TextInput, Image, ImageBackground, StyleSheet, ActivityIndicator,TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import PostBottomNav from "./components/PostsBottomNav";
import ChatUser from "./components/ChatUser";
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';


const UploadPostScreen = ()=>{
    let navigation = useNavigation();
    const [isLoggedIn, setIsLoggedIn] = useState(null); 
    const [user_id , setUserId] = useState(null);

   
      
    let server_api_base_url = "http://192.168.8.234/textiepro/apis/";
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

   


    const [image, setImage] = useState(null);
    const [images, setImages] = useState([]);
    
    useEffect(() => {
    (async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
        alert('This app needs access to your photos for this feature.');
        }
    })();
    }, []);

    const [imageKey, setImageKey] = useState(0);
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri); 
            setImages([...images, {"id" : imageKey, "image" : result.assets[0].uri}]);
            setImageKey(imageKey + 1);
            console.log(images)
        }
    };


    const removeImage =(imageId)=>{
        const newImages = images.filter(item => item.id !== imageId);
        setImages(newImages);
    }


    const [isLoadingSignup, setIsLoadingSignup] = useState(false);
    const [uploadError, setUploadError] = useState(false);
    const [postText, setPostText] = useState("");


    const uploadPost = async () => {
        const formData = new FormData();
        
        images.forEach((img, index) => {
            formData.append('images[]', {
            uri: img.image,
            name: `photo_${index}.jpg`,
            type: 'image/jpeg',
            });
        });
        
        formData.append('postText', postText);
        formData.append('userId', user_id);
  
        console.log(formData);
        setIsLoadingSignup(true);
        setUploadError(false);


        try {
            const res = await axios.post(server_api_base_url + "upload.php", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        
            console.log("Upload response:", res.data);
            if(res.data.success){
                navigation.navigate("Posts");
            }else{
                setUploadError(true);
            }
            setIsLoadingSignup(false);
        } catch (error) {
            console.log("Upload error:", error);
        }
    };

 





    return (
       <View className =" flex-1 bg-white">
        <View>
          <View className=" absolute border-b border-gray-200 bg-white w-full right-0 flex flex-row justify-between gap-2 mt-8 p-4">
             <View className =" pt-1">
                <Octicons name="chevron-left" size={24} color="black" />
              </View>
              <View className ="">
        
                  <Text className =" text-2xl font-bold">Create Post</Text>
              </View>

              <View className =" flex flex-row  justify-end">
                {/* <View className =" p-2 rounded-sm flex justify-center ml-2">
                  <Feather name="search" size={20} color="black" />
                </View> */}
                <TouchableOpacity onPress={() => uploadPost()}>
                    <View className =" bg-blue-600 p-2 rounded-md px-4">
                    { isLoadingSignup ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text className =" text-white font-bold">Post</Text>
                    )}

                    </View>
                </TouchableOpacity>
              </View>
          
          </View>

          <View>
                    
            <ScrollView className =" mt-28">
                { uploadError ? (
                    <View className =" border p-2 m-2 rounded-md bg-orange-50 border-orange-400 text-orange-700 font-bold">
                        <Text className=" text-center text-orange-500 font-bold">An error occurred. Please check your internet connection and try again.</Text>
                    </View>
                ):(
                    <View></View>
                ) }
              
                <View className =" border text-gray-800 m-2 p-2 rounded-lg border-gray-200">
                    <Text className = " text-sm text-gray-400 ">What's on your mind?</Text>
                    <TextInput
                        multiline={true}
                        numberOfLines={10}
                        plalaceholder="What's on your mind?"
                        placeholderTextColor={"#999"}
                        value={postText}
                        onChangeText={setPostText}
                        className=" text-sm font-medium text-gray-800"
                    />
                </View>
                <TouchableOpacity onPress={() => pickImage()} className=" flex flex-row gap-2 pl-4 mt-2">
                    <Ionicons name="image-outline" size={24} color="#007FFF" />
                    <Text className =" font-medium pt-1 text-blue-500">Add images</Text>
                </TouchableOpacity>
                

                <View className=" p-2">
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className=" flex-row gap-2" 
                >
                    <View className =" flex flex-row gap-2">
                        {images.map((item) => (
                            <TouchableOpacity onPress={() => removeImage(item.id)}>
                                <ImageBackground
                                    key={item.id}
                                    source={{ uri: item.image }}
                                    className="w-16 h-16  border-gray-300 rounded-lg overflow-hidden"
                                    >
                                    <View className="flex-1 items-center justify-center bg-black/40">
                                        <Text className="text-white text-xs">
                                            <MaterialCommunityIcons name="window-close" size={20} color="#fff" />
                                        </Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>


                </View>

                
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

export default UploadPostScreen;









