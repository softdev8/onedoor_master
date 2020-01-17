/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './src/source/ForgotPassword';
import App from './App';
import {name as appName} from './app.json';
console.disableYellowBox = true
AppRegistry.registerComponent(appName, () => App);
