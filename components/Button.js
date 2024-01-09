import { StyleSheet, Text, Pressable } from 'react-native';

export default function Button({...props}) {

  return (
    <Pressable onPress={props.onPress} style={[styles.button, styles[props.style]]}>
      <Text style={[styles.buttonText, props.style != 'primary' ? styles.buttonTextAlt : styles.buttonTextPrimary]}>
        {props.title}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 6,
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    marginVertical: 12,
  },
  primary: {
    backgroundColor: '#495e57',
  },
  secondary: {
    borderWidth: 1,
    borderColor: '#495e57',
    backgroundColor: '#FFFFFF',
  },
  logOut: {
    backgroundColor: '#f4ce14',
    width: '100%',
  },
  buttonText: {
    fontFamily: 'Karla',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonTextPrimary: {
    color: '#ffffff',
  },
  buttonTextAlt: {
    color: '#495e57',
  }
})