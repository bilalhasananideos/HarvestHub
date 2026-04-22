// // import { StyleSheet, Text, View } from 'react-native'
// // import React from 'react'

// // const index = () => {
// //   return (
// //     <View>
// //       <Text>index</Text>
// //     </View>
// //   )
// // }

// // export default index

// // const styles = StyleSheet.create({})


// // Theek hai 👍
// // Main **bilkul step-by-step, araam se, Roman Urdu mein** samjhaata hoon ke **React Native + Firebase Firestore** se **real-time chat (socket jaisa)** kaise banani hai.
// // Tumhara setup already **almost ready** hai — bas ab **structure + listeners** samajhna baqi hai.

// // ---

// // ## 🔹 Overall Concept (pehle dimagh mein clear kar lo)

// // Firestore **already real-time hota hai**
// // ➡️ `onSnapshot()` bilkul **socket jaisa** kaam karta hai
// // ➡️ Jaise hi koi message add hota hai, doosray user ko **instant mil jata hai**

// // Tumhara structure image se ye hai:

// // ```
// // conversations (collection)
// //  └── conv_9_10 (document)
// //       ├── lastMessage
// //       ├── participants [userA, userB]
// //       ├── updatedAt
// //       └── messages (sub-collection)
// //            └── messageId
// //                 ├── text
// //                 ├── senderId
// //                 ├── createdAt
// // ```

// // ✔️ **Ye perfect structure hai chat ke liye**

// // ---

// // ## 🔹 STEP 1: Firestore ko import karna

// // ```js
// // import firestore from '@react-native-firebase/firestore';
// // import auth from '@react-native-firebase/auth';
// // ```

// // ---

// // ## 🔹 STEP 2: Current user ka ID lena

// // ```js
// // const currentUserId = auth().currentUser.uid;
// // ```

// // ⚠️ Ye bohot important hai (sender identify karne ke liye)

// // ---

// // ## 🔹 STEP 3: Messages ko REAL-TIME listen karna (Socket jaisa)

// // 🔥 **Ye main cheez hai**

// // ```js
// // useEffect(() => {
// //   const unsubscribe = firestore()
// //     .collection('conversations')
// //     .doc('conv_9_10')
// //     .collection('messages')
// //     .orderBy('createdAt', 'asc')
// //     .onSnapshot(snapshot => {
// //       const msgs = snapshot.docs.map(doc => ({
// //         id: doc.id,
// //         ...doc.data(),
// //       }));
// //       setMessages(msgs);
// //     });

// //   return () => unsubscribe();
// // }, []);
// // ```

// // ### 📌 Yahan kya ho raha hai?

// // * `onSnapshot()` = **real-time listener**
// // * Koi bhi user message bheje → **auto update**
// // * Bilkul **socket jaisa behavior**

// // ---

// // ## 🔹 STEP 4: Message bhejna (Send Message)

// // ```js
// // const sendMessage = async (text) => {
// //   if (!text.trim()) return;

// //   const messageData = {
// //     text: text,
// //     senderId: currentUserId,
// //     createdAt: firestore.FieldValue.serverTimestamp(),
// //   };

// //   const conversationRef = firestore()
// //     .collection('conversations')
// //     .doc('conv_9_10');

// //   await conversationRef.collection('messages').add(messageData);

// //   await conversationRef.update({
// //     lastMessage: text,
// //     updatedAt: firestore.FieldValue.serverTimestamp(),
// //   });
// // };
// // ```

// // ✔️ Ye function:

// // * message add karta hai
// // * lastMessage update karta hai
// // * timestamp server ka hota hai (best practice)

// // ---

// // ## 🔹 STEP 5: Messages ko UI mein show karna (Simple Example)

// // ```js
// // <FlatList
// //   data={messages}
// //   keyExtractor={(item) => item.id}
// //   renderItem={({ item }) => (
// //     <View style={{
// //       alignSelf: item.senderId === currentUserId ? 'flex-end' : 'flex-start',
// //       backgroundColor: '#eee',
// //       margin: 5,
// //       padding: 10,
// //       borderRadius: 10,
// //     }}>
// //       <Text>{item.text}</Text>
// //     </View>
// //   )}
// // />
// // ```

// // ➡️ Apna message right side
// // ➡️ Dusray ka left side

// // ---

// // ## 🔹 STEP 6: Input + Send Button

