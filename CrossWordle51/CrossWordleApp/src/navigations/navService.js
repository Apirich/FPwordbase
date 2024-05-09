import { CommonActions } from "@react-navigation/native";

let navigator;


const setTopLevelNavigator = navRef => {
    navigator = navRef;
}


const navigate = (routeName, params) => {
    navigator.dispatch(
        CommonActions.navigate({
            name: routeName,
            params: params,
        })
    );
}


export default { setTopLevelNavigator, navigate };
