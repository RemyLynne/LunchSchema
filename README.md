## Create new user

```sql
SET @email = '<email>';
SET @name = '<name>';
INSERT INTO users (email, name)
VALUES (@email, @name);
```

## Give user admin

```sql
SET @email = '<email>';
INSERT INTO users_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
         CROSS JOIN roles r
WHERE u.email = @email
  AND r.system_key = 'admin'
  AND NOT EXISTS (
    SELECT 1 FROM users_roles ur
    WHERE ur.user_id = u.id AND ur.role_id = r.id
);
```