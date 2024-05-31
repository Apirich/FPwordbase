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
  if (!token) return res.status(403).json({error: "No token provided"});

  jwt.verify(token, secretKey, (error, decoded) => {
    if(error){
      console.log("verifyToken Error: ", error);
      return res.status(401).json({error: "Failed to authenticate token"});
    }

    req.userId = decoded.id;
    next();
  });
};


// Middleware to extract userId verify JWT token
const extractUserId = (req, res, next) => {
  // Split the "Bearer" prefix
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) return res.status(403).json({error: "No token provided"});

  try{
    const decoded = jwt.decode(token);

    req.userId = decoded.id;
    next();
  }catch(error){
    console.log("extractUserId Error: ", error);
    return res.status(401).json({error: "Failed to extract userId"});
  }
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
        return res.status(500).json({error: "PSignup POOL CONNECTION: Internal Server Error"});
      }

      // Insert user into database
      connection.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hash], (error, results) => {
        if(error){
          if(error.code === "ER_DUP_ENTRY"){
            connection.rollback(() => {
              // Release the connection back to the pool
              connection.release();
              return res.status(400).json({error: "PSignup: User already exists"});
            });
          }else{
            console.error("Error executing query:", error);

            connection.rollback(() => {
              // Release the connection back to the pool
              connection.release();
              return res.status(500).json({error: "PSignup - insert user: Internal Server Error"});
            });
          }
        }else{
          // Get the ID of the logging in user
          const userId = results.insertId;

          // Insert initial score into the scores table
          connection.query("INSERT INTO scores (user_id, score) VALUES (?, ?)", [userId, score], (error) => {
            if(error){
              console.error("PSignup: Error inserting score:", error);

              connection.rollback(() => {
                // Release the connection back to the pool
                connection.release();
                return res.status(500).json({error: "PSignup - insert score: Internal Server Error"});
              });
            }else{
              // Insert initial coins into the coins table
              connection.query("INSERT INTO coins (user_id, coin) VALUES (?, ?)", [userId, coin], (error) => {
                if(error){
                  console.error("PSignup: Error inserting coins:", error);

                  connection.rollback(() => {
                    // Release the connection back to the pool
                    connection.release();
                    return res.status(500).json({error: "PSignup - insert coin: Internal Server Error"});
                  });
                }else{
                  // Commit the transaction
                  connection.commit((error) => {
                    if(error){
                      console.error("PSignup - Error committing transaction:", error);

                      connection.rollback(() => {
                        // Release the connection back to the pool
                        connection.release();
                        return res.status(500).json({error: "PSignup - committing: Internal Server Error"});
                      });
                    }else{
                      // Release the connection back to the pool
                      connection.release();
                      res.status(201).json({message: "PSignup: User created successfully"});
                    }
                  });
                }
              });
            }
          });
        }
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
    }else{
      // Retrieve user from database
      connection.query("SELECT * FROM users WHERE email = ?", [email], (error, results) => {
        // Release the connection back to the pool
        connection.release();

        if(error || results.length === 0){
          return res.status(401).json({error: "PLogin: Invalid email"});
        }
        else{
          // Compare password
          bcrypt.compare(password, results[0].password, (error, result) => {
            if(error || !result){
              return res.status(401).json({error: "PLogin: Invalid password"});
            }else{
              // Check if user is logging in
              connection.query("SELECT * FROM logins WHERE user_id = ?", [results[0].id], (error, loginResults) => {
                if(error){
                  // Release the connection back to the pool
                  connection.release();

                  console.error("PLogin: Error checking logging in:", error);
                  return res.status(500).json({error: "PLogin checking loggingin: Internal Server Error"});
                }else{
                  // User is logging in
                  if(loginResults.length > 0){
                    // Release the connection back to the pool
                    connection.release();

                    return res.json({message: "PLogin: You are currently logging in on a device"});
                  }else{
                    // Insert entry into logins table
                    connection.query("INSERT INTO logins (user_id) VALUES (?)", [results[0].id], (error, loginInsertResults) => {
                      // Release the connection back to the pool
                      connection.release();

                      if(error) {
                        console.error("PLogin: Error inserting login entry:", error);
                        return res.status(500).json({error: "PLogin inserting login entry: Internal Server Error"});
                      }else{
                        // Token expiration time
                        const expTime = "1h";

                        // Calculate the expiration timestamp
                        // Convert current time from milSecond to second, and expTime to seconds
                        const expTimestamp = Math.floor(Date.now() / 1000) + parseInt(expTime) * 3600;

                        // Generate JWT token
                        const token = jwt.sign({id: results[0].id}, secretKey, {expiresIn: expTime});

                        res.json({message: "PLogin: Login successful with token", token, expTimestamp});
                      }
                    });
                  }
                }
              });
            }
          });
        }
      });
    }
  });
});


