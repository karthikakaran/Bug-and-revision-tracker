'use strict';

module.exports = {
    base26_chars : (num) => {
        if (num < 0) {
            throw new Error("Input number must be non-negative.");
        }
        if (num === 0) {
            return "A"; // Or any single character you define as zero
        }

        let result = "";
        while (num > 0) {
            const remainder = (num - 1) % 26; // 0-indexed remainder
            result = String.fromCharCode(65 + remainder + 1) + result; // A is ASCII 65
            num = Math.floor((num - 1) / 26);
        }
        return result;
    }
}