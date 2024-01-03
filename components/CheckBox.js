import { StyleSheet } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function CheckBox({...props}) {

  return (
    <BouncyCheckbox 
      isChecked={props.isChecked}
      text={props.label}
      onPress={props.onPress}
      style={styles.checkBox}
      textStyle={styles.label}
      fillColor={'#495e57'}
      disableBuiltInState
    />
  )
}

const styles = StyleSheet.create({
  checkBox: {
    marginBottom: 10,
  },
  label: {
    fontFamily: 'Karla',
    textDecorationLine: "none"
  }
})