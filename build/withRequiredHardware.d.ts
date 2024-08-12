import { type ConfigPlugin, type AndroidConfig, type IOSConfig } from "@expo/config-plugins";
import { validAndroidFeatures } from "./valid-features/android";
import { validIOSFeatures } from "./valid-features/ios";
export declare type HardwareFeatureAndroid = (typeof validAndroidFeatures)[number];
export declare type HardwareFeatureIOS = (typeof validIOSFeatures)[number];
export declare const withRequiredHardware: ConfigPlugin<{
    ios: Array<HardwareFeatureIOS>;
    android: Array<HardwareFeatureAndroid>;
}>;
export declare function addHardwareFeaturesToAndroidManifestManifest(androidManifest: AndroidConfig.Manifest.AndroidManifest, requiredFeatures: Array<HardwareFeatureAndroid>): AndroidConfig.Manifest.AndroidManifest;
export declare function addRequiredDeviceCapabilitiesToInfoPlist(infoPlist: IOSConfig.InfoPlist, requiredFeatures: Array<HardwareFeatureIOS>): IOSConfig.InfoPlist;
