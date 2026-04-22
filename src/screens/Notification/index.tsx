// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// // ─── Sample Data ───────────────────────────────────────────────
// const INITIAL_NOTIFICATIONS = [
//   {
//     id: '1',
//     icon: 'car-outline',
//     iconColor: '#4a7c3f',
//     title: 'New Farmer Joined Near You',
//     desc: 'Explore fresh produce from a newly joined local farmer.',
//     time: '2m ago',
//     read: false,
//   },
//   {
//     id: '2',
//     icon: 'checkmark-circle-outline',
//     iconColor: '#4a7c3f',
//     title: 'Farmer Updated Their Listings',
//     desc: 'A farmer you follow has added or updated items. Check out what\'s new.',
//     time: '15m ago',
//     read: false,
//   },
//   {
//     id: '3',
//     icon: 'pricetag-outline',
//     iconColor: '#e07b39',
//     title: 'Price Drop Alert',
//     desc: 'Your favorite item just became more affordable. Grab it now!',
//     time: '1h ago',
//     read: false,
//   },
//   {
//     id: '4',
//     icon: 'refresh-circle-outline',
//     iconColor: '#4a7c3f',
//     title: 'Subscription Renewed',
//     desc: 'Your subscription has been successfully renewed.',
//     time: '3h ago',
//     read: true,
//   },
//   {
//     id: '5',
//     icon: 'phone-portrait-outline',
//     iconColor: '#3a7bd5',
//     title: 'App Update Available',
//     desc: "We've improved performance and added new features. Update for the best experience.",
//     time: '1d ago',
//     read: true,
//   },
//   {
//     id: '6',
//     icon: 'refresh-circle-outline',
//     iconColor: '#4a7c3f',
//     title: 'Subscription Renewed',
//     desc: 'Your subscription has been successfully renewed.',
//     time: '2d ago',
//     read: true,
//   },
//   {
//     id: '7',
//     icon: 'leaf-outline',
//     iconColor: '#4a7c3f',
//     title: 'Seasonal Items Available',
//     desc: 'Fresh strawberries and mangoes are now in stock near you.',
//     time: '3d ago',
//     read: true,
//   },
// ];

// // ─── Main Screen ───────────────────────────────────────────────
// export default function NotificationScreen({ navigation }) {
//   const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
//   const [filter, setFilter] = useState('all'); // 'all' | 'unread'

//   const unreadCount = notifications.filter(n => !n.read).length;

//   const visible =
//     filter === 'unread'
//       ? notifications.filter(n => !n.read)
//       : notifications;

//   const markRead = id =>
//     setNotifications(prev =>
//       prev.map(n => (n.id === id ? { ...n, read: true } : n))
//     );

//   const markAllRead = () =>
//     setNotifications(prev => prev.map(n => ({ ...n, read: true })));

//   const dismiss = id =>
//     setNotifications(prev => prev.filter(n => n.id !== id));

//   // ─── Notification Card ────────────────────────────────────────
//   const renderItem = ({ item, index }) => (
//     <TouchableOpacity
//       activeOpacity={0.7}
//       onPress={() => markRead(item.id)}
//       style={[
//         styles.card,
//         !item.read && styles.cardUnread,
//         index === visible.length - 1 && styles.cardLast,
//       ]}
//     >
//       {/* Unread dot */}
//       {!item.read && <View style={styles.dot} />}

//       {/* Icon circle */}
//       <View style={[styles.iconCircle, { backgroundColor: item.read ? '#dce9d4' : '#c6deba' }]}>
//         <Ionicons name={item.icon} size={22} color={item.iconColor} />
//       </View>

//       {/* Text */}
//       <View style={styles.textWrap}>
//         <View style={styles.titleRow}>
//           <Text
//             style={[styles.title, !item.read && styles.titleBold]}
//             numberOfLines={1}
//           >
//             {item.title}
//           </Text>
//           <Text style={styles.time}>{item.time}</Text>
//         </View>
//         <Text style={styles.desc} numberOfLines={2}>
//           {item.desc}
//         </Text>
//       </View>

//       {/* Dismiss button */}
//       <TouchableOpacity
//         onPress={() => dismiss(item.id)}
//         hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//         style={styles.closeBtn}
//       >
//         <Ionicons name="close" size={16} color="#aaa" />
//       </TouchableOpacity>
//     </TouchableOpacity>
//   );

