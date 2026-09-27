CREATE TABLE users (
    id         INT                                 AUTO_INCREMENT,
    email      VARCHAR(255)                        NOT NULL,
    name       VARCHAR(255)                        NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email)
);

CREATE TABLE user_credentials (
    user_id         INT,
    hash            VARCHAR(255)                        NOT NULL,
    last_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id),
    CONSTRAINT fk_user_credentials_user
        FOREIGN KEY (user_id) REFERENCES users (id)
            ON DELETE CASCADE
);

CREATE TABLE auth_logs (
    id          BIGINT UNSIGNED                     AUTO_INCREMENT,
    user_id     INT                                 NULL,
    occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ip          VARCHAR(45)                         NULL,
    user_agent  TEXT                                NULL,
    action      INT                                 NOT NULL,
    result      INT                                 NOT NULL,
    reason      VARCHAR(255)                        NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_auth_logs_user
         FOREIGN KEY (user_id) REFERENCES users (id)
             ON DELETE CASCADE
);