const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateSecretKey = () => {
  return crypto.randomBytes(64).toString("hex");
};

const secretKey = generateSecretKey();
console.log("Generated Secret Key:", secretKey);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// MySQL pool connection
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "323603",
  database: "crosswordledb",
  connectionLimit: 100
});


// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  // Split the "Bearer" prefix
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) return res.status(403).json({ error: "No token provided" });

  jwt.verify(token, secretKey, (error, decoded) => {
    if(error){
      console.log("verifyToken Error: ", error);
      return res.status(401).json({ error: "Failed to authenticate token" });
    }

    req.userId = decoded.id;
    next();
  });
};

// // TEST Attempt to acquire a connection from the pool
// pool.getConnection((err, connection) => {
//   if(err){
//     console.error("Error connecting to database:", err);
//     return;
//   }
//   console.log("Connected to database");
//   // Release the connection when done with it
//   connection.release();
// });


// Listen for the "error" event to handle connection errors
pool.on("error", (err) => {
  console.error("Error connecting to database:", err);
});


// -------- ENDPOINTS --------
// -------- Get / --------
app.get("/", (req, res) => {
    console.log("Got a request");

    res.send(JSON.stringify({success:1}));
});


// -------- Post Signup --------
app.post("/signup", (req, res) => {
  const { username, email, password, score, coin } = req.body;

  console.log("Receive signup request");

  // Hash password
  bcrypt.hash(password, 10, (error, hash) => {
    // Obtain a connection from the pool
    pool.getConnection((error, connection) => {
      if(error){
        console.error("PSignup POOL CONNECTION Error acquiring connection:", error);
        return res.status(500).json({ error: "PSignup POOL CONNECTION: Internal Server Error" });
      }

      // Insert user into database
      connection.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hash], (error, results) => {
        if(error){
          if(error.code === "ER_DUP_ENTRY"){
            connection.rollback(() => {
              // Release the connection back to the pool
              connection.release();
              return res.status(400).json({ error: "PSignup: User already exists" });
            });
          }else{
            console.error("Error executing query:", error);

            connection.rollback(() => {
              // Release the connection back to the pool
              connection.release();
              return res.status(500).json({ error: "PSignup - insert user: Internal Server Error" });
            });
          }
        }

        // Get the ID of the logging in user
        const userId = results.insertId;

        // Insert initial score into the scores table
        connection.query("INSERT INTO scores (user_id, score) VALUES (?, ?)", [userId, score], (error) => {
          if(error){
            console.error("PSignup: Error inserting score:", error);

            connection.rollback(() => {
              // Release the connection back to the pool
              connection.release();
              return res.status(500).json({ error: "PSignup - insert score: Internal Server Error" });
            });
          }

          // Insert initial coins into the coins table
          connection.query("INSERT INTO coins (user_id, coin) VALUES (?, ?)", [userId, coin], (error) => {
            if(error){
              console.error("PSignup: Error inserting coins:", error);

              connection.rollback(() => {
                // Release the connection back to the pool
                connection.release();
                return res.status(500).json({ error: "PSignup - insert coin: Internal Server Error" });
              });
            }

            // Commit the transaction
            connection.commit((error) => {
              if(error){
                console.error("PSignup - Error committing transaction:", error);

                connection.rollback(() => {
                  // Release the connection back to the pool
                  connection.release();
                  return res.status(500).json({ error: "PSignup - committing: Internal Server Error" });
                });
              }

              // Release the connection back to the pool
              connection.release();

              res.status(201).json({ message: "PSignup: User created successfully" });
            });
          });
        });
      });
    });
  });
});


