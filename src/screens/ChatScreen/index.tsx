// import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
// import {
//   FlatList,
//   Image,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   ActivityIndicator,
//   RefreshControl
// } from 'react-native';
// import { Swipeable } from 'react-native-gesture-handler';
// import { colors } from '../../theme/colors';
// import { deleteaccount } from '../../assets';
// import { NavigationProp, useNavigation } from '@react-navigation/native';
// import { getChatListApi } from '../../store/services/Services';
// import moment from 'moment';

// type ChatItem = {
//   id: string;
//   name: string;
//   message: string;
//   time: string;
//   avatar: string;
//   isActive?: boolean;
// };

const chatData: ChatItem[] = [
  {
    id: '1',
    name: 'James Madrid',
    message: 'If you suspect that your braid has take...',
    time: '4:32 PM',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
  },
  {
    id: '2',
    name: 'Madrid Harvest',
    message: 'If you suspect that your braid has take...',
    time: '4:32 PM',
    avatar: 'https://randomuser.me/api/portraits/men/64.jpg',
  },
  {
    id: '3',
    name: 'Arnold Davidson',
    message: 'If you suspect that your braid has take...',
    time: '4:32 PM',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
  },
  {
    id: '4',
    name: "Rickey's Farm",
    message: 'If you suspect that your braid has take...',
    time: '4:32 PM',
    avatar: 'https://randomuser.me/api/portraits/men/43.jpg',
  },
  {
    id: '5',
    name: 'Organic Harving',
    message: 'If you suspect that your braid has take...',
    time: '4:32 PM',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    id: '6',
    name: 'James Madrid',
    message: 'If you suspect that your braid has take...',
    time: '4:32 PM',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
  },
  {
    id: '7',
    name: 'Oliver Stane',
    message: 'If you suspect that your braid has take...',
    time: '4:32 PM',
    avatar: 'https://randomuser.me/api/portraits/men/21.jpg',
  },
];

// const ChatScreen = () => {
//   const navigation = useNavigation<NavigationProp<any>>();
//   // const [data] = useState(chatData);
//   const [data, setData] = useState<ChatItem[]>([]);
//   const [loading, setLoading] = useState(false);

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerTitle: 'Chat Box',
//       headerTitleAlign: 'center',
//     });
//   }, [navigation]);

//   useEffect(() => {
//     getChatListData()
//   }, [])

//   const getChatListData = async () => {
//     try {
//       setLoading(true);

//       const resp = await getChatListApi();

//       const conversations = resp?.data?.data?.conversations || [];

//       const formattedData: ChatItem[] = conversations.map((item: any) => ({
//         id: item.uuid,
//         name: item.other_user?.name,
//         message: item.last_message,
//         time: moment(item.last_message_at).format("hh:mm A"),
//         avatar: item.other_user?.image,
//       }));

//       setData(formattedData);

//     } catch (err) {
//       console.log("err", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderRightActions = useCallback(
//     () => (
//       <TouchableOpacity style={styles.deleteAction}>
//         <Image source={deleteaccount} style={styles.deleteIcon} />
//       </TouchableOpacity>
//     ),
//     [],
//   );

//   const renderItem = ({ item }: { item: ChatItem }) => (
//     <Swipeable renderRightActions={renderRightActions}>
//       <TouchableOpacity
//         style={[styles.row, ]}
//         activeOpacity={0.8}
//         onPress={() => navigation.navigate('MessageScreen' ,{item})}
//       >
//         <View style={styles.avatarWrapper}>
//           <Image source={{ uri: item.avatar }} style={styles.avatar} />
//         </View>
//         <View style={styles.messageWrapper}>
//           <Text style={styles.nameText}>{item.name}</Text>
//           <Text style={styles.messageText} numberOfLines={1}>
//             {item.message}
//           </Text>
//         </View>
//         <Text style={styles.timeText}>{item.time}</Text>
//       </TouchableOpacity>
//     </Swipeable>
//   );

//   return (
//     <View style={styles.safeArea}>

