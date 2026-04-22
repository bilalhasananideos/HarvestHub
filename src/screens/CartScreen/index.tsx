import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
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
import { deleteCartApi, getCartApi, updatetoCartApi } from '../../store/services/Services';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

// const DELIVERY_FEE = 4.9;
const DELIVERY_FEE = 0;
const DISCOUNT_LABEL = '20%';

// const CartScreen = () => {
//   // // const [items, setItems] = useState<CartItem[]>(initialItems);
//   const [isSheetVisible, setIsSheetVisible] = useState(false);
//   const [saveCard, setSaveCard] = useState(true);
//   // const [loading, setLoading] = useState(false);

//   // const [items, setItems] = useState<CartItem[]>([]);
//   // const [deliveryFee, setDeliveryFee] = useState(0);
//   // const [discountPercent, setDiscountPercent] = useState(0);
//   // const [subtotal, setSubtotal] = useState(0);
//   // const [total, setTotal] = useState(0);
//   // // const subtotal = useMemo(
//   // //   () => items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0),
//   // //   [items],
//   // // );
//   // // const total = useMemo(() => subtotal + DELIVERY_FEE, [subtotal]);

//   // const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

//   // // useEffect(() => {
//   // //   getToCart()
//   // // }, [])
//   //   useFocusEffect(
//   //     useCallback(() => {
//   //       getToCart();
    
//   //       return () => {
//   //         // optional cleanup when leaving screen
//   //       };
//   //     }, [])
//   //   );

//   //   const getToCart = async () => {
//   //     try {
//   //       setLoading(true);
//   //       const response = await getCartApi()
//   //       console.log("response", response);

//   //       /* 🔹 ITEMS */
//   //       const formattedItems: CartItem[] = response.items.map((item: any) => ({
//   //         id: String(item.id),
//   //         cart_id: String(item.cart_id),
//   //         title: item.vendor_product.product.name,
//   //         priceLabel: `$${Number(item.vendor_product.price).toFixed(2)}`,
//   //         unitSuffix: `/${item.vendor_product.unit.name}`,
//   //         unitPrice: Number(item.vendor_product.price),
//   //         quantity: item.quantity,
//   //         step: 1,
//   //         imageUri: item.vendor_product.product.image,
//   //       }));
//   //       console.log("data", formattedItems)

//   //       setItems(formattedItems);

//   //       /* 🔹 SUMMARY VALUES */
//   //       setDeliveryFee(Number(response.delivery_fee));
//   //       setDiscountPercent(Number(response.discount_percent));
//   //       setSubtotal(Number(response.subtotal));
//   //       setTotal(Number(response.total));
        
//   //     } catch (err) {
//   //       console.log("err", err)
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   // // const handleQuantityChange = (id: string, direction: 1 | -1) => {
//   // //   setItems(prev =>
//   // //     prev.map(item =>
//   // //       item.id === id
//   // //         ? {
//   // //             ...item,
//   // //             quantity: Math.max(1, item.quantity + direction),
//   // //           }
//   // //         : item,
//   // //     ),
//   // //   );
//   // // };
//   // // const handleQuantityChange = async (id, direction) => {

//   // //   const target = items.find(i => i.id === id);
  
//   // //   const newQty = target.quantity + direction;
  
//   // //   if (newQty < 1) return;
  
//   // //   try {
  
//   // //     await updatetoCartApi({
//   // //       item_id: target.cart_id,
//   // //       quantity: newQty
//   // //     });
  
//   // //     getToCart(); // reload cart
  
//   // //   } catch (err) {
//   // //     console.log(err);
//   // //   }
//   // // };
//   // const handleQuantityChange = async (id, direction) => {
//   //   const item = items.find(i => i.id === id);
//   //   if (!item) return;
  
//   //   const newQty = Math.max(1, item.quantity + direction);
  
//   //   // Update backend
//   //   await updatetoCartApi({ item_id: item.id, quantity: newQty });
  
//   //   // Update state
//   //   setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: newQty } : i));
//   // };
//   // const handleRemoveItem = async (id) => {

//   //   try {
  
//   //     await deleteCartApi(id);
  
//   //     getToCart();
  
//   //   } catch (err) {
//   //     console.log(err);
//   //   }
  
//   // };

//   const [items, setItems] = useState<CartItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [subtotal, setSubtotal] = useState(0);
//   const [total, setTotal] = useState(0);
//   const [deliveryFee, setDeliveryFee] = useState(DELIVERY_FEE);
//   const [discountPercent, setDiscountPercent] = useState(20);

//   const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

