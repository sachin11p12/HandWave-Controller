import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

export class GestureTracker {
  constructor(videoElement, onResultsCallback) {
    this.videoElement = videoElement;
    this.onResultsCallback = onResultsCallback;
    this.hands = null;
    this.camera = null;
    this.lastX = null;
    this.moveHistory = [];
    this.initPromise = this.init();
  }

  async init() {
    try {
      this.hands = new Hands({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      this.hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      this.hands.onResults((results) => {
        if (this.onResultsCallback) {
          const gestureData = this.processLandmarks(results);
          this.onResultsCallback(gestureData);
        }
      });

      this.camera = new Camera(this.videoElement, {
        onFrame: async () => {
          await this.hands.send({ image: this.videoElement });
        },
        width: 640,
        height: 480,
      });

      this.videoElement.setAttribute("autoplay", "");
      this.videoElement.setAttribute("muted", "");
      this.videoElement.setAttribute("playsinline", "");
    } catch (error) {
      console.error("GestureTracker Init Error:", error);
      if (this.onResultsCallback) {
        this.onResultsCallback({ error: "Init failed: " + error.message });
      }
    }
  }

  async start() {
    await this.initPromise;
    if (this.camera) {
      try {
        await this.camera.start();
      } catch (error) {
        console.error("Camera Start Error:", error);
        if (this.onResultsCallback) {
          this.onResultsCallback({
            error: "Camera access failed. Is it being used by another app?",
          });
        }
      }
    }
  }

  stop() {
    if (this.camera) {
      this.camera.stop();
    }
  }

  processLandmarks(results) {
    if (
      !results.multiHandLandmarks ||
      results.multiHandLandmarks.length === 0
    ) {
      this.lastX = null;
      return { detected: false, gesture: "NONE", fingerStates: {} };
    }

    const landmarks = results.multiHandLandmarks[0];
    const getDist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);


    const ratios = {
      thumb:
        getDist(landmarks[4], landmarks[0]) /
        getDist(landmarks[2], landmarks[0]),
      index:
        getDist(landmarks[8], landmarks[0]) /
        getDist(landmarks[6], landmarks[0]),
      middle:
        getDist(landmarks[12], landmarks[0]) /
        getDist(landmarks[10], landmarks[0]),
      ring:
        getDist(landmarks[16], landmarks[0]) /
        getDist(landmarks[14], landmarks[0]),
      pinky:
        getDist(landmarks[20], landmarks[0]) /
        getDist(landmarks[18], landmarks[0]),
    };


    const fingerStates = {
      thumb: ratios.thumb > 1.2 || landmarks[4].y < landmarks[2].y - 0.05,
      index: ratios.index > 1.05 || landmarks[8].y < landmarks[6].y,
      middle: ratios.middle > 1.05 || landmarks[12].y < landmarks[10].y,
      ring: ratios.ring > 1.05 || landmarks[16].y < landmarks[14].y,
      pinky: ratios.pinky > 1.05 || landmarks[20].y < landmarks[18].y,
    };

    if (Math.random() < 0.05) {
      console.log(
        "Finger Ratios:",
        JSON.stringify(
          Object.fromEntries(
            Object.entries(ratios).map(([f, r]) => [f, r.toFixed(2)])
          )
        )
      );
    }

    const openFingers = Object.values(fingerStates).filter((v) => v).length;
    let gesture = "NONE";

    if (openFingers >= 4) {
      gesture = "OPEN_PALM";
    } else if (openFingers <= 1 && !fingerStates.index) {
      
      gesture = "CLOSED_FIST";
    } else if (openFingers === 2 && fingerStates.index && fingerStates.middle) {
      gesture = "TWO_FINGERS";
    } else if (fingerStates.index && openFingers === 1) {
      gesture = "ONE_FINGER";
    }

    const currentX = landmarks[8].x;
    if (this.lastX !== null && gesture === "ONE_FINGER") {
      const deltaX = currentX - this.lastX;
      if (Math.abs(deltaX) > 0.08) {
        gesture = deltaX < 0 ? "SWIPE_RIGHT" : "SWIPE_LEFT";
      }
    }

    if (fingerStates.index) {
      this.lastX = currentX;
    } else {
      this.lastX = null;
    }

    return {
      detected: true,
      gesture,
      fingerStates,
      openCount: openFingers,
      landmarks,
    };
  }
}
