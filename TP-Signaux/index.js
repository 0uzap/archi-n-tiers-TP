let isBlocked = true;

// Fonction générique pour gérer les signaux
async function handleSignal(signal) {
    console.log(`Signal ${signal} reçu.`);
    if (isBlocked == false ) {
        console.log("Nettoyage en cours.... poupipou");
        setTimeout(() => {process.exit(0)}, 2000);
    } else {
        console.log("Arret impossible")
    }
    
  }
  
  // Ecoute du signal SIGINT.
  process.on("SIGINT", () => handleSignal("SIGINT"));
  
  // Simulation d'une application qui reste active
  console.log("Application en cours d'exécution.");
  console.log(
    "Appuyez sur CTRL+C pour envoyer un signal."
  );
  
  // Execute la fonction toutes les 5 secondes.
  setInterval(() => {
    console.log("Le processus est toujours actif...");
    isBlocked = !isBlocked  
  }, 5000);
  