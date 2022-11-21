import uglifycss from 'uglifycss'
import shell from 'shelljs'

const styleCSS = uglifycss.processFiles(['./dev/css/style.css'])
shell.ShellString(styleCSS).to('./public/css/style.min.css')

const darkmodeCSS = uglifycss.processFiles(['./dev/css/darkmode.css'])
shell.ShellString(darkmodeCSS).to('./public/css/darkmode.min.css')

const pickadateCSS = uglifycss.processFiles([
  './dev/css/pickadate/default.css',
  './dev/css/pickadate/default.date.css',
  './dev/css/pickadate/default.time.css'
])
shell.ShellString(pickadateCSS).to('./public/css/pickadate.min.css')
