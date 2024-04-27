import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View, Dimensions, Button } from "react-native";

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

const DisplayGame = ({crosswordsProc, master}) => {
    const [disGrid, setDisGrid] = useState(generateGrid(crosswordsProc));
    const [disMaster, setDisMaster] = useState(generateMasterCell(master));
    const [disMatch, setDisMatch] = useState([]);
    const [disStatus, setDisStatus] = useState("Need to be solved!");

    // Update grid/master if crosswordsProc/master are updated/changed
    useEffect(() => {
        setDisGrid(generateGrid(crosswordsProc));
        setDisMaster(generateMasterCell(master));
    }, [crosswordsProc, master]);

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

    const handleVerify = () => {
        const verifyMaster = [...disMaster].join("");
        const verifyGrid = [...disGrid];

        if(verifyMaster === master){
            setDisStatus("Nailed it!");
        }else{
            setDisStatus("Try again!");
        }

        let match = new Set(disMatch);

        for(let i = 0; i < verifyGrid.length; ++i){
            for(let j = 0; j < verifyGrid[i].length; ++j){
                if(verifyGrid[i][j] !== "" && master.includes(verifyGrid[i][j])){
                    match.add(verifyGrid[i][j]);
                }
            }
        }

        setDisMatch(Array.from(match).sort());
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
    };

    const handleGenerate = () => {
        setDisGrid(generateGrid(crosswordsProc));
        setDisMaster(generateMasterCell(master));
        setDisMatch("");
        setDisStatus("Need to be solved!");
    };


    const displayGrid = () => (
        <View>
            {disGrid.map((row, i) => (
                <View key = {i} style = {styles.row}>
                    {row.map((cell, j) => (
                        <View key = {j} style = {styles.wordCell}>
                            {crosswordsProc.map(({xPos, yPos, direction}, ind) => {
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
                <Button color = {"green"}
						title = "Verify"
						onPress = {handleVerify}
						style = {styles.button}
                />
                <View style = {styles.gap}/>

                <Button color = {"green"}
						title = "Reset"
						onPress = {handleReset}
						style = {styles.button}
                />
                <View style = {styles.gap}/>

                <Button color = {"green"}
						title = "New Game"
						onPress = {handleGenerate}
						style = {styles.button}
                />
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

	gap: {
		width: 10, // Adjust the width as needed for the desired gap
	},
});

export default DisplayGame;
