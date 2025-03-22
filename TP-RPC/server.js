const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "./todo.proto";

const axios = require("axios");
const { MongoClient, ObjectId} = require("mongodb");

// Chargement du fichier .proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const todoProto = grpc.loadPackageDefinition(packageDefinition).todo;

const fs = require("fs");
const path = require("path");

// Lire les certificats SSL
// const serverCert = fs.readFileSync(path.join(__dirname, "certs", "server.crt"));
// const serverKey = fs.readFileSync(path.join(__dirname, "certs", "server.key"));
const serverCert = fs.readFileSync('./certs/server.crt');
const serverKey = fs.readFileSync('./certs/server.key');
const credentials = grpc.ServerCredentials.createSsl(null, [{
  cert_chain: serverCert,
  private_key: serverKey,
}], true)


// Liste des tâches en mémoire
const tasks = [];
const test = [];

// mongodb
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "projetRPC";

async function setupmongo() {
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);

  return db;
}

async function main() {
  const db = await setupmongo();

  const products = db.collection("products")

  // Implémentation des méthodes du service
  const addTask = (call, callback) => {
    const task = call.request;
    tasks.push(task);
    callback(null, { message: "Task added successfully!" });
  };

  const getGames = async (call, callback) => {
    try {
      const response = await axios.get(
        "https://www.freetogame.com/api/games?sort-by=alphabetical"
      );
      console.log(response);
      callback(null, {
        games: response.data.map((game) => {
          return { title: game.title, id: game.id };
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getTasks = (call, callback) => {
    callback(null, { tasks });
  };

  const createProduct = async (call, callback) => {
    try {
      // const product = await products.insertOne({ ...call.request });
      const product = {
        nom: call.request.nom,
        description: call.request.description,
      };

      // test.push(product)
      await products.insertOne(product)
      callback(null, {product})
    } catch (error) {
      if (error instanceof MongoServerError) {
        console.log(`Error worth logging: ${error}`); // special case for some reason
      }
      throw error; // still want to crash
    }
  };

const getProduct = async (call, callback) => {
  try {
    const productList = await products.find().toArray(); 

    console.log("Fetched products:", productList);

    callback(null, { products: productList });
  } catch (error) {
    console.error("MongoDB Error:", error);
    callback(error, null);
  }
};

const updateProduct = async (call, callback) => {
  try {
    const updateproduct = {
      nom: call.request.nom,
      description: call.request.description,
    };
    console.log(call.request.id)
    const updateResult = await products.findOneAndUpdate({_id: new ObjectId(call.request.id)}, { $set: updateproduct}, {returnDocument: "after"});
    console.log(updateResult)

    callback(null, {product: updateResult})
  } catch (error) {
    console.error("MongoDB Error:", error);
    callback(error, null);
  }
};

const deleteProduct = async (call, callback) => {
  try {
    console.log(call.request.id)
    const deleteResult = await products.findOneAndDelete({_id: new ObjectId(call.request.id)},  {returnDocument: "after"});
    callback(null, {product: deleteResult})
    console.log("message" , deleteResult)
  } catch (error) {
    console.error("MongoDB Error:", error);
    callback(error, null);
  }
 }


  // Démarrage du serveur
  const server = new grpc.Server();
  server.addService(todoProto.TodoService.service, {
    addTask,
    getTasks,
    getGames,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
  });
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createSsl(null, [{
      cert_chain: serverCert,
      private_key: serverKey,
    }], true),
    () => {
      console.log("Server running on http://0.0.0.0:50051");
    }
  );
}

main();
