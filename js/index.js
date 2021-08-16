'use strict'; 

const list = document.getElementById('list');
const input = document.getElementById('input');
const add = document.getElementById('add');
const clear = document.getElementById('clear');
const url = document.getElementById('url');
const load = document.getElementById('load');

 // On recupere la class ArrayStorage de arrayStorage.js
const storage = new ArrayStorage('tasks');

// task : la tache à afficher dans la page html
const tasks = storage.list;

function taskToDOM(task) // Fonction qui ajoute les taches au dom avec un bouton de suppression auquel on ajoute un evenement
{
  if (typeof task === 'string' && task != false) // si chaine non vide
    {
      //Creer un element <li> et un <button> dans notre page html
      const li = document.createElement('li');
      const remove = document.createElement('button'); 
	    
	//On ajoute du texte a li et a button 
      li.textContent = task;
      remove.textContent = 'REMOVE'; // Donc dans li il y a le texte contenu dans tasks[i] et le bouton

      remove.addEventListener('click', () => {
        // recupere le texte qui est associé à la tache en appyuant sur son bouton remove
        const value = remove.parentNode.firstChild.textContent; // bouton html remove. On remonte sur le parent (li). On recupere son 1er enfant (la tache). On recupère le contenu textuel de la tache.

        storage.remove(value); // methode créée dans arrayStorage. On peut l'utiliser grace a la constante storage

        list.removeChild(remove.parentNode); //Supprime le parent de remove donc li.
      });
	    
      li.appendChild(remove); //li contient le texte de tasks[i] et le bouton 

      list.insertBefore(li, list.firstChild); //On insert lans list les li en premier enfant a chaque boucle

      return true;
    }

  return false;
} 


tasks.forEach(task => taskToDOM(task)); // gere l'ajout de tache avec le bouton ADD et la touche 'Enter'

function newTask() {  //Se produit quand l'utilisateur click sur le bouton add
  //Verifier que l'utilisateur ne rajoute pas une tache qu'il a dejà
  if (storage.list.indexOf(input.value) === -1 && taskToDOM(input.value)) {
    // si indexOf vaut -1 ca veut dire qu'il n'y a pas de doublon
    storage.set(input.value);
    input.value = ''; // vide le champ de text 
  }

  input.focus(); // focus : le curseur reste dans le cadre 
}


add.addEventListener('click', newTask); 

// On supprime la liste du DOM et du navigateur
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    newTask();
  }
}); 

// Gere l'importation de taches 
clear.addEventListener('click', () => {
  storage.clear();
  list.innerHTML = ''; // On indique que notre liste n'a aucun contenu/ une chaine vide
}); 

load.addEventListener('click', newArray);
url.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    newArray();
  }
});

function newArray() {
  fetch(url.value)
  .then(response => {
    //Une fois la promesse resolue, on recupere la reponse
    if (response.ok) {
      //Verifie que la promesse soit tenue
      return response.json();
    } //Si promesse pas tenue -> une erreur

    throw new Error(`${response.statusText} (${response.status})`);
    })
   .then(tasks => {
    // on verifie si la reponse est bien un tableau au format json
     if (Array.isArray(tasks)) {
      // Utilise l'objet Array avec la methode isArray() : Indique si tasks est un tableau
      tasks.forEach(task => {
        if (storage.list.indexOf(task) === -1 && taskToDOM(task)) {
          // si indexof vaut -1 ca veut dire qu'il n'y a pas de doublon
          storage.set(task);
        }
      });
      return;
    }

    throw new Error(`La réponse n'est pas un tableau JSON `);
  });
}
