/**
 * Application-wide constants
 * Centralizes all magic strings, URLs, and configuration values
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  ENDPOINTS: {
    USERS: '/users',
    AUTH: '/auth',
    COURSES: '/courses',
    ENROLLMENTS: '/enrollments',
    PROGRESS: '/progress'
  }
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  USER: 'lh_user',
  THEME: 'lh_theme',
  PREFERENCES: 'lh_preferences'
} as const;

// Default Values
export const DEFAULT_VALUES = {
  AVATAR_BASE_URL: 'https://i.pravatar.cc/150?u=',
  DEFAULT_ROLE: 'Learner',
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100
  }
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid credentials provided',
    EMAIL_ALREADY_EXISTS: 'Email already registered',
    USERNAME_ALREADY_EXISTS: 'Username already taken',
    REGISTRATION_FAILED: 'Registration failed. Please try again.',
    LOGIN_FAILED: 'Login failed. Please check your credentials.',
    UNAUTHORIZED: 'You are not authorized to access this resource',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.'
  },
  NETWORK: {
    CONNECTION_ERROR: 'Network connection error. Please check your internet connection.',
    SERVER_ERROR: 'Server error occurred. Please try again later.',
    TIMEOUT: 'Request timeout. Please try again.'
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PASSWORD: 'Password must be at least 8 characters long',
    PASSWORDS_DONT_MATCH: 'Passwords do not match'
  }
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  AUTH: {
    REGISTRATION_SUCCESS: 'Registration successful! Welcome aboard!',
    LOGIN_SUCCESS: 'Login successful! Welcome back!',
    LOGOUT_SUCCESS: 'You have been logged out successfully'
  },
  COURSE: {
    ENROLLMENT_SUCCESS: 'Successfully enrolled in the course!',
    PROGRESS_SAVED: 'Your progress has been saved'
  }
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
} as const;

// Regular Expressions
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/
} as const;

// Time Constants (in milliseconds)
export const TIME_CONSTANTS = {
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  TOKEN_REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes
  DEBOUNCE_TIME: 300, // 300ms
  TOAST_DURATION: 3000, // 3 seconds
  SNACKBAR_DURATION: 4000 // 4 seconds
} as const;

// UI Constants
export const UI_CONSTANTS = {
  ROUTES: {
    HOME: '/dashboard',
    LOGIN: '/auth/login',
    COURSES: '/courses',
    LEARN: '/learn'
  },
  ROUTE_PARAMS: {
    LECTURE: 'lecture'
  },
  SELECTORS: {
    MAT_EXPANSION_PANEL: 'mat-expansion-panel'
  },
  SCROLL: {
    TOP_POSITION: 0
  },
  SNACKBAR: {
    ACTION_CLOSE: 'Close',
    CLASSES: {
      SUCCESS: ['success-snackbar'] as string[],
      ERROR: ['error-snackbar'] as string[]
    }
  },
  COURSE_CONTENT: {
    SECTIONS_SEPARATOR: ' • ',
    LECTURES_SEPARATOR: ' • ',
    DURATION_SEPARATOR: 'h ',
    MINUTES_SUFFIX: 'm',
    TOTAL_LENGTH_SUFFIX: ' total length'
  },
  NUMERIC_BASE: 10
} as const;

// Course Details Constants
export const COURSE_DETAILS_CONSTANTS = {
  MESSAGES: {
    LOGIN_REQUIRED: 'Please log in to enroll in courses',
    COURSE_NOT_AVAILABLE: 'Course information not available',
    ALREADY_ENROLLED: 'You are already enrolled in this course',
    ENROLLMENT_FAILED: 'Failed to enroll in course. Please try again.',
    NO_LECTURES_AVAILABLE: 'No lectures available in this course'
  },
  LABELS: {
    SECTIONS: 'Sections',
    LECTURES: 'Lectures'
  }
} as const;

// Course Discovery Constants
export const COURSE_DISCOVERY_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 8,
    DEFAULT_PAGE: 1
  },
  SORT_OPTIONS: {
    LATEST: 'latest',
    RATING: 'rating',
    REVIEWS: 'reviews',
    A_TO_Z: 'az',
    Z_TO_A: 'za'
  },
  QUERY_PARAMS: {
    SEARCH_QUERY: 'q'
  },
  DURATION_FILTERS: {
    LESS_THAN_1_WEEK: '<1w',
    ONE_TO_FOUR_WEEKS: '1-4w',
    ONE_TO_THREE_MONTHS: '1-3m',
    THREE_TO_SIX_MONTHS: '3-6m',
    SIX_TO_TWELVE_MONTHS: '6-12m'
  },
  DURATION_KEYWORDS: {
    WEEK: 'week',
    MONTH: 'month'
  },
  DURATION_CALCULATIONS: {
    WEEKS_PER_MONTH: 4,
    QUARTER_MONTH: 0.25,
    ONE_MONTH: 1,
    THREE_MONTHS: 3,
    SIX_MONTHS: 6,
    TWELVE_MONTHS: 12
  },
  LABELS: {
    RESULTS_SUFFIX: ' Results',
    PAGINATION_SEPARATOR: ' of ',
    PAGE_PREFIX: 'Page '
  },
  BUTTON_LABELS: {
    PREVIOUS: 'Prev',
    NEXT: 'Next'
  }
} as const;

// Course Service Constants
export const COURSE_SERVICE_CONSTANTS = {
  STATUS: {
    PUBLISHED: 'Published',
    DRAFT: 'Draft',
    ARCHIVED: 'Archived'
  },
  DIFFICULTY_LEVELS: {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced'
  },
  DEFAULT_LIMITS: {
    RELATED_COURSES: 5,
    NEWLY_LAUNCHED: 12
  },
  DURATION_BUCKETS: {
    LESS_THAN_1_WEEK: 'lt1w',
    ONE_TO_FOUR_WEEKS: '1to4w',
    ONE_TO_THREE_MONTHS: '1to3m',
    THREE_TO_SIX_MONTHS: '3to6m',
    SIX_TO_TWELVE_MONTHS: '6to12m',
    GREATER_THAN_12_MONTHS: 'gt12m'
  },
  PUBLISHED_BUCKETS: {
    THIS_WEEK: 'thisWeek',
    THIS_MONTH: 'thisMonth',
    LAST_SIX_MONTHS: 'last6m',
    THIS_YEAR: 'thisYear',
    OLDER: 'older'
  },
  DURATION_KEYWORDS: {
    WEEK: 'week',
    MONTH: 'month',
    DAY: 'day'
  },
  TIME_CALCULATIONS: {
    DAYS_PER_WEEK: 7,
    DAYS_PER_MONTH: 30,
    DAYS_PER_QUARTER: 90,
    DAYS_PER_HALF_YEAR: 180,
    DAYS_PER_YEAR: 365,
    MILLISECONDS_PER_DAY: 86400000,
    WEEKS_IN_MONTH: 4,
    DAYS_IN_WEEK: 7,
    DAYS_IN_MONTH: 30,
    DAYS_IN_SIX_MONTHS: 180
  },
  QUERY_PARAMS: {
    COURSE_ID: 'courseId',
    ID: 'id'
  }
} as const;

// Curriculum Panel Constants
export const CURRICULUM_PANEL_CONSTANTS = {
  UI: {
    TITLE: 'Course Content',
    SECTION_PREFIX: 'Section',
    MINUTES_SUFFIX: 'min'
  },
  CSS_CLASSES: {
    PANEL: 'panel',
    CARD: 'card',
    TITLE: 'title',
    SECTION: 'sec',
    SECTION_TITLE: 'sec-title',
    LECTURE: 'lec',
    LECTURE_ACTIVE: 'active',
    LECTURE_COMPLETED: 'done',
    CHECKBOX: 'cbox',
    LECTURE_TITLE: 't',
    TIME: 'time'
  },
  ICONS: {
    NOT_STARTED: '○',
    IN_PROGRESS: '◐',
    COMPLETED: '✓'
  },
  COLORS: {
    SURFACE_BG: 'var(--surface)',
    BORDER_COLOR: '#1b2a38',
    MUTED_TEXT: 'var(--muted)',
    HOVER_BG: '#1b2531',
    ACTIVE_BG: '#18c07433',
    ACTIVE_BORDER: '#18c07466'
  },
  SPACING: {
    BORDER_RADIUS: '16px',
    LECTURE_BORDER_RADIUS: '8px',
    SECTION_MARGIN: '10px',
    TITLE_MARGIN: '8px',
    SECTION_TITLE_MARGIN: '6px 0',
    LECTURE_PADDING: '10px 8px',
    LECTURE_GAP: '8px'
  }
} as const;

// Video Player Constants
export const VIDEO_PLAYER_CONSTANTS = {
  API: {
    YOUTUBE_IFRAME_API_URL: 'https://www.youtube.com/iframe_api',
    GLOBAL_CALLBACK_NAME: 'onYouTubeIframeAPIReady'
  },
  DEFAULT_CONFIG: {
    PLAYER_VARS: {
      MODEST_BRANDING: 1,
      REL: 0,
      CONTROLS: 0,
      AUTOPLAY: 0,
      CC_LOAD_POLICY: 0
    },
    ASPECT_RATIO: 16 / 9,
    UPDATE_INTERVAL: 500, // milliseconds
    SEEK_STEP: 10, // seconds
    VOLUME_STEP: 10 // percentage
  },
  PLAYBACK_SPEEDS: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const,
  UI: {
    PLAY_TEXT: 'Play',
    PAUSE_TEXT: 'Pause',
    MUTE_TEXT: 'Mute',
    UNMUTE_TEXT: 'Unmute',
    FULLSCREEN_TEXT: 'Fullscreen',
    EXIT_FULLSCREEN_TEXT: 'Exit Fullscreen',
    SPEED_SUFFIX: 'x',
    TIME_SEPARATOR: ' / ',
    LOADING_TEXT: 'Loading...',
    ERROR_TEXT: 'Error loading video'
  },
  CSS_CLASSES: {
    CONTAINER: 'video-player',
    CARD: 'card',
    FRAME: 'video-frame',
    HOST: 'video-host',
    CONTROLS: 'video-controls',
    CONTROL_BUTTON: 'control-btn',
    PLAY_BUTTON: 'play-btn',
    PROGRESS_BAR: 'progress-bar',
    TIME_DISPLAY: 'time-display',
    SPEED_SELECT: 'speed-select',
    VOLUME_CONTROL: 'volume-control',
    FULLSCREEN_BUTTON: 'fullscreen-btn',
    LOADING: 'loading',
    ERROR: 'error'
  },
  COLORS: {
    SURFACE_BG: 'var(--surface)',
    CONTROLS_BG: '#121a24',
    BORDER_COLOR: '#1b2a38',
    BUTTON_BG: '#1b2531',
    BUTTON_BORDER: '#2a3b4e',
    BUTTON_TEXT: '#e6eef7',
    TIME_TEXT: '#a9bed4',
    ACCENT_COLOR: 'var(--brand)',
    VIDEO_BG: '#000000'
  },
  SPACING: {
    BORDER_RADIUS: '16px',
    BUTTON_BORDER_RADIUS: '8px',
    BUTTON_PADDING: '6px 10px',
    CONTROLS_PADDING: '12px 16px',
    CONTROL_GAP: '8px'
  },
  BREAKPOINTS: {
    MOBILE: '768px',
    TABLET: '1024px',
    DESKTOP: '1200px'
  }
} as const;
