let sum = "";
let numOnScreen = "";
const screen = document.getElementById("grid-item-screen");

function numberClick(num) {
    sum += num;
    numOnScreen += num;
    if (isNaN(parseInt(num)) && num != ".") {
        screen.innerHTML = numOnScreen.slice(0, -1);
        numOnScreen = "";
    } else {
        screen.innerHTML = numOnScreen
    }
}

function equals() {
    try {
        screen.innerHTML = stringMath(sum)
    } catch (err) {
        screen.innerHTML = "Error - Invalid Calculation"
    }
}

function acClick() {
    sum = "";
    numOnScreen = "";
    screen.innerHTML = "-------"
}

//Taken from String Math as importing didn't work :(
function stringMath(eq, callback) {
    if (typeof eq !== 'string') return handleCallback(new TypeError('The [String] argument is expected.'), null);
    const mulDiv = /([+-]?\d*\.?\d+(?:e[+-]\d+)?)\s*([*/])\s*([+-]?\d*\.?\d+(?:e[+-]\d+)?)/;
    const plusMin = /([+-]?\d*\.?\d+(?:e[+-]\d+)?)\s*([+-])\s*([+-]?\d*\.?\d+(?:e[+-]\d+)?)/;
    const parentheses = /(\d)?\s*\(([^()]*)\)\s*/;
    var current;
    while (eq.search(/^\s*([+-]?\d*\.?\d+(?:e[+-]\d+)?)\s*$/) === -1) {
        eq = fParentheses(eq);
        if (eq === current) return handleCallback(new SyntaxError('The equation is invalid.'), null);
        current = eq;
    }
    return handleCallback(null, +eq);

    function fParentheses(eq) {
        while (eq.search(parentheses) !== -1) {
            eq = eq.replace(parentheses, function (a, b, c) {
                c = fMulDiv(c);
                c = fPlusMin(c);
                return typeof b === 'string' ? b + '*' + c : c;
            });
        }
        eq = fMulDiv(eq);
        eq = fPlusMin(eq);
        return eq;
    }

    function fMulDiv(eq) {
        while (eq.search(mulDiv) !== -1) {
            eq = eq.replace(mulDiv, function (a) {
                const sides = mulDiv.exec(a);
                const result = sides[2] === '*' ? sides[1] * sides[3] : sides[1] / sides[3];
                return result >= 0 ? '+' + result : result;
            });
        }
        return eq;
    }

    function fPlusMin(eq) {
        eq = eq.replace(/([+-])([+-])(\d|\.)/g, function (a, b, c, d) { return (b === c ? '+' : '-') + d; });
        while (eq.search(plusMin) !== -1) {
            eq = eq.replace(plusMin, function (a) {
                const sides = plusMin.exec(a);
                return sides[2] === '+' ? +sides[1] + +sides[3] : sides[1] - sides[3];
            });
        }
        return eq;
    }

    function handleCallback(errObject, result) {
        if (typeof callback !== 'function') {
            if (errObject !== null) throw errObject;
        } else {
            callback(errObject, result);
        }
        return result;

    }

}