import {Platform, PixelRatio} from 'react-native';

// const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
// const STANDARD_WIDTH = 375; // iPhone X/11 Pro/12 Mini
// const STANDARD_HEIGHT = 812;

// export const scale = (size: number) => {
//   const widthRatio = SCREEN_WIDTH / STANDARD_WIDTH;
//   const heightRatio = SCREEN_HEIGHT / STANDARD_HEIGHT;
//   const ratio = Math.min(widthRatio, heightRatio);

//   // Different scale factors for different screen sizes
//   let factor = 1;
//   if (SCREEN_WIDTH <= 320) {
//     // iPhone SE 1st gen
//     factor = 0.85;
//   } else if (SCREEN_WIDTH < 375) {
//     // Smaller phones
//     factor = 0.9;
//   } else if (SCREEN_WIDTH >= 414) {
//     // iPhone Plus/Pro Max models, larger Android
//     factor = 1.1;
//   }

//   const newSize = size * ratio * factor;
//   return Math.round(PixelRatio.roundToNearestPixel(newSize));
// };

const fontScale = PixelRatio.getFontScale();

export const scale = (size: number) => size / fontScale;

export const typography = {
  // Font Families
  fontFamily: {
    Regular: Platform.select({
      ios: 'WorkSans-Regular',
      android: 'WorkSans-Regular',
    }),
    Medium: Platform.select({
      ios: 'WorkSans-Medium',
      android: 'WorkSans-Medium',
    }),
    SemiBold: Platform.select({
      ios: 'WorkSans-SemiBold',
      android: 'WorkSans-SemiBold',
    }),
    Bold: Platform.select({
      ios: 'WorkSans-Bold',
      android: 'WorkSans-Bold',
    }),
  },

  // Font Sizes - Figma Spec: 16px base with Work Sans Medium
  fontSize: {
    titleFont: scale(24),
    subtileFont: scale(20),
    s10: scale(10),
    s11: scale(11),
    s12: scale(12),
    s13: scale(13),
    s14: scale(14),
    s15: scale(15),
    s16: scale(16), // Figma base size
    s17: scale(17),
    s18: scale(18),
    s20: scale(20),
    s22: scale(22),
    s24: scale(24),
    s26: scale(26),
    s28: scale(28),
    s30: scale(30),
    s32: scale(32),
  },

  // Line Heights - Figma Spec: 100% (1.0)
  lineHeight: {
    tight: 1.0, // Figma 100%
    normal: 1.2,
    relaxed: 1.4,
    loose: 1.6,
  },

  // Font Weights
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Text Styles - Figma Spec: Work Sans Medium 16px
  textStyles: {
    h1: {
      fontSize: scale(28),
      lineHeight: 1.0, // Figma 100%
      fontWeight: '700',
      fontFamily: 'WorkSans-Bold',
    },
    h2: {
      fontSize: scale(24),
      lineHeight: 1.0,
      fontWeight: '600',
      fontFamily: 'WorkSans-SemiBold',
    },
    h3: {
      fontSize: scale(20),
      lineHeight: 1.0,
      fontWeight: '600',
      fontFamily: 'WorkSans-SemiBold',
    },
    body1: {
      fontSize: scale(16), // Figma base
      lineHeight: 1.0, // Figma 100%
      fontWeight: '500', // Figma Medium
      fontFamily: 'WorkSans-Medium',
    },
    body2: {
      fontSize: scale(14),
      lineHeight: 1.0,
      fontWeight: '500',
      fontFamily: 'WorkSans-Medium',
    },
    caption: {
      fontSize: scale(12),
      lineHeight: 1.0,
      fontWeight: '500',
      fontFamily: 'WorkSans-Medium',
    },
    button: {
      fontSize: scale(16), // Figma base
      lineHeight: 1.0, // Figma 100%
      fontWeight: '500', // Figma Medium
      fontFamily: 'WorkSans-Medium',
    },
  },
} as const;
