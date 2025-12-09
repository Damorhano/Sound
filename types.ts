export enum Platform {
  SPOTIFY = 'Spotify',
  APPLE_MUSIC = 'Apple Music',
  TIKTOK = 'TikTok',
  YOUTUBE_MUSIC = 'YouTube Music',
  AMAZON_MUSIC = 'Amazon Music',
  TIDAL = 'Tidal',
  DEEZER = 'Deezer',
  INSTAGRAM = 'Instagram/Facebook'
}

export enum ReleaseStatus {
  DRAFT = 'Draft',
  PROCESSING = 'Processing',
  DISTRIBUTED = 'Distributed',
  TAKEDOWN = 'Takedown'
}

export interface TrackMetadata {
  title: string;
  artist: string;
  producer: string;
  genre: string;
  releaseDate: string;
  isrc?: string;
  upc?: string;
  description: string;
  explicit: boolean;
}

export interface Release {
  id: string;
  coverArtUrl: string;
  metadata: TrackMetadata;
  status: ReleaseStatus;
  platforms: Platform[];
  uploadDate: string;
  streams: number;
}
