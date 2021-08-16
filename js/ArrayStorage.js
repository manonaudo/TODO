'use strict';

//Stockage local de nos taches sous forme de tableau
class ArrayStorage {
  
  //Un construsteur pour initialiser l'objet avec le nom de la clé et sa valeur
  constructor(name) {
    this.name = name; 

    this.list = this.get(); 
  } 



  // Une methode pour récuperer un tableau des valeurs ou par defaut, le creer
  get() {
    if (!localStorage.getItem(this.name)) {
      // retourne le booleen contraire a celui qui aurait du etre renvoyé
      // si il n'y a pas cette clé, on rentre dans la condition 
      localStorage.setItem(this.name, '[]'); // Ajoute la clé avec sa valeur string contenant un tableau
    }
    return JSON.parse(localStorage.getItem(this.name));
  }

   // Une methode pour ajouter une valeur dans le tableau
  set(value) {
    //met à jour la propriété list (le stockage + ce que l'utilisateur ajoute)
    this.list.push(value); // ajoute une valeur a la fin de mon tableau
    //met à jour la clé sur le serveur local : JSON.stringify permet de transformer la propriété liste qui est un tableau, en string
    localStorage.setItem(this.name, JSON.stringify(this.list));
  } 

  //Une methode pour supprimer une valeur du tableau (de la liste et du stockagelocal)
  remove(value) {
    const index = this.list.indexOf(value); // indique l'indice du tableau this.list qui a la valeur "value"
    this.list.splice(index, 1); //Splice : supprime un ou plusieurs element du tableau this.list. splice(indice a suppr, combien d'indice a suppr)
    //met à jour et supprime l'element
    localStorage.setItem(this.name, JSON.stringify(this.list));
  } 

  //Une methode pour vider tout le tableau
  clear() {
    // Pour suppriler toute la clé des taches 
    localStorage.removeItem(this.name);
  }

}
