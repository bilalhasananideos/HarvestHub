import { Platform, StyleSheet, TouchableOpacity ,} from "react-native";
import React, {JSX} from 'react';
import { View ,Text} from "react-native";
import { fontSizes, hp } from "../theme/responsive";
import { typography } from "../theme/typography";
import { colors } from "../theme/colors";

export const CustomHeader = ({
    title,
    leftButton,
    rightButton,
  }: {
    title: string;
    leftButton?: JSX.Element;
    rightButton?: JSX.Element;
  }) => {
    return (
      <View  style={styles.header} >
        <View style={styles.headerContent}>
          {leftButton && (
            <TouchableOpacity style={styles.leftButton}>
              {leftButton}
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>{title}</Text>
          {rightButton && (
            <TouchableOpacity style={styles.rightButton}>
              {rightButton}
            </TouchableOpacity>
          )}
        </View> 
      </View>
    );
  };


  const styles = StyleSheet.create({
    header: {
        height: hp(Platform.OS === 'ios' ? '12' : '9'),
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
        paddingBottom: 10,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 1)',
      },
      headerTitle: {
        color: 'rgba(40, 42, 46, 1)',
        fontSize: fontSizes.fs20,
        // fontSize: scale(20),
        fontFamily:typography.fontFamily.Medium
        
      },
      headerContent: {
        width: '100%',
        alignItems: 'center',
      },
      leftButton: {
        position: 'absolute',
        left: 0,
        top:0,
        zIndex: 1000,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
      },
    
      rightButton: {
        position: 'absolute',
        right: 0,
        top:0,
        zIndex: 1000,
      },
  });
  