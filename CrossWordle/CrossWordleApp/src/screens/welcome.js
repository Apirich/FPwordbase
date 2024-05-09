import { StyleSheet, View, Text, Dimensions, SafeAreaView, Image, TouchableOpacity } from "react-native";

const screenDimensions = Dimensions.get("screen");

// -------- Welcome Screen --------
WelcomeScreen = ({navigation, route}) => {
    const { internetChecking } = route.params;

    return(
      <View style = {styles.container}>
        <SafeAreaView>
          <Text style = {styles.appNameText}>Crosswordle</Text>

          <TouchableOpacity style = {[styles.button, internetChecking ? null : styles.disableButton]}
                            onPress = {() => navigation.navigate("OnlineMode")}
                            disabled = {internetChecking ? false : true}
          >
            <Text style = {[styles.buttonText, internetChecking ? null : styles.disableButton]}>Online Mode</Text>
          </TouchableOpacity>

          <TouchableOpacity style = {[styles.button, {marginTop: screenDimensions.height/20}]}
                            onPress = {() => navigation.navigate("OfflineGame")}
          >
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
    backgroundColor: "#f6efde",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  // Welcome Screen
  appNameText: {
    fontSize: screenDimensions.width/8,
    fontWeight: "bold",
    color: "#d83f03",
    alignSelf: "center",
    marginTop: screenDimensions.height/4,
  },

  button: {
    width: screenDimensions.width/2,
    height: screenDimensions.height/12,
    backgroundColor: "#331005",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: screenDimensions.width/20,
    marginTop: screenDimensions.height/6,
  },

  buttonText: {
    color: "#f6efde",
    fontWeight: "500",
    fontSize: screenDimensions.width/16,
    alignSelf: "center",
  },

  disableButton: {
    opacity: 0.3,
  },
});

// #331005

// #d6cfb9

export default WelcomeScreen;
