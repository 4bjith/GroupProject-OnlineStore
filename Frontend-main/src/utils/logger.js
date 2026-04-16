/**
 * Frontend Logger Utility
 * Provides beautiful console logging with colors and timestamps
 */

const logLevels = {
  info: { color: '#2196F3', emoji: 'ℹ️' },
  success: { color: '#4CAF50', emoji: '✅' },
  warn: { color: '#FF9800', emoji: '⚠️' },
  error: { color: '#F44336', emoji: '❌' },
  debug: { color: '#9C27B0', emoji: '🔍' },
};

const formatTimestamp = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
};

const formatMessage = (level, message, data = null) => {
  const config = logLevels[level] || logLevels.info;
  const timestamp = formatTimestamp();
  const prefix = `%c[${timestamp}] ${config.emoji} ${level.toUpperCase()}:`;
  
  if (data) {
    console.log(prefix, `color: ${config.color}; font-weight: bold`, message, data);
  } else {
    console.log(prefix, `color: ${config.color}; font-weight: bold`, message);
  }
};

const logger = {
  info: (message, data = null) => {
    formatMessage('info', message, data);
  },
  
  success: (message, data = null) => {
    formatMessage('success', message, data);
  },
  
  warn: (message, data = null) => {
    formatMessage('warn', message, data);
  },
  
  error: (message, data = null) => {
    formatMessage('error', message, data);
    if (data && data instanceof Error) {
      console.error('Stack trace:', data.stack);
    }
  },
  
  debug: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      formatMessage('debug', message, data);
    }
  },
  
  // Specialized logging methods for common scenarios
  api: (method, url, data = null) => {
    logger.info(`API Request: ${method} ${url}`, data);
  },
  
  apiSuccess: (method, url, data = null) => {
    logger.success(`API Success: ${method} ${url}`, data);
  },
  
  apiError: (method, url, error) => {
    logger.error(`API Error: ${method} ${url}`, error);
  },
  
  route: (path) => {
    logger.info(`Route changed: ${path}`);
  },
  
  state: (storeName, action, data = null) => {
    logger.debug(`State [${storeName}]: ${action}`, data);
  },
  
  component: (componentName, action, data = null) => {
    logger.info(`Component [${componentName}]: ${action}`, data);
  },
};

export default logger;
