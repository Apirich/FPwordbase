import { render } from "@testing-library/react-native";

import { procLeadData, LeadModalDisplay } from "../src/screens/onlineGame";
import OnlineGameScreen from "../src/screens/onlineGame";


// Mock random-words
jest.mock("random-words", () => ({
    generate: jest.fn()
        .mockImplementationOnce(() => ["HONEST", "BEAUTY", "ORANGE", "CLOUDY", "FUNNY"])
        .mockImplementationOnce(() => ["KINDNESS"]),
    count: jest.fn()
}));


// Mock checkTokenExpiration, getLead
jest.mock("../src/database/fetchBackend.js", () => ({
    getScoreCoin: jest.fn(() => Promise.resolve()),
    updateScore: jest.fn(() => Promise.resolve()),
    updateCoin: jest.fn(() => Promise.resolve()),
    checkTokenExpiration: jest.fn(),
    getLead: jest.fn(),
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


// INTEGRATION Test procLeadData
describe("procLeadData", () => {
    it("should correctly passing arguments to configLeadModal and configLeadData", () => {
        const mockConfigLeadModal = jest.fn();
        const mockConfigLeadData = jest.fn();
        const mockData = [
            {score: 30, username: "Api"},
            {score: 20, username: "Buddy"},
        ];

        require("../src/database/fetchBackend.js").checkTokenExpiration.mockResolvedValue();
        require("../src/database/fetchBackend.js").getLead.mockResolvedValue();

        // Undefined without using Promise
        return new Promise((resolve, reject) => {
            try{
                procLeadData(mockConfigLeadModal, mockConfigLeadData);

                // Expect configLeadModal with arguments "true"
                expect(mockConfigLeadModal).toHaveBeenCalledWith(true);

                // Expect configLeadData with arguments mockData
                expect(mockConfigLeadData).toHaveBeenCalledWith(mockData);

                resolve();
            }catch(error){
                reject(error);
            }
        }).catch(error => {
            console.error("Error occurred:", error);
        });
    });
});


// UNIT Test LeadModalDisplay rendering
describe("LeadModalDisplay", () => {
    it("should render LeadModalDisplay correctly", () => {
        const onClose = jest.fn();

        const data = [
            {score: 30, username: "Api"},
            {score: 20, username: "Buddy"},
        ];

        const visible = true;

        const {getByTestId} = render(<LeadModalDisplay onClose = {onClose}
                                                       data = {data}
                                                       visible = {visible}
                                    />);

        // Modal
        expect(getByTestId("leadModalDisplay")).toBeTruthy();
        // Close button
        expect(getByTestId("closeButton")).toBeTruthy();
        // Data view
        expect(getByTestId("dataView-0")).toBeTruthy();
        // Award icon
        expect(getByTestId("award-0")).toBeTruthy();
        // Score text
        expect(getByTestId("score-1")).toBeTruthy();
        // Username text
        expect(getByTestId("username-1")).toBeTruthy();
    });
});


// INTEGRATION Test OnlineGameScreen rendering
describe("OnlineGameScreen", () => {
    it("should render OnlineGameScreen correctly", () => {
        const navigation = {
            navigate: jest.fn()
        };

        const route = {};

        const {getByTestId} = render(<OnlineGameScreen navigation = {navigation}
                                                       route = {route}
                                    />);

        // Button container
        expect(getByTestId("buttonCon")).toBeTruthy();
        // Home button
        expect(getByTestId("homeButton")).toBeTruthy();
        // Lead button
        expect(getByTestId("leadButton")).toBeTruthy();
        // Logout button
        expect(getByTestId("logOutButton")).toBeTruthy();
        // Score level container
        expect(getByTestId("scoreLvlCon")).toBeTruthy();
        // Displaygame container
        expect(getByTestId("displayGameCon")).toBeTruthy();
    })
})
