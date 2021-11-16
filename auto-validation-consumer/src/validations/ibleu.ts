const maxN = 4
const reserved_words = ['watch', 'constructor'];

// A utility function to find undefined items
function isUndefined(item: any) {
    return typeof (item) == "undefined";
}

function zeroArray(length: number) {
    return new Array(length).fill(0);
}

const getMin = (arr: Array<number>) => {
    return Math.min.apply(null, arr);
}

// A function that computes ngram counts from a given sentence
function Words2Ngrams(words: any[]) {
    let ngram_counts: any = {};
    for (let i = 1; i <= 4; i++) {
        ngramOperation(words, i, ngram_counts);
    }
    return ngram_counts;
}

function ngramOperation(words: any[], i: number, ngram_counts: any) {
    for (let j = 0; j <= (words.length - i); j++) {
        let ngram = makeSafe(words.slice(j, j + i).join(" "));
        if (ngram in ngram_counts) {
            ngram_counts[ngram]++;
        }
        else {
            if (ngram == "watch") {
                Error(ngram);
            }
            ngram_counts[ngram] = 1;
        }
    }
}

function generalComputeBLEU(reflength: number, ngramMatches: number[], numTstNgrams: number[], smoothed: any, order: number) {
    let brevity = Math.exp(Math.min(0, 1 - reflength / numTstNgrams[1]));
    let scores: any = [undefined];
    let smoothlevel = 1;

    for (var i = 1; i <= order; i++) {
        if (numTstNgrams[i] === 0) {
            scores.push(0);
        }
        else if (ngramMatches[i] === 0) {
            scores.push(smoothed ? Math.log(1 / (Math.pow(2, smoothlevel) * numTstNgrams[i])) : -Infinity);
            smoothlevel += 1;
        }
        else {
            scores.push(Math.log(ngramMatches[i] / numTstNgrams[i]));
        }
    }

    let prec: any = [undefined];
    let sum = 0.0;
    for (i = 1; i <= order; i++) {
        sum = scores.slice(1, i + 1).reduce(function (x: any, y: any) { return x + y; });
        prec.push(Math.exp(sum / i));
    }

    let individual = scores.map(Math.exp);

    let cumulative = prec.map(function (x: number) { return x * brevity; });

    let finalBleu = cumulative[4];
    return [brevity, scores, prec, individual, cumulative, finalBleu];
}


function bleuScoreObject(order: number, smoothed: boolean) {//4, true

    // Initialize reference length and other stuff
    let obj: any = {}
    obj.order = order;
    obj.smoothed = smoothed;
    obj.reflength = 0;

    obj.numTstNgrams = [undefined].concat(zeroArray(order));

    // Initialize the array that holds the number of matching ngrams
    obj.ngramMatches = [undefined].concat(zeroArray(order));

    // To update my stats from another bleuObject, use the update method
    obj.update = function (otherBleuObject: { ngramMatches: any[]; numTstNgrams: any[]; reflength: any; }) {
        for (var n = 0; n <= obj.order; n++) {
            obj.ngramMatches[n] += otherBleuObject.ngramMatches[n];
            obj.numTstNgrams[n] += otherBleuObject.numTstNgrams[n];
        }
        obj.reflength += otherBleuObject.reflength;
    };

    // A function that computes all the BLEU components and returns the final BLEU-4 score
    obj.computeBLEU = function () {

        // call the general BLEU function and get everything we need
        let bleuResults = generalComputeBLEU(obj.reflength, obj.ngramMatches, obj.numTstNgrams, obj.smoothed, obj.order);

        obj.brevity = bleuResults[0];
        obj.ngramScores = bleuResults[1];
        obj.precisions = bleuResults[2];
        obj.individualNgramScores = bleuResults[3];
        obj.cumulativeNgramScores = bleuResults[4];
        obj.bleuScore = bleuResults[5];

        return obj.bleuScore;
    };
    return obj
}

export function scoreSegment(tstSegment: string, refSegment: string) {
    //var numTstNgrams = [undefined].concat(zeroArray(maxN, Array));
    let numRefNgrams: any = [undefined].concat(zeroArray(maxN));
    let clippedRefNgrams: any = {};
    let reflengths: any = [];
    let segBleuObj = bleuScoreObject(4, true);

    // Split the test segment into words
    let tstWords = tstSegment.split(/\s+/);

    // Get number of unigrams, bigrams etc. in the test segment
    for (let i = 1; i <= 4; i++) {
        segBleuObj.numTstNgrams[i] = i <= tstWords.length ? tstWords.length - i + 1 : 0;
    }

    let tstNgrams = Words2Ngrams(tstWords);
    let refWords = refSegment.split(/\s+/);
    let refNgrams = Words2Ngrams(refWords);

    // Clip final count for each n-gram to maximum # of occurrences in any of the references
    for (let ngram in refNgrams) {
        clippedRefNgrams[ngram] = isUndefined(clippedRefNgrams[ngram]) ? refNgrams[ngram] : Math.max(clippedRefNgrams[ngram], refNgrams[ngram]);
    }

    // Update total number of unigrams, bigrams etc.
    for (let k = 1; k <= maxN; k++) {
        numRefNgrams[k] += k <= refWords.length ? refWords.length - k + 1 : 0;
    }

    reflengths.push(refWords.length);

    // Compute the representative reference length whether "shortest" or "closest"
    if (reflengths.length == 1) {
        segBleuObj.reflength = reflengths[0];
    }
    // else if  (reflenMethod == "shortest") {
    //     segBleuObj.reflength = getMin(reflengths);
    // }
    else {
        let tstlength = tstWords.length;
        let diffs = reflengths.map(function (x: number) { return Math.abs(x - tstlength); });
        segBleuObj.reflength = reflengths[diffs.indexOf(getMin(diffs))];
    }

    for (let ngram in tstNgrams) {
        let order = ngram.split(" ").length;
        if (!(ngram in clippedRefNgrams)) continue;
        let count_this_ngram = Math.min(tstNgrams[ngram], clippedRefNgrams[ngram]);
        segBleuObj.ngramMatches[order] += count_this_ngram;
    }

    let segscore = segBleuObj.computeBLEU();

    return segscore;
}

function makeSafe(ngram: string) {
    let ans = ngram;
    if (reserved_words.indexOf(ngram) !== -1) {
        ans = '#' + ngram + '#';
    }
    return ans
}