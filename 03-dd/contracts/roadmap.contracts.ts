import type React from 'react';

/**
 * 4 Mốc Lộ Trình CEFR x IELTS Chuẩn Lingora
 */
export type IeltsMilestoneId = 'M1_A1' | 'M2_A2' | 'M3_B1' | 'M4_B2';

export interface MilestoneSpecDto {
  id: IeltsMilestoneId;
  bandRange: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2';
  title: string;
  durationDays: number;
  minutesPerDay: number;
  targetDescription: string;
  phoneticsFocus: string[];
  grammarTopics: string[];
  vocabularyCount: number;
  testSpec: {
    name: string;
    durationMinutes: number;
    format: string[];
    passCondition: string;
  };
}

export interface RoadmapCardProps {
  milestone: MilestoneSpecDto;
  isActive: boolean;
  onSelect: (id: IeltsMilestoneId) => void;
}
