const queueStatuses = ['', 'reserved', 'delayed'];
class JobQueue {
    constructor(redis, config) {
        this.redis = redis;
        this.queueNames = config.get('laravelQueues');
        this.keyPrefix = config.get('redisPrefix');
    }

    parseQueuedJobs (queuedJobs, queue, status) {
        return queuedJobs.map(queuedJob => {
            queuedJob = JSON.parse(queuedJob);

            return {
                queue: queue,
                job: queuedJob.displayName,
                attempts: queuedJob.attempts,
                status: status ? status : 'Ready'
            };
        });
    };

    getJobsFromQueue(queue) {
        let promises = [];
        queueStatuses.forEach(status => {
            promises.push(
                new Promise(resolve => {
                    let key = this.keyPrefix + 'queues:' + queue;
                    if (status) {
                        key += ':' + status;
                    }
                    try {
                        this.redis.exists(key).then(exists => {
                            if (exists) {
                                this.redis.type(key).then(type => {
                                    if (type === 'list') {
                                        this.redis.lrange(key, 0, -1).then(queuedJobs => {
                                            resolve(this.parseQueuedJobs(queuedJobs, queue, status))
                                        });
                                    } else if (type === 'zset') {
                                        this.redis.zrange(key, 0, -1).then(queuedJobs => {
                                            resolve(this.parseQueuedJobs(queuedJobs, queue, status))
                                        });
                                    } else {
                                        throw new Error('Unexpected key type');
                                    }
                                });
                            } else {
                                // Key doesn't exist anymore
                                resolve([]);
                            }
                        });
                    } catch (e) {
                        // The key probably went away
                        resolve([]);
                    }
                })
            );
        });

        return new Promise(resolve => {
            Promise.all(promises).then(results => {
                resolve([].concat(...results));
            });
        })
    };

    updateQueues() {
        return new Promise(resolve => {
            let queues = {};
            let promises = [];
            this.queueNames.forEach(queue => {
                let promise = this.getJobsFromQueue(queue);
                promise.then(queuedJobs => {
                    queues[queue] = queuedJobs;
                });
                promises.push(promise);
            });
            Promise.all(promises).then(() => {
                resolve(queues);
            });
        });
    };

    getJobsFromQueues(queues) {
        let jobs = [];
        this.queueNames.forEach(queueName => {
            if (queues[queueName] !== undefined) {
                console.log(queues[queueName]);
                jobs = jobs.concat(queues[queueName]);
            }
        });

        return jobs;
    };
}

module.exports = JobQueue;
