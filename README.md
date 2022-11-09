# ![Studors](public/img/studors.webp)

A web service that allows for students to get in contact with volunteer student tutors

## Contributors

Leader and sole developer, [Blaine Traudt](https://github.com/blaine-t)

Web Design courtesy of [Grant Gardner](https://github.com/G2-Games)

Logo licensed from Louis Quattrocchi under the CC BY-NC 3.0 License

## Features

* Zero-knowledge password support via Google OAuth 2.0

* Extremely lightweight network requirements

* Small development stack ensuring responsive web pages with no bloat

* Responsive design no matter what device or orientation [Example](public/img/scalability.png)

* Fully featured admin panel tailored towards newbies all the way to power users

* Automated weekly schedule pushes

* Intelligent matching of students with tutors based on time and subject

* Easy to manage availability schedules for tutors

## Powered By

* <img src="https://images.g2crowd.com/uploads/product/image/large_detail/large_detail_f0b606abb6d19089febc9faeeba5bc05/nodejs-development-services.png" width="20" height="20"> [**Node.js**](https://github.com/nodejs/node) is the runtime I decided to use for this project. I debated using [Bun](https://bun.sh/) but I wanted to have a more established runtime since I expect this project to be deployed with little to maintenance after deployment.
* <img src="https://www.tutorialsteacher.com/Content/images/home/typescript.svg" width="20" height="20"> [**Typescript**](https://github.com/microsoft/TypeScript) - Most if not all of the backend code is written in typescript. TS was chosen over javascript because for a complex project ensuring that types remained consistent throughout was crucial to having less error prone code. While it was a decent learning curve it definitely made development easier especially towards the end.
* <img src="https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg" width="20" height="20"> [**PostgreSQL**](https://github.com/postgres/postgres) I decided on Postgres for most of the same reasons I chose Node. It is a well established relational SQL database that I think will stand the test of time and was really nice to use in this project.
* <img src="https://camo.githubusercontent.com/0566752248b4b31b2c4bdc583404e41066bd0b6726f310b73e1140deefcc31ac/68747470733a2f2f692e636c6f756475702e636f6d2f7a6659366c4c376546612d3330303078333030302e706e67" height="20"> [**Express.js**](https://github.com/expressjs/express) was used as the minimalist web framework for studors. It gave me low enough capabilities without going too low that it was hard to develop with.
* <img src="https://cdn.glitch.me/project-avatar/0d184ee3-fd8d-4b94-acf4-b4e686e57375.png" width="20" height="20"> [**Passport.js**](https://github.com/jaredhanson/passport) allowed for quick and easy OAuth with Google. While it was a bit confusing to use at first and led to some *less than ideal* code in the end it made it so Studors could be zero-knowledge when it came to user credentials.
* <img src="https://avatars.githubusercontent.com/u/70142?s=200&v=4" width="20" height="20"> [**JQuery**](https://github.com/jquery/jquery) while underutilized in Studors because it came in to the stack late still made using other js libraries miles easier.
* <img src="https://avatars.githubusercontent.com/u/278219?s=200&v=4" width="20" height="20"> [**DataTables**](https://github.com/DataTables/DataTables) made making sortable and tabulated tables *way* easier than native HTML I was trying to wrangle before I brought it in to the stack
* <img src="https://amsul.ca/pickadate.js/images/logo.png" height="20"> [**Pickadate.js**](https://github.com/amsul/pickadate.js) made intuitive calendars easier to create and more user friendly.


## Installation

Installation of Studors is easy with Docker! (Blaine don't forget to put instructions here laters)

## TODO:

- [ ] Change logout to POST request
- [ ] Fix createSession in db.ts
- [ ] Have sanitize.id check against DB
- [ ] Add unavailability options
- [ ] Make admin placeholders have current data instead of example
- [ ] Lint whole project
- [ ] Test suite from start to finish

### WEB PAGES NOT DONE:

/admin/manage (Light styling required)

/student/find (Styling required)

/student/history (MAJOR restyling/refactoring required)

/student/upcoming (MAJOR restyling/refactoring required)

/tutor/history (MAJOR restyling/refactoring required)

/tutor/upcoming (MAJOR restyling/refactoring required)

## 2.0 Features:

- [ ] Allow tutors to blacklist problematic students (/tutor/blacklist?)
- [ ] Make removal of certain things easier for admin (/admin/manage) 
- [ ] Student request for tutoring at a set time slot (/student/request)
- [ ] Tutor page to fulfill student requests (/tutor/request)


## License

Studors is licensed under the GNU General Public License V3

[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg?style=for-the-badge)](https://www.gnu.org/licenses/gpl-3.0)