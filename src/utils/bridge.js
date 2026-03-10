import { Capacitor } from '@capacitor/core';

// This is a bridge pattern to abstract native functionality
// In a real app, you might write a custom Capacitor plugin "HealthPlugin"
// For now, we mock the interface

export const Bridge = {
    getHeartRate: async () => {
        if (Capacitor.isNativePlatform()) {
            // Call native plugin
            // const result = await Capacitor.Plugins.HealthPlugin.getHeartRate();
            // return result.value;
            console.log("Calling Native Health Plugin...");
            return Math.floor(60 + Math.random() * 40); // Mock native return
        } else {
            // Browser mock
            return Math.floor(60 + Math.random() * 40);
        }
    },

    vibrate: async (duration = 500) => {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    },

    getDeviceInfo: async () => {
        // Example of using a standard plugin if installed
        // const info = await Device.getInfo();
        return {
            platform: Capacitor.getPlatform(),
            isNative: Capacitor.isNativePlatform()
        };
    }
};
