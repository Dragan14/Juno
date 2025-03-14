import Constants from "expo-constants";
import { create } from "zustand";

export type AppEnvironment = "development" | "staging" | "production";

export interface AppConfig {
  environment: AppEnvironment;
  isProduction: boolean;
  isDevelopment: boolean;
  isStaging: boolean;
}

// Get configuration from Constants.expoConfig.extra
const getConfig = (): AppConfig => {
  const extra = Constants.expoConfig?.extra || {};
  const environment = (extra.environment as AppEnvironment) || "production";

  return {
    environment,
    isProduction: environment === "production",
    isDevelopment: environment === "development",
    isStaging: environment === "staging",
  };
};

// Create a store for app configuration
interface ConfigState {
  config: AppConfig;
}

export const useConfigStore = create<ConfigState>(() => ({
  config: getConfig(),
}));

// Helper hooks to access config values
export const useEnvironment = () =>
  useConfigStore((state) => state.config.environment);
export const useIsProduction = () =>
  useConfigStore((state) => state.config.isProduction);
export const useIsDevelopment = () =>
  useConfigStore((state) => state.config.isDevelopment);
export const useIsStaging = () =>
  useConfigStore((state) => state.config.isStaging);
