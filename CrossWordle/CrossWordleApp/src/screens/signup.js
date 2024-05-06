import { StyleSheet, View, Text, Dimensions, SafeAreaView, TouchableOpacity, TextInput } from "react-native";
import { useEffect, useState } from "react";

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
          <Text>Please Sign up</Text>

          <TextInput
            placeholder = "Username"
            value = {username}
            onChangeText = {text => setUsername(text)}
            />

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

            <TouchableOpacity onPress = {() => handleSignUp({username, email, password, navigation})}>
                <Text style = {[styles.buttonText]}>Sign Up</Text>
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

    // Signup Screen
    buttonText: {
      color: "green",
      fontSize: screenDimensions.width/20,
    },
});

export default SignupScreen;


