import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import Splash from './screens/Splash';
import Home from './screens/Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Logo } from './assets/images/Logo.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import useFonts from './hooks/useFonts';
import AvatarPlaceholder from './components/AvatarPlaceholder';
import Avatar from './components/Avatar';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

function LogoTitle() {
  return (
    <Image
      style={styles.headerLogo}
      source={require('./assets/images/Logo.png')}
    />
  );
}

const Drawer = createDrawerNavigator();

export default function App({navigation}) {

  const [isFontsLoaded, setIsFontsLoaded] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    loadProfile();
    loadFonts();
    console.log(isFontsLoaded, isProfileLoaded);
  }, []);

  const loadFonts = async () => {
    try {
      const value = await useFonts();
    } catch (error) {
      console.log(error);
    } finally {
      setIsFontsLoaded(true)
    }
  };

  const headerAvatar = (navigation) => {
    console.log('navigation', navigation)
    if (isProfileLoaded && userProfile !==  null) {
      return (<Avatar uri={userProfile.avatar } style='micro' 
        onPress={() => navigation.navigate('Profile')}
      />)
    } else if (isProfileLoaded && userProfile.avatar === null) {
      return (<AvatarPlaceholder
        onPress={() => navigation.navigate('Profile')}
        firstName={userProfile.first_name}
        lastName={userProfile.last_name}
        style="micro"
      />)
    }
    return null;
  }

  const loadProfile = async () => {
    console.log('loading profile');
    try {
      const value = await AsyncStorage.getItem('userDetails');
      if (value !== null && value !== "") {
        setUserProfile(JSON.parse(value));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsProfileLoaded(true);
    }
  };

  if (!isFontsLoaded || !isProfileLoaded) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName={(isOnboardingCompleted !== true) ? "Onboarding" : "Home"}>
        <Drawer.Screen name="Onboarding" component={Onboarding}
          options={{
            headerTitle: (props) => <LogoTitle {...props} />,
            drawerItemStyle: isOnboardingCompleted !== true && {display: 'none'}
          }}
        />
        <Drawer.Screen
          name="Home"
          component={Home}
          initialParams={{ user: userProfile }}
          options={{
            headerTitle: (props) => <LogoTitle {...props} />,
            headerRight: ({ navigation }) => headerAvatar(navigation),
          }}
        />
        <Drawer.Screen
          name="Profile"
          component={Profile}
          initialParams={{ onChangeProfile: loadProfile }}
          options={{
            headerTitle: (props) => <LogoTitle {...props} />,
            headerRight: ({ navigation }) => headerAvatar(navigation),
          }}
        />
      </Drawer.Navigator>
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



