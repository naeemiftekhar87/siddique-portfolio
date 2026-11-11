# Admin authenticator and password recovery

Owner-requested scope addition, 2026-11-11. Uses the existing Supabase Auth and Resend integrations; no Google API credentials, new database tables, or new dependencies are required.

## Configuration

1. Set `SITE_URL=https://mdtsid.com` in the deployment environment (owner-confirmed production URL). This is set in the local gitignored `.env` for production-link generation; it must also be set in Vercel. For development links only, use `http://localhost:3000` with the actual development port. Reset links never use the request's Host header.
2. Configure `RESEND_API_KEY` and `CONTACT_FROM_EMAIL`. The sender must be on a domain verified in Resend. If `CONTACT_FROM_EMAIL` is absent, the existing `onboarding@resend.dev` test sender works only when the admin sign-in email is the Resend account's own address. Reset messages go to the **admin sign-in email**, not `CONTACT_TO_EMAIL` or the public Profile email.
3. Confirm that TOTP enrollment and verification are enabled in Supabase Authentication's MFA settings. Supabase stores the authenticator secret and verifies codes. Its email OTP expiry controls the reset link lifetime; configure a suitable expiry in Supabase Auth. The app's recovery session lasts at most 15 minutes after link verification.
4. Deploy, then verify one real email delivery and complete authenticator setup with your own phone. No live account password or factor is changed by development checks.

Recovery uses the server-only Supabase `generateLink({ type: "recovery" })` API and sends the token link through the existing Resend adapter. It does not depend on Supabase custom SMTP, email template changes or redirect allowlisting.

## Enable or remove an authenticator

Sign in and open **Admin → Settings → Google Authenticator → Set up authenticator**. In Google Authenticator, scan the QR code or enter the private setup key, then enter its current six-digit code and choose **Verify and enable**. Protection starts only after successful verification. Subsequent password sign-ins require a code before accessing any admin data or mutations.

Keep an authenticator backup or retain access to the device. This implementation does not issue backup codes. To remove protection while you still have the phone, choose **Remove authenticator**, enter a fresh code and choose **Confirm removal**. Removal signs you out.

If the authenticator is lost, a password-reset email **does not remove or bypass MFA**. An operator with access to this project's Supabase dashboard must verify ownership and remove the affected user's MFA factor there (or use the server-only Supabase Admin MFA API). Do not share the setup key, password, reset link, or service secret in chat. Sign in and enroll a replacement device afterwards.

## Reset a forgotten password

Choose **Forgot password?** at `/admin/login`, then enter the admin sign-in email. The response is deliberately the same whether the account exists, is rate limited, or email delivery fails. Delivery/configuration failures are recorded without the reset token in server logs.

The email opens `/admin/reset-password#token_hash=…`. The token stays in the URL fragment so it is not sent in HTTP URLs or referrers. Merely opening the page does not consume it: choose **Continue to reset password**. This removes the token from browser history and verifies it with Supabase. The link is single-use and expires according to Supabase Auth settings.

Enter matching passwords of 12–128 characters and, if enabled, the current authenticator code. On success the app requests global Supabase session revocation, clears its local authentication/recovery markers and asks you to sign in again. Supabase access JWTs already issued to other devices can remain valid until their expiry; global sign-out revokes their refresh sessions. A recovery session never grants access to the CMS.

## Security and rollout

- Both the central guard (used by data reads, writes and APIs) and navigation proxy require `aal2` whenever a currently verified TOTP factor exists. The factor state is fetched from Supabase rather than inferred only from potentially older JWT claims.
- Password-only sign-in receives a session-bound, signed pending-MFA cookie, with a 15-minute maximum lifetime. The signed eight-hour admin marker is issued only after MFA succeeds, or after password login for an account without an enrolled factor.
- Admin, pending-MFA and recovery markers are bound to the exact Supabase session ID. Copying a marker from a previous login cannot turn an email recovery session into an admin session. Existing admin cookies from before this change are invalidated: sign in again after deployment.
- Recovery tokens, passwords and codes are validated on the server. Account/address-based Supabase-backed rate limits fail closed. Password recovery does not use the privileged Admin API to write a new password; it uses the verified user's recovery session with its MFA assurance.
- Setup secrets are returned only to a fully authorized admin and removed from component state after verification or cancellation. Abandoned unverified factors are cleared when setup restarts. Verified factors are removed only by the confirmed, code-verified removal flow.

Reference: [Supabase TOTP MFA](https://supabase.com/docs/guides/auth/auth-mfa/totp), [generateLink](https://supabase.com/docs/reference/javascript/auth-admin-generatelink), [verifyOtp](https://supabase.com/docs/reference/javascript/auth-verifyotp), [signOut](https://supabase.com/docs/reference/javascript/auth-signout).
