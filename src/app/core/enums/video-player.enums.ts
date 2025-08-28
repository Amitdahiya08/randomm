/**
 * Video Player related enums and literal types
 * Provides type safety and eliminates magic strings/numbers
 */

/**
 * YouTube Player States
 * Maps to YouTube IFrame API player states
 */
export enum YouTubePlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5
}

/**
 * Standard video playback speeds
 */
export enum PlaybackSpeed {
  VERY_SLOW = 0.25,
  SLOW = 0.5,
  THREE_QUARTERS = 0.75,
  NORMAL = 1,
  FAST = 1.25,
  FASTER = 1.5,
  VERY_FAST = 1.75,
  DOUBLE = 2
}

/**
 * Video player control types
 */
export enum PlayerControlType {
  PLAY_PAUSE = 'play-pause',
  PROGRESS_BAR = 'progress-bar',
  TIME_DISPLAY = 'time-display',
  SPEED_CONTROL = 'speed-control',
  MUTE_BUTTON = 'mute-button',
  VOLUME_SLIDER = 'volume-slider',
  FULLSCREEN_BUTTON = 'fullscreen-button'
}

/**
 * Video player event types
 */
export enum PlayerEventType {
  READY = 'ready',
  PLAY = 'play',
  PAUSE = 'pause',
  ENDED = 'ended',
  TIME_UPDATE = 'timeupdate',
  SPEED_CHANGE = 'speedchange',
  VOLUME_CHANGE = 'volumechange',
  FULLSCREEN_CHANGE = 'fullscreenchange',
  ERROR = 'error',
  BUFFER_START = 'bufferstart',
  BUFFER_END = 'bufferend'
}

/**
 * Video quality levels
 */
export enum VideoQuality {
  SMALL = 'small',        // 240p
  MEDIUM = 'medium',      // 360p
  LARGE = 'large',        // 480p
  HD720 = 'hd720',        // 720p
  HD1080 = 'hd1080',      // 1080p
  HIGHRES = 'highres',    // 1440p+
  AUTO = 'auto'           // Auto quality
}

/**
 * Player error codes
 */
export enum PlayerErrorCode {
  INVALID_PARAMETER = 2,
  HTML5_ERROR = 5,
  VIDEO_NOT_FOUND = 100,
  VIDEO_NOT_AVAILABLE = 101,
  VIDEO_NOT_ALLOWED = 150
}

/**
 * Video player themes
 */
export enum PlayerTheme {
  DARK = 'dark',
  LIGHT = 'light',
  AUTO = 'auto'
}

/**
 * Video player size presets
 */
export enum PlayerSize {
  SMALL = 'small',        // 320x180
  MEDIUM = 'medium',      // 640x360
  LARGE = 'large',        // 854x480
  HD = 'hd',             // 1280x720
  FULL_HD = 'full-hd',   // 1920x1080
  RESPONSIVE = 'responsive' // Responsive sizing
}

/**
 * Control button states
 */
export enum ButtonState {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  LOADING = 'loading',
  HIDDEN = 'hidden'
}

/**
 * Video player CSS class names
 */
export enum PlayerCSSClass {
  CONTAINER = 'video-player',
  FRAME = 'video-frame',
  CONTROLS = 'video-controls',
  CONTROL_BUTTON = 'control-btn',
  PLAY_BUTTON = 'play-btn',
  PAUSE_BUTTON = 'pause-btn',
  MUTE_BUTTON = 'mute-btn',
  FULLSCREEN_BUTTON = 'fullscreen-btn',
  PROGRESS_BAR = 'progress-bar',
  TIME_DISPLAY = 'time-display',
  SPEED_SELECT = 'speed-select',
  VOLUME_SLIDER = 'volume-slider',
  LOADING = 'loading',
  ERROR = 'error',
  FULLSCREEN = 'fullscreen'
}

/**
 * Video player UI text constants
 */
export enum PlayerUIText {
  PLAY = 'Play',
  PAUSE = 'Pause',
  MUTE = 'Mute',
  UNMUTE = 'Unmute',
  FULLSCREEN = 'Fullscreen',
  EXIT_FULLSCREEN = 'Exit Fullscreen',
  SPEED = 'Speed',
  VOLUME = 'Volume',
  LOADING = 'Loading...',
  ERROR = 'Error loading video',
  TIME_SEPARATOR = ' / '
}

/**
 * Keyboard shortcuts for video player
 */
export enum PlayerKeyboardShortcut {
  PLAY_PAUSE = 'Space',
  MUTE = 'KeyM',
  FULLSCREEN = 'KeyF',
  VOLUME_UP = 'ArrowUp',
  VOLUME_DOWN = 'ArrowDown',
  SEEK_FORWARD = 'ArrowRight',
  SEEK_BACKWARD = 'ArrowLeft',
  SPEED_UP = 'Period',
  SPEED_DOWN = 'Comma'
}
