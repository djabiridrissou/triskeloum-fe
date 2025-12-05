import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoadUserQuery } from '../services/api';
import { firebaseNotificationService } from '../services/firebase.service';
import logger from '../services/logger';

/**
 * Firebase Notification Provider
 * This component initializes Firebase Cloud Messaging and requests notification permissions
 * Should be placed at the root level of your app
 */
export default function FirebaseNotificationProvider() {
    const navigate = useNavigate();
    const { data: userResponse } = useLoadUserQuery({});
    const user = userResponse?.payload;

    useEffect(() => {
        if (!user?.id) return;

        const initializeNotifications = async () => {
            try {
                // Check if notifications are supported
                if (!firebaseNotificationService.isSupported()) {
                    logger.warn('Firebase notifications not supported');
                    return;
                }

                // Check permission status
                const permission = firebaseNotificationService.getPermissionStatus();
                
                if (permission === 'default') {
                    // Request permission
                    const token = await firebaseNotificationService.registerForNotifications();
                    if (token) {
                        logger.info('Notifications registered successfully');
                    }
                } else if (permission === 'denied') {
                    logger.info('User denied notification permission');
                }
                // If 'granted', token is already being registered
            } catch (error) {
                logger.error('Error initializing Firebase notifications:', error);
            }
        };

        // Initialize notifications on user login
        initializeNotifications();

        // Listen for notification events
        const handleNotification = (event: any) => {
            logger.info('Notification received:', event.detail);
        };
        
        const handleNotificationDeelink = (event: any) => {
            logger.info('Navigating from notification deeplink:', event.detail.deeplink);
            navigate(event.detail.deeplink);
        };
        
        window.addEventListener('notification:received', handleNotification);
        window.addEventListener('notification:deeplink', handleNotificationDeelink);

        return () => {
            window.removeEventListener('notification:received', handleNotification);
            window.removeEventListener('notification:deeplink', handleNotificationDeelink);
        };
    }, [user?.id, navigate]);

    // Listen for Service Worker postMessage (navigation from notification click)
    useEffect(() => {
        const handleServiceWorkerMessage = (event: MessageEvent) => {
            if (event.data?.type === 'NAVIGATE_TO_DEEPLINK') {
                const deeplink = event.data.deeplink;
                logger.info('Navigating to deeplink from notification:', deeplink);
                navigate(deeplink);
            }
        };

        navigator.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);

        return () => {
            navigator.serviceWorker?.removeEventListener('message', handleServiceWorkerMessage);
        };
    }, [navigate]);

    // This component doesn't render anything
    return null;
}