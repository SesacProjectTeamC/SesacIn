// badwords-ko
// https://www.npmjs.com/package/badwords-ko
// npm install badwords-ko --save
// filter.clean("임의 단어")

const Filter = require('badwords-ko');
const filter = new Filter({ placeHolder: '*' });
filter.addWords('미친');

// 비속어 필터링 함수
const filterBadWords = (text) => {
  return filter.clean(text);
};

// 필터링 여부 확인 함수
const isBadWords = (text) => {
  return filter.isProfane(text);
};

module.exports = {
  filterBadWords,
  isBadWords,
};
