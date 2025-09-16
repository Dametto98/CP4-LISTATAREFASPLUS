import React from 'react'
import { TouchableOpacity,Text,StyleSheet } from 'react-native'
import { useTheme } from '../context/ThemeContext'
import { useTranslation } from 'react-i18next';

export default function ThemeToggleButton() {
    const{toggleTheme,colors} = useTheme()
    const { t, i18n } = useTranslation();

    return (
        <TouchableOpacity 
            style={[styles.button,{backgroundColor:colors.button}]}
            onPress={toggleTheme}
        >
            <Text style={[styles.text,{color:colors.buttonText}]}>{t('switchTheme')}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button:{
        paddingVertical:12,
        paddingHorizontal:24,
        borderRadius:8,
        marginTop:20
    },
    text:{
        fontSize:16,
        fontWeight:'bold'
    }
})