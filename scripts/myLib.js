import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js'
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc
} from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB72E8OuZZpzBt8GTQHDzfrFY56HVNslVs',
  authDomain: 'cris-app-5a21f.firebaseapp.com',
  projectId: 'cris-app-5a21f',
  storageBucket: 'cris-app-5a21f.appspot.com',
  messagingSenderId: '29953400526',
  appId: '1:29953400526:web:d16c29f2e0b24c21087a9f'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

onAuthStateChanged(auth, user => {
  console.log(user)
  if (user) {
    userInfo(user)
  } else {
    alert('Você precisa logar')
    window.location.href = 'index.html'
  }
})

let minhaLib = document.querySelector('.minhaLib')
minhaLib.innerHTML = '<h3>Carregando seus livros...</h3>'

setTimeout(() => {
  minhaLib.innerHTML = ''
  onSnapshot(collection(db, 'myLibrary'), res => {
    if (res.empty) {
      minhaLib.innerHTML = '<h3>Nenhum livro encontrado</h3>'
    }
    res.docs.map(data => {
      let q = data.data().info_book

      fetch(q)
        .then(res => {
          res
            .json()
            .then(res => {
              showLibrary(res, data.id)
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(err => {
          console.log(err)
        })
    })
  })
}, 1000)

function showLibrary(res, id) {
  let boxMinhaLib = document.querySelector('.minhaLib')
  boxMinhaLib.style.display = 'flex'

  let photo
  let description

  if (res.volumeInfo.imageLinks) {
    photo = res.volumeInfo.imageLinks.thumbnail
  } else {
    photo =
      'https://bookstoreromanceday.org/wp-content/uploads/2020/08/book-cover-placeholder.png'
  }

  if (res.volumeInfo.description) {
    description = res.volumeInfo.description.substring(0, 100)
  } else {
    description = 'No description Avaliable'
  }

  boxMinhaLib.innerHTML += `
    <ul class="card-wrapper">
        <li class="card">
          <h3>${res.volumeInfo.title}</h3>
          <p>${description}...</p>
          <p><a href='${res.volumeInfo.infoLink}' target="_blank" >Saiba mais...</a></p>
          <button class="btn-add-remove" id="btn-remove" delete-id="${id}">Remover da biblioteca</button>
        </li>
        <img src='${photo}' alt='Capa do livro'class="cover">
    </ul>
   `
  //adiciona o evento de click para o botão remover
  const del_element = document.querySelectorAll('#btn-remove')
  del_element.forEach(button => {
    button.addEventListener('click', removeBook)
  })
}

async function removeBook(e) {
  document.querySelector('.minhaLib').innerHTML = ''
  const id_book = e.target.getAttribute('delete-id')
  await deleteDoc(doc(db, 'myLibrary', id_book))
    .then(res => {
      alert('Deletado ')
    })
    .catch(err => {
      alert(err)
    })
}

function userInfo(info) {
  //informações do user, colocar em uma função só pra isso depois
  let user_photo = document.querySelector('.user_photo')
  user_photo.style.backgroundImage = `url(${info.photoURL})`
  onSnapshot(collection(db, 'myLibrary'), res => {
    const user_info = document.querySelector('.user_book_info')

    user_info.innerHTML = `
      <p><b>${info.displayName}</b></p>
      <p>Books Read: <b>4</b></p>
      <p>Books at library: <b>${res.docs.length}</b></p>
      <p>Reading Now: <b>The Hobbit</b></p>
      `
  })
}
let btn_sair = document.querySelector('.log-out')

btn_sair.addEventListener('click', logOut)

function logOut() {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      botao.style.display = 'block'
      header.style.display = 'none'
      main.style.display = 'none'
    })
    .catch(error => {
      // An error happened.
    })
}
