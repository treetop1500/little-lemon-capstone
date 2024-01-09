import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserDetails = ({ onProfileLoaded }) => {
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const value = await AsyncStorage.getItem('userDetails');
      console.log("async profile", value);
      if (value != null && value !== "") {
        setUserProfile(JSON.parse(value));
        setIsProfileLoaded(true);
      } else {
        setUserProfile(null);
        setIsProfileLoaded(false);
      }

      if (onProfileLoaded && typeof onProfileLoaded === 'function') {
        onProfileLoaded(userProfile);
      }
    } catch (error) {
      console.error('Error in loadProfile:', error);
    }
  };


  return null; 
};

export default UserDetails;