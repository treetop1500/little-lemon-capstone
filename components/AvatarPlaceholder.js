import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function AvatarPlaceholder({...props}) {

  return (
    <Pressable onPress={props.onPress} style={props.style === 'micro' ? styles.avatarPlaceholderMicro : styles.avatarPlaceholder}>
      <Text style={props.style === 'micro' ? styles.avatarInitialsMicro : styles.avatarInitials}>{props.firstName.charAt(0)+props.lastName.charAt(0)}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  avatarPlaceholder: {
    backgroundColor: '#719c8e',
    borderRadius: 500,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitials: {
    fontSize: 18,
    color: '#ffffff',
  },
  avatarPlaceholderMicro: {
    backgroundColor: '#719c8e',
    borderRadius: 500,
    marginHorizontal: 24,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitialsMicro: {
    fontSize: 14,
    color: '#ffffff',
  },
})