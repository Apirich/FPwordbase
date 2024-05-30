import { render, fireEvent } from "@testing-library/react-native";

import WelcomeScreen from "../src/screens/welcome";


// INTEGRATION Test WelcomeScreen rendering
describe("WelcomeScreen", () => {
    it("should render and navigate correctly when there is an internet connection", () => {
        const navigation = {
            navigate: jest.fn()
        };

        const route = {params: {internetChecking: true}};

        const {getByTestId, getByText} = render(<WelcomeScreen navigation = {navigation}
                                                                      route = {route}
                                                        />);

        // CrossWordle text
        expect(getByText("CrossWordle")).toBeTruthy();
        // "Online Mode"
        expect(getByText("Online Mode")).toBeTruthy();
        // "Offline Mode"
        expect(getByText("Offline Mode")).toBeTruthy();

        // "Online Mode" button press
        fireEvent.press(getByTestId("onlineButton"));
        expect(navigation.navigate).toHaveBeenCalledWith("OnlineMode");

        // "Offline Mode" button press
        fireEvent.press(getByTestId("offlineButton"));
        expect(navigation.navigate).toHaveBeenCalledWith("OfflineGame");

        // "info" button press
        fireEvent.press(getByTestId("infoButton"));
        expect(getByText("Instruction")).toBeTruthy();
    });

    it("should render and navigate correctly when there is no internet connection", () => {
        const navigation = {
            navigate: jest.fn()
        };

        const route = {params: {internetChecking: false}};

        const {getByTestId, getByText} = render(<WelcomeScreen navigation = {navigation}
                                                                      route = {route}
                                                        />);

        // CrossWordle text
        expect(getByText("CrossWordle")).toBeTruthy();
        // "Online Mode"
        expect(getByText("Online Mode")).toBeTruthy();
        // "Offline Mode"
        expect(getByText("Offline Mode")).toBeTruthy();

        // "Online Mode" button disable
        expect(getByTestId("onlineButton").props.accessibilityState.disabled).toBe(true);

        // "Offline Mode" button press
        fireEvent.press(getByTestId("offlineButton"));
        expect(navigation.navigate).toHaveBeenCalledWith("OfflineGame");

        // "info" button press
        fireEvent.press(getByTestId("infoButton"));
        expect(getByText("How to Play")).toBeTruthy();
    });
});
