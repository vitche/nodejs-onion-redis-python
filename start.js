#!/usr/bin/env node
require("dotenv").config();
const buildEvaluator = require("./main").buildEvaluator;
const namespace = process.env.ONION_REDIS_NAMESPACE;
buildEvaluator(namespace, () => {
  console.log(`Connected '${namespace}.PythonEvaluator' class to OnionRedis`);
});