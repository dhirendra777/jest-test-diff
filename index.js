const core = require("@actions/core");
const github = require("@actions/github");
const { promises: fs } = require("fs");
const exec = require("@actions/exec");

try {
  // `who-to-greet` input defined in action metadata file
  //   const nameToGreet = core.getInput('who-to-greet');
  //   console.log(`Hello ${nameToGreet}!`);
  //   const time = (new Date()).toTimeString();
  //   core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  //   const payload = JSON.stringify(github.context.payload, undefined, 2)
  //   console.log(`The event payload: ${payload}`);

  const basePromise = exec.exec(
    `git show origin/${github.context.payload.pull_request.base.ref}:./package.json`
  );

  const headPromise = exec.exec(
    `git show origin/${github.context.payload.pull_request.head.ref}:./package.json`
  );

  Promise.all(basePromise, headPromise).then((values) => {
    const baseContent = JSON.parse(values[0]),
      headContent = JSON.parse(values[1]);
    core.setOutput("Base content", baseContent.dependencies);
    core.setOutput("Head content", headContent.dependencies);
  });
} catch (error) {
  core.setFailed(error.message);
}
