import { Controller, Get, Inject, Query } from '@nestjs/common';
import type { Pool } from 'pg';
import { DATABASE_POOL } from '../../infrastructure/database/database.module.js';
import type { GrammarQuizDto, GrammarTopicDto, GrowthStageDto, IpaPhonemeDto, RoadmapWorldDto } from '@lingora/contracts';

type WorldRow = {
  world_id: number;
  level: string;
  title: string;
  band: string;
  badge: string;
  duration: string;
  theme_color: string;
  summary: string;
  outcome: string;
  gates: RoadmapWorldDto['gates'];
};

type PhonemeRow = {
  symbol: string;
  label: string;
  category: 'monophthong' | 'diphthong' | 'consonant';
  subCategory: string | null;
  tag: string;
  mouthDesc: string;
  tongueDesc: string;
  voiceDesc: string;
  frontCaption: string;
  sideCaption: string;
  sampleWord: string;
  sampleIpa: string;
  sampleMeaning: string;
  vietnameseTip: string | null;
  isVoiced: boolean;
  isLong: boolean;
};

type TopicRow = {
  id: string;
  milestone: string;
  category: string;
  bandTarget: string;
  shortDesc: string;
  masterclass: Record<string, unknown>;
};

type QuizRow = {
  id: string;
  topicId: string;
  title: string;
  milestone: string;
  mcItems: Record<string, unknown>[];
  fillBlankItems: Record<string, unknown>[];
};

type GrowthRow = {
  id: number;
  name: string;
  dayTag: string;
  icon: string;
  kicker: string;
  focus: string;
  desc: string;
};

@Controller('v1')
export class ContentCatalogController {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  @Get('roadmap')
  async getRoadmap(): Promise<{ data: RoadmapWorldDto[] }> {
    const result = await this.pool.query<WorldRow>(`
      SELECT world_id, level, title, band, badge, duration, theme_color, summary, outcome, gates
      FROM roadmap_worlds
      ORDER BY world_id ASC
    `);

    const data: RoadmapWorldDto[] = result.rows.map((row) => ({
      worldId: row.world_id,
      level: row.level,
      title: row.title,
      band: row.band,
      badge: row.badge,
      duration: row.duration,
      themeColor: row.theme_color,
      summary: row.summary,
      outcome: row.outcome,
      gates: row.gates,
    }));

    return { data };
  }

  @Get('ipa/phonemes')
  async getIpaPhonemes(): Promise<{ data: IpaPhonemeDto[] }> {
    const result = await this.pool.query<PhonemeRow>(`
      SELECT symbol, label, category, sub_category AS "subCategory", tag,
             mouth_desc AS "mouthDesc", tongue_desc AS "tongueDesc", voice_desc AS "voiceDesc",
             front_caption AS "frontCaption", side_caption AS "sideCaption",
             sample_word AS "sampleWord", sample_ipa AS "sampleIpa", sample_meaning AS "sampleMeaning",
             vietnamese_tip AS "vietnameseTip", is_voiced AS "isVoiced", is_long AS "isLong"
      FROM ipa_phonemes
      ORDER BY position ASC
    `);

    return { data: result.rows };
  }

  @Get('grammar/topics')
  async getGrammarTopics(): Promise<{ data: GrammarTopicDto[] }> {
    const result = await this.pool.query<TopicRow>(`
      SELECT id, milestone, category, band_target AS "bandTarget", short_desc AS "shortDesc", masterclass
      FROM grammar_topics
      ORDER BY position ASC
    `);

    return { data: result.rows };
  }

  @Get('grammar/quizzes')
  async getGrammarQuizzes(@Query('topicId') topicId?: string): Promise<{ data: GrammarQuizDto[] }> {
    let query = `
      SELECT id, topic_id AS "topicId", title, milestone,
             mc_items AS "mcItems", fill_blank_items AS "fillBlankItems"
      FROM grammar_quizzes
    `;
    const params: unknown[] = [];
    if (topicId) {
      query += ' WHERE topic_id = $1';
      params.push(topicId);
    }
    query += ' ORDER BY position ASC';

    const result = await this.pool.query<QuizRow>(query, params);
    return { data: result.rows };
  }

  @Get('growth-stages')
  async getGrowthStages(): Promise<{ data: GrowthStageDto[] }> {
    const result = await this.pool.query<GrowthRow>(`
      SELECT id, name, day_tag AS "dayTag", icon, kicker, focus, description AS "desc"
      FROM growth_stages
      ORDER BY position ASC
    `);

    return { data: result.rows };
  }
}
