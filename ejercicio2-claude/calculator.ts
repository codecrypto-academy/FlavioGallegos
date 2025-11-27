class Calculator {
    private display: HTMLElement;
    private currentInput: string = '0';
    private previousInput: string = '';
    private operator: string | null = null;
    private shouldResetDisplay: boolean = false;

    constructor() {
        this.display = document.getElementById('display') as HTMLElement;
        this.updateDisplay();
    }

    private updateDisplay(): void {
        if (this.display) {
            this.display.textContent = this.currentInput;
        }
    }

    private formatNumber(num: number): string {
        // Limitar a 10 dígitos para evitar números muy largos
        const str = num.toString();
        if (str.length > 10) {
            return num.toExponential(5);
        }
        return str;
    }

    appendNumber(num: string): void {
        if (this.shouldResetDisplay) {
            this.currentInput = '0';
            this.shouldResetDisplay = false;
        }

        if (this.currentInput === '0' && num !== '.') {
            this.currentInput = num;
        } else {
            this.currentInput += num;
        }

        this.updateDisplay();
    }

    appendDecimal(): void {
        if (this.shouldResetDisplay) {
            this.currentInput = '0';
            this.shouldResetDisplay = false;
        }

        if (!this.currentInput.includes('.')) {
            this.currentInput += '.';
            this.updateDisplay();
        }
    }

    appendOperator(op: string): void {
        if (this.operator && !this.shouldResetDisplay) {
            this.calculate();
        }

        this.previousInput = this.currentInput;
        this.operator = op;
        this.shouldResetDisplay = true;
    }

    calculate(): void {
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

        let result: number;

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

    clear(): void {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }

    delete(): void {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
        this.updateDisplay();
    }
}

// Inicializar la calculadora cuando el DOM esté listo
let calculator: Calculator;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        calculator = new Calculator();
    });
} else {
    calculator = new Calculator();
}