//       {loading ? (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#000" />
//       </View>
//     ) : (
//       <FlatList
//         data={data}
//         keyExtractor={item => item.id}
//         renderItem={renderItem}
//         contentContainerStyle={styles.listContent}
//         ItemSeparatorComponent={() => <View style={styles.separator} />}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No Conversations</Text>
//           </View>
//         }
//       />
//     )}
//       </View>
//   );
// };

// export default ChatScreen;

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#ffffff96',
//   },
//   listContent: {
//     paddingVertical: 12,
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//     backgroundColor: colors.neutral.white,
//     borderWidth: 1,
//     borderColor: colors.border.primary,
//     marginHorizontal: 12,
//     marginVertical: 8,
//     shadowColor: colors.overlay.light,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   activeRow: {
//     borderWidth: 1,
//     borderRadius: 12,
//     borderStyle: 'dashed',
//     borderColor: '#3DA5FF',
//     backgroundColor: '#F8FBFF',
//   },
//   avatarWrapper: {
//     width: 46,
//     height: 46,
//     borderRadius: 23,
//     overflow: 'hidden',
//     marginRight: 16,
//   },
//   avatar: {
//     width: '100%',
//     height: '100%',
//   },
//   messageWrapper: {
//     flex: 1,
//   },
//   nameText: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: colors.text.primary,
//   },
//   messageText: {
//     marginTop: 4,
//     fontSize: 12,
//     color: colors.text.secondary,
//   },
//   timeText: {
//     fontSize: 11,
//     color: colors.text.secondary,
//   },
//   separator: {
//     height: StyleSheet.hairlineWidth,
//     backgroundColor: colors.border.primary,
//     marginLeft: 82,
//   },
//   deleteAction: {
//     width: 68,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#E60017',
//     flex: 1,
//   },
//   deleteIcon: {
//     width: 22,
//     height: 22,
//     tintColor: colors.neutral.white,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 50,
//   },

//   emptyText: {
//     fontSize: 16,
//     color: "#777",
//   },
// });


// import React, { useEffect, useLayoutEffect, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   RefreshControl,
// } from "react-native";
// import { useNavigation, NavigationProp } from "@react-navigation/native";
// import Swipeable from "react-native-gesture-handler/Swipeable";
// import moment from "moment";
// import { getChatListApi } from "../../store/services/Services";
// import Ionicons from 'react-native-vector-icons/Ionicons';

// const ChatScreen = () => {

//   const navigation = useNavigation<NavigationProp<any>>();

//   const [data, setData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerTitle: "Chat Box",
//       headerTitleAlign: "center",
//     });
//   }, [navigation]);

//   useEffect(() => {
//     getChatListData();
//   }, []);

//   const getChatListData = async () => {
//     try {
//       setLoading(true);

//       const resp = await getChatListApi();
//       console.log("resp", resp)

//       const conversations = resp?.data?.data?.conversations || [];

//       const formatted = conversations.map((item: any) => ({
//         id: item.uuid,
//         name: item.other_user?.name,
//         avatar: item.other_user?.image,
//         message: item.last_message,
//         time: moment(item.last_message_at).format("hh:mm A"),
//         unread: item.unread_count,
//       }));

//       setData(formatted);

//     } catch (err) {
//       console.log("Chat list error", err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     getChatListData();
//   };

//   const handleDelete = (id: string) => {
//     const filtered = data.filter(item => item.id !== id);
//     setData(filtered);
//   };

//   const renderRightActions = (id: string) => (
//     <TouchableOpacity
//       style={styles.deleteAction}
//       onPress={() => handleDelete(id)}>
//       <Text style={{ color: "white" }}>Delete</Text>
//     </TouchableOpacity>
//   );

//   const renderItem = ({ item }: any) => (
//     <Swipeable renderRightActions={() => renderRightActions(item.id)}>
//       <TouchableOpacity
//         style={styles.row}
//         activeOpacity={0.8}
//         onPress={() => navigation.navigate("MessageScreen", { item })}
//       >
//         <Image source={{ uri: item.avatar }} style={styles.avatar} />

//         <View style={styles.messageWrapper}>
//           <Text style={styles.nameText}>{item.name}</Text>
//           <Text style={styles.messageText} numberOfLines={1}>
//             {item.message}
//           </Text>
//         </View>

