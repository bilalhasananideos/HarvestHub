import { Dimensions, StyleSheet } from 'react-native';

import { wp, hp, isIOS, scale, fontSizes } from '../../theme/responsive';
import { typography } from '../../theme/typography';
import { colors } from '../../theme/colors';
export const styles = StyleSheet.create({
  dotList: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: hp('18'),
  },
  bottomContainer: {
    justifyContent: 'space-between',
    alignItems: 'left',
    position: 'absolute',
    bottom: 30,
    left: 15,
    width: wp('92'),
    zIndex: 2,
  },
  centerMainView: {
    marginTop: hp('50'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    textAlign: 'center',
    fontSize: fontSizes.fs30,
    width: wp('100'),
    color: colors.primary.main,
    fontWeight: '500',
    lineHeight: hp('4'),
    alignSelf: 'center',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: fontSizes.fs18,
    fontWeight: '400',
    paddingLeft: wp('4'),
    width: wp('70'),
    color: colors.text.primary,
    lineHeight: 20,
    marginTop: hp('2'),
  },

  dot: (currentIndex, index) => ({
    marginLeft: wp('1'),
    marginBottom: hp(isIOS ? '5' : '4'),
    marginTop: hp('2'),
    borderRadius: Math.round(
      Dimensions.get('window').width + Dimensions.get('window').height,
    ),
    height: Dimensions.get('window').width * 0.02,
    width:
      currentIndex == index
        ? Dimensions.get('window').width * 0.08
        : Dimensions.get('window').width * 0.02,
    backgroundColor: currentIndex == index ? colors.primary.main : '',
    borderWidth: currentIndex == index ? 0 : 1,
    borderColor:
      currentIndex == index ? colors.primary.main : colors.primary.secondary,
  }),
  bgImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('40'),
  },
  btnArrow: {
    paddingVertical: hp('2'),
    paddingHorizontal: wp('3'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: fontSizes.fs16,
    color: '#ffff',
    fontWeight: '600',
  },
  getStartedBtn: {
    paddingVertical: hp('2'),
    paddingHorizontal: wp('3'),
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('90'),
  },
  linearGradient: {
    borderRadius: wp('1'),
    marginBottom: hp('3'),
  },
});