// -------- Refresh token (after expired) --------
app.post("/refresh", extractUserId, (req, res) => {
  // Extracted userId from the middleware
  const userId = req.userId;

  console.log("Receive refresh request");

  // Token expiration time
  const expTime = "1h";

  // Calculate the expiration timestamp
  // Convert current time from milSecond to second, and expTime to seconds
  const expTimestamp = Math.floor(Date.now() / 1000) + parseInt(expTime) * 3600;

  // Generate JWT token
  const token = jwt.sign({id: userId}, secretKey, {expiresIn: expTime});

  res.json({message: "PRefresh: Successful refresh token", token, expTimestamp});
});


// -------- Delete login (expired) --------
app.delete("/expired", extractUserId, (req, res) => {
  // Extracted userId from the middleware
  const userId = req.userId;

  console.log("Receive expired request");

  // Obtain a connection from the pool
  pool.getConnection((error, connection) => {
    if(error){
      console.error("DExpired POOL CONNECTION: Error acquiring connection:", error);
      return res.status(500).json({error: "DExpired POOL CONNECTION: Internal Server Error"});
    }else{
      // Delete login from the database
      connection.query("DELETE FROM logins WHERE user_id = ?", [userId], (error, results) => {
        // Release the connection back to the pool
        connection.release();

        if(error){
          return res.status(500).json({error: "DExpired: Error deleting login"});
        }else{
          res.status(204).send();
        }
      });
    }
  });
});


// -------- Delete login (logout) --------
app.delete("/logout", verifyToken, (req, res) => {
  const userId = req.userId;

  console.log("Receive logout request");

  // Obtain a connection from the pool
  pool.getConnection((error, connection) => {
    if(error){
      console.error("DLogout POOL CONNECTION: Error acquiring connection:", error);
      return res.status(500).json({ error: "DLogout POOL CONNECTION: Internal Server Error" });
    }else{
      // Delete login from the database
      connection.query("DELETE FROM logins WHERE user_id = ?", [userId], (error, results) => {
        // Release the connection back to the pool
        connection.release();

        if(error){
          return res.status(500).json({error: "DLogout: Error deleting login"});
        }else{
          res.status(204).send();
        }
      });
    }
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
      return res.status(500).json({error: "GScore POOL CONNECTION: Internal Server Error"});
    }else{
      // Retrieve score from the database
      connection.query("SELECT score FROM scores WHERE user_id = ?", [userId], (error, results) => {
        // Release the connection back to the pool
        connection.release();

        if(error){
          return res.status(500).json({error: "GScore: Error retrieving score"});
        }else{
          if(results.length === 0){
            return res.status(404).json({error: "GScore: Score not found for this user"});
          }else{
            const score = results[0].score;
            res.json({score});
          }
        }
      });
    }
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
      return res.status(500).json({error: "GCoin POOL CONNECTION: Internal Server Error"});
    }else{
      // Retrieve coin from the database
      connection.query("SELECT coin FROM coins WHERE user_id = ?", [userId], (error, results) => {
        // Release the connection back to the pool
        connection.release();

        if(error){
          return res.status(500).json({error: "GCoin: Error retrieving coin"});
        }else{
          if(results.length === 0){
            return res.status(404).json({error: "GCoin: Coin not found for this user"});
          }else{
            const coin = results[0].coin;
            res.json({coin});
          }
        }
      });
    }
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
      return res.status(500).json({error: "PScore POOL CONNECTION: Internal Server Error"});
    }else{
      // Update score in the database
      connection.query("UPDATE scores SET score = ? WHERE user_id = ?", [score, userId], (error, results) => {
        // Release the connection back to the pool
        connection.release();

        if(error){
          return res.status(500).json({error: "PScore: Error updating score"});
        }else{
          res.status(200).json({message: "PScore: Score updated successfully"});
        }
      });
    }
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
      return res.status(500).json({error: "PCoin POOL CONNECTION: Internal Server Error"});
    }else{
      // Update coin in the database
      connection.query("UPDATE coins SET coin = ? WHERE user_id = ?", [coin, userId], (error, results) => {
        // Release the connection back to the pool
        connection.release();

        if(error){
          return res.status(500).json({error: "PCoin: Error updating coin"});
        }else{
          res.status(200).json({message: "PCoin: Coin updated successfully"});
        }
      });
    }
  });
});


// -------- Get lead users --------
app.get("/lead", verifyToken, (req, res) => {
  console.log("Receive lead request");

  // Obtain a connection from the pool
  pool.getConnection((error, connection) => {
    if(error){
      console.error("GScore POOL CONNECTION: Error acquiring connection:", error);
      return res.status(500).json({error: "GScore POOL CONNECTION: Internal Server Error"});
    }else{
      // SQL command
      const query = `SELECT scores.score, users.username
                    FROM scores
                    JOIN users ON scores.user_id = users.id
                    WHERE scores.score != 0
                    ORDER BY scores.score DESC
                    LIMIT 3;`

      // Retrieve score from the database
      connection.query(query, (error, results) => {
        // Release the connection back to the pool
        connection.release();

        if(error){
          return res.status(500).json({error: "GScore: Error retrieving lead scores"});
        }else{
          if(results.length === 0){
            return res.status(404).json({error: "GScore: Score not found for this user"});
          }else{
            const leadScores = results;
            res.json({leadScores});
          }
        }
      });
    }
  });
});


app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});