//   // Fetch cart on screen focus
//   useFocusEffect(
//     useCallback(() => {
//       fetchCart();
//     }, [])
//   );

//   const fetchCart = async () => {
//     try {
//       setLoading(true);
//       const response = await getCartApi();

//       // Map backend items to frontend state
//       const mappedItems = response.items.map((item: any) => ({
//         id: String(item.id),
//         cart_id: String(item.cart_id),
//         vendor_product_id: item.vendor_product_id,
//         title: item.vendor_product.product.name,
//         priceLabel: Number(item.vendor_product.price),
//         unitSuffix: `/${item.vendor_product.unit.name}`,
//         unitPrice: Number(item.vendor_product.price),
//         quantity: item.quantity,
//         imageUri: item.vendor_product.product.image,
//       }));

//       setItems(mappedItems);

//       // Calculate subtotal and total
//       const subtotalCalc = mappedItems.reduce(
//         (acc, i) => acc + i.unitPrice * i.quantity,
//         0
//       );
//       setSubtotal(subtotalCalc);

//       const totalCalc = subtotalCalc + DELIVERY_FEE - subtotalCalc * (discountPercent / 100);
//       setTotal(totalCalc);

//       setDeliveryFee(Number(response.delivery_fee || DELIVERY_FEE));
//       setDiscountPercent(Number(response.discount_percent || discountPercent));
//     } catch (err) {
//       console.log('Cart fetch error', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle + / - quantity change
//   const handleQuantityChange = async (itemId: string, direction: 1 | -1) => {
//     const item = items.find(i => i.id === itemId);
//     if (!item) return;

//     const newQty = Math.max(1, item.quantity + direction);

//     try {
//       // Update backend
//       await updatetoCartApi({ item_id: item.vendor_product_id, quantity: newQty });

//       // Update frontend state
//       setItems(prev =>
//         prev.map(i => (i.id === itemId ? { ...i, quantity: newQty } : i))
//       );

//       // Recalculate totals
//       const newSubtotal = items.reduce((acc, i) => {
//         const qty = i.id === itemId ? newQty : i.quantity;
//         return acc + i.unitPrice * qty;
//       }, 0);
//       setSubtotal(newSubtotal);
//       setTotal(newSubtotal + deliveryFee - newSubtotal * (discountPercent / 100));
//     } catch (err) {
//       console.log('Quantity update error', err);
//     }
//   };

//   // Remove item from cart
//   const handleRemoveItem = async (itemId: string) => {
//     const item = items.find(i => i.id === itemId);
//     if (!item) return;

//     try {
//       await deleteCartApi(item.cart_id);
//       setItems(prev => prev.filter(i => i.id !== itemId));

//       // Recalculate totals
//       const newSubtotal = items
//         .filter(i => i.id !== itemId)
//         .reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
//       setSubtotal(newSubtotal);
//       setTotal(newSubtotal + deliveryFee - newSubtotal * (discountPercent / 100));
//     } catch (err) {
//       console.log('Remove item error', err);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       {/* Overlay Loader */}
//       {loading && (
//         <View style={styles.loaderOverlay}>
//           <ActivityIndicator size="large" color="#4CAF50" />
//         </View>
//       )}
//       <View style={styles.container}>
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.scrollContent}
//         >
//           <View style={styles.addressCard}>
//             <Text style={styles.addressTitle}>20 Cooper Square 20 Cooper Square</Text>
//             <View style={styles.addressRow}>
//               <TouchableOpacity style={styles.changeAddressRow}>
//                 <Text style={styles.changeAddressText}>Change address</Text>
//                 <Image source={arrowRight} style={styles.arrowRight} />
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View style={styles.itemHeaderRow}>
//             <Text style={styles.sectionTitle}>Cart</Text>
//             {/* <TouchableOpacity style={styles.addMoreRow}>
//               <View style={styles.addMoreIcon}>
//                 <Text style={styles.addMoreIconText}>+</Text>
//               </View>
//               <Text style={styles.addMoreText}>Add more items</Text>
//             </TouchableOpacity> */}
//           </View>

