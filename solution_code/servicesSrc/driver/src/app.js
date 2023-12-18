import cors from 'cors';
import express from 'express';
import config from 'config';
import initializeSystem from "./modules/initializeSystem.js";
import vDriver from "./routes/driver.js";


export async function createApp(dependencyService) {

  const service = dependencyService();

  service.logger.info("Starting driver Service");

  const start = Date.now();

  const app = express();

  // Disable Automatic Headers
  app.disable('x-powered-by');

  // Init
  const runInit = config.get("init.onLoad");
  if(runInit){
    service.logger.info("Init driver Service");

    await initializeSystem(service);
  }

  let securityPolicy = {
    contentSecurityPolicy: {},
  };


  if (process.env.NODE_ENV === 'production') {
    app.use(helmet(securityPolicy));
    sessConf.cookie.secure = true;
  }

  // Cors & Security FIX
let allowedOrigins = [];
const allowedOriginsSetting = await config.get('cors.allowedOrigins');

if (allowedOriginsSetting.length > 0) {
  allowedOrigins.push(...allowedOriginsSetting);
}

const corsConfig = {
  credentials: true,
  origin: function origin(_origin, callback) {
    // Always allow access from any origin
    return callback(null, true);
  },
};


  app.use(cors(corsConfig));
  // Adding DI container for unit testability
  const exposeDependencyService = async (req, res, next) => {
    req.service = service;
    next();
  };

  app.use('*', exposeDependencyService);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));


  // Set the Routes
  app.use('/api/driver', vDriver);

  app.get('/api/', (_req, res) => {
    service.logger.info("ROUTE: Driver API /")

    res.send('driver');
  });

  service.logger.info("driver Service Startup: Complete");

  return app;
}