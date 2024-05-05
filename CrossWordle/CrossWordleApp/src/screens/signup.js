import { StyleSheet, View, Text, Dimensions, SafeAreaView, TouchableOpacity, TextInput } from "react-native";
import { useEffect, useState } from "react";

const screenDimensions = Dimensions.get("screen");

// -------- Signup Screen --------
SignupScreen = ({navigation, route}) => {
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleSignUp = () => {
        // Check if any of the input fields are empty
        if (!username || !email || !password) {
            alert("Your inputs are empty!");
            return;
        }

        fetch("http://192.168.12.205:3000/signup", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            }),
        }).then((response) => {
            console.log(`signup.js - SignupScreen: response status ${response.status}`);

            // If successfully signeup or there is backend internal error signing up
            if(response.status == 201){
                alert("You have successfully created your account!");
                navigation.navigate("OnlineMode");
            }else{
                throw new Error(response.status);
            }
        }).catch((error) => {
            console.log(`signup.js - SignupScreen: signup error: There was an error signing up ${error}`)

            if(error.message == "400"){
                alert("This account already exists!");
            }
        });
    };

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

            <TouchableOpacity onPress = {() => handleSignUp()}>
                <Text style = {[styles.buttonText]}>Sign Up</Text>
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

    // Signup Screen
    buttonText: {
      color: "green",
      fontSize: screenDimensions.width/20,
    },
});

export default SignupScreen;


