class Config {
    constructor() {
        this.getConfig();
    }

    getConfig() {
        this.config = {
            redisPrefix: process.env.REDIS_KEY_PREFIX,
            laravelQueues: process.env.LARAVEL_QUEUES ? process.env.LARAVEL_QUEUES.split(':') : '',
            redisHost: process.env.REDIS_HOST,
            redisPort: process.env.REDIS_PORT,
            redisPassword: process.env.REDIS_PASSWORD
        };
    }

    getRedisConfig() {
        return {
            host: this.config.redisHost,
            port: this.config.redisPort,
            password: this.config.redisPassword,
            enableOfflineQueue: true,
            lazyConnect: true
        };
    };

    get(parameter) {
        return this.config[parameter];
    }
}

module.exports = Config;
