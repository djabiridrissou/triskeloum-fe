// src/services/AgoraService.ts

import AgoraRTC, {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  IAgoraRTCRemoteUser,
} from 'agora-rtc-sdk-ng';

export class AgoraService {
  private client: IAgoraRTCClient | null = null;
  private localAudioTrack: IMicrophoneAudioTrack | null = null;
  private isJoined: boolean = false;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    // Enable detailed logging for development
    AgoraRTC.setLogLevel(1);
  }

  /**
   * Initialize Agora client
   */
  initialize(): void {
    if (this.client) {
      console.log('ℹ️ Agora client already initialized');
      return;
    }

    this.client = AgoraRTC.createClient({
      mode: 'rtc',
      codec: 'vp8',
    });

    // CRITICAL: Setup remote user event listeners
    this.client.on('user-published', async (user, mediaType) => {
      if (mediaType === 'audio') {
        try {
          console.log(`👤 User ${user.uid} published audio, subscribing...`);
          await this.client!.subscribe(user, mediaType);

          // Play remote audio
          user.audioTrack?.play();
          console.log(`✅ Subscribed and playing audio from user ${user.uid}`);

          // Notify listeners
          this.emit('user-published', user, mediaType);
        } catch (error) {
          console.error(`❌ Error subscribing to user ${user.uid}:`, error);
        }
      }
    });

    this.client.on('user-unpublished', (user, mediaType) => {
      if (mediaType === 'audio') {
        console.log(`🔇 User ${user.uid} unpublished audio`);
        this.emit('user-unpublished', user, mediaType);
      }
    });

    this.client.on('user-joined', (user) => {
      console.log(`👋 User ${user.uid} joined channel`);
      this.emit('user-joined', user);
    });

    this.client.on('user-left', (user) => {
      console.log(`👋 User ${user.uid} left channel`);
      this.emit('user-left', user);
    });

    console.log('✅ Agora client initialized with event listeners');
  }

  /**
   * Join voice room channel
   */
  async join(
    appId: string,
    channelName: string,
    token: string,
    uid: number
  ): Promise<void> {
    if (!this.client) {
      throw new Error('Client not initialized');
    }

    if (this.isJoined) {
      console.warn('⚠️ Already joined a channel');
      return;
    }

    try {
      // Join channel
      await this.client.join(appId, channelName, token, uid);
      console.log(`✅ Joined channel: ${channelName}`);

      // Create and publish local audio track
      this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      await this.client.publish([this.localAudioTrack]);
      console.log('✅ Published local audio track');

      this.isJoined = true;
    } catch (error) {
      console.error('❌ Error joining channel:', error);
      throw error;
    }
  }

  /**
   * Leave voice room channel
   */
  async leave(): Promise<void> {
    if (!this.client || !this.isJoined) return;

    try {
      // Close and unpublish local audio track
      if (this.localAudioTrack) {
        this.localAudioTrack.close();
        this.localAudioTrack = null;
      }

      // Leave channel
      await this.client.leave();
      this.isJoined = false;
      console.log('✅ Left voice room');
    } catch (error) {
      console.error('❌ Error leaving channel:', error);
      throw error;
    }
  }

  /**
   * Toggle mute/unmute microphone
   */
  async toggleMute(): Promise<boolean> {
    if (!this.localAudioTrack) {
      console.warn('⚠️ No local audio track');
      return false;
    }

    const isMuted = !this.localAudioTrack.enabled;
    await this.localAudioTrack.setEnabled(isMuted);
    console.log(`🎤 Microphone ${isMuted ? 'unmuted' : 'muted'}`);

    return !isMuted;
  }

  /**
   * Get mute status
   */
  isMuted(): boolean {
    if (!this.localAudioTrack) return true;
    return !this.localAudioTrack.enabled;
  }

  /**
   * Register event listeners
   */
  on(
    event: 'user-joined' | 'user-left' | 'user-published' | 'user-unpublished',
    callback: (user: IAgoraRTCRemoteUser, mediaType?: string) => void
  ): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  /**
   * Emit event to listeners
   */
  private emit(event: string, ...args: any[]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(...args));
    }
  }

  /**
   * Get remote users
   */
  getRemoteUsers(): IAgoraRTCRemoteUser[] {
    if (!this.client) return [];
    return this.client.remoteUsers;
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    console.log('🧹 Disposing Agora service...');

    if (this.localAudioTrack) {
      this.localAudioTrack.close();
      this.localAudioTrack = null;
    }

    if (this.client) {
      if (this.isJoined) {
        this.client.leave().catch(err =>
          console.error('Error leaving on dispose:', err)
        );
      }
      this.client.removeAllListeners();
      this.client = null;
    }

    this.eventListeners.clear();
    this.isJoined = false;
    console.log('✅ Agora service disposed');
  }

  /**
   * Check if currently in a call
   */
  get inCall(): boolean {
    return this.isJoined;
  }
}

export default new AgoraService();
