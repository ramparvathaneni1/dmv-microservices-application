import { createApp } from './src/app.js';
import config from 'config';
import logger from "./src/modules/logger.js";
import db from "./src/modules/db.js";
import { getModels } from './src/modules/model.js';
import { getMake } from './src/modules/make.js';

let configPort = parseInt(config.get('port'));
configPort = configPort ? configPort : 3000;

const dependencyService = () => {
  return Object.freeze({
      logger: logger,
      db: db(logger),
      module: {
        getMake: getMake,
        getModels: getModels 
      } 
  });
};

const app = createApp(dependencyService).then((app) => {
  logger.info("Launching Service on " + configPort);
    app.listen(configPort, () => {});
});
