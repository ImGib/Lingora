BEGIN;

-- Planner v1 Increment: Due-time persistence, spaced review/verify candidate types,
-- and duration estimates for minimum viable day adaptation.

ALTER TABLE plan_blocks DROP CONSTRAINT IF EXISTS plan_blocks_block_type_check;
ALTER TABLE plan_blocks ADD CONSTRAINT plan_blocks_block_type_check
  CHECK (block_type IN ('LESSON', 'PRACTICE', 'BREAK', 'REVIEW', 'VERIFY', 'TRANSFER'));

ALTER TABLE plan_blocks ADD COLUMN IF NOT EXISTS due_at TIMESTAMPTZ;
ALTER TABLE plan_blocks ADD COLUMN IF NOT EXISTS estimated_minutes INT NOT NULL DEFAULT 15;

CREATE INDEX IF NOT EXISTS idx_plan_blocks_due_at
  ON plan_blocks (due_at) WHERE status = 'PENDING';

COMMIT;
