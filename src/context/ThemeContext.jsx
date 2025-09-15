import React, { createContext, useContext, useState } from "react";
import { Appearance } from "react-native";

// Criando o contexto
const ThemeContext = createContext(null);

// Hook customizado
export function useTheme() {
  return useContext(ThemeContext);
}

// Provider que envolverá a aplicação
export default function ThemeProvider({ children }) {
  // Detecta o tema do dispositivo
  const colorScheme = Appearance.getColorScheme();

  // Estado do tema
  const [theme, setTheme] = useState(colorScheme || "light");

  // Alternar tema
  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  // Paleta de cores variantes de azul + cores adicionais para cards
  const themeColors = {
    light: {
      background: "#E6F0FF",
      text: "#003366",
      button: "#3366FF",
      buttonText: "#fff",
      inputBackground: "#CCE0FF",
      border: "#99BFFF",
      // Novas cores
      cardBackground: "#cad1dd",   // cinza claro para card
      shadow: "#999999",            // sombra suave
      success: "#28A745",           // verde para check
      error: "#FF3B30",             // vermelho para delete
    },
    dark: {
      background: "#001F4D",
      text: "#CCE0FF",
      button: "#0052CC",
      buttonText: "#fff",
      inputBackground: "#003366",
      border: "#3399FF",
      // Novas cores
      cardBackground: "#3B3B3B",   // cinza escuro para card
      shadow: "#000000",            // sombra escura
      success: "#28A745",           // verde para check
      error: "#FF3B30",             // vermelho para delete
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: themeColors[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}