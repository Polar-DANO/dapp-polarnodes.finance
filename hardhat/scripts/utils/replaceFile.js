const fs = require('fs')

async function replaceInFile (searchPattern, newLine, filePath) {
  return new Promise((resolve, error) => {
    fs.readFile(filePath, 'utf8', function (err, data) {
      const formatted = data.replace(searchPattern, newLine)
      fs.writeFile(filePath, formatted, function (err) {
        if (err) { console.log(err) }
        resolve()
      })
    })
  })
}

async function replaceContents (file, newContent, cb) {
  return new Promise((resolve, error) => {
    fs.writeFile(file, newContent, function (err) {
      if (err) { console.log(err) }
      resolve()
    })
  })
}

module.exports = {
  replaceInFile, replaceContents
}
