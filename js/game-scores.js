let setArr = [];
let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
function updateScores() {
  let arrOfObjects = [];
  for (let i = 0; i < 3; i++) {
    let highScore = JSON.parse(localStorage.getItem('towerOneHighScore' + i));
    if (!highScore)
      arrOfObjects.push({
        name: currentUser.firstName,
        userName: currentUser.userName,
        score: 0,
      });
    else arrOfObjects.push(highScore);
  }
  let foundSecond = false;
  console.log(arrOfObjects);
  const scoreToPut = {
    firstName: currentUser.firstName,
    userName: currentUser.userName,
    score: currentUser.highScore,
  };
  let j = 0;
  console.log(currentUser.secondScore);
  for (let i = 0; i < 3; i++) {
    console.log(scoreToPut.score);
    if (!foundSecond && currentUser.secondScore > scoreToPut.score) {
      console.log('second inserting');
      foundSecond = true;
      if (
        arrOfObjects[j].userName == currentUser.userName &&
        arrOfObjects[j].userName == currentUser.secondScore
      ) {
        j++;
        i++;
        continue;
      }
      if (currentUser.secondScore > arrOfObjects[j]['score']) {
        setArr.push({
          name: currentUser.firstName,
          userName: currentUser.userName,
          score: currentUser.secondScore,
        });
      } else {
        setArr.push(arrOfObjects[j]);
        j++;
      }
    } else {
      if (
        arrOfObjects[j].userName == scoreToPut.userName &&
        arrOfObjects[j].userName == scoreToPut.score
      ) {
        j++;
        i++;
        continue;
      }
      if (scoreToPut.score > arrOfObjects[j]['score']) {
        setArr.push({
          name: scoreToPut.firstName,
          userName: scoreToPut.userName,
          score: scoreToPut.score,
        });
        scoreToPut.score = arrOfObjects[j]['score'];
        scoreToPut.userName = arrOfObjects[j]['userName'];
        scoreToPut.firstName = arrOfObjects[j]['name'];
      } else {
        setArr.push(arrOfObjects[j]);
        j++;
      }
    }
  }
  let i = 0;
  while (i < setArr.length && i < 3) {
    localStorage.setItem('towerOneHighScore' + i, JSON.stringify(setArr[i]));
    i++;
  }
}
updateScores();
function updateScoreInHtml() {
  let arrOfObjects = [];
  for (let i = 0; i < 3; i++) {
    let highScore = JSON.parse(localStorage.getItem('towerOneHighScore' + i));
    if (!highScore)
      arrOfObjects.push({
        name: currentUser.firstName,
        userName: currentUser.userName,
        score: 0,
      });
    else arrOfObjects.push(highScore);
  }
  console.log(arrOfObjects);
  let firstHighScore = document.getElementById('their-first');
  firstHighScore.innerHTML =
    '1-' +
    arrOfObjects[0]['name'] +
    ' ' +
    arrOfObjects[0]['userName'] +
    ' : ' +
    arrOfObjects[0].score;
  let secondHighScore = document.getElementById('their-second');
  secondHighScore.innerHTML =
    '2-' +
    arrOfObjects[1]['name'] +
    ' ' +
    arrOfObjects[1]['userName'] +
    ' : ' +
    arrOfObjects[1].score;
  let thirdHighScore = document.getElementById('their-third');
  thirdHighScore.innerHTML =
    '3-' +
    arrOfObjects[2]['name'] +
    ' ' +
    arrOfObjects[2]['userName'] +
    ' : ' +
    arrOfObjects[2].score;
  let yourHigh = document.getElementById('your-high-score');
  yourHigh.innerHTML = 'your highest score :' + currentUser.highScore;
  let yourSecond = document.getElementById('your-second-score');
  yourSecond.innerHTML = 'your second score :' + currentUser.secondScore;
}
updateScoreInHtml();
