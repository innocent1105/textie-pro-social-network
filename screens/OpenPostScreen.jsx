import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const OpenPostScreen = ({ route }) => {
  let navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [user_id, setUserId] = useState(null);

  const { Post } = route.params;
  const postId = Post.id;
  const PostUsername = Post.username;
  const postText = Post.text;
  const postDate = Post.date;

  const images =
    typeof Post.images === "string" ? JSON.parse(Post.images) : [];
  const firstImage =
    images.length > 0 ? images[0].replace(/\\/g, "") : null;

  let server_api_base_url = "http://192.168.6.234/textiepro/apis/";

  const [commentText, setcommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);

  // Load comments on mount
  useEffect(() => {
    LoadComments();
  }, []);

  const Comment = async () => {
    if (!commentText.trim()) return; // avoid empty comments
    try {
      const res = await axios.post(server_api_base_url + "comment.php", {
        user_id,
        post_id: postId,
        comment: commentText,
      });

      if (res.data === "success") {
        setcommentText("");
        LoadComments(); // refresh after posting
      }
    } catch (error) {
      console.error(error);
    }
  };

  const LoadComments = async () => {
    setLoadingComments(true);
    try {
      const res = await axios.post(
        server_api_base_url + "load_comments.php",
        {
          user_id: user_id,
          post_id: postId,
        }
      );

      if (res.data !== "error") {
        setComments(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingComments(false);
    }
  };

  const getToken = async () => {
    try {
      const token = await SecureStore.getItemAsync("user_session");
      console.log("Loaded token:", token);
      return token;
    } catch (e) {
      console.error("Failed to get token", e);
      return null;
    }
  };

  const getUserId = async () => {
    try {
      const token = await SecureStore.getItemAsync("user_id");
      console.log("Loaded user_id:", token);
      setUserId(parseInt(token.replace(/\D/g, ""), 10));
    } catch (e) {
      console.error("Failed to get token", e);
      return null;
    }
  };

  useEffect(() => {
    getToken();
    getUserId();
  }, []);

  useEffect(() => {
    if (isLoggedIn === false) {
      navigation.navigate("Login");
    }
  }, [isLoggedIn]);

  const [CommentFixedHeader, setCommentFixedHeader] = useState(false);

  const useKeyboardStatus = () => {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
      const showSubscription = Keyboard.addListener(
        "keyboardDidShow",
        () => {
          setKeyboardVisible(true);
          setCommentFixedHeader(true);
        }
      );
      const hideSubscription = Keyboard.addListener(
        "keyboardDidHide",
        () => {
          setKeyboardVisible(false);
          setCommentFixedHeader(false);
        }
      );

      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []);

    return isKeyboardVisible;
  };

  useKeyboardStatus();

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View>
        {CommentFixedHeader ? (
          <TouchableWithoutFeedback>
            <View className="absolute top-72 py-4 pt-16 z-20 left-0 right-0 bg-white flex-row justify-between items-center px-4 border-b border-blue-300">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="mr-4 pt-1"
              >
                <Entypo name="chevron-left" size={24} color="black" />
              </TouchableOpacity>
              <View className="w-1/2">
                <Text className="text-2xl font-bold">Post</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <View className="absolute border-b border-gray-300 bg-white w-full right-0 flex flex-row justify-between gap-2 mt-8 p-4">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mr-4 pt-1"
            >
              <Entypo name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
            <View className="w-1/2">
              <Text className="text-2xl font-bold">Post</Text>
            </View>
          </View>
        )}

        {/* Content */}
        <View className="mt-24 pt-4">
          <ScrollView
            className="bg-white"
            showsVerticalScrollIndicator={false}
          >
            {/* Post Info */}
            <View className="mt-4">
              <View className="flex flex-row justify-between px-2">
                <View className="flex gap-2 flex-row w-3/5">
                  <Image
                    className="w-10 h-10 rounded-full"
                    source={{
                      uri: `${server_api_base_url}profilepictures/${Post.pp}`,
                    }}
                  />
                  <View className="w-full h-11 overflow-hidden">
                    <Text className="pt-1 text-md font-bold text-gray-700">
                      {PostUsername}
                    </Text>
                    <Text className="text-xs w-3/4 overflow-auto text-gray-400">
                      {postDate}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity className="p-2 rounded-sm flex justify-center ml-2">
                  <Entypo name="dots-three-vertical" size={14} color="#ccc" />
                </TouchableOpacity>
              </View>

              {/* Post Text & Image */}
              <View className="mt-2">
                {images.length > 0 ? (
                  <View>
                    <Text className="pl-2 pb-2">{postText}</Text>
                    <View className="h-96">
                      <Image
                        style={styles.post_image}
                        className="w-full object-cover"
                        source={{
                          uri: `${server_api_base_url}uploads/${firstImage}`,
                        }}
                      />
                    </View>
                  </View>
                ) : (
                  <View className="border-b border-gray-200 pb-4">
                    <Text className="pl-4 pb-2">{postText}</Text>
                  </View>
                )}
              </View>

              {/* Comments */}
              <View className="mb-40 mt-2">
                {loadingComments ? (
                  <View className="py-4">
                    <ActivityIndicator color={"#808080"} />
                  </View>
                ) : comments.length > 0 ? (
                  comments.map((item) => (
                    <View
                      key={item.comment_id}
                      className="m-2 px-2 border-b border-gray-200 pb-2"
                    >
                      <View className="flex flex-row justify-between">
                        <View className="flex gap-2 flex-row w-3/5">
                          <Image
                            className="w-8 h-8 rounded-full"
                            source={{
                              uri: `${server_api_base_url}profilepictures/${item.pp}`,
                            }}
                          />
                          <View>
                            <Text className="text-md font-bold text-gray-700">
                              {item.fullname}
                            </Text>
                            <Text className="text-xs text-gray-400">
                              @{item.username}
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity className="rounded-sm flex justify-center mr-2 mb-2">
                          <MaterialCommunityIcons
                            name="window-close"
                            size={18}
                            color="#999"
                          />
                        </TouchableOpacity>
                      </View>
                      <Text className="px-1 pb-1 text-gray-500">
                        {item.comment}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text className="text-center text-gray-400 py-4">
                    No comments yet. Be the first!
                  </Text>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Comment Input */}
      <View className="absolute bottom-0 rounded-t-3xl flex-row items-center px-2 py-2 bg-gray-100">
        <TextInput
          value={commentText}
          onChangeText={setcommentText}
          placeholder="Add a comment 🤭"
          className="flex-1 bg-white mb-14 rounded-full px-4 py-2 border border-gray-300 text-base"
        />
        <TouchableOpacity
          onPress={Comment}
          className="ml-2 mb-14 px-2 py-2 bg-blue-500 rounded-full"
        >
          <FontAwesome5 name="arrow-circle-up" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  post_image: {
    height: "100%",
  },
});

export default OpenPostScreen;
