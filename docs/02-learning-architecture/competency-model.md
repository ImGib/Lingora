# Competency Model

**Status:** FROZEN

## Definition

A competency is a stable, assessable capability. It is independent of any one lesson, topic, or item. Curriculum and competencies have a many-to-many relationship.

Create a competency only when the capability is semantically stable across content, can be observed with attributable criteria, is reusable across more than one lesson/item/context, affects a learning or planning decision, and has a defensible granularity. Otherwise use an outcome, indicator, content tag, rubric signal, or LearningClaim. Do not create competencies merely because a question has a scorable feature.

## Learning claims

A `LearningClaim` is a precise inference about a competency under stated modality and conditions; it is not the competency itself. Typical claims include recognition, unaided recall, controlled production, independent production, near/far transfer, delayed retention, and contextual automaticity. Claims connect evidence requirements to competencies and may initially be represented by stable codes/configuration rather than a new table.

## Taxonomy

- Language knowledge: grammar concepts, lexeme senses, chunks, functions, discourse, and pronunciation knowledge.
- Receptive skills: listening and reading processes.
- Productive skills: writing, speaking, pronunciation production, and interaction.
- Academic skills: note-taking, summarizing, synthesis, seminar/lecture participation.
- Exam strategies: format- and task-specific strategies, dependent on language competence.
- Metacognitive strategies: planning, monitoring, self-correction, and support management.
- Study Abroad capabilities: lecture/seminar participation, clarification and repair, note-taking, academic communication/integrity, practical interaction, and help-seeking.

## Identity and graph

Each competency has a UUID, stable human-readable code, domain, type, description, criticality, version, and lifecycle. Relations include `PREREQUISITE_OF`, `PART_OF`, `SUPPORTS`, `TRANSFER_TO`, and `CONTRASTS_WITH`, with optional strength and condition.

Examples:

```text
GRAM.PRESENT_SIMPLE.THIRD_PERSON
LISTEN.EXPLICIT_TIME
WRITE.PARAGRAPH.COHERENCE
SPEAK.INTERACTION.CLARIFICATION
```

Indicators provide diagnosable observable facets without requiring a state row for every micro-behavior.

## Modality

The same competency can differ across recognition, listening recognition, reading recognition, controlled written production, free written production, controlled oral production, and spontaneous speaking. The core learner-state key is:

```text
(learner_id, competency_id, modality)
```

Topic is context on evidence, not part of the state key.

## Depth and promotion

Competency requirements may specify recognition, recall, controlled application, independent application, contextual automaticity, retention, and transfer. Automaticity combines speed and accuracy only within comparable task, modality, device, support, and pressure contexts; fast guessing is not fluent capability. Thresholds are competency-specific:

- knowledge may require recall and delayed retention;
- receptive skills require authentic input variation and first-pass performance;
- productive skills require independent whole-task production and transfer;
- strategies cannot compensate for missing language prerequisites.

L1-associated patterns can prioritize low-risk probes or explanations, but native language is not a diagnostic label. Cross-skill evidence can support several claims only when each mapping preserves attribution, prerequisites, and confounds.

## Vocabulary specialization

Vocabulary is modeled at lexeme-sense/chunk level. Receptive and productive state, exposure, recall, last-seen, last-recalled, and review-due may be specialized. Frequency, goal relevance, generativity, and prerequisite value control admission; not every encountered word enters SRS.
