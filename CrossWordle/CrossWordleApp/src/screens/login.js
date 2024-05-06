import { StyleSheet, View, Text, Dimensions, SafeAreaView, TouchableOpacity, TextInput, AsyncStorage } from "react-native";
import { useEffect, useState } from "react";

import { handleLogin } from "../database/fetchBackend";

const screenDimensions = Dimensions.get("screen");

// -------- Login Screen --------
LoginScreen = ({navigation, route}) => {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  return(
    <View style = {styles.container}>
      <SafeAreaView>
        <Text>Please Login</Text>

          <TextInput
            placeholder = "Email"
            value = {email}
            onChangeText = {text => setEmail(text)}
          />

          <TextInput
              placeholder = "Password"
              secureTextEntry = {true}
              value={password}
              onChangeText={text => setPassword(text)}
          />

          <TouchableOpacity onPress = {() => handleLogin({email, password, navigation})}>
            <Text style = {[styles.buttonText]}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress = {() => navigation.navigate("OnlineMode")}>
            <Text style = {[styles.buttonText]}>Back</Text>
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

  // Login Screen
  buttonText: {
    color: "green",
    fontSize: screenDimensions.width/20,
  },
});

export default LoginScreen;


