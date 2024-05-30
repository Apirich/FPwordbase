import { getScore, getCoin } from "../src/database/dbQueries";
import { db } from "../src/database/database";


// Mock database
jest.mock("../src/database/database", () => ({
  db: {
    transaction: jest.fn()
  }
}));


// dbQueries functions
describe("dbQueries", () => {
    // Clear mock for each test
    beforeEach(() => {
        db.transaction.mockClear();
    });


    // UNIT Test getScore
    describe("getScore", () => {
        it("should return score from SQLite", () => {
            const mockScore = [{value: 90}];
            db.transaction.mockImplementation((callback) => callback({executeSql: jest.fn((_, __, cb) => cb(_, mockScore))}));

            // Undefined without using .then
            return getScore()
            .then((score) => {
                expect(score).toBe(90);
            }).catch((error) => {
                console.error("Error occurred:", error);
            });
        });

        it("should return 0 if score not found", () => {
            const mockScore = [];
            db.transaction.mockImplementation((callback) => callback({executeSql: jest.fn((_, __, cb) => cb(_, mockScore))}));

            // Undefined without using .then
            return getScore()
            .then((score) => {
                expect(score).toBe(0);
            }).catch((error) => {
                console.error("Error occurred:", error);
            });
        });
    });


    // UNIT Test getCoin
    describe("getCoin", () => {
        it("should return coin from SQLite", () => {
            const mockCoin = [{value: 30}];
            db.transaction.mockImplementation((callback) => callback({executeSql: jest.fn((_, __, cb) => cb(_, mockCoin))}));

            // Undefined without using .then
            return getCoin()
            .then((coin) => {
                expect(coin).toBe(30);
            }).catch((error) => {
                console.error("Error occurred:", error);
            });
        });

        it("should return 10 if coin not found", () => {
            const mockCoin = [];
            db.transaction.mockImplementation((callback) => callback({executeSql: jest.fn((_, __, cb) => cb(_, mockCoin))}));

            // Undefined without using .then
            return getCoin()
            .then((coin) => {
                expect(coin).toBe(10);
            }).catch((error) => {
                console.error("Error occurred:", error);
            });
        });
    });
});
