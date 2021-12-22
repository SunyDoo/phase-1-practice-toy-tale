let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  //get all toys onto site when page loads
  function getAllToys(){
    fetch ('http://localhost:3000/toys')
    .then (res=>res.json())
    .then (toyData=>toyData.forEach(item=>renderToy(item)))
  }
  function initialize(){
    getAllToys()
  }
  //makes toy cards out of all the toy data from the server and appends them to toy collection
  function renderToy(toys){
    let card = document.createElement('div')
    card.className = 'card'
    card.innerHTML = `
      <h2>${toys.name}</h2>
      <img src="${toys.image}" class="toy-avatar" />
      <p> ${toys.likes} Likes</p>
      <button class="like-btn" id="${toys.id}">Like ❤️</button>    
    `
//grab like button and add listener that contains function to increase like number and then run patch function
    card.querySelector('.like-btn').addEventListener('click', ()=>{
      toys.likes +=1
      card.querySelector('p').textContent=`${toys.likes} Likes`
      updateLikes(toys)
    })
    document.querySelector('#toy-collection').appendChild(card)
  }
  //Grab "add toy" button and add event listener
  document.querySelector('.add-toy-form').addEventListener('submit', submitToy)
  //creates new toy card based on input values
  function submitToy(e){
    e.preventDefault()
    let toyObj = {
      name:e.target.name.value,
      image:e.target.image.value,
      likes:0
    }
    //make toy card
    renderToy(toyObj)
    //post toy card to server
    createToy(toyObj)
  }
  //posts new toy card with input values
  function createToy(toyObj){
    fetch ('http://localhost:3000/toys',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(toyObj)
    })
    .then(res=>res.json())
    .then(toy=>console.log(toy))
  }

  //patch function to add likes to server
  function updateLikes(toyObj){
    fetch (`http://localhost:3000/toys/${toyObj.id}`, {
      method: 'PATCH',
      headers:{
        "Content-Type": "application/json",
         Accept: "application/json"
      },
      body: JSON.stringify(toyObj)
    })
    .then(res=>res.json())
    .then(toy=>console.log(toy))
  }

  initialize()  
  
});
