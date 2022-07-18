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

  const content = exec.exec(
    `git show origin/${github.event.pull_request.base.ref}`
  );
  const path = core.getInput("path");
  const trim = core.getBooleanInput("trim");
  //   let content = await fs.readFile(path, "utf8");
  //   if (trim) {
  //     content = content.trim();
  //   }

  core.setOutput("content", content, JSON.parse(content));
} catch (error) {
  core.setFailed(error.message);
}
