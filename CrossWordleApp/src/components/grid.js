import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View, Dimensions, TouchableOpacity } from "react-native";

import wordExists from "word-exists";

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

const DisplayGame = ({level, maxLevel, gamePerLevel, score, computeScore, crosswordsProc, master}) => {
    const [numGame, setNumGame] = useState(0);
    const [disGrid, setDisGrid] = useState(generateGrid(crosswordsProc[(level - 1) % maxLevel][numGame]));
    const [disMaster, setDisMaster] = useState(generateMasterCell(master[(level - 1) % maxLevel][numGame]));
    const [disMatch, setDisMatch] = useState([]);
    const [disStatus, setDisStatus] = useState("Need to be solved!");

    console.log(master[(level - 1) % maxLevel][numGame]);

    const [crosswordData, setCrosswordData] = useState(crosswordsProc[(level - 1) % maxLevel][numGame]);
    // console.log(crosswordData);

    // Update grid/master if crosswordsProc/master are updated/changed in words.js
    // and if numGame/level are updated/changed (generate New Game/level up)
    useEffect(() => {
        setDisGrid(generateGrid(crosswordsProc[(level - 1) % maxLevel][numGame]));
        setDisMaster(generateMasterCell(master[(level - 1) % maxLevel][numGame]));
        setCrosswordData(crosswordsProc[(level - 1) % maxLevel][numGame]);
    }, [crosswordsProc, master, numGame, level, maxLevel, gamePerLevel]);

    useEffect(() => {
        setDisStatus("Need to be solved!");
    }, [level]);

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
        console.log(cwData);

        const verifyMaster = [...disMaster].join("");
        const verifyGrid = [...disGrid];

        if(verifyMaster === master[(level - 1) % maxLevel][numGame]){
            setDisStatus("Nailed it!");
            computeScore(score + 5);
        }else{
            setDisStatus("Try again!");

            let invalidInput = false;

            cwData.forEach(({direction, word, xPos, yPos}, i) => {
                let inputWord = "";

                for(let j = 0; j < word.length; ++j){
                    if(direction === "A"){
                        inputWord += verifyGrid[yPos][xPos + j];
                    }else{
                        inputWord += verifyGrid[yPos + j][xPos];
                    }
                }

                if(inputWord !== "" && !wordExists(inputWord)){
                    alert("Ouch! One of your input word is not in the dictionary!");
                    invalidInput = true;
                    return;
                }
            });

            // Only verify matching letters if all inputs are English word (valid)
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
        if(numGame < gamePerLevel - 1){
            setNumGame(numGame + 1);
        }else{
            setNumGame(0);
        }

        // setDisGrid(generateGrid(crosswordsProc[level - 1][numGame]));
        // setDisMaster(generateMasterCell(master[level - 1][numGame]));
        setDisMatch("");
        setDisStatus("Need to be solved!");
    };


    const displayGrid = () => (
        <View>
            {disGrid.map((row, i) => (
                <View key = {i} style = {styles.row}>
                    {row.map((cell, j) => (
                        <View key = {j} style = {styles.wordCell}>
                            {crosswordData.map(({xPos, yPos, direction}, ind) => {
                                return i === yPos && j === xPos ?
                                <Text key = {ind + direction} style = {styles.title}>{ind + 1 + direction}</Text>
                                :
                                null;
                            })}

                            <TextInput style = {[styles.cell,
                                                cell === "-1" ? styles.emptyCell : null]}
                                        value = {cell}
                                        editable = {cell !== "-1"}
                                        maxLength = {1}
                                        onChangeText = {(input) => handleGridInput(i, j, input.toUpperCase())}
                            />
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );

    const displayMatch = () => (
        <View style = {{flexDirection: "row"}}>
            {Array.from(disMatch).map((letter, i) => (
                <Text key = {i} style = {[styles.match]}>
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
        <View style = {styles.container}>
            {displayGrid()}
            {displayMatch()}
            {displayMaster()}

            {/* As RN components, keyboard will automatically pop down after each input */}
            {/* <DisplayGrid/>
            <DisplayMaster/> */}

            <View>
                <Text>{disStatus}</Text>
            </View>

            <View style = {styles.buttonCon}>
                <TouchableOpacity style = {styles.button} onPress = {() => handleVerify(crosswordData)} disabled = {disStatus === "Nailed it!" ? true : false}>
                    <Text style = {[styles.buttonText, disStatus === "Nailed it!" ? styles.disableButtonText : null]}>Verify</Text>
                </TouchableOpacity>
                <View style = {styles.gap}/>

                <TouchableOpacity style = {styles.button} onPress = {() => handleReset()} disabled = {disStatus === "Nailed it!" ? true : false}>
                    <Text style = {[styles.buttonText, disStatus === "Nailed it!" ? styles.disableButtonText : null]}>Reset</Text>
                </TouchableOpacity>
                <View style = {styles.gap}/>

                <TouchableOpacity style = {styles.button} onPress = {() => handleGenerate()}>
                    <Text style = {styles.buttonText}>New Game</Text>
                </TouchableOpacity>
                <View style = {styles.gap}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },

    row: {
      flexDirection: "row",
    },

    // wordCell: {
    //   position: "relative",
    // },

    cell: {
      borderWidth: 1,
      borderColor: "green",
      width: screenDimensions.width/12,
      aspectRatio: 1,
      textAlign: "center",
    },

    emptyCell: {
      borderColor: "transparent",
      color: "transparent",
    },

    title: {
      position: "absolute",
      top: 2,
      left: 2,
      fontSize: 6,
      fontWeight: "bold",
    },

    match: {
        color: "red",
        fontSize: screenDimensions.width/14,
        padding: screenDimensions.width/42,
        fontWeight: "bold",
    },

    buttonCon: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginTop: 20,
		marginHorizontal: 10,
	},

	button: {
		flex: 1, // Ensure equal width for both buttons
	},

    buttonText: {
        color: "green",
        fontSize: screenDimensions.width/20,
    },

    disableButtonText: {
        color: "grey",
        fontSize: screenDimensions.width/20,
    },

	gap: {
		width: 10, // Adjust the width as needed for the desired gap
	},
});

export default DisplayGame;
