import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { hp, wp } from '../../theme/responsive';
import { colors } from '../../theme/colors';
import { scale } from '../../theme/responsive';
import { typography } from '../../theme/typography';
import CacheImage from '../../components/CacheImage';
import { filter, star, location, homeFill } from '../../assets';

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

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [sortOpen, setSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('rating_desc');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? demoFarmers.filter((f) => f.name.toLowerCase().includes(q))
      : demoFarmers.slice();

    switch (sortOption) {
      case 'distance_asc':
        return base.sort((a, b) => a.distanceMiles - b.distanceMiles);
      case 'name_asc':
        return base.sort((a, b) => a.name.localeCompare(b.name));
      case 'rating_desc':
      default:
        return base.sort((a, b) => b.rating - a.rating);
    }
  }, [query, sortOption]);

  const renderCard = ({ item }: { item: Farmer }) => (
    <View style={styles.card}>
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
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with search bar */}
      <View style={styles.headerBg}>
        <View style={styles.headerInner}>
          <View style={styles.searchBar}>
            <TextInput
              placeholder="Search farms OR browse categories"
              placeholderTextColor={colors.text.primary}
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

      {/* Title + sort */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Explore Farmers</Text>
        <View>
          <TouchableOpacity
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
          </TouchableOpacity>
          {sortOpen && (
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
          )}
        </View>
      </View>

      {/* Grid list */}
      <FlatList
        data={filtered}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
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
    color: colors.primary.secondary,
    fontSize: scale(15),
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
    zIndex:100
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
});