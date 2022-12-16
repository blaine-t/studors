# ![Studors](public/img/studors.webp)

A web service that allows for students to get in contact with volunteer student tutors

## Contributors

Leader and sole developer, [Blaine Traudt](https://github.com/blaine-t)

Web Design courtesy of [Grant Gardner](https://github.com/G2-Games)

Logo used by permission from Louis Quattrocchi under the CC BY-NC 3.0 License

## Features

- Zero-knowledge password support via Google OAuth 2.0

- Extremely lightweight network requirements

- Small development stack ensuring responsive web pages with no bloat

- Responsive design no matter what device or orientation [Example](dev/img/scalability.png)

- Fully featured admin panel tailored towards newbies all the way to power users

- Automated weekly schedule pushes

- Intelligent matching of students with tutors based on time and subject

- Easy to manage availability schedules for tutors

## Powered By

- <img src="dev/img/node.png" width="20" height="20"> [**Node.js**](https://github.com/nodejs/node) is the runtime I decided to use for this project. I debated using [Bun](https://bun.sh/) but I wanted to have a more established runtime since I expect this project to be deployed with little to maintenance after deployment.
- <img src="dev/img/typeScript.svg" width="20" height="20"> [**Typescript**](https://github.com/microsoft/TypeScript) - Most if not all of the backend code is written in typescript. TS was chosen over javascript because for a complex project ensuring that types remained consistent throughout was crucial to having less error prone code. While it was a decent learning curve it definitely made development easier especially towards the end.
- <img src="dev/img/postgres.svg" width="20" height="20"> [**PostgreSQL**](https://github.com/postgres/postgres) I decided on Postgres for most of the same reasons I chose Node. It is a well established relational SQL database that I think will stand the test of time and was really nice to use in this project.
- <img src="dev/img/express.png" height="20"> [**Express.js**](https://github.com/expressjs/express) was used as the minimalist web framework for studors. It gave me low enough capabilities without going too low that it was hard to develop with.
- <img src="dev/img/passport.png" width="20" height="20"> [**Passport.js**](https://github.com/jaredhanson/passport) allowed for quick and easy OAuth with Google. While it was a bit confusing to use at first and led to some _less than ideal_ code in the end it made it so Studors could be zero-knowledge when it came to user credentials.
- <img src="dev/img/jQuery.png" width="20" height="20"> [**JQuery**](https://github.com/jquery/jquery) while underutilized in Studors because it came in to the stack late still made using other js libraries miles easier.
- <img src="dev/img/dataTables.png" width="20" height="20"> [**DataTables**](https://github.com/DataTables/DataTables) made making sortable and tabulated tables _way_ easier than native HTML I was trying to wrangle before I brought it in to the stack
- <img src="dev/img/pickADate.png" height="20"> [**pickadate.js**](https://github.com/amsul/pickadate.js) made intuitive calendars easier to create and more user friendly.
- <img src="dev/img/date-fns.png" width="20" height="20"> [**date-fns**](https://github.com/date-fns/date-fns) was the last module to be added but allowed me to clean up code and make date manipulation easier to read and safer.

## Installation

Installation of Studors is easy with Docker!

Instructions [here](/dev/docs/docker_setup.md)

## 2.0 TODO

- [ ] Add fading between pages (or some transition)
- [ ] Rework scheduler and population of dates for less disk IO and CPU (also authentication if possible)
- [ ] Allow tutors to blacklist problematic students (/tutor/blacklist?)
- [ ] Make admin panel easier to use / more informational on what it does (/admin/manage)
- [ ] Student request for tutoring at a set time slot (/student/request)
- [ ] Tutor page to fulfill student requests (to go along side student requests) (/tutor/request)

## License

Studors is licensed under the GNU General Public License V3

[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg?style=for-the-badge)](https://www.gnu.org/licenses/gpl-3.0)
