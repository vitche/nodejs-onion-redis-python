require("dotenv").config();
const buildEvaluator = require("./main").buildEvaluator;
const namespace = "Test";
const evaluator = buildEvaluator(namespace, () => {
	console.log(`Connected '${namespace}.PythonEvaluator' class to OnionRedis`);
	evaluator.consume('Deploy', {
		fileName: "python_hello_world.py",
	    payload: 'print("Hello, World!")'
	}, function (result) {
		if (result) {
			setInterval(() => {
				evaluator.consume("Evaluate", {
					fileName: "python_hello_world.py"
				}, (result) => {
					console.log(result);
				});
			}, 5000);
		}
	});
});
