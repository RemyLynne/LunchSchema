INSERT INTO texts (content, system_key)
VALUES ('Admin: View menu', 'permission.admin.menu.view.title');
SET @admin_menu_view_title_id = LAST_INSERT_ID();

INSERT INTO texts (content, system_key)
VALUES ('Admin: Edit menu', 'permission.admin.menu.edit.title');
SET @admin_menu_edit_title_id = LAST_INSERT_ID();


INSERT INTO text_translations (text_id, language, content)
VALUES (@admin_menu_view_title_id, 'en', 'Admin: View menu'),
       (@admin_menu_view_title_id, 'no', 'Administrator: Vis meny'),
       (@admin_menu_edit_title_id, 'en', 'Admin: Edit menu'),
       (@admin_menu_edit_title_id, 'no', 'Administrator: Rediger meny');


INSERT INTO permissions (name, title_text_id)
VALUES ('admin.menu.view', @admin_menu_view_title_id),
       ('admin.menu.edit', @admin_menu_edit_title_id);

INSERT INTO roles_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
         CROSS JOIN permissions p
WHERE r.system_key = 'admin'
  AND (p.name IN ('admin.menu.view', 'admin.menu.edit'));
