# Docker Setup

## PRE-REQ

You must follow the [oauth setup guide](/dev/docs/oauth_setup.md) before following this guide if you want to use Google Oauth (currently only supported authentication).

## Getting files

### Option 1: Release (Recommended)

Download the release zip and extract it using your tool of choice in the directory where you want to run the docker compose from.

### Option 2: Build

To build the files needed for docker employment these are the steps.

1. Clone the repo
2. Install required node modules using npm i
3. Run npm docker-build
4. Move the files from /dev/docker to the directory you want to run the docker compose from.

## Configuring

### Node

`cp studors-node.env.example studors-node.env`

Using your text editor of choice edit studors-node.env and edit the following variables to your preference.

| Variable               | Description                                                                                | Default                                  | Options                    |
| ---------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------- | -------------------------- |
| `NODE_ENV`             | Changes how the security and proxy works on the app. If using in deployment use production | `production`                             | `production` `development` |
| `SCHOOL`               | The string that will be displayed in the bottom left of the footer                         | `Example High`                           | Any String                 |
| `CONTACT`              | What shows up on the contact page when a user visits it                                    | See example.env                          | Any HTML Code              |
| `GOOGLE_CLIENT_ID`     | The ID you get from Google oauth when you set it up                                        | ...X.apps.googleusercontent.com          | Valid client ID            |
| `GOOGLE_CLIENT_SECRET` | The secret you get from Google oauth when you set it up                                    | XXXXXX...                                | Valid client secret        |
| `SERVER_URL`           | Callback URL for Google oauth. Replace with your domain                                    | `http://127.0.0.1:19090`                 | Valid URL                  |
| `PGUSER`               | Name of the postgres user                                                                  | `studorsadmin`                           | Any username               |
| `PGHOST`               | Hostname of the database                                                                   | `db` for docker `localhost` for native   | Any hostname               |
| `PGDATABASE`           | The database name                                                                          | `studors`                                | Any string                 |
| `PGPASSWORD`           | The password for the database                                                              | `RANDOM_PASSWORD_HERE` **PLEASE CHANGE** | Any string                 |
| `PGPORT`               | The port for the database                                                                  | `37073` for docker `5432` for native     | 1-65535                    |

### Postgres

`cp studors-postgres.env.example studors-postgres.env`

Using your text editor of choice edit studors-node.env and edit the following variables to your preference.

| Variable            | Description                   | Default                                  | Options      |
| ------------------- | ----------------------------- | ---------------------------------------- | ------------ |
| `POSTGRES_USER`     | Name of the postgres user     | `studorsadmin`                           | Any username |
| `POSTGRES_PASSWORD` | The password for the database | `RANDOM_PASSWORD_HERE` **PLEASE CHANGE** | Any string   |
| `POSTGRES_DB`       | The database name             | `studors`                                | Any string   |

### SQL

Finally, you need to edit the init.sql file to add the initial admin user so you can use Studors. Edit the last line value to your wanted email. For example:

<table>
<tr>
<td> Initial </td> <td> Modified </td>
</tr>
<tr>
<td>

```sql
insert into
  allowedadmins(email)
VALUES
  ('studors@example.com');

```

<td>

```sql
insert into
  allowedadmins(email)
VALUES
  ('newEmail@example.com');

```

</td>
</tr>
</table>

### Docker Compose

You can optionally edit the docker-compose.yaml but the defaults should be good for most users.

## Running

Now you should be able to run `docker-compose up -d` and both the Postgres database and Node instance should launch together in their own network.

You can now access the node instance from {IP}:19090. You can forward this through your reverse proxy to allow for others to access.
