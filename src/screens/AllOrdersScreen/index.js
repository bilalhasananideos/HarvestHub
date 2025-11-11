import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { hp, wp, scale, fontSizes } from '../../theme/responsive';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import CacheImage from '../../components/CacheImage';
import { message, star, location, profile } from '../../assets';

// Demo data
const activeOrders = [
  {
    id: 'BE12345',
    vendor: {
      name: 'Jason Smith Farm',
      image:
        'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400',
      rating: 4.5,
    },
    status: 'In process',
    items: [
      { name: 'Juicy Strawberries', quantity: '1kg', price: 9.5 },
      { name: 'Puddle Duck Eggs', quantity: '24pcs', price: 9.5 },
      { name: 'Organic Watermelon', quantity: '1kg', price: 8.5 },
      { name: 'Organic Cheese', quantity: '1kg', price: 8.5 },
    ],
    deliveryDate: '25 Oct 2025, 5:30 PM',
  },
  {
    id: 'BE12346',
    vendor: {
      name: 'Jason Smith Farm',
      image:
        'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400',
      rating: 4.5,
    },
    status: 'In process',
    items: [
      { name: 'Juicy Strawberries', quantity: '1kg', price: 9.5 },
      { name: 'Puddle Duck Eggs', quantity: '24pcs', price: 9.5 },
      { name: 'Organic Watermelon', quantity: '1kg', price: 8.5 },
      { name: 'Organic Cheese', quantity: '1kg', price: 8.5 },
    ],
    deliveryDate: '25 Oct 2025, 5:30 PM',
  },
];

const orderHistory = [
  {
    id: 'BE12345',
    vendor: {
      name: 'Jason Smith Farm',
      image:
        'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400',
      rating: 4.5,
    },
    status: 'Delivered',
    items: [
      { name: 'Juicy Strawberries', quantity: '1kg', price: 9.5 },
      { name: 'Puddle Duck Eggs', quantity: '24pcs', price: 9.5 },
      { name: 'Organic Watermelon', quantity: '1kg', price: 9.5 },
      { name: 'Organic Cheese', quantity: '1kg', price: 9.5 },
    ],
    deliveryDate: '20 Oct 2025, 3:15 PM',
  },
];

const AllOrdersScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'

  const currentOrders = activeTab === 'active' ? activeOrders : orderHistory;
  const totalCount =
    activeTab === 'active' ? activeOrders.length : orderHistory.length;

  const renderOrderCard = ({ item }) => {
    const totalPrice = item.items.reduce(
      (sum, product) => sum + product.price,
      0,
    );

    return (
      <View style={styles.orderCard}>
        {/* Vendor Header */}
        <View style={styles.vendorHeader}>
          <View style={styles.vendorInfo}>
            <CacheImage url={item.vendor.image} style={styles.vendorAvatar} />
            <View style={styles.vendorDetails}>
              <Text style={styles.vendorName}>{item.vendor.name}</Text>
              <View style={styles.ratingRow}>
                <Image source={star} style={styles.starIcon} />
                <Text style={styles.ratingText}>{item.vendor.rating}</Text>
              </View>
              <Text style={styles.orderId}>Order ID: #{item.id}</Text>
            </View>
          </View>
          <View
            style={[
              styles.statusBadge,
              item.status === 'Delivered'
                ? styles.statusDelivered
                : styles.statusInProcess,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                item.status === 'Delivered'
                  ? styles.statusTextDelivered
                  : styles.statusTextInProcess,
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.itemsContainer}>
          {item.items.map((product, index) => (
            <>
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>
                  {product.name} ({product.quantity})
                </Text>
                <Text style={styles.itemPrice}>
                  ${product.price.toFixed(2)}
                </Text>
              </View>
              {index !== item.items.length - 1 && (
                <View style={styles.itemRowSeparator} />
              )}
            </>
          ))}
        </View>

        {/* Delivery Info */}
        <View style={styles.deliveryContainer}>
          <Text style={styles.deliveryLabel}>Estimated delivery</Text>
          <Text style={styles.deliveryDate}>{item.deliveryDate}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {activeTab === 'active' ? (
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => {
                // Navigate to chat with vendor
                console.log('Chat with vendor');
              }}
            >
              <Image source={message} style={styles.buttonIcon} />
              <Text style={styles.chatButtonText}>Chat with vendor</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={styles.viewProfileButton}
                onPress={() => {
                  // Navigate to vendor profile
                  console.log('View vendor profile');
                }}
              >
                <Image
                  source={profile}
                  style={styles.buttonIcon}
                  tintColor={colors.neutral.black}
                />
                <Text style={styles.viewProfileButtonText}>
                  View vendor profile
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.reorderButton}
                onPress={() => {
                  // Re-order functionality
                  console.log('Re-order');
                }}
              >
                <Text style={styles.reorderButtonText}>Re-order</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
          onPress={() => setActiveTab('active')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'active' && styles.tabTextActive,
            ]}
          >
            Active Orders
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'history' && styles.tabTextActive,
            ]}
          >
            Order History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Total {activeTab === 'active' ? 'active' : 'history'} orders (
          {totalCount})
        </Text>
      </View>

      {/* Orders List */}
      <FlatList
        data={currentOrders}
        renderItem={renderOrderCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        }
      />
    </View>
  );
};

