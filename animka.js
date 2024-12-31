function nabor(text, callback, time_pause, display_time) {
    let index = 0;
    let colors = ['red','white']
    let element = document.getElementById('animka');
    let random_color = colors[Math.floor(Math.random() * colors.length)];
    element.style.color = random_color;
    console.log(random_color);
    if (random_color == 'red') {
        element.style.textShadow = "2px 2px 4px rgba(207, 0, 0, 0.5)";
    }
    else {
        element.style.textShadow = "2px 2px 4px rgba(255, 255, 255, 0.5)";
    }

    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, time_pause); 
        } else {
            setTimeout(removeChar, display_time); 
        }
    }

    let index1 = text.length; 

    function removeChar() {
        if (index1 > 0) {
            index1--; 
            element.innerHTML = text.substring(0, index1);
            setTimeout(removeChar, time_pause); 
        } else {
            callback(); 
        }
    }

    type(); 
}


function random_vibor() {
    let spisok = ['Какой то шкильник', 'Массовый GOIDAZVON', '...А что сюда писать?', 'Я рыгнул'];
    let i = 0;
    let time_pause = 100; 
    let display_time = 1000;

    function next() {
        nabor(spisok[i], () => {
            i++; 
            if (i >= spisok.length) {
                i = 0; 
            }
            setTimeout(next, time_pause);
        }, time_pause, display_time);
    }

    next(); 
}


