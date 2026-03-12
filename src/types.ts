export interface CreatorPrompts {
  topic: string;
  chatGPT: string[];
  midjourney: string[];
  videoContent: string[];
  blogPosts: string[];
  socialMedia: string[];
}

export type CategoryKey = keyof Omit<CreatorPrompts, 'topic'>;
