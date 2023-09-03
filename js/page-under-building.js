let parameter = new URLSearchParams(document.location.search);
let game = parameter.get('game');
switch (game) {
  case 'train-condu-game3':
    document.body.style.backgroundImage =
      "url('../image/train-condu-game3.jpg')";
    break;
  case 'subwey-sufers-game2':
    document.body.style.backgroundImage =
      "url('../image/subwey-sufers-game2.jpg')";
    break;
  default:
}
