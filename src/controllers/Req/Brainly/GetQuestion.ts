/* eslint-disable camelcase */
import Brainly, { CommonGenericResponseType } from "./Brainly";

interface Points {
  ptsForTask: number;
  ptsForResp: number;
  ptsForBest: number;
}

interface Settings {
  is_closed: boolean;
  can_edit: boolean;
  can_mark_abuse: boolean;
  can_moderate: boolean;
  is_marked_abuse: boolean;
  is_answer_button: boolean;
  is_confirmed: boolean;
  can_comment: boolean;
  can_follow: boolean;
  can_unfollow: boolean;
  is_following: boolean;
  is_deleted: boolean;
}

interface Attachment {
  full: string;
  thumbnail: string;
  type: string;
  size: number;
  hash: string;
  id: number;
  extension: string;
}

interface Item {
  id: number;
  user_id: number;
  content: string;
  created: string;
  deleted: boolean;
  can_mark_abuse: boolean;
  is_marked_abuse: boolean;
}

interface Comments {
  items: Item[];
  last_id: number;
  count: number;
}

export interface QuestionMainViewQuestionDataType {
  id: number;
  subject_id: number;
  user_id: number;
  grade_id: number;
  points: Points;
  content: string;
  created: string;
  responses: number;
  tickets: number;
  first_resp: string;
  the_best_resp_id: any;
  source: string;
  client_type: string;
  user_category: number;
  settings: Settings;
  attachments: Attachment[];
  comments: Comments;
}

interface SettingsForAnswerer {
  can_mark_as_best: boolean;
  can_edit: boolean;
  is_to_correct: boolean;
  can_mark_abuse: boolean;
  is_marked_abuse: boolean;
  can_moderate: boolean;
  is_deleted: boolean;
  can_comment: boolean;
  is_confirmed: boolean;
  is_excellent: boolean;
}

interface Avatar {
  "64": string;
  "100": string;
}

interface Approver {
  id: number;
  nickname: string;
  points: number;
  grade: number;
  gender: number;
  avatars: Avatar;
  content_approved_count: number;
}

interface Approved {
  date?: string;
  approver?: Approver;
}

export interface QuestionMainViewAnswerDataType {
  id: number;
  user_id: number;
  task_id: number;
  points: number;
  created: string;
  content: string;
  mark: number;
  marks_count: number;
  thanks: number;
  user_best_rank_id: number;
  source: string;
  client_type: string;
  best: boolean;
  settings: SettingsForAnswerer;
  attachments: Attachment[];
  approved: Approved;
  comments: Comments;
}

interface Solved {
  id: number;
  nick: string;
  avatar: string;
}

interface Presence {
  observing: any[];
  answering: any[];
  solved: Solved[];
  tickets: any[];
}

export interface QuestionMainViewDataType {
  task: QuestionMainViewQuestionDataType;
  responses: QuestionMainViewAnswerDataType[];
  presence: Presence;
}

interface Stats {
  questions: number;
  answers: number;
  comments: number;
}

interface Ranks {
  color: string;
  names: string[];
  count: number;
}

export interface QuestionMainViewUserDataType {
  id: number;
  nick: string;
  gender: number;
  is_deleted: boolean;
  stats: Stats;
  avatars: Avatar;
  avatar: Avatar;
  ranks: Ranks;
  ranks_ids: number[];
}

export default function GetQuestion(
  id: number,
): Promise<
  CommonGenericResponseType<{
    data: QuestionMainViewDataType;
    users_data: QuestionMainViewUserDataType[];
  }>
> {
  return new Brainly().Legacy().api_tasks().main_view().P(String(id)).GET();
}
