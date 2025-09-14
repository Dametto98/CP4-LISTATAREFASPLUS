import { Stack } from "expo-router";
import ThemeProvider from "../src/context/ThemeContext"
import i18n from "../src/services/i18n";
import { I18nextProvider } from "react-i18next";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function Layout() {

  const queryClient = new QueryClient();

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}