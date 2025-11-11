import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../../theme/colors';
import { hp, wp, scale, fontSizes } from '../../theme/responsive';
import { typography } from '../../theme/typography';
import CacheImage from '../../components/CacheImage';
import {
  arrowleft,
  star,
  location,
  truck,
  plus,
  sub,
} from '../../assets';

const ProductDetailScreen = ({ route }: any) => {
  const navigation = useNavigation();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Demo product data
  const product = {
    id: '1',
    name: 'Organic Heirloom Tomatoes',
    price: 12.99,
    originalPrice: 15.99,
    unit: 'lb',
    rating: 4.8,
    reviews: 124,
    description: 'Fresh, juicy heirloom tomatoes grown organically on our family farm. These colorful, flavorful tomatoes are perfect for salads, sauces, or simply enjoying fresh. Harvested daily at peak ripeness.',
    category: 'Vegetables',
    availability: 'In Stock',
    farm: {
      name: 'Green Valley Farms',
      location: '5.2 miles away',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400',
      description: 'Family-owned organic farm specializing in heirloom vegetables and sustainable farming practices.',
    },
    images: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800',
      'https://images.unsplash.com/photo-1558818498-28c1e002b655?w=800',
    ],
    nutrition: {
      calories: '18 kcal',
      protein: '0.9g',
      carbs: '3.9g',
      fat: '0.2g',
      fiber: '1.2g',
    },
    delivery: {
      freeDelivery: true,
      minOrder: 25,
      estimatedDelivery: '2-3 hours',
    },
  };

  const handleAddToCart = () => {
    Alert.alert('Success', `${quantity} ${product.name} added to cart!`);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 20) {
      setQuantity(newQuantity);
    }
  };

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <CacheImage url={arrowleft} style={styles.backIcon} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Image
            source={isFavorite ? {uri: 'https://cdn-icons-png.flaticon.com/512/833/833472.png'} : {uri: 'https://cdn-icons-png.flaticon.com/512/833/833300.png'}}
            style={[styles.favoriteIcon, isFavorite && styles.favoriteIconActive]}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Product Images */}
        <View style={styles.imageContainer}>
          <ImageBackground
            source={{ uri: product.images[selectedImageIndex] }}
            style={styles.mainImage}
            resizeMode="cover"
          >
            <View style={styles.imageOverlay} />
          </ImageBackground>
          
          {/* Image Thumbnails */}
          <View style={styles.thumbnailContainer}>
            {product.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.thumbnail,
                  selectedImageIndex === index && styles.thumbnailActive,
                ]}
                onPress={() => handleImageSelect(index)}
              >
                <CacheImage url={image} style={styles.thumbnailImage} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.ratingContainer}>
              <CacheImage url={star} style={styles.starIcon} />
              <Text style={styles.ratingText}>{product.rating}</Text>
              <Text style={styles.reviewsText}>({product.reviews})</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price}</Text>
            <Text style={styles.originalPrice}>${product.originalPrice}</Text>
            <Text style={styles.discountBadge}>Save ${(product.originalPrice - product.price).toFixed(2)}</Text>
          </View>

          <Text style={styles.description}>{product.description}</Text>

          {/* Farm Info */}
          <View style={styles.farmSection}>
            <Text style={styles.sectionTitle}>From the Farm</Text>
            <View style={styles.farmCard}>
              <CacheImage url={product.farm.image} style={styles.farmImage} />
              <View style={styles.farmInfo}>
                <Text style={styles.farmName}>{product.farm.name}</Text>
                <View style={styles.farmLocation}>
                  <CacheImage url={location} style={styles.locationIcon} />
                  <Text style={styles.farmLocationText}>{product.farm.location}</Text>
                </View>
                <View style={styles.farmRating}>
                  <CacheImage url={star} style={styles.smallStarIcon} />
                  <Text style={styles.farmRatingText}>{product.farm.rating}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Delivery Info */}
          <View style={styles.deliverySection}>
            <Text style={styles.sectionTitle}>Delivery</Text>
            <View style={styles.deliveryInfo}>
              <CacheImage url={truck} style={styles.deliveryIcon} />
              <View style={styles.deliveryTextContainer}>
                <Text style={styles.deliveryText}>
                  {product.delivery.freeDelivery ? 'Free Delivery' : 'Delivery Available'}
                </Text>
                <Text style={styles.deliverySubtext}>
                  Min. order ${product.delivery.minOrder} • {product.delivery.estimatedDelivery}
                </Text>
              </View>
            </View>
          </View>

          {/* Nutrition Info */}
          <View style={styles.nutritionSection}>
            <Text style={styles.sectionTitle}>Nutrition per 100g</Text>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{product.nutrition.calories}</Text>
                <Text style={styles.nutritionLabel}>Calories</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{product.nutrition.protein}</Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{product.nutrition.carbs}</Text>
                <Text style={styles.nutritionLabel}>Carbs</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{product.nutrition.fiber}</Text>
                <Text style={styles.nutritionLabel}>Fiber</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(-1)}
          >
            <CacheImage url={sub} style={styles.quantityIcon} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(1)}
          >
            <CacheImage url={plus} style={styles.quantityIcon} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
          <Text style={styles.totalPrice}>${(product.price * quantity).toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:  colors.neutral.white,
  },
  scrollContent: {
    paddingBottom: hp(100),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    backgroundColor:  colors.neutral.white,
    zIndex: 10,
  },
  backButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor:  colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  backIcon: {
    width: wp(5),
    height: wp(5),
    tintColor: colors.text.primary,
  },
  favoriteButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  favoriteIcon: {
    width: wp(5),
    height: wp(5),
    tintColor: colors.border.dark,
  },
  favoriteIconActive: {
    tintColor: colors.text.primary,
  },
  imageContainer: {
    position: 'relative',
  },
  mainImage: {
    width: wp(100),
    height: hp(50),
  },
  imageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  thumbnailContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
  },
  thumbnail: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(2),
    marginHorizontal: wp(1),
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  thumbnailActive: {
    borderColor: colors.border.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp(2),
  },
  productInfo: {
    paddingHorizontal: wp(5),
    paddingTop: hp(3),
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(1),
  },
  productName: {
    fontSize: fontSizes.fs30,
    fontWeight:'500',
    color: colors.text.primary,
    flex: 1,
    marginRight: wp(3),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.shadow,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: wp(3),
  },
  starIcon: {
    width: wp(4),
    height: wp(4),
    tintColor: '#FFD700',
    marginRight: wp(1),
  },
  ratingText: {
    fontSize: fontSizes.fs12,
    fontWeight:'500',
    color: colors.text.primary,
    marginRight: wp(1),
  },
  reviewsText: {
    fontSize: fontSizes.fs12,
    fontWeight:'500',
    color: colors.text.secondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  price: {
    fontSize: fontSizes.fs30,
    fontWeight:'500',
    color: colors.primary.main,
    marginRight: wp(2),
  },
  originalPrice: {
    fontSize: fontSizes.fs20,
    fontWeight:'500',
    color: colors.text.secondary,  
    textDecorationLine: 'line-through',
    marginRight: wp(2),
  },
  discountBadge: {
    fontSize: fontSizes.fs12,
    fontWeight:'500', 
    color: colors.neutral.white,
    backgroundColor: colors.status.success,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: wp(2),
  },
  description: {
    fontSize: scale(14),
    fontWeight:'500',
    color: colors.text.secondary,
    lineHeight: scale(14) * 1.5,
    marginBottom: hp(3),
  },
  farmSection: {
    marginBottom: hp(3),
  },
  sectionTitle: {
    fontSize: scale(16),
    fontWeight:'500', 
    color: colors.text.primary,
    marginBottom: hp(1.5),
  },
  farmCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.paper,
    borderRadius: wp(4),
    padding: wp(4),
    alignItems: 'center',
  },
  farmImage: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(7.5),
    marginRight: wp(3),
  },
  farmInfo: {
    flex: 1,
  },
  farmName: {
    fontSize: scale(14),
    fontFamily: typography.fontFamily.SemiBold,
    color: colors.text.primary,
    marginBottom: hp(0.5),
  },
  farmLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  locationIcon: {
    width: wp(4),
    height: wp(4),
    tintColor: colors.border.dark,
    marginRight: wp(1),
  },
  farmLocationText: {
    fontSize: scale(12),
    fontFamily: typography.fontFamily.Regular,
    color: colors.text.secondary,
  },
  farmRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallStarIcon: {
    width: wp(3),
    height: wp(3),
    tintColor: '#FFD700',
    marginRight: wp(0.5),
  },
  farmRatingText: {
    fontSize: scale(12),
    fontFamily: typography.fontFamily.Regular,
    color: colors.text.primary,
  },
  deliverySection: {
    marginBottom: hp(3),
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    padding: wp(4),
    borderRadius: wp(4),
  },
  deliveryIcon: {
    width: wp(6),
    height: wp(6),
    tintColor: colors.primary.main,
    marginRight: wp(3),
  },
  deliveryTextContainer: {
    flex: 1,
  },
  deliveryText: {
    fontSize: scale(14),
    fontFamily: typography.fontFamily.SemiBold,
    color: colors.text.primary,
    marginBottom: hp(0.3),
  },
  deliverySubtext: {
    fontSize: scale(12),
    fontFamily: typography.fontFamily.Regular,
    color: colors.text.secondary,
  },
  nutritionSection: {
    marginBottom: hp(3),
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -wp(1),
  },
  nutritionItem: {
    width: '25%',
    paddingHorizontal: wp(1),
    marginBottom: hp(1.5),
  },
  nutritionValue: {
    fontSize: scale(12),
    fontFamily: typography.fontFamily.SemiBold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  nutritionLabel: {
    fontSize: scale(10),
    fontFamily: typography.fontFamily.Regular,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: hp(0.3),
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.neutral.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    borderTopWidth: 1,
    borderTopColor: colors.border.main,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
  },
  quantityButton: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quantityIcon: {
    width: wp(4),
    height: wp(4),
    tintColor: colors.primary.main,
  },
  quantityText: {
    fontSize: scale(16),
    fontWeight:'500', 
    color: colors.text.primary,
    marginHorizontal: wp(3),
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary.main,
    borderRadius: wp(4),
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    marginLeft: wp(3),
  },
  addToCartText: {
    fontSize: scale(14),
    fontWeight:'500', 
    color: colors.neutral.white,
  },
  totalPrice: {
    fontSize: scale(16),
    fontWeight:'500',   
    color: colors.neutral.white, 
  },
});

export default ProductDetailScreen;