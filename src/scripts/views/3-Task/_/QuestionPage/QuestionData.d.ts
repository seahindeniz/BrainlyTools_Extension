export type QuestionDataType = {
  id: number;
  content: string;
  subject_id: number;
  grade_id: number;
  user_id: number;
  created: string;
  created_timestamp: number;
  responses: AnswerDataType[];
  can_comment: boolean;
  attachments: any[];
  is_deleted: boolean;
  comments: Comments;
  canMarkAbuse: boolean;
  isMarkedAbuse: boolean;
  canFollow: boolean;
  canUnfollow: boolean;
  isFollowing: boolean;
  pointsForResponse: number;
  pointsForBest: number;
  approvedAnswersCount: number;
  isAnswerButton: boolean;
  canEdit: boolean;
  tickets: any[];
};

type AnswerDataType = {
  id: number;
  userId: number;
  taskId: number;
  points: number;
  created: string;
  content: string;
  mark: number;
  marksCount: number;
  thanks: number;
  userBestRankId?: number;
  source: string;
  clientType: string;
  best: boolean;
  settings: Settings;
  attachments: any[];
  approved: Approved;
  comments: Comments;
};

type Settings = {
  canMarkAsBest: boolean;
  canEdit: boolean;
  isToCorrect: boolean;
  canMarkAbuse: boolean;
  isMarkedAbuse: boolean;
  canModerate: boolean;
  isDeleted: boolean;
  canComment: boolean;
  isConfirmed: boolean;
  isExcellent: boolean;
};

type Approved = {
  date: any;
  approver: any;
};

type Comments = {
  items: Item[];
  lastId: number;
  count: number;
};

type Item = {
  id: number;
  userId: number;
  content: string;
  created: string;
  deleted: boolean;
  canMarkAbuse: boolean;
  isMarkedAbuse: boolean;
};
