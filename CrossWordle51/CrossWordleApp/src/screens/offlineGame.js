import { StyleSheet, View, Text, Dimensions, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { MaterialCommunityIcons, MaterialIcons, FontAwesome6 } from "@expo/vector-icons";

import { generate, count } from "random-words";
import { getScore, updateScore, getCoin, updateCoin } from "../database/dbQueries";

import DisplayGame from "../components/grid";

const screenDimensions = Dimensions.get("screen");


// -------- Generate words positions --------
const randomPick = (itemList, loopTime, libName) => {
  while(itemList.length < loopTime){
    chosenItem = libName[Math.floor(Math.random() * libName.length)]
    if(itemList.indexOf(chosenItem) === -1){
      itemList.push(chosenItem);
    }
  }

  return itemList;
};


// -------- Generate grids data (game) --------
const generateLibrary = (gen, level, game, word) => {
  const positions = [0, 1, 2, 3, 4];
  let wXpos = [];
  let wYpos = [];

  let arrLib = []

  for(let i = 0; i < level; ++i){
    arrLib.push([]);

    for(let j = 0; j < game; ++j){
      if(word > 1){
        wXpos = randomPick(wXpos, word, positions);
        wYpos = randomPick(wYpos, word, positions);

        arrLib[i].push([]);

        for(let k = 0; k < word; ++k){
          arrLib[i][j].push({
            "direction": Math.random() < 0.5 ? "A" : "D",
            "word": gen[word * game * i + word * j + k],
            "xPos": wXpos[k],
            "yPos": wYpos[k],
          });
        }
      }else{
        arrLib[i].push(gen[game * i + j]);
      }
    }
  }

  return arrLib;
};


// -------- Offline Game Screen --------
OfflineGameScreen = ({navigation, route}) => {
  const maxLevel = 10;
  const gamePerLevel = 3;

  const [master, setMaster] = useState(generateLibrary(
    generate({
      exactly: 30,
      wordsPerString: 1,
      minLength: 6,
      maxLength: 8,
      formatter: (word) => word.toUpperCase(),
    }), maxLevel, gamePerLevel, 1)
  );

  const [crosswords, setCrosswords] = useState(generateLibrary(
    generate({
      exactly: 150,
      wordsPerString: 1,
      minLength: 3,
      maxLength: 5,
      formatter: (word) => word.toUpperCase(),
    }), maxLevel, gamePerLevel, 5)
  );

  // const [crosswords, setCrosswords] = useState(wordsList);
  // const [master, setMaster] = useState(masterList);

  const [disScore, setDisScore] = useState(0);
  const [disLevel, setDisLevel] = useState(1);
  const [disCoin, setDisCoin] = useState(10);


  // Retrieve score from the database, ONLY ONCE when the app start
  useEffect(() => {
    getScore()
    .then((data) => {
      setDisScore(data);
    })
    .catch((error) => {
      console.error("Error getScore() from SQLite:", error);
    });

    getCoin()
    .then((data) => {
      setDisCoin(data);
    })
    .catch((error) => {
      console.error("Error getCoin() from SQLite:", error);
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

  // Update coin to the database when disCoin is changed
  useEffect(() => {
    updateCoin(disCoin)
    .catch((error) => {
      console.error('Error updating coin:', error);
    });
  }, [disCoin]);

  const computeScore = (score) => {
    setDisScore(score);
  }

  const computeCoin = (coin) => {
    setDisCoin(coin);
  }

  return(
    <KeyboardAvoidingView style = {styles.container} behavior = {Platform.OS === "ios" ? "padding" : "height"}>
      <SafeAreaView style = {styles.safeArea}>
        <TouchableOpacity style = {styles.button}
                          onPress = {() => navigation.navigate("Welcome")}
        >
          <MaterialCommunityIcons name = "home"
                                  size = {screenDimensions.width/12}
                                  color = "#f6efde"
          />
        </TouchableOpacity>

        <View style = {styles.scoreLvlContainer}>
          <MaterialCommunityIcons name = "trophy-outline"
                                  size = {screenDimensions.width/12}
                                  color = "#331005"
          />
          <Text style = {styles.scoreLvlText}>{disLevel}</Text>
          <View style = {styles.gap}/>

          <MaterialIcons name = "grade"
                          size = {screenDimensions.width/12}
                          color = "#331005"
          />
          <Text style = {styles.scoreLvlText}>{disScore}</Text>
          <View style = {styles.gap}/>

          <FontAwesome6 name = "gem"
                        size = {screenDimensions.width/14}
                        color = "#331005"
          />
          <Text style = {styles.scoreLvlText}>{disCoin}</Text>
        </View>

        <View style = {styles.displayGameContainer}>
          <DisplayGame level = {disLevel} maxLevel = {maxLevel} gamePerLevel = {gamePerLevel}
                      score = {disScore} computeScore = {computeScore}
                      coin = {disCoin} computeCoin = {computeCoin}
                      crosswordsProc = {crosswords}
                      master = {master}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
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

  // Game Screen
  safeArea: {
    flex: 1,
  },

  button: {
    width: screenDimensions.width/8,
    height: screenDimensions.width/8,
    backgroundColor: "#d83f03",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: screenDimensions.width/16,
  },

  scoreLvlContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: screenDimensions.width/24,
    backgroundColor: "#f6efde",
    zIndex: 1,
  },

  scoreLvlText: {
    color: "#331005",
    fontWeight: "500",
    fontSize: screenDimensions.width/16,
    marginLeft: -screenDimensions.width/20,
  },

  gap: {
    width: screenDimensions.width/16,
  },

  displayGameContainer: {
    flex: 1,
    marginTop: screenDimensions.width/48,
    zIndex: 0,
  },
});

export default OfflineGameScreen;
