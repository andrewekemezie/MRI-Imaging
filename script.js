"use strict";

const themeKey = "magnetic-iq-theme";
const root = document.documentElement;
const themeColor = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme) {
    root.dataset.theme = theme;
    const isDark = theme === "dark";

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
        button.setAttribute("aria-pressed", String(isDark));
        button.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
        button.setAttribute("title", `Switch to ${isDark ? "light" : "dark"} mode`);
    });

    if (themeColor) {
        themeColor.setAttribute("content", isDark ? "#0b0f14" : "#f5f8f7");
    }
}

const savedTheme = localStorage.getItem(themeKey);
applyTheme(savedTheme === "dark" ? "dark" : "light");

document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
        const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
        localStorage.setItem(themeKey, nextTheme);
        applyTheme(nextTheme);
    });
});

const insightCards = Array.from(document.querySelectorAll("[data-insight-card]"));
const insightGroups = Array.from(document.querySelectorAll("[data-insight-list]"));

document.querySelectorAll("[data-insight-filter]").forEach((button) => {
    button.addEventListener("click", () => {
        const selectedCategory = button.dataset.insightFilter;

        document.querySelectorAll("[data-insight-filter]").forEach((filterButton) => {
            filterButton.setAttribute("aria-pressed", String(filterButton === button));
        });

        insightCards.forEach((card) => {
            card.hidden = selectedCategory !== "all" && card.dataset.category !== selectedCategory;
        });

        insightGroups.forEach((group) => {
            group.hidden = !group.querySelector("[data-insight-card]:not([hidden])");
        });
    });
});
