import uglifycss from 'uglifycss'
import shell from 'shelljs'

const styleFolder = './style'
const backupFolder = './backup/style'

const files = new Set(['.env', 'package.json', 'package-lock.json'])

const folders = new Set(['./public/', './dev/views/'])

// Backup in case unsaved changes
shell.rm('-R', backupFolder)
shell.mkdir('./backup')
shell.mv(styleFolder, backupFolder)
shell.mkdir(styleFolder)

// Copy Files
files.forEach((file) => {
  if (shell.test('-e', file)) {
    shell.cp('-R', file, styleFolder)
  }
})

// Build the typescript and populate dependencies
shell.exec('npx tsc --outDir ' + styleFolder)
shell.exec('npm --prefix ' + styleFolder + ' i --omit=dev')

// Copy Folders
folders.forEach((folder) => {
  shell.cp('-R', folder, styleFolder)
})

shell.mkdir(styleFolder + '/public/css')

// Minifies all the pickadate CSS together
const pickadateCSS = uglifycss.processFiles([
  './dev/css/pickadate/default.css',
  './dev/css/pickadate/default.date.css',
  './dev/css/pickadate/default.time.css'
])
shell
  .ShellString(pickadateCSS)
  .to(styleFolder + '/public/css/pickadate.min.css')

// Copies CSS over and renames to ensure that the HTML served corresponds to the right name
shell.cp('./dev/css/darkmode.css', styleFolder + '/public/css/darkmode.min.css')
shell.cp('./dev/css/style.css', styleFolder + '/public/css/style.min.css')
