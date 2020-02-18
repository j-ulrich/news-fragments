const { buildConfig, getBaseConfig } = require("../src/config");

test("should return a base config", async () => {
  config = buildConfig({});

  expect(config.changelogFile).toBe("CHANGELOG.md");
  expect(config.changelogDateFormat).toBe("YYYY-MM-DD");
  expect(config.fragmentsFolder).toBe("fragments");
  expect(config.changelogTemplate).toBe(`# [newVersion] - (bumpDate)
{{#each fragments}}
## {fragment.title}
  {{#each fragmentEntries}}
    * {fragment}
  {{/each}}
{{/each}}
`);
  expect(config.fragmentsTypes).toEqual([
    { title: "Features", extension: "feature" },
    { title: "Bugfixes", extension: "bugfix" },
    { title: "Documentation", extension: "doc" },
    { title: "Deprecations and Removals", extension: "removal" },
    { title: "Misc", extension: "misc" }
  ]);
});

test.each([
  [{ changelogFile: 1 }],
  [{ changelogDateFormat: 1 }],
  [{ changelogTemplate: 1 }],
  [{ fragmentsFolder: undefined }],
  [{ fragmentsTypes: [] }]
])("should throw error when receive invalid parameters", async element => {
  expect(() => {
    buildConfig(element);
  }).toThrowErrorMatchingSnapshot();
});
