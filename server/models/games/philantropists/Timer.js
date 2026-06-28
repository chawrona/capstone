export default class Timer {
    constructor(initialTime) {
        this.timer = initialTime;
    }

    setTimer(newTime) {
        this.timer = newTime;
    }

    addTime(time) {
        this.timer += time;
        if (this.timer > 60) this.timer = 60;
    }

    addTimeIfLessThan(timeToBeAdded, time = 60) {
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
