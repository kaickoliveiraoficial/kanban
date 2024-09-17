//CRIA, REMOVE, ATUALIZA E PUXA OS ELEMENTOS
const inputH3 = document.querySelector(".input-h3");
const inputP = document.querySelector(".input-p");
const addCard = document.querySelector(".add-card");
const inputWrapper = document.querySelector(".input-wrapper")
const bgBlur = document.querySelector(".blur-background")

const cardsList = document.querySelector(".cards");
const allCardsList = document.querySelector(".kanban");

//Muda o estilo do display da div que adiciona os elementos
function addElement() {
  inputWrapper.style.display = "grid";
  bgBlur.style.display = "block";
}

//Verifica se o inputH3 está vazio
const validateInput = () => {
  return inputH3.value.trim().length > 0;
}

//Adiciona os elementos
const handleAddProduct = () => {
  const inputIsValid = validateInput();

  //Adiciona uma classe na div do input caso ele esteja vazio
  if (!inputIsValid) {
    return inputWrapper.classList.add("error");
  }

  //Cria a div pai do elemento
  const cardAll = document.createElement("div");
  cardAll.classList.add("card");
  cardAll.setAttribute("draggable", true);

  //Cria a div do h3 e do delete
  const top = document.createElement("div");
  top.classList.add("top");

  //H3 title
  const h3 = document.createElement("h3");
  h3.innerText = inputH3.value;

  //Delete button
  const deleteCard = document.createElement("button");
  deleteCard.classList.add("delete")

  //Delete Icon
  const deleteIcon = document.createElement("ion-icon");
  deleteIcon.setAttribute("name", "trash-bin");

  //P description
  const p = document.createElement("p");
  p.innerText = inputP.value;

  //Event listener para o click no delete button
  deleteCard.addEventListener("click", () =>
    handleDeleteClick(cardAll)
  );

  //Append child(cascateia os elementos dentro da div)
  cardAll.appendChild(top);
  cardAll.appendChild(p);

  top.appendChild(h3);
  top.appendChild(deleteCard);

  deleteCard.appendChild(deleteIcon);

  cardsList.appendChild(cardAll);

  //Event listener para o drag and drop
  cardAll.addEventListener('dragstart', dragstart);
  cardAll.addEventListener('drag', drag);
  cardAll.addEventListener('dragend', dragend);

  //Limpa os inputs depois de adicionar o elemento
  inputH3.value = "";
  inputP.value = "";

  //Muda o estilo do display da div que adiciona os elementos
  inputWrapper.style.display = "none";
  bgBlur.style.display = "none";

  //Atualiza o local storage
  updateLocalStorage();
};

//Chama o event listener e realiza o delete
const handleDeleteClick = (cardAll) => {
  cardAll.remove();
  updateLocalStorage();
};

//Verifica se o valor do input é diferente de zero para remover a classe de erro
const handleInputChange = () => {
  const inputIsValid = validateInput();

  if (inputIsValid) {
    return inputWrapper.classList.remove("error");
  }
};

//Função que atualiza o local storage(junto com o drag and drop)
const updateLocalStorage = () => {
  const dropzones = document.querySelectorAll('.cards');

  const localStorageCards = [];

  dropzones.forEach((dropzone) => {
    const cards = dropzone.children;

    [...cards].forEach((card) => {
      const top = card.querySelector("div");
      const h3 = top.querySelector("h3");
      const p = card.querySelector("p");

      //Cria um objeto para armazenar os dados do elemento no local storage
      if (h3 && p) {
        localStorageCards.push({
          title: h3.innerText,
          description: p.innerText,
          dropzoneId: dropzone.parentElement.className
        });
      }
    });
  });

  //Armazena os cartões no localStorage
  localStorage.setItem("cards", JSON.stringify(localStorageCards));
};

//Puxa os dados do local storage depois de um refresh na pagina e recria todos os elementos com as informações existentes
const refreshCardsUsingLocalStorage = () => {
  const cardsFromLocalStorage = JSON.parse(localStorage.getItem("cards"));

  if (!cardsFromLocalStorage) return;

  for (const card of cardsFromLocalStorage) {
    const cardAll = document.createElement("div");
    cardAll.classList.add("card");
    cardAll.setAttribute("draggable", true);

    const top = document.createElement("div");
    top.classList.add("top");

    const h3 = document.createElement("h3");
    h3.innerText = card.title;

    const deleteCard = document.createElement("button");
    deleteCard.classList.add("delete");

    const deleteIcon = document.createElement("ion-icon");
    deleteIcon.setAttribute("name", "trash-bin");

    const p = document.createElement("p");
    p.innerText = card.description;

    deleteCard.addEventListener("click", () =>
      handleDeleteClick(cardAll)
    );

    cardAll.appendChild(top);
    cardAll.appendChild(p);

    top.appendChild(h3);
    top.appendChild(deleteCard);

    deleteCard.appendChild(deleteIcon);

    //Coloca o elemento na sua devida dropzone
    const dropzone = [...document.querySelectorAll('.cards')].find(dz => dz.parentElement.classList.contains(card.dropzoneId));
    if (dropzone) {
      dropzone.appendChild(cardAll);
    }

    cardAll.addEventListener('dragstart', dragstart);
    cardAll.addEventListener('drag', drag);
    cardAll.addEventListener('dragend', dragend);
  }
};

