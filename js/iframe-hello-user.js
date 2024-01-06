function updateHeloUser() {
  currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  let spanFName = document.getElementById('user-first-name');
  spanFName.innerHTML = 'Hello,' + currentUser.firstName;
}
updateHeloUser();
