// Import the functions you need from the SDKs you need
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
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
  onAuthStateChanged
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

const provider = new GoogleAuthProvider()

let header = document.querySelector('header')
let main = document.querySelector('main')
let telaLogin = document.querySelector('.login')
header.style.display = 'none'
main.style.display = 'none'
let botao = document.querySelector('.btn-logar')

botao.addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then(result => {
      if (result) {
        console.log(result.user.uid)
      }
    })
    .catch(error => {
      console.log(error)
    })
})

onAuthStateChanged(auth, user => {
  console.log(user)
  if (user) {
    userInfo(user)
    botao.style.display = 'none'
    telaLogin.style.display = 'none'
    header.style.display = 'flex'
    main.style.display = 'flex'
  }
})

// Pega o input do usuario e botao

const search = document.querySelector('.btn-search')

search.addEventListener('click', getBooks)

//faz um fecth na api google books
function getBooks() {
  let input = document.querySelector("input[name='search-books']").value

  if (input != '') {
    const apiKey = 'AIzaSyAzew68YjzDmai6uwH16ADtOhHCed3jN0o'
    const url = `https://www.googleapis.com/books/v1/volumes?q=${input}&key=${apiKey}&maxResults=20`
    fetch(url)
      .then(res => {
        return res.json()
      })
      .then(result => {
        showResults(result.items)
      })
      .catch(error => {
        console.log(error)
      })
  } else {
    alert('Digite algo...')
  }
}

//mostra na tela os resultados pesquisados na api google books
function showResults(result) {
  let box = document.querySelector('.results')

  document.querySelector('.minhaLib').style.display = 'none'
  box.style.display = 'flex'
  box.innerHTML = ' '
  result.forEach(el => {
    let algo = {
      nome: 's'
    }
    let photo
    let description

    if (el.volumeInfo.imageLinks && el.volumeInfo.description) {
      photo = el.volumeInfo.imageLinks.thumbnail
      description = el.volumeInfo.description.substring(0, 100)
    } else {
      photo =
        'https://bookstoreromanceday.org/wp-content/uploads/2020/08/book-cover-placeholder.png'
      description = 'No description Avaliable'
    }

    box.innerHTML += `
          <ul class="card-wrapper">
            <li class="card">
              <h3>${el.volumeInfo.title}</h3>
              <p>${description}...</p>
              <p><a href='${el.volumeInfo.infoLink}' target="_blank" >Saiba mais...</a></p>
              <button class="btn-add-remove" id="btn-add" id-book="${el.selfLink}">Adicionar a biblioteca</button>
            </li>
            <img src='${photo}'  alt='Capa do livro' class="cover">
          </ul>
         `
  })

  //pega todos os botões de adicionar a biblioteca
  const add = document.querySelectorAll('#btn-add')
  //adicona um evento de click pra todos
  add.forEach(btn => {
    btn.addEventListener('click', saveBooks)
  })
}

// salva o link de informaçãp dos livros no banco de dados
async function saveBooks(e) {
  const info_book = e.target.getAttribute('id-book')

  await addDoc(collection(db, 'myLibrary'), { info_book })
    .then(res => {
      alert('Adiciondo com sucesso')
      document.querySelector('.minhaLib').style.display = 'none'
    })
    .catch(error => {
      console.log(error)
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
      alert('Deslogado')
      botao.style.display = 'block'
      telaLogin.style.display = 'flex'
      header.style.display = 'none'
      main.style.display = 'none'
    })
    .catch(error => {
      // An error happened.
    })
}

export { userInfo }
