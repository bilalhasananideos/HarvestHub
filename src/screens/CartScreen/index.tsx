import React, { useMemo, useState } from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../../theme/colors';
import { arrowRight } from '../../assets';
import { fontSizes } from '../../theme/responsive';

type CartItem = {
  id: string;
  title: string;
  priceLabel: string;
  unitSuffix: string;
  unitPrice: number;
  quantity: number;
  step: number;
  imageUri: string;
};

const initialItems: CartItem[] = [
  {
    id: '1',
    title: 'Juicy Strawberries',
    priceLabel: '$9.50',
    unitSuffix: '/kg',
    unitPrice: 43.33,
    quantity: 1,
    step: 1,
    imageUri:
      'https://images.unsplash.com/photo-1437750769465-301382cdf094?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '2',
    title: 'Puddle Duck Eggs',
    priceLabel: '$7.89',
    unitSuffix: ' /pcs',
    unitPrice: 52.86,
    quantity: 1,
    step: 1,
    imageUri:
      'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '3',
    title: 'Organic Watermelon',
    priceLabel: '$4.50',
    unitSuffix: '/kg',
    unitPrice: 38.3,
    quantity: 1,
    step: 1,
    imageUri:
      'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '4',
    title: 'Organic Cheese',
    priceLabel: '$15.00',
    unitSuffix: '/kg',
    unitPrice: 39.61,
    quantity: 1,
    step: 1,
    imageUri:
      'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&w=200&q=80',
  },
];

const DELIVERY_FEE = 4.9;
const DISCOUNT_LABEL = '20%';

