'use strict'; // Notre application
// DOM selection

/*On créer une constante list qui selectionne l'element par l'id list 
de la page html*/

const list = document.getElementById('list');
const input = document.getElementById('input');
const add = document.getElementById('add');
const clear = document.getElementById('clear');
const url = document.getElementById('url');
const load = document.getElementById('load'); // Nouvelle instance pour la clé 'tasks'

const storage = new ArrayStorage('tasks'); // On recupere la class ArrayStorage de notre arrayStorage.js
// On recupère le tableau des taches déjà existantes ou un tableau vide

const tasks = storage.list; //taskToDOM : tache vers le document object model (nom comme un autre)
// task : On lui affiche la tache à afficher dans la page html

function taskToDOM(task) // Fonction qui ajoute les taches au dom avec un boutton de suppression auquel on ajoute un evenement
{
  if (typeof task === 'string' && task != false) // si on a une chaine non vide
    {
      //Creer un element <li> et un <button> dans notre page html
      const li = document.createElement('li');
      const remove = document.createElement('button'); //On ajoute du texte a li et a button 

      li.textContent = task;
      remove.textContent = 'REMOVE'; // Donc dans li il y a le texte contenu dans tasks[i] et le bouton

      remove.addEventListener('click', () => {
        // recuperer le texte qui est associer a la tache sur laquelle jai cliqué en appyuant sur son bouton remose
        const value = remove.parentNode.firstChild.textContent; // bouton html remove . On remonte sur le parent (li) . On recupere son 1er enfant (la tache") . Je recopère e contenu textuel de la tache

        storage.remove(value); // methode créée dans arrayStorage. On peut l'utiliser grace a,la constante storage

        list.removeChild(remove.parentNode); //Supprime le parent de remove donc li.
      }); // On ajoute l'enfant remove a li avant d'ajouter li

      li.appendChild(remove); // Donc dans li il y a le texte contenu dans tasks[i] et le bouton 

      list.insertBefore(li, list.firstChild); //on insert lans list les li en premier enfant a chaque boucle

      return true;
    }

  return false;
} // On ajoute chaque taches à la liste a puce

/*for (let i = 0; i < tasks.length; i++){
	taskToDOM (tasks[i])
}*/


tasks.forEach(task => taskToDOM(task)); // gere l'ajout de tache avec le bouton ADD et la touche 'Enter'

function newTask() {
  //Verifier que l'utilisateur ne rajoute pas une tache qu'il a dejà
  // input.value : valeur de mon champ de texte
  if (storage.list.indexOf(input.value) === -1 && taskToDOM(input.value)) {
    // si indexof vaut -1 ca veut dire qu'il n'y a pas de doublon
    storage.set(input.value);
    input.value = ''; // vide le champ de text 
  }

  input.focus(); // focus : le curseur reste dans le cadre 
} // Fonction newtask se produit quand l'utilisateur click sur le bouton add


add.addEventListener('click', newTask); // Quand on click sur la touche 'Enter' dans l'input, la fonction newTask se produit

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    newTask();
  }
}); // On supprime la liste du DOM et du navigateur

clear.addEventListener('click', () => {
  storage.clear();
  list.innerHTML = ''; // On indique que notre liste n'a aucun contenu/ une chaine vide
}); // On gere l'importation de taches 

load.addEventListener('click', newArray);
url.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    newArray();
  }
});

function newArray() {
  fetch(url.value) // Recupere le champ de texte ecrit dans l'input
  .then(response => {
    //Une fois la promesse resolue, on recupere la reponse
    if (response.ok) {
      //on verifie que la promesse soit tenue
      return response.json(); // .json : methode qui permet d'extraire et de recuperer les donnés de la valeur de l'url qui doit etre un fichier json
    } //Si promesse pas tenue, renvoi une erreur


    throw new Error(`${response.statusText} (${response.status})`);
  }).then(tasks => {
    // on verifie si la reponse qu'on a eu (le parametre task) est bien un tableau. Si on a bien recupéré un tableau au format json
    if (Array.isArray(tasks)) {
      // On utilise l'objet Array avec la methode .isArray : Indique si tasks est un tableau
      tasks.forEach(task => {
        if (storage.list.indexOf(task) === -1 && taskToDOM(task)) {
          // si indexof vaut -1 ca veut dire qu'il n'y a pas de doublon
          storage.set(task);
        }
      });
      return; //return vide permet de sortir de a fonction en paramettre de then. Sinon ca releve l'exeption
    }

    throw new Error(`La réponse n'est pas un tableau JSON `);
  });
}