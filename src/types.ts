export interface UserInfo {
  id: string
  url_token: string
  name: string
  use_default_avatar: boolean
  avatar_url: string
  avatar_url_template: string
  is_org: boolean
  type: string
  url: string
  user_type: string
  headline: string
  is_active: number
  description: string
  gender: number
  is_advertiser: boolean
  vip_info: VipInfo
  badge: any[]
  badge_v2: BadgeV2
  account_status: any[]
  message_thread_token: string
  allow_message: boolean
  is_following: boolean
  is_followed: boolean
  is_blocking: boolean
  is_blocked: boolean
  is_force_renamed: boolean
  follower_count: number
  following_count: number
  mutual_followees_count: number
  answer_count: number
  question_count: number
  commercial_question_count: number
  articles_count: number
  columns_count: number
  zvideo_count: number
  favorite_count: number
  favorited_count: number
  pins_count: number
  logs_count: number
  voteup_count: number
  thanked_count: number
  hosted_live_count: number
  participated_live_count: number
  included_answers_count: number
  included_articles_count: number
  included_text: string
  following_columns_count: number
  following_topic_count: number
  following_question_count: number
  following_favlists_count: number
  vote_to_count: number
  vote_from_count: number
  thank_to_count: number
  thank_from_count: number
  recognized_count: number
  business: Business
  locations: any[]
  employments: any[]
  educations: any[]
  cover_url: string
  avatar_hue: string
  juror: Juror
  is_privacy_protected: boolean
  is_realname: boolean
  has_applying_column: boolean
}

export interface Business {
  id: string
  type: string
  url: string
  name: string
  avatar_url: string
}

export interface Juror {
  is_juror: boolean
  vote_count: number
  review_count: number
  review_liked_count: number
}

export interface VipInfo {
  is_vip: boolean
  rename_days: string
  entrance_v2: null
  rename_frequency: number
  rename_await_days: number
}

//

export interface QuestionInfo {
  type: string
  id: number
  title: string
  question_type: string
  created: number
  updated_time: number
  url: string
  relationship: Relationship
}
//
export interface SearchData {
  paging: Paging
  data: Datum[]
  related_search_result: any[]
  search_action_info: SearchActionInfo
  is_brand_word: boolean
  pendant: null
  sensitive_level: number
}

export interface Datum {
  type: DatumType
  highlight?: Highlight | null
  object?: Object
  index?: number
  id?: number | string
  query_list?: QueryList[]
  attached_info_bytes?: string
}

export interface Highlight {
  description?: string
  title?: string
}

export interface Object {
  id?: string
  name?: string
  url?: string
  type?: string
  excerpt?: string
  introduction?: string
  description?: string
  avatar_url?: string
  is_following?: boolean
  questions_count?: number
  followers_count?: number
  follower_count?: number
  top_answer_count?: number
  score?: number
  aliases?: any[]
  has_meta?: boolean
  meta?: Meta
  topic_type?: string
  attached_info_bytes: string
  wiki_type?: string
  discussion_count?: number
  has_index_section?: boolean
  essence_feed_count?: number
  header?: Header
  body?: Body
  footer?: string
  commodity_id?: string
  commodity_type?: string
  label?: Label
  source?: string
  card_version?: string
  slave_url?: string
  tab_type?: string
  voteup_count?: number
  comment_count?: number
  created_time?: number
  updated_time?: number
  content?: string
  thumbnail_info?: ThumbnailInfo
  relationship?: Relationship
  question?: Question
  author?: ObjectAuthor
  flag?: Flag | null
  is_zhi_plus?: boolean
  extra?: string
  title?: string
  voting?: number
  card_type?: string
  visit_count?: number
  content_list?: ContentList[]
  ab_id_list?: string[]
  club_id?: string
  members?: Member[]
  member_count?: number
  club_post_count?: number
  pinned_club_posts?: EdClubPost[]
  featured_club_post?: EdClubPost
  is_joined?: boolean
  join_type?: string
  verify_question?: string
  allow_sync?: boolean
}

export interface ObjectAuthor {
  id: string
  url_token: string
  name: string
  headline: string
  // -1 未知, 0 女, 1 男
  gender: number
  is_followed: boolean
  is_following: boolean
  user_type: UserTypeEnum
  url: string
  type: UserTypeEnum
  avatar_url: string
  badge: PurpleBadge[]
  authority_info: null
  voteup_count: number
  follower_count: number
  badge_v2?: BadgeV2
  badge_v2_string?: string
  old_badges?: OldBadge[]
}

