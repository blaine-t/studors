import uglifycss from 'uglifycss'
import shell from 'shelljs'

// Minify CSS
shell.mkdir('./public/css')
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

// Minify EJS
shell.mkdir('./views')
shell.exec(
  'npx html-minifier --input-dir ./dev/views --output-dir ./views --collapse-boolean-attributes --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace  --minify-css --minify-js --remove-empty-attributes'
)
// Fix minification of the TS file
shell.cp(
  './dev/views/components/functions.ts',
  './views/components/functions.ts'
)
