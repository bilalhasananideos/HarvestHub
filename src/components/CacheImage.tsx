import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import FastImage from 'react-native-fast-image';
import { colors } from '../theme/colors';

const CacheImage = ({url, style}: {url: string | number, style: any}) => {
  const source = typeof url === 'string'
    ? { uri: url, priority: FastImage.priority.high }
    : url as number;
  const [isLoading, setIsLoading] = useState(true);
  return (
    <>
      <FastImage
      style={{...style,opacity:isLoading ? 0 : 1,borderRadius:style.borderRadius,backgroundColor:colors.border.main, borderColor:colors.border.main}}
        source={source}
        resizeMode={FastImage.resizeMode.cover}
        onLoadEnd={() => {
          setIsLoading(false);
        }}
      />
    </>
  )
}

export default CacheImage
