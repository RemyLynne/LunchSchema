CREATE TABLE users (
    id         BIGINT UNSIGNED                     AUTO_INCREMENT PRIMARY KEY,
    email      VARCHAR(255)                        NOT NULL,
    name       VARCHAR(255)                        NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE KEY uq_users_email (email)
);

CREATE TABLE user_credentials (
    user_id         BIGINT UNSIGNED                     PRIMARY KEY,
    hash            VARCHAR(255)                        NOT NULL,
    last_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_user_credentials_user_id
        foreign key (user_id) references users (id)
            on delete cascade
);

CREATE TABLE user_sessions (
    id           BIGINT UNSIGNED                     AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT UNSIGNED                     NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at   TIMESTAMP                           NOT NULL,
    revoked_at   TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_user_sessions_user_id
        FOREIGN KEY (user_id) REFERENCES users (id)
            ON DELETE CASCADE
);

CREATE TABLE user_tokens (
    id          BIGINT UNSIGNED                     AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED                     NOT NULL,
    type        INT                                 NOT NULL,
    hash        TEXT                                NOT NULL,
    session_id  BIGINT UNSIGNED DEFAULT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at  TIMESTAMP                           NOT NULL,
    consumed_at TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_user_tokens_user_id
        FOREIGN KEY (user_id) REFERENCES users (id)
            ON DELETE CASCADE,
    CONSTRAINT fk_user_tokens_session_id
        FOREIGN KEY (session_id) REFERENCES user_sessions (id)
            ON DELETE CASCADE
);

CREATE TABLE auth_logs (
    id          BIGINT UNSIGNED                     AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED DEFAULT NULL,
    occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ip          VARCHAR(45) DEFAULT NULL,
    user_agent  TEXT DEFAULT NULL,
    action      INT                                 NOT NULL,
    result      INT                                 NOT NULL,
    reason      VARCHAR(255) DEFAULT NULL,
    session_id  BIGINT UNSIGNED DEFAULT NULL,
    CONSTRAINT fk_auth_logs_user_id
        FOREIGN KEY (user_id) REFERENCES users (id)
            ON DELETE CASCADE,
    CONSTRAINT fk_auth_logs_session_id
        FOREIGN KEY (session_id) REFERENCES user_sessions (id)
            ON DELETE CASCADE
);