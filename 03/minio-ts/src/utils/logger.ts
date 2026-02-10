/**
 * Logger Utility
 * 
 * Provides colored console logging with different severity levels
 */

export enum LogLevel {
    INFO = 'INFO',
    SUCCESS = 'SUCCESS',
    WARN = 'WARN',
    ERROR = 'ERROR'
}

/**
 * ANSI color codes for terminal output
 */
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',

    // Foreground colors
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',

    // Background colors
    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m'
};

/**
 * Get current timestamp formatted
 */
function getTimestamp(): string {
    return new Date().toISOString();
}

/**
 * Format log message with color and timestamp
 */
function formatMessage(level: LogLevel, message: string): string {
    const timestamp = getTimestamp();
    let colorCode = colors.white;

    switch (level) {
        case LogLevel.INFO:
            colorCode = colors.cyan;
            break;
        case LogLevel.SUCCESS:
            colorCode = colors.green;
            break;
        case LogLevel.WARN:
            colorCode = colors.yellow;
            break;
        case LogLevel.ERROR:
            colorCode = colors.red;
            break;
    }

    return `${colors.dim}[${timestamp}]${colors.reset} ${colorCode}${colors.bright}[${level}]${colors.reset} ${message}`;
}

/**
 * Logger class with static methods
 */
export class Logger {
    static info(message: string): void {
        console.log(formatMessage(LogLevel.INFO, message));
    }

    static success(message: string): void {
        console.log(formatMessage(LogLevel.SUCCESS, message));
    }

    static warn(message: string): void {
        console.warn(formatMessage(LogLevel.WARN, message));
    }

    static error(message: string, error?: any): void {
        console.error(formatMessage(LogLevel.ERROR, message));
        if (error) {
            console.error(colors.red, error, colors.reset);
        }
    }

    static separator(): void {
        console.log(colors.dim + '─'.repeat(80) + colors.reset);
    }

    static header(title: string): void {
        this.separator();
        console.log(colors.bright + colors.cyan + title + colors.reset);
        this.separator();
    }
}
