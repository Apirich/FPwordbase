import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View, Dimensions } from "react-native";

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

const DisplayGame = ({crosswordsProc}) => {
    const [disGrid, setDisGrid] = useState(generateGrid(crosswordsProc));

    // Update grid if crosswordsProc is updated/changed
    useEffect(() => {
        setDisGrid(generateGrid(crosswordsProc));
    }, [crosswordsProc]);

    const handleInput = (row, col, input) => {
        const newGrid = [...disGrid];
        newGrid[row][col] = input;
        setDisGrid(newGrid);
    };

    const displayGrid = () => (
        <View>
            {disGrid.map((row, i) => (
                <View key = {i} style = {styles.row}>
                    {row.map((cell, j) => (
                        <View key = {j} style = {styles.wordCell}>
                            {crosswordsProc.map(({xPos, yPos, direction}, ind) => {
                                return i === yPos && j === xPos ?
                                <Text key = {ind + direction} style = {styles.title}>{ind + direction}</Text>
                                :
                                null;
                            })}

                            <TextInput style = {[styles.cell,
                                                cell === "-1" ? styles.emptyCell : null]}
                                        value = {cell}
                                        editable = {cell !== "-1"}
                                        maxLength = {1}
                                        onChangeText = {(input) => handleInput(i, j, input.toUpperCase())}
                            />
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );

    const displayMaster = () => (
        <View>
            <TextInput style = {[styles.cell, {flexDirection: "row"}]}/>
            <TextInput style = {[styles.cell, {flexDirection: "row"}]}/>
            <TextInput style = {[styles.cell, {flexDirection: "row"}]}/>
        </View>
    );

    return(
        <View style = {styles.container}>
            {displayGrid()}
            {displayMaster()}
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
});

export default DisplayGame;
