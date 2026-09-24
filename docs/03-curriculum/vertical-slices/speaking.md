# Validated Vertical Slice — Speaking

**Status:** VALIDATED  
**Reference outcome:** independently describe and interact about a familiar topic

## Model

Speaking combines comprehension, idea formulation, grammar/vocabulary access, pronunciation/intelligibility, fluency, automaticity, turn management, and interaction. Monologue fluency is not interaction ability.

## Slice

1. Prompt and preparation policy are explicit; planning support is recorded.
2. Model responses are optional, annotated, and protected against memorization/template dependency.
3. Attempt captures original audio, conditions, prompt, support, and preparation.
4. Audio QA precedes language evaluation.
5. ASR creates an uncertain interpretation, never the authoritative artifact.
6. Separate evaluators/observations address fluency, language, pronunciation from audio, and interaction.
7. Feedback budget selects the most actionable strengths and issues with audio-linked examples.
8. Micro-recovery targets a specific cause.
9. Retry is a new artifact/attempt and is compared with the first.
10. Follow-up questions test interaction, clarification, and repair.
11. A novel prompt and later task test transfer/retention.

## Evidence boundaries

- Transcript alone cannot establish pronunciation.
- Speaking grammar may differ from written grammar state.
- Fast speech is not automatically fluent; natural pauses and repair matter.
- Rehearsed/memorized output has lower novelty/independence.
- Pronunciation opportunity and audio confidence are tracked per observation.
- Accent is not an error when intelligibility and task demands are met.

## Technical recovery

Microphone denial, empty/corrupt recording, clipping, noise, upload failure, or low ASR confidence triggers retry, device guidance, text alternative where pedagogically valid, or safe deferment. It never creates negative learner evidence.

## Privacy

Recording requires clear consent, private object access, bounded retention, export/deletion support, and no silent reuse for model training or publication.
