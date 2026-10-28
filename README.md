# expo-required-hardware

> This Expo plugin allows you to specify hardware requirements for your app. It is useful for apps that require specific hardware features to function properly like a front-facing camera, GPS, or Bluetooth.

## Overview

This plugin provides an easy interface to specify hardware requirements for your app. It does this during the expo `prebuild` phase and will modify your `AndroidManifest.xml` and `Info.plist` files to include the necessary hardware features.

Note that this config plugin may restrict the types and number of devices that your app can be installed on. For example, if you require a front-facing camera, your app will not be installable on devices that do not have a front-facing camera. This will be restricted at the appstore level due to the entries that this plugin helps specify in the `AndroidManifest.xml` and `Info.plist` files. 

---

## Install


```sh
npx expo install expo-required-hardware

# npm
npm install expo-required-hardware

# yarn
yarn add expo-required-hardware
```

## Compatibility

Tested with Expo SDK 58. Requires `expo` as a peer dependency (the plugin uses `expo/config-plugins`).

## Usage in app.json / app.config.js

Add the plugin declaration anywhere in your app's plugin array. Both `ios` and `android` are optional, so you can configure only one platform:

```jsonc
{
  "plugins": [
    [
      "expo-required-hardware",
      {
        // This app can only be installed on devices that have NFC and a gyroscope
        "ios": [
          "nfc",
          "gyroscope"
        ],
        "android": [
          "android.hardware.nfc",
          "android.hardware.sensor.gyroscope"
        ]
      }
    ],
  ]
}
```

You can find a list of all available hardware features for Android and iOS in their respective files in this repo:

- [Android Hardware Features](./src/valid-features/android.ts)
- [iOS Hardware Features](./src/valid-features/ios.ts)

Features not in these lists are still added, but `expo prebuild` will print a warning in case of a typo.

If your `Info.plist` already uses the dictionary form of `UIRequiredDeviceCapabilities`, the requested capabilities are set to `true` in that dictionary. On Android, any existing `<uses-feature>` entry for a requested feature is changed to `android:required="true"`.

## Development

```sh
yarn install
yarn lint
yarn test
yarn build # compiles src/ to build/, which is committed
```
