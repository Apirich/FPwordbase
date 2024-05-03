import { openDatabase } from "expo-sqlite";

const db = openDatabase("wordGame.db");

// Create a table to store the score if it doesn't exist
db.transaction((tx) => {
  tx.executeSql(
    "CREATE TABLE IF NOT EXISTS scores (id INTEGER PRIMARY KEY AUTOINCREMENT, value INTEGER)"
  );
});


// db.transaction((tx) => {
//   // Drop the scores table (if it exists)
//   tx.executeSql('DROP TABLE IF EXISTS scores', [], (_, { rowsAffected }) => {
//     console.log('Scores table dropped');
//   });

//   // Recreate the scores table
//   tx.executeSql(
//     'CREATE TABLE IF NOT EXISTS scores (id INTEGER PRIMARY KEY AUTOINCREMENT, value INTEGER)',
//     [],
//     (_, { rowsAffected }) => {
//       console.log('Scores table created');
//     }
//   );
// });

export { db };
