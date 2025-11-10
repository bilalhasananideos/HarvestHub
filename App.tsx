import {Image, StyleSheet, Text, View} from 'react-native';
import React, { useEffect, useState } from 'react';
import RootNavigator from './src/navigations/rootNavigator';
import { logo } from './src/assets';
const App = () => {
    const [splashVisible,setSplashVisible]=useState(true);
      useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);
  let Splash_Screen = (

    <View style={styles.splash}>  
      <Image source={logo} style={styles.logo} /> 
    {/* <ImageBackground
      source={Splash}
      resizeMode="cover"
      style={styles.splash}></ImageBackground> */}
      </View>
  );
  return splashVisible?Splash_Screen:<RootNavigator />;
};

export default App;

const styles = StyleSheet.create({
    splash:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  logo:{
    height:200,  
    width:200,
    resizeMode:'contain'
  }
});