//           <View style={styles.itemCard}>
//             {items.map((item, index) => {
//               const displayQuantity = `${item.quantity * item.step}${item.unitSuffix}`;
//               return (
//                 <View
//                   key={item.id}
//                   style={[
//                     styles.itemRow,
//                     index !== items.length - 1 && styles.itemDivider,
//                   ]}
//                 >
//                   <View style={styles.itemThumbWrapper}>
//                     <Image source={{ uri: item.imageUri }} style={styles.itemThumb} />
//                   </View>
//                   <View style={styles.itemInfo}>
//                     <Text style={styles.itemName}>{item.title}</Text>
//                     <Text style={styles.itemPriceLabel}>{item.priceLabel+item.unitSuffix}</Text>
//                   </View>
//                   <View style={styles.quantityGroup}>
//                     <TouchableOpacity
//                       style={[
//                         styles.quantityButton,
//                         item.quantity === 1 && styles.quantityButtonDisabled,
//                       ]}
//                       onPress={() => handleQuantityChange(item.id, -1)}
//                       disabled={item.quantity === 1}
//                     >
//                       <Text
//                         style={[
//                           styles.quantitySymbol,
//                           item.quantity === 1 && styles.quantitySymbolDisabled,
//                         ]}
//                       >
//                         −
//                       </Text>
//                     </TouchableOpacity>
//                     <Text style={styles.quantityValue}>{displayQuantity}</Text>
//                     <TouchableOpacity
//                       style={styles.quantityButton}
//                       onPress={() => handleQuantityChange(item.id, 1)}
//                     >
//                       <Text style={styles.quantitySymbol}>+</Text>
//                     </TouchableOpacity>
//                   </View>
//                   {/* <Text style={styles.itemTotal}>
//                     {formatCurrency(item.unitPrice * item.quantity)}
//                   </Text> */}
//                 </View>
//               );
//             })}
//           </View>

//           <View style={styles.summaryCard}>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Subtotal:</Text>
//               <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
//             </View>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Delivery Fee:</Text>
//               <Text style={styles.summaryValue}>{formatCurrency(DELIVERY_FEE)}</Text>
//             </View>
//             <View style={styles.summaryRow}>
//               <Text style={[styles.summaryLabel, styles.discountLabel]}>Discount:</Text>
//               <Text style={[styles.summaryValue, styles.discountLabel]}>
//                 {DISCOUNT_LABEL}
//               </Text>
//             </View>
//             <View style={styles.summaryDivider} />
//             <View style={styles.summaryRow}>
//               <Text style={styles.totalLabel}>Total cost:</Text>
//               <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
//             </View>
//           </View>
//         </ScrollView>

//         <View style={styles.footer}>
//           <TouchableOpacity
//             style={styles.checkoutButton}
//             onPress={() => setIsSheetVisible(true)}
//           >
//             <Text style={styles.checkoutText}>Proceed to checkout</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       <Modal
//         visible={isSheetVisible}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setIsSheetVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <TouchableOpacity
//             style={styles.overlayTouchable}
//             activeOpacity={1}
//             onPress={() => setIsSheetVisible(false)}
//           />
//           <View style={styles.bottomSheet}>
//             <View style={styles.sheetHeader}>
//               <TouchableOpacity onPress={() => setIsSheetVisible(false)}>
//                 <Text style={styles.sheetBack}>‹</Text>
//               </TouchableOpacity>
//               <Text style={styles.sheetTitle}>Add card</Text>
//               <TouchableOpacity>
//                 <Text style={styles.scanText}>Scan card</Text>
//               </TouchableOpacity>
//             </View>

//             <ScrollView
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={styles.sheetContent}
//             >
//               <Text style={styles.sheetSubtitle}>Card Information</Text>
//               <View style={styles.cardNumberRow}>
//                 <TextInput
//                   style={[styles.input, styles.flex1]}
//                   keyboardType="number-pad"
//                   placeholder="Card number"
//                   placeholderTextColor={colors.text.hint}
//                 />
//                 {/* <Image
//                   source={{
//                     uri: 'https://static.thenounproject.com/png/5034132-200.png',
//                   }}
//                   style={styles.cardBrands}
//                   resizeMode="contain"
//                 /> */}
//               </View>
//               <View style={styles.doubleInputRow}>
//                 <TextInput
//                   style={[styles.input, styles.flex1]}
//                   keyboardType="number-pad"
//                   placeholder="MM / YY"
//                   placeholderTextColor={colors.text.hint}
//                 />
//                 <TextInput
//                   style={[styles.input, styles.flex1]}
//                   keyboardType="number-pad"
//                   placeholder="CVC"
//                   placeholderTextColor={colors.text.hint}
//                 />
//               </View>

//               <Text style={styles.sheetSubtitle}>Billing address</Text>
//               <TouchableOpacity style={styles.selectorInput}>
//                 <Text style={styles.selectorLabel}>Country or region</Text>
//                 <Text style={styles.selectorValue}>United States</Text>
//               </TouchableOpacity>
//               <TextInput
//                 style={styles.input}
//                 keyboardType="number-pad"
//                 placeholder="ZIP"
//                 placeholderTextColor={colors.text.hint}
//               />

