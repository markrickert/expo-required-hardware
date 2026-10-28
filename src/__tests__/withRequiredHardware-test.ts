import type { AndroidConfig, ExpoConfig } from "expo/config-plugins";

import withRequiredHardware, {
  addHardwareFeaturesToAndroidManifest,
  addRequiredDeviceCapabilitiesToInfoPlist,
} from "../withRequiredHardware";

function createManifest(
  usesFeature?: AndroidConfig.Manifest.ManifestUsesFeature[],
): AndroidConfig.Manifest.AndroidManifest {
  return {
    manifest: {
      $: { "xmlns:android": "http://schemas.android.com/apk/res/android" },
      ...(usesFeature ? { "uses-feature": usesFeature } : {}),
    },
  };
}

describe(addHardwareFeaturesToAndroidManifest, () => {
  it("adds required uses-feature entries", () => {
    const manifest = addHardwareFeaturesToAndroidManifest(createManifest(), [
      "android.hardware.nfc",
      "android.hardware.sensor.gyroscope",
    ]);
    expect(manifest.manifest["uses-feature"]).toEqual([
      {
        $: {
          "android:name": "android.hardware.nfc",
          "android:required": "true",
        },
      },
      {
        $: {
          "android:name": "android.hardware.sensor.gyroscope",
          "android:required": "true",
        },
      },
    ]);
  });

  it("does not duplicate existing features and marks them as required", () => {
    const manifest = addHardwareFeaturesToAndroidManifest(
      createManifest([
        {
          $: {
            "android:name": "android.hardware.camera",
            "android:required": "false",
          },
        },
        {
          $: {
            "android:name": "android.hardware.wifi",
            "android:required": "false",
          },
        },
      ]),
      ["android.hardware.camera", "android.hardware.camera"],
    );
    expect(manifest.manifest["uses-feature"]).toEqual([
      {
        $: {
          "android:name": "android.hardware.camera",
          "android:required": "true",
        },
      },
      {
        $: {
          "android:name": "android.hardware.wifi",
          "android:required": "false",
        },
      },
    ]);
  });
});

describe(addRequiredDeviceCapabilitiesToInfoPlist, () => {
  it("creates the capabilities array", () => {
    expect(
      addRequiredDeviceCapabilitiesToInfoPlist({}, ["nfc", "gyroscope"]),
    ).toEqual({
      UIRequiredDeviceCapabilities: ["nfc", "gyroscope"],
    });
  });

  it("merges into an existing array without duplicates", () => {
    expect(
      addRequiredDeviceCapabilitiesToInfoPlist(
        { UIRequiredDeviceCapabilities: ["arm64"] },
        ["arm64", "nfc"],
      ),
    ).toEqual({ UIRequiredDeviceCapabilities: ["arm64", "nfc"] });
  });

  it("supports the dictionary form", () => {
    expect(
      addRequiredDeviceCapabilitiesToInfoPlist(
        { UIRequiredDeviceCapabilities: { arm64: true, nfc: false } },
        ["nfc", "gps"],
      ),
    ).toEqual({
      UIRequiredDeviceCapabilities: { arm64: true, nfc: true, gps: true },
    });
  });
});

describe(withRequiredHardware, () => {
  const baseConfig: ExpoConfig = { name: "test", slug: "test" };

  it("registers mods only for configured platforms", () => {
    const config = withRequiredHardware({ ...baseConfig }, { ios: ["nfc"] });
    expect(config.mods?.ios?.infoPlist).toBeDefined();
    expect(config.mods?.android?.manifest).toBeUndefined();
  });

  it("is a no-op without options", () => {
    expect(withRequiredHardware({ ...baseConfig }).mods).toBeUndefined();
  });

  it("throws on invalid options", () => {
    expect(() =>
      withRequiredHardware(
        { ...baseConfig },
        { android: "android.hardware.nfc" as any },
      ),
    ).toThrow(/must be an array of strings/);
  });
});
