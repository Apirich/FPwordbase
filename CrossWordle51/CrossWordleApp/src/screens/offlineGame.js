import { StyleSheet, View, Text, Dimensions, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { MaterialCommunityIcons, MaterialIcons, FontAwesome6 } from "@expo/vector-icons";

// Code to implement offlineGame in the same way with onlineGame
// (*** Code is here only for learning purpose***)
// import { generate, count } from "random-words";

import { processBag } from "../helpers/words2";
import { getScore, updateScore, getCoin, updateCoin } from "../database/dbQueries";

import DisplayGame from "../components/grid";

const screenDimensions = Dimensions.get("screen");


// -------- Generate words positions --------
// Export for testing only
export const randomPick = (itemList, loopTime, libName) => {
  while(itemList.length < loopTime){
    chosenItem = libName[Math.floor(Math.random() * libName.length)]
    if(itemList.indexOf(chosenItem) === -1){
      itemList.push(chosenItem);
    }
  }

  return itemList;
};


// -------- Generate grids data (game) --------
// Export for testing only
export const generateLibrary = (gen, level, game, word) => {
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
  const [loading, setLoading] = useState(true);

  const mode = "offline";
  const maxLevel = 10;
  const gamePerLevel = 3;

  const [master, setMaster] = useState([]);
  const [crosswords, setCrosswords] = useState([]);

  
  // Code to implement offlineGame in the same way with onlineGame
  // (*** Code is here only for learning purpose***)
  // const [master, setMaster] = useState(generateLibrary(
  //   generate({
  //     exactly: 30,
  //     wordsPerString: 1,
  //     minLength: 6,
  //     maxLength: 8,
  //     formatter: (word) => word.toUpperCase(),
  //   }), maxLevel, gamePerLevel, 1)
  // );

  // const [crosswords, setCrosswords] = useState(generateLibrary(
  //   generate({
  //     exactly: 150,
  //     wordsPerString: 1,
  //     minLength: 3,
  //     maxLength: 5,
  //     formatter: (word) => word.toUpperCase(),
  //   }), maxLevel, gamePerLevel, 5)
  // );


  const [disScore, setDisScore] = useState(0);
  const [disLevel, setDisLevel] = useState(1);
  const [disCoin, setDisCoin] = useState(10);


  // Retrieve score from the database, ONLY ONCE when the app start
  useEffect(() => {
    const getWordsBags = async () => {
      try{
        const { masterBag, crossBag } = await processBag();
        setMaster(generateLibrary(masterBag, maxLevel, gamePerLevel, 1));
        setCrosswords(generateLibrary(crossBag, maxLevel, gamePerLevel, 5));

        setLoading(false);
      }catch(error){
        console.error("Error getWordsBags:", error);
      }
    };

    getWordsBags();

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
    let isMounted = true;

    if(isMounted){
      setDisLevel(1 + Math.floor(disScore/10));

      updateScore(disScore)
      .catch((error) => {
        console.error("offlineGame.js: Error updating score:", error);
      });
    }

    return () => {
      isMounted = false;
    };
  }, [disScore]);

  // Update coin to the database when disCoin is changed
  useEffect(() => {
    let isMounted = true;

    if(isMounted){
      updateCoin(disCoin)
      .catch((error) => {
        console.error("offlineGame.js: Error updating coin:", error);
      });
    }

    return () => {
      isMounted = false;
    };
  }, [disCoin]);

  const computeScore = (score) => {
    setDisScore(score);
  }

  const computeCoin = (coin) => {
    setDisCoin(coin);
  }

  // Prevent grid of words (DisplayGame Component) rendering before bags of words are ready
  // Can be omitted if use the same approach to onlineGame.
  if(loading){
    return <ActivityIndicator size = "large"/>;
  }

  return(
    <KeyboardAvoidingView style = {styles.container} behavior = {Platform.OS === "ios" ? "padding" : "height"}>
      <SafeAreaView style = {styles.safeArea}>
        <TouchableOpacity testID = "homeButton"
                          style = {styles.button}
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
          <Text testID = "levelDisplay" style = {styles.scoreLvlText}>{disLevel}</Text>
          <View style = {styles.gap}/>

          <MaterialIcons name = "grade"
                          size = {screenDimensions.width/12}
                          color = "#331005"
          />
          <Text testID = "scoreDisplay" style = {styles.scoreLvlText}>{disScore}</Text>
          <View style = {styles.gap}/>

          <FontAwesome6 name = "gem"
                        size = {screenDimensions.width/14}
                        color = "#331005"
          />
          <Text testID = "coinDisplay" style = {styles.scoreLvlText}>{disCoin}</Text>
        </View>

        <View testID = "displayGameCon" style = {styles.displayGameContainer}>
          <DisplayGame level = {disLevel} maxLevel = {maxLevel} gamePerLevel = {gamePerLevel}
                      score = {disScore} computeScore = {computeScore}
                      coin = {disCoin} computeCoin = {computeCoin}
                      crosswordsProc = {crosswords}
                      master = {master}
                      mode = {mode}
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
