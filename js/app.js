    /* =========================================================
    Modern Calculator
    Safe expression parser
    Keyboard support
    Theme system
    Unary negative numbers
    ========================================================= */


    /* =========================================================
    DOM ELEMENTS
    ========================================================= */

    const body = document.body;
    const screen = document.querySelector(".screen");
    const expressionDisplay = document.querySelector("#expression");
    const calcInput = document.querySelector("#calcInput");
    const keypad = document.querySelector(".keypad");
    const themeSwitcher = document.querySelector("#themeSwitcher");


    /* =========================================================
    CALCULATOR STATE
    ========================================================= */

    const THEME_COUNT = 3;

    let currentTheme =
        Number(localStorage.getItem("calculator-theme")) || 1;

    let expression = "";

    let justCalculated = false;

    let lastExpression = "";


    /* =========================================================
    THEME SYSTEM
    ========================================================= */

    function applyTheme(themeNumber) {

        currentTheme = Math.max(
            1,
            Math.min(THEME_COUNT, themeNumber)
        );

        body.dataset.theme = `theme-${currentTheme}`;

        themeSwitcher.setAttribute(
            "aria-valuenow",
            String(currentTheme)
        );


        const themeColors = {

            1: "#3B4664",

            2: "#E6E6E6",

            3: "#17062A"

        };


        const themeColorMeta =
            document.querySelector(
                'meta[name="theme-color"]'
            );


        if (themeColorMeta) {

            themeColorMeta.setAttribute(
                "content",
                themeColors[currentTheme]
            );

        }


        localStorage.setItem(
            "calculator-theme",
            String(currentTheme)
        );
    }


    /* =========================================================
    THEME SWITCHER
    ========================================================= */

    themeSwitcher.addEventListener(
        "click",
        () => {

            const nextTheme =
                currentTheme === THEME_COUNT
                    ? 1
                    : currentTheme + 1;

            applyTheme(nextTheme);

        }
    );


    /* =========================================================
    LOAD SAVED THEME
    ========================================================= */

    applyTheme(currentTheme);


    /* =========================================================
    DISPLAY
    ========================================================= */

    function updateDisplay() {

        calcInput.value =
            expression || "0";

    }


    /* =========================================================
    ERROR HANDLING
    ========================================================= */

    function showError(message = "Math Error") {

        expression = "";

        expressionDisplay.textContent = message;

        calcInput.value = message;

        screen.classList.remove("is-error");


        /*
            Force the browser to restart
            the shake animation.
        */

        void screen.offsetWidth;

        screen.classList.add("is-error");

        justCalculated = true;
    }


    function clearError() {

        const errorMessages = [
            "Math Error",
            "Syntax Error",
            "Cannot divide by 0"
        ];


        if (
            errorMessages.includes(
                calcInput.value
            )
        ) {

            expression = "";

            expressionDisplay.textContent = "";

            updateDisplay();

            screen.classList.remove(
                "is-error"
            );

        }

    }


    /* =========================================================
    NUMBER INPUT
    ========================================================= */

    function appendNumber(number) {

        clearError();


        /*
            If we just calculated:

            5 + 5 = 10

            and then press:

            7

            start a new expression:

            7
        */

        if (justCalculated) {

            expression = "";

            expressionDisplay.textContent = "";

            justCalculated = false;

        }


        /*
            If somehow appendNumber receives
            a decimal point, use appendDecimal().
        */

        if (number === ".") {

            appendDecimal();

            return;

        }


        expression += number;

        updateDisplay();

    }


    /* =========================================================
    DECIMAL
    ========================================================= */

    function appendDecimal() {

        clearError();


        /*
            After calculating:

            5 + 5 = 10

            then "." should start:

            0.
        */

        if (justCalculated) {

            expression = "0";

            expressionDisplay.textContent = "";

            justCalculated = false;

        }


        /*
            Find the current number.

            Examples:

            12 + 45
            current number = 45

            12 + -45
            current number = -45
        */

        const currentNumber =
            getCurrentNumber();


        /*
            Do not allow:

            5.2.3
        */

        if (
            currentNumber.includes(".")
        ) {

            return;

        }


        /*
            If expression is empty:

            .

            becomes:

            0.
        */

        if (!expression) {

            expression = "0.";

            updateDisplay();

            return;

        }


        /*
            If the expression ends with a
            binary operator:

            5 +

            then:

            5 + 0.
        */

        if (isBinaryOperatorAtEnd()) {

            expression += "0.";

            updateDisplay();

            return;

        }


        /*
            If expression ends with unary "-":

            5 * -

            then:

            5 * -0.
        */

        if (isUnaryMinusAtEnd()) {

            expression += "0.";

            updateDisplay();

            return;

        }


        expression += ".";

        updateDisplay();

    }


    /* =========================================================
    CURRENT NUMBER
    ========================================================= */

    function getCurrentNumber() {

        /*
            Find the last operator.

            Example:

            10 + 25

            returns:

            25
        */

        const match =
            expression.match(
                /(?:^|[+\-*/])(-?(?:\d+\.?\d*|\.\d+))$/
            );


        if (match) {

            return match[1];

        }


        /*
            Fallback for an incomplete expression.
        */

        return expression.split(
            /[+\-*/]/
        ).pop();

    }


    /* =========================================================
    OPERATOR HELPERS
    ========================================================= */

    function isOperator(char) {

        return "+-*/".includes(char);

    }


    function isBinaryOperatorAtEnd() {

        if (!expression) {

            return false;

        }


        const lastChar =
            expression.at(-1);


        if (!isOperator(lastChar)) {

            return false;

        }


        /*
            A "-" directly after another operator
            can be a unary negative sign.

            Example:

            5 * -

            The last "-" is NOT binary.
        */

        if (
            lastChar === "-" &&
            expression.length > 1
        ) {

            const previousChar =
                expression.at(-2);

            if (
                isOperator(previousChar)
            ) {

                return false;

            }

        }


        return true;

    }


    function isUnaryMinusAtEnd() {

        if (
            !expression ||
            expression.at(-1) !== "-"
        ) {

            return false;

        }


        if (expression.length === 1) {

            return true;

        }


        const previousChar =
            expression.at(-2);


        return isOperator(previousChar);

    }


    /* =========================================================
    OPERATORS
    ========================================================= */

    function appendOperator(operator) {

        clearError();


        /*
            If there is no expression:

            "-" is allowed because it means:

            -5
        */

        if (!expression) {

            if (operator === "-") {

                expression = "-";

                justCalculated = false;

                updateDisplay();

            }

            return;

        }


        /*
            If the previous result was calculated,
            allow:

            10 * 5 = 50

            then:

            + 10

            becomes:

            50 + 10
        */

        if (justCalculated) {

            justCalculated = false;

        }


        const lastChar =
            expression.at(-1);


        /*
            =====================================================
            IMPORTANT PART
            =====================================================

            If we have:

            3 *

            and press:

            -

            DO NOT replace "*" with "-".

            Instead create:

            3 * -

            This allows:

            3 * -3
        */

        if (
            isOperator(lastChar)
        ) {

            /*
                Current expression already ends
                with a unary negative sign.

                Example:

                3 * -

                and user presses another operator.

                We need to avoid:

                3 * - *

                or:

                3 * - +

                If the new operator is "-",
                ignore it because the unary minus
                is already there.
            */

            if (
                isUnaryMinusAtEnd()
            ) {

                /*
                    3 * - +  becomes 3 * +

                    3 * - *  becomes 3 * *

                    But:

                    3 * - -

                    keeps the negative sign.
                */

                if (operator === "-") {

                    return;

                }


                /*
                    Remove the unary minus,
                    then replace the previous
                    binary operator.

                    Example:

                    3 * - +

                    becomes:

                    3 +
                */

                expression =
                    expression.slice(0, -2) +
                    operator;

                updateDisplay();

                return;

            }


            /*
                If expression ends with a normal
                binary operator:

                5 +

                pressing "*" should produce:

                5 *
            */

            if (
                operator === "-"
            ) {

                /*
                    THIS is the important behavior:

                    3 *

                    + "-"

                    =>

                    3 * -
                */

                expression += "-";

            } else {

                /*
                    Normal operator replacement:

                    5 +

                    pressing *

                    =>

                    5 *
                */

                expression =
                    expression.slice(0, -1) +
                    operator;

            }


            updateDisplay();

            return;

        }


        /*
            Normal operator.

            Example:

            3

            +

            =>

            3 +
        */

        expression += operator;

        updateDisplay();

    }


    /* =========================================================
    DELETE
    ========================================================= */

    function deleteLast() {

        if (justCalculated) {

            resetCalculator();

            return;

        }


        clearError();


        expression =
            expression.slice(0, -1);


        updateDisplay();

    }


    /* =========================================================
    RESET
    ========================================================= */

    function resetCalculator() {

        expression = "";

        lastExpression = "";

        justCalculated = false;

        expressionDisplay.textContent = "";

        screen.classList.remove(
            "is-error"
        );

        updateDisplay();

    }


    /* =========================================================
    TOKENIZER
    =========================================================

    Supported:

    numbers
    decimals
    +
    -
    *
    /

    Unary negative numbers are supported.

    Examples:

    -5
    10 * -5
    5 + -2
    5 * -2 + 4
    ========================================================= */

    function tokenize(input) {

        const tokens = [];

        let number = "";


        for (
            let i = 0;
            i < input.length;
            i++
        ) {

            const char =
                input[i];


            /*
                Number or decimal point
            */

            if (
                /\d|\./.test(char)
            ) {

                number += char;

                continue;

            }


            /*
                Operators
            */

            if (
                "+-*/".includes(char)
            ) {

                /*
                    Save the number before
                    the operator.
                */

                if (number) {

                    const parsed =
                        Number(number);


                    if (
                        Number.isNaN(parsed)
                    ) {

                        throw new Error(
                            "Invalid number"
                        );

                    }


                    tokens.push(parsed);

                    number = "";

                }


                /*
                    Unary negative number.

                    Valid examples:

                    -5
                    5 * -5
                    5 + -2
                    5 / -10
                */

                if (
                    char === "-" &&
                    (
                        tokens.length === 0 ||
                        typeof tokens.at(-1) === "string"
                    )
                ) {

                    number = "-";

                    continue;

                }


                tokens.push(char);

                continue;

            }


            /*
                Anything else is invalid.
            */

            throw new Error(
                "Invalid character"
            );

        }


        /*
            Add final number.
        */

        if (number) {

            /*
                A standalone "-"
                is not a number.
            */

            if (number === "-") {

                throw new Error(
                    "Incomplete expression"
                );

            }


            const parsed =
                Number(number);


            if (
                Number.isNaN(parsed)
            ) {

                throw new Error(
                    "Invalid number"
                );

            }


            tokens.push(parsed);

        }


        /*
            Expression cannot end
            with an operator.
        */

        if (
            !tokens.length ||
            typeof tokens.at(-1) === "string"
        ) {

            throw new Error(
                "Incomplete expression"
            );

        }


        return tokens;

    }


    /* =========================================================
    CALCULATE EXPRESSION
    ========================================================= */

    function calculateExpression(input) {

        const tokens =
            tokenize(input);


        /*
            First pass:

            multiplication *
            division /

            Example:

            5 + 2 * 3

            becomes:

            5 + 6
        */

        const reduced = [
            tokens[0]
        ];


        for (
            let i = 1;
            i < tokens.length;
            i += 2
        ) {

            const operator =
                tokens[i];

            const next =
                tokens[i + 1];


            if (
                operator === "*" ||
                operator === "/"
            ) {

                const previous =
                    reduced.pop();


                /*
                    Prevent division by zero.
                */

                if (
                    operator === "/" &&
                    next === 0
                ) {

                    throw new Error(
                        "Division by zero"
                    );

                }


                const result =
                    operator === "*"
                        ? previous * next
                        : previous / next;


                reduced.push(result);

            } else {

                reduced.push(
                    operator,
                    next
                );

            }

        }


        /*
            Second pass:

            addition +
            subtraction -
        */

        let result =
            reduced[0];


        for (
            let i = 1;
            i < reduced.length;
            i += 2
        ) {

            const operator =
                reduced[i];

            const next =
                reduced[i + 1];


            if (
                operator === "+"
            ) {

                result += next;

            } else {

                result -= next;

            }

        }


        /*
            Prevent Infinity / NaN.
        */

        if (
            !Number.isFinite(result)
        ) {

            throw new Error(
                "Math error"
            );

        }


        /*
            Fix floating-point problems.

            Example:

            0.1 + 0.2

            JavaScript normally gives:

            0.30000000000000004

            We return:

            0.3
        */

        return Number(
            result.toPrecision(12)
        );

    }


    /* =========================================================
    EQUAL BUTTON
    ========================================================= */

    function calculate() {

        clearError();


        /*
            Empty expression.
        */

        if (!expression) {

            return;

        }


        /*
            Do not calculate incomplete
            expressions.

            Examples:

            5+
            5*
            5/
            5.
            5 * -
        */

        if (
            /[+\-*/.]$/.test(
                expression
            )
        ) {

            showError(
                "Syntax Error"
            );

            return;

        }


        try {

            const result =
                calculateExpression(
                    expression
                );


            /*
                Save previous expression.
            */

            lastExpression =
                expression;


            /*
                Show previous expression
                above the result.

                Example:

                3 × -3 =
                -9
            */

            expressionDisplay.textContent =
                `${expression
                    .replaceAll("*", "×")
                    .replaceAll("/", "÷")
                } =`;


            /*
                Store result as new expression.
            */

            expression =
                String(result);


            calcInput.value =
                expression;


            justCalculated = true;

        } catch (error) {

            /*
                Special division-by-zero error.
            */

            if (
                error.message ===
                "Division by zero"
            ) {

                showError(
                    "Cannot divide by 0"
                );

            } else {

                showError(
                    "Math Error"
                );

            }

        }

    }


    /* =========================================================
    BUTTON EVENTS
    ========================================================= */

    keypad.addEventListener(
        "click",
        (event) => {

            const button =
                event.target.closest(
                    "button"
                );


            if (!button) {

                return;

            }


            const value =
                button.dataset.value;

            const action =
                button.dataset.action;


            /*
                Calculate
            */

            if (
                action === "calculate"
            ) {

                calculate();

                return;

            }


            /*
                Reset
            */

            if (
                action === "reset"
            ) {

                resetCalculator();

                return;

            }


            /*
                Delete
            */

            if (
                action === "delete"
            ) {

                deleteLast();

                return;

            }


            /*
                Decimal
            */

            if (
                value === "."
            ) {

                appendDecimal();

                return;

            }


            /*
                Operators
            */

            if (
                "+-*/".includes(value)
            ) {

                appendOperator(value);

                return;

            }


            /*
                Numbers
            */

            if (
                /^\d$/.test(value)
            ) {

                appendNumber(value);

            }

        }
    );


    /* =========================================================
    KEYBOARD SUPPORT
    ========================================================= */

    document.addEventListener(
        "keydown",
        (event) => {

            const key =
                event.key;


            /*
                Numbers
            */

            if (
                /^\d$/.test(key)
            ) {

                event.preventDefault();

                appendNumber(key);

                return;

            }


            /*
                Decimal
            */

            if (
                key === "."
            ) {

                event.preventDefault();

                appendDecimal();

                return;

            }


            /*
                Operators

                This now supports:

                3 * -3

                directly from keyboard.
            */

            if (
                "+-*/".includes(key)
            ) {

                event.preventDefault();

                appendOperator(key);

                return;

            }


            /*
                Enter or =
            */

            if (
                key === "Enter" ||
                key === "="
            ) {

                event.preventDefault();

                calculate();

                return;

            }


            /*
                Backspace
            */

            if (
                key === "Backspace"
            ) {

                event.preventDefault();

                deleteLast();

                return;

            }


            /*
                Escape / Delete
            */

            if (
                key === "Escape" ||
                key === "Delete"
            ) {

                event.preventDefault();

                resetCalculator();

            }

        }
    );


    /* =========================================================
    INITIAL STATE
    ========================================================= */

    updateDisplay();
