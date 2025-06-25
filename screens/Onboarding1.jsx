import React, { useEffect, useState} from "react";
import { View, TextInput, Button, Text,  ActivityIndicator, Switch, ScrollView, ImageBackground, Pressable  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

// let LoggedIn = false;

const OnboarsingScreen1 = ()=>{
    let navigation = useNavigation();

    const saveSession = async (token, user)=>{
        await SecureStore.setItemAsync('user_session', token);
        await SecureStore.setItemAsync('user_id',  JSON.stringify(user));
    }


    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');

    
    let [formError, setFormError] = useState(false);
    let [backendResponse, setBResponse] = useState('');

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previous => !previous);

    const handleSubmit = async ()=>{
        console.log("Login");
        try{
            const res = await axios.post('http://192.168.245.234/textiepro/apis/login.php', {
                email: email,
                password: password
            });

            if(res.data.status == "success"){
           

                let user_id = res.data.user_id;
                saveSession("true", user_id);

                setFormError(false);
                setBResponse("");

                navigation.navigate("Home");
                // alert(user_id)

            }else if(res.data == "error-1"){
                setFormError(true);
                setBResponse("No account found for this email");
            }else if(res.data == "wrong-password"){
                setFormError(true);
                setBResponse("Incorrect password");
            }else{
                setFormError(true);
                setBResponse("An unknown error occurred");
            }
            console.log(res.data);
        }catch(loginerror){
            console.log(loginerror)
        }
    };

    return (
        <ImageBackground
            source={require('../assets/images/models/model2.jpg')} // 👈 Replace with your image path
            resizeMode="cover"
            style={{ flex: 1 }}
        >
            <View className=" mt-20 p-2">
                <Text className=" text-white text-xl font-bold">
                    
                </Text>
            </View>

            <View className=" border bg-white mt-10 p-4">
               

            </View>

            <View className=" absolute bottom-28 w-full px-4">
                <Pressable android_ripple={{ color: '#222' }} onPress={()=>{}} className=" bg-black px-4 rounded-full text-center border p-4">
                    <Text className=" font-semibold text-center text-white text-xl">Login</Text>
                </Pressable>
            </View>
          
        </ImageBackground>
    )
}

export default OnboarsingScreen1;





