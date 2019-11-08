#!/usr/bin/env node
const { Snippet } = require("enquirer")
const fs = require("fs")
const { execSync } = require("child_process")
const formatTitle = require("title")
const path = require("path")

let title = process.argv.slice(2).join(" ")

const hasTitle = title !== ""
if (!hasTitle) {
  title = `\${title}`
}
console.log(title)

const prompt = new Snippet({
  name: "newpost",
  message: "New Post",
  required: true,
  fields: [
    {
      name: "runCommand",
      message: "run Command",
    },
    {
      name: "devCommand",
      message: "dev Command",
    },
  ],
  template: `---
title: ${title}
date: "${new Date().toISOString().slice(0, 10)}"
---
`,
})

const blogPath = "/Users/jaga/coding/jagascript.com"
const contentDirPath = `${blogPath}/content/blog`

prompt
  .run()
  .then(handleAnswer)
  .catch(console.error)

function handleAnswer(answer) {
  const t = hasTitle ? title : answer.values.title

  const folderName = t.toLowerCase().replace(/\s/g, "-")
  const filepath = path.join(contentDirPath, folderName)
  const filename = path.join(filepath, "index.md")
  fs.mkdirSync(filepath, { recursive: true })
  fs.writeFileSync(filename, answer.result.replace(t, formatTitle(t)), {
    encoding: "utf-8",
  })
  execSync(`code-insiders blogPath --goto ${filename}`)
}
