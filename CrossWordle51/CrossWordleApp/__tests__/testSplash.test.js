import { render } from "@testing-library/react-native";

import SplashScreen from "../src/screens/splash";


// UNIT Test SplashScreen rendering
describe("SplashScreen", () => {
    it("should render correctly when there is an internet connection", () => {
        const {getByTestId, getByText} = render(<SplashScreen internetStatus = {true}/>);

        expect(getByTestId("logo")).toBeTruthy();
        expect(getByTestId("indicator")).toBeTruthy();

        expect(() => getByText(/Your internet connection status is offline, only Offline Mode will be available!/)).toThrow();
    });

    it("should render correctly when there is no internet connection", () => {
        const {getByTestId, getByText} = render(<SplashScreen internetStatus = {false}/>);

        expect(getByTestId("logo")).toBeTruthy();
        expect(getByTestId("indicator")).toBeTruthy();

        expect(() => getByText(/Your internet connection status is offline, only Offline Mode will be available!/)).toBeTruthy();
    });
});
