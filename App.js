import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import React, { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";

import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import MessagesScreen from './screens/MessagesScreen';
import MainLoginScreen from './screens/MainLoginScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignUpScreen';
import PostsScreen from './screens/PostsScreen';
import UploadPostScreen from "./screens/Upload";
import OpenPostScreen from './screens/OpenPostScreen';
import SwipeScreen from './screens/SwipeScreen';
import LikedUserScreen from './screens/LikedUser';
import ViewImageScreen from './screens/ViewImage';
import EditProfileScreen from './screens/EditProfile';
import SettingsScreen from './screens/SettingsScreen';
import OnboarsingScreen1 from './screens/Onboarding1';
import MatchingPref1 from './screens/MatchingPreferences';
import AgeRange from './screens/AgeRangeScreen';
import setAgeScreen from './screens/SetAgeScreen';
import FollowingScreen from './screens/Following';
import SwipedUsersScreen from './screens/SwipedUsers';
import StoriesScreen from './screens/Stories';
import NotificationsScreen from './screens/NotificationsScreen';
import MapScreen from './screens/Geolocation';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-gesture-handler'; 
import 'react-native-reanimated';
const Stack = createNativeStackNavigator();

export default function App() {
  const navigationRef = useRef();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        console.log("Notification tapped opeing:", data);

        if (data.userId) {
          navigationRef.current?.navigate("Notifications", {
            userId: data.user_id ? data.user_id : data.other_user
          });
        }
      }
    );

    return () => subscription.remove();
  }, []);





  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
          <Stack.Screen name="Home" options={{ unmountOnBlur: false }} component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="MainLogin" component={MainLoginScreen} />
          <Stack.Screen name="Onboard1" component={OnboarsingScreen1} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Posts" component={PostsScreen} />
          <Stack.Screen name="OpenPost" component={OpenPostScreen} />
          <Stack.Screen name="UploadPost" component={UploadPostScreen} />
          <Stack.Screen name="LikedUser" component={LikedUserScreen} />
          <Stack.Screen name="ViewImage" component={ViewImageScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Swipe" component={SwipeScreen} />
          <Stack.Screen name="MatchingPref1" component={MatchingPref1} />
          <Stack.Screen name="AgeRange" component={AgeRange} />
          <Stack.Screen name="SetAgeRange" component={setAgeScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Following" component={FollowingScreen} />
          <Stack.Screen name="Liked-users" component={SwipedUsersScreen} />
          <Stack.Screen name="Stories" component={StoriesScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen
            name="Chat"
            component={MessagesScreen}
            options={({ route }) => ({
              // You can customize header if needed based on route.params
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
