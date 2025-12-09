import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import CacheImage from '../../components/CacheImage';
import { camera,   } from '../../assets';


import { fontSizes, hp } from '../../theme/responsive';
import { colors } from '../../theme/colors';

import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { capitalize } from '../../utils/utils';

const Profile = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const user = useSelector(state => state.userReducer.user);

  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(''); 


  const onSaveProfile = async () => {
    if (nameDraft.trim().length === 0) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }
  }


  const onDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            // setDeleting(true);
            // const res = await deleteAccount();
            // console.log(res, 'res11');
            // if (res.success) {
              // Clear auth and navigate to Auth stack
              // dispatch(signOut());
            // } else {
            //   Alert.alert('Error', (res as any).error || 'Failed to delete account');
            // }
          } catch (e: any) {
            Alert.alert('Error', e?.message || 'Failed to delete account');
          } finally {
            // setDeleting(false);
          }
        } },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <CacheImage url={
          // fallbackUser?.avatarUrl || 
          'https://randomuser.me/api/portraits/men/1.jpg'} style={styles.avatar} />
        <TouchableOpacity style={styles.cameraIconWrap} >
          <View style={styles.cameraIconCircle}>
            <Image source={camera} style={styles.cameraIconImg} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.inputCard}>
        <Text style={styles.label}>Full name</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={editing ? nameDraft : `${capitalize(user.name)}`}
            onChangeText={setNameDraft}
  
          />
          {editing ? (
            <TouchableOpacity style={styles.editBtn} onPress={onSaveProfile} >
              <Text style={styles.editText}>{'Sign in to save'}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)} >
              <Text style={styles.editText}>{'Edit'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.inputCard}>
        <Text style={styles.label}>E-mail address</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            // value={emailFromAuth || ''}
            value={`${user.email}`}
            editable={false}
          />
        </View>
      </View>

     
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 32,
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
    bottom: 0,
    right: 0,
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
    width: '88%',
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginBottom: 18,
    alignSelf: 'center',
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  label: {
    color: '#888',
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 0,
    height: 44,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1B334F',
    backgroundColor: 'transparent',
    paddingVertical: 0,
    fontWeight: '500',
    height: 44,
  },
  editBtn: {
    marginLeft: 8,
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 44,
    justifyContent: 'center',
  },
  editText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteBtn: {
    position:'absolute',
    bottom:40,
    left:30,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap:5,
  },

  deleteText: {
    color: colors.text.primary,
    fontSize: fontSizes.fs16,
    textAlign:'center',
    marginTop:hp('0.5')
  },
  icon:{
    width:20,
    height:20,
    resizeMode:'contain',
  }
});
