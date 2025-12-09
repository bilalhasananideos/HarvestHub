import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { colors } from '../../theme/colors';
import { hp, wp, scale, fontSizes } from '../../theme/responsive';
import { typography } from '../../theme/typography';
import CacheImage from '../../components/CacheImage';
import {
  arrowleft,
  star,
  location,
  plus,
  scope,
  filter,
  timedate,
  profile,
  calender,
  clock,
  note,
} from '../../assets';
import { getVendorProfileApi, visitFarmApi } from '../../store/services/Services';

const VendorProfile = ({ route }: any) => {
  const navigation = useNavigation<any>();
  const { vendorProfileId } = route.params;
  const [activeTab, setActiveTab] = useState('Products');
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const vendorSectionRef = useRef<View>(null);
  const [vendorSectionY, setVendorSectionY] = useState(0);

  // Header height (navigation header is typically 44-56px + status bar)

  // Vendor data
  const vendor = {
    name: 'Jason Smith Farm',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400',
    rating: 4.0,
    reviews: 52,
    address: '29 Cooper Square, New York',
    farmVisitAvailable: true, // Set to false to see "not available" state
  };

  // Reviews data
  const reviews = [
    {
      id: '1',
      name: 'Courtney Henry',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      rating: 5,
      time: '2 mins ago',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: '2',
      name: 'Cameron Williamson',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      rating: 4,
      time: '1 hour ago',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: '3',
      name: 'Jane Cooper',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      rating: 4,
      time: '3 hours ago',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
  ];

  // Rating breakdown
  const ratingBreakdown = {
    5: 20,
    4: 15,
    3: 10,
    2: 5,
    1: 2,
  };

  // Farm visit form state
  const [farmVisitForm, setFarmVisitForm] = useState({
    name: '',
    date: '',
    time: '',
    note: '',
  });

  // Products data
  const products = [
    {
      id: '1',
      name: 'Organic watermelon',
      subtitle: 'chemical free.',
      image: 'https://images.unsplash.com/photo-1558818498-28c1e002b655?w=400',
      weight: '2.5 kg',
      price: 8.99,
    },
    {
      id: '2',
      name: 'Juicy organic strawberries',
      subtitle: 'grown naturally.',
      image:
        'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400',
      weight: '2.5 kg',
      price: 8.99,
    },
    {
      id: '3',
      name: 'Farm-made organic cheese',
      subtitle: 'free additives.',
      image:
        'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400',
      weight: '1 kg',
      price: 6.35,
    },
    {
      id: '4',
      name: 'Pure milk',
      subtitle: 'creamy and fresh from the farm.',
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
      weight: '1 kg',
      price: 2.75,
    },
    {
      id: '4',
      name: 'Pure milk',
      subtitle: 'creamy and fresh from the farm.',
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
      weight: '1 kg',
      price: 2.75,
    },
    {
      id: '5',
      name: 'Pure milk',
      subtitle: 'creamy and fresh from the farm.',
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
      weight: '1 kg',
      price: 2.75,
    },
    {
      id: '6',
      name: 'Pure milk',
      subtitle: 'creamy and fresh from the farm.',
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
      weight: '1 kg',
      price: 2.75,
    },
    {
      id: '4',
      name: 'Pure milk',
      subtitle: 'creamy and fresh from the farm.',
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
      weight: '1 kg',
      price: 2.75,
    },
  ];

  const tabs = ['Products', 'Reviews', 'Farm visit'];
  const [loading, setLoading] = useState(false);
  
  // const [vendorInfo, setVendorInfo] = useState(null);
  const [vendorInfo, setVendorInfo] = useState({
    id: "",
    name: "",
    image: "",
    farm_visit: 0,
    address: "",
  });
  // const [ratingInfo, setRatingInfo] = useState(null);
  const [ratingInfo, setRatingInfo] = useState({ average: 0, total: 0 });
  const [products1, setProducts] = useState([]);
  const [reviews1, setReviews] = useState([]);
  const [ratingBreakdown1, setRatingBreakdown] = useState({ 1:0, 2:0, 3:0, 4:0, 5:0 });

  useEffect(() => {
    getVendorProfile();
  }, [activeTab])
  
  const getVendorProfile = async () => {
    try {
      setLoading(true);

      let params: any = {};

      if (activeTab === "Products") params = { products: true };
      if (activeTab === "Reviews") params = { reviews: true };  
      
      const resp = await getVendorProfileApi(vendorProfileId, params);
      console.log("Api resp", resp);
            
      /** MAP API RESPONSE TO STATES */
      // // setVendorInfo(resp.vendor || null);
      // // setRatingInfo(resp.rating || null);

      // setVendorInfo({
      //   id: resp.vendor?.id || "",
      //   name: resp.vendor?.name || "",
      //   image: resp.vendor?.image || "",
      //   farm_visit: resp.vendor?.farm_visit || 0,
      //   address: resp.vendor?.address || "",
      // });
      
      // setRatingInfo({
      //   average: resp.rating?.average || 0,
      //   total: resp.rating?.total || 0,
      // });      

      // if (resp.products && activeTab === "Products") {
      //   setProducts(resp.products);
      // }

      // if (resp.reviews && activeTab === "Reviews") {
      //   setReviews(resp.reviews);
      // }

      const data = mapVendorProfile(resp);

      setVendorInfo(data.vendorInfo);
      setRatingInfo(data.ratingInfo);

      if (activeTab === "Products") setProducts(data.products);
      if (activeTab === "Reviews") {
        setRatingBreakdown(resp.breakdown || { 1:0, 2:0, 3:0, 4:0, 5:0 });
        setReviews(resp.reviews || []);
      }
      

    } catch (err) {
      console.log("err", err);
    } finally {
      setLoading(false);
    }
  };

  const mapVendorProfile = (resp) => ({
    vendorInfo: {
      id: resp.vendor?.id || "",
      name: resp.vendor?.name || "",
      image: resp.vendor?.image || "",
      farm_visit: resp.vendor?.farm_visit || 0,
      address: resp.vendor?.address || "",
    },
    ratingInfo: {
      average: resp.rating?.average || 0,
      total: resp.rating?.total || 0,
    },
    products: resp.products || [],
    reviews: resp.reviews || [],
  });

  const onSubmitFarmVisit = async () => {
    try {
      setLoading(true);

      const payload = {
        vendor_id: vendorInfo.id,
        name: farmVisitForm.name,
        visit_date: farmVisitForm.date,
        visit_time: farmVisitForm.time,
        note: farmVisitForm.note,
      };
      console.log("payload", payload)  

      const resp = await visitFarmApi(payload);
      console.log("Review Response:", resp);

      // Optional: clear form
      setFarmVisitForm({
        name: '',
        date: '',
        time: '',
        note: '',
      });

    } catch (err) {
      console.log("Review Error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    // When scrolled past the vendor section (including tabs), make tabs sticky
    const threshold = vendorSectionY;
    if (vendorSectionY > 0 && offsetY >= threshold) {
      if (!isTabsSticky) {
        setIsTabsSticky(true);
      }
    } else {
      if (isTabsSticky) {
        setIsTabsSticky(false);
      }
    }
  };

  const handleVendorSectionLayout = (event: any) => {
    const { y, height } = event.nativeEvent.layout;
    // Store the bottom position of vendor section + tabs height
    // Tabs are approximately hp(6) in height
    setVendorSectionY(y + height + hp(6));
  };

  // const renderProduct = ({ item }: { item: any }) => (
  //   <TouchableOpacity
  //     onPress={() => navigation.navigate('ProductDetailScreen')}
  //     style={styles.productCard}
  //   >
  //     <View style={styles.productImageContainer}>
  //       <CacheImage url={item.image} style={styles.productImage} />
  //       <TouchableOpacity style={styles.addButton}>
  //         <Image source={plus} style={styles.addButtonIcon} />
  //       </TouchableOpacity>
  //     </View>
  //     <Text style={styles.productName}>{item.name}</Text>
  //     <Text style={styles.productSubtitle}>{item.subtitle}</Text>
  //     <View style={styles.productFooter}>
  //       <Text style={styles.productWeight}>{item.weight}</Text>
  //       <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
  //     </View>
  //   </TouchableOpacity>
  // );
  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('ProductDetailScreen', {
        item
      })}
      style={styles.productCard}
    >
      <View style={styles.productImageContainer}>
        <CacheImage url={item.images?.[0]?.image} style={styles.productImage} />
        <TouchableOpacity style={styles.addButton}>
          <Image source={plus} style={styles.addButtonIcon} />
         </TouchableOpacity>
      </View>  
      <Text style={styles.productName}>{item.product?.name}</Text>
      <Text style={styles.productSubtitle}>{item.description}</Text>
      <View style={styles.productFooter}>
        <Text style={styles.productWeight}>{item.count} {item.unit?.name}</Text>
        <Text style={styles.productPrice}>Rs {item.price}</Text>
      </View>
    </TouchableOpacity>
  );  

  return (
    <View style={styles.container}>
      {/* Overlay Loader */}
      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      )}
      {/* Sticky Tabs */}
      {isTabsSticky && (
        <View style={[styles.stickyTabsContainer]}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Vendor Profile Section */}
        {/* <View
          ref={vendorSectionRef}
          style={styles.vendorSection}
          onLayout={handleVendorSectionLayout}
        >
          <CacheImage url={vendor.image} style={styles.vendorImage} />
          <View style={styles.vendorInfo}>
            <Text style={styles.vendorName}>{vendor.name}</Text>
            <View style={styles.ratingRow}>
              <Image source={star} style={styles.starIcon} />
              <Text style={styles.ratingText}>
                {vendor.rating} ({vendor.reviews}) reviews
              </Text>
            </View>
            <View style={styles.visitRow}>
              {vendor.farmVisitAvailable ? (
                <>
                  <View style={styles.checkIcon}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                  <Text style={styles.visitText}>Farm visit available</Text>
                </>
              ) : (
                <>
                  <View style={styles.unavailableIcon}>
                    <Text style={styles.unavailableText}>—</Text>
                  </View>
                  <Text style={styles.visitText}>Farm visit not available</Text>
                </>
              )}
            </View>
            <View style={styles.locationRow}>
              <Image source={location} style={styles.locationIcon} />
              <Text style={styles.addressText}>{vendor.address}</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewMapText}>View on map</Text>
            </TouchableOpacity>
          </View>
        </View> */}
        <View 
          ref={vendorSectionRef}
          style={styles.vendorSection}
          onLayout={handleVendorSectionLayout}
        >
          <CacheImage url={vendorInfo.image} style={styles.vendorImage} />
          <View style={styles.vendorInfo}>
            <Text style={styles.vendorName}>{vendorInfo.name}</Text>

            <View style={styles.ratingRow}>
              <Image source={star} style={styles.starIcon} />
              <Text style={styles.ratingText}>
                {ratingInfo?.average} ({ratingInfo?.total}) reviews
              </Text>
            </View>

            <View style={styles.visitRow}>
              {vendorInfo.farm_visit == 1 ? (
                <>
                  <View style={styles.checkIcon}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                  <Text style={styles.visitText}>Farm visit available</Text>
                </>
              ) : (
                <>
                  <View style={styles.unavailableIcon}>
                    <Text style={styles.unavailableText}>—</Text>
                  </View>
                  <Text style={styles.visitText}>Farm visit not available</Text>
                </>
              )}
            </View>
            <View style={styles.locationRow}>
              <Image source={location} style={styles.locationIcon} />
              <Text style={styles.addressText}>{vendorInfo.address}</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewMapText}>View on map</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search Bar - Only show on Products tab */}
        {activeTab === 'Products' && (
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Image source={scope} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search term OR browse categories"
                placeholderTextColor={colors.text.secondary}
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Image source={filter} style={styles.filterIcon} />
            </TouchableOpacity>
          </View>
        )}

        {/* Content based on active tab */}
        {activeTab === 'Products' && (
          <View style={styles.productsSection}>
            <Text style={styles.sectionTitle}>Just for you</Text>
            <FlatList
              // data={products}
              data={products1}
              renderItem={renderProduct}
              keyExtractor={item => item.id}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.productRow}
              contentContainerStyle={styles.productsList}
            />
          </View>
        )}

        {activeTab === 'Reviews' && (
          <View style={styles.reviewsSection}>
            {/* Rating Summary */}
            <View style={styles.ratingSummary}>
              <View style={styles.ratingBreakdown}>
                {[5, 4, 3, 2, 1].map(star => (
                  <View key={star} style={styles.ratingBarRow}>
                    <Text style={styles.ratingBarLabel}>{star}</Text>
                    <View style={styles.ratingBarContainer}>
                      <View
                        style={[
                          styles.ratingBar,
                          {
                            // // width: `${
                            // //   (ratingBreakdown[
                            // //     star as keyof typeof ratingBreakdown
                            // //   ] /
                            // //     52) *
                            // //   100
                            // // }%`,
                            // width: `${(ratingBreakdown[star] / (ratingInfo.total || 1)) * 100}%`,
                            width: `${
                              (ratingBreakdown1[
                                star as keyof typeof ratingBreakdown1
                              ] /
                                52) *
                              100
                            }%`,
                          },
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>
              <View style={styles.ratingSummaryRight}>
                {/* <Text style={styles.ratingSummaryNumber}>{vendor.rating}</Text> */}
                <Text style={styles.ratingSummaryNumber}>{ratingInfo.average.toFixed(1)}</Text>
                <View style={styles.ratingSummaryStars}>
                  {[1, 2, 3, 4, 5].map(starNum => (
                    <Image
                      key={starNum}
                      source={star}
                      style={[
                        styles.ratingSummaryStarIcon,
                        // starNum <= Math.floor(vendor.rating) && {
                        //   tintColor: '#FFD700',
                        // },
                        starNum <= Math.floor(ratingInfo.average) && { tintColor: '#FFD700' },
                      ]}
                    />
                  ))}
                </View>
                <Text style={styles.ratingSummaryCount}>
                  {/* {vendor.reviews} Reviews */}
                  {ratingInfo.total} Reviews
                </Text>
              </View>
            </View>

            {/* Individual Reviews */}
            <View style={styles.reviewsList}>
              {reviews.map(review => (
              // {reviews1.length === 0 ? (
              //   <Text>No reviews yet</Text>
              // ) : (
              //   reviews1.map(review => (
                  <View key={review.id} style={styles.reviewItem}>
                    <CacheImage url={review.avatar} style={styles.reviewAvatar} />
                    <View style={styles.reviewContent}>
                      <View style={styles.reviewHeader}>
                        <View style={styles.reviewHeaderLeft}>
                          <Text style={styles.reviewName}>{review.name}</Text>
                          <View style={styles.reviewStars}>
                            {[1, 2, 3, 4, 5].map(starNum => (
                              <Image
                                key={starNum}
                                source={star}
                                style={[
                                  styles.reviewStarIcon,
                                  starNum <= review.rating && {
                                    tintColor: '#FFD700',
                                  },
                                ]}
                              />
                            ))}
                          </View>
                          <Text style={styles.reviewTime}>{review.time}</Text>
                        </View>
                        <TouchableOpacity>
                          <Text style={styles.reviewMenu}>⋯</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.reviewText}>{review.text}</Text>
                    </View>
                  </View>
              //   ))
              // )}
              ))}
            </View>

            {/* Write Review Button */}
            <TouchableOpacity style={styles.writeReviewButton}
              onPress={() => navigation.navigate('WriteReviewScreen', {
                vendorId: vendorInfo.id
              })}
            >
              <Text style={styles.writeReviewButtonText}>Write a review</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'Farm visit' && (
          <View style={styles.farmVisitSection}>
            {/* {vendor.farmVisitAvailable ? ( */}
            {vendorInfo.farm_visit ? (
              <>
                <Text style={styles.farmVisitTitle}>Plan Your Farm Visit</Text>
                <Text style={styles.farmVisitDescription}>
                  See where your food is grown! Request a visit to your favorite
                  farmer's farm, explore their fields, and experience the
                  freshness first-hand.
                </Text>

                {/* Form Fields */}
                <View style={styles.formContainer}>
                  <View style={styles.inputContainer}>
                    <Image source={profile} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Name"
                      placeholderTextColor={colors.text.secondary}
                      value={farmVisitForm.name}
                      onChangeText={text =>
                        setFarmVisitForm({ ...farmVisitForm, name: text })
                      }
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Image source={calender} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Select date"
                      placeholderTextColor={colors.text.secondary}
                      value={farmVisitForm.date}
                      onChangeText={text =>
                        setFarmVisitForm({ ...farmVisitForm, date: text })
                      }
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Image source={clock} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Select time"
                      placeholderTextColor={colors.text.secondary}
                      value={farmVisitForm.time}
                      onChangeText={text =>
                        setFarmVisitForm({ ...farmVisitForm, time: text })
                      }
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Image source={note} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Optional note."
                      placeholderTextColor={colors.text.secondary}
                      multiline
                      numberOfLines={4}
                      value={farmVisitForm.note}
                      onChangeText={text =>
                        setFarmVisitForm({ ...farmVisitForm, note: text })
                      }
                    />
                  </View>
                </View>

                <TouchableOpacity style={styles.sendRequestButton}
                  onPress={onSubmitFarmVisit}
                >
                  <Text style={styles.sendRequestButtonText}>
                    Send farm visit request
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.farmVisitUnavailable}>
                <View style={styles.unavailableIconLarge}>
                  <Text style={styles.unavailableIconText}>i</Text>
                </View>
                <Text style={styles.unavailableTitle}>
                  Farm Visit Not Available
                </Text>
                <Text style={styles.unavailableMessage}>
                  This farmer currently doesn't offer on-site visits, but you
                  can still enjoy their fresh, organic produce delivered
                  straight to your doorstep.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default VendorProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    backgroundColor: colors.background.default,
  },
  backButton: {
    width: wp(10),
    height: wp(10),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIcon: {
    width: wp(5),
    height: wp(5),
    tintColor: colors.text.primary,
  },
  headerTitle: {
    fontSize: fontSizes.fs20,
    fontFamily: typography.fontFamily.Medium,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: wp(10),
  },
  content: {
    flex: 1,
  },
  vendorSection: {
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: colors.background.default,
  },
  vendorImage: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(2),
    marginRight: wp(4),
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: fontSizes.fs18,
    fontFamily: typography.fontFamily.SemiBold,
    color: colors.text.primary,
    marginBottom: hp(0.8),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  starIcon: {
    width: wp(4),
    height: wp(4),
    tintColor: '#FFD700',
    marginRight: wp(1.5),
  },
  ratingText: {
    fontSize: fontSizes.fs13,
    fontFamily: typography.fontFamily.Regular,
    color: colors.text.secondary,
  },
  visitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  checkIcon: {
    width: wp(4),
    height: wp(4),
    borderRadius: wp(2),
    backgroundColor: '#4CAF50',
    marginRight: wp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  visitText: {
    fontSize: fontSizes.fs13,
    fontFamily: typography.fontFamily.Regular,
    color: colors.text.secondary,
  },
  checkmarkText: {
    color: colors.background.default,
    fontSize: fontSizes.fs10,
    fontWeight: 'bold',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  locationIcon: {
    width: wp(3.5),
    height: wp(3.5),
    tintColor: colors.text.secondary,
    marginRight: wp(1.5),
  },
  addressText: {
    fontSize: fontSizes.fs13,
    fontFamily: typography.fontFamily.Regular,
    color: colors.text.secondary,
    flex: 1,
  },
  viewMapText: {
    fontSize: fontSizes.fs13,
    fontFamily: typography.fontFamily.Medium,
    color: '#007AFF',
    marginTop: hp(0.3),
  },
  tabsContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    backgroundColor: colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickyTabsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1000,
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    paddingTop: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    backgroundColor: colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  tab: {
    flex: 1,
    paddingBottom: hp(1),
    alignSelf: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary.secondary,
  },
  tabText: {
    fontSize: fontSizes.fs14,
    fontFamily: typography.fontFamily.Medium,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  tabTextActive: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.SemiBold,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    backgroundColor: colors.background.default,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    borderRadius: wp(3),
    paddingHorizontal: wp(4),
    height: hp(6),
    marginRight: wp(3),
  },
  searchIcon: {
    width: wp(5),
    height: wp(5),
    tintColor: colors.text.secondary,
    marginRight: wp(2),
  },
  searchInput: {
    flex: 1,
    fontSize: fontSizes.fs14,
    fontFamily: typography.fontFamily.Regular,
    color: colors.text.primary,
  },
  filterButton: {
    width: wp(12),
    height: hp(6),
    backgroundColor: colors.primary.secondary,
    borderRadius: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    width: wp(5),
    height: wp(5),
    tintColor: colors.background.default,
  },
  productsSection: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(4),
  },
  sectionTitle: {
    fontSize: fontSizes.fs18,
    fontFamily: typography.fontFamily.SemiBold,
    color: colors.text.primary,
    marginBottom: hp(2),
  },
  productsList: {
    paddingBottom: hp(2),
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: hp(2),
  },
  productCard: {
    width: wp(43),
    backgroundColor: colors.background.default,
    borderRadius: wp(3),
    overflow: 'hidden',
  },
  productImageContainer: {
    position: 'relative',
    width: '100%',
    height: hp(18),
    marginBottom: hp(1),
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp(2),
  },
  addButton: {
    position: 'absolute',
    bottom: wp(2),
    right: wp(2),
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonIcon: {
    width: wp(8),
    height: wp(8),
  },
  productName: {
    fontSize: fontSizes.fs13,
    fontFamily: typography.fontFamily.Medium,
    color: colors.text.primary,
    marginBottom: hp(0.3),
    paddingHorizontal: wp(2),
  },
  productSubtitle: {
    fontSize: fontSizes.fs12,
    fontFamily: typography.fontFamily.Regular,
    color: colors.text.secondary,
    marginBottom: hp(0.8),
    paddingHorizontal: wp(2),
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(2),
    paddingBottom: hp(1),
  },
  productWeight: {
    fontSize: fontSizes.fs12,
    fontFamily: typography.fontFamily.Regular,
    color: colors.text.secondary,
  },
  productPrice: {
    fontSize: fontSizes.fs15,
    fontFamily: typography.fontFamily.SemiBold,
    color: colors.text.primary,
  },
  // Reviews Section Styles
  reviewsSection: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(4),
  },
  ratingSummary: {
    flexDirection: 'row',
    marginBottom: hp(3),
    paddingBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  ratingBreakdown: {
    flex: 1,
    marginRight: wp(4),
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.8),
  },
  ratingBarLabel: {
    fontSize: fontSizes.fs12,
    fontFamily: typography.fontFamily.Medium,
    color: colors.text.primary,
    width: wp(4),
    marginRight: wp(2),
  },
  ratingBarContainer: {
    flex: 1,
    height: hp(1.5),
    backgroundColor: colors.background.paper,
    borderRadius: wp(1),
    overflow: 'hidden',
  },
  ratingBar: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: wp(1),
  },
  ratingSummaryRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingSummaryNumber: {
    fontSize: fontSizes.fs32,
    fontFamily: typography.fontFamily.Bold,
    color: colors.text.primary,
    marginBottom: hp(0.5),
  },
  ratingSummaryStars: {
    flexDirection: 'row',
    marginBottom: hp(0.5),
  },
  ratingSummaryStarIcon: {
    width: wp(4),
    height: wp(4),
    tintColor: colors.border.main,
    marginHorizontal: wp(0.5),
  },
  ratingSummaryCount: {
    fontSize: fontSizes.fs13,
    fontFamily: typography.fontFamily.Regular,
    color: colors.text.secondary,
  },
  reviewsList: {
    marginBottom: hp(2),
  },
  reviewItem: {
    flexDirection: 'row',
    marginBottom: hp(2.5),
    paddingBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  reviewAvatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    marginRight: wp(3),
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(0.8),
  },
  reviewHeaderLeft: {
    flex: 1,
  },
  reviewName: {
    fontSize: fontSizes.fs15,
    fontFamily: typography.fontFamily.SemiBold,
    color: colors.text.primary,
    marginBottom: hp(0.3),
  },
  reviewStars: {
    flexDirection: 'row',
    marginBottom: hp(0.3),
  },
  reviewStarIcon: {
    width: wp(3.5),
    height: wp(3.5),
    tintColor: colors.border.main,
    marginRight: wp(0.5),
  },
  reviewTime: {
    fontSize: fontSizes.fs12,
    fontFamily: typography.fontFamily.Regular,
    color: colors.text.secondary,
  },
  reviewMenu: {
    fontSize: fontSizes.fs20,
    color: colors.text.secondary,
    lineHeight: fontSizes.fs20,
  },
  reviewText: {
    fontSize: fontSizes.fs14,
    fontFamily: typography.fontFamily.Regular,
    color: colors.text.primary,
    lineHeight: fontSizes.fs20,
  },
  writeReviewButton: {
    backgroundColor: colors.primary.main,
    borderRadius: wp(3),
    paddingVertical: hp(1.8),
    alignItems: 'center',
    marginTop: hp(2),
  },
  writeReviewButtonText: {
    fontSize: fontSizes.fs16,
    fontFamily: typography.fontFamily.SemiBold,
    color: colors.background.default,
  },
  // Farm Visit Section Styles
  farmVisitSection: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(4),
  },
  farmVisitTitle: {
    fontSize: fontSizes.fs20,
    fontFamily: typography.fontFamily.SemiBold,
    color: colors.text.primary,
    marginBottom: hp(1),
  },
  farmVisitDescription: {
    fontSize: fontSizes.fs14,
    fontFamily: typography.fontFamily.Regular,
    color: colors.text.secondary,
    lineHeight: fontSizes.fs20,
    marginBottom: hp(3),
  },
  formContainer: {
    marginBottom: hp(3),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    borderRadius: wp(3),
    paddingHorizontal: wp(4),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  inputIcon: {
    width: wp(5),
    height: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(2),
    alignSelf: 'flex-start',
    marginTop: hp(1.1),
  },
  inputIconText: {
    fontSize: fontSizes.fs18,
  },
  input: {
    flex: 1,
    fontSize: fontSizes.fs14,
    fontFamily: typography.fontFamily.Regular,
    color: colors.text.primary,
    paddingVertical: hp(1.5),
  },
  textArea: {
    minHeight: hp(10),
    textAlignVertical: 'top',
    paddingTop: hp(1.5),
  },
  sendRequestButton: {
    backgroundColor: colors.primary.main,
    borderRadius: wp(3),
    paddingVertical: hp(1.8),
    alignItems: 'center',
  },
  sendRequestButtonText: {
    fontSize: fontSizes.fs16,
    fontFamily: typography.fontFamily.SemiBold,
    color: colors.background.default,
  },
  farmVisitUnavailable: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(6),
  },
  unavailableIconLarge: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(3),
  },
  unavailableIconText: {
    fontSize: fontSizes.fs40,
    fontFamily: typography.fontFamily.Bold,
    color: colors.background.default,
  },
  unavailableTitle: {
    fontSize: fontSizes.fs20,
    fontFamily: typography.fontFamily.SemiBold,
    color: colors.text.primary,
    marginBottom: hp(1.5),
    textAlign: 'center',
  },
  unavailableMessage: {
    fontSize: fontSizes.fs14,
    fontFamily: typography.fontFamily.Regular,
    color: colors.text.secondary,
    lineHeight: fontSizes.fs20,
    textAlign: 'center',
    paddingHorizontal: wp(4),
  },
  unavailableIcon: {
    width: wp(4),
    height: wp(4),
    borderRadius: wp(2),
    backgroundColor: colors.border.main,
    marginRight: wp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  unavailableText: {
    color: colors.background.default,
    fontSize: fontSizes.fs12,
    fontWeight: 'bold',
  },
});
// {activeTab === 'Reviews' && (
//   <View style={styles.reviewsSection}>
//     {/* Rating Summary */}
//     <View style={styles.ratingSummary}>
//       <View style={styles.ratingBreakdown}>
//         {[5,4,3,2,1].map(star => (
//           <View key={star} style={styles.ratingBarRow}>
//             <Text style={styles.ratingBarLabel}>{star}</Text>
//             <View style={styles.ratingBarContainer}>
//               <View
//                 style={[
//                   styles.ratingBar,
//                   {
//                     width: `${(ratingBreakdown[star] / (ratingInfo.total || 1)) * 100}%`,
//                   },
//                 ]}
//               />
//             </View>
//           </View>
//         ))}
//       </View>
//       <View style={styles.ratingSummaryRight}>
//         <Text style={styles.ratingSummaryNumber}>{ratingInfo.average.toFixed(1)}</Text>
//         <View style={styles.ratingSummaryStars}>
//           {[1,2,3,4,5].map(starNum => (
//             <Image
//               key={starNum}
//               source={star}
//               style={[
//                 styles.ratingSummaryStarIcon,
//                 starNum <= Math.floor(ratingInfo.average) && { tintColor: '#FFD700' },
//               ]}
//             />
//           ))}
//         </View>
//         <Text style={styles.ratingSummaryCount}>{ratingInfo.total} Reviews</Text>
//       </View>
//     </View>

//     {/* Individual Reviews */}
//     <View style={styles.reviewsList}>
//       {reviews1.length === 0 ? (
//         <Text>No reviews yet</Text>
//       ) : (
//         reviews1.map(review => (
//           <View key={review.id} style={styles.reviewItem}>
//             <CacheImage url={review.avatar} style={styles.reviewAvatar} />
//             <View style={styles.reviewContent}>
//               <View style={styles.reviewHeader}>
//                 <View style={styles.reviewHeaderLeft}>
//                   <Text style={styles.reviewName}>{review.name}</Text>
//                   <View style={styles.reviewStars}>
//                     {[1,2,3,4,5].map(starNum => (
//                       <Image
//                         key={starNum}
//                         source={star}
//                         style={[
//                           styles.reviewStarIcon,
//                           starNum <= review.rating && { tintColor: '#FFD700' },
//                         ]}
//                       />
//                     ))}
//                   </View>
//                   <Text style={styles.reviewTime}>{review.time}</Text>
//                 </View>
//                 <TouchableOpacity>
//                   <Text style={styles.reviewMenu}>⋯</Text>
//                 </TouchableOpacity>
//               </View>
//               <Text style={styles.reviewText}>{review.text}</Text>
//             </View>
//           </View>
//         ))
//       )}
//     </View>
//   </View>
// )}
