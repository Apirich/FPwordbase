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

  // Using AsyncStorage and AppState
  // To remove token and tokenTimestamp when the App is closed
  const handleAppClose = (appState) => {
    if(appState === "background" || appState === "inactive"){
      AsyncStorage.multiRemove(["token", "tokenExpTimestamp"])
      .then(() => {
        console.log("App.js - handleAppClose(): Removed token, tokenExpTimestamp");
      })
      .catch((error) => {
        console.error("App.js - handleAppClose(): Error removing item from AsyncStorage:", error);
      });
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



