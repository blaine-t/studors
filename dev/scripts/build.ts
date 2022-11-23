import shell from 'shelljs'

const buildFolder = './dist/'

const files = new Set([
  'LICENSE',
  'README.md',
  'package.json',
  'package-lock.json'
])

const folders = new Set(['./public/', './views/'])

// Copy Files
files.forEach((file) => {
  shell.cp('-R', file, buildFolder)
})

// Copy Folders
folders.forEach((folder) => {
  shell.cp('-R', folder, buildFolder)
})
