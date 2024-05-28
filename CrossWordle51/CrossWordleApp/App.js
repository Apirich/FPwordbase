import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

// Import navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator} from "@react-navigation/stack";

// Import NetInfo (NetInfo has event listenter)
import NetInfo from "@react-native-community/netinfo";

// Import AsyncStorage and AppState
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";

//
import { checkTokenExpiration, resetAsyncStorage } from "./src/database/fetchBackend";
import NavigationService from "./src/navigations/navService"

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

  const [appState, setAppState] = useState("initial");

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


  const appStateChange = (state) => {
    if(state === "active"){
      setAppState("active");
    }else if(state === "inactive"){ // Have to setAppState inactive so that the app able to detect multiple inactive/active
      setAppState("inactive");
    }
  };


  useEffect(() => {
    // resetAsyncStorage();
    processLoading();

    AppState.addEventListener("change", appStateChange);

    // Clean up event listener
    return () => {
      AppState.removeEventListener("change", appStateChange);
    };
  }, []);

  useEffect(() => {
    if(appState === "active"){
      checkTokenExpiration(appState);
    }
  }, [appState]);


  if(loading){
    return SplashScreen(internetChecking);
  }

  return(
    <NavigationContainer ref = {NavigationService.setTopLevelNavigator}>
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



