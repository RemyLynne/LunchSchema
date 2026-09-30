package no.itx.lunchscheme.menu.web.controller

import jakarta.transaction.Transactional
import jakarta.validation.Valid
import no.itx.lunchscheme.i18n.TranslationService
import no.itx.lunchscheme.i18n.db.entities.Text
import no.itx.lunchscheme.iam.PermissionConstant
import no.itx.lunchscheme.menu.db.entities.LunchBilling
import no.itx.lunchscheme.menu.db.entities.LunchOption
import no.itx.lunchscheme.menu.db.repositories.LunchOptionRepository
import no.itx.lunchscheme.menu.web.dto.LunchOptionRequestDto
import no.itx.lunchscheme.menu.web.dto.LunchOptionResponseDto
import no.itx.lunchscheme.web.WebConstants.API_BASE
import no.itx.lunchscheme.web.exception.HttpEndpointException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.DayOfWeek
import java.time.LocalDate

@RestController
@RequestMapping("$API_BASE/menu")
class MenuController(
    private val lunchOptionRepository: LunchOptionRepository,
    private val translationService: TranslationService,
) {
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    fun getMenu(): ResponseEntity<List<LunchOptionResponseDto>> {
        val now = LocalDate.now()

        val options = lunchOptionRepository.findByEndDateIsNullOrEndDateAfter(now.minusDays(1))
            .filter { option ->
                (option.billings.any { it.isWithin(now) } || option.billings.any { it.isWithin(now.plusMonths(1)) }) &&
                (option.availabilities.any { it.isWithin(now) } || option.availabilities.any { it.isWithin(now.plusMonths(1)) })
            }

        return ResponseEntity.ok(options.map(LunchOption::toDto))
    }

    @PostMapping
    @PreAuthorize("hasAuthority('${PermissionConstant.ADMIN_MENU_EDIT}')")
    @Transactional
    fun postLunchOption(
        @RequestBody @Valid postRequest: LunchOptionRequestDto,
    ): ResponseEntity<LunchOptionResponseDto> {
        val new = postRequest.id == null

        var option = if (new) {
            val obj = LunchOption(Text(""), null)
            lunchOptionRepository.save(obj)//saving required before update
        } else {
            lunchOptionRepository.findByIdAndEndDateIsNull(postRequest.id).orElseThrow {
                HttpEndpointException(translationService.get("error.lunch.idNotFound", postRequest.id), HttpStatus.BAD_REQUEST)
            }
        }

        option.title = Text.fromDto(postRequest.name)
        option.setNewBilling(postRequest.billing.price, LunchBilling.BillingPeriod.fromDto(postRequest.billing.billingPeriod))
        option.setNewAvailabilities(postRequest.availableDays.map { DayOfWeek.of(it+1) }.toSet())

        option = lunchOptionRepository.save(option)

        return ResponseEntity.status(if (new) HttpStatus.CREATED else HttpStatus.OK).body(option.toDto())
    }

    @PostMapping("/{id}/remove")
    @PreAuthorize("hasAuthority('${PermissionConstant.ADMIN_MENU_EDIT}')")
    fun deactivate(
        @PathVariable id: Int
    ): ResponseEntity<Void> {
        val option = lunchOptionRepository.findByIdAndEndDateMaybeAfter(id, LocalDate.now()).orElseThrow {
            HttpEndpointException(translationService.get("error.lunch.idNotFound", id), HttpStatus.BAD_REQUEST)
        }

        val now = LocalDate.now()
        option.endDate = now.plusMonths(1).withDayOfMonth(1)
        lunchOptionRepository.save(option)

        return ResponseEntity.status(HttpStatus.OK).body(null)
    }

    @PostMapping("/{id}/remove/cancel")
    @PreAuthorize("hasAuthority('${PermissionConstant.ADMIN_MENU_EDIT}')")
    fun reactivate(
        @PathVariable id: Int
    ): ResponseEntity<Void> {
        val option = lunchOptionRepository.findByIdAndEndDateMaybeAfter(id, LocalDate.now()).orElseThrow {
            HttpEndpointException(translationService.get("error.lunch.idNotFound", id), HttpStatus.BAD_REQUEST)
        }

        option.endDate = null
        lunchOptionRepository.save(option)

        return ResponseEntity.status(HttpStatus.OK).body(null)
    }
}