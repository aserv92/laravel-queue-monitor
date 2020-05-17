const Figlet = require('figlet');
const Clear = require('clear');
const CLUI = require('clui');
const CLC = require('cli-color');
const Line = CLUI.Line;
const Chalk = require('chalk');

class Display {
    constructor(config) {
        this.queueNames = config.get('laravelQueues');
    }

    clear() {
        Clear();
    }

    showLogo() {
        return new Promise((resolve, reject) => {
            Figlet('Laravel  Queue  Monitor', function (err, data) {
                if (err) {
                    console.error(err);
                    reject();
                    return;
                }
                console.log(data);
                console.log(Chalk.blue.bold('      For Laravel\'s Redis queue driver'));
                console.log();
                console.log();
                console.log();
                resolve();
            });
        });
    };

    calculateTableColumnLengths(queues, jobs) {
        let calculatedTableColumnLengths = {
            longestQueueName : 10,
            maximumQueueSize : 9,
            longestJobName : 10,
            longestJobAttempts : 14,
            longestQueueStatus : 11
        };
        this.queueNames.forEach(queueName => {
            calculatedTableColumnLengths.longestQueueName = Math.max(calculatedTableColumnLengths.longestQueueName, queueName.length + 5);
            calculatedTableColumnLengths.maximumQueueSize = Math.max(calculatedTableColumnLengths.maximumQueueSize, queues[queueName].length.toString().length + 5);
        });
        jobs.forEach(job => {
            calculatedTableColumnLengths.longestJobName = Math.max(calculatedTableColumnLengths.longestJobName, job.job.length + 5);
            calculatedTableColumnLengths.longestJobAttempts = Math.max(calculatedTableColumnLengths.longestJobAttempts, job.attempts.toString().length + 5);
            calculatedTableColumnLengths.longestQueueStatus = Math.max(calculatedTableColumnLengths.longestQueueStatus, job.status.length + 5);
        });

        return calculatedTableColumnLengths;
    };

    renderDisplay(queues, jobs) {
        return new Promise(resolve => {
            let calculatedTableColumnLengths = this.calculateTableColumnLengths(queues, jobs);
            Clear();
            this.showLogo().then(() => {
                console.log(Chalk.blue.bold('    Queues'));
                new Line()
                    .padding(2)
                    .column('Queue', calculatedTableColumnLengths.longestQueueName + 5, [CLC.cyan])
                    .column('Jobs', calculatedTableColumnLengths.maximumQueueSize + 5, [CLC.cyan])
                    .fill()
                    .output();
                this.queueNames.forEach(queueName => {
                    new Line()
                        .padding(2)
                        .column(queueName, calculatedTableColumnLengths.longestQueueName + 5)
                        .column(queues[queueName] !== undefined ? queues[queueName].length.toString() : "0", calculatedTableColumnLengths.maximumQueueSize +5)
                        .fill()
                        .output();
                });
                if(jobs.length > 0) {
                    console.log("\n");
                    console.log(Chalk.blue.bold('    Jobs'));
                    new Line()
                        .padding(2)
                        .column('Queue', calculatedTableColumnLengths.longestQueueName + 5, [CLC.cyan])
                        .column('Job', calculatedTableColumnLengths.longestJobName + 5, [CLC.cyan])
                        .column('Attempts', calculatedTableColumnLengths.longestJobAttempts + 5, [CLC.cyan])
                        .column('Status', calculatedTableColumnLengths.longestQueueStatus + 5, [CLC.cyan])
                        .fill()
                        .output();
                    jobs.forEach(job => {
                        new Line()
                            .padding(2)
                            .column(job.queue, calculatedTableColumnLengths.longestQueueName + 5)
                            .column(job.job, calculatedTableColumnLengths.longestJobName + 5)
                            .column(job.attempts.toString(), calculatedTableColumnLengths.longestJobAttempts + 5)
                            .column(job.status, calculatedTableColumnLengths.longestQueueStatus + 5)
                            .fill()
                            .output();
                    });
                }
                resolve();
            });
        });
    };
}

module.exports = Display;
