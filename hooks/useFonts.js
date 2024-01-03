import * as Font from "expo-font";
 
export default useFonts = async () =>
  await Font.loadAsync({
    'Karla': require('../assets/fonts/Karla-Regular.ttf'),
    'MarkaziText': require('../assets/fonts/MarkaziText-Regular.ttf'),
  });
