import { StyleSheet, View, Text, SafeAreaView, Image, ActivityIndicator } from "react-native";

// -------- Splash Screen --------
SplashScreen = (internetStatus) => {
    return(
      <View style = {styles.container}>
        <SafeAreaView>
          <Image
              style = {styles.logo}
              source = {require("../../assets/crosswordleLogo.png")}
          />

          <ActivityIndicator size = {"large"}/>

          <Text>{internetStatus ? "" : "Your internet connection status is offline, only Offline Mode will be available!"}</Text>
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

    // Splash Screen
    logo: {
      width: 120,
      height: 120,
      alignSelf: "center",
      marginBottom: 20,
    },
});

export default SplashScreen;

