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
        { id: 'quick-start', title: '快速入门', content: '软件安装与登录、首次配置、开始使用' },
        { id: 'auth', title: '授权管理', content: '权限体系、员工授权流程' },
        { id: 'billing', title: '记账功能', content: '自动记账设置、多群账本管理、账单导出' },
        { id: 'group-manage', title: '群聊管理', content: '群类型说明、群发功能、群设置' },
        { id: 'commands', title: '指令系统', content: '核心指令、查询统计指令、标准化回复' },
        { id: 'card-manage', title: '卡密管理', content: '卡密记账规则、汇率计算、专属管控' },
        { id: 'statistics', title: '数据统计', content: '核心指标、图表分析、报表导出' },
        { id: 'safety', title: '防封设置', content: '协议切换、安全建议' },
        { id: 'advanced', title: '高级技巧', content: '快捷指令、通知与提醒' },
        { id: 'faq', title: '常见问题', content: '登录失败、更换设备、数据恢复、收不到消息、联系客服' },
        { id: 'troubleshooting', title: '故障排除', content: '错误代码、日志查看' },
        { id: 'changelog', title: '更新日志', content: '版本更新历史、新增功能、优化改进、bug修复' }
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

    // TOC 高亮
    function initTocHighlighter() {
        var tocLinks = document.querySelectorAll('.toc-link');
        if (tocLinks.length === 0) return;

        var sections = MANUAL_SECTIONS.map(function (s) { return document.getElementById(s.id); }).filter(Boolean);

        window.addEventListener('scroll', function () {
            var scrollPos = window.scrollY + 150;

            sections.forEach(function (section) {
                if (!section) return;
                var top = section.offsetTop;
                var height = section.offsetHeight;
                var id = section.getAttribute('id');

                if (scrollPos >= top && scrollPos < top + height) {
                    tocLinks.forEach(function (link) {
                        link.classList.remove('active');
                        if (link.getAttribute('data-section') === id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });

        tocLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                var targetId = this.getAttribute('href').substring(1);
                var targetSection = document.getElementById(targetId);
                if (targetSection) {
                    var offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
                var sidebar = document.getElementById('tocSidebar');
                var overlay = document.getElementById('tocOverlay');
                if (sidebar) sidebar.classList.remove('open');
                if (overlay) overlay.classList.remove('open');
            });
        });

        var navLinks = document.querySelectorAll('.nav-link, .inline-flex[href^="#"]');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                var href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    var targetId = href.substring(1);
                    var targetSection = document.getElementById(targetId);
                    if (targetSection) {
                        var offsetTop = targetSection.offsetTop - 80;
                        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
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
            window.scrollTo({ top: section.offsetTop - 80, behavior: 'smooth' });
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
