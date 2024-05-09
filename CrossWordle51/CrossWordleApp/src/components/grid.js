import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View, Dimensions, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";

// import { ScrollView } from "react-native-gesture-handler";
// word-exists requires external API (only ONLINE)
import wordExists from "word-exists";

// user will be able to use the app OFFLINE with readFile
// however mit.edu not cover enough words, so use word-exists package instead
// code is here for completeness only
// import readFile from "../helpers/readFile2";

// // use with readFile
// const procReadFile = readFile;
// let wordLibrary;

// // use with readFile
// procReadFile()
// .then(wordList =>{
//     wordLibrary = wordList;
// })
// .catch(error => {
//     console.error("grid.js - procReadFile() ERROR: ", error);
// })

const screenDimensions = Dimensions.get("screen");

const generateGrid = (crosswordsProc) => {
    const grid = Array(10).fill(0).map(() => Array(10).fill("-1"));

    crosswordsProc.forEach(({direction, word, xPos, yPos}, i) => {
        for(let j = 0; j < word.length; ++j){
            if(direction === "A"){
                grid[yPos][xPos + j] = "";
            }else{
                grid[yPos + j][xPos] = "";
            }
        }
    });

    return grid;
};

const generateMasterCell = (master) => {
    const masterCell = Array(master.length).fill("");
    return masterCell;
};

