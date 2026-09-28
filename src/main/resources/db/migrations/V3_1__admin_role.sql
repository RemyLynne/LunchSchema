INSERT INTO texts (content, system_key)
VALUES ('Administrator', 'role.admin.title');
SET @admin_title_id = LAST_INSERT_ID();

INSERT INTO text_translations (text_id, language, content)
VALUES (@admin_title_id, 'en', 'Administrator'),
       (@admin_title_id, 'no', 'Administrator');

INSERT INTO roles (title_text_id, system_key, sort)
VALUES (@admin_title_id, 'admin', 1);