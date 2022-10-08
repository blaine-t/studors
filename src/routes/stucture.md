# Root

/ - Choose between tutor or student

about - List of what the app does and how it works

mission - Why we do it

contact - Email form to send a message to admins about an issue

## Admin

/admin/\*
PROTECTED

panel - List of options of things that can be done (purge database and stuff)

settings - Allow change of phone number and listing of API token

manage - Add users to the allowed admin and allowed tutor list

list - List all users and information on them

## API

/api/\*

getHours - List out hours in a JSON format using a POST request with an api token

## Student

/student/\*
PROTECTED

home - Home page for students :Access to options below

find - Find a new tutoring session

|**\*\***\_\_**\*\*** request - Request a session that is not in the books // May or may not implement

settings - Change options about your account

upcoming - List upcoming sessions

history - List history of sessions

## Tutor

/tutor/\*
PROTECTED

home - Home page for students :Access to options below

find - Fulfill a request a student has made that is outside of standard ours // May or many not implement

settings - Change options about your account

upcoming - List upcoming sessions

history - List history of sessions
