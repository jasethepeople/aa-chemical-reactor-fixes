# AA Chemical Reactor — Bug Fix Patch Set

Apply these on top of the original code you posted. Nothing here changes
architecture or behavior beyond making the broken parts actually work.

## Files in this patch

| File | What it fixes |
|---|---|
| `src/data/compounds-additions.ts` | Adds `sulfur`, `iron`, `calcium-chloride`, `sodium-nitrate`, `silver-chloride`, `ethyl-acetate` — 6 compounds that reactions.ts referenced but compounds.ts never defined. Append this array to `COMPOUNDS` in compounds.ts. |
| `src/data/reactions-patch.ts` | Corrected versions of the 6 reaction rules that pointed at those missing compounds, plus fixed catalyst IDs for Haber-Bosch and esterification (they referenced catalyst IDs — `iron-catalyst`, `sulfuric-acid-catalyst` — that were never defined anywhere, so those reactions could never actually get their catalyst bonus). Replace the matching entries in `REACTION_RULES`. |
| `src/hooks/useAuth.tsx` | Renamed from `.ts` → `.tsx` (it returns JSX, which a `.ts` file can't parse) and added the missing `React` import. |
| `server/src/types/express.d.ts` | Type augmentation so `req.user` compiles — routes/middleware read it but the base Express `Request` type doesn't have it. |
| `server/src/middleware/auth.ts` | Was imported by `routes/recipes.ts` but never actually written — minimal JWT-based implementation. |
| `src/components/ReactorLab/ReactorLab-patch-notes.md` | Small `useEffect` to clamp temperature/pressure when you switch reactor type, so switching to a lower-limit reactor (e.g. Vacuum) doesn't leave you holding an out-of-range value that fails opaquely. |

## Not fixed (needs your input, not a bug)

- `services/LicenseService.ts` and `services/AuditService.ts` are in the
  original folder tree but were never implemented — `middleware/license.ts`'s
  `checkLicense` works standalone so routes will run, but if you want real
  DB-backed license/audit persistence those two files still need writing.
  Happy to do that next if you want the SaaS side fleshed out rather than
  just the sandbox.