export default AllOrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    paddingTop: hp(1),
    paddingBottom: hp(1.5),
    backgroundColor: colors.background.default,
  },
  tab: {
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
    alignItems: 'center',
    borderRadius: wp(2),
    marginHorizontal: wp(1),
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  tabActive: {
    backgroundColor: colors.primary.main,
  },
  tabText: {
    fontSize: fontSizes.fs14,
    fontFamily: typography.fontFamily.Medium,
    color: colors.text.primary,
  },
  tabTextActive: {
    color: colors.neutral.white,
    fontFamily: typography.fontFamily.Bold,
  },
  header: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    backgroundColor: colors.background.default,
  },
  headerText: {
    fontSize: fontSizes.fs20,
    fontFamily: typography.fontFamily.Medium,
    color: colors.text.primary,
  },
  listContent: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
    backgroundColor: 'white',
  },
  orderCard: {
    backgroundColor: colors.background.white,
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(2),
    shadowColor: colors.overlay.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  vendorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(2),
  },
  vendorInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  vendorAvatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    marginRight: wp(3),
  },
  vendorDetails: {
    flex: 1,
  },
  vendorName: {
    fontSize: fontSizes.fs16,
    fontFamily: typography.fontFamily.Bold,
    color: colors.text.primary,
    marginBottom: hp(0.3),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.3),
  },
  starIcon: {
    width: wp(3.5),
    height: wp(3.5),
    tintColor: '#FFD700',
    marginRight: wp(1),
  },
  ratingText: {
    fontSize: fontSizes.fs12,
    fontFamily: typography.fontFamily.Medium,
    color: colors.text.primary,
  },
  orderId: {
    fontSize: fontSizes.fs11,
    fontFamily: typography.fontFamily.Regular,
    color: colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: wp(4),
    alignSelf: 'flex-start',
  },
  statusInProcess: {
    backgroundColor: colors.status.success + '20',
  },
  statusDelivered: {
    backgroundColor: colors.status.success + '20',
  },
  statusText: {
    fontSize: fontSizes.fs11,
    fontFamily: typography.fontFamily.Medium,
  },
  statusTextInProcess: {
    color: colors.status.success,
  },
  statusTextDelivered: {
    color: colors.status.success,
  },
  itemsContainer: {
    marginBottom: hp(1.5),
    paddingTop: hp(1.5),
    backgroundColor: colors.background.paper,
    paddingHorizontal: wp(2),
    paddingVertical: hp(1.5),
    borderRadius: wp(3),
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  itemName: {
    flex: 1,
    fontSize: fontSizes.fs13,
    fontFamily: typography.fontFamily.Regular,
    color: colors.text.primary,
  },
  itemPrice: {
    fontSize: fontSizes.fs13,
    fontFamily: typography.fontFamily.Medium,
    color: colors.text.primary,
  },
  deliveryContainer: {
    marginBottom: hp(1.5),
    paddingTop: hp(1.5),
  },
  deliveryLabel: {
    fontSize: fontSizes.fs12,
    fontFamily: typography.fontFamily.Regular,
    color: colors.text.secondary,
    marginBottom: hp(0.3),
  },
  deliveryDate: {
    fontSize: fontSizes.fs13,
    fontFamily: typography.fontFamily.Medium,
    color: colors.text.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: wp(2),
    paddingTop: hp(1.5),
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.main,
    borderRadius: wp(3),
    paddingVertical: hp(1.5),
    gap: wp(2),
  },
  buttonIcon: {
    width: wp(4.5),
    height: wp(4.5),
    tintColor: colors.neutral.white,
  },
  chatButtonText: {
    fontSize: fontSizes.fs14,
    fontFamily: typography.fontFamily.Medium,
    color: colors.neutral.white,
  },
  viewProfileButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.paper,
    borderWidth: 1,
    borderColor: colors.border.main,
    borderRadius: wp(3),
    paddingVertical: hp(1.5),
    gap: wp(2),
  },
  viewProfileButtonText: {
    fontSize: fontSizes.fs14,
    fontFamily: typography.fontFamily.Medium,
    color: colors.text.primary,
  },
  reorderButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.main,
    borderRadius: wp(3),
    paddingVertical: hp(1.5),
  },
  reorderButtonText: {
    fontSize: fontSizes.fs14,
    fontFamily: typography.fontFamily.Medium,
    color: colors.neutral.white,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(10),
  },
  emptyText: {
    fontSize: fontSizes.fs16,
    fontFamily: typography.fontFamily.Medium,
    color: colors.text.secondary,
  },
  itemRowSeparator: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: hp(0.5),
    width: '100%',
  },
});
