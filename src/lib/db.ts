import prisma from './prisma'

async function findTutor(id: string) {
  const students = await prisma.tutor.findUnique({
    where: {
      id: id
    }
  })
  console.log(students)
}

async function addStudent(
  id: string,
  firstName: string,
  lastName: string,
  pic: string,
  email: string
) {
  await prisma.student.create({
    data: {
      id: id,
      firstName: firstName,
      lastName: lastName,
      pic: pic,
      email: email
    }
  })
}

async function addAdmin(id: string) {
  await prisma.admin.create({
    data: {
      id: id,
      firstName: 'epstein',
      lastName: 'hell',
      pic: './jpg',
      phone: '4025406790',
      email: '0340@gmail.com',
      darkMode: false
    }
  })
}

async function addTutor(id: string) {
  await prisma.tutor.create({
    data: {
      id: id,
      firstName: 'Jeff',
      lastName: 'epstein',
      pic: './jpg',
      phone: '4025405790',
      email: 'Jeff@bathost.net',
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
  return await prisma.student.findFirst({
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
