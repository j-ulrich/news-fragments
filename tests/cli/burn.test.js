const { burn } = require("../../src/cli/burn");
const chalk = require("chalk");
const fs = require("fs");
const mockFs = require("mock-fs");
const MockDate = require("mockdate");

afterEach(() => {
  mockFs.restore();
  MockDate.reset();
});

test("should show an error when no version is passed", async () => {
  const result = burn(["burn"]);

  const expected = chalk`No version was found.
Please, provide one like: {green news-fragments burn 0.0.1}`;

  expect(result).toEqual(expected);
});

test("should show an error if there is no fragment to burn", async () => {
  mockFs({
    fragments: {},
  });

  const result = burn(["burn", "0.0.1"]);

  const expected = chalk`No fragments were found.
Remember to create with {green news-fragments create <fragment-type> <fragment-text>}`;

  expect(result).toEqual(expected);
});

test("should save the changelog and delete the fragments", async () => {
  mockFs({
    fragments: {
      "xpto.feature": "Adiciona uma feature.",
    },
    "CHANGELOG.md": "",
  });

  const result = burn(["burn", "0.0.1"]);
  const expected = `# [0.0.1] - (2020-12-02)

## Features
* Adiciona uma feature.
`;

  expect(fs.readFileSync("CHANGELOG.md", "utf8")).toEqual(expected);
  expect(fs.existsSync("fragments/xpto.feature")).toBeFalsy();
  expect(result).toEqual("1 fragments burned in CHANGELOG.md");
});
