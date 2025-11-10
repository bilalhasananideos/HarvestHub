import React, { memo, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Text,
} from 'react-native';
import useOnboardingScreen from './useOnboarding';
import { styles } from './style';
import { wp, hp } from '../../theme/responsive';
import { onboardingData } from '../../constants/data';
import { TextComponent } from '../../components/TextComponent';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../theme/colors';
export default function OnboardingScreen({ navigation }) {
  const {
    currentIndex,
    onSnapToItem,
    flatListRef,
    handleNextWithComplete,
    handleLoginWithComplete,
  } = useOnboardingScreen(navigation);

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <ImageBackground
          resizeMode="contain"
          source={item?.image}
          style={styles.bgImage}
          key={index}
        >
          <View style={styles.centerMainView}>
            <Text style={styles.centerText}>{item.title}</Text>
            <TextComponent
              numberOfLines={2}
              text={item?.subtitle}
              styles={styles.subtitle}
            />
          </View>
        </ImageBackground>
      );
    },
    [currentIndex],
  );

  return (
    <View
      style={{ flex: 1, position: 'relative', width: wp('100'), zIndex: 1 }}
    >
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onSnapToItem}
        keyExtractor={(item, index) => index.toString()}
      />

      <View style={styles.bottomContainer}>
        <View style={styles.dotList}>
          {onboardingData?.map((_, index) => (
            <View key={index} style={styles.dot(currentIndex, index)} />
          ))}
        </View>
        {currentIndex === onboardingData?.length - 1 ? (
          <LinearGradient
            colors={[colors.primary.main, colors.primary.main]}
            style={styles.linearGradient}
          >
            <TouchableOpacity
              style={styles.getStartedBtn}
              // onPress={handleLoginWithComplete}>
              onPress={() => handleLoginWithComplete()}
            >
              <TextComponent text={'Get started'} styles={styles.arrowText} />
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          <LinearGradient
            colors={[colors.primary.main, colors.primary.main]}
            style={styles.linearGradient}
          >
            <TouchableOpacity
              style={styles.btnArrow}
              onPress={handleNextWithComplete}
            >
              <TextComponent
                text={
                  currentIndex === onboardingData?.length - 1
                    ? 'Sign Up'
                    : 'Next'
                }
                styles={styles.arrowText}
              />
            </TouchableOpacity>
          </LinearGradient>
        )}
      </View>
    </View>
  );
}
