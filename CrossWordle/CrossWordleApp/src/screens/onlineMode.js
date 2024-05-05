import { StyleSheet, View, Text, Dimensions, SafeAreaView, TouchableOpacity } from "react-native";

const screenDimensions = Dimensions.get("screen");

// -------- Online Mode Screen --------
OnlineModeScreen = ({navigation, route}) => {
    return(
      <View style = {styles.container}>
        <SafeAreaView>
          <Text>Please Sign up or Login</Text>

          <TouchableOpacity onPress = {() => navigation.navigate("Login")}>
            <Text style = {[styles.buttonText]}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress = {() => navigation.navigate("Signup")}>
            <Text style = {[styles.buttonText]}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress = {() => navigation.goBack()}>
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