// -------- Post login --------
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  console.log("Receive login request");

  // Obtain a connection from the pool
  pool.getConnection((error, connection) => {
    if(error){
      console.error("PLogin POOL CONNECTION Error acquiring connection:", error);
      return res.status(500).json({ error: "PLogin POOL CONNECTION: Internal Server Error" });
    }

    // Retrieve user from database
    connection.query("SELECT * FROM users WHERE email = ?", [email], (error, results) => {
      // Release the connection back to the pool
      connection.release();

      if(error || results.length === 0){
        return res.status(401).json({ error: "PLogin: Invalid email" });
      }

      // Compare password
      bcrypt.compare(password, results[0].password, (error, result) => {
        if(error || !result){
          return res.status(401).json({ error: "PLogin: Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: results[0].id }, secretKey, { expiresIn: "1h" });
        res.json({ message: "PLogin: Login successful with token", token });
      });
    });
  });
});


// -------- Get score --------
app.get("/score", verifyToken, (req, res) => {
  const userId = req.userId;

  console.log("Receive getScore request");

  // Obtain a connection from the pool
  pool.getConnection((error, connection) => {
    if(error){
      console.error("GScore POOL CONNECTION: Error acquiring connection:", error);
      return res.status(500).json({ error: "GScore POOL CONNECTION: Internal Server Error" });
    }

    // Retrieve score from the database
    connection.query("SELECT score FROM scores WHERE user_id = ?", [userId], (error, results) => {
      // Release the connection back to the pool
      connection.release();

      if(error){
        return res.status(500).json({ error: "GScore: Error retrieving score" });
      }

      if(results.length === 0){
        return res.status(404).json({ error: "GScore: Score not found for this user" });
      }

      const score = results[0].score;
      res.json({score});
    });
  });
});


// -------- Get coin --------
app.get("/coin", verifyToken, (req, res) => {
  const userId = req.userId;

  console.log("Receive getCoin request");

  // Obtain a connection from the pool
  pool.getConnection((error, connection) => {
    if(error){
      console.error("GCoin POOL CONNECTION: Error acquiring connection:", error);
      return res.status(500).json({ error: "GCoin POOL CONNECTION: Internal Server Error" });
    }

    // Retrieve coin from the database
    connection.query("SELECT coin FROM coins WHERE user_id = ?", [userId], (error, results) => {
      // Release the connection back to the pool
      connection.release();

      if(error){
        return res.status(500).json({ error: "GCoin: Error retrieving coin" });
      }

      if(results.length === 0){
        return res.status(404).json({ error: "GCoin: Coin not found for this user" });
      }

      const coin = results[0].coin;
      res.json({coin});
    });
  });
});


// -------- Update score --------
app.post("/updateScore", verifyToken, (req, res) => {
  const userId = req.userId;
  const {score} = req.body;

  console.log("Receive updateScore request");

  // Obtain a connection from the pool
  pool.getConnection((error, connection) => {
    if(error){
      return res.status(500).json({ error: "PScore POOL CONNECTION: Internal Server Error" });
    }

    // Update score in the database
    connection.query("UPDATE scores SET score = ? WHERE user_id = ?", [score, userId], (error, results) => {
      // Release the connection back to the pool
      connection.release();

      if(error){
        return res.status(500).json({ error: "PScore: Error updating score" });
      }

      res.status(200).json({ message: "PScore: Score updated successfully" });
    });
  });
});

// -------- Update coin --------
app.post("/updateCoin", verifyToken, (req, res) => {
  const userId = req.userId;
  const {coin} = req.body;

  console.log("Receive updateCoin request");

  // Obtain a connection from the pool
  pool.getConnection((error, connection) => {
    if(error){
      return res.status(500).json({ error: "PCoin POOL CONNECTION: Internal Server Error" });
    }

    // Update coin in the database
    connection.query("UPDATE coins SET coin = ? WHERE user_id = ?", [coin, userId], (error, results) => {
      // Release the connection back to the pool
      connection.release();

      if(error){
        return res.status(500).json({ error: "PCoin: Error updating coin" });
      }

      res.status(200).json({ message: "PCoin: Coin updated successfully" });
    });
  });
});


app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
});
