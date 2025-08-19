import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import BottomNav from "./components/BottomNav";
import ChatUser from "./components/ChatUser";
import SuggestedUser from "./components/Suggested";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Dimensions } from "react-native";
import * as Haptics from 'expo-haptics';
import { SlideItem } from "./components/SlideItem";
import Carousel, { TAnimationStyle } from "react-native-reanimated-carousel";
import { interpolate } from "react-native-reanimated";
import { Vibration } from 'react-native';
import * as Location from "expo-location";
import registerForPushNotificationsAsync from "./app_notifications";
import * as Notifications from "expo-notifications";
import {showNotification, getUserData} from "./notifications/show_";
import MapView, { Marker } from "react-native-maps";



const vibrateLight = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

const vibrateHeavy = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
};

const vibrate = (x) => {
    Vibration.vibrate(x); // vibrates for 100ms
};



const MapScreen = () => {
  const navigation = useNavigation();
  const [user_id, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const [refreshing, setRefreshing] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [chatsIsEmpty, setChatsEmpty] = useState(false);
  const [internetCon, setInternetCon] = useState(false);
  const [inputText, setInputText] = useState("");
  const [activeTab, setActiveTab] = useState("Chats");

  const [visible, setVisible] = useState(false);



  registerForPushNotificationsAsync();


  let server_api_base_url = "http://192.168.165.234/textiepro/apis/";
  let getUserUrl = server_api_base_url + "chat_user.php";

  const getToken = async () => {
    try {
      const token = await SecureStore.getItemAsync("user_session");
      if (token === null) navigation.navigate("Login");
    } catch (e) {
      console.error("Failed to get token", e);
    }
  };

  const getUserId = async () => {
    try {
      const token = await SecureStore.getItemAsync("user_id");
      if (token) {
        setUserId(parseInt(token.replace(/\D/g, ""), 10));
      } else {
        console.warn("No user_id found, redirecting to Login");
        navigation.navigate("Login");
      }
    } catch (e) {
      console.error("Failed to get user_id", e);
    }
  };
  

  useEffect(() => {
    getToken();
    getUserId();
  }, []);

  showNotification(user_id);


  useEffect(() => {
    if (isLoggedIn === "false") navigation.navigate("Login");
  }, [isLoggedIn]);




  const getChatUsers = async () => {
    try {
      const res = await axios.post(getUserUrl, { user_id }, { timeout: 5000 });
      if (Array.isArray(res.data)) {
        setUsers(res.data);
        await AsyncStorage.setItem("chats", JSON.stringify(res.data));
        setChatsEmpty(res.data.length === 0);
      } else {
        setUsers([]);
      }
      setLoadingUsers(false);
      setInternetCon(false);
    } catch (error) {
      console.error("Network error :", error);
      setInternetCon(true);
    }
  };

  const fetchMessages = async () => {
    try {
      const value = await AsyncStorage.getItem("chats");
      if (value !== null) {
        setUsers(JSON.parse(value));
        setLoadingUsers(false);
        getChatUsers();
      } else {
        getChatUsers();
      }
    } catch (error) {
      console.error("AsyncStorage error:", error);
      setInternetCon(true);
      await getChatUsers();
    }
  };

  const fetchFirstLogin = async () => {
    try {
      const value = await AsyncStorage.getItem("first_sign_in_data");
      
      if (value === null) {
        setAgeIsSet(true);
        setVisible(true);
      } else {
        setAgeIsSet(true);
        setVisible(false);
      }
    } catch (error) {
      setAgeIsSet(true);
    }
  };

  const [address, setAddress] = useState(null);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied");
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
   
    let addr = await Location.reverseGeocodeAsync(loc.coords);
    setAddress(addr[0]); 
    // console.log(address)

    let location_data = {
      country : addr[0].country,
      province : addr[0].region,
      city : addr[0].city,
      subregion : addr[0].subregion
    };


    const res = await axios.post(server_api_base_url + "set_location.php", {
      user_id: user_id,
      address : location_data
    });
    
    console.log(res.data);

  };

 
  useEffect(() => {
    if (user_id !== null) {
      fetchMessages();
      const interval = setInterval(() => getChatUsers(), 5000);
   
      fetchFirstLogin();

      getLocation();
      console.log("location");

      return () => clearInterval(interval);
    }
  }, [user_id]);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user[1].toLowerCase().includes(inputText.toLowerCase())
    );
    setFilteredUsers(filtered);
    
  }, [inputText, users]);









  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMessages();
    setRefreshing(false);
  };


  useEffect(() => {
    if (activeTab === "Following") {
      setActiveTab("Chats");
      navigation.navigate("Following");
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "Liked") {
      setActiveTab("Chats");
      navigation.navigate("Liked-users");
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "Stories") {
      setActiveTab("Chats");
      navigation.navigate("Stories");
    }
  }, [activeTab]);


  const PAGE_WIDTH = Dimensions.get("window").width;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [ageIsSet, setAgeIsSet] = useState(false);
  const [location, setLocation] = useState(null);

  const itemSize = 80;
  const centerOffset = PAGE_WIDTH / 2 - itemSize / 2;

  const animationStyle = useCallback(
    (value) => {
      "worklet";

      const itemGap = interpolate(value, [-3, -2, -1, 0, 1, 2, 3], [-30, -15, 0, 0, 0, 15, 30]);

      const translateX =
        interpolate(value, [-1, 0, 1], [-itemSize, 0, itemSize]) +
        centerOffset -
        itemGap;

      const translateY = interpolate(value, [-1, -0.5, 0, 0.5, 1], [60, 45, 40, 45, 60]);

      const scale = interpolate(value, [-1, -0.5, 0, 0.5, 1], [0.8, 0.85, 1.1, 0.85, 0.8]);

      return {
        transform: [
          { translateX },
          { translateY },
          { scale },
        ],
      };
    },
    [centerOffset]
  );

  useEffect(() => {
    // console.log("Selected age range index:", selectedIndex);
  }, [selectedIndex]);


  const saveAge = async () => {
  
    let AgeRange = "18–24";
  
    if(selectedIndex === 0){
      AgeRange = "18–24";
    }else if(selectedIndex === 1){
      AgeRange = "25-30"
    }else if(selectedIndex === 2){
      AgeRange = "31-35"
    }else if(selectedIndex === 3){
      AgeRange = "36-40"
    }else{
      AgeRange = "41+"
    }
  
    try{
      const res = await axios.post(server_api_base_url + "set_age_range.php", {
        user_id: user_id,
        age_range: AgeRange,
      });
  
      console.log(res.data);
      setAgeIsSet(true);
      await AsyncStorage.setItem("first_sign_in_data", JSON.stringify(res.data));
      setVisible(false);
    }catch(err){
      console.log(err);
    }
  }




  const renderChats = () => {
    if (chatsIsEmpty) {
      return (
        <View className="p-2 items-center mt-20">
          <MaterialCommunityIcons name="chat-remove-outline" size={74} color="#ddd" />
          <Text className="mt-4 text-gray-400 font-semibold text-lg">No Messages</Text>
          <Text className="mt-4 px-16 text-gray-300 text-center font-semibold">
            You haven't talked to anyone, feel free to start a new chat.
          </Text>
        </View>
      );
    }
    if (filteredUsers.length === 0 && users.length > 0) {
      return (
        <View className="p-4 items-center justify-center mt-20">
          <Text className="text-gray-400 text-lg font-semibold">No results match your search</Text>
        </View>
      );
    }
    if (filteredUsers.length === 0) {
      return (
        <View className="p-4">{
          [...Array(15)].map((_, index) => (
            <View key={index} className="flex flex-row gap-1 my-2">
              <View className="h-11 w-11 rounded-full bg-gray-200" />
              <View className="pt-2">
                <View className="h-4 w-48 rounded bg-gray-200" />
                <View className="h-3 w-36 rounded mt-1 bg-gray-200" />
              </View>
            </View>
          ))}</View>
      );
    }
    return filteredUsers.map((user) => (
      <View key={user[0]} className="border-b border-gray-50 pt-1">
        <ChatUser
          id={user[0]}
          username={user[1]}
          image={user[2]}
          time={user[3]}
          message={user[4]}
          type={user[5]}
          status={user[6]}
          sender={user[7]}
        />
      </View>
    ));
  };

  return (
    <View className="flex-1 bg-white">
      <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={() => setVisible(false)}
          >
            <View className="flex-1 justify-end bg-black/70">
              <View className=" w-full">
               <View className=" absolute bottom-0 w-auto left-0 right-0 bg-white rounded-t-3xl h-max ">
                  <View className=" flex flex-row justify-between">
                    <Text className=" font-bold text-xl p-4">Set your age range</Text>
                    <TouchableOpacity
                      onPress={() => setVisible(false)}
                      className=" p-4 rounded-lg"
                    >
                      <Text className="text-white font-bold"><Ionicons name="close" size={24} color="black" /></Text>
                    </TouchableOpacity>
                  </View>

                  <View className=" mb-4 pb-2 border-b-2 border-gray-100">
                    <Text className=" px-4 text-gray-700 font-semibold">Select your age range by sliding, and click!</Text>
                    <Text className=" px-4 text-gray-500">This will be used for matching and post recommendations only.</Text>
                  </View>

                  <View className="" style={{ height: PAGE_WIDTH }}>
                    <Carousel
                      className = " h-44"
                      width={itemSize}
                      height={itemSize}
                      loop
                      style={{ width: PAGE_WIDTH }}
                      data={["18–24", "25–30", "31–35", "36–40", "41+"]}
                      renderItem={({ index }) => (
                        <TouchableWithoutFeedback
                          key={index}
                          onPress={() => {setSelectedIndex(index); vibrate(100);}}
                          containerStyle={{ flex: 1 }}
                          style={{ flex: 1 }}
                        >
                          <View
                            style={{
                              backgroundColor: selectedIndex === index ? "#2a52be" : "#445868",
                              flex: 1,
                              borderRadius: 50,
                              justifyContent: "center",
                              overflow: "auto",
                              alignItems: "center",
                            }}
                            className = ""
                          >
                            <View style={{ width: "100%", height: "100%" }}>
                              <SlideItem index={index} data={["18–24", "25–30", "31–35", "36–40", "41+"]} />
                            </View>
                          </View>
                        </TouchableWithoutFeedback>
                      )}
                      customAnimation={animationStyle}
                    />



                    <View className="absolute bottom-4 left-4 right-4 mx-4">
                      <TouchableOpacity 
                        className=" bg-blue-500 p-2 flex flex-row justify-center rounded-full" 
                        onPress={()=> saveAge()}
                      >
                        <Text className=" font-semibold text-lg text-white">Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
               </View>
              </View>
            </View>
          </Modal>


      <BlurView intensity={75} tint="light" className="absolute w-full p-4 pb-0 z-10">
        <View className="flex flex-row justify-between pt-8">
          <Text className="text-2xl font-bold">Maps</Text>
          <View className=" flex flex-row">
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')} className="mx-4 rounded-sm">
              <Feather name="bell" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
              <Feather name="settings" size={24} color="#111" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex flex-row justify-between mt-4">
          {['Chats', 'Suggested', 'Liked', 'Following', 'Stories'].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
              <Text className={`font-medium ${activeTab === tab ? 'text-gray-800' : 'text-gray-400'}`}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </BlurView>

            // map here
    <View className="flex-1 mt-40"> 
        <MapView
            style={{ flex: 1 }}
            initialRegion={{
            latitude: 37.78825,  // fallback coords
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
            followsUserLocation={true}
        >
            {location && (
            <Marker
                coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                }}
                title="You are here"
            />
            )}
        </MapView>
    </View>


      <BottomNav />
    </View>
  );
};

export default MapScreen;
