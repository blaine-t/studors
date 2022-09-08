# Google Cloud OAuth setup

## Google Cloud Console

Go to the google cloud console: https://console.cloud.google.com

Create a new project

Go to the API dashboard: https://console.cloud.google.com/apis/dashboard

## OAuth consent screen

Select external

Fill out info and go to next

Add 2 non-sensitive scopes of email and profile

Finalize and go back to dashboard

## OAuth Credentials

Go to Credentials

Create Credentials

Oauth Client ID

Application Type - Web Application

Add these authorized redirect URIs:

http://127.0.0.1:19090/auth/student/google

http://127.0.0.1:19090/auth/tutor/google

http://127.0.0.1:19090/auth/admin/google

Create

## Add to project

Copy the client ID and client Secret into the .env file for the project

Now you should be able to use Google OAuth in the project as soon as the URIs goes through Google's servers
