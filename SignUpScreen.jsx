import React, { useEffect, useState} from "react";
import { View, TextInput, Button, Text, ActivityIndicator, Switch, ScrollView,KeyboardAvoidingView, Platform, ImageBackground, Pressable  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

// ipaddress :  192.168.112.234
// let LoggedIn = false;

const SignupScreen = ()=>{
    let navigation = useNavigation();


    axios.get("http://192.168.226.234/textiepro/apis/index.php", { responseType: "text" })
      .then(res => console.log("✅ Got response:", res.data))
      .catch(err => console.log("❌ Error:", err.message, err));


    let [email, setEmail] = useState('');
    let [phone, setPhone] = useState('');
    let [password, setPassword] = useState('');
    let [username, setUsername] = useState('');

    let [formError, setFormError] = useState(false);
    let [backendResponse, setBResponse] = useState('');

    const sendData = async (email, password, phone_number) => {
        setIsLoadingSignup(true);
        console.log("sending")
        try {
          const res = await axios.post('http://192.168.226.234/textiepro/apis/index.php', {
            email: email,
            phone : phone_number,
            username : username,
            password: password
          });


          if(res.data == "error-1"){
            setFormError(true);
            setBResponse("Email cannot be empty");
          }else if(res.data == "error-2"){
            setFormError(true);
            setBResponse("Username cannot be empty");
          }else if(res.data == "error-3"){
            setFormError(true);
            setBResponse("Password cannot be empty");
          }else if(res.data == "success"){
            setFormError(false)
            setBResponse("");
            
            // store session
            await SecureStore.setItemAsync('token', 'false');
            navigation.navigate("MainLogin");
          }

        console.log(res.data)

          setIsLoadingSignup(false);
        } catch (err) {
          console.error("some error : ", err.message);
        }
    };



    // loading
    
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previous => !previous);

    const [isLoadingSignup, setIsLoadingSignup] = useState(false);

    const handleSubmit = () => {
      setIsLoadingSignup(true);
  
      // Simulate async signup (e.g., API call)
      setTimeout(() => {
        setIsLoadingSignup(false);
        alert('Signup complete for ' + email);
      }, 3000);
    };

    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const showDatepicker = () => {
      setShow(true);
    };
  
    const onChange = (event, selectedDate) => {
      if (Platform.OS === 'android') {
        setShow(false);
      }
  
      if (selectedDate) {
        setDate(selectedDate);
      }
    };
  
    return (
        <ImageBackground
          source={require('../assets/images/loginbg.jpg')} 
          resizeMode="cover"
          style={{ flex: 1 }}
        >
        <ScrollView className=" mt-0 p-1 pt-20">
        <KeyboardAvoidingView
        className="flex-1 z-0 pb-28"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
       
          <View className="mt-20 min-h-screen bg-white rounded-t-3xl shadow-lg">
              <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <Text className="text-blue-600 text-center text-3xl font-extrabold pt-10">Create Account</Text>
                <Text className="text-gray-400 text-center text-base font-medium mb-6">
                  Let’s get you started — it’s fast and easy
                </Text>

                {formError && (
                  <Text className="text-red-500 mx-6 my-2 rounded-lg border border-red-300 bg-red-50 text-center py-2 px-3 text-sm font-semibold">
                    {backendResponse}
                  </Text>
                )}

                <View className="px-6 space-y-5">
                  <TextInput
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    className="border border-gray-200 text-gray-800 bg-gray-50 p-4 rounded-xl"
                    placeholderTextColor="#9CA3AF"
                  />

                  {/* Phone Number Input */}
                  <View className="flex-row items-center border border-gray-200 bg-gray-50 p-3 rounded-xl">
                    <Text className="text-gray-700 font-medium pr-3">+260</Text>
                    <TextInput
                      placeholder="Phone Number"
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                      className="flex-1 text-gray-800"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>

                  <TextInput
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    className="border border-gray-200 text-gray-800 bg-gray-50 p-4 rounded-xl"
                    placeholderTextColor="#9CA3AF"
                  />

                  <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    className="border border-gray-200 text-gray-800 bg-gray-50 p-4 rounded-xl"
                    placeholderTextColor="#9CA3AF"
                  />

                  <View className="flex-row items-center space-x-2">
                    <Text className="text-gray-500 text-sm">
                      ✅ I agree to the terms of service
                    </Text>
                  </View>

                  {isLoadingSignup ? (
                    <ActivityIndicator size="large" color="#2563EB" />
                  ) : (
                    <Pressable
                      onPress={() => sendData(email, password, phone)}
                      className="bg-blue-600 py-4 rounded-xl shadow-sm active:opacity-80"
                    >
                      <Text className="text-white text-center font-semibold text-base">Sign Up</Text>
                    </Pressable>
                  )}

                  <Text className="text-center text-sm text-gray-500 pt-6 border-t border-gray-100">
                    Already have an account?
                    <Text
                      className="text-blue-600 font-semibold"
                      onPress={() => navigation.navigate("MainLogin")}
                    >
                      {" "}Login here
                    </Text>
                  </Text>
                </View>
              </ScrollView>
          </View>
          </KeyboardAvoidingView>
        </ScrollView>


    </ImageBackground>
    )
}

export default SignupScreen;