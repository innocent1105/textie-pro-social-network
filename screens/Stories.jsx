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
import InstagramStories from '@birdwingo/react-native-instagram-stories';


const StoriesScreen = ()=>{

    let navigation = useNavigation();
    const [isLoggedIn, setIsLoggedIn] = useState(null); 
    const [user_id , setUserId] = useState(null);

    let server_api_base_url = "http://192.168.6.234/textiepro/apis/";

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
   
    const [refreshing, setRefreshing] = useState(true);


    const getUserData = async () => {
        try {
          const res = await axios.post(`${server_api_base_url}edit_profile.php`, {
            user_id: user_id,
            request_type: "getUserData",
          });
      
          const data = res.data[0]; // assuming res.data is an array with at least one item
          console.log(res.data);
      
          await AsyncStorage.setItem("following_users", JSON.stringify(data)); 
      
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
          const value = await AsyncStorage.getItem("following_users");
      
          if (value !== null) {
            const data = JSON.parse(value); // ✅ properly parse the value
            setMyData(data);
            setUsername(data[1]);
            setFullname(data[2]);
            setEmail(data[3]);
            setphoneNumber(data[4]);
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
        console.log(res.data);
    }

    useEffect(() => {
        if (user_id) {
            getSwipes();
            setRefreshing(false);
        }
    }, [user_id]);


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

    const stories = [
        {
          id: 'user1',
          name: 'User 1',
          imgUrl: 'user1-profile-image-url',
          stories: [
            { id: 'story1', imgUrl: 'story1-image-url' },
            // ...
          ],
        },
        // ...
      ];
    
      return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <InstagramStories
            stories={[
              {
                id: 'user1',
                name: 'User 1',
                imgUrl: 'https://placekitten.com/100/100',
                stories: [
                  { id: 'story1', imgUrl: 'https://placekitten.com/400/700' },
                ],
              },
            ]}
            style={{ flex: 1 }}
          />
        </View>
      );
      
    };

export default StoriesScreen;