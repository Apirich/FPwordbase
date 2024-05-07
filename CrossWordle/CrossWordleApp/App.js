import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

// Import navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator} from "@react-navigation/stack";
// Import NetInfo (NetInfo has event listenter)
import NetInfo from '@react-native-community/netinfo';

// Import AsyncStorage and AppState
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";

//
import { handleLogout } from "./src/database/fetchBackend";

// Import screens
import SplashScreen from "./src/screens/splash";
import WelcomeScreen from "./src/screens/welcome";
import OnlineModeScreen from "./src/screens/onlineMode";
import LoginScreen from "./src/screens/login";
import SignupScreen from "./src/screens/signup";
import OnlineGameScreen from "./src/screens/onlineGame";
import OfflineGameScreen from "./src/screens/offlineGame";


// -------- Navigator --------
const Stack = createStackNavigator();

export default function App(){
  const [loading, setLoading] = useState(true);
  const [internetChecking, setInternetChecking] = useState(true);

  const processLoading = async () => {
    // Splashing for 3 seconds
    const sleep = splashSecond => new Promise(anyFunctionIfHave => setTimeout(anyFunctionIfHave, splashSecond));

    try{
      await sleep(3000);
    }
    finally{
      setLoading(false);
    }
  }

  // Using NetInfo to check internet connection
  const unsubscribe = NetInfo.addEventListener(state => {
    if(internetChecking != state.isConnected){
      setInternetChecking(state.isConnected);
    }
  });


  const handleAppClose = (appState) => {
    if(appState === "background" || appState === "inactive"){
      AsyncStorage.multiGet(["token", "tokenExpTimestamp"])
      .then((items) => {
        const filteredItems = items.filter(([_, value]) => value !== null);

        if(filteredItems.length > 0){
          // If token and tokenExpirationTimestamp exist, call handleLogout
          handleLogout("nav");
        }else{
          // If token and tokenExpirationTimestamp do not exist, close the app
          console.log("App.js - handleAppClose(): No token and tokenExpTimestamp found, closing the app...");
        }
      })
      .catch((error) => {
          console.error("App.js - handleAppClose(): Error retrieving items from AsyncStorage:", error);
      });
    }else if(appState === "active"){
      console.log("reloaded");
    }
  };


  useEffect(() => {
    processLoading();

    AppState.addEventListener("change", handleAppClose);

    return () => {
      // Clean up event listener
      AppState.removeEventListener("change", handleAppClose);
    };
  }, []);


  if(loading){
    return SplashScreen(internetChecking);
  }

  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName = "Welcome">
        <Stack.Screen name = "Welcome" component = {WelcomeScreen}
                      options = {{headerShown: false}}
                      initialParams = {{internetChecking}}
        />

        <Stack.Screen name = "OnlineMode" component = {OnlineModeScreen}
                      options = {{headerShown: false}}
        />

        <Stack.Screen name = "Login" component = {LoginScreen}
                      options = {{headerShown: false}}
        />

        <Stack.Screen name = "Signup" component = {SignupScreen}
                      options = {{headerShown: false}}
        />

        <Stack.Screen name = "OnlineGame" component = {OnlineGameScreen}
                      options = {{headerShown: false}}
        />

        <Stack.Screen name = "OfflineGame" component = {OfflineGameScreen}
                      options = {{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};



