import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { fontSizes, hp, wp } from '../../theme/responsive';
import { colors } from '../../theme/colors';
import { scale } from '../../theme/responsive';
import { typography } from '../../theme/typography';
import CacheImage from '../../components/CacheImage';
import { filter, star, location, homeFill } from '../../assets';
import { useDispatch, useSelector } from 'react-redux';
import { getVendorListApi, searchVendorsApi } from '../../store/services/Services';
import { useFocusEffect } from '@react-navigation/native';

type Farmer = {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  distanceMiles: number;
  visitAvailable: boolean;
  image: string;
};

const demoFarmers: Farmer[] = [
  {
    id: '1',
    name: 'Jason Smith Farm',
    rating: 4.5,
    reviews: 235,
    distanceMiles: 2.6,
    visitAvailable: true,
    image:
      'https://images.unsplash.com/photo-1536589961740-23fe5d0b4971?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Green Valley Farms',
    rating: 4.7,
    reviews: 312,
    distanceMiles: 1.8,
    visitAvailable: true,
    image:
      'https://images.unsplash.com/photo-1533616688419-41f508f7d1f3?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Sunrise Orchard',
    rating: 4.6,
    reviews: 198,
    distanceMiles: 3.4,
    visitAvailable: true,
    image:
      'https://images.unsplash.com/photo-1601004890684-2f0b0f5f4b1d?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: '4',
    name: 'Happy Cows Dairy',
    rating: 4.8,
    reviews: 420,
    distanceMiles: 2.2,
    visitAvailable: true,
    image:
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: '5',
    name: 'Golden Fields',
    rating: 4.4,
    reviews: 150,
    distanceMiles: 4.1,
    visitAvailable: false,
    image:
      'https://images.unsplash.com/photo-1518843875459-f7388724c0d1?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: '6',
    name: 'Riverbank Produce',
    rating: 4.5,
    reviews: 265,
    distanceMiles: 2.9,
    visitAvailable: true,
    image:
      'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?w=600&q=80&auto=format&fit=crop',
  },
];

type SortOption = 'rating_desc' | 'distance_asc' | 'name_asc';

// const MOST_SEARCHES = [
//   'Fruits', 'Vegetables', 'Milk', 'Cheese', 'Eggs',
//   'Spices', 'Honey', 'Strawberry', 'Watermelon', 'Yogurt',
//   'Organic', 'Fresh Herbs',
// ];
const MOST_SEARCHES = [
  'Fruits', 'Vegetables', 'Milk', 'Cheese', 'Honey', 'Strawberry', 'Watermelon',
];

const SearchScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userReducer.user);

  const [query, setQuery] = useState('');
  const [sortOpen, setSortOpen] = useState(false);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(false);
  // const [sortOption, setSortOption] = useState<SortOption>('rating_desc');

  const [sortType, setSortType] = useState<'AZ' | 'ZA' | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  // const [filtered1, setFiltered1] = useState(filtered)

  const [activeChip, setActiveChip] = useState<string | null>(null);
  const skipDebounce = useRef(false);

  // ─── 3. Chip press handler ─────────────────────────────────────
  const handleChipPress = (chip: string) => {
    skipDebounce.current = true;   // ← USE
    setActiveChip(chip);
    setQuery(chip);          // search input mein bhi set ho jayega
    fetchVendors(chip);      // directly API call
  };

  // useEffect(() => {
  //   getExploreData();
  // }, [])
  // useFocusEffect(
  //   useCallback(() => {
  //     getExploreData();

  //     return () => {
  //       // optional cleanup when leaving screen
  //     };
  //   }, [])
  // );

  // const getExploreData = async () => {
  //   try {
  //     setLoading(true);

  //     const resp = await getVendorListApi();
  //     console.log("Api resp", resp);

  //     // API data ko Farmer model ke andar map karna
  //     const apiFarmers: Farmer[] = resp?.map((item: any) => ({
  //       // id: item.id.toString(),
  //       id: item.id,
  //       name: item.name,
  //       rating: item.average_rating ? Number(item.average_rating) : 0,
  //       reviews: item.total_reviews ?? 0,
  //       distanceMiles: item.distance ? Number(item.distance) : 0,
  //       visitAvailable: item.farm_visit === 1,
  //       image: item.image,
  //     }));

  //     setFarmers(apiFarmers);
  //   } catch (err) {
  //     console.log("err", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // show demo data
  // const filtered = useMemo(() => {
  //   const q = query.trim().toLowerCase();
  //   const base = q
  //     ? demoFarmers.filter((f) => f.name.toLowerCase().includes(q))
  //     : demoFarmers.slice();

  //   switch (sortOption) {
  //     case 'distance_asc':
  //       return base.sort((a, b) => a.distanceMiles - b.distanceMiles);
  //     case 'name_asc':
  //       return base.sort((a, b) => a.name.localeCompare(b.name));
  //     case 'rating_desc':
  //     default:
  //       return base.sort((a, b) => b.rating - a.rating);
  //   }
  // }, [query, sortOption]);

  // const filtered = useMemo(() => {
  //   const q = query.trim().toLowerCase();

  //   // Search
  //   const base = q
  //     ? farmers.filter((f) => f.name.toLowerCase().includes(q))
  //     : farmers.slice();

  //   // Sorting
  //   switch (sortOption) {
  //     case 'distance_asc':
  //       return base.sort((a, b) => a.distanceMiles - b.distanceMiles);

  //     case 'name_asc':
  //       return base.sort((a, b) => a.name.localeCompare(b.name));

  //     case 'rating_desc':
  //     default:
  //       return base.sort((a, b) => b.rating - a.rating);
  //   }
  // }, [query, sortOption, farmers]);

  // const filtered = useMemo(() => {
  //   // let data = [...farmers];

  //   // // 🔍 Search
  //   // if (query.trim()) {
  //   //   const q = query.trim().toLowerCase();
  //   //   data = data.filter(f =>
  //   //     f.name.toLowerCase().includes(q)
  //   //   );
  //   // }

  //   // // 🔤 Alphabetical Sort
  //   // if (sortType === 'AZ') {
  //   //   data.sort((a, b) => a.name.localeCompare(b.name));
  //   // }

  //   // if (sortType === 'ZA') {
  //   //   data.sort((a, b) => b.name.localeCompare(a.name));
  //   // }

  //   // // 📍 Distance Filter
  //   // data = data.filter(item => item.distanceMiles <= distance);

  //   // // ⭐ Rating Filter
  //   // if (rating) {
  //   //   data = data.filter(item => item.rating >= rating);
  //   // }

  //   // return data;

  // }, [farmers, query, sortType, distance, rating]);    

  // useEffect(() => {

  //   if (
  //     query.trim() !== '' ||
  //     rating !== null ||
  //     distance !== null ||
  //     sortType !== null
  //   ) {
  //     fetchVendors();
  //   }

  // }, [query, rating, distance, sortType]);

  // 🔥 API CALL FUNCTION
  const fetchVendors = async (overrideQuery?: string) => {
    try {
      setLoading(true);

      const params: any = {};

      // if (query.trim()) params.search = query;
      // ✅ state query ki jagah overrideQuery use karo agar mila
      const searchTerm = overrideQuery !== undefined ? overrideQuery : query;
      if (searchTerm.trim()) params.search = searchTerm;

      if (rating) params.rating = rating;
      if (distance) params.mile = distance;

      if (sortType === 'AZ') params.sort = 'asc';
      if (sortType === 'ZA') params.sort = 'desc';

      // distance filter ke liye location bhejna zaroori
      if (distance) {
        params.latitude = user?.latitude;
        params.longitude = user?.longitude;
      }

      console.log("Sending Params:", params);

      const resp = await searchVendorsApi(params);
      console.log('res', resp)

      const mapped: Farmer[] = resp?.map((item: any) => ({
        id: item.id,
        name: item.name,
        rating: Number(item.average_rating ?? 0),
        reviews: item.total_reviews ?? 0,
        distanceMiles: Number(item.distance ?? 0),
        visitAvailable: item.farm_visit === 1,
        image: item.image,
      }));

      setFarmers(mapped);

    } catch (error) {
      console.log("Search Error", error);
    } finally {
      setLoading(false);
    }
  };

  // debounce function
  useEffect(() => {
    if (skipDebounce.current) {
      skipDebounce.current = false;  // ← USE (reset)
      return;                         // ← skip API call
    } 
    const delay = setTimeout(() => {
      if (query.trim()) {
        fetchVendors();
      }
    }, 1500);

    return () => clearTimeout(delay);

  }, [query]);


  // const applyFilters = () => {
  //   let updated = [...filtered1]

  //   // Alphabetical
  //   if (sortType === 'AZ') {
  //     updated.sort((a, b) => a.name.localeCompare(b.name))
  //   }

  //   if (sortType === 'ZA') {
  //     updated.sort((a, b) => b.name.localeCompare(a.name))
  //   }

  //   // Distance
  //   updated = updated.filter(item => item.distanceMiles <= distance)

  //   // Rating
  //   if (rating) {
  //     updated = updated.filter(item => item.rating >= rating)
  //   }

  //   setFiltered1(updated)
  // }    

  const applyFilters = () => {
    fetchVendors();
    setSortOpen(false);
  };

  const renderCard = ({ item }: { item: Farmer }) => (
    <TouchableOpacity onPress={() => navigation.navigate('VendorProfile', {
      vendorProfileId: item.id
    })} style={styles.card}>
      <CacheImage url={item.image} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name}
        </Text>

        <View style={styles.row}>
          <Image source={star} style={styles.iconSmall} />
          <Text style={styles.metaText}>{item.rating.toFixed(1)} ({item.reviews}+)</Text>
        </View>

        <View style={styles.row}>
          <Image source={location} style={styles.iconSmallMuted} />
          <Text style={styles.metaTextMuted}>{item.distanceMiles.toFixed(1)} miles away</Text>
        </View>

        <View style={styles.row}>
          <Image source={homeFill} style={styles.iconSmallMuted} />
          <Text style={styles.metaTextMuted}>
            {item.visitAvailable ? 'Farm visit available' : 'Visit on request'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      {/* Loader */}
      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      )}

      {/* Header with search bar */}
      <View style={styles.headerBg}>
        <View style={styles.headerInner}>
          <View style={styles.searchBar}>
            <TextInput
              placeholder="Search farms OR browse categories"
              placeholderTextColor={colors.text.secondary}
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
            />
            <TouchableOpacity
              style={styles.filterBtn}
              onPress={() => setSortOpen((s) => !s)}
              activeOpacity={0.8}
            >
              <Image source={filter} style={styles.filterIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

            {/* Most Searches — sirf tab dikho jab query empty ho */}
{/* {!query.trim() && farmers.length === 0 && ( */}
{/* {!query.trim() && ( */}
  <View style={styles.section}>
    <Text style={styles.heading}>Most Searches</Text>
    <View style={styles.chipWrap}>
      {MOST_SEARCHES.map(chip => (
        <TouchableOpacity
          key={chip}
          onPress={() => handleChipPress(chip)}
          style={[
            styles.chip,
            activeChip === chip && styles.chipActive,
          ]}
        >
          <Text style={[
            styles.chipText,
            activeChip === chip && styles.chipTextActive,
          ]}>
            {chip}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
{/* )} */}


      {/* Title + sort */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Explore Farmers</Text>
        <View>
          {/* <TouchableOpacity
            style={styles.sortBtn}
            onPress={() => setSortOpen((s) => !s)}
          >
            <Text style={styles.sortText}>
              {sortOption === 'rating_desc'
                ? 'Sort: Rating'
                : sortOption === 'distance_asc'
                ? 'Sort: Distance'
                : 'Sort: Name'}
            </Text>
          </TouchableOpacity> */}
          {/* {sortOpen && (
            <View style={styles.sortMenu}>
              <TouchableOpacity
                style={styles.sortMenuItem}
                onPress={() => {
                  setSortOption('rating_desc');
                  setSortOpen(false);
                }}
              >
                <Text style={styles.sortMenuText}>Rating (High → Low)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sortMenuItem}
                onPress={() => {
                  setSortOption('distance_asc');
                  setSortOpen(false);
                }}
              >
                <Text style={styles.sortMenuText}>Distance (Near → Far)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sortMenuItem}
                onPress={() => {
                  setSortOption('name_asc');
                  setSortOpen(false);
                }}
              >
                <Text style={styles.sortMenuText}>Name (A → Z)</Text>
              </TouchableOpacity>
            </View>
          )} */}
        </View>
      </View>

      {/* Grid list */}
      <FlatList
        // data={filtered}
        data={farmers}
        renderItem={renderCard}
        keyExtractor={(item) => item?.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <Modal
        visible={sortOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSortOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSortOpen(false)}
        >
          <View style={styles.modalContainer}>

            <Text style={styles.modalTitle}>Sort Results By</Text>

            {/* Alphabetical */}
            <Text style={styles.modalLabel}>Sort alphabetically</Text>

            <View style={styles.rowBetween}>
              <TouchableOpacity
                style={[
                  styles.sortBtn,
                  sortType === 'AZ' && styles.activeBtn
                ]}
                onPress={() => setSortType('AZ')}
              >
                <Text>A to Z</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sortBtn,
                  sortType === 'ZA' && styles.activeBtn
                ]}
                onPress={() => setSortType('ZA')}
              >
                <Text>Z to A</Text>
              </TouchableOpacity>
            </View>

            {/* Distance */}
            <Text style={styles.modalLabel}>Distance to me</Text>

            <View style={styles.rowBetween}>
              <TouchableOpacity
                onPress={() => setDistance(d => (d ? Math.max(1, d - 1) : 1))}
              >
                <Text style={styles.plusMinus}>-</Text>
              </TouchableOpacity>

              <Text style={styles.distanceText}>{distance} km</Text>

              <TouchableOpacity
                onPress={() => setDistance(d => (d ? d + 1 : 1))}
              >
                <Text style={styles.plusMinus}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Ratings */}
            <Text style={styles.modalLabel}>Ratings</Text>

            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity
                  key={star}
                  style={[
                    styles.ratingBtn,
                    rating === star && styles.activeBtn
                  ]}
                  onPress={() => setRating(star)}
                >
                  <Text>⭐ {star}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Apply Button */}
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={applyFilters}
            >
              <Text style={{ color: '#fff', fontSize: 16 }}>Sort</Text>
            </TouchableOpacity>

          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default SearchScreen;

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
  headerBg: {
    width: wp('100'),
    height: hp('16'),
    borderBottomLeftRadius: wp(8),
    borderBottomRightRadius: wp(8),
    backgroundColor: colors.primary.main,
    justifyContent: 'flex-end',
  },
  headerInner: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(1.5),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: wp(6),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    paddingLeft: wp(4),
    height: hp(5),
  },
  searchInput: {
    flex: 1,
    color: colors.text.primary,
    fontSize: scale(15),
    fontFamily: typography.fontFamily.Regular,
    fontSize: fontSizes.fs15,
    paddingLeft: wp(2),
    fontFamily: typography.fontFamily.Regular,
  },
  filterBtn: {
    width: hp(6),
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    width: wp(6),
    height: wp(6),
    tintColor: colors.primary.secondary,
  },
  sectionHeader: {
    marginTop: hp(2),
    paddingHorizontal: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(1.5),

  },
  sectionTitle: {
    fontSize: scale(20),
    color: colors.text.primary,
    fontFamily: typography.fontFamily.Bold,
  },
  sortBtn: {
    backgroundColor: colors.background.paper,
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    shadowColor: colors.overlay.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sortText: {
    fontSize: scale(13),
    color: colors.text.secondary,
    fontFamily: typography.fontFamily.Medium,
  },
  sortMenu: {
    position: 'absolute',
    right: 10,
    top: hp(-4.5),
    backgroundColor: colors.background.paper,
    borderRadius: wp(3),
    paddingVertical: hp(1),
    width: wp(50),
    shadowColor: colors.overlay.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 100
  },
  sortMenuItem: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
  },
  sortMenuText: {
    fontSize: scale(13),
    color: colors.text.primary,
    fontFamily: typography.fontFamily.Regular,
  },
  listContent: {
    paddingHorizontal: wp(3.5),
    paddingBottom: hp(2),
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: hp(1.5),
  },
  card: {
    backgroundColor: colors.background.paper,
    borderRadius: wp(3),
    overflow: 'hidden',
    width: wp(44),
    shadowColor: colors.overlay.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: hp(12),
  },
  cardBody: {
    padding: wp(3),
  },
  cardTitle: {
    fontSize: scale(14),
    color: colors.text.primary,
    fontFamily: typography.fontFamily.Medium,
    marginBottom: hp(0.8),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.6),
  },
  iconSmall: {
    width: wp(4),
    height: wp(4),
    tintColor: colors.status.warning,
    marginRight: wp(1.2),
  },
  iconSmallMuted: {
    width: wp(4),
    height: wp(4),
    tintColor: colors.text.secondary,
    marginRight: wp(1.2),
  },
  metaText: {
    fontSize: scale(12),
    color: colors.text.primary,
    fontFamily: typography.fontFamily.Regular,
  },
  metaTextMuted: {
    fontSize: scale(12),
    color: colors.text.secondary,
    fontFamily: typography.fontFamily.Regular,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  modalLabel: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 10,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sortBtn: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },

  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  ratingBtn: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },

  activeBtn: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },

  applyBtn: {
    backgroundColor: '#A0653C',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 25,
  },

  plusMinus: {
    fontSize: 22,
    paddingHorizontal: 20,
  },

  distanceText: {
    fontSize: 18,
    fontWeight: '600',
  },

  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  heading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipActive: {
    backgroundColor: '#dcebd4',
    borderColor: '#4a7c3f',
  },
  chipText: {
    fontSize: 12,
    color: '#555',
  },
  chipTextActive: {
    color: '#3d6b2a',
    fontWeight: '600',
  },

});