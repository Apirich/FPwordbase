import * as fetchBackend from "../src/database/fetchBackend";
import NavigationService from "../src/navigations/navService"
import AsyncStorage from "@react-native-async-storage/async-storage";


// Mock alert
global.alert = jest.fn();


// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    multiRemove: jest.fn(),
}));


// Mock NavigationService
jest.mock("../src/navigations/navService.js", () => ({
    navigate: jest.fn(),
}));


// Prevent console.error logging
beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
});


// Restore console.error
afterEach(() => {
    console.error.mockRestore();
});


// INTEGRATION Test handleSignUp
describe("handleSignUp", () => {
    it("should correctly navigate to 'OnlineMode' if successfully signed up", () => {
        globalThis.fetch = jest.fn(() => Promise.resolve({status: 201}));

        // Undefined without using Promise
        return new Promise((resolve, reject) => {
            try{
                fetchBackend.handleSignUp({username: "ApiRich",
                                            email: "apirich@apirich.com",
                                            password: "testPassword",
                });

                // "OnlineMode" navigation
                expect(NavigationService.navigate).toHaveBeenCalledWith("OnlineMode");

                resolve();
            }catch(error){
                reject(error);
            }
        }).catch(error => {
            console.error("Error occurred:", error);
        });
    });

    it("should not navigate, and alert if username or email is already registered with CrossWordle", () => {
        globalThis.fetch = jest.fn(() => Promise.resolve({status: 400}));

        // Undefined without using Promise
        return new Promise((resolve, reject) => {
            try{
                fetchBackend.handleSignUp({username: "ApiRich",
                                            email: "apirich@apirich.com",
                                            password: "testPassword",
                });

                // No navigation
                expect(NavigationService.navigate).not.toHaveBeenCalled();
                // Alert
                expect(alert).toHaveBeenCalledWith("This username or email are already registered with CrossWordle!");

                resolve();
            }catch(error){
                reject(error);
            }
        }).catch(error => {
            console.error("Error occurred:", error);
        });
    });
});


// INTEGRATION Test handleLogin
describe("handleLogin", () => {
    it("should alert empty input", () => {
        // Undefined without using Promise
        return new Promise((resolve, reject) => {
            try{
                fetchBackend.handleLogin({email: "",
                                          password: "",
                });

                // Alert
                expect(alert).toHaveBeenCalledWith("Your inputs are empty");

                resolve();
            }catch(error){
                reject(error);
            }
        }).catch(error => {
            console.error("Error occurred:", error);
        });
    });

    it("should correctly navigate to 'OnlineGame' if successfully logged in", () => {
        globalThis.fetch = jest.fn(() => Promise.resolve({status: 200, json: () => ({token: "mockToken", expTimestamp: 123})}));

        // Undefined without using Promise
        return new Promise((resolve, reject) => {
            try{
                fetchBackend.handleLogin({email: "apirich@apirich.com",
                                          password: "testPassword",
                });

                // Store token and tokenExpTimestamp in AsyncStorage
                expect(AsyncStorage.setItem).toHaveBeenCalledWith("token", "mockToken");
                expect(AsyncStorage.setItem).toHaveBeenCalledWith("tokenExpTimestamp", "123");

                // "OnlineGame" navigation
                expect(NavigationService.navigate).toHaveBeenCalledWith("OnlineGame");

                resolve();
            }catch(error){
                reject(error);
            }
        }).catch(error => {
            console.error("Error occurred:", error);
        });
    });

    it("should not navigate and alert if invalid email or password", () => {
        globalThis.fetch = jest.fn(() => Promise.resolve({status: 401}));

        // Undefined without using Promise
        return new Promise((resolve, reject) => {
            try{
                fetchBackend.handleLogin({email: "apirich@apirich.com",
                                           password: "testPassword",
                });

                // No navigation
                expect(NavigationService.navigate).not.toHaveBeenCalled();
                // Alert
                expect(alert).toHaveBeenCalledWith("Invalid email or password!");

                resolve();
            }catch(error){
                reject(error);
            }
        }).catch(error => {
            console.error("Error occurred:", error);
        });
    });

    it("should not navigate and alert if logging in on a device", () => {
        globalThis.fetch = jest.fn(() => Promise.resolve({status: 200, json: () => ({ message: "PLogin: You are currently logging in on a device"})}));

        // Undefined without using Promise
        return new Promise((resolve, reject) => {
            try{
                fetchBackend.handleLogin({email: "apirich@apirich.com",
                                           password: "testPassword",
                });

                // No navigation
                expect(NavigationService.navigate).not.toHaveBeenCalled();
                // Alert
                expect(alert).toHaveBeenCalledWith("Your CrossWordle account is currently logged in on another device!");
                
                resolve();
            }catch(error){
                reject(error);
            }
        }).catch(error => {
            console.error("Error occurred:", error);
        });
    });
});


