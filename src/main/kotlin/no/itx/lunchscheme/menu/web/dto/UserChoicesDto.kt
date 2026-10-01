package no.itx.lunchscheme.menu.web.dto

import no.itx.lunchscheme.web.dto.Dto

data class UserChoicesDto (
    val currentChoices: List<LunchChoiceDto>,
    val newChoices: List<LunchChoiceDto>
) : Dto()