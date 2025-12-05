// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/9.24.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.24.0/firebase-messaging-compat.js');

/**
 * Firebase Service Worker for handling background notifications
 * This worker enables receiving notifications even when the app is not open
 */

// Handle background notifications
firebase.messaging().onBackgroundMessage(function(payload) {
    console.log('Background message received:', payload);

    const notificationTitle = payload.notification?.title || 'Notification';
    const notificationOptions = {
        body: payload.notification?.body || '',
        icon: payload.notification?.icon || '/icons/notification-icon.png',
        badge: '/icons/badge-icon.png',
        image: payload.notification?.imageUrl,
        tag: 'triskeloum-notification',
        requireInteraction: false,
        data: payload.data
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
    console.log('Notification clicked:', event.notification);
    
    event.notification.close();

    // Extract deep link from notification data
    const deeplink = event.notification.data?.deeplink || '/';
    const urlToOpen = new URL(deeplink, self.location.origin).href;

    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        })
        .then(function(clientList) {
            // Check if app is already open (by checking if URL contains the same origin)
            for (let client of clientList) {
                if (new URL(client.url).origin === new URL(urlToOpen).origin && 'focus' in client) {
                    // App is open, focus it and navigate to the deeplink
                    client.focus();
                    client.postMessage({
                        type: 'NAVIGATE_TO_DEEPLINK',
                        deeplink: deeplink
                    });
                    return;
                }
            }
            // If not open, open it with the deeplink
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

// Handle notification dismissal
self.addEventListener('notificationclose', function(event) {
    console.log('Notification closed:', event.notification);
});