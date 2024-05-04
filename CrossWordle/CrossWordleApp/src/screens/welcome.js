import { StyleSheet, View, Text, Dimensions, SafeAreaView, TouchableOpacity } from "react-native";

const screenDimensions = Dimensions.get("screen");

// -------- Welcome Screen --------
WelcomeScreen = ({navigation, route}) => {
    const { internetChecking } = route.params;

    return(
      <View style = {styles.container}>
        <SafeAreaView>
          <Text>Welcom to The Crosswordle App</Text>
          <Text>Please Choose Gaming Mode</Text>

          <TouchableOpacity onPress = {() => navigation.navigate("Login")} disabled = {internetChecking ? false : true}>
            <Text style = {[styles.buttonText, internetChecking ? null : styles.disableButtonText]}>Online Mode</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress = {() => navigation.navigate("OfflineGame")}>
            <Text style = {[styles.buttonText]}>Offline Mode</Text>
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

    // Welcome Screen
    buttonText: {
      color: "green",
      fontSize: screenDimensions.width/20,
    },

    disableButtonText: {
      color: "grey",
      fontSize: screenDimensions.width/20,
    },
});

export default WelcomeScreen;
