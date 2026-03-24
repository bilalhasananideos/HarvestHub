// import {
//   Image,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   TextInput,
//   Alert,
// } from 'react-native';
// import React, { useState } from 'react';
// import CacheImage from '../../components/CacheImage';
// import { camera,   } from '../../assets';


// import { fontSizes, hp } from '../../theme/responsive';
// import { colors } from '../../theme/colors';

// import { useNavigation } from '@react-navigation/native';
// import { useDispatch, useSelector } from 'react-redux';
// import { capitalize } from '../../utils/utils';

// const Profile = () => {
//   const navigation = useNavigation<any>();
//   const dispatch = useDispatch();
//   const user = useSelector(state => state.userReducer.user);

//   const [editing, setEditing] = useState(false);
//   const [nameDraft, setNameDraft] = useState(''); 


//   const onSaveProfile = async () => {
//     if (nameDraft.trim().length === 0) {
//       Alert.alert('Error', 'Please enter your full name');
//       return;
//     }
//   }


//   const onDeleteAccount = async () => {
//     Alert.alert(
//       'Delete Account',
//       'Are you sure you want to delete your account? This action cannot be undone.',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Delete', style: 'destructive', onPress: async () => {
//           try {
//             // setDeleting(true);
//             // const res = await deleteAccount();
//             // console.log(res, 'res11');
//             // if (res.success) {
//               // Clear auth and navigate to Auth stack
//               // dispatch(signOut());
//             // } else {
//             //   Alert.alert('Error', (res as any).error || 'Failed to delete account');
//             // }
//           } catch (e: any) {
//             Alert.alert('Error', e?.message || 'Failed to delete account');
//           } finally {
//             // setDeleting(false);
//           }
//         } },
//       ]
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.avatarContainer}>
//         <CacheImage url={
//           // fallbackUser?.avatarUrl || 
//           'https://randomuser.me/api/portraits/men/1.jpg'} style={styles.avatar} />
//         <TouchableOpacity style={styles.cameraIconWrap} >
//           <View style={styles.cameraIconCircle}>
//             <Image source={camera} style={styles.cameraIconImg} />
//           </View>
//         </TouchableOpacity>
//       </View>
//       <View style={styles.inputCard}>
//         <Text style={styles.label}>Full name</Text>
//         <View style={styles.inputRow}>
//           <TextInput
//             style={styles.input}
//             value={editing ? nameDraft : `${capitalize(user.name)}`}
//             onChangeText={setNameDraft}
  
//           />
//           {editing ? (
//             <TouchableOpacity style={styles.editBtn} onPress={onSaveProfile} >
//               <Text style={styles.editText}>{'Sign in to save'}</Text>
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)} >
//               <Text style={styles.editText}>{'Edit'}</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//       <View style={styles.inputCard}>
//         <Text style={styles.label}>E-mail address</Text>
//         <View style={styles.inputRow}>
//           <TextInput
//             style={styles.input}
//             // value={emailFromAuth || ''}
//             value={`${user.email}`}
//             editable={false}
//           />
//         </View>
//       </View>

     
//     </View>
//   );
// };

// export default Profile;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     paddingTop: 32,
//   },
//   avatarContainer: {
//     alignItems: 'center',
//     marginBottom: 32,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,

//     elevation: 5,
//   },
//   avatar: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#eee',
//   },
//   cameraIconWrap: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//   },
//   cameraIconCircle: {
//     backgroundColor: '#FFD44A',
//     borderRadius: 18,
//     width: 36,
//     height: 36,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   cameraIconImg: {
//     width: 30,
//     height: 30,
//     resizeMode: 'contain',
//   },
//   inputCard: {
//     width: '88%',
//     backgroundColor: 'transparent',
//     borderRadius: 12,
//     paddingHorizontal: 0,
//     paddingVertical: 0,
//     marginBottom: 18,
//     alignSelf: 'center',
//     shadowColor: 'transparent',
//     shadowOpacity: 0,
//     shadowRadius: 0,
//     elevation: 0,
//   },
//   label: {
//     color: '#888',
//     fontSize: 13,
//     marginBottom: 6,
//     fontWeight: '500',
//   },
//   inputRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#E5E5E5',
//     borderRadius: 8,
//     backgroundColor: '#fff',
//     paddingHorizontal: 12,
//     paddingVertical: 0,
//     height: 44,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#1B334F',
//     backgroundColor: 'transparent',
//     paddingVertical: 0,
//     fontWeight: '500',
//     height: 44,
//   },
//   editBtn: {
//     marginLeft: 8,
//     paddingHorizontal: 0,
//     paddingVertical: 0,
//     height: 44,
//     justifyContent: 'center',
//   },
//   editText: {
//     color: '#888',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   deleteBtn: {
//     position:'absolute',
//     bottom:40,
//     left:30,
//     flexDirection: 'row',
//     alignItems: 'center',
//     alignSelf: 'center',
//     gap:5,
//   },

