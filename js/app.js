let themeball = document.querySelector('.theme-switcher-ball');
let themeSwitch = document.querySelector('.theme-switcher');
let calcScreen = document.querySelector('.Calc-Screen');
let calcContent = document.querySelector('.Calc-Content');
let Calc_special_btn = document.querySelectorAll('.Calc-special-btn');
let Calc_delete_btn = document.querySelector('.del-btn');
let equal_btn = document.querySelector('.equal-btn');
let reset_btn = document.querySelector('.reset-btn');
let dot_btn = document.querySelector('.Calc-dot');
let Calc_title = document.querySelectorAll('.Calc-title');
let numbers = document.querySelectorAll('.numbers');
let Calc_numbers = document.querySelectorAll('.Calc-numbers');
let Calc_operations = document.querySelectorAll('.Calc-operations');
console.log(Calc_operations);
let Calcinput = document.querySelector('.calc-input');
let counter = 1;


themeball.onclick = () => {
    if (counter == 1) {
        themeball.style = "margin-left:1.5rem; animation-name: theme-ball; animation-duration: 0.2s; animation-timing-function: linear;";
        themeball.classList.add("light-theme-switcher-ball");
        themeSwitch.classList.add("light-theme-switcher");
        Calc_title.forEach(e => e.classList.add("light-text"));
        numbers.forEach(number => number.classList.add("numbers-light-theme"));
        calcScreen.classList.add("light-Calc-Screen");
        calcContent.classList.add("light-Calc-Content");
        Calc_special_btn.forEach(e => e.classList.add("light-special-btn"));
        equal_btn.classList.add("light-equal-btn");
        Calcinput.classList.add("light-Calc-Screen");
        document.querySelector(".Calculator").classList.add("light");
        counter++;
    }
    else if (counter == 2) {
        themeball.style = "margin-left:3rem; animation-name: theme-2; animation-duration: 0.2s; animation-timing-function: linear;";
        themeball.classList.add("dark-theme-switcher-ball");
        themeSwitch.classList.add("dark-theme-switcher");
        Calc_title.forEach(e => e.classList.add("dark-text"));
        numbers.forEach(number => number.classList.add("numbers-dark-theme"));
        calcScreen.classList.add("dark-Calc-Screen");
        calcContent.classList.add("dark-Calc-Content");
        Calc_special_btn.forEach(e => e.classList.add("dark-special-btn"));
        equal_btn.classList.add("dark-equal-btn");
        Calcinput.classList.add("dark-Calc-Screen");
        document.querySelector(".Calculator").classList.add("dark");
        themeball.classList.remove("light-theme-switcher-ball");
        themeSwitch.classList.remove("light-theme-switcher");
        Calc_title.forEach(e => e.classList.remove("light-text"));
        numbers.forEach(number => number.classList.remove("numbers-light-theme"));
        calcScreen.classList.remove("light-Calc-Screen");
        calcContent.classList.remove("light-Calc-Content");
        Calc_special_btn.forEach(e => e.classList.remove("light-special-btn"));
        equal_btn.classList.remove("light-equal-btn");
        Calcinput.classList.remove("light-Calc-Screen");
        document.querySelector(".Calculator").classList.remove("light");
        counter++;
    } else {
        themeball.style = "margin-left:0rem; animation-name: theme-3; animation-duration: 0.2s; animation-timing-function: linear;";
        themeball.classList.remove("dark-theme-switcher-ball");
        themeSwitch.classList.remove("dark-theme-switcher");
        Calc_title.forEach(e => e.classList.remove("dark-text"));
        numbers.forEach(number => number.classList.remove("numbers-dark-theme"));
        calcScreen.classList.remove("dark-Calc-Screen");
        calcContent.classList.remove("dark-Calc-Content");
        Calc_special_btn.forEach(e => e.classList.remove("dark-special-btn"));
        equal_btn.classList.remove("dark-equal-btn");
        Calcinput.classList.remove("dark-Calc-Screen");
        document.querySelector(".Calculator").classList.remove("dark");
        counter = 1;
    }
}


let clickednumber;
let clickedoperation;

Calc_numbers.forEach(number => {
    number.addEventListener('click', () => {
        if (Calcinput.value == 0) {
            Calcinput.value = "";
            clickednumber = number.textContent;
            Calcinput.value += clickednumber;
        } else {
            clickednumber = number.textContent;
            Calcinput.value += clickednumber;
        }

    })

});

Calc_operations.forEach(operation => {
    operation.addEventListener('click', () => {
        clickedoperation = operation.textContent;
        Calcinput.value += clickedoperation;
    })
});

Calcinput.addEventListener('input', () => {
    const inputValue = Calcinput.value;
    const lastCharacter = inputValue[inputValue.length - 1];
    const validOperations = ['+', '-', '*', '/', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

    if (!(validOperations.includes(lastCharacter))) {
        Calcinput.value = inputValue.slice(0, -1);
    }
});

Calc_delete_btn.onclick = () => {
    Calcinput.value = Calcinput.value.slice(0, -1);
}

equal_btn.onclick = () => {
    const expression = Calcinput.value;
    let result;

    try {
        result = eval(expression);
        if (!isFinite(result) || isNaN(result)) {
            Calcinput.value = 'Math Error';
        } else {
            Calcinput.value = result;
        }
    } catch (error) {
        Calcinput.value = 'Math Error';
    }
};

reset_btn.onclick = () => {
    Calcinput.value = 0;
}

dot_btn.onclick = () => {
    Calcinput.value += ".";
}
