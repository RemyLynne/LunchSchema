CREATE TABLE user_choices (
    id         INT     AUTO_INCREMENT,
    user_id    INT     NOT NULL,
    option_id  INT     NOT NULL,
    day        TINYINT NOT NULL,
    start_date DATE    NOT NULL,
    end_date   DATE    NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_user_choice_user
        FOREIGN KEY (user_id) REFERENCES users (id)
            ON DELETE CASCADE,
    CONSTRAINT fk_user_choice_option
        FOREIGN KEY (option_id) REFERENCES lunch_options (id)
            ON DELETE CASCADE
)