const CartScreen = () => {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [saveCard, setSaveCard] = useState(true);

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0),
    [items],
  );
  const total = useMemo(() => subtotal + DELIVERY_FEE, [subtotal]);

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

  const handleQuantityChange = (id: string, direction: 1 | -1) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + direction),
            }
          : item,
      ),
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.addressCard}>
            <Text style={styles.addressTitle}>20 Cooper Square 20 Cooper Square</Text>
            <View style={styles.addressRow}>
              <TouchableOpacity style={styles.changeAddressRow}>
                <Text style={styles.changeAddressText}>Change address</Text>
                <Image source={arrowRight} style={styles.arrowRight} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.itemHeaderRow}>
            <Text style={styles.sectionTitle}>Cart</Text>
            <TouchableOpacity style={styles.addMoreRow}>
              <View style={styles.addMoreIcon}>
                <Text style={styles.addMoreIconText}>+</Text>
              </View>
              <Text style={styles.addMoreText}>Add more items</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.itemCard}>
            {items.map((item, index) => {
              const displayQuantity = `${item.quantity * item.step}${item.unitSuffix}`;
              return (
                <View
                  key={item.id}
                  style={[
                    styles.itemRow,
                    index !== items.length - 1 && styles.itemDivider,
                  ]}
                >
                  <View style={styles.itemThumbWrapper}>
                    <Image source={{ uri: item.imageUri }} style={styles.itemThumb} />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.title}</Text>
                    <Text style={styles.itemPriceLabel}>{item.priceLabel+item.unitSuffix}</Text>
                  </View>
                  <View style={styles.quantityGroup}>
                    <TouchableOpacity
                      style={[
                        styles.quantityButton,
                        item.quantity === 1 && styles.quantityButtonDisabled,
                      ]}
                      onPress={() => handleQuantityChange(item.id, -1)}
                      disabled={item.quantity === 1}
                    >
                      <Text
                        style={[
                          styles.quantitySymbol,
                          item.quantity === 1 && styles.quantitySymbolDisabled,
                        ]}
                      >
                        −
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityValue}>{displayQuantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleQuantityChange(item.id, 1)}
                    >
                      <Text style={styles.quantitySymbol}>+</Text>
                    </TouchableOpacity>
                  </View>
                  {/* <Text style={styles.itemTotal}>
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </Text> */}
                </View>
              );
            })}
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(DELIVERY_FEE)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, styles.discountLabel]}>Discount:</Text>
              <Text style={[styles.summaryValue, styles.discountLabel]}>
                {DISCOUNT_LABEL}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total cost:</Text>
              <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => setIsSheetVisible(true)}
          >
            <Text style={styles.checkoutText}>Proceed to checkout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={isSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsSheetVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={() => setIsSheetVisible(false)}
          />
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={() => setIsSheetVisible(false)}>
                <Text style={styles.sheetBack}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Add card</Text>
              <TouchableOpacity>
                <Text style={styles.scanText}>Scan card</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.sheetContent}
            >
              <Text style={styles.sheetSubtitle}>Card Information</Text>
              <View style={styles.cardNumberRow}>
                <TextInput
                  style={[styles.input, styles.flex1]}
                  keyboardType="number-pad"
                  placeholder="Card number"
                  placeholderTextColor={colors.text.hint}
                />
                {/* <Image
                  source={{
                    uri: 'https://static.thenounproject.com/png/5034132-200.png',
                  }}
                  style={styles.cardBrands}
                  resizeMode="contain"
                /> */}
              </View>
              <View style={styles.doubleInputRow}>
                <TextInput
                  style={[styles.input, styles.flex1]}
                  keyboardType="number-pad"
                  placeholder="MM / YY"
                  placeholderTextColor={colors.text.hint}
                />
                <TextInput
                  style={[styles.input, styles.flex1]}
                  keyboardType="number-pad"
                  placeholder="CVC"
                  placeholderTextColor={colors.text.hint}
                />
              </View>

              <Text style={styles.sheetSubtitle}>Billing address</Text>
              <TouchableOpacity style={styles.selectorInput}>
                <Text style={styles.selectorLabel}>Country or region</Text>
                <Text style={styles.selectorValue}>United States</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                placeholder="ZIP"
                placeholderTextColor={colors.text.hint}
              />

              <View style={styles.saveRow}>
                <Switch
                  value={saveCard}
                  onValueChange={setSaveCard}
                  trackColor={{
                    false: colors.border.light,
                    true: colors.primary.main,
                  }}
                  thumbColor={colors.neutral.white}
                />
                <Text style={styles.saveLabel}>
                  Save this card for future powder payments
                </Text>
              </View>

              <TouchableOpacity style={styles.payButton}>
                <Text style={styles.payButtonText}>
                  Pay {formatCurrency(total)}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.paper,
  },
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: wp('5%'),
  },
  scrollContent: {
    paddingBottom: 32,
  },
  addressCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  addressTitle: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
    marginBottom: 6,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  addressSubtitle: {
    flex: 1,
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  changeAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  changeAddressText: {
    fontSize: 12,
    color: '#3478F6',
    fontWeight: '600',
  },
  arrowRight: {
    width: 12,
    height: 12,
    tintColor: '#3478F6',
  },
  itemHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  addMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addMoreIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMoreIconText: {
    fontSize: 14,
    color: colors.primary.main,
    fontWeight: '600',
    lineHeight: 18,
  },
  addMoreText: {
    fontSize: 14,
    color: colors.primary.main,
    fontWeight: '600',
  },
  itemCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  itemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  itemThumbWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.background.default,
    overflow: 'hidden',
  },
  itemThumb: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: fontSizes.fs16,
    fontWeight: '400',
    color: colors.text.primary,
  },
  itemPriceLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  quantityGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.neutral.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral.white,
  },
  quantityButtonDisabled: {
    opacity: 0.4,
  },
  quantitySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary.main,
  },
  quantitySymbolDisabled: {
    color: colors.text.secondary,
  },
  quantityValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
    minWidth: 52,
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  summaryCard: {
    backgroundColor: '#F6F6F6',
    borderRadius: 18,
    padding: 18,
    marginTop: 20,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
  },
  discountLabel: {
    color: colors.primary.secondary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border.primary,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
  },
  footer: {
    paddingVertical: 20,
  },
  checkoutButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  checkoutText: {
    color: colors.neutral.white,
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    maxHeight: '90%',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sheetBack: {
    fontSize: 26,
    color: colors.text.primary,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  scanText: {
    fontSize: 14,
    color: '#3478F6',
    fontWeight: '600',
  },
  sheetContent: {
    paddingBottom: 24,
    gap: 14,
  },
  sheetSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  cardNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    color: colors.text.primary,
    backgroundColor: colors.neutral.white,
  },
  cardBrands: {
    width: 70,
    height: 30,
  },
  doubleInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  selectorInput: {
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.neutral.white,
  },
  selectorLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  selectorValue: {
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  saveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  saveLabel: {
    flex: 1,
    fontSize: 13,
    color: colors.text.primary,
  },
  payButton: {
    marginTop: 8,
    backgroundColor: colors.primary.main,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    color: colors.neutral.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

