import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { useEffect, useState } from "react";

import { wordsList, masterList } from "./src/helpers/words";

import { processLibrary } from "./src/helpers/words";
import DisplayGame from "./src/components/grid";

import { getScore, updateScore } from "./src/database/dbQueries";

import { generate, count } from "random-words";

// const callProcessLibrary = async () => {
//   try{
//     const library = await processLibrary();

//     const wTest = library["wordsList"];
//     const mTest = library["masterList"];

//     return mTest;
//   }catch(error){
//     console.error("Error call: ", error);
//   }
// };

const generateMaster = (gen, level, game) => {
  let mArray = []

  for(let i = 0; i < level; ++i){
    mArray.push([]);

    for(let j = 0; j < game; ++j){
      mArray[i].push(gen[j + 3 * i]);
    }
  }

  return mArray;
};


const generateCrosswords = (gen, level, game, word) => {
  let cArray = []

  for(let i = 0; i < level; ++i){
    cArray.push([]);

    for(let j = 0; j < game; ++j){
      cArray[i].push([]);

      for(let k = 0; k < word; ++k){
        cArray[i][j].push(gen[j + 3 * i]);
      }
    }
  }

  return cArray;
};

export default function App() {
  const [testMas, setTestMas] = useState(generateMaster(
    generate({
      exactly: 30,
      wordsPerString: 1,
      minLength: 6,
      maxLength: 8,
      formatter: (word) => word.toUpperCase(),
    }), 10, 3)
  );

  const [testCross, setTestCross] = useState(generateCrosswords(
    generate({
      exactly: 150,
      wordsPerString: 1,
      minLength: 3,
      maxLength: 5,
      formatter: (word) => word.toUpperCase(),
    }), 10, 3, 5)
  );

  console.log(testCross);

  const [crosswords, setCrosswords] = useState(wordsList);
  const [master, setMaster] = useState(masterList);

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

    // processLibrary()
    // .then(({wordsList, masterList}) => {
    //   setTestCross(wordsList);
    //   setTestMas(masterList);
    // }).catch(error => {
    //   console.error("Error processLibrary():", error);
    // });
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
                   master = {testMas}
      />

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


