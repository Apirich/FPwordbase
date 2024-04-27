import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import { wordsList } from "./words";
import DisplayGame from "./grid";


export default function App() {
  const crosswords = wordsList;

  return(
    <View style = {styles.container}>
      <DisplayGame crosswordsProc = {crosswords}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});