//   deleteText: {
//     color: colors.text.primary,
//     fontSize: fontSizes.fs16,
//     textAlign:'center',
//     marginTop:hp('0.5')
//   },
//   icon:{
//     width:20,
//     height:20,
//     resizeMode:'contain',
//   }
// });

// // import React, { useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   Image,
// //   StyleSheet,
// //   Alert,
// // } from 'react-native';
// // import { useDispatch, useSelector } from 'react-redux';
// // // import ImagePicker from 'react-native-image-crop-picker';
// // // import { profileUpdateApi } from '../services/profileApi';
// // // import { setUser } from '../redux/userSlice';
// // import { profileUpdateApi } from '../../store/services/Services';

// // const EditProfile = ({ navigation }: any) => {
// //   const dispatch = useDispatch();
// //   const user = useSelector((state: any) => state.userReducer.user);

// //   const [name, setName] = useState(user?.name || '');
// //   const [phone, setPhone] = useState(user?.phone || '');
// //   const [image, setImage] = useState(user?.avatar || '');
// //   const [loading, setLoading] = useState(false);

// //   const pickImage = async () => {
// //     try {
// //       const res = await ImagePicker.openPicker({
// //         width: 300,
// //         height: 300,
// //         cropping: true,
// //       });

// //       setImage(res.path);
// //     } catch (error) {
// //       console.log(error);
// //     }
// //   };

// //   const onUpdate = async () => {
// //     if (!name.trim()) {
// //       Alert.alert('Error', 'Name required');
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       const formData = new FormData();

// //       formData.append('name', name);
// //       formData.append('phone', phone);

// //       if (image && !image.startsWith('http')) {
// //         formData.append('avatar', {
// //           uri: image,
// //           type: 'image/jpeg',
// //           name: 'profile_user.jpg',
// //         } as any);
// //       }

// //       const res = await profileUpdateApi(formData);

// //       if (res?.success) {
// //         // dispatch(setUser(res.data));
// //         Alert.alert('Success', 'Profile Updated');
// //         navigation.goBack();
// //       } else {
// //         Alert.alert('Error', 'Update failed');
// //       }
// //     } catch (error: any) {
// //       Alert.alert('Error', error?.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <TouchableOpacity onPress={pickImage}>
// //         <Image
// //           source={{ uri: image }}
// //           style={styles.avatar}
// //         />
// //       </TouchableOpacity>

// //       <TextInput
// //         value={name}
// //         onChangeText={setName}
// //         placeholder="Full Name"
// //         style={styles.input}
// //       />

// //       <TextInput
// //         value={phone}
// //         onChangeText={setPhone}
// //         placeholder="Phone"
// //         style={styles.input}
// //       />

// //       <TextInput
// //         value={user?.email}
// //         editable={false}
// //         style={[styles.input, { backgroundColor: '#f2f2f2' }]}
// //       />

// //       <TouchableOpacity style={styles.btn} onPress={onUpdate}>
// //         <Text style={styles.btnText}>
// //           {loading ? 'Updating...' : 'Update Profile'}
// //         </Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // export default EditProfile;

// // const styles = StyleSheet.create({
// //   container: { flex: 1, padding: 20 },
// //   avatar: {
// //     width: 120,
// //     height: 120,
// //     borderRadius: 60,
// //     alignSelf: 'center',
// //     marginBottom: 20,
// //   },
// //   input: {
// //     borderWidth: 1,
// //     borderColor: '#ddd',
// //     borderRadius: 8,
// //     padding: 12,
// //     marginBottom: 15,
// //   },
// //   btn: {
// //     backgroundColor: '#FFD44A',
// //     padding: 14,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //   },
// //   btnText: {
// //     fontWeight: '600',
// //   },
// // });


// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import { useSelector } from 'react-redux';
// import * as ImagePicker from 'react-native-image-crop-picker';

// const Profile = () => {
//   const user = useSelector((state: any) => state.userReducer.user);

//   const [name, setName] = useState(user?.name || '');
//   const [phone, setPhone] = useState(user?.phone || '');
//   const [image, setImage] = useState(user?.avatar || null);
//   const [hasChanged, setHasChanged] = useState(false);

