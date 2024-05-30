import { render, fireEvent } from "@testing-library/react-native";

import SignupScreen from "../src/screens/signup";


// Mock checkTokenExpiration, getLead
jest.mock("../src/database/fetchBackend.js", () => ({
    handleSignUp: jest.fn(() => Promise.resolve()),
}));


// UNIT & INTEGRATION Test SignupScreen rendering
describe("SignupScreen", () => {
    // UNIT test
    it("should render correctly", () => {
        const navigation = {
            navigate: jest.fn()
        };

        const route = {};

        const {getByPlaceholderText, getByText} = render(<SignupScreen navigation = {navigation}
                                                                       route = {route}
                                                        />);

        // Username input
        expect(getByPlaceholderText("Username")).toBeTruthy();
        // Email input
        expect(getByPlaceholderText("Email")).toBeTruthy();
        // Password input
        expect(getByPlaceholderText("Password")).toBeTruthy();
        // Signup text
        expect(getByText("Sign Up")).toBeTruthy();
    });

    // INTEGRATION test
    it("should navigate to 'Online Mode' screen when press back button", () => {
        const navigation = {
            navigate: jest.fn()
        };

        const route = {};

        const {getByTestId} = render(<SignupScreen navigation = {navigation}
                                                   route = {route}
                                    />);

        // Mock "Back" button press
        fireEvent.press(getByTestId("backButton"));

        expect(navigation.navigate).toHaveBeenCalledWith("OnlineMode");
    });
});
