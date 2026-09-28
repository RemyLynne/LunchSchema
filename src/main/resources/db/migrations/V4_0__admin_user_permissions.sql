INSERT INTO texts (content, system_key)
VALUES ('Admin: View all users', 'permission.admin.users.view.title');
SET @admin_users_view_title_id = LAST_INSERT_ID();

INSERT INTO texts (content, system_key)
VALUES ('Admin: Edit users', 'permission.admin.users.edit.title');
SET @admin_users_edit_title_id = LAST_INSERT_ID();


INSERT INTO text_translations (text_id, language, content)
VALUES (@admin_users_view_title_id, 'en', 'Admin: View all users'),
       (@admin_users_view_title_id, 'no', 'Administrator: Vis alle brukere'),
       (@admin_users_edit_title_id, 'en', 'Admin: Edit users'),
       (@admin_users_edit_title_id, 'no', 'Administrator: Rediger brukere');


INSERT INTO permissions (name, title_text_id)
VALUES ('admin.users.view', @admin_users_view_title_id),
       ('admin.users.edit', @admin_users_edit_title_id);

INSERT INTO roles_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
        CROSS JOIN permissions p
WHERE r.system_key = 'admin'
    AND (p.name IN ('admin.users.view', 'admin.users.edit'));