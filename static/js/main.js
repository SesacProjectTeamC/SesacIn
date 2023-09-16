const swiperSetting = (type) => {
  return {
    slidesPerView: "1", // 한 슬라이드에 보여줄 갯수
    slidesPerGroup: 1,
    loop: false, // 슬라이드 반복 여부
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    }, // pager 여부
    navigation: {
      nextEl: `.${type}Next`,
      prevEl: `.${type}Prev`,
    },
    autoplay: {
      // 자동 슬라이드 설정
      delay: 3000, // 시간 설정
      disableOnInteraction: false, // false로 설정하면 스와이프 후 자동 재생이 비활성화 되지 않음
    },

    breakpoints: {
      //반응형
      // 화면의 넓이가 320px 이상일 때
      700: {
        slidesPerView: 2,
        spaceBetween: 0,
        slidesPerGroup: 2,
      },
      1000: {
        slidesPerView: 3,
        spaceBetween: 0,
        slidesPerGroup: 3,
      },
      // 화면의 넓이가 640px 이상일 때
      1300: {
        slidesPerView: 4,
        spaceBetween: 0,
        slidesPerGroup: 4,
      },
    },
  };
};

var qnaSlide = new Swiper(".qnaSwiper", swiperSetting("q"));
var boardSlide = new Swiper(".boardSwiper", swiperSetting("b"));
