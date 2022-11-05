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
- [x] Handle phone numbers better
- [x] Extra admin actions (e.g. add holidays)
- [x] Implement subjects and subject matching
- [x] Add proper matching
- [ ] Fix createSession in db.ts
- [ ] Add unavailability options
- [ ] Make admin placeholders have current data instead of example
- [ ] Test suite from start to finish
- [ ] Refactor all code and ensure proper function use and proper security
- [ ] Check error handling
- [ ] Write pages

## KNOWN ISSUES:

Error handling in db.ts is _possibly_ broken

Possible SQL injection in multiple locations

Times don't auto populate in to database (Works now but doesn't populate enough, will fix in refactor)

### WEB PAGES NOT DONE:

/admin/manage // Light styling required

/admin/list // Styling required

/admin/settings // Convert to dialog?

/about // Done but waiting for info

/contact // Done but waiting for info

/mission // Done but waiting for info

/student/find // Styling required

/student/history // MAJOR restyling/refactoring required

/student/request?

/student/settings // Convert to dialog?

/student/upcoming // MAJOR restyling/refactoring required

/tutor/availability // Styling required

/tutor/subjects // Styling required

/tutor/history // MAJOR restyling/refactoring required

/tutor/request?

/tutor/settings // Convert to dialog?

/tutor/upcoming // MAJOR restyling/refactoring required
