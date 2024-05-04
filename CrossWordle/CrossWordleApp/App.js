import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

// Import navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator} from "@react-navigation/stack";
// Import NetInfo (NetInfo has event listenter)
import NetInfo from '@react-native-community/netinfo';

// Import screens
import SplashScreen from "./src/screens/splash";
import WelcomeScreen from "./src/screens/welcome";
import LoginScreen from "./src/screens/login";
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

  useEffect(() => {
    processLoading();
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

        <Stack.Screen name = "Login" component = {LoginScreen}
                      options = {{headerShown: false}}
        />

        <Stack.Screen name = "OfflineGame" component = {OfflineGameScreen}
                      options = {{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};



