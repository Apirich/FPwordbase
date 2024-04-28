import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";

import { wordsList, masterList } from "./words";
import DisplayGame from "./grid";
import { useState } from "react";


export default function App() {
  const crosswords = wordsList;
  const master = masterList;

  const [disLevel, setDisLevel] = useState(1);
  const [disScore, setDisScore] = useState(0);

  return(
    <View style = {styles.container}>
      <View style = {styles.scoreLvl}>
        <Text>Level: {disLevel}</Text>
        <Text>Score: {disScore}</Text>
      </View>

      <DisplayGame level = {disLevel} scrore = {disScore} crosswordsProc = {crosswords} master = {master}/>
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


