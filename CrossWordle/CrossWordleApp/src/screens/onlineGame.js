import { StyleSheet, View, Text, Dimensions, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useNavigationState } from "@react-navigation/native";

import { generate, count } from "random-words";
// import { getScore, updateScore, getCoin, updateCoin } from "../database/dbQueries";

import DisplayGame from "../components/grid";

import { getScoreCoin, updateScore, updateCoin, handleLogout, checkTokenExpiration } from "../database/fetchBackend";

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


  const getCurrentRouteName = () => {
    const navigationState = useNavigationState(state => state);
    return navigationState.routes[navigationState.index].name;
  };


  // -------- Online Game Screen --------
  OnlineGameScreen = ({navigation, route}) => {
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

    // const currentRouteName = getCurrentRouteName();
    // console.log("Current route name ONLINEGAME:", currentRouteName);


    // Retrieve score from the database, ONLY ONCE when the app start
    useEffect(() => {
      getScoreCoin()
      .then((data) => {
        // Update state with fetched data
        setDisScore(data.score);
        setDisLevel(1 + Math.floor(data.score / 10));
        setDisCoin(data.coin);
      })
      .catch(error => {
        console.error("onlineGame.js - error getScoreCoin():", error);
      });
    }, []);

    // Update score to the database when disScore is changed
    useEffect(() => {
      checkTokenExpiration("", "OnlineGameScreen")
      .then((isTokenExpired) => {
        if(isTokenExpired){
          alert("Your login session has expired, latest score has not been updated! Please login again!");
          navigation.navigate("Login");
        }else{
          setDisLevel(1 + Math.floor(disScore/10));

           updateScore(disScore)
          .then(() => {
            console.log("onlineGame.js: Score updated successfully");
          })
          .catch((error) => {
            console.error("onlineGame.js - error updateScore()", error);
          });
        }
      })
      .then(() => {
        console.log("onlineGame.js: Score updated successfully");
      })
      .catch((error) => {
        console.error("onlineGame.js - error Score checkTokenExpiration()", error);
      });
    }, [disScore]);

    // Update coin to the database when disCoin is changed
    useEffect(() => {
      checkTokenExpiration("", "OnlineGameScreen")
      .then((isTokenExpired) => {
        if(isTokenExpired){
          alert("Your login session has expired, latest coin has not been updated! Please login again!");
          navigation.navigate("Login");
        }else{
          updateCoin(disCoin)
          .then(() => {
            console.log("onlineGame.js: Coin updated successfully");
          })
          .catch((error) => {
            console.error("onlineGame.js - error updateCoin()", error);
          });
        }
      })
      .then(() => {
        console.log("onlineGame.js: Coin updated successfully");
      })
      .catch((error) => {
        console.error("onlineGame.js - error Coin checkTokenExpiration()", error);
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
          <TouchableOpacity onPress = {() => navigation.navigate("OnlineMode")}>
            <Text style = {[styles.buttonText]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress = {() => handleLogout({navigation})}>
            <Text style = {[styles.buttonText]}>Logout</Text>
          </TouchableOpacity>

          <View style = {styles.scoreLvlContainer}>
            <Text>Level: {disLevel}</Text>
            <Text>Score: {disScore}</Text>
            <Text>Coin: {disCoin}</Text>
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
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },

    // Game Screen
    safeArea: {
      flex: 1,
    },

    buttonText: {
      color: "green",
      fontSize: screenDimensions.width/20,
    },

    scoreLvlContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingTop: 20,
      backgroundColor: "white",
      zIndex: 1,
    },

    displayGameContainer: {
      flex: 1,
      marginTop: 10,
      zIndex: 0,
    },
});

export default OnlineGameScreen;




