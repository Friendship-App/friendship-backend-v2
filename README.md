# Friendship backend

Backend for [Friendship](https://friendship.fi/).

To develop first create a postgres database and run databases migrations with

```
export DATABASE_URL='postgres://user:password@host:port/databasename'
npm run db:migrate
```

The default is database `friendship` on `localhost` with user `postgres` and no password.

At the moment the backend requires a connection to the actual AWS S3 even locally, so set that up and give credentials in environment variables and run auto-restarting backend with

```
export AWS_ACCESS_KEY_ID=accesskey
export AWS_SECRET_ACCESS_KEY=secret_accesskey
export DATABASE_URL='postgres://user:password@host:port/databasename'
npm run watch
```
