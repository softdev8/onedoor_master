import { StyleSheet, Dimensions, Platform } from 'react-native';

const color = {
    main_color: "#1F2532",
    indicate_bg: "#975BA5",
    white: "white",
    button_color: '#2E4A6E',
    green_color: '#9FD46C',
    label_color: '#949FAB',
    label_color1: '#F59D1F',
    time_color: '#81CCB8',
    bg_color: '#181d27',
    line_color: '#2a303c'
}

const padding = 10  ;
const navbarHeight = (Platform.OS === 'ios') ? 74 : 54;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.main_color
    },
    slider: {
        marginTop: windowHeight * 0.04,
        overflow: 'visible', 
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4
    },
    avatar: {
        width: 36, 
        height: 36, 
        borderRadius: 18
    },
    backBtnPadding: {
        paddingLeft: 15, 
        paddingRight: 15, 
        paddingTop: 10, 
        paddingBottom: 10
    }
    
});

export {
    styles,
    color,
    padding,
    navbarHeight,
    windowWidth,
    windowHeight
}
