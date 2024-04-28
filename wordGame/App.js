import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { useEffect, useState } from "react";

import { wordsList, masterList } from "./src/helpers/words";
import DisplayGame from "./src/components/grid";

import { getScore, updateScore } from "./src/database/dbQueries";


export default function App() {
  const crosswords = wordsList;
  const master = masterList;

  const [disScore, setDisScore] = useState(0);
  const [disLevel, setDisLevel] = useState(1);

  // Retrieve score from the database, ONLY ONCE when the app start
  useEffect(() => {
    getScore()
    .then((data) => {
      setDisScore(data);
    })
    .catch((error) => {
      console.error("Error getScore() from SQLite:", error);
    });
  }, []);

  // Update score to the database when disScore is changed
  useEffect(() => {
    setDisLevel(1 + Math.floor(disScore/10));

    updateScore(disScore)
    .catch((error) => {
      console.error('Error updating score:', error);
    });
  }, [disScore]);


  // useEffect(() => {
  //   setDisLevel(1 + Math.floor(disScore/10));
  // }, [disScore]);


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


