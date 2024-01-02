let btnOpen = document.querySelector('#open-form');
if (sessionStorage.getItem('currentUser') != null) {
  updateHeloUser();
}
let isFormOpen = false;
btnOpen.addEventListener('click', () => {
  if (isFormOpen) return;
  isFormOpen = true;
  let form = document.querySelector('#login-form');
  if (window.screen.height < 600) form.style.position = 'absolute';
  form.classList.remove('hide');
  let allImg = document.querySelectorAll('img');
  allImg.forEach((img) => (img.style.opacity = 0.5));
});
let btnClose = document.querySelectorAll('.btn-close');
Array.prototype.forEach.call(btnClose, (item) => {
  item.addEventListener('click', closeForm);
});
function closeForm() {
  location.reload();
}
let loginForm = document.querySelector('#change-to-sign');
loginForm.addEventListener('click', changeSituation);
let signForm = document.querySelector('#change-to-login');
signForm.addEventListener('click', changeSituation);
function changeSituation() {
  let signForm = document.querySelector('#sign-in-form');
  signForm.classList.toggle('hide');
  let loginForm = document.querySelector('#login-form');
  if (window.screen.height < 1000) signForm.style.position = 'absolute';
  loginForm.classList.toggle('hide');
}
let cheakLogin = document.querySelector('#login-submit');
cheakLogin.addEventListener('click', cheakLoginValidation);
function cheakLoginValidation(e) {
  e.preventDefault();
  let massege = document.querySelector('#error-massage');
  let password = document.querySelector('#pwd').value;
  let userName = document.querySelector('#email').value;
  console.log(userName);   // Is this a debugging statement?
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
  let loginForm = document.querySelector('#login-form');
  loginForm.classList.toggle('hide');
  updateHeloUser();
}
let verifyPwd = document.querySelector('#verify-pwd');
verifyPwd.addEventListener('input', cheakEqualtoPwd);
function cheakEqualtoPwd() {
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
function addMEssageAboutPassword(message) {
  document.getElementById('message').innerHTML = message;
  document.getElementById('message').style.color = 'red';
}
let password = document.querySelector('#pasword-first');
password.addEventListener('input', cheakPassword);   
password.addEventListener('input', cheakEqualtoPwd);
function cheakPassword() {   // Spelled wrong but not a concern
  let pw = document.querySelector('#pasword-first').value;
  if (pw.length < 8) {
    addMEssageAboutPassword('**Password length must be at least 8 characters');
  } else if (pw.length > 35) {
    addMEssageAboutPassword('**Password length must not exceed 35 characters');
  } else if (pw.search(/\d/) == -1) {
    addMEssageAboutPassword(
      '**Password length must contain at least one number'
    );
  } else if (pw.search(/[a-zA-Z]/) == -1) {
    addMEssageAboutPassword(
      '**Password must contain at least one English letter'
    );
  } else {
    document.getElementById('message').innerHTML = 'This is a strong Password!';
    document.getElementById('message').style.color = 'Green';
    return true;
  }
  return false;
}

let submBtn = document.querySelector('#sign-in-submit');
submBtn.addEventListener('click', saveUser);
function saveUser(e) {
  e.preventDefault();
  document.getElementById('submit-error-message').innerHTML = '';
  let isOk = true;
  if (cheakPassword() == false || cheakEqualtoPwd() == false) {
    isOk = false;
  }
  let firstName = document.querySelector('#first-name').value;
  let pwd = document.querySelector('#pasword-first').value;
  console.log(pwd);
  var inputName = document.getElementsByName('email-user-name')[0];
  let userName = inputName.value;
  console.log(userName);
  if (pwd === '' || firstName === '' || userName === '') {   // Checks like this are unnecesary when you can use say 'required' in its html
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
  let signForm = document.querySelector('#sign-in-form');
  signForm.classList.toggle('hide');
  updateHeloUser();
}
let allImg = document.querySelectorAll('a');
allImg.forEach(function (item) {
  item.addEventListener('click', addMessage);
});

function addMessage(e) {
  console.log('g');
  if (sessionStorage.getItem('currentUser') === null) {
    e.preventDefault();
    let loginMEssage = document.getElementById('you-must-login');
    loginMEssage.style.display = 'block';
  }
}
let closeDiv = document.getElementById('close-modal');
closeDiv.addEventListener('click', () => {
  let loginMEssage = document.getElementById('you-must-login');
  loginMEssage.style.display = 'none';
});
function updateHeloUser() {
  currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  let spanFName = document.getElementById('user-first-name');
  spanFName.innerHTML = 'hello ' + currentUser.firstName;
  let spanUserName = document.getElementById('user-name');
  spanUserName.innerHTML = currentUser.userName;
  btnOpen.classList.add('hide');
  let helloUser = document.getElementById('hello-user');
  helloUser.classList.remove('hide');
  let allImg = document.querySelectorAll('img');
  allImg.forEach((img) => (img.style.opacity = 1));
}
