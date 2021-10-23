const levenshtein = require('js-levenshtein');

function overlap_score(ref, hyp) {
    let ref_ocr = ref.split(' ').join('');
    let hyp_ocr = hyp.split(' ').join('');
    let mismatch_count = levenshtein(hyp_ocr, ref_ocr);
    console.log('mismatchCount', mismatch_count)
    let score = 1 - (mismatch_count / hyp_ocr.length);
    console.log('score', score)
    return score < 0.9;
}

module.exports = { overlap_score };