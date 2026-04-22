import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import React, { memo, useState, useEffect, useCallback } from 'react';
import { editLocation } from '../../assets';
import { hp, wp } from '../../theme/responsive';
import { colors } from '../../theme/colors';
import { getAddressApi } from '../../store/services/Services';
import Ionicons from 'react-native-vector-icons/Ionicons'

const AddressListScreen = ({ navigation, route }) => {
  const onSelect = route?.params?.onSelect ?? null;

  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ── Fetch addresses ───────────────────────────────────────────────────────
  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAddressApi();
      console.log('response', response);

      // API returns { success: true, data: [...] }
      const list = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];

      setAddresses(list);

      // Pre-select default address or first one
      const defaultAddr = list.find(a => a.is_default) ?? list[0];
      if (defaultAddr) {
        setSelectedId(defaultAddr.id);
        onSelect?.(defaultAddr);
      }
    } catch (err) {
      console.log('Address fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // Re-fetch on screen focus (after add/edit)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchAddresses);
    return unsubscribe;
  }, [navigation, fetchAddresses]);

  const handleSelect = (item) => {
    setSelectedId(item.id);
    onSelect?.(item);
  };

  // ── Render each address row ───────────────────────────────────────────────
  const renderItem = ({ item }) => {
    const isSelected = selectedId === item.id;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.itemRow}
        onPress={() => handleSelect(item)}
      >
        {/* Radio button — outside card */}
        <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
          {isSelected && <View style={styles.radioInner} />}
        </View>

        {/* Grey card */}
        <View style={[styles.card, isSelected ? styles.cardSelected : styles.cardUnselected]}>

          {/* Title + edit icon */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.label ?? item.title ?? '—'}
            </Text>
            <TouchableOpacity
              style={styles.editBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() =>
                navigation.navigate('EditAddressScreen', {
                  address: item,
                  onDone: fetchAddresses,
                })
              }
            >
              <Ionicons name="create-outline" size={25} color="black" />
            </TouchableOpacity>
          </View>

          {/* Full address */}
          <Text style={styles.cardAddress} numberOfLines={3}>
            {item.full_address ?? item.address ?? ''}
          </Text>
          <Text style={styles.cardAddress} numberOfLines={3}>
            {item?.street}
          </Text>
          <Text style={styles.cardAddress} numberOfLines={3}>
            {item?.floor}
          </Text>
          <Text style={styles.cardAddress} numberOfLines={3}>
            {item?.instructions}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const EmptyAddress = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="location-outline" size={44} color="#BA7517" />
      </View>
      <Text style={styles.emptyTitle}>No saved addresses</Text>
      <Text style={styles.emptySubtitle}>
        You haven't added any address yet.{'\n'}Add one to get started.
      </Text>
      <TouchableOpacity
        style={styles.emptyAddBtn}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('AddAddressScreen', { onDone: fetchAddresses })}
      >
        <Text style={styles.emptyAddBtnText}>+ Add new address</Text>
      </TouchableOpacity>
    </View>
  );
  
  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.headerDivider} />

        {/* List / loader */}
        {loading ? (
          <ActivityIndicator
            size="small"
            color={colors.primary.main}
            style={{ marginTop: hp('4') }}
          />
        ) : (
          <FlatList
            data={addresses}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={!loading ? <EmptyAddress /> : null}
          />
        )}

        {/* + Add new address — left aligned like screenshot */}
        <TouchableOpacity
          style={styles.addNewRow}
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate('AddAddressScreen', {
              onDone: fetchAddresses,
            })
          }
        >
          <Text style={styles.addNewText}>+ Add new address</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

export default memo(AddressListScreen);

// ─── Constants ────────────────────────────────────────────────────────────────
const BRAND   = '#7A3E2F';
const BLUE    = '#2979FF';
const CARD_BG = '#F2F2F2';

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  headerDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ddd',
  },

  listContainer: {
    paddingHorizontal: wp('4'),
    paddingTop: hp('1.5'),
    paddingBottom: hp('1'),
  },

  emptyText: {
    textAlign: 'center',
    marginTop: hp('6'),
    color: '#999',
    fontSize: 14,
  },

  // ── Each row: radio + card ────────────────────────────────────────────────
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2'),
  },

  // Radio button
  radioOuter: {
    width: wp('5.5'),
    height: wp('5.5'),
    borderRadius: wp('5.5') / 2,
    borderWidth: 1.5,
    borderColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3'),
    flexShrink: 0,
  },
  radioOuterSelected: {
    borderColor: BRAND,
  },
  radioInner: {
    width: wp('3'),
    height: wp('3'),
    borderRadius: wp('3') / 2,
    backgroundColor: BRAND,
  },

  // Card
  card: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: hp('1.5'),
    paddingHorizontal: wp('3.5'),
  },
  cardUnselected: {
    backgroundColor: CARD_BG,
    borderWidth: 0,
  },
  cardSelected: {
    backgroundColor: CARD_BG,
    borderWidth: 2,
    borderColor: BLUE,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('0.5'),
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    flex: 1,
    marginRight: 8,
  },
  cardAddress: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },

  // Edit icon
  editBtn: {
    padding: 4,
  },
  editIcon: {
    width: wp('4.5'),
    height: wp('4.5'),
    resizeMode: 'contain',
    tintColor: '#333',
  },

  // + Add new address — left aligned
  addNewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp('4'),
    marginBottom: hp('2'),
    marginTop: hp('0.5'),
  },
  addNewText: {
    color: BLUE,
    fontSize: 14,
    fontWeight: '500',
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 420,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#faeeda',
    borderWidth: 1.5,
    borderColor: '#fac775',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c2c2c',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#faeeda',
    borderRadius: 99,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  emptyAddBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#BA7517',
  },
});