import shell from 'shelljs'

const buildFolder = './dist/*'
const dockerFolder = './dev/docker/app'

shell.rm('-R', dockerFolder)
shell.mkdir(dockerFolder)
shell.cp('-R', buildFolder, dockerFolder)
shell.exec('npm --prefix ' + dockerFolder + ' i --omit=dev')