//   useEffect(() => {
//     if (
//       name !== user?.name ||
//       phone !== user?.phone ||
//       image !== user?.avatar
//     ) {
//       setHasChanged(true);
//     } else {
//       setHasChanged(false);
//     }
//   }, [name, phone, image]);

//   const pickImage = async () => {
//     try {
//       const res = await ImagePicker.openPicker({
//         width: 300,
//         height: 300,
//         cropping: true,
//       });

//       setImage(res.path);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const onUpdateProfile = () => {
//     if (!name.trim()) {
//       Alert.alert('Error', 'Name is required');
//       return;
//     }

//     Alert.alert('Success', 'Profile Updated');
//     // Yahan API call karni hai
//   };

//   return (
//     <View style={styles.container}>
      
//       {/* Profile Image */}
//       <TouchableOpacity onPress={pickImage}>
//         <Image
//           source={
//             image
//               ? { uri: image }
//               : require('../../assets/images/profile_user.jpg') // default image
//           }
//           style={styles.avatar}
//         />
//       </TouchableOpacity>

//       {/* Name */}
//       <Text style={styles.label}>Full Name</Text>
//       <TextInput
//         value={name}
//         onChangeText={setName}
//         style={styles.input}
//         placeholder="Enter your name"
//       />

//       {/* Phone */}
//       <Text style={styles.label}>Phone</Text>
//       <TextInput
//         value={phone}
//         onChangeText={setPhone}
//         style={styles.input}
//         placeholder="Enter phone number"
//         keyboardType="phone-pad"
//       />

//       {/* Email (Not Editable) */}
//       <Text style={styles.label}>Email</Text>
//       <TextInput
//         value={user?.email}
//         editable={false}
//         style={[styles.input, { backgroundColor: '#f2f2f2' }]}
//       />

//       {/* Update Button */}
//       <TouchableOpacity
//         style={[
//           styles.button,
//           { backgroundColor: hasChanged ? '#FFD44A' : '#ccc' },
//         ]}
//         disabled={!hasChanged}
//         onPress={onUpdateProfile}
//       >
//         <Text style={styles.buttonText}>Update Profile</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default Profile;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   avatar: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     alignSelf: 'center',
//     marginBottom: 30,
//   },
//   label: {
//     marginBottom: 5,
//     fontSize: 14,
//     color: '#555',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 20,
//   },
//   button: {
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   buttonText: {
//     fontWeight: '600',
//   },
// });



import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import { profileUpdateApi } from '../../store/services/Services';
// import { setUser } from '../../store/slices/userSlice'; // adjust path
import { colors } from '../../theme/colors';
import CacheImage from '../../components/CacheImage';
import { camera } from '../../assets';
import Toast from 'react-native-toast-message';

const Profile = () => {
  const dispatch = useDispatch();
  const phoneRef = useRef(null);
  
  const user = useSelector((state: any) => state.userReducer.user);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [image, setImage] = useState(user?.image || '');
  const [loading, setLoading] = useState(false);

  const [sheetVisible, setSheetVisible] = useState(false);  
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
  });

  // 🔥 Detect Changes
  const hasChanged = useMemo(() => {
    return (
      name !== user?.name ||
      phone !== user?.phone ||
      image !== user?.image
    );
  }, [name, phone, image, user]);

  const formatPhone = (text) => {
    // sirf numbers allow
    let cleaned = text.replace(/\D/g, '');
  
    // max 10 digits (US number without +1)
    if (cleaned.length > 10) cleaned = cleaned.slice(0, 10);
  
    return cleaned;
  };

  const validate = () => {
    let obj = {};
  
    if (!name.trim()) {
      obj.name = "Full name is required";
    }
  
    if (!phone) {
      obj.phone = "Phone number is required";
    } else if (phone.length !== 10) {
      obj.phone = "Phone must be 10 digits";
    }
  
    setErrors(obj);
    return Object.keys(obj).length === 0;
  };

  // 📷 Pick Image
  const pickImage = async () => {
    try {
      const res = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
      });

      setImage(res.path);
    } catch (err) {
      console.log('Image pick cancelled');
    }
  };

  const openCamera = async () => {
    try {
      const res = await ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: true,
      });
  
      setImage(res.path);
      setSheetVisible(false);
    } catch (err) {
      console.log('Camera cancelled');
    }
  };
  
  const openGallery = async () => {
    try {
      const res = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
      });
  
      setImage(res.path);
      setSheetVisible(false);
    } catch (err) {
      console.log('Gallery cancelled');
    }
  };

  const onUpdateProfile = async () => {

    if (!validate()) return;
  
    try {
      setLoading(true);
  
      const formData = new FormData();
      formData.append('name', name);
  
      // ✅ API ko clean number bhejna (no +1, no dash)
      formData.append('phone', phone);
  
      if (image && !image.startsWith('http')) {
        formData.append('image', {
          uri: image,
          type: 'image/jpeg',
          name: 'profile_user.jpg',
        });
      }
  
      const res = await profileUpdateApi(formData);
  
      if (res?.message === 'Profile updated successfully') {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Profile updated successfully',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res?.message || 'Update failed',
        });
      }
  
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    // <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : -280}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >      
      {/* Avatar Section */}
      {/* <View style={styles.avatarWrapper}>
        <Image
          source={
            image
              ? { uri: image }
              : require('../../assets/images/profile_user.jpg')
          }
          style={styles.avatar}
        />

        <TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
          <Text style={{ color: '#fff', fontSize: 12 }}>Edit</Text>
        </TouchableOpacity>
      </View> */}
      <View style={styles.avatarContainer}>
      <Image
          source={
            image
              ? { uri: image }
              : require('../../assets/images/profile_user.jpg')
          }
          style={styles.avatar}
        />
        {/* <CacheImage url={
          // fallbackUser?.avatarUrl || 
          'https://randomuser.me/api/portraits/men/1.jpg'} style={styles.avatar} /> */}
          <TouchableOpacity
  onPress={() => setSheetVisible(true)}
  style={styles.cameraIconWrap}
