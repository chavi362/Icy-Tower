class Modal {
  constructor(elementId) {
    this.modal = document.getElementById(elementId);
    try{
      this.modal.querySelector('.btn-close-modal').addEventListener('click', ()=>{
        this.hide()
      })
    } catch(e) {}
    
  }
  hide() {
    this.modal.classList.add('hide');
    this.modal.classList.remove('show');
    this.checkAllModalState();
  }
  show() {
    this.modal.classList.add('show');
    this.modal.classList.remove('hide');
    this.checkAllModalState();
  }
  checkAllModalState(){
    let isModalOpen = false;
    const docbody = document.getElementsByTagName('body')[0];
    docbody.classList.remove('modal-open');
    document.querySelectorAll('.modal').forEach((el)=>{
      if(el.classList.contains('show')){
        docbody.classList.add('modal-open');
        isModalOpen = true;
      }
    })

    if(isModalOpen){
      const overlayLayer = document.createElement("div");
      overlayLayer.className = 'modal-overlay';
      docbody.append(overlayLayer);
    } else {
      const overlayLayer = docbody.getElementsByClassName('modal-overlay');
      docbody.removeChild(overlayLayer[0]);
    }
  }
}

const btnOpen = document.querySelector('#open-form');
let verifyPwd = document.querySelector('#verify-pwd');
let password = document.querySelector('#pasword-first');
let submBtn = document.querySelector('#sign-in-submit');
let allImg = document.querySelectorAll('a');
let closeDiv = document.getElementById('close-modal');
let checkLogin = document.querySelector('#login-submit');
const modalList = document.querySelectorAll('div.modal');
const btnToggleForm = document.getElementsByClassName('js-toggle-form');

const modalLogin = new Modal('modal-login');
const modalRegister = new Modal('modal-register');

if (sessionStorage.getItem('currentUser') != null) {
  updateHeloUser();
}

// EVENTS /////////////
Object.keys(btnToggleForm).forEach((i)=>{
  btnToggleForm[i].addEventListener('click', (e)=>{
    modalList.forEach((el)=>{
      if(e.target.dataset.toggleTo === el.dataset.formType){
        el.classList.remove('hide');
        el.classList.add('show');
      } else {
        el.classList.remove('show');
        el.classList.add('hide');
      }
    })
  })
})

btnOpen.addEventListener('click', () => {
  modalLogin.show();
});

closeDiv.addEventListener('click', () => {
  let loginMEssage = document.getElementById('you-must-login');
  loginMEssage.style.display = 'none';
});

allImg.forEach(function (item) {
  item.addEventListener('click', addMessage);
});

submBtn.addEventListener('click', saveUser);
checkLogin.addEventListener('click', checkLoginValidation);
password.addEventListener('input', checkPassword);
password.addEventListener('input', checkEqualtoPwd);
verifyPwd.addEventListener('input', checkEqualtoPwd);

// FUNCTIONS /////////////
function toggleImageOpacity(state){
  const listAllImage = document.querySelectorAll('img');
  if(state){
    listAllImage.forEach((img) => (img.style.opacity = 1));
  } else {
    listAllImage.forEach((img) => (img.style.opacity = 0.5));
  }
}

function checkLoginValidation(e) {
  e.preventDefault();
  let massege = document.querySelector('#error-massage');
  let password = document.querySelector('#pwd').value;
  let userName = document.querySelector('#email').value;
  console.log(userName); // Is this a debugging statement?
  let user = JSON.parse(localStorage.getItem(userName));
  if (user == null || user.password != password) {
    massege.classList.remove('hide');
    return;
  }
  const currentUser = {
    firstName: user['firstName'],
    userName: userName,
    highScore: user.highScore,
    secondScore: user.secondScore,
  };
  sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
  massege.classList.add('hide');
  modalLogin.hide()
  updateHeloUser();
}

function checkEqualtoPwd() {
  let pw = document.querySelector('#pasword-first').value;
  if (pw != document.querySelector('#verify-pwd').value) {
    document.querySelector('#verify-message').classList.remove('hide');
    document.querySelector('#verify-message').style.color = 'red';
    return false;
  } else {
    document.querySelector('#verify-message').classList.add('hide');
    return true;
  }
}

function addMessageAboutPassword(message) {
  document.getElementById('message').innerHTML = message;
  document.getElementById('message').style.color = 'red';
}

function checkPassword() {
  // Spelled wrong but not a concern
  let pw = document.querySelector('#pasword-first').value;
  if (pw.length < 8) {
    addMessageAboutPassword('**Password length must be at least 8 characters');
  } else if (pw.length > 35) {
    addMessageAboutPassword('**Password length must not exceed 35 characters');
  } else if (pw.search(/\d/) == -1) {
    addMessageAboutPassword(
      '**Password length must contain at least one number'
    );
  } else if (pw.search(/[a-zA-Z]/) == -1) {
    addMessageAboutPassword(
      '**Password must contain at least one English letter'
    );
  } else {
    document.getElementById('message').innerHTML = 'This is a strong Password!';
    document.getElementById('message').style.color = 'Green';
    return true;
  }
  return false;
}

function saveUser(e) {
  e.preventDefault();
  document.getElementById('submit-error-message').innerHTML = '';
  let isOk = true;
  if (checkPassword() == false || checkEqualtoPwd() == false) {
    isOk = false;
  }
  let firstName = document.querySelector('#first-name').value;
  let pwd = document.querySelector('#pasword-first').value;
  console.log('pwd', pwd);
  var inputName = document.getElementsByName('email-user-name')[0];
  let userName = inputName.value;
  console.log('userName', userName);
  if (pwd === '' || firstName === '' || userName === '') {
    // Checks like this are unnecesary when you can use say 'required' in its html
    document.getElementById('submit-error-message').innerHTML =
      '**All the field are neccessary';
    isOk = false;
  }
  console.log(localStorage.getItem(userName));
  if (localStorage.getItem(userName) != null) {
    console.log('hffh');
    document.getElementById('submit-error-message').innerHTML =
      '**Sorry, there is already an acount with this email';
    return;
  }
  if (!isOk) return;
  const user = {
    firstName: firstName,
    password: pwd,
    highScore: 0,
    secondScore: 0,
  };
  const currentUser = {
    firstName: firstName,
    userName: userName,
    highScore: 0,
    secondScore: 0,
  };
  console.log(user);
  localStorage.setItem(userName, JSON.stringify(user));
  log = true;
  sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
  modalRegister.hide();
  updateHeloUser();
}

function addMessage(e) {
  console.log('g');
  if (sessionStorage.getItem('currentUser') === null) {
    e.preventDefault();
    let loginMEssage = document.getElementById('you-must-login');
    loginMEssage.style.display = 'block';
  }
}

function updateHeloUser() {
  currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  const spanFName = document.getElementById('user-first-name');
  spanFName.innerHTML = 'hello ' + currentUser.firstName;
  
  const spanUserName = document.getElementById('user-name');
  spanUserName.innerHTML = currentUser.userName;

  btnOpen.classList.add('hide');
  const helloUser = document.getElementById('hello-user');
  helloUser.classList.remove('hide');

  toggleImageOpacity(true);
}