const DisplayGame = ({level, maxLevel, gamePerLevel,
                      score, computeScore,
                      coin, computeCoin,
                      crosswordsProc,
                      master}) => {
    const [numGame, setNumGame] = useState(0);
    const [disGrid, setDisGrid] = useState(generateGrid(crosswordsProc[(level - 1) % maxLevel][numGame]));
    const [disMaster, setDisMaster] = useState(generateMasterCell(master[(level - 1) % maxLevel][numGame]));
    const [disMatch, setDisMatch] = useState([]);
    const [disStatus, setDisStatus] = useState("Need to be solved!");
    const [solvedGame, setSolvedGame] = useState([gamePerLevel]);
    const [revealedGame, setRevealedGame] = useState("");
    const [disRevealStatus, setDisRevealStatus] = useState(false);
    const [disCheerLvUp, setDisCheerLvUp] = useState(false);

    console.log(master[(level - 1) % maxLevel][numGame]);

    const [crosswordData, setCrosswordData] = useState(crosswordsProc[(level - 1) % maxLevel][numGame]);

    // Update grid/master if crosswordsProc/master are updated/changed in words.js
    // and if numGame/level are updated/changed (generate New Game/level up)
    useEffect(() => {
        setDisGrid(generateGrid(crosswordsProc[(level - 1) % maxLevel][numGame]));
        setDisMaster(generateMasterCell(master[(level - 1) % maxLevel][numGame]));
        setCrosswordData(crosswordsProc[(level - 1) % maxLevel][numGame]);
    }, [crosswordsProc, master, numGame, level, maxLevel, gamePerLevel]);

    useEffect(() => {
        // Avoid level up alert everytime starting a screen with DisplayGame component
        if(disCheerLvUp){
            alert("Hooray, you have leveled up!");
        }

        setDisStatus("Need to be solved!");
        setDisMatch([]);
    }, [level]);

    useEffect(() => {
        setSolvedGame([gamePerLevel]);
    }, [crosswordsProc, master, level, maxLevel, gamePerLevel]);

    const handleGridInput = (row, col, input) => {
        const newGrid = [...disGrid];
        newGrid[row][col] = input;
        setDisGrid(newGrid);
    };

    const handleMasterInput = (i, input) => {
        const newMaster = [...disMaster];
        newMaster[i] = input;
        setDisMaster(newMaster);
    };

    const handleVerify = (cwData) => {
        const verifyMaster = [...disMaster].join("");
        const verifyGrid = [...disGrid];
        const verifySolvedGame = [...solvedGame];

        if(verifyMaster === master[(level - 1) % maxLevel][numGame]){
            setDisStatus("Nailed it!");
            setDisCheerLvUp(true);
            computeScore(score + 5);
            computeCoin(coin + 5);

            // Add new solved game to solvedGame[]
            verifySolvedGame.push(numGame);
            setSolvedGame(verifySolvedGame);
        }else{
            setDisStatus("Try again!");

            let invalidInput = false;

            for(let i = 0; i < cwData.length; ++i){
                let inputWord = "";

                for(let j = 0; j < cwData[i]["word"].length; ++j){
                    if(cwData[i]["direction"] === "A"){
                        inputWord += verifyGrid[cwData[i]["yPos"]][cwData[i]["xPos"] + j];
                    }else{
                        inputWord += verifyGrid[cwData[i]["yPos"] + j][cwData[i]["xPos"]];
                    }
                }

                // Use with wordExists package (only ONLINE)
                if(inputWord !== "" && !wordExists(inputWord)){
                    alert("Ouch! One of your input word is not in the dictionary!");
                    invalidInput = true;
                    break;
                }

                // // Use with wordLibrary (user can use the app OFFLINE)
                // // The wordlist from mit.edu is not enough word so use wordExists package instead
                // // wordExists requires external API
                // // code is here for completenese only
                // if(inputWord !== "" && !wordLibrary.includes(inputWord.toLowerCase())){
                //     alert("Ouch! One of your input word is not in the dictionary!");
                //     invalidInput = true;
                //     break;
                // }
            }

            // Only verify matching letters if input are not empty
            // and all inputs are English word (valid)
            if(!invalidInput){
                let match = new Set(disMatch);

                for(let i = 0; i < verifyGrid.length; ++i){
                    for(let j = 0; j < verifyGrid[i].length; ++j){
                        if(verifyGrid[i][j] !== "" && master[(level - 1) % maxLevel][numGame].includes(verifyGrid[i][j])){
                            match.add(verifyGrid[i][j]);
                        }
                    }
                }

                setDisMatch(Array.from(match).sort());
            }
        }
    };

    const handleReset = () => {
        const resetGrid = [...disGrid];

        // Longer typing but better performance than
        // recalling setDisGrid(generateGrid(crosswordsProc));
        for(let i = 0; i < resetGrid.length; ++i){
            for(let j = 0; j < resetGrid[i].length; ++j){
                if(resetGrid[i][j] !== "-1"){
                    resetGrid[i][j] = "";
                }
            }
        }

        setDisGrid(resetGrid);
        setDisMaster(generateMasterCell(master[(level - 1) % maxLevel][numGame]));
    };

    const handleGenerate = () => {
        const gPerLevel = gamePerLevel;
        let solvedGameArr = [...solvedGame];
        let nGame = numGame;

        // console.log(solvedGame, gamePerLevel);
        // console.log(numGame, nGame);

        // Only incase when gamePerLevel <= score to level up
        // Not apply in this App!!!
        // Just here for completeness!!!
        // But DO NOT command out since it guarantee no crash
        if(solvedGameArr.length >= gPerLevel + 1){
            solvedGameArr = [gPerLevel];
            setSolvedGame([gPerLevel]);
        }

        // Logic indeed start from here
        if(nGame < gPerLevel){
            nGame++;

            if(solvedGameArr.indexOf(nGame) == -1){
                setNumGame(nGame);
            }else{
                while(nGame < gPerLevel){
                    nGame++;

                    if(solvedGameArr.indexOf(nGame) == -1){
                        setNumGame(nGame);
                        break;
                    }
                }
            }
        }

        if(nGame >= gPerLevel){
            nGame = 0;

            if(solvedGameArr.indexOf(nGame) == -1){
                setNumGame(nGame);
            }else{
                while(nGame < gPerLevel){
                    nGame++;

                    if(solvedGameArr.indexOf(nGame) == -1){
                        setNumGame(nGame);
                        break;
                    }
                }
            }
        }

        setDisMatch("");
        setDisStatus("Need to be solved!");
        setRevealedGame("");
        setDisRevealStatus(false);
    };


    const handleReveal = () => {
        if(coin >= 10){
            setRevealedGame(master[(level - 1) % maxLevel][numGame]);
            setDisRevealStatus(true);
            computeCoin(coin - 10);
        }else{
            alert("Insufficient, you need at least 10 coins!");
        }
    };


    const displayGrid = () => (
        <View>
            {disGrid.map((row, i) => (
                <View key = {i} style = {styles.row}>
                    {row.map((cell, j) => (
                        <View key = {j} style = {styles.wordCell}>
                            <TextInput style = {[styles.cell,
                                                cell === "-1" ? styles.emptyCell : null]}
                                        value = {cell}
                                        editable = {cell !== "-1"}
                                        maxLength = {1}
                                        onChangeText = {(input) => handleGridInput(i, j, input.toUpperCase())}
                            />

                            {crosswordData.map(({xPos, yPos, direction}, ind) => {
                                return i === yPos && j === xPos ?
                                <Text key = {ind + direction} style = {styles.title}>{ind + 1 + direction}</Text>
                                :
                                null;
                            })}
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );

    const displayMatch = () => (
        <View style = {{flexDirection: "row"}}>
            {Array.from(disMatch).map((letter, i) => (
                <Text key = {i} style = {[styles.matchText]}>
                    {letter}
                </Text>
            ))}
        </View>
    );

    const displayMaster = () => (
        <View style = {{flexDirection: "row"}}>
            {disMaster.map((letter, i) => (
                <TextInput key = {i} style = {[styles.cell]}
                           value = {letter}
                           maxLength = {1}
                           onChangeText = {(input) => handleMasterInput(i, input.toUpperCase())}
                />
            ))}
        </View>
    );

    return(
        <KeyboardAvoidingView style = {styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView contentContainerStyle = {styles.scrollContainer} keyboardShouldPersistTaps = "handled">
                <View style = {styles.content}>
                    {displayGrid()}
                    {displayMatch()}
                    {displayMaster()}

                    {/* As RN components, keyboard will automatically pop down after each input */}
                    {/* <DisplayGrid/>
                    <DisplayMaster/> */}

                    <View>
                        <Text style = {[styles.statusText]}>{disStatus}</Text>
                    </View>

                    <View>
                        <Text style = {[styles.revealText]}>{revealedGame}</Text>
                    </View>

                    <View style = {styles.buttonCon}>
                        <TouchableOpacity style = {[styles.button, disStatus === "Nailed it!" ? styles.disableButton: null]}
                                          onPress = {() => handleVerify(crosswordData)}
                                          disabled = {disStatus === "Nailed it!" ? true : false}
                        >
                            <Text style = {[styles.buttonText, disStatus === "Nailed it!" ? styles.disableButton : null]}>Verify</Text>
                        </TouchableOpacity>
                        <View style = {styles.gap}/>

                        <TouchableOpacity style = {[styles.button, disStatus === "Nailed it!" ? styles.disableButton: null]}
                                          onPress = {() => handleReset()}
                                          disabled = {disStatus === "Nailed it!" ? true : false}
                        >
                            <Text style = {[styles.buttonText, disStatus === "Nailed it!" ? styles.disableButton: null]}>Reset</Text>
                        </TouchableOpacity>
                        <View style = {styles.gap}/>

                        <TouchableOpacity style = {styles.button}
                                          onPress = {() => handleGenerate()}
                        >
                            <Text style = {styles.buttonText}>New Game</Text>
                        </TouchableOpacity>
                        <View style = {styles.gap}/>

                        <TouchableOpacity style = {[styles.button, disRevealStatus === true ? styles.disableButton : null]}
                                          onPress = {() => handleReveal()}
                                          disabled = {disRevealStatus === true ? true : false}
                        >
                            <Text style = {[styles.buttonText, disRevealStatus === true ? styles.disableButton : null]}>Reveal</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    scrollContainer: {
        flexGrow: 1,
    },

    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    row: {
        flexDirection: "row",
    },

    cell: {
        borderWidth: screenDimensions.width/300,
        borderColor: "#331005",
        backgroundColor: "#f1c7af",
        color: "#331005",
        width: screenDimensions.width/12,
        margin: screenDimensions.width/300,
        aspectRatio: 1,
        textAlign: "center",
    },

    emptyCell: {
        borderColor: "transparent",
        color: "transparent",
        backgroundColor: "transparent",
    },

    title: {
        position: "absolute",
        top: screenDimensions.width/180,
        left: screenDimensions.width/180,
        fontSize: screenDimensions.width/60,
        fontWeight: "bold",
        color: "#d83f03",
    },

    matchText: {
        color: "#1C9B3A",
        fontSize: screenDimensions.width/14,
        padding: screenDimensions.width/42,
        fontWeight: "bold",
    },

    statusText: {
        color: "#331005",
        fontSize: screenDimensions.width/28,
        padding: screenDimensions.width/42,
        fontWeight: "bold",
    },

    revealText: {
        color: "#A38960",
        fontSize: screenDimensions.width/16,
        fontWeight: "bold",
    },

    buttonCon: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginTop: screenDimensions.height/40,
		marginHorizontal: screenDimensions.height/36,
	},

	button: {
        height: screenDimensions.height/18,
        backgroundColor: "#d83f03",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: screenDimensions.width/30,
        padding: screenDimensions.width/50,
	},

    buttonText: {
        color: "#f6efde",
        fontWeight: "500",
        fontSize: screenDimensions.width/20,
    },

    disableButton: {
        opacity: 0.3,
    },

    gap: {
        width: screenDimensions.width/16,
    },
});

export default DisplayGame;
