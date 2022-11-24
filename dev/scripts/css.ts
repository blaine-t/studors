import shell from 'shelljs'

const styleFolder = './style'
const backupFolder = './styleBackup'

const files = new Set(['.env', 'package.json', 'package-lock.json'])

const folders = new Set(['./public/', './dev/views/'])

// Backup in case unsaved changes
shell.rm('-R', backupFolder)
shell.mv(styleFolder, backupFolder)
shell.mkdir(styleFolder)

// Move over TS file so it gets compiled properly
shell.mkdir('./views')
shell.mkdir('./views/components')
shell.cp(
  './dev/views/components/functions.ts',
  './views/components/functions.ts'
)

// Build the typescript and populate dependencies
shell.exec('npx tsc --outDir ' + styleFolder)
shell.exec('npm --prefix ' + styleFolder + ' i --omit=dev')

// Copy Files
files.forEach((file) => {
  shell.cp('-R', file, styleFolder)
})

// Copy Folders
folders.forEach((folder) => {
  shell.cp('-R', folder, styleFolder)
})

// Copies CSS over and renames to ensure that the HTML served corresponds to the right name
shell.cp('./dev/css/darkmode.css', styleFolder + '/public/css/darkmode.min.css')
shell.cp('./dev/css/style.css', styleFolder + '/public/css/style.min.css')
