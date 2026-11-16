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

const prefetchedPages = new Set();

function prefetchPage(event) {
    if (!(event.target instanceof Element)) {
        return;
    }

    const link = event.target.closest("a[href]");
    if (!link || link.hasAttribute("download") || (link.target && link.target.toLowerCase() !== "_self")) {
        return;
    }

    if (event.type === "pointerover" && event.relatedTarget && link.contains(event.relatedTarget)) {
        return;
    }

    const connection = navigator.connection;
    if (connection && (connection.saveData || /(^|-)2g$/.test(connection.effectiveType || ""))) {
        return;
    }

    const destination = new URL(link.href);
    if (
        destination.origin !== location.origin ||
        !["http:", "https:"].includes(destination.protocol) ||
        (destination.pathname === location.pathname && destination.search === location.search)
    ) {
        return;
    }

    destination.hash = "";
    const url = destination.href;
    if (prefetchedPages.has(url)) {
        return;
    }

    const prefetch = document.createElement("link");
    prefetch.rel = "prefetch";
    prefetch.href = url;
    document.head.append(prefetch);
    prefetchedPages.add(url);
}

document.addEventListener("pointerover", prefetchPage);
document.addEventListener("focusin", prefetchPage);

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
