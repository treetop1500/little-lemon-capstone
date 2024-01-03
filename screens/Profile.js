import React, { useState, useEffect } from 'react';
import { useCallback } from 'react';
import { StyleSheet, Text, View, Image, Pressable, TextInput, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Button from '../components/Button';
import AvatarPlaceholder from '../components/AvatarPlaceholder';
import Avatar from '../components/Avatar';
import { MaskedTextInput } from "react-native-mask-text";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import CheckBox from '../components/CheckBox';
import { ScrollView } from 'react-native-gesture-handler';

export default function Profile({route, navigation, ...props}) {

  
  const [userProfile, setUserProfile] = useState(null);
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userAvatar, setUserAvatar] = useState(null);
  const [receiveOrderStatuses, setReceiveOrderStatuses] = useState(false);
  const [receivePasswordChanges, setReceivePasswordChanges] = useState(false);
  const [receiveSpecialOffers, setReceiveSpecialOffers] = useState(false);
  const [receiveNewsletter, setReceiveNewsletter] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const onProfileChange = route.params.onChangeProfile;

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (userProfile !== null && userProfile != undefined) {
      setUserFirstName(userProfile.first_name);
      setUserLastName(userProfile.last_name);
      setUserEmail(userProfile.email);
      setUserFirstName(userProfile.first_name);
      setUserPhone(userProfile.phone);
      setUserAvatar(userProfile.avatar);
      setReceiveNewsletter(userProfile.receive_newsletters);
      setReceiveOrderStatuses(userProfile.receive_order_statuses);
      setReceivePasswordChanges(userProfile.receive_password_changes);
      setReceiveSpecialOffers(userProfile.receive_special_offers);
      setIsProfileLoaded(true);
    }
  }, [userProfile]);

  const getProfile = async () => {
    try {
      const value = await AsyncStorage.getItem('userDetails');
      if (value !== null) {
        setUserProfile(JSON.parse(value));
      }
    } catch (error) {
    }
  };

  const saveProfile = async () => {
    try {
      const userDetails = {
        'first_name': userFirstName,
        'last_name': userLastName,
        'email': userEmail,
        'avatar': userAvatar,
        'phone': userPhone,
        'receive_newsletters': receiveNewsletter,
        'receive_order_statuses': receiveOrderStatuses,
        'receive_password_changes': receivePasswordChanges,
        'receive_special_offers': receiveSpecialOffers,
      }
      await AsyncStorage.setItem(
        'userDetails',
        JSON.stringify(userDetails)
      );
    } catch (error) {
    } finally {
      alert("Your profile has been saved!");
      onProfileChange();

    }
  }

  const logOut = () => {
    try {
      setUserProfile(null)
      setUserFirstName(null);
      setUserLastName(null);
      setUserEmail(null);
      setUserFirstName(null);
      setIsProfileLoaded(false);
      setUserAvatar(null);
      setReceiveNewsletter(false)
      setReceiveOrderStatuses(false)
      setReceivePasswordChanges(false)
      setReceiveSpecialOffers(false)
    } catch(e) {
    } finally {
      navigation.navigate('Onboarding');
    }
  }

  const pickAvatar = async () => {
    let result;
  
    try {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: false,
      });
  
      if (result && !result.canceled) {
        setUserAvatar(result.assets[0].uri);
      } else {
      }
    } catch (e) {
    } 
  };

  if (!isProfileLoaded) {
    return <View><Text>Loading Profile...</Text></View>
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.main}>
        <Text style={styles.welcomeText}>My Profile</Text>
        <Text style={styles.inputLabel}>Avatar:</Text>

        <View style={styles.avatarWrapper}>
          {userAvatar !== null
            ? <Avatar uri={userAvatar } /> 
            : <AvatarPlaceholder firstName={userFirstName} lastName={userLastName} />
          }

          <Button title="Change" style='primary' onPress={pickAvatar} />
          {userAvatar !== null && 
            <Button title="Remove" style='secondary' onPress={() => setUserAvatar(null)} />
          }
        </View>

        <Text style={styles.inputLabel}>First Name:</Text>
        <TextInput style={styles.input} onChangeText={setUserFirstName} value={userFirstName} />
        <Text style={styles.inputLabel}>Last Name:</Text>
        <TextInput style={styles.input} onChangeText={setUserLastName} value={userLastName} />
        <Text style={styles.inputLabel}>Email:</Text>
        <TextInput style={styles.input} onChangeText={setUserEmail} value={userEmail} keyboardType="email-address" />
        <Text style={styles.inputLabel}>Phone:</Text>
        
        <MaskedTextInput
          mask="(999) 999-9999"
          style={styles.input} 
          onChangeText={(text, rawText) => {
            setUserPhone(text)
            keyboardType="numeric"
          }}
          value={userPhone} />

        <Text style={styles.formLegend}>Email Notifications</Text>

        <CheckBox label="Order Statuses" isChecked={receiveOrderStatuses} 
          onPress={() => {
            setReceiveOrderStatuses(!receiveOrderStatuses);
          }}
        />
        <CheckBox label="Password Changes" isChecked={receivePasswordChanges} 
          onPress={() => {
            setReceivePasswordChanges(!receivePasswordChanges);
          }}
        />
        <CheckBox label="Special Offers" isChecked={receiveSpecialOffers} 
          onPress={() => {
            setReceiveSpecialOffers(!receiveSpecialOffers);
          }}
        />
        <CheckBox label="Newsletter" isChecked={receiveNewsletter} 
          onPress={() => {
            setReceiveNewsletter(!receiveNewsletter);
          }}
        />
       
       <Button title="Log Out" style="logOut" onPress={() => logOut()} />
       <View style={styles.buttonWrapper}>
        <Button title="Discard Changes" style="secondary" onPress={() => getProfile()} />
        <Button title="Save Changes" style="primary" onPress={() => saveProfile()} />
       </View>
      </ScrollView>

    </>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 36,
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingVertical: 40,
        width: '100%',
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: 'Karla',
    marginBottom: 20,
    marginTop: 40
  },
  formLegend: {
    fontSize: 18,
    fontFamily: 'Karla',
    marginBottom: 20,
    marginTop: 12
  },
  avatarWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'flex-start',
    marginBottom: 24,
    gap: 20,
  },
  profileLabel: {
    fontSize: 24,
    marginBottom: 12,
  },
  profileValue: {
    fontSize: 24,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#2c4753',
    padding: 10,
    borderRadius: 6,
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    color: '#2c4753',
    fontFamily: 'Karla',
    fontSize: 16,
    marginBottom: 12
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  }
  
});
