const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { deserialize } = require('mongodb');
const PROTO_PATH = './todo.proto';

// Chargement du fichier .proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const todoProto = grpc.loadPackageDefinition(packageDefinition).todo;

const fs = require("fs");
const path = require("path");

// Lire les certificats SSL
// const serverCert = fs.readFileSync(path.join(__dirname, "certs", "server.crt"));
// const serverKey = fs.readFileSync(path.join(__dirname, "certs", "server.key"));
const serverCert = fs.readFileSync('./certs/server.crt');
const credentials = grpc.credentials.createSsl(serverCert);


// Création du client
const client = new todoProto.TodoService('localhost:50051', grpc.credentials.createSsl(serverCert));


// Ajouter une tâche
client.AddTask({ id: '1', description: 'Learn gRPC' }, (err, response) => {
  if (err) console.error(err);
  else console.log(response.message);

  client.CreateProduct({nom: 'test', description: 'description test'}, (err, response) => {
    if (err) console.error(err);
    else console.log('Product', response.product);

    // client.GetProduct({}, (err, response) => {
    //   if (err) console.error(err);
    //   else console.log('Product:', response.products);
    // });

    client.UpdateProduct({id: response.product._id, nom: "changeemnt nom", description: "c'est un nouveau nom"}, (err, response) => {
      if (err) console.error(err);
      else console.log('Update', response.product)
    });

    client.DeleteProduct({id: response.product._id}, (err, response) => {
      if (err) console.error(err);
      else console.log('Delete:', response.product); 
    });
  });

  // Récupérer les tâches
  client.GetTasks({}, (err, response) => {
    if (err) console.error(err);
    else console.log('Tasks:', response.tasks);
  });


  

  // client.GetGames({}, (err, response) => {
  //   if (err) console.error(err);
  //   else console.log('Task:', response.games);
  // });
  


  
  
});



