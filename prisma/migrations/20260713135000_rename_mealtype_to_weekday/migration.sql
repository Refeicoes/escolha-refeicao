-- Rename enum values in place (metadata-only, preserves all existing rows
-- and foreign keys). The special-menu days moved from Tuesday/Thursday to
-- Monday/Wednesday, so the enum values are renamed to match.
ALTER TYPE "MealType" RENAME VALUE 'TERCA' TO 'SEGUNDA';
ALTER TYPE "MealType" RENAME VALUE 'QUINTA' TO 'QUARTA';
