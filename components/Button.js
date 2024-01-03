import { StyleSheet, Text, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';

export default function Button({...props}) {

  const [buttonStyle, setButtonStyle] = useState(props.style);
  const [baseStyle, setBaseStyle] = useState(null);
  const [textStyle, setTextStyle] = useState(null);
  useEffect(() => {
    if (buttonStyle === 'secondary') {
      setBaseStyle(styles.secondary);
      setTextStyle(styles.secondaryText);
    } else if(buttonStyle === 'logOut') {
      setBaseStyle(styles.logOut);
      setTextStyle(styles.logOutText);
    } else {
      setBaseStyle(styles.primary);
      setTextStyle(styles.primaryText);
    }
  }, []);

  return (
    <Pressable onPress={props.onPress} style={baseStyle}>
      <Text style={textStyle}>
        {props.title}
      </Text>
    </Pressable>
  )

}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: '#495e57',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 6,
    marginVertical: 12,
    justifyContent: 'center',
    alignContent: 'center'
  },
  secondary: {
    borderWidth: 1,
    borderColor: '#495e57',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 6,
    marginVertical: 12,
    justifyContent: 'center',
    alignContent: 'center'
  },
  logOut: {
    width: '100%',
    backgroundColor: '#f4ce14',
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 6,
    marginVertical: 12,
    justifyContent: 'center',
    alignContent: 'center'
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#495e57',
  },
  logOutText: {
    color: '#000000',
    textAlign: 'center',
  }
})