// // ```js
// // <TextInput
// //   value={message}
// //   onChangeText={setMessage}
// //   placeholder="Type message..."
// // />

// // <Button title="Send" onPress={() => {
// //   sendMessage(message);
// //   setMessage('');
// // }} />
// // ```

// // ---

// // ## 🔹 STEP 7: Multiple Conversations (Future)

// // Baad mein jab multiple chats chahiye hon:

// // ```js
// // firestore()
// //   .collection('conversations')
// //   .where('participants', 'array-contains', currentUserId)
// //   .orderBy('updatedAt', 'desc')
// // ```

// // Is se:

// // * user ki sari chats
// // * WhatsApp jaisa chat list

// // ---

// // ## 🔹 IMPORTANT FIRESTORE RULES (Must)

// // ```js
// // rules_version = '2';
// // service cloud.firestore {
// //   match /databases/{database}/documents {

// //     match /conversations/{conversationId} {
// //       allow read, write: if request.auth != null;

// //       match /messages/{messageId} {
// //         allow read, write: if request.auth != null;
// //       }
// //     }
// //   }
// // }
// // ```

// // ---

// // ## 🔹 Summary (Simple Words)

// // ✔️ Firestore = already socket
// // ✔️ `onSnapshot()` = real-time listener
// // ✔️ Messages sub-collection = best practice
// // ✔️ Tumhara DB structure correct hai
// // ✔️ Sirf listener + send function chahiye

// // ---

// // ### 👉 Agla Step?

// // Agar chaho to main:
// // 1️⃣ **Complete Chat Screen bana doon**
// // 2️⃣ **Typing indicator**
// // 3️⃣ **Seen / Delivered status**
// // 4️⃣ **Voice / Image messages**
// // 5️⃣ **Clean architecture (hooks)**

// // Bas bolo **next kya chahiye** 👍



// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';

// const ChatScreen = ({ route }) => {
//   const { conversationId } = route.params; // "conv_9_10"
//   const currentUser = auth().currentUser;

//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState('');

//   // 🔹 REAL-TIME LISTENER
//   useEffect(() => {
//     const unsubscribe = firestore()
//       .collection('conversations')
//       .doc(conversationId)
//       .collection('messages')
//       .orderBy('createdAt', 'asc')
//       .onSnapshot(snapshot => {
//         const msgs = snapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         setMessages(msgs);
//         console.log('📩 Messages updated');
//       });

//     return () => unsubscribe();
//   }, []);

//   // 🔹 DELIVERED LOGIC (YAHAN LAGTA HAI)
//   useEffect(() => {
//     messages.forEach(msg => {
//       if (
//         msg.senderId !== currentUser.uid &&
//         msg.delivered !== true
//       ) {
//         firestore()
//           .collection('conversations')
//           .doc(conversationId)
//           .collection('messages')
//           .doc(msg.id)
//           .update({ delivered: true });
//       }
//     });
//   }, [messages]);

//   // 🔹 SEND MESSAGE
//   const sendMessage = async () => {
//     if (text.trim() === '') return;
  
//     try {
//       await firestore()
//         .collection('conversations')
//         .doc(conversationId)
//         .collection('messages')
//         .add({
//           message: text,
//           senderId: currentUser.uid,
//           senderName: currentUser.displayName || 'User',
//           createdAt: firestore.FieldValue.serverTimestamp(),
//           status: 'sent', // 👈 NEW
//           delivered: false,
//         });
  
//       setText('');
//       console.log('✅ Message sent');
//     } catch (error) {
//       console.log('❌ Message failed:', error);
//       alert('Message send nahi hua');
//     }
//   };  

// // 🔹 MESSAGE UI
// const renderItem = ({ item }) => {
//   const isMe = item.senderId === currentUser.uid;

//   return (
//     <View
//       style={[
//         styles.bubble,
//         isMe ? styles.myBubble : styles.otherBubble,
//       ]}
//     >
//       <Text
//         style={[
//           styles.messageText,
//           { color: isMe ? '#fff' : '#000' },
//         ]}
//       >
//         {item.message}
//       </Text>

//       {isMe && (
//         <Text style={styles.status}>
//           {item.delivered ? '✓✓ Delivered' : '✓ Sent'}
//         </Text>
//       )}
//     </View>
//   );
// };

// return (
//   <KeyboardAvoidingView
//     style={styles.container}
//     behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//   >
//     {messages.length === 0 && (
//       <Text style={styles.empty}>Start the conversation 👋</Text>
//     )}

