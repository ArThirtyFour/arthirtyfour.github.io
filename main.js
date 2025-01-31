function nabor(text, callback, time_pause, display_time) {
    let index = 0;
    let animka = document.getElementById('animka');

    function type() {
        if (index < text.length) {
            animka.innerHTML = text.substring(0, index + 1) + "|";
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
            animka.innerHTML = text.substring(0, index1) + "|";
            setTimeout(removeChar, time_pause);
        } else {
            callback();
        }
    }

    type();
}

function random_vibor() {
    let spisok = ['Python + JS Dev', 'Full stack enjoyer', 'Windows + Arch user','Напишу сюда.. например', 'Я рыгнул'];
    let i = 0;
    let time_pause = 100;
    let display_time = 1500;

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

random_vibor();