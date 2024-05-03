// databaseFunctions.js
import { db } from "./database";

// SCORES
// Function to get the current score from the database
const getScore = () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql("SELECT value FROM scores LIMIT 1", [], (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows.item(0).value);
          } else {
            resolve(0); // Return 0 if score not found
          }
        });
      },
      (error) => {
        console.log("getScore() Error: ", error);
      }
    );
  });
};

// Function to update the score in the database
const updateScore = (newScore) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql("INSERT OR REPLACE INTO scores (id, value) VALUES (1, ?)", [newScore]);
      },
      (error) => {
        console.log("updateScore() Error:", error);
      },
      () => {
        resolve(newScore);
      }
    );
  });
};


// COINS
// Function to get the current coin from the database
const getCoin = () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql("SELECT value FROM coins LIMIT 1", [], (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows.item(0).value);
          } else {
            resolve(10); // Return 10 if coins not found
          }
        });
      },
      (error) => {
        console.log("getCoin() Error: ", error);
      }
    );
  });
};

// Function to update the score in the database
const updateCoin = (newCoin) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql("INSERT OR REPLACE INTO coins (id, value) VALUES (1, ?)", [newCoin]);
      },
      (error) => {
        console.log("updateCoin() Error:", error);
      },
      () => {
        resolve(newCoin);
      }
    );
  });
};

export { getScore, updateScore, getCoin, updateCoin };
