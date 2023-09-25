// badwords-ko
// https://www.npmjs.com/package/badwords-ko
// npm install badwords-ko --save
// filter.clean("임의 단어")
// 사용자가 이건 비속어 처리해주세요 라는 요청을 하면 처리할 수 있도록 리팩토링 할 예정

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
