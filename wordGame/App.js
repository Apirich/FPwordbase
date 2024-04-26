import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Dimensions } from 'react-native';

const screenDimensions = Dimensions.get("screen");

export default function App() {
  return (
    <View style = {styles.container}>
      <View style = {styles.row}>
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
      </View>

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
    width: screenDimensions.width/10,
    aspectRatio: 1,
    textAlign: "center",
  }
});
