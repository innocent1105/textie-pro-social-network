import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  ImageBackground ,
  ActivityIndicator ,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import { styled } from 'nativewind';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const MessagesScreen = ({ route }) => {
  const { Chat } = route.params;

  const otherUserName = Chat.username;
  const otherUserId = Chat.userId;
  const otherUserImage = Chat.image;



  const navigation = useNavigation();
  let server_api_base_url = "http://192.168.38.234/textiepro/apis/";


  const [isLoggedIn, setIsLoggedIn] = useState(null); 
  const [user_id , setUserId] = useState(null);

  const getToken = async () => {
    try {
        const token = await SecureStore.getItemAsync('user_session');
        console.log('Loaded token:', token);
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
          let token = await SecureStore.getItemAsync('user_id');
          setUserId(parseInt(token.replace(/\D/g, ""), 10))
          return token;
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
    if (isLoggedIn === "false") {
      navigation.navigate('Login');
    }
  }, [isLoggedIn]);






  const [messages, setMessages] = useState([
    // { id: '1', text: 'Hello!', fromMe: false },
    // { id: '2', text: 'How are you?', fromMe: false },
    // { id: '3', text: 'I am doing well, thanks!', fromMe: true },
  ]);

  const [loadingMessages, setloadingMessages] = useState(true);

  const fetchMessages = async (user_id, otherUserId)=>{
    let MessageUrl = "messages.php";
    MessageUrl = server_api_base_url + MessageUrl;
    const res = await axios.post(MessageUrl, {
      user_id: user_id,
      otherUser: otherUserId
    }, { timeout: 5000 });

    setloadingMessages(false);
    setMessages(res.data);
    // console.log(res.data);
  }

  fetchMessages(user_id, otherUserId);

  
  




  const [inputText, setInputText] = useState('');

  let sendMessageUrl = "send_message.php";
  sendMessageUrl = server_api_base_url + sendMessageUrl;

  const SubmitMessage = async (otherUserId,userMessage)=>{
    const res = await axios.post(sendMessageUrl, {
      user_id: user_id,
      otherUser: otherUserId,
      message : userMessage,
      date : "date"
    });

    console.log(res.data)
  }

  const sendMessage = () => {
    if (inputText.trim()) {
      let userMessage = inputText;
      
      SubmitMessage(otherUserId,userMessage);

      setMessages([
        ...messages,
        { id: Date.now().toString(), text: inputText, fromMe: true },
      ]);
      setInputText('');
    }
  };





 const MessageStatusView = ({messageStatus})=>{
  if(messageStatus === "sent"){
    return(
      <View>
        <Text className=" text-gray-500 text-md font-bold">
          <MaterialIcons name="check" size={14} color="" />
        </Text>
      </View>
    )
  }else if(messageStatus === "seen"){
    return(
      <View>
        <Text className=" text-blue-500 text-md font-bold">
          <MaterialCommunityIcons name="check-all" size={14} color="#007FFF" />
        </Text>
      </View>
    )
  }if(messageStatus === "delivered"){
    return(
      <View>
        <Text className=" text-gray-500 text-md font-bold">
          <MaterialCommunityIcons name="check-all" size={14} color="" />
        </Text> 
      </View>
    )
  }
 }








  const useKeyboardStatus = () => {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  
    useEffect(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
        setKeyboardVisible(true);
        // console.log("Keyboard is open")
      });
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardVisible(false);
        // console.log("Keyboard is closed")
      });

    }, []);
  
    return isKeyboardVisible;
  };

  const keyboardVisible = useKeyboardStatus();


