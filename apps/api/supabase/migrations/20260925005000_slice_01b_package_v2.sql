BEGIN;
-- Keep v1 immutable for attempts that already pinned it. The latest published
-- version is selected for new attempts and lesson delivery.
DROP INDEX learning_package_versions_one_published_idx;
INSERT INTO learning_package_versions (id,learning_package_id,version,status,provenance,published_at)
VALUES ('30000000-0000-4000-8000-000000000012','30000000-0000-4000-8000-000000000001',2,'PUBLISHED','HUMAN_AUTHORED',now());

INSERT INTO activities (id,learning_package_version_id,code,activity_type,title,position,content) VALUES
 ('30000000-0000-4000-8000-000000000013','30000000-0000-4000-8000-000000000012','ACT.NOTICE','INSTRUCTION','Notice the change',1,'{"body":"Compare: I work every day. She works every day."}'),
 ('30000000-0000-4000-8000-000000000014','30000000-0000-4000-8000-000000000012','ACT.RECOGNIZE','RECOGNITION','Choose the routine form',2,'{"instruction":"Choose the form that completes the sentence."}'),
 ('30000000-0000-4000-8000-000000000015','30000000-0000-4000-8000-000000000012','ACT.CONTROLLED','CONTROLLED_PRACTICE','Try a regular verb',3,'{"instruction":"Type the form of the supplied verb. A hint is available."}'),
 ('30000000-0000-4000-8000-000000000016','30000000-0000-4000-8000-000000000012','ACT.INDEPENDENT','INDEPENDENT_CHECK','Produce the form',4,'{"instruction":"Type the verb form without a hint."}'),
 ('30000000-0000-4000-8000-000000000017','30000000-0000-4000-8000-000000000012','ACT.REFLECT','REFLECTION','Quick reflection',5,'{"body":"What changes when the subject is he, she, or it?"}');

INSERT INTO item_families (id,code,construct,exposure_policy) VALUES
 ('40000000-0000-4000-8000-000000000011','FAMILY.3PS.CONTROLLED.PLAY','Supported regular third-person production with play','{"strongEvidenceRepeatLimit":1}'),
 ('40000000-0000-4000-8000-000000000017','FAMILY.3PS.INDEPENDENT.READ','Independent regular third-person production with read','{"strongEvidenceRepeatLimit":1}');
INSERT INTO learning_items (id,item_family_id,code) VALUES
 ('40000000-0000-4000-8000-000000000012','40000000-0000-4000-8000-000000000011','ITEM.3PS.CONTROLLED.PLAY'),
 ('40000000-0000-4000-8000-000000000016','40000000-0000-4000-8000-000000000017','ITEM.3PS.INDEPENDENT.READ.V2');
INSERT INTO learning_item_versions (id,learning_item_id,version,status,purpose,evidence_eligibility,response_type,prompt,answer_definition,feedback_definition,support_policy,provenance,published_at) VALUES
 ('40000000-0000-4000-8000-000000000013','40000000-0000-4000-8000-000000000002',2,'PUBLISHED','PRACTICE','FORMATIVE','SINGLE_CHOICE','{"text":"Mai ___ at a café every day.","options":["work","works"]}','{"accepted":["works"]}','{"explanation":"With Mai (she), add -s: works."}','{"hintAllowed":false}','HUMAN_AUTHORED',now()),
 ('40000000-0000-4000-8000-000000000014','40000000-0000-4000-8000-000000000012',1,'PUBLISHED','PRACTICE','FORMATIVE','SHORT_TEXT','{"text":"She ___ football every weekend. (play)"}','{"accepted":["plays"]}','{"explanation":"She is third person singular, so play becomes plays."}','{"hintAllowed":true,"hint":"For she, add -s to the regular verb play."}','HUMAN_AUTHORED',now()),
 ('40000000-0000-4000-8000-000000000015','40000000-0000-4000-8000-000000000016',1,'PUBLISHED','ASSESSMENT','FORMATIVE','SHORT_TEXT','{"text":"Every evening, Nam ___ a book. (read)"}','{"accepted":["reads"]}','{"explanation":"Nam is he, so read becomes reads."}','{"hintAllowed":false}','HUMAN_AUTHORED',now());
INSERT INTO activity_items (activity_id,learning_item_version_id,position) VALUES
 ('30000000-0000-4000-8000-000000000014','40000000-0000-4000-8000-000000000013',1),
 ('30000000-0000-4000-8000-000000000015','40000000-0000-4000-8000-000000000014',1),
 ('30000000-0000-4000-8000-000000000016','40000000-0000-4000-8000-000000000015',1);
INSERT INTO learning_item_competencies (learning_item_version_id,competency_id,learning_claim,modality) VALUES
 ('40000000-0000-4000-8000-000000000013','20000000-0000-4000-8000-000000000003','RECOGNIZE_REGULAR_3PS','WRITTEN_RECOGNITION'),
 ('40000000-0000-4000-8000-000000000014','20000000-0000-4000-8000-000000000003','PRODUCE_REGULAR_3PS_WITH_SUPPORT','WRITTEN_PRODUCTION'),
 ('40000000-0000-4000-8000-000000000015','20000000-0000-4000-8000-000000000003','INDEPENDENTLY_PRODUCE_REGULAR_3PS','WRITTEN_PRODUCTION');
COMMIT;
