const VARIANTS = {
  development: {
    name: "Juno Dev",
    bundleId: {
      ios: "com.vodno.juno.dev",
      android: "com.vodno.juno.dev",
    },
    environment: "development",
  },
  staging: {
    name: "Juno Staging",
    bundleId: {
      ios: "com.vodno.juno.staging",
      android: "com.vodno.juno.staging",
    },
    environment: "staging",
  },
  production: {
    name: "Juno",
    bundleId: {
      ios: "com.vodno.juno",
      android: "com.vodno.juno",
    },
    environment: "production",
  },
};

// Get the variant from environment variable or default to production
const getVariant = () => {
  const variantName = process.env.APP_VARIANT || "production";
  const selectedVariant = VARIANTS[variantName] || VARIANTS.production;

  // console.log(`
  //   === BUILDING APP VARIANT ===
  //   Variant: ${variantName}
  //   App Name: ${selectedVariant.name}
  //   Bundle ID (iOS): ${selectedVariant.bundleId.ios}
  //   Bundle ID (Android): ${selectedVariant.bundleId.android}
  //   Environment: ${selectedVariant.environment}
  //   ========================`);

  return selectedVariant;
};

const variant = getVariant();

module.exports = {
  expo: {
    name: variant.name,
    slug: variant.name,
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "juno",
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
      infoPlist: {
        CFBundleDisplayName: variant.name,
      },
    },
    android: {
      package: variant.bundleId.android,
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#ffffff",
      },
      androidStatusBar: {
        translucent: false,
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/icon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/icon.png",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#232323",
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
    },
  },
};
