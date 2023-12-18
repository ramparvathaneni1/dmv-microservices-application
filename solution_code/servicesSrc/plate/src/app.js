import cors from 'cors';
import express from 'express';
import config from 'config';
import initializeSystem from "./modules/initializeSystem.js";
import vPlate from "./routes/plate.js";


export async function createApp(dependencyService) {

  const service = dependencyService();

  service.logger.info("Starting Plates Service");

  const app = express();

  // Disable Automatic Headers
  app.disable('x-powered-by');

  // Init
  const runInit = config.get("init.onLoad");
  if(runInit){
    service.logger.info("Init Plates Service");

    await initializeSystem(service);
  }

  let securityPolicy = {
    contentSecurityPolicy: {},
  };


  if (process.env.NODE_ENV === 'production') {
    app.use(helmet(securityPolicy));
    sessConf.cookie.secure = true;
  }

  // Cors & Security
  let allowedOrigins = [];
  const allowedOriginsSetting = await config.get('cors.allowedOrigins');

  if (allowedOriginsSetting.length > 0) {
    allowedOrigins.push(...allowedOriginsSetting);
  }

  const corsConfig = {
    credentials: true,
    origin: function origin(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests).
      // There are cases where origin might be "null" (as a string). See more
      // info at https://tools.ietf.org/html/rfc6454#section-7.3
      if (!origin || origin === 'null') {
        // don't allow from this origin, but allow request (don't fail)
        return callback(null, false);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(
          `The CORS policy for this site \`${origin}\` does not allow access from the specified Origin.`,
        ),
      );
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
  app.use('/api/plate', vPlate);


  app.get('/api/', (_req, res) => {
      service.logger.info("ROUTE: Plate API /api")
      res.send('plates');

  });

  service.logger.info("Plate Service Startup: Complete");

  return app;
}