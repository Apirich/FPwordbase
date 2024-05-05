const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");

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


// Listen for the 'connection' event
pool.on("connection", () => {
  console.log("Connected to database");
});

// Optional: Listen for the 'error' event to handle connection errors
pool.on("error", (err) => {
  console.error("Error connecting to database:", err);
});


// ---------
app.get("/", (req, res) => {
    console.log("Got a request");

    res.send(JSON.stringify({success:1}));
});

// User Sign-up Endpoint
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

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
        // Release the connection back to the pool
        connection.release();

        if(error){
          if(error.code === "ER_DUP_ENTRY"){
            return res.status(400).json({ error: "PSignup: User already exists" });
          }

          console.error("Error executing query:", error);
          return res.status(500).json({ error: "PSignup: Internal Server Error" });
        }

        res.status(201).json({ message: "PSignup: User created successfully" });
      });
    });
  });
});

// User Log-in Endpoint
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
      bcrypt.compare(password, results[0].password, (err, result) => {
        if(err || !result){
          return res.status(401).json({ error: "PLogin: Invalid password" });
        }
        res.json({ message: "PLogin: Login successful" });
      });
    });
  });
});






// app.get("/coin", (req, res) => {
//     console.log("searchResults: Got a request", req.query);

//     res.send(JSON.stringify([{lat: 33.79043, long: -117.96768, bizName: "Hair Salon", uri: "./assets/hairSalon.jpg", availableServices: ["Hair Wash", "Hair Straightening", "Hair Cut"]},
//                              {lat: 33.77351, long: -117.9712898333, bizName: "Nail Salon", uri: "./assets/nailSalon.jpg", availableServices: ["French Manicure", "Gel Manicure", "Shellac Manicure"]},
//                              {lat: 33.78625, long: -117.9580898333, bizName: "Spa Salon", uri: "./assets/spaSalon.jpg", availableServices: ["Mud Bath", "Salt Scrub", "Seaweed Body Wraps"]}
//                             ]));
// })

// app.post("/score", (req, res) => {
//     console.log("appointments: Got a request", req.body);

//     res.send(JSON.stringify([{bizName: "Hair Salon", serviceRequest: "Hair Wash", date: "2024-02-12", time: "10:00am"},
//                              {bizName: "Nail Salon", serviceRequest: "French Manicure", date: "2024-02-29", time: "05:00pm"},
//                              {bizName: "Spa Salon", serviceRequest: "Mud Bath", date: "2024-03-15", time: "02:00pm"},
//                             ]));
// })

// app.post("/coin", (req, res) => {
//     console.log("services: Got a request", req.body);

//     res.send(JSON.stringify([{customerName: "John Doe", serviceRequest: "Hair Cut", date: "2024-02-12", time: "10:00am"},
//                              {customerName: "Jane K", serviceRequest: "French Manicure", date: "2024-02-29", time: "05:00pm"},
//                              {customerName: "Sophia B", serviceRequest: "Mud Bath", date: "2024-03-15", time: "02:00pm"},
//                             ]));
// })


app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
});
