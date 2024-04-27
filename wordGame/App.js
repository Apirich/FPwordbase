import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";

import { wordsList, masterWord } from "./words";
import DisplayGame from "./grid";
import { useState } from "react";


export default function App() {
  const crosswords = wordsList;
  const master = masterWord;

  const [disLevel, setDisLevel] = useState("Level 1");
  const [disScore, setDisScore] = useState(0);

  return(
    <View style = {styles.container}>
      <View style = {styles.scoreLvl}>
        <Text>{disLevel}</Text>
        <Text>Score: {disScore}</Text>
      </View>

      <DisplayGame crosswordsProc = {crosswords} master = {master}/>
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

  scoreLvl: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  }
});


