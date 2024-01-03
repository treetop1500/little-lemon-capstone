import { Image, StyleSheet, Pressable } from 'react-native';

export default function Avatar({...props}) {

  return (
    <Pressable onPress={props.onPress}>
      <Image source={{ uri: props.uri }} style={props.style === 'micro' ? styles.avatarMicro : styles.avatar} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#719c8e',
    borderRadius: 500,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarMicro: {
    backgroundColor: '#719c8e',
    borderRadius: 500,
    marginHorizontal: 24,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
})