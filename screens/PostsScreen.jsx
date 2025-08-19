import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import PostBottomNav from "./components/PostsBottomNav";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";

const PostsScreen = () => {
  const navigation = useNavigation();
  const [user_id, setUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sharePost, setSharePost] = useState("");
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});

  // Pagination
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const server_api_base_url = "http://192.168.165.234/textiepro/apis/";

  const fetchUsersFromLocal = async () => {
    try {
      const value = await AsyncStorage.getItem("chats");
      if (value !== null) setUsers(JSON.parse(value));
    } catch (error) {
      console.error("AsyncStorage error:", error);
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
    getUserId();
    fetchUsersFromLocal();
  }, []);

  const goToUploads = () => navigation.navigate("UploadPost");

  const OpenPost = (postData) => navigation.navigate("OpenPost", { Post: postData });

  const OpenMatchProfile = (post) => {
    const { user_id: id, username: name, pp: image } = post;
    navigation.navigate("LikedUser", { User: { user_id, id, name, image } });
  };

  const toggleSelectUser = (id) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((uid) => uid !== id) : [...prevSelected, id]
    );
  };

  const shareAsMessage = async () => {
    try {
      const res = await axios.post(server_api_base_url + "share_as_message.php", {
        user_id,
        post_id: sharePost,
        content: "post",
        selectedUsers,
      });
      console.log(res.data);
    } catch (shareError) {
      console.log(shareError);
    }
    setVisible(false);
    setSharePost("");
    setSelectedUsers([]);
  };

  const ShareButton = (post_id) => {
    setVisible(true);
    setSharePost(post_id);
  };

  const toggleLike = async (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: likedPosts[postId] ? post.likes - 1 : post.likes + 1 } : post
      )
    );
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));

    try {
      const res = await axios.post(server_api_base_url + "like.php", { user_id, post: postId });
      console.log("liked:", postId, res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item, index }) => {
    if (item.type === "header") {
      return (
        <View className="mt-24">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2 flex-row gap-2">
            <TouchableOpacity onPress={goToUploads} className="pl-4">
              <View className="border-2 border-gray-300 bg-gray-200 rounded-full w-14 h-14 p-1 justify-center items-center overflow-hidden">
                <Feather name="plus" size={20} color="#111" />
              </View>
            </TouchableOpacity>
            {stories.map((filename, idx) => (
              <TouchableOpacity
                key={`${filename.id || idx}-${idx}`}
                onPress={() => OpenMatchProfile(filename)}
                className="border-2 border-gray-200 rounded-full w-14 h-14 p-1 justify-center items-center overflow-hidden"
              >
                <Image
                  className="w-12 h-12 rounded-full border border-gray-400"
                  source={{ uri: `${server_api_base_url}/profilepictures/${filename.pp}` }}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      );
    }

    const images = typeof item.images === "string" ? JSON.parse(item.images) : [];
    const firstImage = images.length > 0 ? images[0].replace(/\\/g, "") : null;
    let datetime = new Date(item.date);
    const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true };
    datetime = isNaN(datetime.getTime()) ? "" : datetime.toLocaleString("en-US", options);

    return (
      <View className="border border-gray-100 rounded-2xl m-1 p-2">
        <View className="flex flex-row justify-between">
          <TouchableOpacity onPress={() => OpenPost(item)} className="flex gap-2 flex-row w-3/5">
            <Image className="w-10 h-10 rounded-full" source={{ uri: `${server_api_base_url}profilepictures/${item.pp}` }} />
            <View className="w-full h-11 overflow-hidden">
              <Text className="pt-1 text-md font-bold text-gray-700">{item.username}</Text>
              <Text className="text-xs w-3/4 overflow-auto text-gray-400">{datetime}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => OpenPost(item)} className="p-2 rounded-sm flex justify-center ml-2">
            <Entypo name="dots-three-vertical" size={14} color="#ccc" />
          </TouchableOpacity>
        </View>

        {item.text && (
          <TouchableOpacity onPress={() => OpenPost(item)}>
            <Text className="pl-2 pb-2">{item.text}</Text>
          </TouchableOpacity>
        )}

        {images.length > 0 && (
          <ImageBackground
            source={{ uri: `${server_api_base_url}uploads/${firstImage}` }}
            resizeMode="cover"
            className="w-full h-96 rounded-xl overflow-hidden"
          />
        )}

        <View className="mt-2 flex flex-row justify-between">
          <TouchableOpacity className="flex flex-row justify-center p-2 rounded-full bg-red-100" onPress={() => toggleLike(item.id)}>
            {likedPosts[item.id] ? <AntDesign name="heart" size={20} color="#F2003C" /> : <AntDesign name="hearto" size={20} color="#F2003C" />}
            <Text className={`font-semibold px-1 text-red-500`}>{item.likes} {item.likes === 1 ? "Like" : "Likes"}</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex flex-row p-2 rounded-full bg-purple-100" onPress={() => OpenPost(item)}>
            <Ionicons name="chatbubble" size={20} color="#6050DC" />
            <Text className="font-semibold text-purple-500 px-1">{item.comments} {item.comments === 1 ? "Comment" : "Comments"}</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex flex-row p-2 rounded-full bg-gray-100">
            <Feather name="eye" size={20} color="black" />
            <Text className="font-semibold text-gray-500 px-1">{item.views}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => ShareButton(item.id)} className="flex flex-row p-2 rounded-full bg-gray-100">
            <Feather name="send" size={20} color="black" />
            <Text className="font-semibold text-gray-500 px-1">{item.shares}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const getPosts = async (pageNumber = 1) => {
    if (!hasMore && pageNumber !== 1) return;
    if (pageNumber === 1) setPosts([]);
    try {
      const res = await axios.post(server_api_base_url + "posts.php", { user_id, page: pageNumber });
      if (res.data.length === 0) {
        setHasMore(false);
        return;
      }
      setPosts((prev) => [...prev, ...res.data]);
      const uniqueStories = res.data.filter((newItem) => !stories.some((s) => s.id === newItem.id));
      setStories((prev) => [...prev, ...uniqueStories]);
      const likedMap = {};
      res.data.forEach((post) => (likedMap[post.id] = !!post.liked));
      setLikedPosts((prev) => ({ ...prev, ...likedMap }));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await getPosts(1);
    setRefreshing(false);
  };

  useEffect(() => {
    if (user_id) getPosts(page);
  }, [user_id]);

  useEffect(() => {
    if (page > 1) getPosts(page);
  }, [page]);

  return (
    <View className="flex-1 bg-white">
      <View className="absolute top-0 left-0 right-0 z-10">
        <BlurView intensity={95} tint="light" className="w-full flex-row justify-between items-center px-4 pt-12 pb-4">
          <Text className="text-2xl font-bold text-black">Discover</Text>
          <View className="flex-row space-x-2">
            <TouchableOpacity onPress={goToUploads} className="p-2 rounded-sm">
              <Feather name="plus" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Notifications")} className="p-2 rounded-sm">
              <Feather name="bell" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Settings")} className="p-2 rounded-sm">
              <Feather name="settings" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>

      <FlatList
        data={[{ type: "header" }, ...[...posts].toReversed()]}
        className=" mb-0 pb-44"
        keyExtractor={(item, index) => (item.type === "header" ? `header` : `${item.id}-${index}`)}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={() => {
          if (!loadingMore && hasMore) {
            setLoadingMore(true);
            setPage((prev) => prev + 1);
            setLoadingMore(false);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (loadingMore ? <View className=" pb-96 p-2 pt-4"><Text> Loadind posts </Text></View> : null)}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <PostBottomNav />
    </View>
  );
};

export default PostsScreen;
