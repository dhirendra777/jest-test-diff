const core = require("@actions/core");
const github = require("@actions/github");
const { promises: fs } = require("fs");
const exec = require("@actions/exec");
const { stderr } = require("process");

try {
  function getOptions() {
    let headOutput = "";
    let headError = "";

    const headOptions = {};
    headOptions.listeners = {
      stdout: (data) => {
        headOutput += data.toString();
      },
      stderr: (data) => {
        headError += data.toString();
      },
    };

    return [headOutput, headError, headOptions];
  }
  // `who-to-greet` input defined in action metadata file
  //   const nameToGreet = core.getInput('who-to-greet');
  //   console.log(`Hello ${nameToGreet}!`);
  //   const time = (new Date()).toTimeString();
  //   core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  //   const payload = JSON.stringify(github.context.payload, undefined, 2)
  //   console.log(`The event payload: ${payload}`);

  //   let headOutput = "";
  //   let headError = "";

  //   const headOptions = {};
  //   headOptions.listeners = {
  //     stdout: (data) => {
  //       headOutput += data.toString();
  //     },
  //     stderr: (data) => {
  //       headError += data.toString();
  //     },
  //   };
  const [baseOutput, baseError, baseOptions] = getOptions(),
    [headOutput, headError, headOptions] = getOptions();

  const basePromise = exec.exec(
    `git show origin/${github.context.payload.pull_request.base.ref}:./package.json`,
    [],
    baseOptions
  );

  const headPromise = exec.exec(
    `git show origin/${github.context.payload.pull_request.head.ref}:./package.json`,
    [],
    headOptions
  );

  Promise.all([basePromise, headPromise]).then(() => {
    if (baseError || headError) return 1;
    const baseContent = JSON.parse(baseOutput),
      headContent = JSON.parse(headOutput);
    core.setOutput("Base content", baseContent.dependencies);
    core.setOutput("Head content", headContent.dependencies);
  });
} catch (error) {
  core.setFailed(error.message);
}
