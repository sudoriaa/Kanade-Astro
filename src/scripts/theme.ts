// 获取当前主题，优先读取 localStorage，否则跟随系统
function getInitialTheme(): 'light' | 'dark' {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
        return stored;
    }
    // 跟随系统偏好
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// 应用主题到 DOM
function applyTheme(theme: 'light' | 'dark') {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// 初始化主题（页面加载时调用）
function initTheme() {
    const theme = getInitialTheme();
    applyTheme(theme);
    return theme;
}

// 切换主题
function toggleTheme(): 'light' | 'dark' {
    const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    return newTheme;
}

// 获取当前主题状态
function getCurrentTheme(): 'light' | 'dark' {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export { initTheme, toggleTheme, getCurrentTheme, applyTheme };