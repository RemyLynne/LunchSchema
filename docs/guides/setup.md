# Setup

## Requirements

- Java (only tested on 25)
- Application requires a Mysql Database (see [docker-compose.yml](../../docker-compose.yaml))
- `.env` file, containing connection info to the database (see [.env.template](../../.env.template))
- Http access to the server (default port 8080, can be changed by `server.port` in `.env`)

## Running

No prebuilt binaries are available, so building from source is the only way (see [building](./building.md))

## Create initial user

The system does not implement self-registration, and so requires that each user is registered manually

After running the SQL bellow, navigate to `/register` as to set your password and log in

```sql
SET @email = :email; -- Replace with your email
SET @name = :name; -- Replace with your name
INSERT INTO users (email, name)
VALUES (@email, @name);
```

## Give yourself admin

As there currently is no admin user, you have to manually make yourself the admin

The SQL bellow should should give yourself the admin role

```sql
SET @email = :email; -- Replace with your email
INSERT INTO users_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u CROSS JOIN roles r
WHERE u.email = @email
  AND r.system_key = 'admin' -- The admin role
  AND NOT EXISTS ( -- Don't error if the user already has the role
    SELECT 1 FROM users_roles ur
    WHERE ur.user_id = u.id AND ur.role_id = r.id
  );
```