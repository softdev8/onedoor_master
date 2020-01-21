import { StyleSheet } from 'react-native';

export const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#F9F9FB',
    background2: '#21D4FD',
    text_color: '#404852',
    button_color: '#2E4A6E',
    placeholder: '#7F8592',
    title_cololr: '#1B2749',
    switch_border_color: '#E5E5E6',
    active_swtich_label_color: '#F7918D',
    text_color1: '#B4B4B4'
};

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.black
    },
    container: {
        flex: 1,
        backgroundColor: colors.background1,
        justifyContent: 'center'
    },
    gradient: {
        ...StyleSheet.absoluteFillObject
    },
    scrollview: {
        flex: 1
    },
    exampleContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    exampleContainerDark: {
        backgroundColor: colors.black
    },
    exampleContainerLight: {
        backgroundColor: 'white'
    },
    title: {
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    titleDark: {
        color: colors.black
    },
    subtitle: {
        marginTop: 10,
        color: colors.text_color,
        fontSize: 13,
        textAlign: 'center'
    },
    slider: {
        marginTop: 15,
        overflow: 'visible', 
    },
    sliderContentContainer: {
        paddingVertical: 10 // for custom animation
    },
    paginationContainer: {
        paddingVertical: 20
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 5
    }
});
