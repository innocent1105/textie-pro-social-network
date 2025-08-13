import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Touchable, Animated, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import axios from 'axios';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Vibration } from 'react-native';
// import Animated, { FadeInUp } from "react-native-reanimated";
import { BlurView } from 'expo-blur';



const vibrate = () => {
  Vibration.vibrate(140); // vibrates for 100ms
};

const TinderSwipe = ({}) => {

const [isLoggedIn, setIsLoggedIn] = useState(null); 
const [user_id , setUserId] = useState(null);

let server_api_base_url = "http://192.168.6.234/textiepro/apis/";

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
        const token = await SecureStore.getItemAsync('user_id');
        console.log('Loaded user_id:', token);
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

const getUserUrl = server_api_base_url + "swipe_algorithm.php";

const scaleAnim = useRef(new Animated.Value(1)).current;



  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);
  const lastSwipeDirection = useRef('');

  let navigation = useNavigation();

  const [likedUser, setLikedUser] = useState([]);
  const [liked, setLiked] = useState(false);

  const getChatUsers = async () => {
    console.log("User ID before request:", user_id);
  
    try {
      const res = await axios.post(getUserUrl, { user_id });
  
      // Transform user data to match frontend structure
      const transformed = res.data.map((user, index) => ({
        id: index + 1,
        user_id: user.user_id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone_number,
        image: user.pp,
        dob: user.dob,
        gender: user.gender,
        occupation: user.occupation,
        city: user.city,
        joined: user.date_created,
      }));
  
      console.log("Fetched & Transformed Users:", transformed);
  
      setCards(transformed); // or whatever your state is
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  


  useEffect(() => {
    if (user_id) {
      getChatUsers();
    }
  }, [user_id])
  

  const swipedAllCards = async ()=>{
    setLoading(true);
    getChatUsers();
  }



  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.85,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 2,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const OpenMessages = (User)=>{
    console.log(User)
    navigation.navigate("Chat", { Chat : 
        {
            "username" : User.username,
            "userId" : User.user_id,
            "image" : User.image
        }
    });
  }
  


  const renderCard = (card) => (
    <View style={styles.cardStyle} className="border border-gray-200  bg-white rounded-3xl overflow-hidden">
      <ImageBackground
        source={{ uri: `${server_api_base_url}profilepictures/${card.image}` }}
    
        imageStyle={{ borderRadius: 24 }} // or Tailwind rounded-2xl if using nativewind
        className =" flex flex-col justify-between h-full"
      >
        <View></View>
        <BlurView 
          intensity={70}
          tint="light"
          className =" rounded-t p-8" style={styles.cardOverlay}>
          <Text className =" text-lg font-bold">{card.username}, {card.dob}</Text>
          <Text className =" text-md text-gray-500">Lives in {card.city}</Text>
          <View className=" mt-4 flex flex-row justify-between ">
          <TouchableWithoutFeedback className=' ' onPressIn={handlePressIn} onPressOut={handlePressOut}>
              <Animated.View style={[ { transform: [{ scale: scaleAnim }] }]} className=' border border-gray-200 rounded-full overflow-hidden shadow-md'>
                <BlurView 
                  intensity={85}
                  tint="light"
                  className=" p-2 px-4 ">
                    <View className =" ">
                      <MaskedView
                          maskElement={
                              <View className="bg-transparent">
                                <Text className="text-2xl font-bold">
                                  <FontAwesome name="close" size={24} color="black" />
                                </Text>
                              </View>
                          }
                          >
                          <LinearGradient
                              colors={['#F08080', '#DC143C']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              className="h-8"
                          >
                              <Text className="text-2xl font-bold opacity-0">
                                <FontAwesome name="close" size={24} color="black" />
                              </Text>
                          </LinearGradient>
                      </MaskedView>
                    </View>
                </BlurView>
              </Animated.View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback className=' ' onPress={()=> OpenMessages(card)} onPressIn={handlePressIn} onPressOut={handlePressOut}>
              <Animated.View style={[ { transform: [{ scale: scaleAnim }] }]} className=' border border-gray-200 rounded-full overflow-hidden shadow-md'>
                <BlurView 
                  intensity={85}
                  tint="light"
                  className=" p-2 px-4 ">
                    <View className =" ">
                      <MaskedView
                          maskElement={
                              <View className="bg-transparent">
                                <Text className="text-2xl font-bold">
                                  <Ionicons name="chatbubble-ellipses" size={24} color="#1E90FF" />
                                </Text>
                              </View>
                          }
                          >
                          <LinearGradient
                              colors={['#808080', '#59515e']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              className="h-8"
                          >
                              <Text className="text-2xl font-bold opacity-0">
                                <Ionicons name="chatbubble-ellipses" size={24} color="#1E90FF" />
                              </Text>
                          </LinearGradient>
                      </MaskedView>
                    </View>
                </BlurView>
              </Animated.View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback className=' ' onPressIn={handlePressIn} onPressOut={handlePressOut}>
              <Animated.View style={[ { transform: [{ scale: scaleAnim }] }]} className=' border border-gray-200 rounded-full shadow-md overflow-hidden'>
                <BlurView 
                  intensity={85}
                  tint="light"
                  className=" p-2  ">
                    <View className =" ">
                      <MaskedView
                          maskElement={
                              <View className="bg-transparent">
                                <Text className="text-2xl font-bold ">
                                  <Ionicons name="heart" size={32} color="red" />
                                </Text>
                              </View>
                          }
                          >
                          <LinearGradient
                              colors={['#F08080', '#DC143C']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              className="h-8"
                          >
                              <Text className="text-2xl font-bold opacity-0">
                                <Ionicons name="heart" size={32} color="red" />
                              </Text>
                          </LinearGradient>
                      </MaskedView>
                    </View>
                </BlurView>
              </Animated.View>
            </TouchableWithoutFeedback>
            

          </View>
        </BlurView>
      </ImageBackground>
    </View>
  );

  const onSwiped = (cardIndex) => {
    const swipedCard = cards[cardIndex];
    if (swipedCard) {
      // console.log(`Swiped card ID: ${swipedCard.id}, Direction: ${lastSwipeDirection.current}`);

    }

    if(lastSwipeDirection.current == "right"){
        console.log("right");
    }

    // console.log(cards[cardIndex]);
  };

 

  const onSwipedRight = async (cardIndex) => {
    const swipedCard = cards[cardIndex];
    const likedUserId = swipedCard.user_id;
    const likedUsername = swipedCard.name;

    const res = await axios.post(`${server_api_base_url}swipe.php`, {
      user_id : user_id,
      liked_user : likedUserId
    });

    vibrate();

    console.log(res.data);

  };
  




  if (loading) {
    return (
      <View>
        <View className ="  p-4 pt-8 bg-white">
          <View className ="flex flex-row justify-between gap-2">
              <View className =" flex flex-row gap-1">
                  <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 pt-1">
                      <Entypo name="chevron-left" size={24} color="#1C39BB" />
                  </TouchableOpacity>
                  <View className =" ">
                  <MaskedView
                      maskElement={
                          <View className="bg-transparent">
                          <Text className="text-2xl font-bold text-black">Swipes</Text>
                          </View>
                      }
                      >
                      <LinearGradient
                          colors={['#1C39BB', '#1877F2']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          className="h-8"
                      >
                          <Text className="text-2xl font-bold opacity-0">Swipes</Text>
                      </LinearGradient>
                  </MaskedView>
                  </View>
              </View>
              <View className ="  flex flex-row pt-1  w-1/2 justify-end">
                  <TouchableOpacity  onPress={()=>{navigation.navigate("Settings")}} className =" p-2 rounded-sm flex justify-center">
                      <Feather name="settings" size={20} color="black" />
                  </TouchableOpacity>
              </View>
          </View>
        </View>
        <View className=' p-7'>
            <View className=' p-4 py-48 rounded-3xl shadow bg-gray-200'>
              <View className="items-center justify-center h-32">
                <ActivityIndicator size="large" color="#72A0C1" /> 
              </View>
            </View>
            <View className=' w-1/2 p-4 py-2 mt-2 rounded-3xl bg-gray-200'></View>
            <View className=' w-1/3 p-4 py-2 mt-2 rounded-3xl bg-gray-200'></View>

            <View className=' mt-4 flex flex-row justify-between'>
              <View className=' w-14 h-14 rounded-full p-4 bg-gray-200'></View>
              <View className=' w-14 h-14 py-2 rounded-full bg-gray-200'></View>
            </View>


        </View>

      </View>
    );
  }









  return (
    <View className=" bg-white ">
      {liked ? (
        <View></View>
      ) : (
        <Swiper
        className =" "
        ref={swiperRef}
        cards={cards}
        renderCard={renderCard}
        onSwipedLeft={() => (lastSwipeDirection.current = 'left')}
        onSwipedRight={onSwipedRight}
        onSwipedTop={() => (lastSwipeDirection.current = 'top')}
        onSwipedBottom={() => (lastSwipeDirection.current = 'bottom')}
        onSwipedAll={swipedAllCards}
        onSwiped={onSwiped}
        stackSize={3}
        stackSeparation={20}
        cardVerticalMargin={100}
        overlayLabels={{
          left: {
            title: 'NOPE',
            style: {
              label: { backgroundColor: 'black', color: 'white', borderWidth: 1 },
              wrapper: { alignItems: 'flex-end', marginTop: 30, marginLeft: -30 }
            }
          },
          right: {
            title: 'LIKE',
            style: {
              label: { backgroundColor: 'black', color: 'white', borderWidth: 1 },
              wrapper: { alignItems: 'flex-start', marginTop: 30, marginLeft: 30 }
            }
          },
          top: {
            title: 'SUPER LIKE',
            style: {
              label: { backgroundColor: 'black', color: 'white', borderWidth: 1 },
              wrapper: { alignItems: 'center' }
            }
          },
          bottom: {
            title: 'BLEAH',
            style: {
              label: { backgroundColor: 'black', color: 'white', borderWidth: 1 },
              wrapper: { alignItems: 'center' }
            }
          }
        }}
        animateOverlayLabelsOpacity
        animateCardOpacity
        swipeBackCard
      />
      )}
       
      <View className ="  p-4 pt-8 bg-white">
        <View className ="flex flex-row justify-between gap-2">
            <View className =" flex flex-row gap-1">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 pt-1">
                    <Entypo name="chevron-left" size={24} color="#1C39BB" />
                </TouchableOpacity>
                <View className =" ">
                <MaskedView
                    maskElement={
                        <View className="bg-transparent">
                        <Text className="text-2xl font-bold text-black">Swipes</Text>
                        </View>
                    }
                    >
                    <LinearGradient
                        colors={['#1C39BB', '#1877F2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="h-8"
                    >
                        <Text className="text-2xl font-bold opacity-0">Swipes</Text>
                    </LinearGradient>
                </MaskedView>
                </View>
            </View>
            <View className ="  flex flex-row pt-1  w-1/2 justify-end">
                <TouchableOpacity  onPress={()=>{navigation.navigate("Settings")}} className =" p-2 rounded-sm flex justify-center">
                    <Feather name="settings" size={20} color="black" />
                </TouchableOpacity>
            </View>
        </View>
      </View>


       {liked ? (
        <View className ="border pt-20 bg-white">
            <View className =" border p-2 flex flex-row justify-center">
                <Image
                    source={{ uri: `http://192.168.122.234/textiepro/apis/profilepictures/dev.jpg` }}
                    className="w-28 h-28 object-cover rounded-full "
                />
            </View>
        </View>
       ) : (
        <View></View>
       )}
    
    </View>
  );
};

export default TinderSwipe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cardStyle: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  cardImageStyle: {
    height: '85%',
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  info: {
    padding: 16,
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
