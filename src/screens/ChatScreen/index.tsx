import React, { useCallback, useLayoutEffect, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { colors } from '../../theme/colors';
import { deleteaccount } from '../../assets';
import { NavigationProp, useNavigation } from '@react-navigation/native';

type ChatItem = {
  id: string;
  name: string;
  message: string;
  time: string;
  avatar: string;
  isActive?: boolean;
};

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

const ChatScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [data] = useState(chatData);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Chat Box',
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  const renderRightActions = useCallback(
    () => (
      <TouchableOpacity style={styles.deleteAction}>
        <Image source={deleteaccount} style={styles.deleteIcon} />
      </TouchableOpacity>
    ),
    [],
  );

  const renderItem = ({ item }: { item: ChatItem }) => (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity
        style={[styles.row, ]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('MessageScreen' ,{item})}
      >
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        </View>
        <View style={styles.messageWrapper}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.messageText} numberOfLines={1}>
            {item.message}
          </Text>
        </View>
        <Text style={styles.timeText}>{item.time}</Text>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.safeArea}>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff96',
  },
  listContent: {
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: colors.neutral.white,
    borderWidth: 1,
    borderColor: colors.border.primary,
    marginHorizontal: 12,
    marginVertical: 8,
    shadowColor: colors.overlay.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  activeRow: {
    borderWidth: 1,
    borderRadius: 12,
    borderStyle: 'dashed',
    borderColor: '#3DA5FF',
    backgroundColor: '#F8FBFF',
  },
  avatarWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    overflow: 'hidden',
    marginRight: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  messageWrapper: {
    flex: 1,
  },
  nameText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  messageText: {
    marginTop: 4,
    fontSize: 12,
    color: colors.text.secondary,
  },
  timeText: {
    fontSize: 11,
    color: colors.text.secondary,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border.primary,
    marginLeft: 82,
  },
  deleteAction: {
    width: 68,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E60017',
    flex: 1,
  },
  deleteIcon: {
    width: 22,
    height: 22,
    tintColor: colors.neutral.white,
  },
});