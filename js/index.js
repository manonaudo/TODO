'use strict'; 

const list = document.getElementById('list');
const input = document.getElementById('input');
const add = document.getElementById('add');
const clear = document.getElementById('clear');
const url = document.getElementById('url');
const load = document.getElementById('load');
const storage = new ArrayStorage('tasks');
const tasks = storage.list;

function taskToDOM(task)
{
  if (typeof task === 'string' && task != false)
    {
      const li = document.createElement('li');
      const remove = document.createElement('button'); 
      li.textContent = task;
      remove.textContent = 'REMOVE';
      remove.addEventListener('click', () => {
        const value = remove.parentNode.firstChild.textContent; 
        storage.remove(value);
        list.removeChild(remove.parentNode);
      });
      li.appendChild(remove);
      list.insertBefore(li, list.firstChild);
      return true;
    }

  return false;
} 


tasks.forEach(task => taskToDOM(task));

function newTask() { 
  if (storage.list.indexOf(input.value) === -1 && taskToDOM(input.value)) {
    storage.set(input.value);
    input.value = ''; 
  }
  input.focus();
}


add.addEventListener('click', newTask); 

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    newTask();
  }
}); 

clear.addEventListener('click', () => {
  storage.clear();
  list.innerHTML = '';
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
    if (response.ok) {
      return response.json();
    }
    throw new Error(`${response.statusText} (${response.status})`);
    })
   .then(tasks => {
     if (Array.isArray(tasks)) {
      tasks.forEach(task => {
        if (storage.list.indexOf(task) === -1 && taskToDOM(task)) {
          storage.set(task);
        }
      });
      return;
    }

    throw new Error(`La réponse n'est pas un tableau JSON `);
  });
}
