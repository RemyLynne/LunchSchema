INSERT INTO texts (content, system_key)
VALUES ('View overview', 'permission.overview.view.title');
SET @overview_view_title_id = LAST_INSERT_ID();

INSERT INTO texts (content, system_key)
VALUES ('View users overview', 'permission.overview.users.view.title');
SET @overview_users_view_title_id = LAST_INSERT_ID();

INSERT INTO texts (content, system_key)
VALUES ('Edit users overview', 'permission.overview.users.edit.title');
SET @overview_users_edit_title_id = LAST_INSERT_ID();


INSERT INTO text_translations (text_id, language, content)
VALUES (@overview_view_title_id, 'en', 'View overview'),
       (@overview_view_title_id, 'no', 'Vis oversikt'),
       (@overview_users_view_title_id, 'en', 'View users overview'),
       (@overview_users_view_title_id, 'no', 'Vis brukere\'s oversikt'),
       (@overview_users_edit_title_id, 'en', 'Edit users overview'),
       (@overview_users_edit_title_id, 'no', 'Rediger brukere\'s oversikt');


INSERT INTO permissions (name, title_text_id)
VALUES ('overview.view', @overview_view_title_id),
       ('overview.users.view', @overview_users_view_title_id),
       ('overview.users.edit', @overview_users_edit_title_id);

INSERT INTO roles_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
         CROSS JOIN permissions p
WHERE r.system_key = 'admin'
  AND (p.name IN ('overview.view', 'overview.users.view', 'overview.users.edit'));
