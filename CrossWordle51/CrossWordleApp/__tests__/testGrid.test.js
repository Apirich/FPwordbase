import { render, fireEvent } from "@testing-library/react-native";

import { generateGrid, generateMasterCell } from "../src/components/grid";
import DisplayGame from "../src/components/grid";


// Prevent console.error logging
beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
});


// Restore console.error
afterEach(() => {
    console.error.mockRestore();
});


// UNIT Test grid of words
describe("generateGrid", () => {
    it("should generate a grid of -1", () => {
        const crosswordsProc = [
            {direction: "A", word: "TEST", xPos: 2, yPos: 1},
            {direction: "D", word: "NICE", xPos: 1, yPos: 3},
            {direction: "D", word: "FUNNY", xPos: 3, yPos: 2},
            {direction: "A", word: "LOVE", xPos: 4, yPos: 0},
            {direction: "D", word: "KIND", xPos: 0, yPos: 4},
        ];

        const grid = generateGrid(crosswordsProc);

        // Expect nested array 10 * 10
        expect(grid.length).toBe(10);

        grid.forEach(row => {
            expect(row.length).toBe(10);
        });
    });

    it("should override grid cells for horizonal words (direction 'A')", () => {
        const crosswordsProc = [
            {direction: "A", word: "TEST", xPos: 2, yPos: 1},
            {direction: "D", word: "NICE", xPos: 1, yPos: 3},
        ];

        const grid = generateGrid(crosswordsProc);

        // Expect "" cells horizontally from [1][2] to [1][5]
        expect(grid[1][2]).toBe("");
        expect(grid[1][3]).toBe("");
        expect(grid[1][4]).toBe("");
        expect(grid[1][5]).toBe("");
    });

    it("should override grid cells for vertical words (direction 'D')", () => {
        const crosswordsProc = [
            {direction: "A", word: "TEST", xPos: 2, yPos: 1},
            {direction: "D", word: "NICE", xPos: 1, yPos: 3},
        ];

        const grid = generateGrid(crosswordsProc);

        // Expect "" cells vertically from [3][1] to [6][1]
        expect(grid[3][1]).toBe("");
        expect(grid[4][1]).toBe("");
        expect(grid[5][1]).toBe("");
        expect(grid[6][1]).toBe("");
    });
});


// UNIT Test master word
describe("generateMasterCell", () => {
    it("should generate an array of '' length of a master word", () => {
        const master = "KINDNESS";

        const masterCell = generateMasterCell(master);

        // Expect 8 "" cells for the master word
        expect(masterCell.length).toBe(8);

        masterCell.forEach(cell => {
            expect(cell).toBe("");
        });
    })
});


// INTEGRATION Test DisplayGame
describe("DisplayGame", () => {
    test("handleGridInput should correctly updates inputs", () => {
        const crosswordsProc = [
            [
                [
                    {direction: "A", word: "SMILE", xPos: 1, yPos: 0},
                    {direction: "D", word: "CUTE", xPos: 0, yPos: 3}
                ]
            ]
        ];

        const master = [["KINDNESS"]];

        // Mock component
        const {getByTestId} = render(<DisplayGame level = {1} maxLevel = {1} gamePerLevel = {1}
                                                  score = {0} computeScore = {jest.fn()}
                                                  coin = {0} computeCoin = {jest.fn()}
                                                  crosswordsProc = {crosswordsProc}
                                                  master = {master}
                                                  mode = "mode"
                                    />);

        // Mock input
        fireEvent.changeText(getByTestId("cell-0-1"), "A");

        // Undefined without using Promise
        return new Promise((resolve, reject) => {
            try{
                // Mock grid
                const newGrid = getByTestId("grid");

                // Expect the grid cell with new input value "A"
                expect(newGrid.props.children[0].props.children[1].props.value).toBe("A");

                resolve();
            }catch(error){
                reject(error);
            }
        }).catch(error => {
            console.error("Error occurred:", error);
        });
    })
});
