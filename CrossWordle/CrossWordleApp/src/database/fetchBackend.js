import AsyncStorage from "@react-native-async-storage/async-storage";


export const handleSignUp = ({username, email, password, navigation}) => {
    // Check if any of the input fields are empty
    if (!username || !email || !password) {
        alert("Your inputs are empty!");
        return;
    }

    fetch("http://192.168.12.205:3000/signup", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
            score: 0,
            coin: 10,
        }),
    }).then((response) => {
        console.log("fetchBackend.js - handleSignup(): response status:", response.status);

        // If successfully signeup or there is backend internal error signing up
        if(response.status == 201){
            alert("You have successfully created your account!");
            navigation.navigate("OnlineMode");
        }else{
            throw new Error(response.status);
        }
    }).catch((error) => {
        console.error("fetchBackend.js - handleSignup(): Error signing up:", error)

        if(error.message == "400"){
            alert("This account already exists!");
        }
    });
};


export const handleLogin = ({email, password, navigation}) => {
    // Check if any of the input fields are empty
    if (!email || !password) {
        alert("Your inputs are empty!");
        return;
    }

    fetch("http://192.168.12.205:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password
        }),
    }).then((response) => {
        console.log("fetchBackend.js - handleLogin(): response status:", response.status);

        // If successfully login or there is backend internal error logging in
        if(response.status == 200){
            return response.json();
        }else{
            throw new Error(response.status);
        }
    }).then((data) => {
        // Check if the message indicates the user is currently logging in on a device
        if(data.message === "PLogin: You are currently logging in on a device"){
            alert("You are currently logged in on another device!");
            return;
        }

        console.log("fetchBackend.js - handleLogin(): token:", data.token);
        // If not currently logging in on another device, proceed with storing token
        return AsyncStorage.setItem("token", data.token)
        .then(() => AsyncStorage.setItem("tokenExpTimestamp", data.expTimestamp.toString()))
        .then(() => {
            navigation.navigate("OnlineGame");
        });
    }).catch((error) => {
        console.error("fetchBackend.js - handleLogin(): Error logging in:", error)

        if(error.message == "401"){
            alert("Invalid email or password!");
        }
    });
};


export const checkTokenExpiration = (navigation, currentRouteName) => {
    return AsyncStorage.getItem("tokenExpTimestamp")
    .then((tokenExpTimestamp) => {
        if(tokenExpTimestamp && parseInt(tokenExpTimestamp) > Math.floor(Date.now() / 1000)){
            if(currentRouteName === "OnlineModeScreen"){
                navigation.navigate("OnlineGame");
            }else if(currentRouteName === "OnlineGameScreen"){
                return false;
            }
        }else{
            if(currentRouteName === "OnlineModeScreen"){
                navigation.navigate("Login");
            }else if(currentRouteName === "OnlineGameScreen"){
                return true;
            }
        }
    })
    .catch(error => {
        console.error("fetchBackend.js - checkTokenExpiration(): Error checking token expiration:", error);
    });
};


export const handleLogout = (navigation) => {
    return AsyncStorage.getItem("token")
        .then((token) => {
            if(!token){
                throw new Error("fetchBackend.js - handleLogout(): Token not found");
            }

            return fetch("http://192.168.12.205:3000/logout", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                // Check if the response is successful
                if(!response.ok){
                    throw new Error("fetchBackend.js - handleLogout(): Failed to update coin");
                }

                if(response.status === 204){
                    console.log("fetchBackend.js - handleLogout(): User deleted successfully from the backend");

                    return AsyncStorage.multiRemove(["token", "tokenExpTimestamp"])
                    .then(() => {
                        console.log("fetchBackend.js - handleLogout(): Removed token, tokenExpTimestamp");

                        if(navigation !== "nav"){
                            navigation.navigate("OnlineMode");
                        }
                    });
                }
            })
            .catch((error) => {
                console.error("fetchBackend.js - handleLogout(): Error fetching:", error);
                throw error;
            });
        })
        .catch((error) => {
            console.error("fetchBackend.js - handleLogout(): Error retrieving token from AsyncStorage:", error);
            throw error;
        });
};


export const getScoreCoin = () => {
    return AsyncStorage.getItem("token")
    .then((token) => {
        if(!token){
            throw new Error("fetchBackend.js - getScoreCoin(): Token not found");
        }

        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Authorization": `Bearer ${token}`,
        };

        // Make HTTP GET requests to fetch score and coin data
        return Promise.all([
            fetch("http://192.168.12.205:3000/score", {headers}),
            fetch("http://192.168.12.205:3000/coin", {headers}),
        ]);
    })
    .then(([scoreData, coinData]) => {
        // Check if responses are successful
        if(!scoreData.ok || !coinData.ok){
            throw new Error("fetchBackend.js - getScoreCoin(): Failed to fetch data");
        }

        // Parse response data
        return Promise.all([scoreData.json(), coinData.json()]);
    })
    .then(([scoreJS, coinJS]) => {
        return {score: scoreJS.score, coin: coinJS.coin};
    });
};


export const updateScore = (score) => {
    return AsyncStorage.getItem("token")
    .then((token) => {
        if(!token){
            throw new Error("fetchBackend.js - updateScore(): Token not found");
        }

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        };

        // Make HTTP POST request to update score
        return fetch("http://192.168.12.205:3000/updateScore", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({score}),
        });
    })
    .then((response) => {
        // Check if the response is successful
        if(!response.ok){
            throw new Error("fetchBackend.js - updateScore(): Failed to update score");
        }

        // Return a success message
        return {success: true};
    });
};


export const updateCoin = (coin) => {
    return AsyncStorage.getItem("token")
    .then((token) => {
        if(!token){
            throw new Error("fetchBackend.js - updateCoin(): Token not found");
        }

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        };

        // Make HTTP POST request to update score
        return fetch("http://192.168.12.205:3000/updateCoin", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({coin}),
        });
    })
    .then((response) => {
        // Check if the response is successful
        if(!response.ok){
            throw new Error("fetchBackend.js - updateCoin(): Failed to update coin");
        }

        // Return a success message
        return {success: true};
    });
};


// // Function to reset AsyncStorage
// export const resetAsyncStorage = () => {
//     return AsyncStorage.clear()
//     .then(() => {
//         console.log("AsyncStorage cleared successfully.");
//     })
//     .catch((error) => {
//         console.error("Error clearing AsyncStorage:", error);
//     });
// };
