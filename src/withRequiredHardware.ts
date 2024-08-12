import {
  type ConfigPlugin,
  withInfoPlist,
  withAndroidManifest,
  type AndroidConfig,
  type IOSConfig,
} from "@expo/config-plugins";
import { validAndroidFeatures } from "./valid-features/android";
import { validIOSFeatures } from "./valid-features/ios";

export type HardwareFeatureAndroid = (typeof validAndroidFeatures)[number];
export type HardwareFeatureIOS = (typeof validIOSFeatures)[number];

export const withRequiredHardware: ConfigPlugin<{
  ios: Array<HardwareFeatureIOS>;
  android: Array<HardwareFeatureAndroid>;
}> = (config, { android, ios }) => {
  // Add android required hardware
  config = withAndroidManifest(config, (config) => {
    config.modResults = addHardwareFeaturesToAndroidManifestManifest(config.modResults, android);
    return config;
  });

  // Add ios required hardware
  config = withInfoPlist(config, (config) => {
    config.modResults = addRequiredDeviceCapabilitiesToInfoPlist(config.modResults, ios);
    return config;
  });

  return config;
};

export function addHardwareFeaturesToAndroidManifestManifest(
  androidManifest: AndroidConfig.Manifest.AndroidManifest,
  requiredFeatures: Array<HardwareFeatureAndroid>
) {
  // Add `<uses-feature android:name="android.hardware.camera.front" android:required="true"/>` to the AndroidManifest.xml
  if (!Array.isArray(androidManifest.manifest["uses-feature"])) {
    androidManifest.manifest["uses-feature"] = [];
  }

  // Here we add the feature to the manifest:
  // loop through the array of features and add them to the manifest if they don't exist
  for (const feature of requiredFeatures) {
    if (
      !androidManifest.manifest["uses-feature"].find((item) => item.$["android:name"] === feature)
    ) {
      androidManifest.manifest["uses-feature"]?.push({
        $: {
          "android:name": feature,
          "android:required": "true",
        },
      });
    }
  }

  return androidManifest;
}

export function addRequiredDeviceCapabilitiesToInfoPlist(
  infoPlist: IOSConfig.InfoPlist,
  requiredFeatures: Array<HardwareFeatureIOS>
) {
  if (!infoPlist.UIRequiredDeviceCapabilities) {
    infoPlist.UIRequiredDeviceCapabilities = [];
  }
  const existingFeatures = infoPlist.UIRequiredDeviceCapabilities as Array<HardwareFeatureIOS>;
  for (const f of requiredFeatures) {
    if (!existingFeatures.includes(f)) {
      existingFeatures.push(f);
    }
  }

  infoPlist.UIRequiredDeviceCapabilities = existingFeatures;
  return infoPlist;
}
