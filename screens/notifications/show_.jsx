import * as Notifications from "expo-notifications";
import axios from 'axios';
import { Platform } from 'react-native';
import React, { useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";

let server_api_base_url = "http://192.168.165.234/textiepro/apis/";

// Request notification permissions
async function requestPermissions() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    await Notifications.requestPermissionsAsync();
  }
}

// Set notification handler for iOS foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Push a single notification
async function Push(title, body){
    await requestPermissions();

    await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          data: { customData: "my-data" },
        },
        trigger: null, 
    });
}

// Fetch messages and send a notification for each
const fetchNotifications = async (user_id) => {
    try {
      const res = await axios.post(`${server_api_base_url}push_notifications.php`, {
        user_id: user_id
      });

      const messages = res.data;
      console.log(messages)
      for(let msg of messages){
        if(msg.username && msg.type === "message" && msg.length !== 0){
          await Push(msg.username, msg.message); // use actual message data
          console.log("Notification sent for:", msg);
        }else{
          
        }
      }
      
    } catch (fetchError) {
      console.log("fetchNotifications error:", fetchError);
    }
};

export async function showNotification(user_id) {
    const navigation = useNavigation();
    const responseListener = useRef();
    await fetchNotifications(user_id);
    
}

// Android channel setup
if (Platform.OS === "android") {
  Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
  });
}

