import React, { useEffect, useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { color } from '../config/color';
import { CustomHeader } from '../components/CustomHeader';
import { bag, bagfill, home, homeFill, message, messagefill, profile, profilefill, search, searchfill,  } from '../assets';
import { TextStyle } from 'react-native';
import SettingScreen from '../screens/SettingScreen';
import Home from '../screens/HomeScreen/Home';
import Profile from '../screens/Profile';
import ChatScreen from '../screens/ChatScreen';



const Tab = createBottomTabNavigator();

const tabarComponent = (
  activeImage: ImageSourcePropType,
  unActiveImage: ImageSourcePropType,
  title: string,
) => {
  return {
    tabBarIcon: ({ focused }: { focused: boolean }) => (
      <View style={styles.iconContainer}>
        <Image
          style={[
            styles.imgstyle,
          ]}
          source={focused ? activeImage : unActiveImage}
        />
        <Text style={tabarTitle(focused)}>{title}</Text>
      </View>
    ),
    tabBarLabel: () => null, // hide default label
  };
};

function MybottomTabs() {
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
        tabBarActiveTintColor: color.black,
        tabBarInactiveTintColor: 'transparent',
        headerShown: false,
        tabBarHideOnKeyboard: true,
        swipeEnabled: true,
        animationEnabled: true,
        tabBarStyle: {
          width: wp('100'),
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          paddingHorizontal:wp('5'),
        },
        header: ({ route: headerRoute }: { route: { name: string } }) => (
          <CustomHeader title={headerRoute.name} />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          ...tabarComponent(homeFill, home, 'Home'),
          headerShown: false,
        }}
      />
        <Tab.Screen
          name="Profile2"
          component={ChatScreen}
          options={{
            ...tabarComponent(messagefill, message, 'Chat'),
            headerShown: true,
          }}
        />
  

      <Tab.Screen
        name="Profile3"
        component={Profile} 
        options={{
          ...tabarComponent(bagfill, bag, 'Cart'),
        }}
      />
      <Tab.Screen
        name="My Profile"
        component={SettingScreen}
        options={{
          ...tabarComponent(  profilefill, profile, 'Profile'),
          headerShown: true,

        }}
      />
    </Tab.Navigator>
  );
}
export default MybottomTabs;

const tabarTitle = (focused: boolean): TextStyle => ({
  fontSize: 12,
  fontWeight: '500',
  color: focused ? 'rgba(119, 128, 101, 1)' : 'white',
  marginTop:2
});

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: wp('15'),
  },
  imgstyle: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
