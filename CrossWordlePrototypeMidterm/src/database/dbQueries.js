// databaseFunctions.js
import { db } from "./database";

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

export { getScore, updateScore };
