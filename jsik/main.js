function perevod (date) {
    let a = {
        1: 'Января',
        2: 'Февраля',
        3: 'Марта',
        4: 'Апреля',
        5: 'Мая',
        6: 'Июня',
        7: 'Июля',
        8: 'Августа',
        9: 'Сентября',
        10: 'Октября',
        11: 'Ноября',
        12: 'Декабря'
    };
    return a[date]
}


function getdate () {
    let all_c = document.getElementsByClassName('infa')[0];
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds()
    
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    
    let full_date = day +' '+  perevod(month) +' ' + year + ' года' 
    
    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    
    
    
    
    let text = 'Сейчас время -' + ' ' + hours + ':' + minutes + ':' + seconds;
    let time_c = document.createElement('div');
    time_c.className = 'credit'
    time_c.innerText = text;

    let date_c = document.createElement('div');
    date_c.className = 'credit'
    date_c.innerText = 'Сегодня: ' + full_date;

    all_c.appendChild(time_c);
    let br1 = document.createElement('br');
    let br2 = document.createElement('br');
    all_c.appendChild(br1);
    all_c.appendChild(br2);

    all_c.appendChild(date_c);

}


function update_time () {
    let element = document.getElementsByClassName('credit')[0];
    setInterval(() => {
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        let text = 'Сейчас время -' + ' ' + hours + ':' + minutes + ':' + seconds;
        element.innerText = text;
        
    }, 1000); 
}



