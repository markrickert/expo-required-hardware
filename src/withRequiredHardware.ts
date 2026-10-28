import {
  type AndroidConfig,
  type ConfigPlugin,
  type IOSConfig,
  WarningAggregator,
  withAndroidManifest,
  withInfoPlist,
} from "expo/config-plugins";

import { validAndroidFeatures } from "./valid-features/android";
import { validIOSFeatures } from "./valid-features/ios";

export type HardwareFeatureAndroid = (typeof validAndroidFeatures)[number];
export type HardwareFeatureIOS = (typeof validIOSFeatures)[number];

export type RequiredHardwareProps = {
  ios?: HardwareFeatureIOS[];
  android?: HardwareFeatureAndroid[];
};

const PLUGIN_NAME = "expo-required-hardware";

const withRequiredHardware: ConfigPlugin<RequiredHardwareProps | void> = (
  config,
  props,
) => {
  const { android = [], ios = [] } = props ?? {};
  assertStringArray(android, "android");
  assertStringArray(ios, "ios");

  if (android.length) {
    config = withAndroidManifest(config, (config) => {
      warnUnknownFeatures(android, validAndroidFeatures, (message) =>
        WarningAggregator.addWarningAndroid(PLUGIN_NAME, message),
      );
      config.modResults = addHardwareFeaturesToAndroidManifest(
        config.modResults,
        android,
      );
      return config;
    });
  }

  if (ios.length) {
    config = withInfoPlist(config, (config) => {
      warnUnknownFeatures(ios, validIOSFeatures, (message) =>
        WarningAggregator.addWarningIOS(PLUGIN_NAME, message),
      );
      config.modResults = addRequiredDeviceCapabilitiesToInfoPlist(
        config.modResults,
        ios,
      );
      return config;
    });
  }

  return config;
};

function assertStringArray(
  value: unknown,
  platform: string,
): asserts value is string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(
      `${PLUGIN_NAME}: the "${platform}" option must be an array of strings, received ${JSON.stringify(value)}`,
    );
  }
}

function warnUnknownFeatures(
  features: readonly string[],
  validFeatures: readonly string[],
  warn: (message: string) => void,
) {
  for (const feature of features) {
    if (!validFeatures.includes(feature)) {
      warn(
        `"${feature}" is not a known hardware feature. It will still be added.`,
      );
    }
  }
}

// Adds `<uses-feature android:name="..." android:required="true"/>` for each feature.
export function addHardwareFeaturesToAndroidManifest(
  androidManifest: AndroidConfig.Manifest.AndroidManifest,
  requiredFeatures: readonly string[],
): AndroidConfig.Manifest.AndroidManifest {
  const usesFeature = androidManifest.manifest["uses-feature"] ?? [];

  for (const feature of requiredFeatures) {
    const existing = usesFeature.find(
      (item) => item.$?.["android:name"] === feature,
    );
    if (existing) {
      existing.$["android:required"] = "true";
    } else {
      usesFeature.push({
        $: { "android:name": feature, "android:required": "true" },
      });
    }
  }

  androidManifest.manifest["uses-feature"] = usesFeature;
  return androidManifest;
}

// UIRequiredDeviceCapabilities may be an array of capabilities or a dictionary of capability => boolean.
export function addRequiredDeviceCapabilitiesToInfoPlist(
  infoPlist: IOSConfig.InfoPlist,
  requiredFeatures: readonly string[],
): IOSConfig.InfoPlist {
  const existing = infoPlist.UIRequiredDeviceCapabilities;

  if (existing && typeof existing === "object" && !Array.isArray(existing)) {
    const capabilities = { ...(existing as Record<string, boolean>) };
    for (const feature of requiredFeatures) {
      capabilities[feature] = true;
    }
    infoPlist.UIRequiredDeviceCapabilities = capabilities;
    return infoPlist;
  }

  const capabilities = Array.isArray(existing)
    ? [...(existing as string[])]
    : [];
  for (const feature of requiredFeatures) {
    if (!capabilities.includes(feature)) {
      capabilities.push(feature);
    }
  }
  infoPlist.UIRequiredDeviceCapabilities = capabilities;
  return infoPlist;
}

export default withRequiredHardware;
