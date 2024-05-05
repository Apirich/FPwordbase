import { StyleSheet, View, Text, Dimensions, SafeAreaView, TouchableOpacity, TextInput } from "react-native";
import { useEffect, useState } from "react";

const screenDimensions = Dimensions.get("screen");

// -------- Online Game Screen --------
OnlineGameScreen = ({navigation, route}) => {
    return(
      <View style = {styles.container}>
        <SafeAreaView>
          <Text>ONLINE GAME</Text>
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
});

export default OnlineGameScreen;


