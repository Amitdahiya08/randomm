import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnDestroy,
    AfterViewInit,
    ElementRef,
    ViewChild,
    OnInit,
    ChangeDetectorRef,
    inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    VideoPlayerState,
    YouTubePlayerConfig,
    VideoPlayerEvent,
    TimeFormatOptions
} from '../../core/models/video-player.model';
import {
    YouTubePlayerState,
    PlaybackSpeed,
    PlayerEventType,
    PlayerUIText
} from '../../core/enums/video-player.enums';
import { VIDEO_PLAYER_CONSTANTS } from '../../core/constants/app.constants';

// YouTube IFrame API type declarations
declare global {
    interface Window {
        onYouTubeIframeAPIReady: any;
        YT: any;
    }
}

/**
 * Video Player Component
 * A comprehensive YouTube video player with custom controls
 * Supports responsive design, accessibility, and proper video fitting
 */
@Component({
    selector: 'app-video-player',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './video-player.component.html',
    styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements AfterViewInit, OnDestroy {
    /** YouTube video ID to play */
    @Input({ required: true }) videoId!: string;

    /** Auto-play video on load */
    @Input() autoplay: boolean = false;

    /** Initial volume (0-100) */
    @Input() initialVolume: number = 100;

    /** Event emitted when video ends */
    @Output() videoEnded = new EventEmitter<VideoPlayerEvent>();

    /** Event emitted when video starts playing */
    @Output() videoStarted = new EventEmitter<VideoPlayerEvent>();

    /** Event emitted when video is paused */
    @Output() videoPaused = new EventEmitter<VideoPlayerEvent>();

    /** Event emitted when player is ready */
    @Output() playerReady = new EventEmitter<VideoPlayerEvent>();

    /** Event emitted on player error */
    @Output() playerError = new EventEmitter<VideoPlayerEvent>();

    /** Reference to video host element */
    @ViewChild('videoHost', { static: true }) videoHostRef!: ElementRef<HTMLDivElement>;

    /** Change detector reference */
    private cdr = inject(ChangeDetectorRef);

    /** YouTube player instance */
    private youTubePlayer: any;

    /** Update timer for progress tracking */
    private updateTimer?: any;

    /** Unique ID for the host element */
    readonly hostElementId = `yt-player-${Math.random().toString(36).substr(2, 9)}`;

    /** Video aspect ratio */
    readonly aspectRatio = VIDEO_PLAYER_CONSTANTS.DEFAULT_CONFIG.ASPECT_RATIO;

    /** Available playback speeds */
    readonly availableSpeeds = VIDEO_PLAYER_CONSTANTS.PLAYBACK_SPEEDS;

    /** UI constants for template */
    readonly uiConstants = VIDEO_PLAYER_CONSTANTS.UI;

    /** Current player state */
    playerState: VideoPlayerState = {
        isPlaying: false,
        isMuted: false,
        playbackRate: PlaybackSpeed.NORMAL,
        currentTime: 0,
        duration: 0,
        volume: 100,
        isFullscreen: false,
        isBuffering: false,
        hasEnded: false
    };

    /** Loading state */
    isLoading = true;

    /** Error state */
    hasError = false;

    /** Player ready state */
    isPlayerReady = false;

    /**
     * Component initialization after view init
     */
    ngAfterViewInit(): void {
        this.initializePlayer();
    }

    /**
     * Component cleanup
     */
    ngOnDestroy(): void {
        this.cleanup();
    }

    /**
     * Initialize the YouTube player
     */
    private async initializePlayer(): Promise<void> {
        try {
            this.isLoading = true;
            this.hasError = false;

            await this.loadYouTubeAPI();
            await this.createPlayer();

        } catch (error) {
            console.error('Failed to initialize video player:', error);
            this.handleError(error);
        }
    }

    /**
     * Load YouTube IFrame API
     */
    private loadYouTubeAPI(): Promise<void> {
        return new Promise((resolve, reject) => {
            // Check if API is already loaded
            if (window.YT?.Player) {
                resolve();
                return;
            }

            // Set up global callback
            window.onYouTubeIframeAPIReady = () => {
                resolve();
            };

            // Load the API script
            const script = document.createElement('script');
            script.src = VIDEO_PLAYER_CONSTANTS.API.YOUTUBE_IFRAME_API_URL;
            script.onerror = () => reject(new Error('Failed to load YouTube API'));
            document.body.appendChild(script);
        });
    }

    /**
     * Create YouTube player instance
     */
    private createPlayer(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const config: YouTubePlayerConfig = {
                    videoId: this.videoId,
                    playerVars: {
                        ...VIDEO_PLAYER_CONSTANTS.DEFAULT_CONFIG.PLAYER_VARS,
                        autoplay: this.autoplay ? 1 : 0
                    },
                    events: {
                        onReady: (event) => this.onPlayerReady(event, resolve),
                        onStateChange: (event) => this.onPlayerStateChange(event),
                        onError: (event) => this.onPlayerError(event, reject)
                    }
                };

                this.youTubePlayer = new window.YT.Player(
                    this.videoHostRef.nativeElement,
                    config
                );

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Handle player ready event
     */
    private onPlayerReady(event: any, resolve: () => void): void {
        try {
            this.isPlayerReady = true;
            this.isLoading = false;
            this.hasError = false;

            // Initialize player state
            this.playerState.duration = Math.floor(this.youTubePlayer.getDuration() || 0);
            this.playerState.volume = this.initialVolume;

            // Set initial volume
            this.youTubePlayer.setVolume(this.initialVolume);

            // Start progress tracking
            this.startProgressTracking();

            // Emit ready event
            this.emitPlayerEvent(PlayerEventType.READY);

            this.cdr.detectChanges();
            resolve();

        } catch (error) {
            console.error('Error in onPlayerReady:', error);
            this.handleError(error);
        }
    }

    /**
     * Handle player state change events
     */
    private onPlayerStateChange(event: any): void {
        try {
            const state = event.data;

            switch (state) {
                case YouTubePlayerState.PLAYING:
                    this.playerState.isPlaying = true;
                    this.playerState.hasEnded = false;
                    this.emitPlayerEvent(PlayerEventType.PLAY);
                    break;

                case YouTubePlayerState.PAUSED:
                    this.playerState.isPlaying = false;
                    this.emitPlayerEvent(PlayerEventType.PAUSE);
                    break;

                case YouTubePlayerState.ENDED:
                    this.playerState.isPlaying = false;
                    this.playerState.hasEnded = true;
                    this.emitPlayerEvent(PlayerEventType.ENDED);
                    break;

                case YouTubePlayerState.BUFFERING:
                    this.playerState.isBuffering = true;
                    break;

                default:
                    this.playerState.isBuffering = false;
                    break;
            }

            this.cdr.detectChanges();

        } catch (error) {
            console.error('Error in onPlayerStateChange:', error);
        }
    }

    /**
     * Handle player error events
     */
    private onPlayerError(event: any, reject?: (error: any) => void): void {
        const error = new Error(`YouTube Player Error: ${event.data}`);
        console.error('YouTube Player Error:', event.data);

        this.handleError(error);

        if (reject) {
            reject(error);
        }
    }

    /**
     * Handle errors
     */
    private handleError(error: any): void {
        this.hasError = true;
        this.isLoading = false;
        this.isPlayerReady = false;

        this.emitPlayerEvent(PlayerEventType.ERROR, { error });
        this.cdr.detectChanges();
    }

    /**
     * Start progress tracking timer
     */
    private startProgressTracking(): void {
        this.stopProgressTracking();

        this.updateTimer = setInterval(() => {
            if (!this.youTubePlayer || !this.isPlayerReady) return;

            try {
                this.playerState.currentTime = Math.floor(this.youTubePlayer.getCurrentTime() || 0);
                this.playerState.duration = Math.floor(this.youTubePlayer.getDuration() || 0);
                this.cdr.detectChanges();
            } catch (error) {
                console.error('Error updating progress:', error);
            }
        }, VIDEO_PLAYER_CONSTANTS.DEFAULT_CONFIG.UPDATE_INTERVAL);
    }

    /**
     * Stop progress tracking timer
     */
    private stopProgressTracking(): void {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
            this.updateTimer = undefined;
        }
    }

    /**
     * Cleanup resources
     */
    private cleanup(): void {
        this.stopProgressTracking();

        if (this.youTubePlayer?.destroy) {
            try {
                this.youTubePlayer.destroy();
            } catch (error) {
                console.error('Error destroying player:', error);
            }
        }
    }

    /**
     * Emit player events
     */
    private emitPlayerEvent(type: PlayerEventType, data?: any): void {
        const event: VideoPlayerEvent = {
            type: type as any,
            state: { ...this.playerState },
            data,
            timestamp: new Date()
        };

        switch (type) {
            case PlayerEventType.READY:
                this.playerReady.emit(event);
                break;
            case PlayerEventType.PLAY:
                this.videoStarted.emit(event);
                break;
            case PlayerEventType.PAUSE:
                this.videoPaused.emit(event);
                break;
            case PlayerEventType.ENDED:
                this.videoEnded.emit(event);
                break;
            case PlayerEventType.ERROR:
                this.playerError.emit(event);
                break;
        }
    }

    // Public methods for template usage

    /**
     * Toggle play/pause state
     */
    togglePlayPause(): void {
        if (!this.isPlayerReady || !this.youTubePlayer) return;

        try {
            if (this.playerState.isPlaying) {
                this.youTubePlayer.pauseVideo();
            } else {
                this.youTubePlayer.playVideo();
            }
        } catch (error) {
            console.error('Error toggling play/pause:', error);
        }
    }

    /**
     * Toggle mute state
     */
    toggleMute(): void {
        if (!this.isPlayerReady || !this.youTubePlayer) return;

        try {
            if (this.playerState.isMuted) {
                this.youTubePlayer.unMute();
                this.playerState.isMuted = false;
            } else {
                this.youTubePlayer.mute();
                this.playerState.isMuted = true;
            }
            this.cdr.detectChanges();
        } catch (error) {
            console.error('Error toggling mute:', error);
        }
    }

    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen(): void {
        if (!this.videoHostRef?.nativeElement) return;

        try {
            const element = this.videoHostRef.nativeElement.parentElement;

            if (!document.fullscreenElement) {
                element?.requestFullscreen?.();
                this.playerState.isFullscreen = true;
            } else {
                document.exitFullscreen?.();
                this.playerState.isFullscreen = false;
            }
            this.cdr.detectChanges();
        } catch (error) {
            console.error('Error toggling fullscreen:', error);
        }
    }

    /**
     * Change playback speed
     */
    changePlaybackSpeed(event: Event): void {
        if (!this.isPlayerReady || !this.youTubePlayer) return;

        const target = event.target as HTMLSelectElement;
        const speed = parseFloat(target.value);

        try {
            this.youTubePlayer.setPlaybackRate(speed);
            this.playerState.playbackRate = speed;
            this.cdr.detectChanges();
        } catch (error) {
            console.error('Error changing playback speed:', error);
        }
    }

    /**
     * Handle progress bar input change
     */
    onProgressChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        const time = parseFloat(target.value);
        this.playerState.currentTime = time;
    }

    /**
     * Seek to specific time
     */
    seekToTime(event: Event): void {
        if (!this.isPlayerReady || !this.youTubePlayer) return;

        const target = event.target as HTMLInputElement;
        const time = parseFloat(target.value);

        try {
            this.youTubePlayer.seekTo(time, true);
            this.playerState.currentTime = time;
            this.cdr.detectChanges();
        } catch (error) {
            console.error('Error seeking to time:', error);
        }
    }

    /**
     * Retry loading the video
     */
    retryLoad(): void {
        this.hasError = false;
        this.initializePlayer();
    }

    /**
     * Get progress percentage
     */
    getProgressPercentage(): number {
        if (this.playerState.duration === 0) return 0;
        return (this.playerState.currentTime / this.playerState.duration) * 100;
    }

    /**
     * Format time in MM:SS or HH:MM:SS format
     */
    formatTime(seconds: number, options?: TimeFormatOptions): string {
        if (!seconds || isNaN(seconds)) return '0:00';

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        const showHours = options?.showHours || hours > 0;
        const separator = options?.separator || ':';

        if (showHours) {
            return `${hours}${separator}${minutes.toString().padStart(2, '0')}${separator}${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}${separator}${secs.toString().padStart(2, '0')}`;
        }
    }

    // Template helper methods

    /**
     * Get play/pause button text
     */
    getPlayPauseText(): string {
        return this.playerState.isPlaying ? this.uiConstants.PAUSE_TEXT : this.uiConstants.PLAY_TEXT;
    }

    /**
     * Get play/pause button icon
     */
    getPlayPauseIcon(): string {
        return this.playerState.isPlaying ? '⏸️' : '▶️';
    }

    /**
     * Get mute button text
     */
    getMuteText(): string {
        return this.playerState.isMuted ? this.uiConstants.UNMUTE_TEXT : this.uiConstants.MUTE_TEXT;
    }

    /**
     * Get mute button icon
     */
    getMuteIcon(): string {
        return this.playerState.isMuted ? '🔇' : '🔊';
    }

    /**
     * Get fullscreen button text
     */
    getFullscreenText(): string {
        return this.playerState.isFullscreen ? this.uiConstants.EXIT_FULLSCREEN_TEXT : this.uiConstants.FULLSCREEN_TEXT;
    }

    /**
     * Get fullscreen button icon
     */
    getFullscreenIcon(): string {
        return this.playerState.isFullscreen ? '⛶' : '⛶';
    }
}