//   // ─── Empty state ──────────────────────────────────────────────
//   const ListEmpty = () => (
//     <View style={styles.emptyWrap}>
//       <Ionicons name="notifications-off-outline" size={52} color="#c0c0c0" />
//       <Text style={styles.emptyText}>No notifications here</Text>
//     </View>
//   );

//   // ─── Render ───────────────────────────────────────────────────
//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />

//       {/* ── Top Bar ── */}
//       {/* <View style={styles.topBar}>
//         <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
//           <Ionicons name="chevron-back" size={24} color="#222" />
//         </TouchableOpacity>
//         <Text style={styles.heading}>Notifications</Text>
//         {unreadCount > 0 ? (
//           <TouchableOpacity onPress={markAllRead}>
//             <Text style={styles.markAll}>Mark all read</Text>
//           </TouchableOpacity>
//         ) : (
//           <View style={{ width: 80 }} />
//         )}
//       </View> */}

//       {/* ── Unread badge ── */}
//       {unreadCount > 0 && (
//         <View style={styles.badgeRow}>
//           <View style={styles.badge}>
//             <Ionicons name="ellipse" size={8} color="#4a7c3f" />
//             <Text style={styles.badgeText}>{unreadCount} unread</Text>
//           </View>
//         </View>
//       )}

//       {/* ── Filter tabs ── */}
//       <View style={styles.tabs}>
//         {['all', 'unread'].map(f => (
//           <TouchableOpacity
//             key={f}
//             onPress={() => setFilter(f)}
//             style={[styles.tab, filter === f && styles.tabActive]}
//           >
//             <Text style={[styles.tabText, filter === f && styles.tabTextActive]}>
//               {f === 'all' ? 'All' : `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* ── List ── */}
//       <FlatList
//         data={visible}
//         keyExtractor={item => item.id}
//         renderItem={renderItem}
//         ListEmptyComponent={ListEmpty}
//         contentContainerStyle={visible.length === 0 && styles.emptyContainer}
//         showsVerticalScrollIndicator={false}
//         style={styles.list}
//       />
//     </SafeAreaView>
//   );
// }

// // ─── Styles ────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },

//   // Top bar
//   topBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 0.5,
//     borderBottomColor: '#e8e8e8',
//   },
//   backBtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#f5f5f5',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   heading: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1a1a1a',
//   },
//   markAll: {
//     fontSize: 13,
//     fontWeight: '500',
//     color: '#4a7c3f',
//     width: 80,
//     textAlign: 'right',
//   },

//   // Unread badge row
//   badgeRow: {
//     paddingHorizontal: 16,
//     paddingTop: 10,
//   },
//   badge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 5,
//     alignSelf: 'flex-start',
//     backgroundColor: '#edf5e8',
//     borderRadius: 20,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//   },
//   badgeText: {
//     fontSize: 12,
//     color: '#4a7c3f',
//     fontWeight: '500',
//   },

//   // Filter tabs
//   tabs: {
//     flexDirection: 'row',
//     gap: 8,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   tab: {
//     paddingHorizontal: 18,
//     paddingVertical: 7,
//     borderRadius: 20,
//     backgroundColor: '#f5f5f5',
//     borderWidth: 0.5,
//     borderColor: '#e0e0e0',
//   },
//   tabActive: {
//     backgroundColor: '#dcebd4',
//     borderColor: '#b5d4a8',
//   },
//   tabText: {
//     fontSize: 13,
//     color: '#888',
//   },
//   tabTextActive: {
//     color: '#3d6b2a',
//     fontWeight: '600',
//   },

//   // List
//   list: {
//     flex: 1,
//   },

//   // Card
//   card: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     borderBottomWidth: 0.5,
//     borderBottomColor: '#f0f0f0',
//     backgroundColor: '#fff',
//     position: 'relative',
//   },
//   cardUnread: {
//     backgroundColor: '#f7fbf4',
//   },
//   cardLast: {
//     borderBottomWidth: 0,
//   },

//   // Unread dot
//   dot: {
//     position: 'absolute',
//     top: 20,
//     left: 6,
//     width: 7,
//     height: 7,
//     borderRadius: 4,
//     backgroundColor: '#4a7c3f',
//   },

//   // Icon
//   iconCircle: {
//     width: 46,
//     height: 46,
//     borderRadius: 23,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//     flexShrink: 0,
//   },

