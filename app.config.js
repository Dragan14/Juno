const VARIANTS = {
  development: {
    name: "Juno Dev",
    bundleId: {
      ios: "com.vodno.juno.dev",
      android: "com.vodno.juno.dev",
    },
    environment: "development",
    scheme: "juno-dev",
  },
  staging: {
    name: "Juno Staging",
    bundleId: {
      ios: "com.vodno.juno.staging",
      android: "com.vodno.juno.staging",
    },
    environment: "staging",
    scheme: "juno-staging",
  },
  production: {
    name: "Juno",
    bundleId: {
      ios: "com.vodno.juno",
      android: "com.vodno.juno",
    },
    environment: "production",
    scheme: "juno",
  },
};

// Get the variant from environment variable or default to production
const getVariant = () => {
  const variantName = process.env.APP_VARIANT || "production";
  const selectedVariant = VARIANTS[variantName] || VARIANTS.production;
  return selectedVariant;
};

const variant = getVariant();

module.exports = {
  expo: {
    name: variant.name,
    slug: variant.name,
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/app-icon.png",
    scheme: variant.scheme,
    userInterfaceStyle: "automatic",
    owner: "dragan14",
    newArchEnabled: true,
    assetBundlePatterns: ["**/*"],
    ios: {
      bundleIdentifier: variant.bundleId.ios,
      supportsTablet: true,
      buildNumber: "1",
      config: {
        usesNonExemptEncryption: false,
      },
    },
    android: {
      package: variant.bundleId.android,
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/images/app-icon.png",
        backgroundColor: "#ffffff",
      },
      androidStatusBar: {
        translucent: true,
        backgroundColor: "#00000000",
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/splash-icon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          backgroundColor: "#fbfcff",
          dark: {
            image: "./assets/images/splash-icon.png",
            backgroundColor: "#1a1c1e",
          },
          imageWidth: 200,
          resizeMode: "contain",
        },
      ],
      "expo-font",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      environment: variant.environment,
      scheme: variant.scheme,
    },
  },
};
