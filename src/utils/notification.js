import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export const scheduleLuckyTimeNotification = async (userName) => {
    if (!Capacitor.isPluginAvailable('LocalNotifications')) {
        console.warn('Local Notifications not supported on this platform');
        return;
    }

    try {
        const permStatus = await LocalNotifications.checkPermissions();
        if (permStatus.display !== 'granted') {
            const request = await LocalNotifications.requestPermissions();
            if (request.display !== 'granted') return;
        }

        // Cancel existing to avoid spam
        await LocalNotifications.cancel({ notifications: [{ id: 1 }] });

        // Schedule for 10 seconds later (Demo purpose) or specific time
        // In production, this would be calculated based on "Saju" time
        const notifs = [
            {
                title: "🍀 행운의 시간 (Luck Surface Area)",
                body: `Partner, 지금이 행운의 표면적을 넓힐 최적의 시간입니다. 가벼운 산책을 제안합니다.`,
                id: 1,
                schedule: { at: new Date(Date.now() + 1000 * 60 * 60 * 2) }, // 2 hours later
                sound: null,
                attachments: null,
                actionTypeId: "",
                extra: null
            }
        ];

        await LocalNotifications.schedule({
            notifications: notifs
        });

        console.log('Notification scheduled');

    } catch (error) {
        console.error('Error scheduling notification', error);
    }
};
