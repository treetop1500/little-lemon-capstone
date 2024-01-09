import React, { useState, useEffect, Text, useCallback } from 'react';
import { StyleSheet, Image } from 'react-native';
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import Home from './screens/Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import AvatarPlaceholder from './components/AvatarPlaceholder';
import Avatar from './components/Avatar';
import { LogBox } from 'react-native';
import * as SplashScreen from 'expo-splash-screen'; 
import useFonts from './hooks/useFonts'; 
import { useNavigation } from '@react-navigation/native';


LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function App() {
  

  const Stack = createNativeStackNavigator();
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false); // has gone through the initial onboarding
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isFontsLoaded, setIsFontsLoaded] = useState(false); 

  useEffect(() => {
    let isMounted = true;
    const loadInitialData = async () => {
      try {
        await useFonts(); 
        await loadProfile();
        await SplashScreen.hideAsync();

        if (isMounted) {
          setIsFontsLoaded(true);
        }
      } catch (error) {
        console.error('Error loading fonts:', error);
        setError(error.message || 'An error occurred while loading fonts');
      } 
    };

    loadInitialData();

    return () => {
      // Cleanup function to handle unmounting
      isMounted = false;
    };
  }, []);


  const loadProfile = async () => {
    try {
      const value = await AsyncStorage.getItem('userDetails');
      if (value != null && value != "") {
        setIsProfileLoaded(true);
        setIsOnboardingCompleted(true);
        setUserProfile(JSON.parse(value));
        return Promise.resolve(value)
      } else {
        setIsProfileLoaded(false);
        setIsOnboardingCompleted(false);
        setUserProfile(null);
        return Promise.resolve(null);
      }
    } catch (error) {
      console.error('Error in loadProfile:', error);
      return Promise.reject(error);
    }
  };

  if (!isFontsLoaded && !isProfileLoaded) {
    return null;
  }

  const LogoTitle = () => {
    return (
      <Image
        style={styles.headerLogo}
        source={require('./assets/images/Logo.png')}
      />
    );
  }

  const onLogOut = () => {
    setIsOnboardingCompleted(false);
    console.log("log out main");
  }

  const headerAvatar = () => {
    const navigation = useNavigation();
    if (userProfile && userProfile.avatar) {
      return (<Avatar uri={userProfile.avatar } 
      style='micro' 
        onPress={() => navigation.navigate('Profile')}
      />)
    } else if (userProfile && userProfile.avatar == undefined) {
      return (<AvatarPlaceholder
        onPress={() => navigation.navigate('Profile')}
        firstName={userProfile.first_name}
        lastName={userProfile.last_name}
        style="micro"
      />)
    }
    
    return null;
  }

  const isValidProfile = (
    userProfile &&
    userProfile.first_name &&
    userProfile.last_name &&
    userProfile.email
  );

  const handleOnboardingCompleted = () => {
    setIsOnboardingCompleted(true);
  }


  if (!isOnboardingCompleted) {
    return (<Onboarding onOnboardingCompleted={handleOnboardingCompleted} />)
  }
  

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"Home"} gestureEnabled={false}>
        <Stack.Screen
          name="Home"
          component={Home}
          initialParams={{ user: userProfile }}
          options={{
            headerBackTitleVisible: false,
            headerTitle: (props) => <LogoTitle {...props} />,
            headerRight: () => (headerAvatar())
          }}
        />
        <Stack.Screen
          name="Profile"
          options={{
            headerBackTitleVisible: false,
            headerTitle: (props) => <LogoTitle {...props} />,
            headerRight: () => (headerAvatar()),
          }}
          >
          {(props) => <Profile {...props} onChangeProfile={loadProfile} onLogOut={onLogOut} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogo: {
    width: 200,
    height: 40,
  }
});



