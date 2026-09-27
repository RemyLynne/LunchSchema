package no.itx.lunchscheme.iam.web.service

import no.itx.lunchscheme.iam.db.repositories.UserCredentialRepository
import no.itx.lunchscheme.iam.db.repositories.UserRepository
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class UserDetailsServiceImpl(
    private val userRepository: UserRepository,
    private val userCredentialRepository: UserCredentialRepository
) : UserDetailsService {
    override fun loadUserByUsername(username: String): UserDetails {
        val user = userRepository.findByEmail(username)
            .orElseThrow { UsernameNotFoundException("User $username not found") }
        val credential = userCredentialRepository.findByUser(user)
            .orElseThrow { AuthenticationCredentialsNotFoundException("User $username cannot be logged into") }

        return User
            .withUsername(user.email)
            .password(credential.hash)
            .authorities(*user.roles.flatMap { role -> role.permissions.map { it.name } }.toTypedArray())
            .build()
    }
}