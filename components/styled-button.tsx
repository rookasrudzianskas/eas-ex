//@ts-nocheck
import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

const StyledButton = ({title, onPress, style}: { title: string; onPress: () => void, style?: any}) => {
  return (
    <TouchableOpacity onPress={onPress} style={{backgroundColor: 'white', padding: 12, borderRadius: 5, width: '100%', ...style, }} activeOpacity={0.7}>
      <Text style={{
        color: '#5F5DEC',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
      }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default StyledButton;
