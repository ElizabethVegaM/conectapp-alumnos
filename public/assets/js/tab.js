// const trash = document.getElementsByClassName('fa-trash');

firebase.database().ref('messages')
  .limitToLast(5) // Filtro para no obtener todos los mensajes
  .once('value')
  .then((messages) => {
  })
  .catch((error) => {
    console.log('Error > ' + error);
  });
// Acá comenzamos a escuchar por ${newMessage.creatorAvatar} va en img src
// on child_added
firebase.database().ref('messages')
  .limitToLast(10)
  .on('child_added', (newMessage) => {
    messageContainer.innerHTML = `
      <div class="card">
        <div class="card-header">
          <img class="img-fluid avatar" src="${newMessage.val().creatorAvatar || '/src/assets/img/penguin-glasses.png'}">
          <h6 class="card-title">${newMessage.val().creatorName}</h6>
        </div>
        <div class="card-body">
          <textarea id="${newMessage.key}-txt" class="card-text" data-id="${newMessage.key}-txt" readonly autofocus>${newMessage.val().text}</textarea>
        </div>
        <div class="card-footer text-muted">
          <i class="fas fa-star" data-id="${newMessage.key}" onclick="addStar(event)">
            <span>${newMessage.val().starsCount}</span>
          </i>
          <i id="${newMessage.key}-edit" class="fas fa-edit" data-id="${newMessage.key}" onclick="editButton(event)"></i>
          <i id="${newMessage.key}-trash" class="fas fa-trash" data-id="${newMessage.key}" onclick="deleteButton(event)"></i>
        </div>
      </div>
      ` + messageContainer.innerHTML;
    if (newMessage.val().creator === firebase.auth().currentUser.uid) {
      document.getElementById(`${newMessage.key}-edit`).style.display = 'inline';
      document.getElementById(`${newMessage.key}-trash`).style.display = 'inline';
    } else {
      document.getElementById(`${newMessage.key}-edit`).style.display = 'none';
      document.getElementById(`${newMessage.key}-trash`).style.display = 'none';
    }
  });

// Usaremos una colección para guardar los mensajes, llamada messages
function sendPost() {
  const currentUser = firebase.auth().currentUser;
  const messageAreaText = messageArea.value;
  if (messageAreaText.length < 1) {
    alert('Debes ingresar un mensaje');
  } else {
    // Para tener una nueva llave en la colección messages
    const newMessageKey = firebase.database().ref().child('messages').push().key;
    firebase.database().ref(`messages/${newMessageKey}`).set({
      creator: currentUser.uid,
      creatorName: currentUser.displayName,
      text: messageAreaText,
      creatorAvatar: currentUser.photoURL,
      starsCount: 0
    });
    messageArea.value = '';
  }
}

function deleteButton(event) {
  if (confirm('¿Estás seguro de eliminar este mensaje?')) {
    event.stopPropagation();
    const messagesId = event.target.getAttribute('data-id');
    const messagesRef = firebase.database().ref('messages').child(messagesId);
    messagesRef.remove();
    messageContainer.removeChild(messageContainer.childNodes[0] && messageContainer.childNodes[1]);
  }
}

function editButton(event) {
  messageId = event.target.getAttribute('data-id');
  let message = document.getElementById(`${messageId}-txt`);
  message.readOnly = false;
  message.onkeypress = function(event) {
    let value = message.value;
    if (event.keyCode === 13) {
      firebase.database().ref(`messages/${messageId}`).update({
        text: value
      });
      message.readOnly = true;
    };
  };
}

function addStar(event) {
  event.stopPropagation();
  const messageId = event.target.getAttribute('data-id');
  firebase.database().ref(`messages/${messageId}`).once('value', function(message) {
    let result = (message.val().starsCount || 1);
    firebase.database().ref('messages').child(messageId).update({
      starsCount: result + 1
    });
    event.target.innerHTML = result;
    event.target.style.color = '#f3f170';
  });
}
