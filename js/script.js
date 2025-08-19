
// 背景画像切り替え
// ここに使いたい画像を並べてください（相対/絶対どちらもOK）
const images = [
    "images/bg5.jpg",
    "images/bg9.jpg",
    "images/bg4.jpg",
];

const INTERVAL = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--interval')) || 30000;

// 画像を事前読み込み（フェード時のチラつき防止）
function preload(srcs) {
    srcs.forEach(src => { const img = new Image(); img.src = src; });
}
preload(images);
let idx = 0;
const bgA = document.getElementById("bgA");
const bgB = document.getElementById("bgB");

// 最初の背景
bgA.style.backgroundImage = `url(${images[idx]})`;

function swapBackground() {
    const nextIdx = (idx + 1) % images.length;

    // Bに次の画像をセットしてフェードイン
    bgB.style.backgroundImage = `url(${images[nextIdx]})`;
    bgB.style.opacity = 1;

    // フェードが終わったら AにコピーしてBをリセット
    const fadeMs = 1200;
    setTimeout(() => {
        bgA.style.backgroundImage = bgB.style.backgroundImage;
        bgB.style.opacity = 0;
        idx = nextIdx;
    }, fadeMs);
}

setInterval(swapBackground, 30000);

// 画像が1枚以下なら切り替え不要
if (images.length > 1) {
    setInterval(swapBackground, INTERVAL);
}





// GSAP ドラッグと慣性ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(Draggable, InertiaPlugin);

    const container = document.getElementById("container");
    const panels = container.querySelectorAll(".panel");
    const dots = document.querySelectorAll(".dot");
    let viewportWidth = window.innerWidth;

    // Draggable 作成
    const draggable = Draggable.create(container, {
        type: "x",
        inertia: true,
        edgeResistance: 0.85,
        bounds: {
            minX: -((panels.length - 1) * viewportWidth),
            maxX: 0
        },
        cursor: "grab",
        snap: {
            x: (endValue) => Math.round(endValue / viewportWidth) * viewportWidth
        },
        onDrag: updateDots,
        onThrowUpdate: updateDots
    })[0];

    // ページネーション更新
    function updateDots() {
        const index = Math.round(-draggable.x / (viewportWidth));
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }

    // リサイズ対応
    window.addEventListener("resize", () => {
        viewportWidth = window.innerWidth;
        draggable.applyBounds({
            minX: -((panels.length - 1) * viewportWidth),
            maxX: 0
        });
    });
});



// ドロワーメニュー　ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
const dButton = document.querySelector(".drawerButton");
const dMenu = document.querySelector(".header_nav");

// function drawerButton() {
//     dButton.classList.toggle("active");
//     dMenu.classList.toggle("active");
// }

// // メニューリンクをクリックしたら閉じる処理
// document.querySelectorAll(".drawerMenu a").forEach((link) => {
//     link.addEventListener("click", () => {
//         document.querySelector(".drawerButton").classList.remove("active");
//         document.querySelector(".header_nav").classList.remove("active");
//     });
// });

const openDrawer = () => {
    dButton.classList.add("active");
    dMenu.classList.add("active");
    document.body.classList.add("no-scroll");

    // スマホのスクロール操作を検知
    window.addEventListener("touchmove", closeDrawer, { passive: true });
    window.addEventListener("wheel", closeDrawer, { passive: true });
};

const closeDrawer = () => {
    dButton.classList.remove("active");
    dMenu.classList.remove("active");
    document.body.classList.remove("no-scroll");

    // 監視解除（開いてる時だけ反応させたいので）
    window.removeEventListener("touchmove", closeDrawer);
    window.removeEventListener("wheel", closeDrawer);
};

dButton.addEventListener("click", () => {
    if (dMenu.classList.contains("active")) {
        closeDrawer();
    } else {
        openDrawer();
    }
});

// メニュー内リンクを押したら閉じる
dMenu.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", closeDrawer)
);


