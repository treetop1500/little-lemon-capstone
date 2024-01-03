import React, { useState } from 'react';
import { useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput} from 'react-native';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';


export default function Onbarding({navigation}) {
  
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  function loginAction() {
    if (userFirstName === "" && userLastName === "" && userEmail === "") {
      alert("First and last name and Email are required.");
    } else if (userFirstName === "" && userLastName === "") {
      alert("First and last name is required.");
    } else if (userFirstName === "") {
      alert("First name is required.");
    }  else if (userLastName === "") {
      alert("Last name is required.");
    } else if (userEmail === "") {
      alert("Email is required.");
    } else if (!validateEmail(userEmail)) {
      alert("Not a valid email address");
    } else {
      storeData();
    }
  }

  const validateEmail = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text)) {
      return true;
    }
    return false;
  }

  const storeData = async () => {
    try {
      const userDetails = {
        'first_name': userFirstName,
        'last_name': userLastName,
        'email': userEmail,
        'avatar': null,
        'phone': null,
        'receive_newsletters': false,
        'receive_order_statuses': false,
        'receive_password_changes': false,
        'receive_special_offers': false,
      }
      await AsyncStorage.setItem(
        'userDetails',
        JSON.stringify(userDetails)
      );
    } catch (error) {
    } finally {
      navigation.navigate('Profile');
    }
  };

  const updatePreferences = async (userPreferences) => {
    try {
      const jsonValue = JSON.stringify(userPreferences)
      await AsyncStorage.setItem('preferences', jsonValue)
    } catch(e) {
    }
  }
  
  const newPreferences = {
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: true
  };
  
  updatePreferences(newPreferences);

  return (
    <>
      <View style={styles.main}>
        <Text style={styles.welcomeText}>Let us get to know you</Text>
        <Text style={styles.inputLabel}>First Name</Text>
        <TextInput style={styles.input} onChangeText={setUserFirstName} />
        <Text style={styles.inputLabel}>Last Name</Text>
        <TextInput style={styles.input} onChangeText={setUserLastName} />
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput style={styles.input} onChangeText={setUserEmail} 
          textContentType='emailAddress'
          autoCapitalize='none'
          keyboardType="email-address"
          autoCompleteType='email'
          autoCorrect={false}
         />
        <Pressable style={styles.button} onPress={loginAction}>
          <Text style={styles.buttonInner}>Next</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#cad3da',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexGrow: 1,
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: 'Karla',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#2c4753',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 6,
    width: 250,
    marginBottom: 20,
    width: '100%',
  },
  inputLabel: {
    color: '#2c4753',
    fontFamily: 'Karla',
    fontSize: 16,
    marginBottom: 12
  },
  button: {
    backgroundColor: '#495e57',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 6,
    marginVertical: 12,
    justifyContent: 'center',
    alignContent: 'center'
  },
  buttonInner: {
    color: '#ffffff',
  }
});
