"use strict";

const core = require("@actions/core");
const github = require("@actions/github");
const { promises: fs } = require("fs");
const exec = require("@actions/exec");

const main = async () => {
  /* Dump in file */
  await exec.exec(
    `git show origin/${github.context.payload.pull_request.base.ref} -- ./package.json >> base.json`
  );

  await exec.exec(
    `git show origin/${github.context.payload.pull_request.head.ref} -- ./package.json >> head.json`
  );

  /* Read file in memory and compare package.json */
  let baseContent = await fs.readFile("base.json", "utf8");
  let headContent = await fs.readFile("head.json", "utf8");

  console.log("Base content is ", baseContent);
  console.log("Head content is ", headContent);
};

main().catch((error) => {
  /* Remove created file */
  core.setFailed(error.message);
});