let [chatFixedHeader, setChatFixedHeader] = useState(false);
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      {keyboardVisible ? (
        
        <TouchableWithoutFeedback>
          <StyledView className="absolute top-72 py-4 pt-16 z-20 left-0 right-0 bg-white flex-row justify-between items-center px-4 border-b border-blue-300">
            <View className =" flex-row ">
              <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 pt-2">
                <Entypo name="chevron-left" size={24} color="black" />
              </TouchableOpacity>
              
              <View className ="flex-row gap-2 ">
                <View>
                  <Image className = " w-10 h-10 rounded-full " source={{ uri: `${server_api_base_url}/profilepictures/${otherUserImage}` }} />
                </View>
                <View>
                  <Text className =" font-medium ">{otherUserName}</Text>
                  <Text className =" text-xs text-green-600">Online</Text>
                </View>
              </View>

            </View>
            <View className =" ">
              <View className =" p-2 rounded-sm flex justify-center ml-2">
                <Entypo name="dots-three-vertical" size={14} color="#888" />
              </View>
            </View>
          </StyledView>
        </TouchableWithoutFeedback>


      ) : (
        <StyledView className=" bg-white  flex-row items-center gap-2 justify-between p-4 pt-16 border-b border-blue-300">
          <View className =" flex-row ">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 pt-2">
              <Entypo name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
            
            <View className ="flex-row gap-2 ">
              <View>
                <Image className = " w-10 h-10 rounded-full " source={{ uri: `${server_api_base_url}/profilepictures/${otherUserImage}` }} />
              </View>
              <View>
                <Text className =" font-medium ">{otherUserName}</Text>
                <Text className =" text-xs text-green-600">Online</Text>
              </View>
            </View>

          </View>
          <View className =" ">
            <View className =" p-2 rounded-sm flex justify-center ml-2">
              <Entypo name="dots-three-vertical" size={14} color="#888" />
            </View>
          </View>
        </StyledView>
      )}

      {/* Chat body */}
      <ImageBackground
        source={require('../assets/images/chatbg4.jpg')} // Replace with your actual path
        resizeMode="cover"
        style={{ flex: 1 }}
      >
      <KeyboardAvoidingView
        className="flex-1 z-0 pb-28"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
       
       { loadingMessages ? (
              <View>
              <ActivityIndicator size="small" className="mt-20" color="" />
                <View className =" flex flex-row justify-center first-letter text-blue-500 mb-2 mt-2">
                  <Text className =" text-md text-center font-bold text-blue-500">Loading messages...</Text>
                </View>
              </View>
            ) : (
              <View>
              
              </View>
            )}

        <FlatList
          data={messages.slice().reverse()}
          inverted
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 15 }}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <View>
             
        

              <StyledView
                className={` px-3 py-1 flex flex-row justify-end rounded-2xl max-w-[75%] ${
                  item.fromMe
                    ? 'bg-white border border-gray-200 self-end rounded-br-none'
                    : ' self-start rounded-bl-none bg-gray-800 border border-gray-200 '
                }`}
              >
                { item.fromMe ? (
                  <View className =" bg-white flex flex-row">
                    <StyledText className="text-base  text-gray-800">{item.text}</StyledText>
                    <View className =" flex flex-row justify-end pt-2 pl-2">
                     <MessageStatusView messageStatus={item.status}/>
                    </View>
                  </View>
                ) : (
                  <View className =" bg-gray-800 border-gray-200 ">
                    <StyledText className="text-base  text-white">{item.text}</StyledText>
                  </View>
                )}
                
              </StyledView>

            </View>
           
          )}
        />

        {/* Input */}
      <StyledView className=" absolute bottom-0 rounded-t-3xl  flex-row items-center px-2 py-2 bg-gray-100">
          <StyledTextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            className="flex-1 bg-white mb-14 rounded-full px-4 py-2 border border-gray-300 text-base"
            onSubmitEditing={sendMessage}
            onPress={() => { setChatFixedHeader(true)}}
          
          />
          <StyledTouchableOpacity
            onPress={sendMessage}
            className="ml-2 mb-14 px-2 py-2 bg-blue-500 rounded-full"
          >
            <StyledText className="text-white font-semibold">
              <FontAwesome5 name="arrow-circle-up" size={24} color="white" />
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView> 
      </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default MessagesScreen;
