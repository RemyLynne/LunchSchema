CREATE TABLE texts (
    id         BIGINT      AUTO_INCREMENT,
    content    TEXT        NOT NULL,
    system_key VARCHAR(50) NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_text_system_key (system_key)
);

CREATE TABLE text_translations (
    text_id  BIGINT,
    language VARCHAR(10) NOT NULL,
    content  TEXT        NOT NULL,
    PRIMARY KEY (text_id, language),
    CONSTRAINT fk_text_translation_text
        FOREIGN KEY (text_id) REFERENCES texts (id)
            ON DELETE CASCADE
)