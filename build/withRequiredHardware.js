"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withRequiredHardware = (config, { android, ios }) => {
    // Add android required hardware
    config = (0, config_plugins_1.withAndroidManifest)(config, (config) => {
        config.modResults = addHardwareFeaturesToAndroidManifestManifest(config.modResults, android);
        return config;
    });
    // Add ios required hardware
    config = (0, config_plugins_1.withInfoPlist)(config, (config) => {
        config.modResults = addRequiredDeviceCapabilitiesToInfoPlist(config.modResults, ios);
        return config;
    });
    return config;
};
function addHardwareFeaturesToAndroidManifestManifest(androidManifest, requiredFeatures) {
    var _a;
    // Add `<uses-feature android:name="android.hardware.camera.front" android:required="true"/>` to the AndroidManifest.xml
    if (!Array.isArray(androidManifest.manifest["uses-feature"])) {
        androidManifest.manifest["uses-feature"] = [];
    }
    // Here we add the feature to the manifest:
    // loop through the array of features and add them to the manifest if they don't exist
    for (const feature of requiredFeatures) {
        if (!androidManifest.manifest["uses-feature"].find((item) => item.$["android:name"] === feature)) {
            (_a = androidManifest.manifest["uses-feature"]) === null || _a === void 0 ? void 0 : _a.push({
                $: {
                    "android:name": feature,
                    "android:required": "true",
                },
            });
        }
    }
    return androidManifest;
}
function addRequiredDeviceCapabilitiesToInfoPlist(infoPlist, requiredFeatures) {
    if (!infoPlist.UIRequiredDeviceCapabilities) {
        infoPlist.UIRequiredDeviceCapabilities = [];
    }
    const existingFeatures = infoPlist.UIRequiredDeviceCapabilities;
    for (const f of requiredFeatures) {
        if (!existingFeatures.includes(f)) {
            existingFeatures.push(f);
        }
    }
    infoPlist.UIRequiredDeviceCapabilities = existingFeatures;
    return infoPlist;
}
exports.default = withRequiredHardware;
