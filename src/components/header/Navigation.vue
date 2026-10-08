<script setup lang="ts">
import { t } from "../../i18n";
import { ref, onMounted, onUnmounted } from "vue";
import { headerConfig } from "../../config";
import { initTheme, toggleTheme } from "../../scripts/theme";
const props = defineProps<{ pathname: string }>();
const isDark = ref(false);
const isAtTop = ref(true);
const menuOpen = ref(false);
const active = (url: string) =>
  url === "/" ? props.pathname === "/" : props.pathname.startsWith(url);
const handleScroll = () => {
  isAtTop.value = window.scrollY < 48;
};
const toggle = () => {
  isDark.value = toggleTheme() === "dark";
};
const openSearch = () => {
  menuOpen.value = false;
  window.dispatchEvent(new Event("kanade:search"));
};
const handleKey = (event: KeyboardEvent) => {
  if (event.key === "Escape") menuOpen.value = false;
};
onMounted(() => {
  isDark.value = initTheme() === "dark";
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("keydown", handleKey);
});
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("keydown", handleKey);
});
</script>

<template>
  <header
    class="nav-header"
    :class="{ scrolled: !isAtTop, 'menu-open': menuOpen }"
  >
    <div class="nav-inner shell">
      <a
        href="/"
        class="brand"
        :aria-label="t('nav.brandHome', { site: headerConfig.title })"
        ><span class="brand-flower">✿</span>{{ headerConfig.title
        }}<span class="brand-dot">.</span></a
      >
      <nav
        :aria-label="t('nav.main')"
        :class="{ expanded: menuOpen }"
        id="main-navigation"
      >
        <a
          v-for="item in headerConfig.navLinks"
          :key="item.url"
          :href="item.url"
          :aria-current="active(item.url) ? 'page' : undefined"
          :class="{ active: active(item.url) }"
        >
          <span :class="item.icon" aria-hidden="true"></span
          ><span>{{ item.name }}</span>
        </a>
      </nav>
      <div class="nav-actions">
        <button
          @click="openSearch"
          :aria-label="t('nav.search')"
          :title="t('nav.searchHint')"
        >
          <span class="icon-[lucide--search]"></span>
        </button>
        <button
          @click="toggle"
          :aria-label="isDark ? t('nav.light') : t('nav.dark')"
          :title="t('nav.theme')"
        >
          <span
            :class="isDark ? 'icon-[lucide--moon]' : 'icon-[lucide--sun]'"
          ></span>
        </button>
        <button
          class="menu-toggle"
          @click="menuOpen = !menuOpen"
          :aria-expanded="menuOpen"
          aria-controls="main-navigation"
          :aria-label="menuOpen ? t('nav.closeMenu') : t('nav.openMenu')"
        >
          <span
            :class="menuOpen ? 'icon-[lucide--x]' : 'icon-[lucide--menu]'"
          ></span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav-header {
  position: fixed;
  inset: 0 0 auto;
  height: 70px;
  z-index: 40;
  color: #fff;
  transition:
    background 0.25s,
    color 0.25s,
    box-shadow 0.25s;
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font:
    600 27px "Oxanium-Medium",
    var(--font-body);
  letter-spacing: -0.8px;
  white-space: nowrap;
}
.brand-flower {
  font-size: 29px;
  font-family: var(--font-body);
  font-weight: 400;
}
.brand-dot {
  color: #ffb4ca;
  margin-left: -7px;
}
nav {
  display: flex;
  gap: 15px;
  padding-left: 0;
}
nav a {
  display: flex;
  align-items: center;
  position: relative;
  gap: 7px;
  padding: 22px 13px;
  font-size: 15px;
  opacity: 0.85;
}
nav a:hover,
nav a.active {
  opacity: 1;
}
nav a.active::after {
  content: "";
  position: absolute;
  bottom: 13px;
  height: 3px;
  width: 19px;
  border-radius: 2px;
  background: currentColor;
  left: calc(50% - 9px);
}
.nav-actions {
  display: flex;
  gap: 10px;
}
.nav-actions button {
  width: 35px;
  height: 35px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  font-size: 19px;
}
.nav-actions button:hover {
  background: #ffffff25;
  transform: rotate(-8deg);
}
.nav-header.scrolled,
.nav-header.menu-open {
  background: color-mix(in srgb, var(--card) 92%, transparent);
  color: var(--text);
  backdrop-filter: blur(18px);
  box-shadow: 0 3px 18px #4b314511;
}
.scrolled nav a.active,
.scrolled .brand-flower {
  color: var(--accent);
}
.nav-actions .menu-toggle {
  display: none;
}
@media (max-width: 760px) {
  .nav-header {
    height: 62px;
  }
  .brand {
    font-size: 25px;
  }
  .nav-actions {
    gap: 5px;
  }
  .nav-actions .menu-toggle {
    display: grid;
  }
  nav {
    display: none;
  }
  nav.expanded {
    display: flex;
    flex-direction: column;
    gap: 0;
    position: absolute;
    inset: 62px 12px auto;
    padding: 9px;
    border-radius: 0 0 16px 16px;
    border: 1px solid var(--line);
    background: var(--card);
    color: var(--text);
    box-shadow: var(--shadow);
  }
  nav a {
    padding: 12px 18px;
    border-radius: 8px;
  }
  nav a.active {
    background: var(--accent-soft);
    color: var(--accent);
  }
  nav a.active::after {
    display: none;
  }
}
</style>
