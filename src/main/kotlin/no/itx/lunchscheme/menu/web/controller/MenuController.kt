package no.itx.lunchscheme.menu.web.controller

import jakarta.validation.Valid
import no.itx.lunchscheme.i18n.dto.TextDto
import no.itx.lunchscheme.iam.PermissionConstant
import no.itx.lunchscheme.menu.db.entities.LunchAvailability
import no.itx.lunchscheme.menu.db.entities.LunchBilling
import no.itx.lunchscheme.menu.db.entities.LunchOption
import no.itx.lunchscheme.menu.db.repositories.LunchOptionRepository
import no.itx.lunchscheme.menu.web.dto.BillingDto
import no.itx.lunchscheme.menu.web.dto.LunchOptionDto
import no.itx.lunchscheme.web.WebConstants.API_BASE
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate

@RestController
@RequestMapping("$API_BASE/menu")
class MenuController(
    private val lunchOptionRepository: LunchOptionRepository,
) {
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    fun getMenu(): ResponseEntity<List<LunchOptionDto>> {
        val now = LocalDate.now()

        val options = lunchOptionRepository.findAll()
            .filter { option ->
                (option.billings.any { it.isWithin(now) } || option.billings.any { it.isWithin(now.plusMonths(1)) }) &&
                (option.availabilities.any { it.isWithin(now) } || option.availabilities.any { it.isWithin(now.plusMonths(1)) })
            }

        return ResponseEntity.ok(options.map(LunchOption::toDto))
    }

    @PostMapping
    @PreAuthorize("hasAuthority('${PermissionConstant.ADMIN_MENU_EDIT}')")
    fun postLunchOption(
        @RequestBody @Valid dto: LunchOptionDto,
    ): ResponseEntity<LunchOptionDto> {
        //TODO: implement
        return ResponseEntity.status(HttpStatus.CREATED).body(dto)
    }
}