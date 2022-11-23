import shell from 'shelljs'

const testFolder = './test'

const files = new Set(['.env, package.json', 'package-lock.json'])

const folders = new Set(['./public/', './dev/views/'])

shell.rm('-R', testFolder)
shell.mkdir(testFolder)

shell.exec('npx tsc --outDir ./test')
shell.exec('npm --prefix ./test i --omit=dev')

files.forEach((file) => {
  shell.cp('-R', file, testFolder)
})

// Copy Folders
folders.forEach((folder) => {
  shell.cp('-R', folder, testFolder)
})

shell.cp('./dev/css/darkmode.css', testFolder + '/public/css/darkmode.min.css')
shell.cp('./dev/css/style.css', testFolder + '/public/css/style.min.css')