//     <FlatList
//       data={messages}
//       keyExtractor={item => item.id}
//       renderItem={renderItem}
//       contentContainerStyle={{ padding: 12 }}
//     />

//     <View style={styles.inputBar}>
//       <TextInput
//         value={text}
//         onChangeText={setText}
//         placeholder="Type a message..."
//         style={styles.input}
//       />
//       <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
//         <Text style={{ color: '#fff', fontWeight: '600' }}>
//           Send
//         </Text>
//       </TouchableOpacity>
//     </View>
//   </KeyboardAvoidingView>
// );
// };

// export default ChatScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f2f2f2',
//   },
//   bubble: {
//     maxWidth: '75%',
//     padding: 12,
//     borderRadius: 16,
//     marginVertical: 6,
//   },
//   myBubble: {
//     backgroundColor: '#4CAF50',
//     alignSelf: 'flex-end',
//     borderBottomRightRadius: 4,
//   },
//   otherBubble: {
//     backgroundColor: '#fff',
//     alignSelf: 'flex-start',
//     borderBottomLeftRadius: 4,
//   },
//   messageText: {
//     fontSize: 16,
//   },
//   status: {
//     fontSize: 11,
//     color: '#e0e0e0',
//     marginTop: 4,
//     alignSelf: 'flex-end',
//   },
//   inputBar: {
//     flexDirection: 'row',
//     padding: 20,
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderColor: '#ddd',
//   },
//   input: {
//     flex: 1,
//     backgroundColor: '#f1f1f1',
//     borderRadius: 20,
//     paddingHorizontal: 16,
//     paddingVertical: 20
//   },
//   sendBtn: {
//     backgroundColor: '#4CAF50',
//     marginLeft: 10,
//     paddingHorizontal: 20,
//     justifyContent: 'center',
//     borderRadius: 20,
//   },
//   empty: {
//     textAlign: 'center',
//     marginTop: 20,
//     color: '#999',
//   },
// });



// import React, { useState, useRef, useCallback, useMemo } from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     TextInput,
//     TouchableOpacity,
//     FlatList,
//     KeyboardAvoidingView,
//     Platform,
//     Image,
//     StatusBar,
// } from "react-native";
// import { colors } from "../../theme/colors";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useSelector } from "react-redux";
// import {
//     collection,
//     doc,
//     getDoc,
//     getDocs,
//     limit,
//     onSnapshot,
//     orderBy,
//     query,
//     serverTimestamp,
//     setDoc,
//     updateDoc,
//     addDoc,
//     where,
//   } from 'firebase/firestore';
//   import { firebase } from '@react-native-firebase/auth';
//   import { db } from '../../store/services/FirebaseServicsConfig'
// import { messageSendApi } from "../../store/services/Services";
  

// // ── Dummy initial messages (replace with your API data) ──────
// const INITIAL_MESSAGES = [
//     { id: "1", text: "Hi Jason, do you have fresh watermelons available this week?", isMine: true,  time: "10:01 AM" },
//     { id: "2", text: "Hello! Yes, we just harvested a new batch this morning. They're 100% organic and chemical-free.", isMine: false, time: "10:02 AM" },
//     { id: "3", text: "Great! Can you deliver to my area in Green Valley?", isMine: true,  time: "10:03 AM" },
//     { id: "4", text: "Absolutely. We deliver to Green Valley every evening between 5–8 PM.", isMine: false, time: "10:04 AM" },
//     { id: "5", text: "I'll order two watermelons then.", isMine: true,  time: "10:05 AM" },
//     { id: "6", text: "Sounds good! I'll prepare them fresh and have them sent out today. Thanks for supporting local farming.", isMine: false, time: "10:06 AM" },
// ];

// const ChatScreen = ({ navigation, route }) => {

//     // route.params se user info lo — apna structure set karo
//     // const { userName = "James Madrid", userAvatar = null } = route?.params ?? {};
//     const { userName, userAvatar } = useMemo(() => ({
//         userName: route?.params?.userName ?? "James Madrid",
//         userAvatar: route?.params?.userAvatar ?? null
//     }), [route?.params]);
//     console.log("para", route)

//     const user = useSelector((state: any) => state.userReducer.user);
//     // console.log('user', user)

