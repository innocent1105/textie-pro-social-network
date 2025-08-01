import React, { useEffect, useState, useRef} from "react";
import { View, Text, Button, Pressable, Platform , KeyboardAvoidingView, TextArea, Animated,ImageBackground, TouchableWithoutFeedback , TextInput, Image, StyleSheet, ActivityIndicator,TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';


import BottomNav from "./components/BottomNav";
import ChatUser from "./components/ChatUser";
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import Entypo from '@expo/vector-icons/Entypo';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

import {Country , State, City} from 'country-state-city';

const EditProfileScreen = ()=>{
    let navigation = useNavigation();

       
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

    const [fetchingData , setFetchData] = useState(true);
    const [myData, setMyData] = useState([]);
   



    const [isLoggedIn, setIsLoggedIn] = useState(null); 
    const [user_id , setUserId] = useState(null);

    console.log(user_id)
    let server_api_base_url = "http://192.168.8.234/textiepro/apis/";

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

    const [uploadedImage, setUploadedImage] = useState(false);
    const getUserData = async () => {
        const res = await axios.post(`${server_api_base_url}edit_profile.php`, {
          user_id: user_id, 
          request_type : "getUserData"
        });
        const data = res.data[0];

        console.log(res.data)

        setMyData(data);
        setUsername(data[1]);
        setFullname(data[2]);
        setEmail(data[3]);
        setphoneNumber(data[4]);
        setPP(`${server_api_base_url}profilepictures/${data[5]}`);
        setFetchData(false);
    };

    useEffect(() => {
        getToken();
        getUserId();
    }, []);
    
    useEffect(() => {
        if (user_id !== null) {
            getUserData();
        }
    }, [user_id]);
      
    useEffect(() => {
        if (isLoggedIn === "false") {
            navigation.navigate('Login');
        }
    }, [isLoggedIn]);

    useEffect(() => {
        
    }, []);
      

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setPP(`${result.assets[0].uri}`); 
            setUploadedImage(true)
            console.log(result.assets[0].uri)
        }
    };


 

    const [savingPDet, setSavingPDet] = useState(false);
    const savePersonalDetails = async () => {
        setSavingPDet(true)
        const userPersonalData = {
            user_id: user_id,
            request: "save-personal-data",
            data: {
                username: username,
                fullname: fullname,
                email: email,
                phoneNumber: phoneNumber
            }
        };
    
        const res = await axios.post(server_api_base_url + "update_personal_details.php", userPersonalData);
    
        if (res.data.status === "success") {
            setSavingPDet(false)
            console.log("Saved successfully!");
        } else {
            console.log("Error saving:", res.data.message);
        }
    };
    

    const [savingImage, setSavingImage] = useState(false);
    const SaveProfilePicture = async () =>{
        const formData = new FormData();

        setSavingImage(true);

        formData.append('user_id', user_id);
        formData.append('request_type', "save-pp");
        
        formData.append("image", {
            uri: pp,        
            type: "image/jpeg",   
            name: "profile.jpg",
        });

        const res = await axios.post(server_api_base_url + "save_profile_picture.php", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    
        console.log("Upload response:", res.data);
        if (res.data.status === "success") {
            setSavingImage(false);
            setUploadedImage(false);
        }
        
    }

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
      { label: 'Lusaka', value: 'male' },
      { label: 'Copperbelt', value: 'female' },
      { label: 'Other', value: 'other' },
    ]);

// COUNTRY
const [countryOpen, setCountryOpen] = useState(false);
const [selectedCountry, setSelectedCountry] = useState(null);
const [countryItems, setCountryItems] = useState([]);

// STATE / PROVINCE
const [stateOpen, setStateOpen] = useState(false);
const [selectedState, setSelectedState] = useState(null);
const [stateItems, setStateItems] = useState([]);

// CITY
const [cityOpen, setCityOpen] = useState(false);
const [selectedCity, setSelectedCity] = useState(null);
const [cityItems, setCityItems] = useState([]);

// Load countries once
useEffect(() => {
  const countries = Country.getAllCountries().map((country) => ({
    label: country.name,
    value: country.isoCode,
  }));
  setCountryItems(countries);
}, []);

