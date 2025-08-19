import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Touchable,Modal, Animated, TextInput, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
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
import { ScrollView } from 'react-native-gesture-handler';



const vibrate = () => {
  Vibration.vibrate(140); // vibrates for 100ms
};

const TinderSwipe = ({}) => {

const [isLoggedIn, setIsLoggedIn] = useState(null); 
const [user_id , setUserId] = useState(null);

let server_api_base_url = "http://192.168.165.234/textiepro/apis/";

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

const [visible, setVisible] = useState(false);


const [paid, setPaid] = useState(false);
const [processingPayment, setProcessingPayment] = useState(false);
const [paymentComplete, setProcessComplete] = useState(false);

const [amount, setAmount] = useState(90);
const [plan, setPlan] = useState("Monthly");

const [acc_number, setNumber] = useState("");
const [network, setNetwork] = useState("mtn");

const selectNetwork = (network) => {
    setNetwork(network);
}



const selectPlan = (plan) => {
  setPlan(plan);
  if(plan == "Monthly"){
    setAmount(90);
  }else{
    setAmount(27);
  }
}

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

  const OpenMessages = (User, paid)=>{
    if(processingPayment){
      console.log(processingPayment)
      navigation.navigate("Chat", { Chat : 
          {
              "username" : User.username,
              "userId" : User.user_id,
              "image" : User.image
          }
      });
    }else{
      setVisible(true);
    }
  }

  const [acc_error, setAccError] = useState(false);

  const pay = ()=>{

    console.log(acc_number.length)

    if(acc_number.length < 8){
      setAccError(true);
    }else{
      setTimeout(()=>{
        setProcessComplete(true);
      }, 2500)
  
      setProcessingPayment(true);
    }
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
          <Text className =" text-md text-gray-700">{card.city}</Text>
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

            <TouchableWithoutFeedback className=' ' onPress={()=> OpenMessages(card, paid)} onPressIn={handlePressIn} onPressOut={handlePressOut}>
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

        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={() => setVisible(false)}
          >
            <View className="flex-1 justify-end bg-black/70">
                {processingPayment ? (
                  <View className='absolute bottom-0 w-auto left-0 right-0 bg-gray-200 rounded-t-3xl h-max '>
                      <View className=" flex flex-row justify-between">
                        {paymentComplete ? (
                          <Text className=" font-bold text-xl text-green-700 p-4">Processing complete</Text>
                        ) : (
                          <Text className=" font-bold text-xl p-4">Processing Payment</Text>
                        )}
                        <TouchableOpacity
                          onPress={() => setVisible(false)}
                          className=" p-4 rounded-lg"
                        >
                          <Text className="text-white font-bold"><Ionicons name="close" size={24} color="black" /></Text>
                        </TouchableOpacity>
                      </View>

                      {paymentComplete ? (
                        <Text className=" px-4 text-gray-500">
                          You have successfully purchased swipe credits of K{amount}.
                        </Text>
                      ) : (
                        <Text className=" px-4 text-gray-500">
                          Please wait as we process your payment.
                        </Text>
                      )}

                   

                      <View className=' py-10'>
                          {paymentComplete ? (
                            <View className=' flex flex-row justify-center'>
                                <View className=' bg-green-50 border-4 border-green-300 rounded-full w-32 h-32 flex flex-col justify-center'>
                                  <Text className=' text-center'>
                                    <Ionicons name="checkmark" size={55} color="green" />
                                  </Text>
                                </View>

                                
                                
                            </View>
                           
                          ) : (
                            <ActivityIndicator color={"cornflowerblue"} size={55}></ActivityIndicator>
                          )}
                          

                          {paymentComplete ? (
                            <View className=' mt-10'>
                              <View className=" my-4 mx-4">
                                <TouchableOpacity 
                                  className=" bg-gray-900 p-2 flex flex-row justify-center rounded-full" 
                                  onPress={()=> {setPaid(true); setVisible(false); setProcessComplete(true);}}
                                >
                                  <Text className=" font-semibold text-lg text-white">Done</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          ) : (
                            <View className=' mt-10'>
                              <View className=" my-4 mx-4">
                                <View 
                                  className=" bg-gray-300 p-2 flex flex-row justify-center rounded-full" 
                                >
                                  <Text className=" font-semibold text-lg text-gray-400">Done</Text>
                                </View>
                              </View>
                            </View>
                          )}
                      </View>

                  </View>
                ) : (
                  <View className=" w-full">
                    <View className=" absolute bottom-0 w-auto left-0 right-0 bg-gray-200 rounded-t-3xl h-max ">
                        <View className=" flex flex-row justify-between">
                          <Text className=" font-bold text-xl p-4">Payment Plan</Text>
                          <TouchableOpacity
                            onPress={() => setVisible(false)}
                            className=" p-4 rounded-lg"
                          >
                            <Text className="text-white font-bold"><Ionicons name="close" size={24} color="black" /></Text>
                          </TouchableOpacity>
                        </View>

                        <View className=" mb-4 pb-2 ">
                          {/* <Text className=" px-4 text-gray-700 font-semibold">Select a payment plan</Text> */}
                          <Text className=" px-4 text-gray-500">
                            You have used up all your swipe credits, select a payment plan to purchase more.
                          </Text>
                        </View>

                        <View className=' bg-white = rounded-t-3xl pt-2'>
                          {/* <Text className=" font-bold text-xl p-4"></Text> */}

                          <View className='  p-2 flex flex-row justify-between w-full'>
                            <Text className=" px-4 text-gray-700 font-semibold text-xl">Amount to pay</Text>
                            
                            <Text className=" px-4 text-gray-700 font-semibold text-xl">K{amount}</Text>

                          </View>

                          {plan == "Monthly" ? (
                            <View className=' px-4 flex flex-row justify-between'>
                              <TouchableOpacity onPress={()=>selectPlan("Monthly")} className=' w-1/2 px-1'>
                                <View className=' border-2 border-blue-200 rounded-xl bg-blue-50 p-4'>
                                  <Text className=' text-lg font-bold w-full text-center text-blue-500'>Monthly</Text>
                                </View>
                              </TouchableOpacity>

                              <TouchableOpacity onPress={()=>selectPlan("Weekly")} className=' w-1/2 px-1'>
                                <View className=' border-2 border-gray-100 rounded-xl bg-gray-50 p-4'>
                                  <Text className=' text-lg font-bold w-full text-center text-gray-500'>Weekly</Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <View className=' px-4 flex flex-row justify-between'>
                              <TouchableOpacity onPress={()=>selectPlan("Monthly")} className=' w-1/2 px-1'>
                                <View className=' border-2 border-gray-100 rounded-xl bg-gray-50 p-4'>
                                  <Text className=' text-lg font-bold w-full text-center text-gray-500'>Monthly</Text>
                                </View>
                              </TouchableOpacity>

                              <TouchableOpacity onPress={()=>selectPlan("Weekly")} className=' w-1/2 px-1'>
                                <View className=' border-2 border-blue-200 rounded-xl bg-blue-50 p-4'>
                                  <Text className=' text-lg font-bold w-full text-center text-blue-500'>Weekly</Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          )}

                          <View className=' p-2 mt-4'>
                            <Text className=' text-md font-bold w-full text-gray-500 px-4'>Mobile Money Account</Text>
                            <Text className=' text-sm w-full text-gray-400 px-4'>
                              Select your mobile money account to recieve a comfirmation message
                            </Text>

                          </View>







                          <View className=' px-4 flex flex-row justify-between'>
                            {network == "mtn" ? (
                              <TouchableOpacity onPress={()=> selectNetwork("mtn")} className=' w-4/12 px-1'>
                                <View className=' border-2 border-orange-200 rounded-xl bg-orange-50 p-4'>
                                  <Text className=' text-lg font-bold w-full text-center text-orange-400'>MTN</Text>
                                </View>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity onPress={()=>selectNetwork("mtn")} className=' w-4/12 px-1'>
                                <View className=' border-2 border-gray-200 rounded-xl bg-gray-50 p-4'>
                                  <Text className=' text-lg font-bold w-full text-center text-gray-400'>MTN</Text>
                                </View>
                              </TouchableOpacity>
                            )}
                            
                            {network == "airtel" ? (
                              <TouchableOpacity onPress={()=>selectNetwork("airtel")} className=' w-4/12 px-1'>
                                <View className=' border-2 border-red-200 rounded-xl bg-red-50 p-4 '>
                                  <Text className=' text-lg font-bold w-full text-center text-red-400'>Airtel</Text>
                                </View>
                              </TouchableOpacity>

                            ) : (
                              <TouchableOpacity onPress={()=>selectNetwork("airtel")} className=' w-4/12 px-1'>
                                <View className=' border-2 border-gray-200 rounded-xl bg-gray-50 p-4 '>
                                  <Text className=' text-lg font-bold w-full text-center text-gray-400'>Airtel</Text>
                                </View>
                              </TouchableOpacity>

                            )}
                            
                            {network == "zamtel" ? (
                              <TouchableOpacity onPress={()=>selectNetwork("zamtel")} className=' w-4/12 px-1'>
                                <View className=' border-2 border-green-200 rounded-xl bg-green-50 p-4'>
                                  <Text className=' text-lg font-bold w-full text-center text-green-500'>Zamtel</Text>
                                </View>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity onPress={()=>selectNetwork("zamtel")} className=' w-4/12 px-1'>
                                <View className=' border-2 border-gray-200 rounded-xl bg-gray-50 p-4'>
                                  <Text className=' text-lg font-bold w-full text-center text-gray-400'>Zamtel</Text>
                                </View>
                              </TouchableOpacity>
                            )}
                            
                          </View>
                            






                          


                            
                          <View className=' p-2 mt-4'>
                            <Text className=' text-md font-bold w-full text-gray-500 px-4'>Mobile Money Account</Text>
                           {acc_error ? (
                            <Text className=' text-sm w-full text-orange-400 px-4'>
                              Enter a valid account number
                            </Text>
                           ) : (
                            <Text className=' text-sm w-full text-gray-400 px-4'>
                              Enter your account number
                            </Text>
                           )}
                           

                          </View>

                          <View className=' p-2 px-4 flex flex-row'>
                            <View className=' w-4/12 border-2 bg-gray-100 border-gray-200 rounded-xl p-2'>
                              <Text className=' text-lg text-center font-bold w-full text-gray-500 px-4'>+260</Text>
                            </View>

                            <View className=' w-4/6 pl-1 '>
                              <View className=' w-full border-2 bg-gray-100 border-gray-200 rounded-xl '>
                                <View className=' py-1 w-full'>
                                  {setAccError ? (
                                    
                                      <TextInput
                                        value={acc_number}
                                        onChangeText={setNumber}
                                        placeholder="Enter account number"
                                        className=" w-full px-4 py-2 font-medium text-gray-500 border-orange-300 text-base"
                                      />
                                 
                                  ) : (
                                    <TextInput
                                      value={acc_number}
                                      onChangeText={setNumber}
                                      placeholder="Enter account number"
                                      className=" w-full px-4 py-2 font-medium text-gray-500 border-gray-300 text-base"
                                    />
                                  )}
                                </View>
                              </View>
                            </View>
                            

                          </View>



                          <View className=" my-4 mx-4">
                            <TouchableOpacity 
                              className=" bg-blue-500 p-2 flex flex-row justify-center rounded-full" 
                              onPress={()=> pay()}
                            >
                              <Text className=" font-semibold text-lg text-white">Proceed</Text>
                            </TouchableOpacity>
                          </View>
                            
                        </View>


                        
                        



                    </View>

                    
                      
                    </View>
                )}
           
            </View>
          </Modal>




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
