CREATE TABLE permissions (
    id            INT          AUTO_INCREMENT,
    name          VARCHAR(150) NOT NULL,
    title_text_id BIGINT       NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_permissions_name (name),
    CONSTRAINT fk_permission_title
        FOREIGN KEY (title_text_id) REFERENCES texts (id)
            ON DELETE RESTRICT
);
CREATE TABLE roles (
    id            INT         AUTO_INCREMENT,
    title_text_id BIGINT      NOT NULL,
    system_key    VARCHAR(50) NULL,
    sort          INT         NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_roles_system_key (system_key),
    CONSTRAINT fk_roles_title_text
        FOREIGN KEY (title_text_id) REFERENCES texts (id)
            ON DELETE RESTRICT
);

CREATE TABLE roles_permissions (
    role_id       INT,
    permission_id INT,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_roles_permissions_role
        FOREIGN KEY (role_id) REFERENCES roles (id)
            ON DELETE CASCADE,
    CONSTRAINT fk_roles_permissions_permission
        FOREIGN KEY (permission_id) REFERENCES permissions (id)
            ON DELETE CASCADE
);
CREATE TABLE users_roles (
    user_id INT,
    role_id INT,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_users_roles_user
        FOREIGN KEY (user_id) REFERENCES users (id)
            ON DELETE CASCADE,
    CONSTRAINT fk_users_roles_role
        FOREIGN KEY (role_id) REFERENCES roles (id)
            ON DELETE CASCADE
);