>
        {/* <TouchableOpacity onPress={pickImage} style={styles.cameraIconWrap} > */}
          <View style={styles.cameraIconCircle}>
            <Image source={camera} style={styles.cameraIconImg} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Full Name */}
      <View style={styles.inputCard}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter full name"
          style={styles.input}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType='next'
          blurOnSubmit={false}
          onSubmitEditing={() => phoneRef.current?.focus()}
        />
        {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}
      </View>

      {/* Email (Non Editable) */}
      <View style={styles.inputCard}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={user?.email}
          editable={false}
          style={[styles.input, { backgroundColor: '#f3f3f3' }]}
        />
      </View>

      {/* Phone */}
      <View style={styles.inputCard}>
        <Text style={styles.label}>Phone</Text>
        <TextInput
          ref={phoneRef}
          value={phone}
          // onChangeText={setPhone}
          onChangeText={(text) => {
            const formatted = formatPhone(text);
            setPhone(formatted);
            setErrors({ ...errors, phone: '' });
          }}
          // placeholder="Enter phone number"
          // keyboardType="phone-pad"
          placeholder="+1 1234567890"
    keyboardType="number-pad"
          // style={styles.input}
          style={[
            styles.input,
            errors.phone && { borderColor: 'red' }
          ]}
          maxLength={15}
          autoCorrect={false}
          returnKeyType='done'
          blurOnSubmit={false}
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        {errors.phone ? <Text style={styles.error}>{errors.phone}</Text> : null}
      </View>

      {/* Update Button */}
      <TouchableOpacity
        style={[
          styles.updateBtn,
          { backgroundColor: hasChanged ? colors.primary.main : '#ccc' },
        ]}
        disabled={!hasChanged || loading}
        onPress={onUpdateProfile}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.updateText}>Update Profile</Text>
        )}
      </TouchableOpacity>

      </ScrollView>
      <Modal
  visible={sheetVisible}
  transparent
  animationType="slide"
>
  <Pressable
    style={styles.sheetOverlay}
    onPress={() => setSheetVisible(false)}
  />

  <View style={styles.bottomSheet}>
    <Text style={styles.sheetTitle}>Choose Option</Text>

    <TouchableOpacity style={styles.sheetBtn} onPress={openCamera}>
      <Text style={styles.sheetText}>Camera</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.sheetBtn} onPress={openGallery}>
      <Text style={styles.sheetText}>Gallery</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.sheetBtn, { backgroundColor: '#eee' }]}
      onPress={() => setSheetVisible(false)}
    >
      <Text style={styles.sheetText}>Cancel</Text>
    </TouchableOpacity>
  </View>
</Modal>
      </KeyboardAvoidingView>
    // </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    // justifyContent: 'center',
  },
  
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 35,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
  },

  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 120 / 4,
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
  },
  cameraIconWrap: {
    position: 'absolute',
    bottom: -10,
    right: '35%',
  },
  cameraIconCircle: {
    backgroundColor: '#FFD44A',
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  cameraIconImg: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },

  inputCard: {
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    color: '#888',
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
    color: '#1B334F',
  },

  updateBtn: {
    marginTop: 10,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  updateText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  
  sheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  
  sheetBtn: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
    alignItems: 'center',
  },
  
  sheetText: {
    fontSize: 15,
  },
});
