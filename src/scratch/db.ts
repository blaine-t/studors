import prisma from './prisma'

async function addStudent(
  id: string,
  firstName: string,
  lastName: string,
  pic: string,
  email: string
) {
  prisma.student.create({
    data: {
      id: id,
      firstName: firstName,
      lastName: lastName,
      pic: pic,
      email: email
    }
  })
}

async function addTutor(
  id: string,
  firstName: string,
  lastName: string,
  pic: string,
  email: string
) {
  prisma.tutor.create({
    data: {
      id: id,
      firstName: firstName,
      lastName: lastName,
      pic: pic,
      email: email
    }
  })
}

async function addAdmin(
  id: string,
  firstName: string,
  lastName: string,
  pic: string,
  email: string
) {
  prisma.admin.create({
    data: {
      id: id,
      firstName: firstName,
      lastName: lastName,
      pic: pic,
      email: email
    }
  })
}

async function updateStudent(
  id: string,
  phone: string,
  grade: number,
  darkMode: boolean
) {
  prisma.student.update({
    where: {
      id: id
    },
    data: {
      phone: phone,
      grade: grade,
      darkMode: darkMode
    }
  })
}

async function updateTutor(
  id: string,
  phone: string,
  grade: number,
  subjects: string[],
  availability: string[],
  darkMode: boolean
) {
  prisma.tutor.update({
    where: {
      id: id
    },
    data: {
      phone: phone,
      grade: grade,
      subjects: subjects,
      availability: availability,
      darkMode: darkMode
    }
  })
}

async function updateAdmin(id: string, phone: string, darkMode: boolean) {
  prisma.student.update({
    where: {
      id: id
    },
    data: {
      phone: phone,
      darkMode: darkMode
    }
  })
}

async function deleteStudent(id: string) {
  prisma.student.delete({
    where: {
      id: id
    }
  })
}

async function deleteTutor(id: string) {
  prisma.tutor.delete({
    where: {
      id: id
    }
  })
}

async function deleteAdmin(id: string) {
  prisma.tutor.delete({
    where: {
      id: id
    }
  })
}

async function purgeStudents() {
  prisma.student.deleteMany({
    where: {
      grade: { gt: 12 }
    }
  })
}

async function purgeTutors() {
  prisma.tutor.deleteMany({
    where: {
      grade: { gt: 12 }
    }
  })
}

async function incrementGrade() {
  prisma.student.updateMany({
    data: {
      grade: { increment: 1 }
    }
  })
  prisma.tutor.updateMany({
    data: {
      grade: { increment: 1 }
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

async function authTutor(id: string) {
  return await prisma.tutor.findFirst({
    where: {
      id: id
    }
  })
}

async function authAdmin(id: string) {
  return await prisma.admin.findFirst({
    where: {
      id: id
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

export default {
  addStudent,
  addTutor,
  addAdmin,
  updateStudent,
  updateTutor,
  updateAdmin,
  deleteStudent,
  deleteTutor,
  deleteAdmin,
  purgeStudents,
  purgeTutors,
  incrementGrade,
  authStudent,
  authTutor,
  authAdmin,
  confirmApiKey,
  getHours
}
