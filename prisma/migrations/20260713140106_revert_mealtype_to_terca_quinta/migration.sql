-- Revert the previous rename: the special-menu meal itself stays on
-- Tuesday/Thursday as originally designed. Only the ordering deadline moves
-- earlier (to Monday/Wednesday), which is a MealEvent.deadline concern, not
-- an enum concern. Metadata-only, preserves all existing rows.
ALTER TYPE "MealType" RENAME VALUE 'SEGUNDA' TO 'TERCA';
ALTER TYPE "MealType" RENAME VALUE 'QUARTA' TO 'QUINTA';
