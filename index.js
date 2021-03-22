const debounce = (fn, debounceTime) => {
  let timeout
  
  return function(...args) {
      clearTimeout(timeout)
      
      timeout = setTimeout(() => fn.apply(this, args), debounceTime)
  }
}

function removeCard(evt) {
  const card = evt.target.closest('.card')
  card.remove()
}

function removeSearchItems() {
  const searchItems = document.querySelectorAll('.search-item')
  if (searchItems) {
    for (let item of searchItems) {
      item.remove()
    }
  }
}

function createSearchItem(item) {
  if (item) {
    const btnSearch = document.createElement('button')
    btnSearch.classList.add('search-item')
    btnSearch.dataset.id = item.id
    btnSearch.textContent = item.name

    return btnSearch
  }
}

function addSearchItems(repos) {
  removeSearchItems()
  const search = document.querySelector('.search')

  for (let i = 0; i < 5; i++) {
    const item = createSearchItem(repos[i])
    search.insertAdjacentElement('beforeend', item)
  }

  search.addEventListener('click', searchItem)
}

function createCard(item) {
  item = item[0]
  const divCard = document.createElement('div')
  divCard.classList.add('card')
  const divContent = document.createElement('div')
  divContent.classList.add('content')
  const btn = document.createElement('button')
  btn.classList.add('btn-close')
  const pName = document.createElement('p')
  pName.textContent = `Name: ${item.name}`
  const pOwner = document.createElement('p')
  pOwner.textContent = `Owner: ${item.owner.login}`
  const pStars = document.createElement('p')
  pStars.textContent = `Stars: ${item.stargazers_count}`

  divContent.appendChild(pName)
  divContent.appendChild(pOwner)
  divContent.appendChild(pStars)
  divCard.appendChild(divContent)
  divCard.appendChild(btn)

  return divCard
}

function addCard(item) {
  const fragment = createCard(item)
  const container = document.querySelector('.container')
  
  container.insertAdjacentElement('beforeend', fragment)
  removeSearchItems()

  const input = document.querySelector('.input-text')
  input.value = ''

  const btn = container.querySelectorAll('.btn-close')
  for(let i of btn) {
    i.addEventListener('click', removeCard)
  }
}

async function searchRepo(repoName) {
  if (repoName) {
    const url = `https://api.github.com/search/repositories?q=${repoName}`
    
    return await fetch(url).then(response => {
      if (response.ok) {
        response.json().then(repos => addSearchItems(repos.items))
      } else if (response.status === 403) {
        alert('403 Error')
      }
    })
  } else {
    removeSearchItems()
  }
}

async function searchRepoItemById(repoName, repoId) {
  if (repoName) {
    const url = `https://api.github.com/search/repositories?q=${repoName}`
    return await fetch(url).then(response => {
      if (response.ok) {
        response.json().then(repos => repos.items.filter(item => item.id === repoId)).then(addCard)
      } else if (response.status === 403) {
        alert('403 Error')
      }
    })
  } else {
    removeSearchItems()
  }
}

function searchItem(evt) {
  const value = evt.target.innerHTML
  const id = +evt.target.dataset.id

  searchRepoItemById(value, id)
}

function search(evt) {
  const value = evt.target.value

  searchRepo(value)
}

search = debounce(search, 500)

const input = document.querySelector('.input-text')
input.addEventListener('keyup', search)