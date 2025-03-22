const net = require("net");

// Port de la socket pour le serveur
const PORT = 6667;

// Stocker les clients connecté
const clients = [];

// Création du serveur
const server = net.createServer((socket) => {
  let buffer = "";
  let username = null;

  socket.write(`Bienvenue, quel est votre pseudo ? \n\r`);
  socket.on("data", (data) => {
    buffer += data;
    if (buffer.toString().includes("\n")) {
      console.log(buffer.toString());
      if (username == null) {
        username = buffer.toString().trim();
        clients.push({ socket, username });
        clients.forEach((client) => {
          client.socket.write(
            buffer.toString().trim() + " entre dans le chat \n\r"
          );
        });
      } else {
        if (buffer.trim() == ("/list")) {
          listUser = clients.map((client) => client.username).join(", ");
          socket.write(`${listUser} \n\r`);
        } else if (buffer.includes("/whisper ")) {
            coupe = buffer.toString().split(" ");
            cibleNom = coupe[1];
            cibleChuchote = coupe.slice(2).join(" ");
            cibleClient = clients.find(client => client.username === cibleNom);

            if (cibleNom) {
                cibleClient.socket.write(`Whisper from: [${username}] ${cibleChuchote} \n\r`)
                socket.write(`Whisper to: [${cibleNom}] ${cibleChuchote} \n\r`)
            } else {
                socket.write(`Utilisateur ${targetUsername} introuvable.\n\r`);
            }
        } else {
          clients.forEach((client) => {
            client.socket.write(`${username}: ${buffer.toString()}`);
          });
        }
      }
      buffer = "";
    }
  });
  socket.on("end", () => {
    console.log(username + " Client déconnecté.");
  });
});

// Démarre le serveur sur le port 6667
server.listen(PORT, () => {
  console.log(`Serveur IRC en écoute sur le port ${PORT}`);
});
