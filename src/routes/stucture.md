# Root
/ - Choose between tutor or student

about - List of what the app does and how it works

mission - BS about why we do it

contact - Email form to send a message to admins about an issue

## Admin
/admin/*

register - After redirect from google, ask for phone # and dark mode

login - Redirect to google

panel - List of options of things that can be done (purge database and stuff)

settings - Allow change of phone number and listing of API token

logout - Logout the user

## API
/api/*

getHours - List out hours in a JSON format using a POST request with an api token

## Student
/student/*

register - After redirect from google, ask for grade and option for phone # and dark mode

login - Redirect to google

home - Home page for students :Access to options below

find - Find a new tutoring session

|______________ request - Request a session that is not in the books // May or may not implement

settings - Change options about your account

logout - Logout the user

upcoming - List upcoming sessions

history - List history of sessions

## Tutor
/tutor/*

register - After redirect from google, ask for subjects, availability, grade, and options for phone # and dark mode

login - Redirect to google

home - Home page for students :Access to options below

request - Fulfill a request a student has made that is outside of standard ours // May or many not implement

settings - Change options about your account

logout - Logout the user

upcoming - List upcoming sessions

history - List history of sessions