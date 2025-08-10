import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
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





const HomeScreen = () => {
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

  let server_api_base_url = "http://192.168.6.234/textiepro/apis/";
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
      setUserId(parseInt(token.replace(/\D/g, ""), 10));
    } catch (e) {
      console.error("Failed to get user_id", e);
    }
  };

  useEffect(() => {
    getToken();
    getUserId();
  }, []);

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

  useEffect(() => {
    if (user_id !== null) {
      fetchMessages();
      const interval = setInterval(() => getChatUsers(), 5000);
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
      <BlurView intensity={75} tint="light" className="absolute w-full p-4 pb-0 z-10">
        <View className="flex flex-row justify-between pt-8">
          <Text className="text-2xl font-bold">Messages</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
            <Feather name="settings" size={24} color="#111" />
          </TouchableOpacity>
        </View>

        <View className="flex flex-row justify-between mt-4">
          {['Chats', 'Suggested', 'Liked', 'Following', 'Stories'].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
              <Text className={`font-medium ${activeTab === tab ? 'text-gray-800' : 'text-gray-400'}`}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </BlurView>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        className="pt-32 mb-32 px-2"
      >
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Search"
          className="bg-white rounded-full px-4 py-2 border border-gray-300 text-base mb-2"
        />

        {activeTab === "Chats" && renderChats()}

        {/* {activeTab !== "Chats" && (
          <View className="items-center justify-center mt-10">
            <Text className="text-gray-400 font-semibold text-lg">
              {activeTab} section is under construction.
            </Text>
          </View>
        )} */}

        {activeTab === "Suggested" && (
          <View className="">
            {users.length > 0 ? (
              filteredUsers.map((user) => (
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
              ))
            ) : (
              <Text>No users found</Text>
            )}
          </View>
        )}

       


      </ScrollView>

      <BottomNav />
    </View>
  );
};

export default HomeScreen;
