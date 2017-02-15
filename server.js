import cluster from 'cluster';
import 'newrelic';
import Server from './backend/Server';
import Application from './backend/Application';

const environment = process.env.NODE_ENV || 'development';

const configuration = require('./config/' + environment);
const app = new Application();
const server = new Server(configuration, app);

// Fork only if config wants more than one core
if (cluster.isMaster && configuration.application && configuration.application.numCPUs > 1) {
  for (let i = 0; i < configuration.application.numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Cluster worker ${worker.process.pid} died (code ${code}, signal ${signal}).`);
    cluster.fork();
    console.log(`New worker ${worker.process.pid} forked.`);
  });
} else {
  server.run();
}

