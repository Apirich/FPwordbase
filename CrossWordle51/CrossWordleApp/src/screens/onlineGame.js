import { StyleSheet, View, Text, Dimensions, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, Modal } from "react-native";
import { useEffect, useState } from "react";
import { MaterialCommunityIcons, MaterialIcons, FontAwesome6 } from "@expo/vector-icons";

import { generate, count } from "random-words";

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


  // -------- Leadboard Modal --------
  const LeadModalDisplay = ({ onClose, data, visible }) => {
    return (
      <Modal
      animationType = "fade"
      transparent = {true}
      visible = {visible}
      onRequestClose = {onClose}
      >
      <View style = {styles.modalView}>
        <View style = {styles.modalConView}>
          <TouchableOpacity style = {styles.closeButton}
                            onPress = {onClose}
          >
            <MaterialCommunityIcons name = "close-thick"
                                    size = {screenDimensions.width/18}
                                    color = "#f6efde"
            />
          </TouchableOpacity>

          <Text style = {styles.leadText}>Leaderboard</Text>
          <Text style = {styles.leadText}>Leaderboard</Text>
          <Text style = {styles.leadText}>Leaderboard</Text>
          <Text style = {styles.leadText}>Leaderboard</Text>
          <Text style = {styles.leadText}>Leaderboard</Text>
        </View>
      </View>
      </Modal>
    );
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

    const [leadModal, setLeadModal] = useState(false);

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
      checkTokenExpiration("OnlineGameScreen")
      .then(() => {
        setDisLevel(1 + Math.floor(disScore/10));

        updateScore(disScore)
        .then(() => {
          console.log("onlineGame.js: Score updated successfully");
        })
        .catch((error) => {
          console.error("onlineGame.js - error updateScore()", error);
        });
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
      checkTokenExpiration("OnlineGameScreen")
      .then(() => {
        updateCoin(disCoin)
        .then(() => {
          console.log("onlineGame.js: Coin updated successfully");
        })
        .catch((error) => {
          console.error("onlineGame.js - error updateCoin()", error);
        });
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
          <View style = {styles.buttonCon}>
            <TouchableOpacity style = {styles.button}
                              onPress = {() => navigation.navigate("OnlineMode")}
            >
              <MaterialCommunityIcons name = "home"
                                      size = {screenDimensions.width/12}
                                      color = "#f6efde"
              />
            </TouchableOpacity>

            <TouchableOpacity style = {styles.button}
                              onPress = {() => setLeadModal(true)}
            >
              <MaterialIcons name = "leaderboard"
                                      size = {screenDimensions.width/12}
                                      color = "#f6efde"
              />
            </TouchableOpacity>

            <TouchableOpacity style = {styles.button}
                              onPress = {() => handleLogout()}
            >
              <MaterialCommunityIcons style = {styles.symbol}
                                    name = "logout"
                                    size = {screenDimensions.width/12}
                                    color = "#f6efde"
              />
            </TouchableOpacity>

            <LeadModalDisplay onClose = {() => setLeadModal(false)}
                              data = {"text"}
                              visible = {leadModal}
            />
          </View>

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

    modalView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#00000080",
    },

    modalConView: {
      backgroundColor: "#f6efde",
      padding: screenDimensions.width/14,
      borderRadius: screenDimensions.width/28,
    },

    closeButton: {
      width: screenDimensions.width/14,
      height: screenDimensions.width/14,
      backgroundColor: "#331005",
      alignSelf: "flex-end",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: screenDimensions.width/28,
      marginLeft: screenDimensions.width/2,
    },

    leadText: {
      fontSize: screenDimensions.width/12,
      fontWeight: "bold",
      color: "#d83f03",
      alignSelf: "center",
      marginTop: screenDimensions.height/30,
    },

    buttonCon: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: screenDimensions.height/26,
      marginHorizontal: screenDimensions.height/36,
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

export default OnlineGameScreen;




