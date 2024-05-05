import { StyleSheet, View, Text, Dimensions, SafeAreaView, TouchableOpacity, TextInput } from "react-native";
import { useEffect, useState } from "react";

const screenDimensions = Dimensions.get("screen");

// -------- Login Screen --------
LoginScreen = ({navigation, route}) => {
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleLogin = () => {
        // Check if any of the input fields are empty
        if (!email || !password) {
            alert("Your inputs are empty!");
            return;
        }

        fetch("http://192.168.12.205:3000/login", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        }).then((response) => {
            console.log(`login.js - LoginScreen: response status ${response.status}`);

            // If successfully login or there is backend internal error logging in
            if(response.status == 200){
                return response.json();
            }else{
                throw new Error(response.status);
            }
        }).then((data) => {
            console.log(`login.js - LoginScreen: login data ${data}`);
            navigation.navigate("OnlineGame");
        }).catch((error) => {
            console.log(`login.js - loginScreen: login error: There was an error logging in ${error}`)

            if(error.message == "401"){
                alert("Invalid email or password!");
            }
        });
    };

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

            <TouchableOpacity onPress = {() => handleLogin()}>
                <Text style = {[styles.buttonText]}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress = {() => navigation.goBack()}>
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


