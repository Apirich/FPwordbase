const request = require("supertest");
const app = require("../app");


// Mock console.log
console.log = jest.fn();
// Mock console.error
console.error = jest.fn();


// // Mock MySQL (for UNIT Testing)
// // Mock variable mysql
// const mysql = {
//     createPool: jest.fn(() => ({
//         query: jest.fn(),
//         getConnection: jest.fn(),
//         releaseConnection: jest.fn(),
//     })),
// };

// Mock mysql2 library
// jest.mock("mysql2", () => ({
//     createPool: jest.fn(() => ({
//         query: jest.fn(),
//         getConnection: jest.fn(),
//         releaseConnection: jest.fn(),
//         on: jest.fn(),
//     })),
// }));


// INTEGRATION Test "/signup" endpoint
describe("POST /signup", () => {
    it("should create a new user account", () => {
        const newUser = {username: "ApiRich",
                         email: "apirich@apirich.com",
                         password: "testPassword",
                         score: 0,
                         coin: 0
        };

        return new Promise((resolve, reject) => {
            try{
                request(app).post("/signup").send(newUser);

                // Response status 201
                expect(response.status).toBe(201);
                // Response message
                expect(response.body).toEqual({message: "PSignup: User created successfully"});

                resolve();
            }catch(error){
                reject(error);
            }
        }).catch(error => {
            console.error("Error occurred:", error);
        });
    });
});


// INTEGRATION Test "/login" endpoint
describe("POST /login", () => {
    it("should successfully logged in", () => {
        const loginData = {email: "apirich@apirich.com",
                           password: "testPassword"
        };

        // // Mock database data (for UNIT Testing - use with mock variable mysql)
        // mysql.createPool().query((sql, params, callback) => {
        //     callback(null, [{id: 1, password: "hashedPassword"}]);
        // });

        return new Promise((resolve, reject) => {
            try{
                request(app).post("/login").send(loginData);

                // Response status 200
                expect(response.status).toBe(200);
                // Response token
                expect(response.body).toHaveProperty("token");
                // Response token expired timestamp
                expect(response.body).toHaveProperty("expTimestamp");

                resolve();
            }catch(error){
                reject(error);
            }
        }).catch(error => {
            console.error("Error occurred:", error);
        });
    });
});


// INTEGRATION Test "/logout" endpoint
describe("DELETE /logout", () => {
    it("should successfully logged out", () => {
        const userId = 1;

        return new Promise((resolve, reject) => {
            try{
                request(app).delete("/logout").set("Authorization", "Bearer validToken").send({userId});

                // MySQL connection
                expect(pool.getConnection).toHaveBeenCalledTimes(1);
                // MySQL query
                expect(pool.getConnection().query).toHaveBeenCalledTimes(1);
                // Response status 204
                expect(response.status).toBe(204);

                resolve();
            }catch(error){
                reject(error);
            }
        }).catch(error => {
            console.error("Error occurred:", error);
        });
    });
});


// INTEGRATION Test "/score" endpoint
describe("GET /score", () => {
    it("should successfully retrieve score", () => {
        const userId = 1;

        return new Promise((resolve, reject) => {
            try{
                request(app).get("/score").set("Authorization", "Bearer validToken").send({userId});

                // Response status 200
                expect(response.status).toBe(200);
                // Response score
                expect(response.body).toHaveProperty("score");

                resolve();
            }catch(error){
                reject(error);
            }
        }).catch(error => {
            console.error("Error occurred:", error);
        });
    });
});


// INTEGRATION Test "/updateCoin" endpoint
describe("POST /updateCoin", () => {
    it("should successfully update coin", () => {
        const userId = 1;
        const coin = 85;

        return new Promise((resolve, reject) => {
            try{
                request(app).post("/updateCoin").set("Authorization", "Bearer validToken").send({userId, coin});

                // Response status 200
                expect(response.status).toBe(200);
                // Response score
                expect(response.body).toHaveProperty("message", "PCoin: Coin updated successfully");

                resolve();
            }catch(error){
                reject(error);
            }
        }).catch(error => {
            console.error("Error occurred:", error);
        });
    });
});


// INTEGRATION Test "/lead" endpoint
describe("GET /lead", () => {
    it("should successfully retrieve the top three highest score users", () => {
        const top3 = [
            {score: 200, username: "ApiRich"},
            {score: 150, username: "Pokemon"},
            {score: 80, username: "Pikachu"}
        ];

        return new Promise((resolve, reject) => {
            try{
                request(app).get("/lead").set("Authorization", "Bearer validToken");

                // Response status 200
                expect(response.status).toBe(200);
                // Response score
                expect(response.body).toHaveProperty("leadScores", top3);

                resolve();
            }catch(error){
                reject(error);
            }
        }).catch(error => {
            console.error("Error occurred:", error);
        });
    });
});
