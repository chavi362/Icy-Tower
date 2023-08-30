function updateHeloUser() {
    currentUser=JSON.parse(sessionStorage.getItem('currentUser'));
    let spanFName = document.getElementById('user-first-name');
    spanFName.innerHTML = "hello "+currentUser.firstName;
    let spanUserName = document.getElementById('user-name');
    spanUserName.innerHTML = currentUser.userName;
}
updateHeloUser();