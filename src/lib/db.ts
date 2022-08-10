import prisma from './prisma'

async function findTutor(authKey: string) {
  const students = await prisma.tutor.findUnique({
    where: {
      authKey: authKey
    }
  })
  console.log(students)
}

async function addStudent() {
  await prisma.student.create({
    data: {
      firstName: 'Jeff',
      lastName: 'epstein',
      pic: './jpg',
      authKey: 'ij1324ji34ji23j424',
      grade: 9,
      darkMode: false
    }
  })
}

async function addAdmin() {
  await prisma.admin.create({
    data: {
      username: 'epstein',
      pic: './jpg',
      authKey: 'ij1324ji34ji23j424',
      phone: '4025406790',
      email: '0340@gmail.com',
      darkMode: false
    }
  })
}

async function addTutor() {
  await prisma.tutor.create({
    data: {
      firstName: 'Jeff',
      lastName: 'epstein',
      pic: './jpg',
      phone: '4025405790',
      email: 'Jeff@bathost.net',
      authKey: 'ij1324ji34ji23j424',
      grade: 9,
      hoursTerm: 0,
      hoursTotal: 45.5,
      darkMode: false
    }
  })
}

async function getHours() {
  return await prisma.tutor.findMany({
    select: {
      lastName: true,
      firstName: true,
      hoursTerm: true,
      hoursTotal: true
    },
    orderBy: {
      lastName: 'asc'
    }
  })
}

async function confirmApiKey(apiKey: string) {
  return await prisma.admin.findFirst({
    where: {
      apiKey: apiKey
    }
  })
}

async function authStudent(id: string) {
  return await prisma.admin.findFirst({
    where: {
      id: id
    }
  })
}

export default {
  findTutor,
  addStudent,
  addTutor,
  getHours,
  confirmApiKey,
  addAdmin,
  authStudent
}
