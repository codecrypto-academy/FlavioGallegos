function fibonacci(n) {
	const seq = [];
	for (let i = 0; i < n; i++) {
		if (i === 0) seq.push(0);
		else if (i === 1) seq.push(1);
		else seq.push(seq[i - 1] + seq[i - 2]);
	}
	return seq;
}

const primeros15 = fibonacci(15);
console.log('Primeros 15 números de la secuencia de Fibonacci:');
console.log(primeros15.join(', '));
