/* eslint-disable camelcase */
import Brainly, { CommonGenericResponseType } from "./Brainly";

interface PanelEntryType {
  count: number;
  status: number;
}

interface PanelType {
  messages: PanelEntryType;
  notifications: PanelEntryType;
  invitations: PanelEntryType;
}

interface RanksType {
  color: string;
  names: string[];
  count: number;
}

interface AvatarsType {
  64?: string;
  100?: string;
}

interface UserType {
  id: number;
  nick: string;
  gender: number;
  points: number;
  ranks: RanksType;
  ranks_ids: number[];
  language: string;
  iso_locale: string;
  grade_id: number;
  username: string;
  registration_datetime: Date;
  is_deleted: boolean;
  primary_rank_id: number;
  avatar_id: number;
  category: number;
  client_type: number;
  mod_actions_count: number;
  avatars: AvatarsType;
  avatar?: AvatarsType;
  entry: number;
}

interface StreamType {
  subject_ids: number[];
  grade_ids: number[];
}

interface PreferencesType {
  stream: StreamType;
}

interface CometType {
  hash: string;
  auth_hash: string;
  avatar_url?: string;
}

interface AuthType {
  comet: CometType;
}

interface BanType {
  active: boolean;
  expires?: string;
}

interface BrainlyPlusType {
  subscription?: any;
  trialAllowed: boolean;
}

interface MeDataType {
  panel: PanelType;
  user: UserType;
  preferences: PreferencesType;
  auth: AuthType;
  privileges: number[];
  ban: BanType;
  tasks: number;
  responses: number;
  comments: number;
  conversations_not_read: number[];
  user_category: number;
  current_best_answers: number;
  subscription?: any;
  brainlyPlus: BrainlyPlusType;
}

export default async (): Promise<
  CommonGenericResponseType<{ data: MeDataType }>
> => new Brainly().Legacy().api_users().me().GET();
