import { useEffect, useRef, useState } from 'react';

import { Dimensions } from 'react-native';
import { isIOS } from '../../theme/responsive';
import { logo } from '../../assets';
import { onboardingData } from '../../constants/data';
import { setOnboardingComplete } from '../../redux/slices/authSlice';
const useOnboardingScreen = navigation => {
  const flatListRef = useRef(null);
  // const hasSeenOnboarding = useSelector(state => state.auth.hasSeenOnboarding);

  const [currentIndex, setCurrentIndex] = useState(0);

  const onSnapToItem = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(
      contentOffsetX / Dimensions.get('window').width,
    );
    setCurrentIndex(newIndex);
  };

  const handleNext = () => {
    // Check if we're already at the last slide
    if (currentIndex >= onboardingData.length - 1) {
      // Navigate to sign up screen instead of scrolling
      navigation.navigate('SignUp'); // or whatever your signup screen name is
      return; // Exit the function early
    }

    // Only scroll if we're not at the last index
    if (!isIOS) {
      setCurrentIndex(prev => prev + 1);
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const handleLogin = () => {
    navigation.navigate('SignIn');
  };

  // // Check if user has seen onboarding before
  // useEffect(() => {
  //   // if (hasSeenOnboarding) {
  //     // Don't auto-navigate here, let AuthNavigator handle the initial route
  //     console.log('User has already seen onboarding, should start at SignIn');
  //   }
  // }, [hasSeenOnboarding]);

  // Mark onboarding as completed when user proceeds
  const completeOnboarding = () => {
    console.log('comONbarding');
    // dispatch(setOnboardingComplete());
  };

  // Modified handleNextWithComplete to use the same safety check
  const handleNextWithComplete = () => {
    if (currentIndex === onboardingData.length - 1) {
      completeOnboarding();
      navigation.navigate('SignUp'); // or whatever your signup screen name is
      return; // Exit early
    }
    handleNext();
  };

  // Modified handleLogin to mark onboarding as completed
  const handleLoginWithComplete = () => {
    completeOnboarding();
    handleLogin();
  };

  return {
    onboardingData,
    currentIndex,
    onSnapToItem,
    flatListRef,
    handleNext,
    handleLogin,
    handleNextWithComplete,
    handleLoginWithComplete,
  };
};

export default useOnboardingScreen;
