import { render } from "@testing-library/react-native";

import SplashScreen from "../src/screens/splash";


// UNIT Test SplashScreen rendering
describe("SplashScreen", () => {
    it("should render correctly when there is an internet connection", () => {
        const {getByTestId, getByText} = render(<SplashScreen internetStatus = {true}/>);

        // Logo image
        expect(getByTestId("logo")).toBeTruthy();
        // Indicator icon
        expect(getByTestId("indicator")).toBeTruthy();
        // Text upon internetStatus
        expect(() => getByText(/Your internet connection status is offline, only Offline Mode will be available!/)).toThrow();
    });

    it("should render correctly when there is no internet connection", () => {
        const {getByTestId, getByText} = render(<SplashScreen internetStatus = {false}/>);

        // Logo image
        expect(getByTestId("logo")).toBeTruthy();
        // Indicator icon
        expect(getByTestId("indicator")).toBeTruthy();
        // Text upon internetStatus
        expect(() => getByText(/Your internet connection status is offline, only Offline Mode will be available!/)).toBeTruthy();
    });
});
