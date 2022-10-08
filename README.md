# Studors

A web service that allows for students to get in contact with volunteer student tutors

Developed by Blaine Traudt

Designed by Grant Gardner

Logo by Louis Quattrocchi under the CC BY-NC 3.0 License

![Studors Scalability Photo](public/img/scalability.png)

## TODO:

- [x] Form regex is broken
- [x] Ensure lowercase emails are consistent
- [x] Add space in with comma separation support (for batch email additions in admin panel)
- [x] Fix DB functions for new structure
- [ ] Extra admin actions (e.g. add holidays)
- [ ] Handle phone numbers better
- [ ] Add proper matching
- [ ] Add unavailability options
- [ ] Test suite from start to finish
- [ ] Refactor all code and ensure proper function use and proper security
- [ ] Write pages

### Notes:

/src/lib/db.ts currently has support for phone numbers so if that is not allowed that will need to be changed.

### WEB PAGES NOT DONE:

/admin/list // Styling required

/about // Done but waiting for info

/contact // Done but waiting for info

/mission // Done but waiting for info

/student/find

/student/history

/student/request?

/student/settings // Done besides styling

/student/upcoming

/tutor/history

/tutor/request

/tutor/settings // Done besides styling

/tutor/upcoming
