export default class Chunk {
  master: any;
  queue: any[];
  uploadingQueue: any[];
  inProgressCount: number;
  uploadedCount: number;
  CHUNK_LIMIT: number;
  interval: number;
  $counterLabel: any;

  constructor(master) {
    this.master = master;
    this.queue = [];
    this.uploadingQueue = [];
    this.inProgressCount = 0;
    this.uploadedCount = 0;
    this.CHUNK_LIMIT = 3;
  }

  AddToQueue(uploader) {
    this.queue.push(uploader);

    if (!this.interval) {
      this.interval = window.setInterval(this.StartUploading.bind(this));
    }
  }

  StartUploading() {
    if (this.queue.length > 0 && this.inProgressCount <= this.CHUNK_LIMIT) {
      const uploader = this.queue[0];

      this.queue.splice(0, 1);
      this.inProgressCount++;
      this.ExecuteUpload(this.inProgressCount - 1, uploader);
    }
  }

  async ExecuteUpload(i, uploader) {
    await uploader.Upload();
    this.inProgressCount--;
    this.$counterLabel.text(++this.uploadedCount);

    if (this.inProgressCount === 0) {
      clearInterval(this.interval);

      this.interval = null;
    }
  }
}
