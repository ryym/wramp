const getJobQueuers = () => {
  if (typeof global.requestAnimationFrame === 'function') {
    return {
      queueJob: global.requestAnimationFrame.bind(global),
      cancelJob: global.cancelAnimationFrame.bind(global),
    };
  }

  return {
    queueJob: global.setTimeout.bind(global),
    cancelJob: global.clearTimeout.bind(global),
  };
};

export default class AsyncUpdater {
  constructor(
    update,
    { queueJob, cancelJob } = getJobQueuers()
  ) {
    this.canceled = false;
    this.cancelJob = cancelJob;

    this.updateRegularly = () => {
      if (! this.canceled) {
        update();
        this.jobID = queueJob(this.updateRegularly);
      }
    };
  }

  start() {
    this.canceled = false;
    this.updateRegularly();
    return this;
  }

  cancel() {
    this.canceled = true;
    if (this.jobID) {
      this.cancelJob(this.jobID);
      this.jobID = undefined;
    }
  }
}