//   // Text
//   textWrap: {
//     flex: 1,
//     marginRight: 8,
//   },
//   titleRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     gap: 6,
//     marginBottom: 3,
//   },
//   title: {
//     flex: 1,
//     fontSize: 14,
//     fontWeight: '400',
//     color: '#1a1a1a',
//     lineHeight: 20,
//   },
//   titleBold: {
//     fontWeight: '600',
//   },
//   desc: {
//     fontSize: 13,
//     color: '#777',
//     lineHeight: 19,
//   },
//   time: {
//     fontSize: 11,
//     color: '#bbb',
//     marginTop: 2,
//     flexShrink: 0,
//   },

//   // Close
//   closeBtn: {
//     marginTop: 2,
//     padding: 2,
//   },

//   // Empty
//   emptyContainer: {
//     flex: 1,
//   },
//   emptyWrap: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingTop: 80,
//     gap: 12,
//   },
//   emptyText: {
//     fontSize: 14,
//     color: '#bbb',
//   },
// });


import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getNotificationsApi } from '../../store/services/Services';

// ─── Type → Icon mapping ───────────────────────────────────────
const getIconByType = type => {
  switch (type) {
    case 'order':        return 'bag-check-outline';
    case 'farm_visit':   return 'leaf-outline';
    case 'price_drop':   return 'pricetag-outline';
    case 'subscription': return 'refresh-circle-outline';
    case 'farmer':       return 'car-outline';
    case 'update':       return 'phone-portrait-outline';
    default:             return 'notifications-outline';
  }
};

// ─── Time formatter ────────────────────────────────────────────
const timeAgo = dateStr => {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)         return `${diff}s ago`;
  if (diff < 3600)       return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)      return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800)     return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

// ─── Icon Component (image jaisi style) ───────────────────────
// const NotifIcon = ({ type }) => (
//   <View style={circleStyles.outer}>
//     <View style={circleStyles.inner}>
//       <Ionicons name={getIconByType(type)} size={22} color="#2c2c2c" />
//     </View>
//   </View>
// );
const NotifIcon = () => (
  <View style={circleStyles.outerCircle}>
      <View style={circleStyles.innerCircle}>
        <Text style={circleStyles.tick}>✓</Text>
      </View>
  </View>
);

const circleStyles = StyleSheet.create({
  outer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#c8d9b8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  inner: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.8,
    borderColor: '#2c2c2c',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },

  outerCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#c8d9b8',   // light green background
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  innerCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#2c2c2c',       // dark ring
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tick: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c2c2c',             // dark tick
    lineHeight: 20,
  },
});

