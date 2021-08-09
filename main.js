const fs = require("fs");
const path = require("path");
const {exec} = require("child_process");
const {tmpdir} = require("os");
const OnionRedis = require("nodejs-onion-redis-call");
const execute = (filePath, callback) => {
  const command = `python ${filePath}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      callback(error);
    }
    if (stdout) {
      callback(stdout);
    }
    if (stderr) {
      callback(stderr);
    }
  });
};
const buildEvaluator = (namespace, connectionCallback) => {
  const evaluator = new OnionRedis(
    process.env.ONION_REDIS_URI,
    undefined,
    function (error) {
      if (undefined !== error) {
        console.log(error);
        return;
      }
      evaluator.provide('Deploy', function (arguments, next) {
        const fileName = arguments.fileName;
        let filePath = arguments.filePath;
        if (!filePath) {
          filePath = path.join(tmpdir(), fileName);
        }
        const payload = arguments.payload;
        if (payload) {
          fs.writeFile(filePath, payload, (error) => {
            if (error) {
              console.error(error);
              next(false);
              return;
            }
            next(true);
          });
        }
      });
      evaluator.provide('Evaluate', function (arguments, next) {
        const fileName = arguments.fileName;
        let filePath = arguments.filePath;
        if (!filePath) {
          filePath = path.join(tmpdir(), fileName);
        }
        execute(filePath, next);
      });
      connectionCallback();
    }).Namespace(namespace).Class('PythonEvaluator');
  return evaluator;
};
module.exports = {
  buildEvaluator
};