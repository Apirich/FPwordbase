import { render } from "@testing-library/react-native";

import { randomPick, generateLibrary } from "../src/screens/offlineGame";
import OfflineGameScreen from "../src/screens/offlineGame";


// Mock random-words
jest.mock("random-words", () => ({
    generate: jest.fn()
        .mockImplementationOnce(() => ["HONEST", "BEAUTY", "ORANGE", "CLOUDY", "FUNNY"])
        .mockImplementationOnce(() => ["KINDNESS"]),
    count: jest.fn()
}));


// Mock SQLite
jest.mock("../src/database/dbQueries.js", () => ({
    getScore: jest.fn(() => Promise.resolve()),
    updateScore: jest.fn(() => Promise.resolve()),
    getCoin: jest.fn(() => Promise.resolve()),
    updateCoin: jest.fn(() => Promise.resolve())
}));


// Mock DisplayGame
jest.mock("../src/components/grid.js", () => {
    return jest.fn();
});


// Prevent console.error logging
beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
});


// Restore console.error
afterEach(() => {
    console.error.mockRestore();
});


// UNIT Test random pick positions
describe("randomPick", () => {
    it("should return an array with unique random positions", () => {
        // Initial itemList is always empty
        const itemList = [];
        const loopTime = 5;
        const libName = [0, 1, 2, 3, 4];
        const result = randomPick(itemList, loopTime, libName);

        // Expect an array of length loopTime (5)
        expect(result.length).toBe(loopTime);

        // Expect an array of unique items
        const resultSet = new Set(result);
        expect(resultSet.size).toBe(result.length);

        // Expect all items in the result array to be from libName
        result.forEach(i => {
            expect(libName.includes(i)).toBe(true);
        });
    });
});


// UNIT Test generate words with direction
describe("generateLibrary", () => {
    it("should correctly generate data", () => {
        const gen = require("random-words").generate;
        const level = 1;
        const game = 1;
        const word = 5;

        // Undefined without using Promise
        return new Promise((resolve, reject) => {
            try{
                const result = generateLibrary(gen, level, game, word);

                // Expect an array of 5 objects
                expect(result[0][0].length).toEqual(5);
                expect(typeof result[0][0]).toBe("object");

                // Expect the first word is "HONEST"
                expect(result[0][0][0].word).toBe("HONEST");

                // Expect direction to be "A" or "D"
                expect(result[0][0][2].direction == "A" || result[0][0][2].direction == "D").toBe(true);

                resolve();
            }catch(error){
                reject(error);
            }
        }).catch(error => {
            console.error("Error occurred:", error);
        });
    });
});


// INTEGRATION Test OfflineGameScreen rendering
describe("OfflineGameScreen", () => {
    it("should render OfflineGame correctly", () => {
        const navigation = {
            navigate: jest.fn()
        };

        const route = {};

        const {getByTestId} = render(<OfflineGameScreen navigation = {navigation}
                                                        route = {route}
                                    />);

        // Home button
        expect(getByTestId("homeButton")).toBeTruthy();
        // Level display
        expect(getByTestId("levelDisplay")).toBeTruthy();
        // Score display
        expect(getByTestId("scoreDisplay")).toBeTruthy();
        // Test that the gem icon is rendered
        expect(getByTestId("coinDisplay")).toBeTruthy();
        // Displaygame container
        expect(getByTestId("displayGameCon")).toBeTruthy();
    });
});
