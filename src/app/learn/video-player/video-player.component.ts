import { Component, Input, OnDestroy, AfterViewInit, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Very small wrapper around YT Iframe API with our own controls
declare global { interface Window { onYouTubeIframeAPIReady: any; YT: any; } }

@Component({
    selector: 'app-video-player',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="player card">
      <div class="frame">
        <div #host id="yt-host"></div>
      </div>

      <div class="controls d-flex align-items-center gap-2 px-3 py-2">
        <button class="btn" (click)="togglePlay()">{{ playing ? 'Pause' : 'Play' }}</button>
        <input class="range flex-grow-1" type="range" min="0" [max]="duration" [(ngModel)]="current" (change)="seek()" />
        <div class="time">{{ format(current) }} / {{ format(duration) }}</div>

        <select class="btn" [(ngModel)]="speed" (change)="setSpeed()">
          <option *ngFor="let s of speeds" [value]="s">{{s}}x</option>
        </select>

        <button class="btn" (click)="toggleMute()">{{ muted ? 'Unmute' : 'Mute' }}</button>
        <button class="btn" (click)="fullscreen()">Full</button>
      </div>
    </div>
  `,
    styles: [`
    .card{ background: var(--surface); border:1px solid #1b2a38; border-radius:16px; overflow:hidden; }
    .frame{ aspect-ratio: 16/9; background:#000; }
    .controls{ background: #121a24; border-top:1px solid #1b2a38; }
    .btn{ background:#1b2531; border:1px solid #2a3b4e; color:#e6eef7; padding:6px 10px; border-radius:8px; cursor:pointer; }
    .range{ accent-color: var(--brand); }
    .time{ color:#a9bed4; font-variant-numeric: tabular-nums; }
  `]
})
export class VideoPlayerComponent implements AfterViewInit, OnDestroy {
    @Input({ required: true }) videoId!: string;
    @ViewChild('host', { static: true }) host!: ElementRef<HTMLDivElement>;

    player!: any;
    playing = false;
    muted = false;
    speed = 1;
    speeds = [0.5, 1, 1.25, 1.5, 1.75, 2];
    duration = 0;
    current = 0;
    private timer?: any;

    ngAfterViewInit() {
        this.loadApi().then(() => this.create());
    }
    ngOnDestroy() { clearInterval(this.timer); if (this.player?.destroy) this.player.destroy(); }

    private loadApi(): Promise<void> {
        return new Promise(res => {
            if (window.YT?.Player) return res();
            const s = document.createElement('script');
            s.src = 'https://www.youtube.com/iframe_api';
            document.body.appendChild(s);
            window.onYouTubeIframeAPIReady = () => res();
        });
    }

    private create() {
        this.player = new window.YT.Player(this.host.nativeElement, {
            videoId: this.videoId,
            playerVars: { modestbranding: 1, rel: 0, controls: 0 },
            events: {
                onReady: () => {
                    this.duration = Math.floor(this.player.getDuration() || 0);
                    this.tick();
                },
                onStateChange: (e: any) => {
                    this.playing = e.data === window.YT.PlayerState.PLAYING;
                    if (e.data === window.YT.PlayerState.ENDED) this.onEnded?.();
                }
            }
        });
    }

    // Expose a simple ended callback (parent sets it)
    onEnded?: () => void;

    private tick() {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            if (!this.player) return;
            this.current = Math.floor(this.player.getCurrentTime() || 0);
            this.duration = Math.floor(this.player.getDuration() || 0);
        }, 500);
    }

    togglePlay() { this.playing ? this.player.pauseVideo() : this.player.playVideo(); }
    toggleMute() { this.muted ? this.player.unMute() : this.player.mute(); this.muted = !this.muted; }
    setSpeed() { this.player.setPlaybackRate(this.speed); }
    seek() { this.player.seekTo(this.current, true); }
    fullscreen() { (this.host.nativeElement.parentElement as any)?.requestFullscreen?.(); }

    format(s: number) {
        const m = Math.floor(s / 60), ss = s % 60;
        return `${m}:${ss.toString().padStart(2, '0')}`;
    }
}
