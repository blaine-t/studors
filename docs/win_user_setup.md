# Windows No Admin Install

## Downloads

Download required stuff:

[VS Code](https://code.visualstudio.com/download)

[Postgres Binaries](https://www.enterprisedb.com/download-postgresql-binaries)

[Node Binaries](https://nodejs.org/en/download/current/)

## Installations

Install VS Code

Unzip Postgres Binaries to %appdata%/pgsql

Unzip Node Binaries to %appdata%/node/{VERSION}

Add %appdata%/pgsql/bin and %appdata%/node/{VERSION} to your user environment variables path

## Commands

Open a powershell window

Run initdb -D C:\Users\{USERNAME}\Documents\Studors\db -U studorsadmin -W -E UTF8 -A scram-sha-256

Enter the password you'll use for the database

Run pg_ctl.exe -D C:\Users\{USERNAME}\Documents\Studors\db start

psql studors studorsadmin -f init.sql

## Node setup

Go to Studors location

run npm i

run npm run build

cd ./dist

node .

Now you can edit files css and ejs files in dist and it should take effect on a non-cached reload

## References

https://tutlinks.com/install-postgresql-without-admin-rights-windows/

https://stackoverflow.com/questions/37029089/how-to-install-nodejs-lts-on-windows-as-a-local-user-without-admin-rights