//         <View style={{ alignItems: "flex-end" }}>
//           <Text style={styles.timeText}>{item.time}</Text>

//           {item.unread > 0 && (
//             <View style={styles.badge}>
//               <Text style={styles.badgeText}>{item.unread}</Text>
//             </View>
//           )}
//         </View>

//       </TouchableOpacity>
//     </Swipeable>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   const ChatEmpty = () => (
//     <View style={styles.wrap}>
//       <View style={styles.iconCircle}>
//         <Ionicons name="chatbubble-ellipses-outline" size={42} color="#7a9e6e" />
//       </View>
//       <Text style={styles.title}>No Conversations Yet</Text>
//       <Text style={styles.subtitle}>
//         Start a conversation with a farmer{'\n'}to get fresh updates directly.
//       </Text>
//     </View>
//   );
  

//   return (
//     <View style={styles.safeArea}>

//       <FlatList
//         data={data}
//         keyExtractor={item => item.id}
//         renderItem={renderItem}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         ItemSeparatorComponent={() => <View style={styles.separator} />}
//         // ListEmptyComponent={
//         //   <View style={styles.empty}>
//         //     <Text>No Conversations</Text>
//         //   </View>
//         // }
//         ListEmptyComponent={<ChatEmpty />}
//       />

//     </View>
//   );
// };

// export default ChatScreen;

// const styles = {

//   safeArea: {
//     flex: 1,
//     backgroundColor: "#fff"
//   },

//   row: {
//     flexDirection: "row",
//     padding: 15,
//     alignItems: "center"
//   },

//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 12
//   },

//   messageWrapper: {
//     flex: 1
//   },

//   nameText: {
//     fontSize: 16,
//     fontWeight: "600"
//   },

//   messageText: {
//     color: "#777",
//     marginTop: 4
//   },

//   timeText: {
//     fontSize: 12,
//     color: "#999"
//   },

//   badge: {
//     backgroundColor: "#25D366",
//     borderRadius: 12,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     marginTop: 5
//   },

//   badgeText: {
//     color: "#fff",
//     fontSize: 12
//   },

//   separator: {
//     height: 1,
//     backgroundColor: "#eee",
//     marginLeft: 75
//   },

//   deleteAction: {
//     backgroundColor: "red",
//     justifyContent: "center",
//     alignItems: "center",
//     width: 80
//   },

//   loader: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center"
//   },

//   empty: {
//     marginTop: 100,
//     alignItems: "center"
//   },

//   wrap: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingTop: 100,
//     paddingHorizontal: 40,
//   },
//   iconCircle: {
//     width: 90,
//     height: 90,
//     borderRadius: 45,
//     backgroundColor: '#eaf3e0',   // light green
//     borderWidth: 1.5,
//     borderColor: '#c5ddb4',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#2c2c2c',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#aaa',
//     textAlign: 'center',
//     lineHeight: 22,
//   },

// };



import React, { useLayoutEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useNavigation, NavigationProp, useFocusEffect } from "@react-navigation/native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import moment from "moment";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getChatListApi } from "../../store/services/Services";

// ─── Types ─────────────────────────────────────────────────────
interface ChatItem {
  id: string;
  uuid: string;
  vendor_id: number | null;
  name: string;
  avatar: string;
  message: string;
  time: string;
  unread: number;
}

