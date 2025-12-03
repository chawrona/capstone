export default class Timer {
    constructor() {
        this.timer = 60;
    }

    setTimer(newTime) {
        this.timer = newTime;
    }

    addTime(time) {
        this.timer += time;
    }

    addTimeIfLessThan(timeToBeAdded, time) {
        if (this.timer <= time || time === undefined) {
            this.timer += timeToBeAdded;
        }
    }

    subtract(time) {
        let newTime = this.timer - time;
        if (newTime < 0) {
            newTime = 0;
        }
        this.timer = newTime;
    }

    getTimer() {
        return this.timer;
    }

    isTimerZero() {
        return !this.timer;
    }
}