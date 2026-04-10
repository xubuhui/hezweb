/**
 * HEZ 在线手册 - 登录验证与内容控制
 */

(function () {
    'use strict';

    const ACCOUNTS = [
        { account: 'hez2024', password: 'hez@manual' },
        { account: 'admin',   password: 'admin123'  },
    ];

    const SESSION_KEY = 'hez_manual_auth';

    const MANUAL_SECTIONS = [
        { id: 'overview', title: '系统概述', content: '微信账号管理、群聊记账、群聊分组、自动回复、群组群发、员工记录、数据统计、卡密分析' },
        { id: 'requirements', title: '系统要求', content: 'Windows 10/11、微信版本4.1.8、Python 3.12+' },
        { id: 'quick-start', title: '安装与登录', content: 'web_app.exe、打包版、双击运行、登录页面、用户名、密码' },
        { id: 'account-manage', title: '账号管理', content: '微信账号、启动微信、停止微信、刷新状态、管理员授权、/管理员' },
        { id: 'group-category', title: '群聊分组', content: '收卡群、出卡群、内部群、新建分组、添加群聊、同步群名' },
        { id: 'auto-reply', title: '自动回复', content: '关键词、正则表达式、触发类型、匹配方式、回复类型、冷却时间' },
        { id: 'group-manage', title: '群组群发', content: '新建群发、选择目标群聊、发送间隔、发送进度' },
        { id: 'commands', title: '群聊命令', content: '/开启、/关闭、/统计、/显示、/撤回、/清账、/管理员' },
        { id: 'billing', title: '记账格式', content: '简单格式、带备注、卡密交易、面值、汇率、表达式计算' },
        { id: 'statistics', title: '数据统计', content: '统计卡片、收入、支出、利润、活跃群数、交易笔数、卡密交易' },
        { id: 'card-manage', title: '卡密分析', content: '盈利状态、盈利总额、亏损总额、净利润' },
        { id: 'safety', title: '防封设置', content: '标准模式、推荐配置、安全建议、稳定模式' },
        { id: 'faq', title: '常见问题', content: '登录失败、授权到期、微信无法启动、微信掉线、数据存储、数据备份' },
        { id: 'changelog', title: '更新日志', content: '版本更新历史、新增功能、v2.1.0、v2.2.0、v2.2.1' }
    ];

    // 页面初始化
    document.addEventListener('DOMContentLoaded', function () {
        if (isAuthenticated()) {
            showContent();
        } else {
            showLogin();
        }

        var passwordInput = document.getElementById('loginPassword');
        if (passwordInput) {
            passwordInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    handleLogin();
                }
            });
        }
    });

    // 验证逻辑
    function isAuthenticated() {
        return sessionStorage.getItem(SESSION_KEY) === 'true';
    }

    function verify(account, password) {
        return ACCOUNTS.some(function (item) {
            return item.account === account && item.password === password;
        });
    }

    // 界面控制
    function showLogin() {
        var overlay = document.getElementById('loginOverlay');
        var content = document.getElementById('manualContent');
        if (overlay) overlay.style.display = 'flex';
        if (content) content.classList.remove('is-visible');
    }

    function showContent() {
        var overlay = document.getElementById('loginOverlay');
        var content = document.getElementById('manualContent');
        if (overlay) overlay.style.display = 'none';
        if (content) content.classList.add('is-visible');

        if (typeof AOS !== 'undefined') {
            AOS.init({ once: true, duration: 800 });
        }

        initManualFeatures();
    }

    // 手册功能初始化
    function initManualFeatures() {
        initProgressBar();
        initBackToTop();
        initTocHighlighter();
        initSearch();
        initKeyboardShortcuts();
    }

    // 阅读进度条
    function initProgressBar() {
        var progressBar = document.getElementById('progressBar');
        if (!progressBar) return;

        window.addEventListener('scroll', function () {
            var scrollTop = window.scrollY || document.documentElement.scrollTop;
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            var progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = progress + '%';
        });
    }

    // 返回顶部
    function initBackToTop() {
        var backToTop = document.getElementById('backToTop');
        if (!backToTop) return;

        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
    }

    window.scrollToTop = function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // TOC 高亮和跳转
    function initTocHighlighter() {
        var tocLinks = document.querySelectorAll('.toc-link');
        if (tocLinks.length === 0) return;

        // 侧边栏链接点击
        tocLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                var targetId = this.getAttribute('href').substring(1);
                var targetSection = document.getElementById(targetId);
                if (targetSection) {
                    var rect = targetSection.getBoundingClientRect();
                    var targetPosition = rect.top + window.scrollY - 80;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
                var sidebar = document.getElementById('tocSidebar');
                var overlay = document.getElementById('tocOverlay');
                if (sidebar) sidebar.classList.remove('open');
                if (overlay) overlay.classList.remove('open');
            });
        });

        // 滚动时高亮当前章节
        window.addEventListener('scroll', function () {
            var scrollPos = window.scrollY + 200;
            var currentId = null;

            tocLinks.forEach(function(link) {
                var sectionId = link.getAttribute('data-section');
                var section = document.getElementById(sectionId);
                if (section) {
                    var rect = section.getBoundingClientRect();
                    var top = rect.top + window.scrollY;
                    var height = section.offsetHeight;
                    if (scrollPos >= top && scrollPos < top + height) {
                        currentId = sectionId;
                    }
                }
            });

            tocLinks.forEach(function(link) {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === currentId) {
                    link.classList.add('active');
                }
            });
        });

        // 其他导航链接
        var navLinks = document.querySelectorAll('.nav-link, a[href^="#"]:not(.toc-link)');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                var href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    var targetId = href.substring(1);
                    var targetSection = document.getElementById(targetId);
                    if (targetSection) {
                        var rect = targetSection.getBoundingClientRect();
                        var targetPosition = rect.top + window.scrollY - 80;
                        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    }
                }
            });
        });
    }

    // 移动端TOC开关
    window.toggleToc = function () {
        var sidebar = document.getElementById('tocSidebar');
        var overlay = document.getElementById('tocOverlay');
        if (sidebar) sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('open');
    };

    // 搜索功能
    function initSearch() {
        var searchInput = document.getElementById('searchInput');
        var searchResults = document.getElementById('searchResults');
        if (!searchInput || !searchResults) return;

        searchInput.addEventListener('input', function () {
            var query = this.value.trim().toLowerCase();
            if (query.length < 2) {
                searchResults.classList.remove('active');
                return;
            }

            var results = MANUAL_SECTIONS.filter(function (section) {
                return section.title.toLowerCase().includes(query) || 
                       section.content.toLowerCase().includes(query);
            });

            if (results.length === 0) {
                searchResults.innerHTML = '<div class="search-no-results">未找到相关内容</div>';
            } else {
                searchResults.innerHTML = results.map(function (section) {
                    return '<div class="search-result-item" onclick="scrollToSection(\'' + section.id + '\')">' +
                        '<div class="search-result-title">' + highlightText(section.title, query) + '</div>' +
                        '<div class="search-result-preview">' + highlightText(section.content, query) + '</div>' +
                        '</div>';
                }).join('');
            }

            searchResults.classList.add('active');
        });

        document.addEventListener('click', function (e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.remove('active');
            }
        });
    }

    window.scrollToSection = function (id) {
        var section = document.getElementById(id);
        if (section) {
            var rect = section.getBoundingClientRect();
            var targetPosition = rect.top + window.scrollY - 80;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
        var searchResults = document.getElementById('searchResults');
        var searchInput = document.getElementById('searchInput');
        if (searchResults) searchResults.classList.remove('active');
        if (searchInput) searchInput.value = '';
    };

    function highlightText(text, query) {
        var regex = new RegExp('(' + query + ')', 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }

    // 键盘快捷键
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', function (e) {
            // 搜索: /
            if (e.key === '/' && !isInputFocused()) {
                e.preventDefault();
                var searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }

            // 返回顶部: Home
            if (e.key === 'Home') {
                e.preventDefault();
                window.scrollToTop();
            }

            // ESC: 关闭搜索
            if (e.key === 'Escape') {
                var searchResults = document.getElementById('searchResults');
                if (searchResults) searchResults.classList.remove('active');
                
                var tocSidebar = document.getElementById('tocSidebar');
                var tocOverlay = document.getElementById('tocOverlay');
                if (tocSidebar) tocSidebar.classList.remove('open');
                if (tocOverlay) tocOverlay.classList.remove('open');
            }
        });
    }

    function isInputFocused() {
        var tag = document.activeElement.tagName.toLowerCase();
        return tag === 'input' || tag === 'textarea';
    }

    // 代码复制
    window.copyCode = function (btn) {
        var codeBlock = btn.closest('.code-block');
        var code = codeBlock.querySelector('code');
        var text = code.textContent || code.innerText;

        navigator.clipboard.writeText(text).then(function () {
            btn.classList.add('copied');
            btn.innerHTML = '<i class="fa-solid fa-check"></i> 已复制';
            
            setTimeout(function () {
                btn.classList.remove('copied');
                btn.innerHTML = '<i class="fa-regular fa-copy"></i> 复制';
            }, 2000);
        }).catch(function () {
            var textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            btn.classList.add('copied');
            btn.innerHTML = '<i class="fa-solid fa-check"></i> 已复制';
            
            setTimeout(function () {
                btn.classList.remove('copied');
                btn.innerHTML = '<i class="fa-regular fa-copy"></i> 复制';
            }, 2000);
        });
    };

    // FAQ 折叠
    window.toggleFaq = function (el) {
        var faqItem = el.closest('.faq-item');
        if (faqItem) {
            faqItem.classList.toggle('open');
        }
    };

    // 暴露全局函数
    window.handleLogin = function () {
        var accountInput = document.getElementById('loginAccount');
        var passwordInput = document.getElementById('loginPassword');
        var errorBox = document.getElementById('loginError');
        var loginBtn = document.getElementById('loginBtn');

        var account = accountInput ? accountInput.value.trim() : '';
        var password = passwordInput ? passwordInput.value.trim() : '';

        if (!account || !password) {
            showError(errorBox, '请输入账号和密码');
            return;
        }

        if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>验证中...';
        }

        setTimeout(function () {
            if (verify(account, password)) {
                sessionStorage.setItem(SESSION_KEY, 'true');
                showContent();
            } else {
                showError(errorBox, '账号或密码错误，请重试');
                if (passwordInput) passwordInput.value = '';
                if (passwordInput) passwordInput.focus();
            }

            if (loginBtn) {
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket mr-2"></i>登 录';
            }
        }, 600);
    };

    window.handleLogout = function () {
        sessionStorage.removeItem(SESSION_KEY);
        showLogin();

        var accountInput = document.getElementById('loginAccount');
        var passwordInput = document.getElementById('loginPassword');
        if (accountInput) accountInput.value = '';
        if (passwordInput) passwordInput.value = '';

        var errorBox = document.getElementById('loginError');
        if (errorBox) errorBox.style.display = 'none';
    };

    function showError(box, message) {
        if (!box) return;
        var span = box.querySelector('span');
        if (span) span.textContent = message;
        box.style.display = 'block';

        setTimeout(function () {
            box.style.display = 'none';
        }, 3000);
    }
})();