// ─── Main Screen ───────────────────────────────────────────────
const ChatScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const [data, setData]           = useState<ChatItem[]>([]);
  const [loading, setLoading]     = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Chat Box",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      getChatListData();
      return () => {};
    }, [])
  );

  // ── API Call ─────────────────────────────────────────────────
  const getChatListData = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);

      const resp = await getChatListApi();

      // API response: resp.data.data.conversations
      const conversations = resp?.data?.conversations || [];

      const formatted: ChatItem[] = conversations.map((item: any) => ({
        id:        item.uuid,
        uuid:      item.uuid,
        vendor_id: item.other_user?.id ?? null,
        name:      item.other_user?.name  ?? "Unknown",
        avatar:    item.other_user?.image ?? "",
        message:   item.last_message      ?? "No messages yet",
        time:      item.last_message_at
                     ? moment(item.last_message_at).format("hh:mm A")
                     : "",
        unread:    item.pivot?.unread_count ?? item.unread_count ?? 0,
      }));

      setData(formatted);

    } catch (err) {
      console.log("Chat list error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => getChatListData(true);

  // ── Delete (swipe) ───────────────────────────────────────────
  const handleDelete = (id: string) =>
    setData(prev => prev.filter(item => item.id !== id));

  const renderRightActions = (id: string) => (
    <TouchableOpacity style={styles.deleteAction} onPress={() => handleDelete(id)}>
      <Ionicons name="trash-outline" size={22} color="#fff" />
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  // ── Row ──────────────────────────────────────────────────────
  const renderItem = ({ item }: { item: ChatItem }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("MessageScreen", {
          vendor_id: item.vendor_id,
          uuid:      item.uuid,
        })}
      >
        {/* Avatar */}
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarLetter}>
              {item.name?.charAt(0)?.toUpperCase() ?? "?"}
            </Text>
          </View>
        )}

        {/* Name + Message */}
        <View style={styles.messageWrapper}>
          <Text style={styles.nameText} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.messageText} numberOfLines={1}>{item.message}</Text>
        </View>

        {/* Time + Unread badge */}
        <View style={styles.rightCol}>
          <Text style={styles.timeText}>{item.time}</Text>
          {item.unread > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.unread > 99 ? "99+" : item.unread}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  // ── Empty state ──────────────────────────────────────────────
  const ChatEmpty = () => (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="chatbubble-ellipses-outline" size={42} color="#7a9e6e" />
      </View>
      <Text style={styles.emptyTitle}>No Conversations Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start a conversation with a farmer{"\n"}to get fresh updates directly.
      </Text>
    </View>
  );

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4a7c3f" />
      </View>
    );
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <View style={styles.safeArea}>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4a7c3f"]}        // Android
            tintColor="#4a7c3f"          // iOS
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<ChatEmpty />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ChatScreen;

// ─── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea:       { flex: 1, backgroundColor: "#fff" },

  // Row
  row:            { flexDirection: "row", padding: 15, alignItems: "center", backgroundColor: "#fff" },
  avatar:         { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  avatarFallback: {
    width: 50, height: 50, borderRadius: 25, marginRight: 12,
    backgroundColor: "#c8d9b8", alignItems: "center", justifyContent: "center",
  },
  avatarLetter:   { fontSize: 20, fontWeight: "600", color: "#3d6b2a" },
  messageWrapper: { flex: 1 },
  nameText:       { fontSize: 15, fontWeight: "600", color: "#1a1a1a" },
  messageText:    { color: "#888", marginTop: 3, fontSize: 13 },
  rightCol:       { alignItems: "flex-end", gap: 5 },
  timeText:       { fontSize: 11, color: "#bbb" },

  // Badge
  badge:          { backgroundColor: "#4a7c3f", borderRadius: 12, paddingHorizontal: 7, paddingVertical: 2, minWidth: 20, alignItems: "center" },
  badgeText:      { color: "#fff", fontSize: 11, fontWeight: "600" },

  separator: { height: 0.8, backgroundColor: "#f0f0f0", marginLeft: 77 },

  // Delete action
  deleteAction:   { backgroundColor: "#e53935", justifyContent: "center", alignItems: "center", width: 80, gap: 4 },
  deleteText:     { color: "#fff", fontSize: 12, fontWeight: "500" },

  // Loader
  loader:         { flex: 1, justifyContent: "center", alignItems: "center" },

  // Empty state
  emptyWrap:      { alignItems: "center", justifyContent: "center", paddingTop: 100, paddingHorizontal: 40 },
  emptyIconCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: "#eaf3e0", borderWidth: 1.5, borderColor: "#c5ddb4",
    alignItems: "center", justifyContent: "center", marginBottom: 20,
  },
  emptyTitle:     { fontSize: 18, fontWeight: "600", color: "#2c2c2c", marginBottom: 8, textAlign: "center" },
  emptySubtitle:  { fontSize: 14, color: "#aaa", textAlign: "center", lineHeight: 22 },
});