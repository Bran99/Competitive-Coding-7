// Time Complexity : O(NlogN)
// Space Complexity : O(N)
// Did this code successfully run on Leetcode : Yes
// Any problem you faced while coding this : No

/**
 * @param {number[][]} intervals
 * @return {number}
 */

class MinHeap {
    constructor(comparator) {
        this.data = [];
        this.comparator = comparator || ((parent, child) => parent - child);
    }

    get size() {
        return this.data.length;
    }

    bubbleUp(c) {
        if (c === 0) return;
        const p = Math.floor((c + 1) / 2) - 1;
        if (this.comparator(this.data[p], this.data[c]) > 0) {
            [this.data[p], this.data[c]] = [this.data[c], this.data[p]];
        }
        this.bubbleUp(p);
    }

    bubbleDown(p) {
        const c = 2 * (p + 1) - 1;
        if (c >= this.data.length) return;

        const leftDelta = this.comparator(this.data[p], this.data[c]);
        const rightDelta = c + 1 >= this.data.length ? 0 : this.comparator(this.data[p], this.data[c + 1]);
        if (leftDelta <= 0 && rightDelta <= 0) return;

        const swapChildIndex = c + (leftDelta <= rightDelta);
        [this.data[p], this.data[swapChildIndex]] = [this.data[swapChildIndex], this.data[p]];
        this.bubbleDown(swapChildIndex);
    }

    add(val) {
        this.data.push(val);
        this.bubbleUp(this.data.length - 1);
    }

    poll() {
        if (this.size < 2) return this.data.pop();
        [this.data[0], this.data[this.size - 1]] = [this.data[this.size - 1], this.data[0]];
        const val = this.data.pop();
        this.bubbleDown(0);
        return val;
    }
    
    peek() {
        return this.data[0];
    }
}

var minMeetingRooms = function(intervals) {
    if (!intervals || !intervals.length) return 0;
    
    // instantiate our heap to 
    let scheduler = new MinHeap((a, b) => {return a[1] - b[1]});
    
    // Sort the array based on start time
    intervals = intervals.sort((a, b) => {return a[0] - b[0]});
    
    // Add the first interval
    scheduler.add(intervals[0]);
    
    for (const [index, interval] of intervals.entries()) {
        if (index == 0) continue;
        // Compare meetings based on end time
        // If we can add a meeting, change the min meeting time to the new
        // end time
        let minStartTime = scheduler.peek()[0],
            minEndTime = scheduler.peek()[1],
            currStartTime = interval[0],
            currEndTime = interval[1];
        
        if (currStartTime >= minEndTime) {
            let newInterval = [minStartTime, currEndTime];
            scheduler.poll();
            scheduler.add(newInterval);
        } else {
            scheduler.add(interval);
        }
    }
    console.log(scheduler);
    return scheduler.size;
};
