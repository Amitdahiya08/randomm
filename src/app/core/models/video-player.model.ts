/**
 * Video Player related models and interfaces
 * Provides strong typing for video player data structures and YouTube API integration
 */

/**
 * YouTube Player API configuration options
 */
export interface YouTubePlayerVars {
  /** Hide YouTube branding */
  modestbranding?: number;
  
  /** Disable related videos */
  rel?: number;
  
  /** Hide default YouTube controls */
  controls?: number;
  
  /** Auto-play video */
  autoplay?: number;
  
  /** Start time in seconds */
  start?: number;
  
  /** End time in seconds */
  end?: number;
  
  /** Enable closed captions */
  cc_load_policy?: number;
  
  /** Interface language */
  hl?: string;
}

/**
 * YouTube Player configuration
 */
export interface YouTubePlayerConfig {
  /** YouTube video ID */
  videoId: string;
  
  /** Player variables/options */
  playerVars?: YouTubePlayerVars;
  
  /** Player event handlers */
  events?: YouTubePlayerEvents;
  
  /** Player width */
  width?: number;
  
  /** Player height */
  height?: number;
}

/**
 * YouTube Player event handlers
 */
export interface YouTubePlayerEvents {
  /** Called when player is ready */
  onReady?: (event: any) => void;
  
  /** Called when player state changes */
  onStateChange?: (event: any) => void;
  
  /** Called when playback quality changes */
  onPlaybackQualityChange?: (event: any) => void;
  
  /** Called when playback rate changes */
  onPlaybackRateChange?: (event: any) => void;
  
  /** Called on player error */
  onError?: (event: any) => void;
  
  /** Called when API changes */
  onApiChange?: (event: any) => void;
}

/**
 * Video player state information
 */
export interface VideoPlayerState {
  /** Whether video is currently playing */
  isPlaying: boolean;
  
  /** Whether video is muted */
  isMuted: boolean;
  
  /** Current playback speed */
  playbackRate: number;
  
  /** Current time position in seconds */
  currentTime: number;
  
  /** Total video duration in seconds */
  duration: number;
  
  /** Current volume level (0-100) */
  volume: number;
  
  /** Whether player is in fullscreen mode */
  isFullscreen: boolean;
  
  /** Current video quality */
  quality?: string;
  
  /** Whether video is buffering */
  isBuffering: boolean;
  
  /** Whether video has ended */
  hasEnded: boolean;
}

/**
 * Video player control configuration
 */
export interface VideoPlayerControls {
  /** Show/hide play/pause button */
  showPlayPause: boolean;
  
  /** Show/hide progress bar */
  showProgressBar: boolean;
  
  /** Show/hide time display */
  showTimeDisplay: boolean;
  
  /** Show/hide speed control */
  showSpeedControl: boolean;
  
  /** Show/hide mute button */
  showMuteButton: boolean;
  
  /** Show/hide fullscreen button */
  showFullscreenButton: boolean;
  
  /** Show/hide volume slider */
  showVolumeSlider: boolean;
  
  /** Available playback speeds */
  availableSpeeds: number[];
}

/**
 * Video player component input properties
 */
export interface VideoPlayerData {
  /** YouTube video ID to play */
  videoId: string;
  
  /** Player control configuration */
  controls?: Partial<VideoPlayerControls>;
  
  /** Auto-play video on load */
  autoplay?: boolean;
  
  /** Start time in seconds */
  startTime?: number;
  
  /** End time in seconds */
  endTime?: number;
  
  /** Initial volume (0-100) */
  initialVolume?: number;
  
  /** Initial playback speed */
  initialSpeed?: number;
}

/**
 * Video player event data
 */
export interface VideoPlayerEvent {
  /** Event type */
  type: 'play' | 'pause' | 'ended' | 'timeupdate' | 'error' | 'ready';
  
  /** Current player state */
  state: VideoPlayerState;
  
  /** Additional event data */
  data?: any;
  
  /** Timestamp when event occurred */
  timestamp: Date;
}

/**
 * Video time formatting options
 */
export interface TimeFormatOptions {
  /** Show hours if duration > 1 hour */
  showHours?: boolean;
  
  /** Always show leading zeros */
  padZeros?: boolean;
  
  /** Separator between time units */
  separator?: string;
}
