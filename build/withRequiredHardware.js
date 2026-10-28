"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addHardwareFeaturesToAndroidManifest = addHardwareFeaturesToAndroidManifest;
exports.addRequiredDeviceCapabilitiesToInfoPlist = addRequiredDeviceCapabilitiesToInfoPlist;
const config_plugins_1 = require("expo/config-plugins");
const android_1 = require("./valid-features/android");
const ios_1 = require("./valid-features/ios");
const PLUGIN_NAME = "expo-required-hardware";
const withRequiredHardware = (config, props) => {
    const { android = [], ios = [] } = props ?? {};
    assertStringArray(android, "android");
    assertStringArray(ios, "ios");
    if (android.length) {
        config = (0, config_plugins_1.withAndroidManifest)(config, (config) => {
            warnUnknownFeatures(android, android_1.validAndroidFeatures, (message) => config_plugins_1.WarningAggregator.addWarningAndroid(PLUGIN_NAME, message));
            config.modResults = addHardwareFeaturesToAndroidManifest(config.modResults, android);
            return config;
        });
    }
    if (ios.length) {
        config = (0, config_plugins_1.withInfoPlist)(config, (config) => {
            warnUnknownFeatures(ios, ios_1.validIOSFeatures, (message) => config_plugins_1.WarningAggregator.addWarningIOS(PLUGIN_NAME, message));
            config.modResults = addRequiredDeviceCapabilitiesToInfoPlist(config.modResults, ios);
            return config;
        });
    }
    return config;
};
function assertStringArray(value, platform) {
    if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
        throw new Error(`${PLUGIN_NAME}: the "${platform}" option must be an array of strings, received ${JSON.stringify(value)}`);
    }
}
function warnUnknownFeatures(features, validFeatures, warn) {
    for (const feature of features) {
        if (!validFeatures.includes(feature)) {
            warn(`"${feature}" is not a known hardware feature. It will still be added.`);
        }
    }
}
// Adds `<uses-feature android:name="..." android:required="true"/>` for each feature.
function addHardwareFeaturesToAndroidManifest(androidManifest, requiredFeatures) {
    const usesFeature = androidManifest.manifest["uses-feature"] ?? [];
    for (const feature of requiredFeatures) {
        const existing = usesFeature.find((item) => item.$?.["android:name"] === feature);
        if (existing) {
            existing.$["android:required"] = "true";
        }
        else {
            usesFeature.push({
                $: { "android:name": feature, "android:required": "true" },
            });
        }
    }
    androidManifest.manifest["uses-feature"] = usesFeature;
    return androidManifest;
}
// UIRequiredDeviceCapabilities may be an array of capabilities or a dictionary of capability => boolean.
function addRequiredDeviceCapabilitiesToInfoPlist(infoPlist, requiredFeatures) {
    const existing = infoPlist.UIRequiredDeviceCapabilities;
    if (existing && typeof existing === "object" && !Array.isArray(existing)) {
        const capabilities = { ...existing };
        for (const feature of requiredFeatures) {
            capabilities[feature] = true;
        }
        infoPlist.UIRequiredDeviceCapabilities = capabilities;
        return infoPlist;
    }
    const capabilities = Array.isArray(existing)
        ? [...existing]
        : [];
    for (const feature of requiredFeatures) {
        if (!capabilities.includes(feature)) {
            capabilities.push(feature);
        }
    }
    infoPlist.UIRequiredDeviceCapabilities = capabilities;
    return infoPlist;
}
exports.default = withRequiredHardware;
