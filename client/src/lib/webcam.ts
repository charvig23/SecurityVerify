export interface WebcamConstraints {
  width: number;
  height: number;
  facingMode: 'user' | 'environment';
}

export class WebcamService {
  private stream: MediaStream | null = null;

  async startCamera(constraints: Partial<WebcamConstraints> = {}): Promise<MediaStream> {
    const defaultConstraints: WebcamConstraints = {
      width: 640,
      height: 480,
      facingMode: 'user',
    };

    const finalConstraints = { ...defaultConstraints, ...constraints };

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: finalConstraints.width },
          height: { ideal: finalConstraints.height },
          facingMode: finalConstraints.facingMode,
        },
        audio: false,
      });

      return this.stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
      throw new Error('Failed to access camera. Please check permissions.');
    }
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  async takeSnapshot(videoElement: HTMLVideoElement): Promise<string> {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Failed to get canvas context');
    }

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    context.drawImage(videoElement, 0, 0);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  }

  isSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
}

export const webcamService = new WebcamService();
