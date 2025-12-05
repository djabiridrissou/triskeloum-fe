/**
 * Simple logger service for frontend
 */
class Logger {
    private isDev = import.meta.env.DEV;

    info(message: string, data?: any): void {
        if (this.isDev) {
            console.log(`[INFO] ${message}`, data);
        }
    }

    warn(message: string, data?: any): void {
        if (this.isDev) {
            console.warn(`[WARN] ${message}`, data);
        }
    }

    error(message: string, error?: any): void {
        console.error(`[ERROR] ${message}`, error);
    }

    debug(message: string, data?: any): void {
        if (this.isDev) {
            console.debug(`[DEBUG] ${message}`, data);
        }
    }
}

export default new Logger();