//               <View style={styles.saveRow}>
//                 <Switch
//                   value={saveCard}
//                   onValueChange={setSaveCard}
//                   trackColor={{
//                     false: colors.border.light,
//                     true: colors.primary.main,
//                   }}
//                   thumbColor={colors.neutral.white}
//                 />
//                 <Text style={styles.saveLabel}>
//                   Save this card for future powder payments
//                 </Text>
//               </View>

//               <TouchableOpacity style={styles.payButton}>
//                 <Text style={styles.payButtonText}>
//                   Pay {formatCurrency(total)}
//                 </Text>
//               </TouchableOpacity>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

const CartScreen = (props: any) => {
  const [items, setItems]               = useState<any[]>([]);
  const [cart_id, setCartId]            = useState("");
  const [loading, setLoading]           = useState(false);
  const [subtotal, setSubtotal]         = useState(0);
  const [total, setTotal]               = useState(0);
  const [deliveryFee, setDeliveryFee]   = useState(DELIVERY_FEE);
  const [discountPercent, setDiscountPercent] = useState(0);

  // ── Selected address (comes back from AddressListScreen) ──────────────────
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

  // ── Fetch cart on focus ───────────────────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, [])
  );

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCartApi();

      const mappedItems = response.items.map((item: any) => ({
        id:                String(item.id),
        cart_id:           String(item.cart_id),
        vendor_product_id: item.vendor_product_id,
        title:             item.vendor_product.product.name,
        priceLabel:        Number(item.vendor_product.price),
        unitSuffix:        `/${item.vendor_product.unit.name}`,
        unitPrice:         Number(item.vendor_product.price),
        quantity:          item.quantity,
        imageUri:          item.vendor_product.product.image,
        vendor_id:         item.vendor_product.vendor_id,
        product_id:        item.vendor_product.product_id,
      }));

      setItems(mappedItems);
      setCartId(response?.id);

      const subtotalCalc = mappedItems.reduce(
        (acc: number, i: any) => acc + i.unitPrice * i.quantity,
        0
      );
      setSubtotal(subtotalCalc);

      const dl  = Number(response.delivery_fee    || DELIVERY_FEE);
      const dis = Number(response.discount_percent || 0);
      setDeliveryFee(dl);
      setDiscountPercent(dis);
      setTotal(subtotalCalc + dl - subtotalCalc * (dis / 100));
    } catch (err) {
      console.log("Cart fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Quantity change ───────────────────────────────────────────────────────
  const handleQuantityChange = async (itemId: string, direction: 1 | -1) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    const newQty = Math.max(1, item.quantity + direction);
    try {
      setLoading(true);
      await updatetoCartApi({ item_id: item.id, quantity: newQty });
      const updated = items.map(i => i.id === itemId ? { ...i, quantity: newQty } : i);
      setItems(updated);
      const newSub = updated.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
      setSubtotal(newSub);
      setTotal(newSub + deliveryFee - newSub * (discountPercent / 100));
    } catch (err) {
      console.log("Quantity update error", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Remove item ───────────────────────────────────────────────────────────
  const handleRemoveItem = async (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    try {
      setLoading(true);
      await deleteCartApi(item.id);
      const remaining = items.filter(i => i.id !== itemId);
      setItems(remaining);
      const newSub = remaining.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
      setSubtotal(newSub);
      setTotal(newSub + deliveryFee - newSub * (discountPercent / 100));
    } catch (err) {
      console.log("Remove item error", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Navigate to address list ──────────────────────────────────────────────
  const handleSelectAddress = () => {
    props.navigation.navigate("AddressListScreen", {
      // When user picks an address, it comes back here via setSelectedAddress
      onSelect: (address: any) => setSelectedAddress(address),
    });
  };

  // ── Empty cart UI ─────────────────────────────────────────────────────────
  const CartEmpty = () => (
    <View style={styles.wrap}>
      <View style={styles.iconCircle}>
        <Ionicons name="bag-outline" size={42} color="#7a9e6e" />
      </View>
      <Text style={styles.title}>Your cart is empty</Text>
      <Text style={styles.subtitle}>
        Looks like you haven't added{"\n"}anything yet
      </Text>
    </View>
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      )}

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Address Row ── */}
        <TouchableOpacity
          style={styles.addressRow}
          activeOpacity={0.7}
          onPress={handleSelectAddress}
        >
          {selectedAddress ? (
            // Address selected — show it
            <View style={styles.addressTextWrap}>
              <Text style={styles.addressText} numberOfLines={2}>
                {selectedAddress.full_address ?? selectedAddress.address ?? ""}
              </Text>
              <Text style={styles.changeAddressText}>Change address</Text>
            </View>
          ) : (
            // No address yet
            <Text style={styles.selectAddressText}>Select address</Text>
          )}
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        {/* ── Cart Items ── */}
        {items.length === 0 ? (
          <CartEmpty />
        ) : (
          <View style={styles.itemCard}>
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                <View
                  style={[
                    styles.itemRow,
                    index !== items.length - 1 && styles.itemDivider,
                  ]}
                >
                  <View style={styles.itemThumbWrapper}>
                    <Image
                      source={{ uri: item.imageUri }}
                      style={styles.itemThumb}
                    />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.title}</Text>
                    <Text style={styles.itemPriceLabel}>
                      {formatCurrency(item.unitPrice) + item.unitSuffix}
                    </Text>
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
                    <Text style={styles.quantityValue}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleQuantityChange(item.id, 1)}
                    >
                      <Text style={styles.quantitySymbol}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Delete icon */}
                <TouchableOpacity
                  onPress={() => handleRemoveItem(item.id)}
                  style={styles.deleteIconParent}
                >
                  <Image
                    source={require("../../assets/images/deleteaccount.png")}
                    style={styles.deleteIcon}
                  />
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        )}

        {/* ── Summary ── */}
        {items.length > 0 && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(deliveryFee)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, styles.discountLabel]}>Discount:</Text>
              <Text style={[styles.summaryValue, styles.discountLabel]}>
                {discountPercent}%
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ── Footer: Proceed to checkout ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.checkoutButton,
            (items.length === 0) && { opacity: 0.5 },
          ]}
          disabled={items.length === 0}
          onPress={() =>
            props.navigation.navigate("AddAddress", {
              items,
              vendor_id: items[0]?.vendor_id,
              cart_id,
              selectedAddress, // pass selected address to checkout
            })
          }
        >
          <Text style={styles.checkoutText}>Proceed to checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.paper,
  },
  loaderOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
    zIndex: 999,
  },
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: wp("5%"),
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // ── Address row ──
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingVertical: 4,
  },
  addressTextWrap: {
    flex: 1,
    marginRight: 8,
  },
  addressText: {
    fontSize: 13,
    color: colors.text.primary,
    fontWeight: "500",
    lineHeight: 18,
  },
  changeAddressText: {
    fontSize: 12,
    color: "#2979FF",
    fontWeight: "600",
    marginTop: 2,
  },
  selectAddressText: {
    fontSize: 14,
    color: "#2979FF",
    fontWeight: "600",
    flex: 1,
  },
  chevron: {
    fontSize: 20,
    color: "#aaa",
    marginLeft: 4,
  },

  // ── Item card ──
  itemCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
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
    overflow: "hidden",
  },
  itemThumb: {
    width: "100%",
    height: "100%",
  },
  itemInfo: { flex: 1 },
  itemName: {
    fontSize: fontSizes.fs16,
    fontWeight: "400",
    color: colors.text.primary,
  },
  itemPriceLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  quantityGroup: {
    flexDirection: "row",
    alignItems: "center",
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.neutral.white,
  },
  quantityButtonDisabled: { opacity: 0.4 },
  quantitySymbol: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary.main,
  },
  quantitySymbolDisabled: { color: colors.text.secondary },
  quantityValue: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.primary,
    minWidth: 52,
    textAlign: "center",
  },

  deleteIconParent: {
    alignItems: "flex-end",
    bottom: 10,
    right: 20,
  },
  deleteIcon: { width: 16, height: 16 },

  // ── Summary ──
  summaryCard: {
    backgroundColor: "#F6F6F6",
    borderRadius: 18,
    padding: 18,
    marginTop: 20,
    gap: 12,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryLabel: { fontSize: 13, color: colors.text.secondary },
  summaryValue: { fontSize: 13, fontWeight: "600", color: colors.text.primary },
  discountLabel: { color: colors.primary.secondary },
  summaryDivider: { height: 1, backgroundColor: colors.border.primary },
  totalLabel: { fontSize: 14, fontWeight: "700", color: colors.text.primary },
  totalValue: { fontSize: 14, fontWeight: "700", color: colors.text.primary },

  // ── Footer ──
  footer: { padding: 20 },
  checkoutButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  checkoutText: {
    color: colors.neutral.white,
    fontSize: 16,
    fontWeight: "600",
  },

  // ── Empty cart ──
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#eaf3e0",
    borderWidth: 1.5,
    borderColor: "#c5ddb4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c2c2c",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    lineHeight: 22,
  },
});