//Realiza a função refresh usando o local storage
refreshCardsUsingLocalStorage();

//Event listener para o click no button de adicionar alemento
addCard.addEventListener("click", () => handleAddProduct());

//Event  listener para o change nos inputs
inputH3.addEventListener("change", () => handleInputChange());


// DRAG AND DROP API
const cards = document.querySelectorAll('.card')
const dropzones = document.querySelectorAll('.cards');

//Event listener(dragstart, drag e dragend)
cards.forEach((card) => {
  card.addEventListener('dragstart', dragstart)
  card.addEventListener('drag', drag)
  card.addEventListener('dragend', dragend)
})

//Função que inicia o drag
function dragstart() {
  //Adiciona uma classe nas dropzones quando o carregamento é iniciado
  dropzones.forEach(dropzone => dropzone.classList.add('highlight'));

  //Adiciona uma classe no elemento que esta sendo carregado
  this.classList.add('is-dragging');

  //Atualiza o local storage
  updateLocalStorage();
}

function drag() { }

//Função que finazila o drag
function dragend() {
  //Remove uma classe nas dropzones quando o carregamento é finalizado
  dropzones.forEach(dropzone => dropzone.classList.remove('highlight'));

  //Remove uma classe no elemento que estava sendo carregado
  this.classList.remove('is-dragging');

  updateLocalStorage();
}

//Event listener(dragenter, dragover, dragleave e drop)
dropzones.forEach((dropzone) => {
  dropzone.addEventListener('dragenter', dragenter);
  dropzone.addEventListener('dragover', dragover);
  dropzone.addEventListener('dragleave', dragleave);
  dropzone.addEventListener('drop', drop);
});

function dragenter() { }

//Função que verifica se o elemento está em cima de uma dropzone
function dragover(event) {
  //Evita o comportamento padrão de não permitir o drop
  event.preventDefault();

  //Adiciona uma classe para que o elemento apareça como um ghost para visualização na dropzone
  this.classList.add('over');

  const cardBeingDragged = document.querySelector('.is-dragging');

  //Adiona o ghost na dropzone
  if (cardBeingDragged) {
    this.appendChild(cardBeingDragged);
  }

  updateLocalStorage();
}

//Função que remove o ghost da dropzone
function dragleave() {
  this.classList.remove('over');
}

//Função que remove as classes over e is-dragging para finalizar o dragging
function drop() {
  this.classList.remove('over');

  const cardBeingDragged = document.querySelector('.is-dragging');
  if (cardBeingDragged) {
    cardBeingDragged.classList.remove('is-dragging');

    updateLocalStorage();
  }
}

//CHANGE WORKSPACE
const change = document.querySelector(".change-workspace");
const inputChange = document.querySelector(".input-change");
const buttonChange = document.querySelector(".change-button");
const h1 = document.querySelector(".workspace");

// Função para salvar o valor do h1 no localStorage
const saveWorkspaceTitleToLocalStorage = (title) => {
  localStorage.setItem("workspaceTitle", title);
}

// Função para carregar o valor do h1 do localStorage
const loadWorkspaceTitleFromLocalStorage = () => {
  const savedTitle = localStorage.getItem("workspaceTitle");
  if (savedTitle) {
    h1.innerText = savedTitle;
    addPencilButton();
  }
}

//Muda o estilo do display da div que muda o h1
function changeElement() {
  change.style.display = "grid";
  bgBlur.style.display = "block";
}

//Verifica se o inputChange está vazio
const validateInputChange = () => {
  return inputChange.value.trim().length > 0;
}

const addPencilButton = () => {
  //Cria um button e adiciona o atributo onclick com a função changeElement()
  const buttonPencil = document.createElement("button");
  buttonPencil.setAttribute("onclick", "changeElement()")

  //Cria um img e adiciona o atributo src com a imagem da pencil
  const imgPencil = document.createElement("img")
  imgPencil.setAttribute("src", "assets/pencil.svg")

  //Cascateia os elementos criados acima
  buttonPencil.appendChild(imgPencil);
  h1.appendChild(buttonPencil);
}

