import Config from 'config-js'
import cluster from 'cluster'
import Server from './backend/Server'
import Application from './backend/Application'

var configuration = new Config('./config/##.js'),
  app = new Application(),
  server = new Server(configuration, app);

if (cluster.isMaster) {
  for (var i = 0; i < configuration.get('application.numCPUs'); i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Cluster worker ${worker.process.pid} died.`);
    cluster.fork();
    console.log(`New worker ${worker.process.pid} forked.`);
  });
} else {
  server.run();
}

