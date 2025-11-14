import { StyleSheet, Text, TouchableOpacity, View, Image, Pressable, ScrollView, FlatList, NativeScrollEvent, NativeSyntheticEvent, Animated } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { fontSizes, hp, scale, wp } from '../../theme/responsive';
import CacheImage from '../../components/CacheImage';
import { cart, scope, star, location, truck } from '../../assets';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

// Demo data
const demoData = {
  categories: [
    { id: '1', name: 'Fruits', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300' },
    { id: '2', name: 'Vegetables', image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=300' },
    { id: '3', name: 'Meat & Poultry', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300' },
    { id: '4', name: 'Dairy', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300' },
    { id: '5', name: 'Grains & Pulses', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300' },
    { id: '6', name: 'Honey & Jams', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784210?w=300' },
  ],
  popularProducts: [
    { id: '1', name: 'Pickles', image: 'https://images.unsplash.com/photo-1589621316382-008455b857cd?w=200' },
    { id: '2', name: 'Spice', image: 'https://images.unsplash.com/photo-1596040033229-a0b4fae8c50e?w=200' },
    { id: '3', name: 'Pies', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=200' },
    { id: '4', name: 'Herbs', image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=200' },
    { id: '5', name: 'Eggs', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200' },
  ],
  farmers: [
    {
      id: '1',
      name: 'Jason Smith Farm',
      image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400',
      rating: 4.5,
      reviews: '204+',
      distance: '2.6 miles away',
      visitAvailable: true,
    },
    {
      id: '2',
      name: 'Jason Smith Farm',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
      rating: 4.5,
      reviews: '204+',
      distance: '2.6 miles away',
      visitAvailable: true,
    },
    {
      id: '3',
      name: 'Jason Smith Farm',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
      rating: 4.5,
      reviews: '204+',
      distance: '2.6 miles away',
      visitAvailable: true,
    },
    {
      id: '4',
      name: 'Jason Smith Farm',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
      rating: 4.5,
      reviews: '204+',
      distance: '2.6 miles away',
      visitAvailable: true,
    },
    {
      id: '5',
      name: 'Jason Smith Farm',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
      rating: 4.5,
      reviews: '204+',
      distance: '2.6 miles away',
      visitAvailable: true,
    },
  ],
};

const Home = ({navigation}: {navigation: any}) => {
  const exploreFarmersRef = useRef<View>(null);
  const [exploreFarmersY, setExploreFarmersY] = useState(0);
  const [stickyHeaderVisible, setStickyHeaderVisible] = useState(false);
  
  // Animated values for smooth transitions
  const headerHeight = useRef(new Animated.Value(hp('22'))).current;
  const headerContentOpacity = useRef(new Animated.Value(1)).current;
  const exploreFarmersOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (stickyHeaderVisible) {
      // Animate header to small size and show "Explore Farmers"
      Animated.parallel([
        Animated.timing(headerHeight, {
          toValue: hp('15'),
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(headerContentOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(exploreFarmersOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate header back to large size
      Animated.parallel([
        Animated.timing(headerHeight, {
          toValue: hp('22'),
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(headerContentOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(exploreFarmersOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [stickyHeaderVisible]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    // Show sticky header when scrolled past the Explore Farmers section
    // The layout y gives position relative to ScrollView content, so we compare directly
    // Account for header height so the sticky header appears when section reaches top
    const threshold = exploreFarmersY - hp(2);
    if (exploreFarmersY > 0 && offsetY >= threshold) {
      if (!stickyHeaderVisible) {
        setStickyHeaderVisible(true);
      }
    } else {
      if (stickyHeaderVisible) {
        setStickyHeaderVisible(false);
      }
    }
  };

  const handleExploreFarmersLayout = (event: any) => {
    const { y } = event.nativeEvent.layout;
    // y is the position relative to the ScrollView's content
    setExploreFarmersY(y);
  };

  const renderProductItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.productCard}>
      <CacheImage url={item.image} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
    </TouchableOpacity>
  );

 

  return (
    <View style={styles.container}>
      {/* Compact Header */}
       <Animated.View style={[styles.headerBg, { height: headerHeight }]}>
         <View style={styles.headerContentCompact}>
           {/* User info row - animated opacity */}
           <Animated.View 
             style={[
               styles.headerRowCompact,
               { opacity: headerContentOpacity }
             ]}
             pointerEvents={stickyHeaderVisible ? 'none' : 'auto'}
           >
             <CacheImage
               url={'https://randomuser.me/api/portraits/men/1.jpg'}
               style={styles.avatar}
             />
             <View style={{ flex: 1, marginLeft: 10 }}>
               <Text style={styles.headerTitleCompact}>Hello, Samuel</Text>
               <Text style={styles.headerDateCompact}>Mon 16 Sept</Text>
             </View>
             <TouchableOpacity
               style={styles.cartBtn}
               onPress={() => navigation.navigate('Cart')}
             >
               <View style={styles.cartBox}>
                 <Image source={cart} style={styles.cartIconReal} />
                 <View style={styles.cartBadgeReal}>
                   <Text style={styles.cartBadgeTextReal}>3</Text>
                 </View>
               </View>
             </TouchableOpacity>
           </Animated.View>
           
    
           
           {/* Search Bar inside header */}
           <Pressable
             onPress={() => navigation.navigate('SearchScreen')}
             style={styles.searchBarContainerCompact}
           >
             <Image source={scope} style={styles.searchIcon} />
             <Text style={styles.searchBarCompact}>Search farms OR browse categories</Text>
           </Pressable>
         </View>
       </Animated.View>

      {/* Sticky Header for Explore Farmers */}
      <Animated.View 
        style={[
          styles.stickyHeader,
          {
            opacity: exploreFarmersOpacity,
            transform: [{
              translateY: exploreFarmersOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            }],
          }
        ]}
        pointerEvents={stickyHeaderVisible ? 'auto' : 'none'}
      >
        <Text style={styles.stickyHeaderText}>Explore Farmers</Text>
      </Animated.View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What are you looking for?</Text>
          <View style={styles.categoriesGrid}>
            {demoData.categories.map((item) => (
              <TouchableOpacity key={item.id} style={styles.categoryCard}>
                <CacheImage url={item.image} style={styles.categoryImage} />
                <Text style={styles.categoryName}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Products */}
        <View style={[styles.section,{borderTopWidth:1,borderBottomWidth:1,borderColor:'rgba(217, 217, 217, 1)',paddingVertical:15},]}>
          <Text style={styles.sectionTitle}>Popular products</Text>
          <FlatList
            data={demoData.popularProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
          />
        </View>


        {/* Explore Farmers */}
        <View 
          ref={exploreFarmersRef}
          style={styles.section}
          onLayout={handleExploreFarmersLayout}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore Farmers</Text>
            {/* <TouchableOpacity style={styles.sortBtn}>
              <Text style={styles.sortText}>Sort</Text>
              <Text style={styles.sortArrow}>▼</Text>
            </TouchableOpacity> */}
          </View>
          <View style={styles.farmersGrid}>
            {demoData.farmers.map((item) => (
              <TouchableOpacity key={item.id} style={styles.farmerCard}>
                <CacheImage url={item.image} style={styles.farmerImage} />
                <View style={styles.farmerInfo}>
                  <Text style={styles.farmerName}>{item.name}</Text>
                  <View style={styles.farmerRating}>
                    <Image source={star} style={styles.starIconSmall} />
                    <Text style={styles.ratingText}>{item.rating} ({item.reviews})</Text>
                  </View>
                  <View style={styles.farmerDistance}>
                    <Image source={location} style={styles.locationIconSmall} />
                    <Text style={styles.distanceText}>{item.distance}</Text>
                  </View>
                  <View style={styles.farmerVisit}>
                    <View style={styles.checkIcon} />
                    <Text style={styles.visitText}>Farm visit available</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.light,
  },
    headerBg: {
    width: wp('100'),
    height: hp('23'),
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: colors.primary.main,
  },
  headerContentCompact: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingTop: hp(2),
    paddingBottom: hp(1.5),
    paddingHorizontal: wp(4),
  },
  headerRowCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
    minHeight: hp(6),
  },
   headerTitleCompact: {
    color: '#FFD44A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerDateCompact: {
    color: '#fff',
    fontSize: 13,
    marginTop: 2,
  },
   cartBtn: {
    marginLeft: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    borderRadius: wp(3),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.8),
    minWidth: wp(11),
    minHeight: hp(4),
    justifyContent: 'center',
    shadowColor: colors.overlay.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cartIconReal: {
    width: wp(5.5),
    height: wp(5.5),
    tintColor: colors.text.primary,
  },
  cartBadgeReal: {
    position: 'absolute',
    top: -wp(1.5),
    right: -wp(1.5),
    backgroundColor: colors.status.error,
    borderRadius: wp(2.5),
    minWidth: wp(5),
    minHeight: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background.paper,
    zIndex: 2,
    paddingHorizontal: wp(0.5),
  },
  cartBadgeTextReal: {
    color: colors.text.inverse,
    fontSize: scale(11),
    fontFamily: typography.fontFamily.Bold,
    textAlign: 'center',
  },
  searchIcon: {
    width: wp(5.5),
    height: wp(5.5),
    tintColor:'white'
  },
  searchBarContainerCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: wp(6),
    paddingHorizontal: wp(4),
    marginTop: hp(0.5),
    height: hp(6),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    marginBottom: hp(0.5),
  },
  searchBarCompact: {
    flex: 1,
    color: 'white',
    fontSize: fontSizes.fs15,
    paddingLeft: wp(2),
    fontFamily: typography.fontFamily.Regular,
  },
  header: {
    backgroundColor: '#B85C38',
    paddingTop: hp(5),
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(2),
  },
  userInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    marginRight: wp(3),
  },
  userDetails: {
    flex: 1,
  },
  greeting: {
    fontSize: scale(18),
    fontFamily: typography.fontFamily.Bold,
    color: '#FFFFFF',
    marginBottom: hp(0.5),
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  locationIcon: {
    width: wp(3.5),
    height: wp(3.5),
    tintColor: '#FFFFFF',
    marginRight: wp(1),
  },
  locationText: {
    fontSize: scale(12),
    fontFamily: typography.fontFamily.Regular,
    color: '#FFFFFF',
    marginRight: wp(1),
  },
  changeLocation: {
    fontSize: scale(11),
    fontFamily: typography.fontFamily.Medium,
    color: '#FFD700',
    textDecorationLine: 'underline',
  },
  notificationBtn: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    width: wp(5),
    height: wp(5),
    tintColor: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.2),
  },
 
  searchPlaceholder: {
    flex: 1,
    fontSize: scale(13),
    fontFamily: typography.fontFamily.Regular,
    color: '#999',
  },
  addBtn: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(3),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(2),
  },
  addBtnText: {
    fontSize: scale(28),
    color: '#B85C38',
    marginTop: -4,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: hp(2.5),
    paddingHorizontal: wp(4),

  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  sectionTitle: {
    fontSize: fontSizes.fs18,
    fontFamily: typography.fontFamily.SemiBold,
    color: '#333',
    fontWeight:'700',
    marginBottom: hp(1.5),
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sortText: {
    fontSize: scale(13),
    fontFamily: typography.fontFamily.Medium,
    color: '#666',
    marginRight: wp(1),
  },
  sortArrow: {
    fontSize: scale(10),
    color: '#666',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: wp(28),
    backgroundColor: '#FFFFFF',
    borderRadius: wp(3),
    padding: wp(2),
    marginBottom: hp(1.5),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryImage: {
    width: wp(24),
    height: wp(20),
    borderRadius: wp(2),
    marginBottom: hp(0.8),
  },
  categoryName: {
    fontSize: fontSizes.fs12,
    fontFamily: typography.fontFamily.Medium,
    fontWeight:'500',
    color: '#333',
    textAlign: 'center',
  },
  productsList: {
    paddingRight: wp(4),
    paddingVertical:1
  },
  productCard: {
    width: wp(24),
    backgroundColor: '#FFFFFF',
    borderRadius: wp(3),
    padding: wp(2),
    marginRight: wp(3),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  productImage: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(2),
    marginBottom: hp(0.8),
  },
  productName: {
    fontSize: fontSizes.fs12,
    fontFamily: typography.fontFamily.Medium,
    fontWeight:'500',
    color: '#333',
    textAlign: 'center',
  },
  farmersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  farmerCard: {
    width: wp(43),
    backgroundColor: '#FFFFFF',
    borderRadius: wp(3),
    marginBottom: hp(2),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  farmerImage: {
    width: '100%',
    height: hp(16),
  },
  farmerInfo: {
    padding: wp(3),
  },
  farmerName: {
        fontSize: fontSizes.fs12,
    fontWeight:'500',
    fontFamily: typography.fontFamily.Bold,
    color: '#333',
    marginBottom: hp(0.8),
  },
  farmerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  starIconSmall: {
    width: wp(3.5),
    height: wp(3.5),
    tintColor: '#FFD700',
    marginRight: wp(1),
  },
  ratingText: {
    fontSize: scale(11),
    fontFamily: typography.fontFamily.Regular,
    color: '#666',
  },
  farmerDistance: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  locationIconSmall: {
    width: wp(3.5),
    height: wp(3.5),
    tintColor: '#999',
    marginRight: wp(1),
  },
  distanceText: {
    fontSize: scale(11),
    fontFamily: typography.fontFamily.Regular,
    color: '#666',
  },
  farmerVisit: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    width: wp(3.5),
    height: wp(3.5),
    borderRadius: wp(1.75),
    backgroundColor: '#4CAF50',
    marginRight: wp(1),
  },
  visitText: {
    fontSize: scale(11),
    fontFamily: typography.fontFamily.Regular,
    color: '#666',
  },
  stickyHeader: {
    position: 'absolute',
    top: hp('15'),
    left: 0,
    right: 0,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(217, 217, 217, 1)',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  stickyHeaderText: {
    fontSize: fontSizes.fs18,
    fontFamily: typography.fontFamily.SemiBold,
    color: '#333',
    fontWeight: '700',
  },
});
