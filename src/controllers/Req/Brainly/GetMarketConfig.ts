/* eslint-disable camelcase */
import Brainly, { CommonGenericResponseType } from "./Brainly";

export type RankDataType = {
  color?: string;
  description?: string;
  id?: number;
  name?: string;
  points?: number;
  promoted_text?: string;
  the_best_resps?: number;
  type?: number;
};

export type SubjectDataType = {
  id: number;
  name: string;
  enabled?: boolean;
};

export type GradeDataType = {
  filter_name: string;
  icon: string;
  id: number;
  name: string;
  slug: string;
};

export interface MarketConfigDataType {
  subjects: SubjectDataType[];
  grades: GradeDataType[];
  config: {
    attachmentCount: number;
    timezone: string;
    cometSslServerAddress: string;
    cometSslServerPort: number;
    serviceLatexUrlHttps: string;
  };
  ranks: RankDataType[];
}

export default async function GetMarketConfig(): Promise<
  CommonGenericResponseType<{
    data: MarketConfigDataType;
  }>
> {
  return new Brainly().Legacy().api_config().desktop_view().GET();
}
