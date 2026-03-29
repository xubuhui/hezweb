// Tailwind 配置
tailwind.config = {
    theme: {
        extend: {
            colors: {
                dark: '#0a0a0f',
                surface: '#12121a',
                card: '#1a1a24',
                primary: '#6366f1',
                accent: '#22d3ee',
                success: '#10b981',
                glow: '#818cf8',
            },
            fontFamily: {
                sans: ['Noto Sans SC', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
                'slide-up': 'slide-up 0.5s ease-out',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'glow-pulse': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)' },
                },
                'slide-up': {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    }
}