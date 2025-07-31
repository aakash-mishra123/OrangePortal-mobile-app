import express from 'express';
import { registerRoutes } from '../server/routes.js';

const app = express();

// Initialize routes
registerRoutes(app);

export default app;