// When country changes, load states
useEffect(() => {
  if (selectedCountry) {
    const states = State.getStatesOfCountry(selectedCountry).map((state) => ({
      label: state.name,
      value: state.isoCode,
    }));
    setStateItems(states);
    setSelectedState(null); // reset state/city
    setCityItems([]);
    setSelectedCity(null);
  }
}, [selectedCountry]);

// When state changes, load cities
useEffect(() => {
  if (selectedCountry && selectedState) {
    const cities = City.getCitiesOfState(selectedCountry, selectedState).map((city) => ({
      label: city.name,
      value: city.name,
    }));
    setCityItems(cities);
    setSelectedCity(null);
  }
}, [selectedState]);



       
    return (
        <View>
            <View className =" absolute right-0 left-0 border-b border-gray-200 p-4 pb-2 pt-12">
                <View className =" w-full flex flex-row justify-between gap-2">
                    <View className ="flex flex-row">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 pt-1">
                          <Entypo name="chevron-left" size={24} color="#0E3386" />
                      </TouchableOpacity>
                        <MaskedView
                            maskElement={
                                <View className="bg-transparent">
                                    <Text className="text-2xl font-bold text-black">Edit Profile</Text>
                                </View>
                            }
                            >
                            <LinearGradient
                                colors={['#1C39BB', '#1877F2']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="h-8"
                            >
                                <Text className="text-2xl font-bold opacity-0">Edit Profile</Text>
                            </LinearGradient>
                        </MaskedView>
                        
                    </View>
                    <View className="">
                        <TouchableOpacity onPress={()=>{navigation.navigate("Settings")}} className =" p-2 rounded-sm flex justify-center">
                            <Feather name="settings" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View className=" mt-24">
                  

                {fetchingData ? (
                    <View className=" bg-gray-100 p-2 pt-44 flex flex-row justify-center gap-2">
                        <ActivityIndicator></ActivityIndicator>
                        <Text className=" text-blue-500 font-bold text-center">Loading...</Text>
                    </View>
                ): (
                    <View>
                    <KeyboardAvoidingView
                        className=" pb-2"
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={90}
                    >
                    <ScrollView 
                        vertical
                        showsVerticalScrollIndicator={false}
                        className=" pb-10"
                    >
                    <View className=" bg-gray-200 py-2 px-4 flex flex-row justify-between gap-2">
                            <View className ="  flex flex-row justify-center p-1 border-4 border-gray-300 rounded-full ">
                                <Image
                                    source={{ uri: `${pp}` }}
                                    className="w-16 h-16 object-cover rounded-full"
                                />
                            </View>
                            <TouchableOpacity  onPress={() => pickImage()} className =" flex flex-1 flex-col-reverse pb-2 ">
                                <View className=" flex flex-row justify-end mx-1">
                                    <View className="">
                                        <FontAwesome name="camera" className=" " size={20} color="#444" />
                                    </View>
                                    <Text className=" font-bold mx-2 text-gray-700">Upload</Text>
                                </View>
                            </TouchableOpacity>
                            { uploadedImage ? (
                                <TouchableOpacity  onPress={() => SaveProfilePicture()} className =" flex flex-col-reverse">
                                    <View className=" p-2 px-6 flex flex-row rounded-md bg-gray-900">
                                        {savingImage ? (
                                            <ActivityIndicator className="" color={"#fff"}></ActivityIndicator>
                                        ) : (
                                            <Text className=" text-gray-300 font-bold">Save</Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <View></View>
                            )}
                           
                    </View>
                    
                   
                    

                    <View className=" p-2 px-4 mt-2">
                    <View className=" ">
                        <Text className=" font-bold mx-2 mt-4 text-lg">Personal Details</Text>
                    </View>
                            <View className=" my-2">
                                <Text className=" font-bold px-2 text-gray-500">Username</Text>
                                <View>
                                    <TextInput
                                        value={username}
                                        onChangeText={setUsername}
                                        placeholder="Enter your username"
                                        className=" bg-white rounded-md px-4 py-2 border border-gray-300 text-sm"
                                    ></TextInput>
                                </View>
                            </View>
                            
                            <View className=" my-1">
                                <Text className=" font-bold px-2 text-gray-500">Fullnames</Text>
                                <View>
                                    <TextInput
                                        value={fullname}
                                        onChangeText={setFullname}
                                        placeholder=""
                                        className=" bg-white rounded-md px-4 py-2 border border-gray-300 text-sm"
                                
                                    ></TextInput>
                                </View>
                            </View>
                            <View className=" my-1">
                                <Text className=" font-bold px-2 text-gray-500">Email</Text>
                                <View>
                                    <TextInput
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder=""
                                        className=" bg-white rounded-md px-4 py-2 border border-gray-300 text-sm"
                                
                                    ></TextInput>
                                </View>
                            </View>
                            <View className=" my-1">
                                <Text className=" font-bold px-2 text-gray-500">Phone Number</Text>
                                <View>
                                    <TextInput
                                        value={phoneNumber}
                                        onChangeText={setphoneNumber}
                                        placeholder=""
                                        className=" bg-white rounded-md px-4 py-2 border border-gray-300 text-sm"
                                
                                    ></TextInput>
                                </View>
                            </View>
                    
                            <View className=" flex flex-row justify-end my-2">
                                <TouchableOpacity onPress={() => savePersonalDetails()}>
                                    <View className=" p-2 px-6 rounded-md bg-gray-900">
                                        {savingPDet ? (
                                            <View>
                                                <ActivityIndicator color={"#fff"}></ActivityIndicator>
                                            </View>
                                        ) : (
                                            <Text className=" text-gray-300 font-bold">Save</Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </View>

                    </View>

                        <View className=" mb-20">
                            
                            <View className=" flex-1">
                            {fetchingData ? (
                                <View className="bg-gray-100 p-2 pt-44 flex flex-row justify-center gap-2">
                                <ActivityIndicator />
                                <Text className="text-blue-500 font-bold">Loading...</Text>
                                </View>
                            ) : (
                                <KeyboardAvoidingView
                                className="flex-1 "
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                keyboardVerticalOffset={100}
                                >
                                <ScrollView
                                    keyboardShouldPersistTaps="handled"
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ paddingBottom: 100 }}
                                >
                                
                                    <View className="px-4">
                                    <Text className="font-bold mx-2 mt-4 text-lg">Residence</Text>
                        
                                    <View className="my-2 z-30">
                                        <Text className="font-bold px-2 text-gray-500">Country</Text>
                                        <DropDownPicker
                                        open={countryOpen}
                                        value={selectedCountry}
                                        items={countryItems}
                                        setOpen={setCountryOpen}
                                        setValue={setSelectedCountry}
                                        setItems={setCountryItems}
                                        placeholder="Select a country"
                                        searchPlaceholder="Type to search countries..."
                                        searchable
                                        searchTextInputStyle={{
                                            borderColor: '#ccc',
                                            fontSize: 14,
                                            paddingVertical: 8,
                                            color: '#444',
                                        }}
                                        zIndex={3000}
                                        zIndexInverse={1000}
                                        style={{ borderColor: '#ccc' }}
                                        dropDownContainerStyle={{ borderColor: '#ccc' }}
                                        />
                                    </View>
                        
                                    <View className="my-2 z-20">
                                        <Text className="font-bold px-2 text-gray-500">Province</Text>
                                        <DropDownPicker
                                        open={stateOpen}
                                        value={selectedState}
                                        items={stateItems}
                                        setOpen={setStateOpen}
                                        setValue={setSelectedState}
                                        setItems={setStateItems}
                                        placeholder="Select a province"
                                        searchPlaceholder="Search Province"
                                        searchable
                                        searchTextInputStyle={{
                                            borderColor: '#ccc',
                                            fontSize: 14,
                                            paddingVertical: 8,
                                            color: '#444',
                                        }}
                                        disabled={!selectedCountry}
                                        zIndex={2000}
                                        zIndexInverse={2000}
                                        style={{ borderColor: '#ccc' }}
                                        dropDownContainerStyle={{ borderColor: '#ccc' }}
                                        />
                                    </View>
                        
                                    </View>
                                </ScrollView>
                                </KeyboardAvoidingView>
                            )}
                            </View>
                            
                        </View>
                    </ScrollView>
                    </KeyboardAvoidingView>

                    </View>
                )}    
                

            
            </View>
            
        </View>
    )
}

export default EditProfileScreen;