import { StyleSheet, View, Text, Dimensions, SafeAreaView, Image, TouchableOpacity, Modal, ScrollView } from "react-native";
import { MaterialCommunityIcons, MaterialIcons, FontAwesome6 } from "@expo/vector-icons";
import { useState } from "react";

const screenDimensions = Dimensions.get("screen");

// -------- Welcome Screen --------
WelcomeScreen = ({navigation, route}) => {
  const { internetChecking } = route.params;

  const [infoModal, setInfoModal] = useState(false);

  return(
    <View style = {styles.container}>
      <SafeAreaView>
        <Text style = {styles.appNameText}>CrossWordle</Text>

        <TouchableOpacity testID = "onlineButton"
                          style = {[styles.button, internetChecking ? null : styles.disableButton]}
                          onPress = {() => navigation.navigate("OnlineMode")}
                          disabled = {internetChecking ? false : true}
        >
          <Text style = {[styles.buttonText, internetChecking ? null : styles.disableButton]}>Online Mode</Text>
        </TouchableOpacity>

        <TouchableOpacity testID = "offlineButton"
                          style = {[styles.button, {marginTop: screenDimensions.height/20}]}
                          onPress = {() => navigation.navigate("OfflineGame")}
        >
          <Text style = {[styles.buttonText]}>Offline Mode</Text>
        </TouchableOpacity>

        <TouchableOpacity testID = "infoButton"
                          style = {styles.infoButton}
                          onPress = {() => setInfoModal(true)}
        >
          <MaterialCommunityIcons name = "information-outline"
                                  size = {screenDimensions.height/14}
                                  color = "#f6efde"
          />
        </TouchableOpacity>

        <Modal animationType = "fade"
               transparent = {true}
               visible = {infoModal}
               onRequestClose = {() => setInfoModal(false)}
        >
          <SafeAreaView style = {styles.modalView}>
            <View style = {styles.modalConView}>
              <ScrollView scrollIndicatorInsets = {{right: -screenDimensions.width/2}}>
                <TouchableOpacity style = {styles.closeButton}
                                  onPress = {() => setInfoModal(false)}
                >
                  <MaterialCommunityIcons name = "close-thick"
                                          size = {screenDimensions.width/18}
                                          color = "#f6efde"
                  />
                </TouchableOpacity>

                <Text style = {styles.titleText}>Instruction</Text>

                <Text style = {styles.contentBigText}>
                  <MaterialCommunityIcons name = "star-four-points-outline"
                                          size = {screenDimensions.width/18}
                                          color = "#331005"
                  />
                  CrossWordle can be used in two modes:
                </Text>
                <Text style = {styles.contentText}>- Offline mode: Allows use without an internet connection.</Text>
                <Text style = {styles.contentText}>- Online mode: Requires an internet connection.</Text>

                <Text style = {styles.titleText}>How to Play</Text>

                <Text style = {styles.contentBigText}>
                  <MaterialCommunityIcons name = "star-four-points-outline"
                                          size = {screenDimensions.width/18}
                                          color = "#331005"
                  />
                  Guess the master word using the grid in unlimited attempts.
                </Text>
                <Text style = {styles.contentText}>- The grid words consist of English words and will be verified to display letters found in the master word.</Text>
                <Text style = {styles.contentText}>- Use ten coins to reveal the master words.</Text>

                <Text style = {styles.contentBigText}>
                  <MaterialCommunityIcons name = "star-four-points-outline"
                                          size = {screenDimensions.width/18}
                                          color = "#331005"
                  />
                  Each game awards five scores and five coins.
                </Text>

                <Text style = {styles.contentBigText}>
                  <MaterialCommunityIcons name = "star-four-points-outline"
                                          size = {screenDimensions.width/18}
                                          color = "#331005"
                  />
                  Level up by successfully solving two games.
                </Text>

                <Text style = {styles.contentBigText}>
                  <MaterialCommunityIcons name = "star-four-points-outline"
                                          size = {screenDimensions.width/18}
                                          color = "#331005"
                  />
                  Multiple games are available for each level.
                </Text>
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

// -------- Styles --------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6efde",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  // Welcome Screen
  appNameText: {
    fontSize: screenDimensions.width/8,
    fontWeight: "bold",
    color: "#d83f03",
    alignSelf: "center",
    marginTop: screenDimensions.height/4,
  },

  button: {
    width: screenDimensions.width/2,
    height: screenDimensions.height/12,
    backgroundColor: "#331005",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: screenDimensions.width/20,
    marginTop: screenDimensions.height/6,
  },

  buttonText: {
    color: "#f6efde",
    fontWeight: "500",
    fontSize: screenDimensions.width/16,
    alignSelf: "center",
  },

  disableButton: {
    opacity: 0.3,
  },

  infoButton: {
    width: screenDimensions.height/14,
    height: screenDimensions.height/14,
    backgroundColor: "#331005",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: screenDimensions.width/7,
    marginTop: screenDimensions.height/20,
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

  titleText: {
    fontSize: screenDimensions.width/14,
    fontWeight: "bold",
    color: "#d83f03",
    alignSelf: "center",
    marginTop: screenDimensions.height/30,
  },

  contentBigText: {
    fontSize: screenDimensions.width/18,
    fontWeight: "bold",
    color: "#331005",
    alignSelf: "left",
    marginTop: screenDimensions.height/30,
  },

  contentText: {
    fontSize: screenDimensions.width/20,
    fontWeight: 500,
    color: "#331005",
    alignSelf: "left",
    marginTop: screenDimensions.height/30,
  },
});

// #331005

// #d6cfb9

export default WelcomeScreen;
