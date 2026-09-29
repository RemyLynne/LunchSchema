INSERT INTO texts (content, system_key)
VALUES ('View all roles', 'permission.roles.view.title');
SET @roles_view_title_id = LAST_INSERT_ID();

INSERT INTO texts (content, system_key)
VALUES ('Edit roles', 'permission.roles.edit.title');
SET @roles_edit_title_id = LAST_INSERT_ID();

INSERT INTO texts (content, system_key)
VALUES ('View all permissions', 'permission.permissions.view.title');
SET @permissions_view_title_id = LAST_INSERT_ID();


INSERT INTO text_translations (text_id, language, content)
VALUES (@roles_view_title_id, 'en', 'View all roles'),
       (@roles_view_title_id, 'no', 'Vis alle roller'),
       (@roles_edit_title_id, 'en', 'Edit roles'),
       (@roles_edit_title_id, 'no', 'Rediger roller'),
       (@permissions_view_title_id, 'en', 'View all permissions'),
       (@permissions_view_title_id, 'no', 'Vis alle tilganger');


INSERT INTO permissions (name, title_text_id)
VALUES ('roles.view', @roles_view_title_id),
       ('roles.edit', @roles_edit_title_id),
       ('permissions.view', @permissions_view_title_id);

INSERT INTO roles_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
         CROSS JOIN permissions p
WHERE r.system_key = 'admin'
  AND (p.name IN ('roles.view', 'roles.edit', 'permissions.view'));