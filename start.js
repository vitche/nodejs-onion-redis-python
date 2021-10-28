#!/usr/bin/env node
const {spawn} = require('child_process');
const ResourceLimit = require("nodejs-resource-limit");

require("dotenv").config();

const restartProcess = () => {
  spawn(process.argv[1], process.argv.slice(2), {
    detached: true,
    stdio: ['ignore']
  }).unref()
  process.exit()
}

const buildEvaluator = require("./main").buildEvaluator;
const namespace = process.env.ONION_REDIS_NAMESPACE;
buildEvaluator(namespace, () => {
  console.log(`Connected '${namespace}.PythonEvaluator' class to OnionRedis`);
});

new ResourceLimit()
  .periodical(60000)
  .countDown()
  .to(process.env.RESPAWN_INTERVAL_MINUTES)
  .execute(() => {
    restartProcess();
  });
