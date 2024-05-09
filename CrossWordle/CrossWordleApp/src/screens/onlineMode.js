import { StyleSheet, View, Text, Dimensions, SafeAreaView, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";

import { checkTokenExpiration } from "../database/fetchBackend";

const screenDimensions = Dimensions.get("screen");


// -------- Online Mode Screen --------
OnlineModeScreen = ({navigation, route}) => {
  return(
    <View style = {styles.container}>
      <SafeAreaView>
        <TouchableOpacity style = {styles.backButton}
                          onPress = {() => navigation.navigate("Welcome")}
        >
          <Ionicons name = "chevron-back-outline"
                    size = {screenDimensions.width/18}
                    color = "#f6efde"
          />
        </TouchableOpacity>

        <FontAwesome6 style = {styles.symbol}
                      name = "soundcloud"
                      size = {screenDimensions.width/4}
                      color = "#d83f03"
        />

        <TouchableOpacity style = {styles.button}
                          onPress = {() => checkTokenExpiration("OnlineModeScreen")}
        >
          <Text style = {styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style = {[styles.button, {marginTop: screenDimensions.height/60}]}
                          onPress = {() => navigation.navigate("Signup")}
        >
          <Text style = {styles.buttonText}>Sign Up</Text>
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

  // OnlineMode Screen
  backButton: {
    width: screenDimensions.width/14,
    height: screenDimensions.width/14,
    backgroundColor: "#331005",
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: screenDimensions.width/28,
    marginLeft: -screenDimensions.width/3,
  },

  symbol: {
    alignSelf: "center",
    marginTop: screenDimensions.height/4,
  },

  button: {
    width: screenDimensions.width/4,
    height: screenDimensions.height/18,
    backgroundColor: "#331005",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: screenDimensions.width/30,
    marginTop: screenDimensions.height/12,
  },

  buttonText: {
    color: "#f6efde",
    fontWeight: "500",
    fontSize: screenDimensions.width/20,
    alignSelf: "center",
  },
});

export default OnlineModeScreen;
