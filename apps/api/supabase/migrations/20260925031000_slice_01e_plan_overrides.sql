BEGIN;
ALTER TABLE plan_blocks
  ADD COLUMN last_override text CHECK (last_override IN ('SKIP','DEFER','REPLACE','EXPLORE')),
  ADD COLUMN replaced_from text CHECK (replaced_from IN ('LESSON','PRACTICE')),
  ADD COLUMN explored_at timestamptz;
COMMIT;
