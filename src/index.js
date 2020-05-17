const Config = require('./Config');
const Display = require('./Display');
const Redis = require('ioredis');
const JobQueue = require('./JobQueue');

let config = new Config();
let display = new Display(config);
let redis = new Redis(config.getRedisConfig());
let jobQueue = new JobQueue(redis, config);

let quit = false;
let main_loop = () => {
    if(!quit) {
        jobQueue.updateQueues().then(queues => {
            let jobs = jobQueue.getJobsFromQueues(queues);
            display.renderDisplay(queues, jobs).then(() => {
                console.log("\n\nPress enter to exit");
                setTimeout(main_loop, 200)
            });
        });
    } else {
        redis.disconnect();
        process.exit();
    }
};

display.clear();
display.showLogo().then(() => {
    redis.on('connect', () => {
        main_loop();
    });
    redis.connect();
});
process.stdin.on('data', () => {
        quit = true;
});
