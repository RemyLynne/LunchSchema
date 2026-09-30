CREATE TABLE lunch_options (
    id            INT    AUTO_INCREMENT,
    title_text_id BIGINT NOT NULL,
    remove_date   DATE   NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_lunch_option_title
        FOREIGN KEY (title_text_id) REFERENCES texts (id)
            ON DELETE RESTRICT
);
CREATE TABLE lunch_billings (
    id             INT     AUTO_INCREMENT,
    option_id      INT     NOT NULL,
    price          INT     NOT NULL,
    billing_period TINYINT NOT NULL,
    start_date     DATE    NOT NULL,
    end_date       DATE    NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_lunch_billing_option
        FOREIGN KEY (option_id) REFERENCES lunch_options (id)
            ON DELETE CASCADE
);
CREATE TABLE lunch_availabilities (
    id         INT     AUTO_INCREMENT,
    option_id  INT     NOT NULL,
    day        TINYINT NOT NULL,
    start_date DATE    NOT NULL,
    end_date   DATE    NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_lunch_availabilities_option
        FOREIGN KEY (option_id) REFERENCES lunch_options (id)
            ON DELETE CASCADE
);