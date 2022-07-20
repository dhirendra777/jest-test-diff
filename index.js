"use strict";

const core = require("@actions/core");
const github = require("@actions/github");
const { promises: fs } = require("fs");
const exec = require("@actions/exec");

const main = async () => {
  await exec.exec(`touch ./base.json`);
  await exec.exec(`touch ./head.json`);
  await exec.exec(
    `git show origin/${github.context.payload.pull_request.base.ref} -- ./package.json >> ./base.json`
  );

  await exec.exec(
    `git show origin/${github.context.payload.pull_request.head.ref} -- ./package.json >> ./head.json`
  );

  /* Read file in memory and compare package.json */
  let baseContent = await fs.readFile("./base.json");
  let headContent = await fs.readFile("./head.json");

  console.log("Base content is ", baseContent.dependencies);
  console.log("Head content is ", headContent);
};

main().catch((error) => {
  /* Remove created file */
  core.setFailed(error.message);
});
