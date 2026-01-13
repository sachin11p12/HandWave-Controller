export class GestureController {
  constructor() {
    this.settings = {
      enabled: true,
      cooldownMs: 800, 
    };

    this.state = {
      lastActionTime: 0,
      lastGesture: "NONE",
    };

    this.loadSettings();
  }

  loadSettings() {
    const saved = localStorage.getItem("gestureControllerSettings");
    if (saved) {
      this.settings = { ...this.settings, ...JSON.parse(saved) };
    }
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem(
      "gestureControllerSettings",
      JSON.stringify(this.settings)
    );
  }

  handleGestureData(gestureData) {
    if (!this.settings.enabled || !gestureData.detected) return;

    const now = Date.now();
    if (now - this.state.lastActionTime < this.settings.cooldownMs) return;

    const { gesture } = gestureData;
    if (gesture === "NONE") return;

    this.performAction(gesture);
    this.state.lastActionTime = now;
    this.state.lastGesture = gesture;
  }

  performAction(gesture) {
    const videos = document.querySelectorAll("video");
    // We only want to control the demo/content videos, not the webcam feed
    // Content videos usually have controls or a specific class.
    // For this app, the webcam video is muted and has no controls.
    const targetVideos = Array.from(videos).filter(
      (v) => v.hasAttribute("controls") || v.id === "content-video"
    );

    targetVideos.forEach((video) => {
      switch (gesture) {
        case "OPEN_PALM":
          if (video.paused) video.play().catch(() => {});
          break;
        case "CLOSED_FIST":
          if (!video.paused) video.pause();
          break;
        case "TWO_FINGERS":
          video.playbackRate = video.playbackRate === 2 ? 1 : 2;
          break;
        case "SWIPE_RIGHT":
          video.currentTime += 10;
          break;
        case "SWIPE_LEFT":
          video.currentTime -= 10;
          break;
        default:
          break;
      }
    });
  }
}

export const controller = new GestureController();
