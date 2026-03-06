import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";

const slidersImages = document.querySelectorAll(".images-slider");
const slidersTextMedia = document.querySelectorAll(".text-media-slider");

document.addEventListener("DOMContentLoaded", () => {
    if (slidersImages) {
        slidersImages.forEach((el) => {
            const swiperEL = el.querySelector(".swiper");
            const nextEl = el.querySelector(".swiper-button-next");
            const prevEl = el.querySelector(".swiper-button-prev");
            const paginationEl = el.querySelector(".swiper-pagination");

            const navigation = nextEl && prevEl ? { nextEl, prevEl, addIcons: false } : undefined;
            const pagination = paginationEl
                ? { el: paginationEl, clickable: true }
                : undefined;
            const swiper = new Swiper(swiperEL, {
                modules: [Navigation, Pagination],
                speed: 400,
                spaceBetween: 12,
                slidesPerView: 1,
                watchOverflow: true,
                navigation,
                pagination,
                breakpoints: {
                    480: {
                        slidesPerView: 1.5,
                        spaceBetween: 16,
                    },
                    720: {
                        slidesPerView: 3,
                        spaceBetween: 16,
                    },
                    1440: {
                        slidesPerView: 4,
                        spaceBetween: 16,
                    },
                },
            });
        });
    }

    if (slidersTextMedia) {
        slidersTextMedia.forEach((el) => {
            const swiperEL = el.querySelector(".swiper");
            const nextEl = el.querySelector(".swiper-button-next");
            const prevEl = el.querySelector(".swiper-button-prev");
            const paginationEl = el.querySelector(".swiper-pagination");

            const navigation = nextEl && prevEl ? { nextEl, prevEl, addIcons: false } : undefined;
            const pagination = paginationEl
                ? { el: paginationEl, clickable: true }
                : undefined;
            const swiper = new Swiper(swiperEL, {
                modules: [Navigation, Pagination],
                speed: 400,
                spaceBetween: 12,
                slidesPerView: 1,
                watchOverflow: true,
                navigation,
                pagination,
                breakpoints: {
                    480: {
                        slidesPerView: 1.5,
                        spaceBetween: 16,
                    },
                    720: {
                        slidesPerView: 2,
                        spaceBetween: 16,
                    },
                    1440: {
                        slidesPerView: 5,
                        spaceBetween: 16,
                    },
                },
            });
        });
    }
});
