import { render, fireEvent } from "@testing-library/react-native";

import LoginScreen from "../src/screens/login";


// Mock checkTokenExpiration, getLead
jest.mock("../src/database/fetchBackend.js", () => ({
    handleLogin: jest.fn(() => Promise.resolve()),
}));


// UNIT & INTEGRATION Test LoginScreen rendering
describe("LoginScreen", () => {
    // UNIT test
    it("should render correctly", () => {
        const navigation = {
            navigate: jest.fn()
        };

        const route = {};

        const {getByPlaceholderText, getByText} = render(<LoginScreen navigation = {navigation}
                                                                      route = {route}
                                                        />);

        // Email input
        expect(getByPlaceholderText("Email")).toBeTruthy();
        // Password input
        expect(getByPlaceholderText("Password")).toBeTruthy();
        // Login text
        expect(getByText("Login")).toBeTruthy();
    });

    // INTEGRATION test
    it("should navigate to 'Online Mode' screen when press back button", () => {
        const navigation = {
            navigate: jest.fn()
        };

        const route = {};

        const {getByTestId} = render(<LoginScreen navigation = {navigation}
                                                  route = {route}
                                    />);

        // Mock "Back" button press
        fireEvent.press(getByTestId("backButton"));

        // "OnlineMode" navigation
        expect(navigation.navigate).toHaveBeenCalledWith("OnlineMode");
    });
});
