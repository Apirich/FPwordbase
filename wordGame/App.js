import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TextInput, View, Dimensions } from "react-native";

const screenDimensions = Dimensions.get("screen");

export default function App() {
  const libraries = ["cat", "bird", "dog", "smile", "dance", "song", "music"];
  const positions = [0, 1, 2, 3, 4];

  let words = [];
  let wXpos = [];
  let wYpos = [];

  let wordData = [];

  while(words.length < 5){
    w = libraries[Math.floor(Math.random() * libraries.length)]
    if(words.indexOf(w) === -1){
      words.push(w);
    }
  }

  while(wXpos.length < 5){
    xP = positions[Math.floor(Math.random() * positions.length)]
    if(wXpos.indexOf(xP) === -1){
      wXpos.push(xP);
    }
  }

  while(wYpos.length < 5){
    yP = positions[Math.floor(Math.random() * positions.length)]
    if(wYpos.indexOf(yP) === -1){
      wYpos.push(yP);
    }
  }

  for(let i = 0; i < 5; ++i){
    wordData.push({
      "direction": Math.random() < 0.5 ? "A" : "D",
      "word": words[i],
      "xPos": wXpos[i],
      "yPos": wYpos[i],
    })
  }

  console.log(wordData);

  const grid = Array(10).fill(0).map(() => Array(10).fill("-1"));

  wordData.forEach(({direction, word, xPos, yPos}, i) => {
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

  return (
    <View style = {styles.container}>
      {grid.map((row, i) => (
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
      {/* <View style = {styles.row}>
        <View style = {styles.wordCell}>
          <TextInput style = {styles.cell}
                     value = "A"
                     maxLength = {1}
          />

          <TextInput style = {styles.cell}
                     value = "B"
                     maxLength = {1}
          />
        </View>

        <View style = {styles.wordCell}>
          <TextInput style = {styles.cell}
                     value = "C"
                     maxLength = {1}
          />

          <TextInput style = {styles.cell}
                     value = "D"
                     maxLength = {1}
          />

          <TextInput style = {styles.cell}
                     value = "E"
                     maxLength = {1}
          />
        </View>
      </View> */}

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
