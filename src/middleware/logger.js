import winston from 'winston';
import os from 'os';
import fs from 'fs';

const logDir = 'logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const sysLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: `${logDir}/system.log` })
    ]
});

// Create access logger
const accessLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: `${logDir}/access.log` })
    ]
});

// Create error logger
const errorLogger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: `${logDir}/error.log` })
    ]
});

// Error logging middleware
// const logError = (err, req, res, next) => {
//     const userAgentInfo = req.useragent;
//     const deviceType = userAgentInfo.isMobile ? 'Mobile' : userAgentInfo.isTablet ? 'Tablet' : 'Desktop';

//     const logMessage = `[${os.hostname()}] [${res.statusCode}] ${req.method} | ${req.originalUrl} | ${userAgentInfo.platform || 'Unknown'} | ${userAgentInfo.browser || 'Unknown'}/${userAgentInfo.version || 'Unknown'} | ${deviceType} | ${err.message}`;

//     errorLogger.error(logMessage);
//     res.status(500).json({ message: 'Internal Server Error' });
// };

// Access log middleware
const logRequestResponse = (req, res, next) => {
    const start = Date.now();
    const userAgentInfo = req.useragent;
    const deviceType = userAgentInfo.isMobile ? 'Mobile' : userAgentInfo.isTablet ? 'Tablet' : 'Desktop';

    res.on('finish', () => {
        const duration = Date.now() - start;
        const logMessage = `[${os.hostname()}] [${res.statusCode}] ${req.method} | ${req.originalUrl} - ${duration}ms | ${req.ip} | ${userAgentInfo.platform} | ${userAgentInfo.browser}/${userAgentInfo.version} | ${deviceType}`;

        accessLogger.info(logMessage);
    });

    next();
};

export {errorLogger, logRequestResponse };
export default sysLogger;
