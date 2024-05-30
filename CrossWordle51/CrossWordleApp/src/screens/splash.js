import { StyleSheet, View, Text, Dimensions, SafeAreaView, Image, ActivityIndicator } from "react-native";

const screenDimensions = Dimensions.get("screen");

// -------- Splash Screen --------
SplashScreen = (internetStatus) => {
  return(
    <View style = {styles.container}>
      <SafeAreaView>
        <Image
          testID = "logo"
          style = {styles.logo}
          source = {require("../../assets/crosswordleLogo.png")}
        />

        <ActivityIndicator testID = "indicator" size = {"large"}/>

        <Text>{internetStatus ? "" : "Your internet connection status is offline, only Offline Mode will be available!"}</Text>
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
    justifyContent: "center",
  },

  // Splash Screen
  logo: {
    width: screenDimensions.height * 1 / 3,
    height: screenDimensions.height * 1 / 3,
    alignSelf: "center",
  },
});

export default SplashScreen;

