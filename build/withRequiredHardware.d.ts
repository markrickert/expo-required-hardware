import { type ConfigPlugin } from "@expo/config-plugins";
import { validAndroidFeatures } from "./valid-features/android";
import { validIOSFeatures } from "./valid-features/ios";
export declare type HardwareFeatureAndroid = (typeof validAndroidFeatures)[number];
export declare type HardwareFeatureIOS = (typeof validIOSFeatures)[number];
declare const withRequiredHardware: ConfigPlugin<{
    ios: Array<HardwareFeatureIOS>;
    android: Array<HardwareFeatureAndroid>;
}>;
export default withRequiredHardware;
