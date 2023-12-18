import mysql from 'mysql2';
import config from 'config';

const mysql_host = config.get('database.mysql_host');
const mysql_port = config.get('database.mysql_port');
const mysql_database = config.get('database.mysql_database');
const mysql_username = config.get('database.mysql_username');
const mysql_password = config.get('database.mysql_password');
const connectionLimit = config.get('database.connectionLimit');
const queueLimit = config.get('database.connectionLimit');

const db = (logger) => {
    const dbPool = mysql.createPool({
        connectionLimit: connectionLimit,
        host: mysql_host,
        user: mysql_username,
        password:mysql_password,
        database:mysql_database,
        port: mysql_port,
        queueLimit: queueLimit,
        multipleStatements: true,
        waitForConnections: true
    });
    
    dbPool.getConnection((err,connection)=> {
        if(err){
            logger.error('Database connected failed');
            throw err;

        }
        logger.info('Database connected successfully');
        connection.release();
    });

    const query = async (sql) => {
        return await dbPool.promise().query(sql).catch((err) => {
            logger.error(err);
            return false;
        });
    }

    const execute = async (sql, data, cb = null) => {
        return await dbPool.promise().execute(sql, data).catch((err) => {
            logger.error(err);
            if (cb) {
                //if custom failure callback passed, execute it here
                return cb();
            }
            return false;
        });
    }

    return {
        query,
        execute
    }
}

export default db;