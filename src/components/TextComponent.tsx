import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { scale } from '../theme/responsive';


interface TextComponentProps {
  text: string;
  styles?: StyleProp<TextStyle>;
  onPress?: () => void;
  numberOfLines?: number;
  color?: string;
}
export const TextComponent = ({
  text,
  styles,
  onPress,
  numberOfLines,
  color,
}: TextComponentProps) => {
  return (
    <Text
      onPress={onPress}
      numberOfLines={numberOfLines}
      style={[{ fontSize: scale(2) }, styles]}
    >
      {text}
    </Text>
  );
};
