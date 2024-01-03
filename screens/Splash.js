import React, { useState, useEffect } from 'react';
import { useCallback } from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useFonts from '../hooks/useFonts';

export default function Splash() {

  useEffect(() => {
    loadFonts();
  }, []);

  const loadFonts = async () => {
    try {
      const value = await useFonts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <View style={styles.main}>
        <Text style={styles.welcomeText}>Welcome to Little Lemon!</Text>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#cad3da',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: 'Karla',
    marginBottom: 0,
    marginTop: 40
  },
  loadingText: {
    fontSize: 16,
    marginBottom: 150,
    marginTop: 20
  },
});