//     const [messages, setMessages] = useState(INITIAL_MESSAGES);
//     const [inputText, setInputText] = useState("");
//     const flatListRef = useRef(null);

//     // const sendMessage = () => {
//     //     const text = inputText.trim();
//     //     if (!text) return;

//     //     const newMsg = {
//     //         id: Date.now().toString(),
//     //         text,
//     //         isMine: true,
//     //         time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//     //     };

//     //     setMessages(prev => [...prev, newMsg]);
//     //     setInputText("");

//     //     // Scroll to bottom after sending
//     //     setTimeout(() => {
//     //         flatListRef.current?.scrollToEnd({ animated: true });
//     //     }, 100);
//     // };

//     const sendMessage = async () => {
//         try {
//         const data = await addDoc(collection(db, `conversations/${route?.params?.uuid}/messages`), {
//             createdAt: serverTimestamp(),
//             message: inputText,
//             receiverId : route?.params?.vendor_id,
//             senderId: user.id,
//             senderUid: firebase.auth().currentUser.uid,
//             senderName : user.name,
//           });
//           console.log("data", data)
//           if (data) {
//             const resp = await messageSendApi(route?.params?.uuid,inputText)
//             console.log("resp", resp)
//           }
//         } catch (err) {
//             console.log("err", err)
//         }
//     }

//     const renderMessage = ({ item }) => (
//         <View style={[styles.msgRow, item.isMine ? styles.msgRowMine : styles.msgRowTheirs]}>
//             <View style={[styles.bubble, item.isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
//                 <Text style={[styles.msgText, item.isMine ? styles.msgTextMine : styles.msgTextTheirs]}>
//                     {item.text}
//                 </Text>
//                 <Text style={[styles.timeText, item.isMine ? styles.timeTextMine : styles.timeTextTheirs]}>
//                     {item.time}
//                 </Text>
//             </View>
//         </View>
//     );

//     return (
//         <SafeAreaView style={styles.safe}>
//             <StatusBar barStyle="dark-content" backgroundColor="#fff" />

//             {/* ── Header ── */}
//             {/* <View style={styles.header}>
//                 <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//                     <Text style={styles.backArrow}>←</Text>
//                 </TouchableOpacity>

//                 <View style={styles.headerUser}>
//                     {userAvatar
//                         ? <Image source={{ uri: userAvatar }} style={styles.avatar} />
//                         : <View style={styles.avatarPlaceholder}>
//                             <Text style={styles.avatarInitial}>{userName?.[0] ?? "U"}</Text>
//                           </View>
//                     }
//                     <View>
//                         <Text style={styles.headerName}>{userName}</Text>
//                         <Text style={styles.headerOnline}>Online</Text>
//                     </View>
//                 </View>

//                 <View style={{ width: 36 }} />
//             </View> */}

//             {/* ── Messages + Input ── */}
//             <KeyboardAvoidingView
//                 style={{ flex: 1 }}
//                 behavior={Platform.OS === "ios" ? "padding" : "height"}
//                 keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}>

//                 <FlatList
//                     ref={flatListRef}
//                     data={messages}
//                     keyExtractor={item => item.id}
//                     renderItem={renderMessage}
//                     contentContainerStyle={styles.msgList}
//                     showsVerticalScrollIndicator={false}
//                     onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
//                 />

//                 {/* ── Input Bar ── */}
//                 <View style={styles.inputBar}>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Type a message..."
//                         placeholderTextColor="#aaa"
//                         value={inputText}
//                         onChangeText={setInputText}
//                         // multiline
//                         maxLength={500}
//                         returnKeyType="default"
//                     />
//                     <TouchableOpacity
//                         style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
//                         onPress={sendMessage}
//                         disabled={!inputText.trim()}
//                         activeOpacity={0.8}>
//                         <Text style={styles.sendLabel}>Send</Text>
//                         <Text style={styles.sendIcon}>➤</Text>
//                     </TouchableOpacity>
//                 </View>

//             </KeyboardAvoidingView>
//         </SafeAreaView>
//     );
// };

// export default ChatScreen;

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { colors } from "../../theme/colors";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";

import { firebase } from "@react-native-firebase/auth";
import { db } from "../../store/services/FirebaseServicsConfig";
import { messageReadApi, messageSendApi } from "../../store/services/Services";

