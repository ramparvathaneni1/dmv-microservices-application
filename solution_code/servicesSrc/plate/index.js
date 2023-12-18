import { createApp } from './src/app.js';
import config from 'config';
import logger from "./src/modules/logger.js";
import db from "./src/modules/db.js";
import { validatePlate, getByDriverIds, getByPlateIds, update, add, remove } from './src/modules/plate.js';

let configPort = parseInt(config.get('port'));
configPort = configPort ? configPort : 3000;

const dependencyService = () => {
  return Object.freeze({
      logger: logger,
      db: db(logger),
      module: {
        validatePlate,
        getByDriverIds,
        getByPlateIds,
        update,
        add,
        remove
      } 
  });
};

const app = createApp(dependencyService).then((app) => {
  logger.info("Launching Service on " + configPort);
  app.listen(configPort, () => {});
});