//Muda o h1
const handleChangeWorkspace = () => {
  const inputIsValidInChange = validateInputChange();

  if (!inputIsValidInChange) {
    return change.classList.add("error");
  }

  //Pega o valor do inputChange e substitui o valor do h1 para o que estava no input
  h1.innerText = inputChange.value;

  addPencilButton()

  // Salva o novo valor do h1 no localStorage
  saveWorkspaceTitleToLocalStorage(inputChange.value);

  //Limpa o input
  inputChange.value = "";

  //Fecha as div's
  change.style.display = "none";
  bgBlur.style.display = "none";
}

//Verifica se o valor do input é diferente de zero para remover a classe de erro
const handleInputInChange = () => {
  const inputIsValidInChange = validateInputChange();

  if (inputIsValidInChange) {
    return change.classList.remove("error");
  }
};

loadWorkspaceTitleFromLocalStorage();

buttonChange.addEventListener("click", () => handleChangeWorkspace());
inputChange.addEventListener("change", () => handleInputInChange());

//CHANGE AVATAR
const changeAvatar = document.querySelector(".change-avatar")
const inputAvatar = document.querySelector(".change-avatar-input")
const buttonAvatar = document.querySelector(".change-avatar-button")
const profilePicPage = document.querySelector(".profile-pic-page")
const profilePic = document.querySelector(".profile-pic")

//Função que habilita as div's
function changeElementAvatar() {
  changeAvatar.style.display = "grid";
  bgBlur.style.display = "block";
}

//Evento para trocar a imagem na página e na área de configuração e salvar no local storage
inputAvatar.onchange = function () {
  const file = inputAvatar.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageUrl = e.target.result;
      profilePic.src = imageUrl;
      profilePicPage.src = imageUrl;

      //Salva a imagem no local storage
      localStorage.setItem('avatarImage', imageUrl);
    };
    reader.readAsDataURL(file);
  }
}

function closeAfterSave() {
  changeAvatar.style.display = "none";
  bgBlur.style.display = "none";
}

//Função para carregar a imagem do avatar do localStorage
const loadAvatarFromLocalStorage = () => {
  const savedAvatar = localStorage.getItem('avatarImage');
  if (savedAvatar) {
    profilePic.src = savedAvatar;
    profilePicPage.src = savedAvatar;
  }
}

//Chama a função ao iniciar a página
loadAvatarFromLocalStorage();

//BOTÃO CLOSE
//Função que fecha as div's pop-ups da pagina
function closeDiv() {
  inputWrapper.style.display = "none";
  bgBlur.style.display = "none";
  change.style.display = "none";
  changeAvatar.style.display = "none";

  inputH3.value = "";
  inputP.value = "";
  inputChange.value = "";
}

//TOUCH DRAG AND DROP
let touchStartX = 0;
let touchStartY = 0;
let draggingElement = null;

//Função que inicia o drag no toque
function touchstart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
  
  draggingElement = event.target.closest('.card');
  draggingElement.classList.add('is-dragging');

  //Adiciona as classes highlight nas dropzones
  dropzones.forEach(dropzone => dropzone.classList.add('highlight'));
}

//Função que move o elemento enquanto é arrastado
function touchmove(event) {
  if (!draggingElement) return;

  event.preventDefault();

  const touch = event.touches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;

  draggingElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
}

//Função que finaliza o drag no touchend
function touchend(event) {
  if (!draggingElement) return;

  //Verifica qual dropzone está debaixo do elemento
  const touch = event.changedTouches[0];
  const touchEndX = touch.clientX;
  const touchEndY = touch.clientY;

  let dropzone = null;

  dropzones.forEach(dz => {
    const rect = dz.getBoundingClientRect();
    if (
      touchEndX > rect.left &&
      touchEndX < rect.right &&
      touchEndY > rect.top &&
      touchEndY < rect.bottom
    ) {
      dropzone = dz;
    }
  });

  if (dropzone) {
    dropzone.appendChild(draggingElement);
  }

  //Remove as classes e reseta as variáveis
  draggingElement.classList.remove('is-dragging');
  draggingElement.style.transform = '';
  dropzones.forEach(dropzone => dropzone.classList.remove('highlight'));
  
  draggingElement = null;

  //Atualiza o local storage
  updateLocalStorage();
}

//Adiciona os event listeners de touch para cada cartão
cards.forEach((card) => {
  card.addEventListener('touchstart', touchstart, { passive: true });
  card.addEventListener('touchmove', touchmove, { passive: false });
  card.addEventListener('touchend', touchend, { passive: true });
});

//Adiciona os event listeners de touch para cada dropzone
dropzones.forEach((dropzone) => {
  dropzone.addEventListener('touchstart', touchstart, { passive: true });
  dropzone.addEventListener('touchmove', touchmove, { passive: false });
  dropzone.addEventListener('touchend', touchend, { passive: true });
});