"use strict";
class Calculator {
    constructor() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.display = document.getElementById('display');
        this.updateDisplay();
    }
    updateDisplay() {
        if (this.display) {
            this.display.textContent = this.currentInput;
        }
    }
    formatNumber(num) {
        // Limitar a 10 dígitos para evitar números muy largos
        const str = num.toString();
        if (str.length > 10) {
            return num.toExponential(5);
        }
        return str;
    }
    appendNumber(num) {
        if (this.shouldResetDisplay) {
            this.currentInput = '0';
            this.shouldResetDisplay = false;
        }
        if (this.currentInput === '0' && num !== '.') {
            this.currentInput = num;
        }
        else {
            this.currentInput += num;
        }
        this.updateDisplay();
    }
    appendDecimal() {
        if (this.shouldResetDisplay) {
            this.currentInput = '0';
            this.shouldResetDisplay = false;
        }
        if (!this.currentInput.includes('.')) {
            this.currentInput += '.';
            this.updateDisplay();
        }
    }
    appendOperator(op) {
        if (this.operator && !this.shouldResetDisplay) {
            this.calculate();
        }
        this.previousInput = this.currentInput;
        this.operator = op;
        this.shouldResetDisplay = true;
    }
    calculate() {
        if (!this.operator || !this.previousInput) {
            return;
        }
        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        if (isNaN(prev) || isNaN(current)) {
            this.currentInput = 'Error';
            this.updateDisplay();
            this.clear();
            return;
        }
        let result;
        switch (this.operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    this.currentInput = 'Error';
                    this.updateDisplay();
                    this.clear();
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }
        this.currentInput = this.formatNumber(result);
        this.previousInput = '';
        this.operator = null;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }
    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }
    delete() {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        }
        else {
            this.currentInput = '0';
        }
        this.updateDisplay();
    }
}
// Inicializar la calculadora cuando el DOM esté listo
let calculator;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        calculator = new Calculator();
    });
}
else {
    calculator = new Calculator();
}
