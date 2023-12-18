import AWS  from 'aws-sdk';
import winston  from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';
import config from 'config';

const { combine, timestamp, printf, colorize, align, json } = winston.format;


// Get configurations
const enableTransportFile = config.get("logging.file.enabled");
const enableTransportCloudwatch = config.get("logging.cloudwatch.enabled");
const logLevel = config.get("logging.level");


const logger = winston.createLogger({
    level: logLevel || 'info',
    format: combine(
        colorize({ all: true }),
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [new winston.transports.Console()],
});

// Set up Console Log


// Set up file log
if(enableTransportFile){
    let fileLocation = config.get("logging.file.location");
    logger.add(logger.transports.File, {
        filename: fileLocation,
        json: true,
        level: 'info',
        prepend: true,
    });
    }


// Add the aws cloudwatch
if(enableTransportCloudwatch){
    const awsRegion = config.get("aws.region");
    const awslogGroupName = config.get("aws.cloudwatch.logGroupName");
    const awslogStreamName = config.get("aws.cloudwatch.logStreamName");
    const awsaccessKeyId = config.get("aws.credentials.accessKeyId");
    const awsawsSecretKey = config.get("aws.credentials.awsSecretKey");

    AWS.config.update({
        region: awsRegion,
    });

    winston.add(new WinstonCloudWatch({
        cloudWatchLogs: new AWS.CloudWatchLogs(),
        logGroupName: awslogGroupName,
        logStreamName: awslogStreamName,
        awsAccessKeyId: awsaccessKeyId,
        awsSecretKey: awsawsSecretKey
    }));
}




export default logger;