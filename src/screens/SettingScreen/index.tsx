import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Image,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { scale, typography } from '../../theme/typography';
import {
  about,
  contactsupport,
  edit,
  helpfaq,
  myorder,
  notification,
  notifications,
  password,
  privacypolicy,
  profile,
  tos,
} from '../../assets';
import { fontSizes, hp, wp } from '../../theme/responsive';
import { colors } from '../../theme/colors';
import CacheImage from '../../components/CacheImage';
import { useDispatch, useSelector } from 'react-redux';
import { capitalize } from '../../utils/utils';
import { getItem, removeItem, setItem } from '../../utils/localStorage';
import { resetUserState, updateUserStates } from '../../store/actions/UserActions';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import { useFocusEffect } from '@react-navigation/native';
import { deleteAccountApi, getProfileApi, logoutApi } from '../../store/services/Services';

const SettingScreen = ({ navigation }: any) => {
  const bottomTabNavigation = useNavigation<any>();
  const dispatch = useDispatch();
  const user = useSelector(state => state.userReducer.user);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getProfile();
    }, [])
  );

  const getProfile = async () => {
    try {
      const res = await getProfileApi();
      console.log("res", res)
      if (res?.id) {

        // 1️⃣ Redux update (merge old + new user data)
        dispatch(updateUserStates({
          user: {
            ...user,        // existing redux user
            ...res     // new profile data
          }
        }));
  
        // 2️⃣ AsyncStorage update (optional but recommended)
        const existingAuth = await getItem('key');
  
        if (existingAuth) {
          const updatedAuth = {
            ...existingAuth,
            user: {
              ...existingAuth.user,
              ...res
            }
          };
  
          await setItem('key', updatedAuth);
        }
        console.log("Profile updated successfully ✅");
      }
    } catch (error) {
      console.log('Profile error', error);
    }
  };

  // Web link handlers
  const openWebLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this URL');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open URL');
    }
  };

  // const handleLogout = () => {
  //   Alert.alert(
  //     "Confirm Logout",
  //     "Are you sure you want to log out?",
  //     [
  //       { text: "Cancel", style: "cancel" },
  //       {
  //         text: "Log Out",
  //         style: "destructive",
  //         onPress: async () => {
  //           try {
  //             // Use the new logout function with FCM token
  //             try {
  //               await deleteDeviceToken();
  //             } catch {}
  //             dispatch(setDeviceToken(null));
  //             dispatch(logout());
  //             const result = await logoutWithFCM();
  //             if (result.success) {
  //               console.log('✅ Logout successful');
  //             } else {
  //               console.error('❌ Logout failed:', result.error);
  //               // Even if API fails, local logout should still work
  //             }
  //           } catch (e) {
  //             console.log(e, "logout error");
  //           }
  //         },
  //       },
  //     ]
  //   );
  // };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
  
      const response = await deleteAccountApi();
      console.log("res", response)
  
      if (response?.success) {
        // Alert.alert('Success', 'Your account has been deleted');
  
        // Clear storage + redux
        await removeItem('key');
        dispatch(resetUserState());
  
        // Navigate
        navigation.reset({
          index: 0,
          routes: [{ name: 'WelcomeScreen' }],
        });
      } else {
        Alert.alert('Error', response?.message || 'Failed to delete account');
      }
  
    } catch (error) {
      console.log('Delete account error:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = () => {
    Alert.alert(
      'Confirm Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          // onPress: async () => {
          //   try {
          //     // Call the delete account API
          //     // const result = await deleteAccountAPI();
          //     // if (result.success) {
          //       Alert.alert('Success', 'Your account has been deleted');
          //       // Navigate to the welcome screen or login screen
          //       navigation.navigate('WelcomeScreen');
          //     // } 
          //     // else {
          //     //   Alert.alert('Error', result.error || 'Failed to delete account');
          //     // }
          //   } catch (error) {
          //     console.error('Error deleting account:', error);
          //     Alert.alert('Error', 'An unexpected error occurred');
          //   }
          // },
          onPress: handleDeleteAccount,
        },
      ]
    );
  };

  const logOutWithGoogle = async () => {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    console.log('logOutWithGoogle');
  };

  // const logout = async () => {
  //   // // if ( global.login === 'google' ) {
  //   // await logOutWithGoogle()
  //   // // }
  //   await removeItem('key')
  //   dispatch(resetUserState());
  //   removeItem('key');
  //   await logOutWithGoogle();
  //   // navigation.replace("Login");
  // }

  const logout = async () => {
    try {
      setLoading(true);
  
      // Call logout API (optional if backend requires)
      const data = await logoutApi({fcm_token: global.fcmToken});
      console.log("dat", data)

      // Google logout (if used)
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
  
      // Clear local storage
      await removeItem('key');
  
      // Reset redux
      dispatch(resetUserState());
  
      // Navigate to login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
  
    } catch (error) {
      console.log('Logout error:', error);
      Alert.alert('Error', 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {loading && (
              <View style={styles.loaderOverlay}>
                <ActivityIndicator size="large" color="#4CAF50" />
              </View>
            )}
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <CacheImage url={user.image != null ? user.image : require('../../assets/images/profilefill.png')} style={styles.profileImage} />
        <View style={{marginLeft:scale(1),flex:1}}>
          <Text style={[styles.itemTitle,{fontSize:fontSizes.fs22}]}>{capitalize(user.name)}</Text>
          <Text style={styles.itemEmail}>{user.email}</Text>
        </View>
        {/* <Pressable style={styles.editBtn}>
          <Text style={styles.editBtnText}>Edit</Text>
        </Pressable> */}
         <Pressable onPress={() => navigation.navigate('Profile')}>

        <Image source={edit} style={styles.editIcon} />
        </Pressable>
        </View>
      
      <View style={styles.divider} />
      {/* Account Section */}
      {/* <Text style={styles.sectionTitle}>Account</Text> */}
      <Pressable
        style={styles.item}
        onPress={() => navigation.navigate('AllOrdersScreen')}
      >
        <View style={styles.imageContainer}>
          <Image source={myorder} style={styles.itemIcon} />
        </View>
        <View>
          <Text style={styles.itemTitle}>My Orders</Text>
          <Text style={styles.itemDesc}>Your active and history of orders</Text>
        </View>
      </Pressable>

      <View style={styles.divider} />

      {/* Preferences Section */}
      <Text style={styles.sectionTitle}>Preferences</Text>
      <Pressable
        style={styles.item}
        onPress={() => navigation.navigate('NotificationScreen')}
      >
        <View style={styles.imageContainer}>
          <Image source={notification} style={styles.itemIcon} />
        </View>
        <View>
          <Text style={styles.itemTitle}>Notifications</Text>
          <Text style={styles.itemDesc}>Manage your notification settings</Text>
        </View>
      </Pressable>
      <Pressable
        style={styles.item}
        onPress={() => navigation.navigate('AddressListScreen')}
      >
        <View style={styles.imageContainer}>
          <Image source={tos} style={styles.itemIcon} />
        </View>
        <View>
          <Text style={styles.itemTitle}>Address</Text>
          <Text style={styles.itemDesc}>Manage your addresses</Text>
        </View>
      </Pressable>
      <View style={styles.divider} />
      <Pressable
        style={styles.item}
        onPress={() => navigation.navigate('ChangePasswordScreen')}
      >
        <View style={styles.imageContainer}>
          <Image source={password} style={styles.itemIcon} />
        </View>
        <View>
          <Text style={styles.itemTitle}>Password</Text>
          <Text style={styles.itemDesc}>Change your password</Text>
        </View>
      </Pressable>

      <View style={styles.divider} />

      {/* Support Section */}
      <Text style={styles.sectionTitle}>Support</Text>
      <Pressable
        style={styles.item}
        onPress={() => openWebLink('https://kargodelivers.com/FAQs')}
      >
        <View style={styles.imageContainer}>
          <Image source={helpfaq} style={styles.itemIcon} />
        </View>
        <View>
          <Text style={styles.itemTitle}>Help & FAQ</Text>
          <Text style={styles.itemDesc}>Find answers to common questions</Text>
        </View>
      </Pressable>
      <View style={styles.divider} />
      <Pressable
        style={styles.item}
        onPress={() => openWebLink('https://kargodelivers.com/support')}
      >
        <View style={styles.imageContainer}>
          <Image source={contactsupport} style={styles.itemIcon} />
        </View>
        <View>
          <Text style={styles.itemTitle}>Contact Support</Text>
          <Text style={styles.itemDesc}>Contact our support team directly</Text>
        </View>
      </Pressable>
      <View style={styles.divider} />

      <Pressable
        style={styles.item}
        onPress={() =>
          openWebLink('https://kargodelivers.com/terms-and-conditions')
        }
      >
        <View style={styles.imageContainer}>
          <Image source={tos} style={styles.itemIcon} />
        </View>
        <View>
          <Text style={styles.itemTitle}>Terms of Service</Text>
          <Text style={styles.itemDesc}>View our terms of service</Text>
        </View>
      </Pressable>
      <View style={styles.divider} />
      <Pressable
        style={styles.item}
        onPress={() => openWebLink('https://kargodelivers.com/privacy-policy')}
      >
        <View style={styles.imageContainer}>
          <Image source={privacypolicy} style={styles.itemIcon} />
        </View>
        <View>
          <Text style={styles.itemTitle}>Privacy Policy</Text>
          <Text style={styles.itemDesc}>Read our privacy policy</Text>
        </View>
      </Pressable>
      <View style={styles.divider} />
      <Pressable
        style={styles.item}
        onPress={() => openWebLink('https://kargodelivers.com/how-it-works')}
      >
        <View style={styles.imageContainer}>
          <Image source={about} style={styles.itemIcon} />
        </View>
        <View>
          <Text style={styles.itemTitle}>About</Text>
          <Text style={styles.itemDesc}>Learn more about the app</Text>
        </View>
      </Pressable>
      <View style={styles.divider} />
      <Pressable style={styles.item} onPress={deleteAccount}>
        <View style={styles.imageContainer}>
          <Image source={about} style={styles.itemIcon} />
        </View>
        <View>
          <Text style={styles.itemTitle}>Delete Account</Text>
          <Text style={styles.itemDesc}>Delete your account permanently</Text>
        </View>
      </Pressable>
      <View style={styles.divider} />
      <Pressable style={styles.item} onPress={logout}>
        <View style={styles.imageContainer}>
          <Image source={about} style={styles.itemIcon} />
        </View>
        <View>
          <Text style={styles.itemTitle}>Logout</Text>
          <Text style={styles.itemDesc}>Logout this app</Text>
        </View>
      </Pressable>
    </ScrollView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff96',
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // semi-transparent
    zIndex: 999,
  },
  contentContainer: {
    padding: 15,
  },

  editIcon:{
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:10,
    marginBottom:hp('2')

  },
  profileImage:{
    width: 80,
    height:80,
    resizeMode: 'contain',
    borderRadius: wp('100'),
  },
  sectionTitle: {
    fontSize: fontSizes.fs20,
    fontFamily: typography.fontFamily.Medium,
    marginTop: scale(5),
    marginBottom: scale(0.5),
    color: '#222',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    marginLeft: scale(0.5),
  },
  itemTitle: {
    fontSize: fontSizes.fs15,
    // fontSize:scale(18),
    fontWeight: '500',
    color: 'rgba(40, 42, 46, 1)',
    fontFamily: typography.fontFamily.Medium,
  },
  itemDesc: {
    fontSize: fontSizes.fs15,
    // fontSize:scale(15),
    color: '#888',
    marginTop: scale(0.5),
    fontFamily: typography.fontFamily.Regular,
  },
  itemEmail: {
    fontSize: fontSizes.fs15,
    color: '#888',
    marginTop: hp(0.5),
    fontFamily: typography.fontFamily.Regular,
  },
  imageContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary.secondary1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3'),
  },
  itemIcon: {
    width: 23,
    height: 23,
    resizeMode: 'contain',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: scale(1),
  },
});
