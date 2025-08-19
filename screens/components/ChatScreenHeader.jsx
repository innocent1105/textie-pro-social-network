// components/ChatScreenHeader.js
import React from 'react';
import { View, Text, Image, Pressable, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Good practice for custom headers
import MaterialIcons from "@expo/vector-icons/MaterialIcons";


const ChatScreenHeader = ({ Chat }) => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
  
    const { username, image } = Chat;
  // Access screen params

  const userDetails = (id) => {
    alert(`User ID: ${id}`);
  };

  // Adjust paddingTop to account for status bar/notch
  const paddingTop = Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0;

  return (
    <View
      style={{
        backgroundColor: 'white',
        paddingTop: paddingTop ,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingBottom: 15,
        paddingTop: 45, // A bit of padding at the bottom
        borderBottomWidth: 2,
        borderBottomColor: '#eee',
        shadowColor: '#000', // For shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
        position : 'absolute',
        elevation: 3, // For Android shadow
      }}
      className=" absolute top-0"
    >
      {/* Back button (optional, if you want one) */}
      <Pressable onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
        <MaterialIcons name="arrow-back" size={24} color="#B0C4DE" />
      </Pressable>

      <Image
        style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
        source={{ uri: `http://192.168.112.234/textiepro/apis/profilepictures/default-pp.png` }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>{username}</Text>
        <Text style={{ fontSize: 12, color: 'green' }}>Online</Text>
      </View>
      <Pressable onPress={() => userDetails(userId)} style={{ padding: 5 }}>
        <MaterialIcons name="menu" size={22} color="#B0C4DE" />
      </Pressable>
    </View>
  );
};

export default ChatScreenHeader;

