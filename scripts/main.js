// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js'
import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
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
        console.log(result.items)
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
  message('Carregando...', box)
  box.innerHTML = ' '

  result.forEach(el => {
    let photo
    let description

    if (el.volumeInfo.imageLinks && el.volumeInfo.description) {
      photo = el.volumeInfo.imageLinks.thumbnail
      description = el.volumeInfo.description.substring(0, 100)
    } else {
      photo =
        'https://patriciaelias.com.br/wp-content/uploads/2021/01/placeholder.png'
      description = 'No description Avaliable'
    }

    box.innerHTML += `
          <ul class="card-wrapper">
            <li class="card">
              <h3>${el.volumeInfo.title}</h3>
              <p>${description}...</p>
              <p><a href='${el.volumeInfo.infoLink}' target="_blank" >Saiba mais...</a></p>
              <button id="btn-add" id-book="${el.selfLink}">Adicionar a biblioteca</button>
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
      console.log('Adiciondo com sucesso')
    })
    .catch(error => {
      console.log(error)
    })
  console.table(info_book)
}

// Recupera o link pessoal de cada livro do firebase e da um fetch neles

const recupera = await getDocs(collection(db, 'myLibrary'))

//informações do user, colocar em uma função só pra isso depois
const user_info = document.querySelector('.user_book_info')
let algo = Object.keys(recupera.docs).length
user_info.innerHTML = `
<p><b>Artur Calderon</b></p>
<p>Books Read:</p>
<p>Books at library: <b>${algo}</b></p>
<p>Reading Now:</p>
`

recupera.forEach(element => {
  const q = element.data().info_book

  fetch(q)
    .then(res => {
      res
        .json()
        .then(res => {
          showLibrary(res)
        })
        .catch(err => {
          console.log(err)
        })
    })
    .catch(err => {
      console.log(err)
    })
})

function showLibrary(res) {
  const boxMyBooks = document.querySelector('.show-library')

  boxMyBooks.addEventListener('click', () => {
    let boxResults = document.querySelector('.results')

    let photo
    let description

    if (res.volumeInfo.imageLinks) {
      photo = res.volumeInfo.imageLinks.thumbnail
    } else {
      photo =
        'https://patriciaelias.com.br/wp-content/uploads/2021/01/placeholder.png'
    }

    if (res.volumeInfo.description) {
      description = res.volumeInfo.description.substring(0, 100)
    } else {
      description = 'No description Avaliable'
    }
    boxResults.innerHTML += `
      <ul class="card-wrapper">
          <li class="card">
            <h3>${res.volumeInfo.title}</h3>
            <p>${description}...</p>
            <p><a href='${res.volumeInfo.infoLink}' target="_blank" >Saiba mais...</a></p>
            <button id="btn-add">Remover da biblioteca</button>
          </li>
          <img src='${photo}'  alt='Capa do livro'class="cover">
      </ul>
     `
  })
}
function message(message, el) {
  return (el.innerHTML = message)
}
