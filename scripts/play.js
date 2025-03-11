const fon = new Audio("bg.mp3");

function play() {
    document.getElementById('da').style.display = 'none';
    setTimeout(() => {
      document.getElementsByClassName('main')[0].style.display = 'block';
      fon.play()
    },100)
    .then(() => {
        console.log('Музыка воспроизводится');
    })
    .catch(error => {
      console.error('Ошибка воспроизведения: ', error);
      console.warn('Воспроизведение заблокировано браузером.  Возможно, требуется взаимодействие пользователя.');
    });
}

