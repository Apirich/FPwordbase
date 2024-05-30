import { StyleSheet, View, Text, Dimensions, SafeAreaView, TouchableOpacity, TextInput } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { handleSignUp } from "../database/fetchBackend";

const screenDimensions = Dimensions.get("screen");

// -------- Signup Screen --------
SignupScreen = ({navigation, route}) => {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  return(
    <View style = {styles.container}>
      <SafeAreaView>
        <TouchableOpacity testID = "backButton" style = {styles.backButton}
                          onPress = {() => navigation.navigate("OnlineMode")}
        >
          <Ionicons name = "chevron-back-outline"
                    size = {screenDimensions.width/18}
                    color = "#f6efde"
          />
        </TouchableOpacity>

        <MaterialCommunityIcons style = {styles.symbol}
                                name = "account-multiple-plus-outline"
                                size = {screenDimensions.width/7}
                                color = "#d83f03"
        />

        <TextInput
          placeholder = "Username"
          value = {username}
          onChangeText = {text => setUsername(text)}
          style = {styles.input}
        />

        <TextInput
          placeholder = "Email"
          value = {email}
          onChangeText = {text => setEmail(text)}
          style = {[styles.input, {marginTop: screenDimensions.height/60}]}
        />

        <TextInput
          placeholder = "Password"
          secureTextEntry = {true}
          value={password}
          onChangeText={text => setPassword(text)}
          style = {[styles.input, {marginTop: screenDimensions.height/60}]}
        />

        <TouchableOpacity style = {styles.button}
                          onPress = {() => handleSignUp({username, email, password})}>
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

  // Signup Screen
  backButton: {
    width: screenDimensions.width/14,
    height: screenDimensions.width/14,
    backgroundColor: "#331005",
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: screenDimensions.width/28,
    marginLeft: -screenDimensions.width/7,
  },

  symbol: {
    alignSelf: "center",
    marginTop: screenDimensions.height/6,
  },

  input: {
    width: screenDimensions.width * 2 / 3,
    height: screenDimensions.height/18,
    fontSize: screenDimensions.width/20,
    backgroundColor: "#f1c7af",
    color: "#331005",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: screenDimensions.height/12,
    paddingLeft: screenDimensions.width/20,
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

export default SignupScreen;


