import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../../theme/colors';
import { hp, wp, scale } from '../../theme/responsive';
import { typography } from '../../theme/typography';
import CacheImage from '../../components/CacheImage';
import { arrowleft, star, truck, plus, sub } from '../../assets';

// ui needs
// product = {
//   name: '',
//   price: '',
//   unit: '',
//   availableQuantity: '',
//   expiryDate: '',
//   description: '',
//   images: [array],
// }

// api response
// item = {
//   count: "70.00",
//   description: "best qaulity mangoes",
//   expiry_date: "2027-04-08",
//   id: 1,
//   price: "250.00",
//   images: [
//     { image_url: "..." },
//     { image_url: "..." },
//     { image_url: "..." }
//   ],
//   product: { name: "Mango" },
//   unit: { name: "kg" }
// }

const ProductDetailScreen = ({ route }: any) => {
  const navigation = useNavigation();
  const { item } = route.params;

  const [quantity, setQuantity] = useState(3);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalVisible, setImageModalVisible] = useState(false);

  // Watermelon product data (from your screenshot + many images)
  // const product = {
  //   name: 'Organic watermelon',
  //   subtitle: 'chemical free.',
  //   price: 8.99,
  //   unit: 'kg',
  //   availableQuantity: '26 kg',
  //   expiryDate: '25 Oct 2025',
  //   description:
  //     'These juicy, seedless organic watermelons are grown naturally without any harmful chemicals or pesticides. Sweet, crisp, and refreshing, they are perfect for summer picnics, smoothies, or simply enjoying fresh.\n\nHarvested fresh from local farms, these watermelons deliver both rich flavor and natural nutrition straight to your table.',
  //   images: [
  //     'https://images.unsplash.com/photo-1558818498-28c1e002b655?w=800',
  //     'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800',
  //     'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800',
  //     'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800',
  //     'https://images.unsplash.com/photo-1558818498-28c1e002b655?w=800',
  //     'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800',
  //     'https://images.unsplash.com/photo-1558818498-28c1e002b655?w=800',
  //     'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800',
  //     'https://images.unsplash.com/photo-1558818498-28c1e002b655?w=800',
  //     'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800',
  //     'https://images.unsplash.com/photo-1558818498-28c1e002b655?w=800',
  //     'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800',
  //   ],
  // };
  // Convert API structure to UI-friendly structure
  const product = {
    name: item.product?.name || 'N/A',
    subtitle: item.description || '',
    price: Number(item.price) || 0,
    unit: item.unit?.name || 'kg',
    availableQuantity: item.count ? `${item.count} ${item.unit?.name}` : '',
    expiryDate: item.expiry_date || '',
    description: item.description || '',
    images: item.images?.map(img => img.image_url) || [],
  };

  const handleQuantityChange = (change: number) => {
    const newQty = quantity + change;
    if (newQty >= 1 && newQty <= 50) setQuantity(newQty);
  };

  const openImageModal = () => setImageModalVisible(true);
  const closeImageModal = () => setImageModalVisible(false);

  const handleAddToCart = () => {
    Alert.alert('Success', `${quantity}kg Organic Watermelon added to cart!`);
  };

  // Render thumbnail
  const renderThumbnail = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      onPress={() => setSelectedImageIndex(index)}
      style={[
        styles.thumbnail,
        selectedImageIndex === index && styles.thumbnailActive,
      ]}
    >
      <CacheImage url={item} style={styles.thumbnailImage} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Image Section */}
        <View style={styles.imageSection}>
          <TouchableOpacity onPress={openImageModal} activeOpacity={0.9}>
            <CacheImage
              url={product.images[selectedImageIndex]}
              style={styles.mainImage}
            />
            <View style={styles.tapHint}>
              <Text style={styles.tapHintText}>Tap to zoom</Text>
            </View>
          </TouchableOpacity>

          {/* Scrollable Thumbnails */}
          <FlatList
            data={product.images}
            renderItem={renderThumbnail}
            keyExtractor={(_, i) => i.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailContainer}
            contentContainerStyle={styles.thumbnailScrollContent}
            removeClippedSubviews
            maxToRenderPerBatch={6}
            windowSize={10}
          />

          {/* Page Indicator Dots */}
          <View style={styles.pageIndicator}>
            {product.images.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  selectedImageIndex === i && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.subtitle}>{product.subtitle}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price}</Text>
            <Text style={styles.perUnit}>/{product.unit}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoChip}>
              <Text style={styles.infoText}>Available: {product.availableQuantity}</Text>
            </View>
            <View style={styles.infoChip}>
              <Text style={styles.infoText}>Expiry: {product.expiryDate}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

  
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.quantityPicker}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => handleQuantityChange(-1)}>
            <Image source={sub} style={styles.qtyIcon} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}kg</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => handleQuantityChange(1)}>
            <Image     source={plus} style={styles.qtyIcon} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart}>
          <Text style={styles.addBtnText}>Add to cart</Text>
          <Text style={styles.totalPrice}>
            ${(product.price * quantity).toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Image Zoom Modal */}
      <Modal visible={isImageModalVisible} transparent animationType="fade">
        <View style={styles.modalBg}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeImageModal} />
          <CacheImage
            url={product.images[selectedImageIndex]}
            style={styles.modalImage}
          />
          <TouchableOpacity style={styles.closeModalBtn} onPress={closeImageModal}>
            <Text style={styles.closeModalText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff',marginTop:hp("1q") },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
    paddingTop: hp(1),
    paddingBottom: hp(2),
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIcon: { width: 20, height: 20, tintColor: '#333' },
  favBtn: { padding: 8 },
  favIcon: { width: 24, height: 24, tintColor: '#ccc' },

  // Image Section
  imageSection: { paddingHorizontal: wp(4) },
  mainImage: {
    width: '100%',
    height: hp(40),
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  tapHint: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tapHintText: {
    fontSize: scale(11),
    fontFamily: typography.fontFamily.Medium,
    color: '#333',
  },

  // Scrollable Thumbnails
  thumbnailContainer: {
    marginTop: hp(1.5),
  },
  thumbnailScrollContent: {
    gap: wp(2),
    paddingRight: wp(5),
  },
  thumbnail: {
    width: wp(18),
    height: wp(18),
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    borderColor: colors.primary.main,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  thumbnailImage: { width: '100%', height: '100%' },

  // Page Dots
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: wp(1.2),
    marginTop: hp(2),
    paddingBottom: hp(2),
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
  },
  dotActive: {
    backgroundColor: colors.primary.main,
    width: 24,
  },

  // Content
  content: { paddingHorizontal: wp(5),  },
  title: {
    fontSize: scale(26),
    fontFamily: typography.fontFamily.SemiBold,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: scale(15),
    color: colors.primary.main,
    marginTop: 4,
    fontFamily: typography.fontFamily.Medium,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: hp(1),
  },
  price: {
    fontSize: scale(32),
    fontFamily: typography.fontFamily.Bold,
    color: colors.primary.main,
  },
  perUnit: {
    fontSize: scale(16),
    color: '#666',
    marginLeft: 6,
    fontFamily: typography.fontFamily.Medium,
  },
  infoRow: {
    flexDirection: 'row',
    gap: wp(2),
    marginTop: hp(2),
  },
  infoChip: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: 20,
  },
  infoText: {
    fontSize: scale(12),
    color: '#444',
    fontFamily: typography.fontFamily.Medium,
  },
  sectionTitle: {
    fontSize: scale(17),
    fontFamily: typography.fontFamily.SemiBold,
    color: '#1a1a1a',
    marginTop: hp(3),
    marginBottom: hp(1),
  },
  description: {
    fontSize: scale(14.5),
    lineHeight: scale(22),
    color: '#444',
    fontFamily: typography.fontFamily.Regular,
  },

  // Delivery
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(2.5),
    paddingVertical: hp(1.5),
  },
  truckIcon: { width: 28, height: 28, tintColor: colors.primary.main, marginRight: 12 },
  deliveryMain: {
    fontSize: scale(14),
    fontFamily: typography.fontFamily.SemiBold,
    color: '#1a1a1a',
  },
  deliverySub: {
    fontSize: scale(12),
    color: '#666',
    marginTop: 2,
  },

  // Bottom Bar
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  quantityPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    paddingHorizontal: wp(2),
    height: 48,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  qtyIcon: { width: wp(8), height: wp(8),  },
  qtyText: {
    fontSize: scale(16),
    fontFamily: typography.fontFamily.SemiBold,
    color: '#1a1a1a',
    marginHorizontal: wp(4),
    minWidth: 40,
    textAlign: 'center',
  },
  addBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary.main,
    marginLeft: wp(3),
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.8),
    borderRadius: 12,
  },
  addBtnText: {
    fontSize: scale(15),
    fontFamily: typography.fontFamily.SemiBold,
    color: '#fff',
  },
  totalPrice: {
    fontSize: scale(17),
    fontFamily: typography.fontFamily.Bold,
    color: '#fff',
  },

  // Modal
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: wp(90),
    height: hp(60),
  },
  closeModalBtn: {
    marginTop: hp(2),
    backgroundColor: '#fff',
    paddingHorizontal: wp(8),
    paddingVertical: hp(1.5),
    borderRadius: 30,
  },
  closeModalText: {
    fontSize: scale(15),
    fontFamily: typography.fontFamily.SemiBold,
    color: '#333',
  },
});

export default ProductDetailScreen;