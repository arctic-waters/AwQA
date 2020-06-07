require('fs')
  .readdirSync(require('path').join(__dirname, 'gulp'))
  .forEach(f => require('./gulp/' + f))
