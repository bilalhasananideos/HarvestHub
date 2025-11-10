import { Dimensions } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';

export {wp, hp, };

export const fontSizes = {
  fs10: hp(1.05),
  fs11: hp(1.15),
  fs12: hp(1.25),
  fs13: hp(1.36),
  fs14: hp(1.46),
  fs15: hp(1.57),
  fs16: hp(1.67),
  fs17: hp(1.78),
  fs18: hp(1.88),
  fs19: hp(1.99),
  fs20: hp(2.09),
  fs21: hp(2.20),
  fs22: hp(2.30),
  fs23: hp(2.41),
  fs24: hp(2.51),
  fs25: hp(2.62),
  fs26: hp(2.72),
  fs27: hp(2.83),
  fs28: hp(2.93),
  fs29: hp(3.04),
  fs30: hp(3.14),
  fs31: hp(3.25),
  fs32: hp(3.35),
  fs33: hp(3.46),
  fs34: hp(3.56),
  fs35: hp(3.66),
  fs36: hp(3.76),
  fs37: hp(3.87),
  fs38: hp(3.97),
  fs39: hp(4.08),
  fs40: hp(4.18),
  fs41: hp(4.29),
  fs42: hp(4.39),
  fs43: hp(4.50),
  fs44: hp(4.60),
  fs45: hp(4.71),
  fs46: hp(4.81),
  fs47: hp(4.92),
  fs48: hp(5.02),
  fs49: hp(5.13),
  fs50: hp(5.23),
};

  
// const guidelineBaseWidth = 440;
// const guidelineBaseHeight = 956;
// import { Dimensions } from 'react-native';
// const { width, height } = Dimensions.get('window');
// export const scale = (size: number) => (width / guidelineBaseWidth) * size;
// export const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;   


const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 555;
const guidelineBaseHeight = 956;

export const scale = (size: number) => (width / guidelineBaseWidth) * size;
export const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;