const ChatScreen = ({ navigation, route }) => {

  const { uuid, vendor_id } = route?.params ?? {};

  const user = useSelector((state: any) => state.userReducer.user);

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");

  const flatListRef = useRef<any>(null);
  const unsubscribeRef = useRef<any>(null);

  // ───────────── Scroll Bottom
  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 200);
  };

  // ───────────── Listen Messages (Firebase)
  const listenMessages = (uuid: string) => {
    console.log("uuid:", uuid);

    const colRef = collection(db, `conversations/${uuid}/messages`);
    const q = query(colRef, orderBy("createdAt"));

    unsubscribeRef.current = onSnapshot(q, snapshot => {
      const msgs: any[] = [];

      snapshot.forEach(doc => {
        msgs.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setMessages(msgs);

      scrollToBottom();
    });
  };

  // ───────────── useEffect
  useEffect(() => {
    if (uuid) {
      listenMessages(uuid);

      // mark read API
      messageReadApi(`${uuid}`);

      scrollToBottom();
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [uuid]);

  // ───────────── Send Message
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    try {

      const message = inputText;

      setInputText("");

      // firebase function
      const data = await addDoc(
        collection(db, `conversations/${uuid}/messages`),
        {
          message,
          createdAt: serverTimestamp(),
          senderId: user.id,
          senderUid: firebase.auth().currentUser?.uid,
          senderName: user.name,
          receiverId: vendor_id,
        }
      );

      if (data) {
        await messageSendApi(uuid, message);
      }

      scrollToBottom();

    } catch (err) {
      console.log("send message error", err);
    }
  };

  // ───────────── Render Message
  const renderMessage = ({ item }) => {

    const isMine = item.senderId === user.id;

    return (
      <View style={[styles.msgRow, isMine ? styles.msgRowMine : styles.msgRowTheirs]}>
        <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
          <Text style={styles.msgText}>{item.message}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
      >

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Input */}
        <View style={styles.inputBar}>

          <TextInput
            style={styles.input}
            placeholder="Type message..."
            value={inputText}
            onChangeText={setInputText}
            autoCorrect={false}
          />

          <TouchableOpacity
            style={styles.sendBtn}
            onPress={sendMessage}
          >
            <Text style={{ color: "#fff" }}>Send</Text>
          </TouchableOpacity>

        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#fff" },

    // Header
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
        backgroundColor: "#fff",
    },
    backBtn:   { width: 36, padding: 4 },
    backArrow: { fontSize: 22, color: "#111" },
    headerUser: { flexDirection: "row", alignItems: "center", gap: 10 },
    avatar: { width: 40, height: 40, borderRadius: 20 },
    avatarPlaceholder: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: colors.primary.main,
        alignItems: "center", justifyContent: "center",
    },
    avatarInitial: { color: "#fff", fontSize: 18, fontWeight: "700" },
    headerName:   { fontSize: 16, fontWeight: "700", color: "#111" },
    headerOnline: { fontSize: 12, color: "#4CAF50" },

    // Messages
    msgList: { paddingHorizontal: 16, paddingVertical: 20, gap: 10 },

    msgRow: { flexDirection: "row", marginVertical: 4 },
    msgRowMine:   { justifyContent: "flex-end" },
    msgRowTheirs: { justifyContent: "flex-start" },

    bubble: {
        maxWidth: "75%",
        borderRadius: 18,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    bubbleMine: {
        backgroundColor: "#dce8d0",   // light green like screenshot
        borderBottomRightRadius: 4,
    },
    bubbleTheirs: {
        backgroundColor: "#f0f0f0",
        borderBottomLeftRadius: 4,
    },

    msgText:      { fontSize: 15, lineHeight: 21 },
    msgTextMine:  { color: "#333" },
    msgTextTheirs:{ color: "#333" },

    timeText:      { fontSize: 10, marginTop: 4 },
    timeTextMine:  { color: "#888", textAlign: "right" },
    timeTextTheirs:{ color: "#aaa" },

    // Input Bar
    inputBar: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
        backgroundColor: "#fff",
        gap: 8,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === "ios" ? 12 : 8,
        fontSize: 15,
        color: "#111",
        backgroundColor: "#fafafa",
        // maxHeight: 120,
        maxHeight: 50
    },
    sendBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.primary.main,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 6,
    },
    sendBtnDisabled: { opacity: 0.5 },
    sendIcon:  { color: "#fff", fontSize: 13 },
    sendLabel: { color: "#fff", fontSize: 15, fontWeight: "700" },
});