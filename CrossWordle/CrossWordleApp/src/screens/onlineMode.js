import { StyleSheet, View, Text, Dimensions, SafeAreaView, TouchableOpacity } from "react-native";
import { useNavigationState } from "@react-navigation/native";

import { checkTokenExpiration } from "../database/fetchBackend";

const screenDimensions = Dimensions.get("screen");


// const getCurrentRouteName = () => {
//   const navigationState = useNavigationState(state => state);
//   return navigationState.routes[navigationState.index].name;
// };


// -------- Online Mode Screen --------
OnlineModeScreen = ({navigation, route}) => {
  // const currentRouteName = getCurrentRouteName();
  // console.log("Current route name:", currentRouteName);

  return(
    <View style = {styles.container}>
      <SafeAreaView>
        <Text>Please Sign up or Login</Text>

        <TouchableOpacity onPress = {() => checkTokenExpiration(navigation, "OnlineModeScreen")}>
          <Text style = {[styles.buttonText]}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress = {() => navigation.navigate("Signup")}>
          <Text style = {[styles.buttonText]}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress = {() => navigation.navigate("Welcome")}>
          <Text style = {[styles.buttonText]}>Home</Text>
        </TouchableOpacity>
    </SafeAreaView>
    </View>
  );
};

// -------- Styles --------
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },

    // OnlineMode Screen
    buttonText: {
      color: "green",
      fontSize: screenDimensions.width/20,
    },
});

export default OnlineModeScreen;
