import { uniqBy } from 'lodash';
import getTokenizer from '../services/tokenizer.js';


const puctuationRe = /[。！？!?…\n]/g;
const kanjiRegex = /[^ぁ-んァ-ン]/u;

const ignoredPos = [
  '助詞',
  '助動詞',
  '接頭詞',
  '記号'
];

const ignoredPosDetails = [
  '数',
  '代名詞',
  '一般',
  '非自立',
  '接尾'
];

export default function gloss(text) {
  return getTokenizer().then(tokenizer => {
    const allTokens = [];
    const sentences = text.split(puctuationRe);

    sentences.map(sentence => {
      const tokens = tokenizer.tokenize(sentence);

      tokens.forEach(token => {
        // Ignore empty tokens
        const basicForm = token.basic_form.trim();
        if (!basicForm || basicForm === '*') return;

        // Ignore auxiliary parts of speech
        if (ignoredPos.indexOf(token.pos) > -1 || ignoredPosDetails.indexOf(token.pos_detail_1) > -1) return;

        // Ignore kana-only words
        if (!kanjiRegex.test(basicForm)) return;

        token.sentence = sentence;
        allTokens.push(token);
      });
    });

    const unique = uniqBy(allTokens, 'basic_form');

    return unique;
  });
};
