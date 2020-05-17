<pre>
  _                              _     ___                           __  __             _ _ 
 | |    __ _ _ __ __ ___   _____| |   / _ \ _   _  ___ _   _  ___   |  \/  | ___  _ __ (_) |_ ___  _ __ 
 | |   / _` | '__/ _` \ \ / / _ \ |  | | | | | | |/ _ \ | | |/ _ \  | |\/| |/ _ \| '_ \| | __/ _ \| '__|
 | |__| (_| | | | (_| |\ V /  __/ |  | |_| | |_| |  __/ |_| |  __/  | |  | | (_) | | | | | || (_) | |
 |_____\__,_|_|  \__,_| \_/ \___|_|   \__\_\\__,_|\___|\__,_|\___|  |_|  |_|\___/|_| |_|_|\__\___/|_|

      For Laravel's Redis queue driver
</pre>
## Description
 This is a simple Laravel queue monitor that can be run with docker.
 The purpose of this application is to help developers debug issues with their laravel project's Redis queue.
 
## Environment variables 
* REDIS_KEY_PREFIX optional The Redis prefix that the laravel application uses for redis if your project uses a redis prefix.
* LARAVEL_QUEUES   required A colon(:) separated list of the laravel queue names.
* REDIS_HOST       required The Redis host to connect to.
* REDIS_PORT       optional The Redis port to connect to.
* REDIS_PASSWORD   optional The Password to use to connect to Redis.

## Examples of how to use

### Connect to redis on the global docker network using a redis password
docker run \
    -e LARAVEL_QUEUES="default \
    -e REDIS_HOST="your_redis.local" \
    -e REDIS_PASSWORD="your_redis_password" \
    --network='global' \
    -it \
    laravel-queue-monitor

### Connect to redis on a custom docker network without a redis password
docker run \
    -e LARAVEL_QUEUES="default \
    -e REDIS_HOST="your_redis.local" \
    --network='app_network_1' \
    -it \
    laravel-queue-monitor

### Watch multiple queues at the same time
docker run \
    -e LARAVEL_QUEUES="default:other_queue:the_next_queue:another_queue \
    -e REDIS_HOST="your_redis.local" \
    -e REDIS_PASSWORD="your_redis_password" \
    --network='global' \
    -it \
    laravel-queue-monitor
