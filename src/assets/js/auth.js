let userConect = null;
let conectKey = '';

window.onload = () => {
  inicialize();
};

// Funcion inicial
function inicialize() {  
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
    // Si estamos logueados esconder "registro"
      firstSection.style.display = 'none';
      wall.classList.remove('d-none');
      loggedIn.classList.remove('d-none');
      avatarPic.src = user.photoURL;

      // nueva coleccion de users conectados
      userConect = firebase.database().ref('/users-conect');
      usersAdd(user.uid, user.displayName);
    
      userConect.on('child_removed', (dataUser) => {
      //  alert(`${dataUser.val().name} ha salido de la sala`);
      });
      userConect.on('child_added', (dataUser) => {
      //  alert(`${dataUser.val().name} ha ingresado a la sala`);
      });
      
      console.log('User > ' + JSON.stringify(user));
      showInfo(user);
    } else {
    // No estamos logueados esconder 'Cerrar Sesión'
      loggedIn.classList.add('d-none');
      firstSection.style.display = 'block';
    }
  });
}

// Función de registro
function register() {
  const emailValue = loginUser.value;
  const passwordValue = loginPass.value;
  firebase.auth().createUserWithEmailAndPassword(emailValue, passwordValue)
    .then(function() {
      loginUser.value = '';
      loginPass.value = '';
    })
    .catch((error) => {
      console.log('Error de firebase > ' + error.code);
      console.log('Error de firebase, mensaje > ' + error.message);
      alert('email invalido o contraseña invalida');
      if (emailValue.length < 1 || passwordValue.length < 1) {
        alertLogin.style.display = 'block';
      }
    });
}

// Funcion de ingreso
function login() {
  const emailValue = email.value;
  const passwordValue = password.value;
  loginAlert.style.display = 'none';
  firebase.auth().signInWithEmailAndPassword(emailValue, passwordValue)
    .then(() => {
      firstSection.style.display = 'none';
      wall.classList.remove('d-none');
      loggedIn.classList.remove('d-none');
      avatarPic.src = user.photoURL;
      console.log('Usuario con login exitoso');
    })
    .catch((error) => {
      if (emailValue.length < 1 || passwordValue.length < 1) {
        loginAlert.style.display = 'block';
      };
      console.log('Error de firebase > ' + error.code);
      console.log('Error de firebase, mensaje > ' + error.message);
      alert('Email o contraseña incorrecta');
    });
}

// Funcion para cerrar sesión
function logout() {
  firebase.auth().signOut()
    .then(() => {
      console.log('chao');
      profile.classList.add('d-none');
      wall.classList.add('d-none');
      loggedIn.classList.add('d-none');
      location.reload();
    })
    .catch();
  return usersRemove();
};

// Funcion ingresar con Facebook
function loginFacebook() {
  const provider = new firebase.auth.FacebookAuthProvider();
  // provider.addScope("user_birthday"); tienen que pedirle permiso a facebook
  provider.setCustomParameters({
    'display': 'popup'
  });
  firebase.auth().signInWithPopup(provider)
    .then(() => {
      console.log('Login con facebook');
    })
    .catch((error) => {
      console.log('Error de firebase > ' + error.code);
      console.log('Error de firebase, mensaje > ' + error.message);
    });
};

// Funcion ingresar con Google
function loginGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const token = result.credential.accessToken;
      // The signed-in user info.
      const user = result.user;
    }).catch((error) => {
      // Handle Errors here.
      console.log('Error de Firebase ' + error.code);
      console.log('Error de Firebase, Message ' + error.message);
      // The email of the user's account used.
      const emailError = error.email;
      console.log('Error email esta en uso ' + emailError);
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;
      console.log('Error ' + credential);
    });
}

function usersAdd(uid, name) {
  const online = userConect.push({
    uid: uid,
    name: name
  });
  conectKey = online.key;
}

function usersRemove() {
  firebase.database().ref(`/users-conect/${conectKey}`).remove();
}