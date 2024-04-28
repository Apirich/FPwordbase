import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";

import { wordsList, masterList } from "./words";
import DisplayGame from "./grid";
import { useEffect, useState } from "react";


// const computeLevel = (score) => {
//   const level = Math.ceil(score/15);
//   return level;
// };

export default function App() {
  const crosswords = wordsList;
  const master = masterList;

  const [disScore, setDisScore] = useState(0);
  const [disLevel, setDisLevel] = useState(1);
  // const [disLevel, setDisLevel] = useState(computeLevel(disScore));

  useEffect(() => {
    setDisLevel(1 + Math.floor(disScore/15));
  }, [disScore]);


  const computeScore = (score) => {
    setDisScore(score);
  }


  return(
    <View style = {styles.container}>
      <View style = {styles.scoreLvl}>
        <Text>Level: {disLevel}</Text>
        <Text>Score: {disScore}</Text>
      </View>

      <DisplayGame level = {disLevel}
                   score = {disScore} computeScore = {computeScore}
                   crosswordsProc = {crosswords}
                   master = {master}/>
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


