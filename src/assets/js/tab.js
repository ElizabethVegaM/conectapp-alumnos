<<<<<<< HEAD
// mensajes
firebase.database().ref('messages')
  .limitToLast(20) // Filtro para no obtener todos los mensajes
  .once('value')
  .then((messages) => {
    console.log('Mensajes > ' + JSON.stringify(messages));
  })
  .catch(() => {
=======
//mensajes
firebase.database().ref('messages')
        .limitToLast(5) // Filtro para no obtener todos los mensajes
        .once('value')
        .then((messages)=>{
            console.log("Mensajes > "+JSON.stringify(messages));
        })
        .catch(()=>{
>>>>>>> 9d86505d38c264cc5760c2f596b7deb4b11c2c15

  });

<<<<<<< HEAD
// Acá comenzamos a escuchar por nuevos mensajes usando el evento
// on child_added
firebase.database().ref('messages')
  .limitToLast(100)
  .on('child_added', (newMessage) => {
    messageContainer.innerHTML = `
        <div class="card w-75">
=======
//Acá comenzamos a escuchar por 
//on child_added
firebase.database().ref('messages')
    .limitToLast(5)
    .on('child_added', (newMessage)=>{
        messageContainer.innerHTML = `
        <div class="card">
>>>>>>> 9d86505d38c264cc5760c2f596b7deb4b11c2c15
            <div class="card-body">
                <div class="col-1 avatar">
                    <img class="img-fluid img-rounded" src=${newMessage.creatorAvatar}/>
                </div>
                <h6 class="card-title">Nombre : ${newMessage.val().creatorName}</h6>
                <p class="card-text">${newMessage.val().text}</p>
            </div>
            <div id="footerI">
              
            </div>
        </div>
        ` + messageContainer.innerHTML;
  });
// Usaremos una colección para guardar los mensajes, llamada messages
<<<<<<< HEAD
function sendMessage() {
  const currentUser = firebase.auth().currentUser;
  const messageAreaText = messageArea.value;

  // Para tener una nueva llave en la colección messages
  const newMessageKey = firebase.database().ref().child('messages').push().key;

  firebase.database().ref(`messages/${newMessageKey}`).set({
    creator: currentUser.uid,
    creatorName: currentUser.displayName,
    text: messageAreaText
  });
}
=======
function sendMessage(){
        const currentUser = firebase.auth().currentUser;
        const messageAreaText = messageArea.value;
    
        //Para tener una nueva llave en la colección messages
        const newMessageKey = firebase.database().ref().child('messages').push().key;
    
        firebase.database().ref(`messages/${newMessageKey}`).set({
            creator : currentUser.uid,
            creatorName : currentUser.displayName,
            text : messageAreaText
        });
    }


    

>>>>>>> 9d86505d38c264cc5760c2f596b7deb4b11c2c15