// ─── Main Screen ───────────────────────────────────────────────
export default function NotificationScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter]               = useState('all');
  const [loading, setLoading]             = useState(true);
  const [refreshing, setRefreshing]       = useState(false);
  const [error, setError]                 = useState(null);

  // ── Fetch ────────────────────────────────────────────────────
  const fetchNotifications = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);

      const resp = await getNotificationsApi();
      console.log('res', resp)

      if (resp?.status && Array.isArray(resp.data)) {
        // Map API fields → local shape
        const mapped = resp.data.map(n => ({
          id:       String(n.id),
          title:    n.title,
          desc:     n.body,
          type:     n.data?.type || 'default',
          time:     timeAgo(n.created_at),
          read:     !!n.is_read,
          rawData:  n.data,
        }));
        setNotifications(mapped);
      } else {
        setError('Could not load notifications.');
      }
    } catch (err) {
      console.log('Notification fetch error:', err);
      setError('Something went wrong. Pull down to retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, []);

  // ── Local actions ────────────────────────────────────────────
  const markRead    = id => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = ()  => setNotifications(p => p.map(n => ({ ...n, read: true })));
  const dismiss     = id => setNotifications(p => p.filter(n => n.id !== id));

  const unreadCount = notifications.filter(n => !n.read).length;
  const visible     = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  // ── Card ─────────────────────────────────────────────────────
  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => markRead(item.id)}
      style={[
        styles.card,
        !item.read && styles.cardUnread,
        index === visible.length - 1 && styles.cardLast,
      ]}
    >
      {/* {!item.read && <View style={styles.dot} />} */}

      <NotifIcon type={item.type} />

      <View style={styles.textWrap}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, !item.read && styles.titleBold]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.desc} numberOfLines={2}>{item.desc}</Text>
      </View>

      <TouchableOpacity
        onPress={() => dismiss(item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.closeBtn}
      >
        <Ionicons name="close" size={16} color="#aaa" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // ── Loading state ────────────────────────────────────────────
  const ListHeader = () => null;

  const ListEmpty = () => {
    if (loading) return null;
    if (error) return (
      <View style={styles.emptyWrap}>
        <Ionicons name="cloud-offline-outline" size={56} color="#d0d0d0" />
        <Text style={styles.emptyTitle}>Oops!</Text>
        <Text style={styles.emptyText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => fetchNotifications()}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
    return (
      <View style={styles.emptyWrap}>
        <Ionicons name="notifications-off-outline" size={56} color="#d0d0d0" />
        <Text style={styles.emptyTitle}>All caught up!</Text>
        <Text style={styles.emptyText}>
          {filter === 'unread'
            ? 'No unread notifications right now.'
            : "You don't have any notifications yet."}
        </Text>
      </View>
    );
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Unread badge */}
      {unreadCount > 0 && (
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Ionicons name="ellipse" size={8} color="#4a7c3f" />
            <Text style={styles.badgeText}>{unreadCount} unread</Text>
          </View>
        </View>
      )}

      {/* Filter tabs */}
      <View style={styles.tabs}>
        {['all', 'unread'].map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.tab, filter === f && styles.tabActive]}
          >
            <Text style={[styles.tabText, filter === f && styles.tabTextActive]}>
              {f === 'all' ? 'All' : `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Loading spinner */}
      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#4a7c3f" />
          <Text style={styles.loaderText}>Loading notifications…</Text>
        </View>
      ) : (
        <FlatList
          data={visible}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListEmptyComponent={ListEmpty}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={visible.length === 0 && styles.emptyContainer}
          showsVerticalScrollIndicator={false}
          style={styles.list}
          refreshing={refreshing}
          onRefresh={() => fetchNotifications(true)}
        />
      )}
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: '#fff' },

  topBar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 0.5, borderBottomColor: '#e8e8e8',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#f5f5f5',
    alignItems: 'center', justifyContent: 'center',
  },
  heading:  { fontSize: 18, fontWeight: '600', color: '#1a1a1a' },
  markAll:  { fontSize: 13, fontWeight: '500', color: '#4a7c3f', textAlign: 'right' },

  badgeRow: { paddingHorizontal: 16, paddingTop: 10 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    alignSelf: 'flex-start', backgroundColor: '#edf5e8',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  badgeText: { fontSize: 12, color: '#4a7c3f', fontWeight: '500' },

  tabs: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  tab: {
    paddingHorizontal: 18, paddingVertical: 7, borderRadius: 20,
    backgroundColor: '#f5f5f5', borderWidth: 0.5, borderColor: '#e0e0e0',
  },
  tabActive:     { backgroundColor: '#dcebd4', borderColor: '#b5d4a8' },
  tabText:       { fontSize: 13, color: '#888' },
  tabTextActive: { color: '#3d6b2a', fontWeight: '600' },

  list: { flex: 1 },

  card: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff', position: 'relative',
  },
  cardUnread: { backgroundColor: '#f7fbf4' },
  cardLast:   { borderBottomWidth: 0 },

  dot: {
    position: 'absolute', top: 20, left: 6,
    width: 7, height: 7, borderRadius: 4, backgroundColor: '#4a7c3f',
  },

  textWrap:  { flex: 1, marginRight: 8 },
  titleRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', gap: 6, marginBottom: 3,
  },
  title:     { flex: 1, fontSize: 14, fontWeight: '400', color: '#1a1a1a', lineHeight: 20 },
  titleBold: { fontWeight: '600' },
  desc:      { fontSize: 13, color: '#777', lineHeight: 19 },
  time:      { fontSize: 11, color: '#bbb', marginTop: 2, flexShrink: 0 },
  closeBtn:  { marginTop: 2, padding: 2 },

  loaderWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loaderText: { fontSize: 14, color: '#aaa' },

  emptyContainer: { flex: 1 },
  emptyWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingTop: 80, paddingHorizontal: 32, gap: 10,
  },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: '#555', marginTop: 4 },
  emptyText:  { fontSize: 13, color: '#aaa', textAlign: 'center', lineHeight: 20 },
  retryBtn: {
    marginTop: 8, paddingHorizontal: 24, paddingVertical: 10,
    backgroundColor: '#edf5e8', borderRadius: 20,
    borderWidth: 1, borderColor: '#b5d4a8',
  },
  retryText: { fontSize: 14, color: '#4a7c3f', fontWeight: '500' },
});