export interface PurpleBadge {
  type: BadgeType
  description: string
  topics: PurpleTopic[]
}

export interface PurpleTopic {
  id: string
  name: Name
  introduction: string
  excerpt: string
  type: SourceType
  url: string
  avatar_url: string
}

export enum Name {
  Empty = '',
  心理学 = '心理学',
}

export enum SourceType {
  Topic = 'topic',
  Year = 'year',
}

export enum BadgeType {
  BestAnswerer = 'best_answerer',
  Identity = 'identity',
}

export interface BadgeV2 {
  title: string
  merged_badges: Badge[]
  detail_badges: Badge[]
  icon: string
  night_icon: string
}

export interface Badge {
  type: DetailBadgeType
  detail_type: string
  title: string
  description: string
  url: string
  sources: Source[]
  icon: string
  night_icon: string
}

export interface Source {
  id: string
  token: string
  type: SourceType
  url: string
  name: Name
  avatar_path: AvatarPath
  avatar_url: string
  description: string
  priority: number
}

export enum AvatarPath {
  Empty = '',
  V2E264Eadededb5A689129F5684B0218A2 = 'v2-e264eadededb5a689129f5684b0218a2',
}

export enum DetailBadgeType {
  Best = 'best',
  Identity = 'identity',
  Reward = 'reward',
}

export interface OldBadge {
  type: BadgeType
  description: string
  topics?: Question[]
}

export interface Question {
  id: string
  type: QuestionType
  url: string
  name: string
  avatar_url?: string
}

export enum QuestionType {
  Question = 'question',
  Topic = 'topic',
}

export enum UserTypeEnum {
  Organization = 'organization',
  People = 'people',
}

export interface Body {
  title: string
  description: string
  authors: AuthorElement[]
  images: string[]
  can_try: boolean
  button: Button
  media_type: string
  content: string
}

export interface AuthorElement {
  name: string
  url_token: string
  bio: string
  icon: string
  badge?: FluffyBadge[]
}

export interface FluffyBadge {
  type: BadgeType
  description: string
  topics?: FluffyTopic[]
}

export interface FluffyTopic {
  type: SourceType
  id: string
  name: string
}

export interface Button {
  text: string
  url: string
}

export interface ContentList {
  id: string
  type: QuestionType
  title: string
  description: string
  avatar_url: string
  url: string
  follower_count: number
  answer_count: number
  comment_count: number
  voteup_count: number
  play_count: number
  attached_info_bytes: string
}

export interface EdClubPost {
  id: string
  attached_info_bytes: string
  title: string
  excerpt: string
  thumbnail_info: null
  mask_name: string
  avatar_url: string
  tag_id: string
  tag_name: string
  tag_type: string
  poll_info: null
  comment_num: number
  reaction_num: number
  created: number
}

export interface Flag {
  flag_type: string
  flag_text: string
}

export interface Header {
  card_title: string
  no_more: boolean
}

export interface Label {
  text: string
  color: string
  commodity_type: string
}

export interface Member {
  avatar_url: string
}

export interface Meta {
  id: number
  type: string
  category: string
  description: string
  image_url: string
  is_following: boolean
  follower_count: number
  question_count: number
  discussion_count: number
  description1: string
  description2: string
  subtitle: string
  title: string
  tags: any[]
  avatar_url: string
  template: Template
  wiki_description: any[]
  scores: any[]
}

export interface Template {
  meta_template_type: number
  avatar_type: number
}

export interface Relationship {
  voting?: number
  is_author: boolean
  is_thanked?: boolean
  is_nothelp?: boolean
  following_upvoter: any[]
  following_upvoter_count: number
  is_voted?: boolean
}

export interface ThumbnailInfo {
  count: number
  thumbnails: Thumbnail[]
  type: ThumbnailInfoType
  total_count: number
}

export interface Thumbnail {
  data_url: string
  url: string
  type: ThumbnailType
  width: number
  height: number
}

export enum ThumbnailType {
  Image = 'image',
}

export enum ThumbnailInfoType {
  Empty = '',
  ThumbnailInfo = 'thumbnail_info',
}

export interface QueryList {
  query: string
  attached_info_bytes: string
}

export enum DatumType {
  KnowledgeAd = 'knowledge_ad',
  RelevantQuery = 'relevant_query',
  SearchClub = 'search_club',
  SearchResult = 'search_result',
  WikiBox = 'wiki_box',
}

export interface Paging {
  is_end: boolean
  next: string
}

export interface SearchActionInfo {
  attached_info_bytes: string
  lc_idx: number
  search_hash_id: string
  isfeed: boolean
}
