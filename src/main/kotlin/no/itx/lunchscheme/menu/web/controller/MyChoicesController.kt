package no.itx.lunchscheme.menu.web.controller

import jakarta.transaction.Transactional
import jakarta.validation.Valid
import no.itx.lunchscheme.i18n.TranslationService
import no.itx.lunchscheme.iam.db.repositories.UserRepository
import no.itx.lunchscheme.menu.db.entities.UserChoice
import no.itx.lunchscheme.menu.db.repositories.LunchOptionRepository
import no.itx.lunchscheme.menu.db.repositories.UserChoiceRepository
import no.itx.lunchscheme.menu.web.dto.LunchChoiceDto
import no.itx.lunchscheme.menu.web.dto.UserChoicesDto
import no.itx.lunchscheme.web.WebConstants.API_BASE
import no.itx.lunchscheme.web.exception.HttpEndpointException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.DayOfWeek
import java.time.LocalDate

@RestController
@RequestMapping("$API_BASE/my-choices")
class MyChoicesController(
    private val userRepository: UserRepository,
    private val userChoiceRepository: UserChoiceRepository,
    private val lunchOptionRepository: LunchOptionRepository,
    private val translationService: TranslationService
) {
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    fun getMyChoices(
        authentication: Authentication
    ): ResponseEntity<UserChoicesDto> {
        val user = userRepository.findByEmail(authentication.name).orElseThrow() //should not be able to throw
        val month = LocalDate.now().withDayOfMonth(1)

        val choices = userChoiceRepository.findByUserAndEndDateMaybeAfter(user, month)

        val current = choices.filter { it.isWithin(month) }.map { LunchChoiceDto(it.option.id!!, it.day.ordinal) }
        val new = choices.filter { it.isWithin(month.plusMonths(1)) }.map { LunchChoiceDto(it.option.id!!, it.day.ordinal) }

        return ResponseEntity.ok(UserChoicesDto(current, new))
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Transactional
    fun postMyChoices(
        @RequestBody @Valid postRequest: List<LunchChoiceDto>,
        authentication: Authentication
    ): ResponseEntity<UserChoicesDto> {
        val user = userRepository.findByEmail(authentication.name).orElseThrow() //should not be able to throw
        val month = LocalDate.now().withDayOfMonth(1)

        val choices = userChoiceRepository.findByUserAndEndDateMaybeAfter(user, month)

        val current = choices.filter { it.isWithin(month) }
        var new = choices.filter { it.isWithin(month.plusMonths(1)) }

        //Remove the removed
        new.filter { choice -> postRequest.none { choice.option.id!! == it.optionId && choice.day.ordinal == it.day } }
            .forEach { choice ->
                if (choice.startDate.isBefore(month.plusMonths(1))) {
                    choice.endDate = month.withDayOfMonth(month.lengthOfMonth())
                } else
                    userChoiceRepository.delete(choice)
            }
        new = new.filter { choice -> postRequest.any { choice.option.id!! == it.optionId && choice.day.ordinal == it.day } }.toMutableList()

        //Add the added
        for ((optionId, day) in postRequest) {
            if (new.any { choice -> choice.option.id!! == optionId && choice.day.ordinal == day })
                continue

            val option = lunchOptionRepository.findByIdAndEndDateIsNull(optionId).orElseThrow {
                HttpEndpointException(translationService.get("error.lunch.idNotFound", optionId), HttpStatus.BAD_REQUEST)
            }

            val choice = userChoiceRepository.save(UserChoice(
                user,
                option,
                DayOfWeek.of(day+1),
                month.plusMonths(1),
                null
            ))

            new.add(choice)
        }

        val currentDto = current.map { LunchChoiceDto(it.option.id!!, it.day.ordinal) }
        val newDto = new.map { LunchChoiceDto(it.option.id!!, it.day.ordinal) }

        return ResponseEntity.ok(UserChoicesDto(currentDto, newDto))
    }
}