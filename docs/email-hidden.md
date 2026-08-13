# E-mail temporarily hidden

The church e-mail is hidden across the public site because the mailbox
(`contato@irbrasilia.org`) has not been set up yet.

## How to bring it back

Flip a single flag in `config/index.ts`:

```ts
email: { active: true },
```

That re-enables every place below. No other edits are required.

## Places gated behind `website_config_variables.email.active`

| Location | What's hidden |
| --- | --- |
| `app/(site)/contato/page.tsx` | The **E-mail** contact card. While hidden, the card grid is `md:grid-cols-2` (WhatsApp + Cultos); it returns to `md:grid-cols-3` when the flag is on. |
| `app/(site)/sobre/page.tsx` | The e-mail line in the **Contato** CTA (the address line stays visible). |

## Also changed (revert manually if desired)

- `app/(site)/contato/page.tsx` — the SEO `metadata.description` dropped the
  word "e-mail". Original text:
  `"Fale com a Igreja Reformada de Brasília — e-mail, WhatsApp e horários de culto."`
  This is **not** tied to the flag; edit it back by hand once e-mail is live.

## Not affected (intentionally left as-is)

- `app/admin/mensagens/[id]/page.tsx` — the `mailto:` there is the *visitor's*
  e-mail in the admin inbox, not the church address.
- `components/pages/SettingsPageComponent.tsx` — uses `CHURCH_EMAIL` only as a
  form placeholder in the admin settings screen.

## Prerequisite for turning it on

The mailbox `contato@irbrasilia.org` must actually exist and be able to receive
mail. Separately, the `/contato` form's notification e-mail uses the `SMTP_*`
values in `.env` (see `.env.example`), which is independent of this flag.
