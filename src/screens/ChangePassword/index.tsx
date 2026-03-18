import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    ScrollView,
    ActivityIndicator,
    Image,
    Alert,
    Platform,
    KeyboardAvoidingView,
    Keyboard,
} from 'react-native';
import { firebase } from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
// import { loadingTrue, loadingFalse } from '../redux/slices/loadingSlice'; // apna path set karo
import Ionicons from 'react-native-vector-icons/Ionicons';
import { logo, sms, eye, eyeOff, google, apple } from '../../assets';
import { scale, typography } from '../../theme/typography';
import { colors } from '../../theme/colors';
import { fontSizes, hp, wp } from '../../theme/responsive';

const ChangePasswordScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    const newRef = useRef();
    const confirmRef = useRef();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOld, setShowOld] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({})

    const validate = () => {

        let obj = {}

        if (!oldPassword) {
            obj.oldPassword = "Old password required"
        }

        if (!newPassword) {
            obj.newPassword = "New password required"
        }

        if (newPassword.length < 6) {
            obj.newPassword = "Password must be at least 6 characters"
        }

        if (confirmPassword !== newPassword) {
            obj.confirmPassword = "Passwords do not match"
        }

        setErrors(obj)

        return Object.keys(obj).length === 0
    }

    // const changePassword = async () => {
    //     if (!oldPassword || !newPassword || !confirmPassword) {
    //         errorMessage('Please fill all fields');
    //         return;
    //     }

    //     // dispatch(loadingTrue());
    //     setLoading(true);

    //     if (oldPassword !== newPassword) {
    //         const user = firebase.auth().currentUser;
    //         try {
    //             const reauthenticate = pwd => {
    //                 const crd = firebase.auth.EmailAuthProvider.credential(
    //                     user.email,
    //                     pwd,
    //                 );
    //                 return user.reauthenticateWithCredential(crd);
    //             };
    //             await reauthenticate(oldPassword);
    //             await user.updatePassword(confirmPassword);
    //             successMessage('Your password has been changed');
    //             navigation.goBack();
    //         } catch (error) {
    //             console.log('error:', error);
    //             errorMessage('Current password is wrong');
    //         } finally {
    //             // dispatch(loadingFalse());
    //             setLoading(false);
    //         }
    //     } else {
    //         // dispatch(loadingFalse());
    //         setLoading(false);
    //         errorMessage('New password must be different from old password');
    //     }
    // };

    const changePassword = async () => {

        if (!validate()) {
            return
        }

        if (oldPassword === newPassword) {
            Alert.alert("Error", "New password must be different from old password")
            return
        }

        const user = firebase().currentUser

        if (!user) {
            Alert.alert("Error", "User not logged in")
            return
        }

        setLoading(true)

        try {

            const credential = firebase.EmailAuthProvider.credential(
                user.email,
                oldPassword
            )

            await user.reauthenticateWithCredential(credential)

            await user.updatePassword(newPassword)

            setOldPassword("")
            setNewPassword("")
            setConfirmPassword("")

            Alert.alert(
                "Success",
                "Your password has been changed",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.goBack()
                    }
                ]
            )

        } catch (error) {

            console.log(error)

            if (error.code === "auth/wrong-password") {
                setErrors({ oldPassword: "Current password is incorrect" })
            } else {
                Alert.alert("Error", error.message)
            }

        } finally {
            setLoading(false)
        }

    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            {/* <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Change password</Text>
            </View> */}
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                // keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
                //   behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : -280}
            >

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}>

                    {/* Lock Icon */}
                    {/* <View style={styles.lockWrap}>
                    <View style={styles.lockCircle}>
                        <Ionicons name="lock-closed" size={42} color="#b5651d" />
                    </View>
                </View> */}

                    {/* Title & Subtitle */}
                    <Text style={styles.title}>Change password</Text>
                    <Text style={styles.subtitle}>
                        Keep your account safe by updating your password.{'\n'}
                        Set a new one to stay secure and in control.
                    </Text>

                    {/* <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            secureTextEntry={!showConfirm}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="••••••••••••••••"
                            placeholderTextColor="#bbb"
                        /> */}
                    {/* <TouchableOpacity
                            style={styles.eyeBtn}
                            onPress={() => setShowConfirm(!showConfirm)}>
                            <Ionicons
                                name={showConfirm ? 'eye' : 'eye-off-outline'}
                                size={20}
                                color="#aaa"
                            />
                        </TouchableOpacity> */}
                    {/* <TouchableOpacity
                            style={styles.eyeBtn}
                            onPress={() => setShowConfirm(!showConfirm)}
                        >
                            <Image
                            source={showConfirm ? eye : eyeOff} 
                            style={styles.eyeIcon}
                            />
                        </TouchableOpacity>
                    </View> */}

                    {/* Old Password */}
                    <View style={styles.fieldWrap}>
                        <Text style={styles.label}>Enter old password</Text>
                        <View style={[
                            styles.inputContainer,
                            errors.oldPassword && { borderColor: "red" }
                        ]}>

                            <TextInput
                                placeholder="••••••••••••••••"
                                placeholderTextColor="#bbb"
                                value={oldPassword}
                                secureTextEntry={!showOld}
                                returnKeyType="next"
                                onSubmitEditing={() => newRef.current.focus()}
                                onChangeText={(text) => {
                                    setOldPassword(text)
                                    setErrors({ ...errors, oldPassword: null })
                                }}
                                style={styles.input}
                            />

                            <TouchableOpacity onPress={() => setShowOld(!showOld)}>
                                <Image source={showOld ? eye : eyeOff} style={styles.eyeIcon} />
                            </TouchableOpacity>

                        </View>
                        {errors.oldPassword && <Text style={styles.error}>{errors.oldPassword}</Text>}

                    </View>

                    {/* New Password */}
                    <View style={styles.fieldWrap}>
                        <Text style={styles.label}>New password</Text>
                        <View style={[
                            styles.inputContainer,
                            errors.newPassword && { borderColor: "red" }
                        ]}>

                            <TextInput
                                ref={newRef}
                                placeholder="••••••••••••••••"
                                placeholderTextColor="#bbb"
                                value={newPassword}
                                secureTextEntry={!showNew}
                                returnKeyType="next"
                                onSubmitEditing={() => confirmRef.current.focus()}
                                onChangeText={(text) => {
                                    setNewPassword(text)
                                    setErrors({ ...errors, newPassword: null })
                                }}
                                style={styles.input}
                            />

                            <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                                <Image source={showNew ? eye : eyeOff} style={styles.eyeIcon} />
                            </TouchableOpacity>

                        </View>

                        {errors.newPassword && <Text style={styles.error}>{errors.newPassword}</Text>}

                    </View>

                    {/* Confirm Password */}
                    <View style={styles.fieldWrap}>
                        <Text style={styles.label}>Re-enter new password</Text>
                        <View style={[
                            styles.inputContainer,
                            errors.confirmPassword && { borderColor: "red" }
                        ]}>

                            <TextInput
                                ref={confirmRef}
                                placeholder="••••••••••••••••"
                                placeholderTextColor="#bbb"
                                value={confirmPassword}
                                secureTextEntry={!showConfirm}
                                returnKeyType="done"
                                onSubmitEditing={() => Keyboard.dismiss()}
                                onChangeText={(text) => {
                                    setConfirmPassword(text)
                                    setErrors({ ...errors, confirmPassword: null })
                                }}
                                style={styles.input}
                            />

                            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                                <Image source={showConfirm ? eye : eyeOff} style={styles.eyeIcon} />
                            </TouchableOpacity>

                        </View>

                        {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}

                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={styles.submitBtn}
                        onPress={changePassword}
                        disabled={loading}
                        activeOpacity={0.85}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitText}>Change password</Text>
                        )}
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    backBtn: {
        position: 'absolute',
        left: 16,
        padding: 4,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '500',
        color: '#111',
    },

    // Scroll
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 40,
    },

    // Lock Icon
    lockWrap: {
        alignItems: 'center',
        marginBottom: 28,
    },
    lockCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#fce8e0',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Title
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#111',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        // color: '#3b82f6',
        color: '#bbb',
        textDecorationLine: 'underline',
        lineHeight: 22,
        marginBottom: 32,
    },

    // Fields
    fieldWrap: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        color: '#888',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
        borderRadius: 30,
        paddingHorizontal: 18,
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        paddingVertical: 15,
        fontSize: 16,
        color: '#333',
        letterSpacing: 2,
    },
    eyeBtn: {
        paddingLeft: 10,
    },

    // Button
    submitBtn: {
        backgroundColor: '#b5651d',
        borderRadius: 14,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 10,
    },
    submitText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
    },
    eyeButton: {
        padding: wp(2),
    },
    eyeIcon: {
        width: wp(5),
        height: wp(5),
        resizeMode: 'contain',
        tintColor: colors.text.secondary,
    },



    // inputContainer: {
    //     flexDirection: "row",
    //     alignItems: "center",
    //     borderWidth: 1,
    //     borderColor: "#ddd",
    //     borderRadius: 10,
    //     paddingHorizontal: 10,
    //     marginBottom: 10
    // },

    // input: {
    //     flex: 1,
    //     height: 50
    // },

    // eyeIcon: {
    //     width: 22,
    //     height: 22,
    //     tintColor: "#888"
    // },

    error: {
        color: "red",
        marginVertical: 6,
        marginLeft: 10
    },

    submitBtn: {
        backgroundColor: "#b5651d",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginTop: 20
    }
});