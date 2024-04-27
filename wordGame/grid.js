import { useState } from "react";
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

            if(j == 0){
                grid[yPos][xPos] = i.toString() + direction;
            }
        }
    });

    return grid;
};

const DisplayGrid = ({crosswordsProc}) => {
    const [disGrid, setDisGrid] = useState(generateGrid(crosswordsProc));

    const display = () => (
        <View style = {styles.container}>
            {disGrid.map((row, i) => (
                <View key = {i} style = {styles.row}>
                    {row.map((cell, j) => (
                        <View key = {j} style = {styles.wordCell}>
                            {cell !== "" && cell !== "-1" ?
                            <Text style = {styles.title}>
                            {cell}
                            </Text>
                            : null}

                            <TextInput style = {[styles.cell,
                                                cell === "-1" ? styles.emptyCell : null]}
                                        value = ""
                                        editable = {cell !== "-1"}
                                        maxLength = {1}
                            />
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );

    return(
        <View>
            {display()}
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
      position: 'absolute',
          top: 2,
          left: 2,
          fontSize: 10,
          fontWeight: 'bold',
    },
});

export default DisplayGrid;
