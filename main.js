function nabor(text, callback, time_pause, display_time) {
    let index = 0;

    function type() {
        if (index < text.length) {
            document.getElementById('animka').innerHTML += text.charAt(index);
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
            document.getElementById('animka').innerHTML = text.substring(0, index1);
            setTimeout(removeChar, time_pause); 
        } else {
            callback(); 
        }
    }

    type(); 
}


function random_vibor() {
    let spisok = ['Python + JS Dev', 'Windows + Arch user', 'Full stack chejik', 'Я рыгнул'];
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
