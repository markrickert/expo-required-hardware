import { type AndroidConfig, type ConfigPlugin, type IOSConfig } from "expo/config-plugins";
import { validAndroidFeatures } from "./valid-features/android";
import { validIOSFeatures } from "./valid-features/ios";
export type HardwareFeatureAndroid = (typeof validAndroidFeatures)[number];
export type HardwareFeatureIOS = (typeof validIOSFeatures)[number];
export type RequiredHardwareProps = {
    ios?: HardwareFeatureIOS[];
    android?: HardwareFeatureAndroid[];
};
declare const withRequiredHardware: ConfigPlugin<RequiredHardwareProps | void>;
export declare function addHardwareFeaturesToAndroidManifest(androidManifest: AndroidConfig.Manifest.AndroidManifest, requiredFeatures: readonly string[]): AndroidConfig.Manifest.AndroidManifest;
export declare function addRequiredDeviceCapabilitiesToInfoPlist(infoPlist: IOSConfig.InfoPlist, requiredFeatures: readonly string[]): IOSConfig.InfoPlist;
export default withRequiredHardware;
