
export const THEMES = {
  MINIMAL: {
    id: 'minimal',
    name: 'Minimal White',
    primary: '#18181b', // slate-900
    bg: '#ffffff',
    card: '#f9fafb',
    border: '#e5e7eb',
    text: '#111827',
    muted: '#6b7280',
    accent: '#6d28d9'
  },
  MODERN: {
    id: 'modern',
    name: 'Modern Ocean',
    primary: '#0f172a',
    bg: '#f8fafc',
    card: '#ffffff',
    border: '#e2e8f0',
    text: '#1e293b',
    muted: '#64748b',
    accent: '#3b82f6'
  },
  DARK_PRO: {
    id: 'dark-pro',
    name: 'Midnight Pro',
    primary: '#6d28d9',
    bg: '#020617',
    card: 'rgba(15, 23, 42, 0.7)',
    border: 'rgba(255, 255, 255, 0.1)',
    text: '#f8fafc',
    muted: '#94a3b8',
    accent: '#8b5cf6'
  },
  VIBRANT: {
    id: 'vibrant',
    name: 'Neon Sunset',
    primary: '#ec4899',
    bg: '#0f172a',
    card: '#1e293b',
    border: 'rgba(236, 72, 153, 0.2)',
    text: '#fdf2f8',
    muted: '#f472b6',
    accent: '#db2777'
  }
};

export const getTheme = (id: string) => {
  const key = id.toUpperCase().replace(/-/g, '_');
  return THEMES[key as keyof typeof THEMES] || THEMES.MODERN;
};

export function generateEmailHtml(data: any, projectName: string, themeId: string, adConfig: any) {
  const theme = getTheme(themeId);
  
  const entries = Object.entries(data);
  let rowsHtml = '';
  
  for (const [key, val] of entries) {
    rowsHtml += '<div style="margin-bottom: 20px; border-bottom: 1px solid ' + theme.border + '; padding-bottom: 10px;">';
    rowsHtml += '<label style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: ' + theme.muted + '; font-weight: 800;">' + key + '</label>';
    rowsHtml += '<p style="margin: 5px 0 0 0; font-size: 16px; color: ' + theme.text + '; font-weight: 500;">' + val + '</p>';
    rowsHtml += '</div>';
  }

  return [
    '<div style="font-family: \'Inter\', sans-serif; background-color: ' + theme.bg + '; padding: 60px 20px; color: ' + theme.text + ';">',
      '<div style="max-width: 600px; margin: 0 auto; background: ' + theme.card + '; border-radius: 32px; padding: 48px; border: 1px solid ' + theme.border + '; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05);">',
        '<div style="margin-bottom: 40px; text-align: center;">',
          '<h1 style="font-size: 24px; font-weight: 900; letter-spacing: -0.02em; margin: 0; text-transform: uppercase; font-style: italic;">',
            'Lead Received: <span style="color: ' + theme.primary + ';">' + projectName + '</span>',
          '</h1>',
        '</div>',
        '<div style="margin-bottom: 48px;">',
          rowsHtml,
        '</div>',
        '<div style="padding: 32px; background: #000; border-radius: 24px; color: #fff; text-align: center;">',
           '<p style="margin: 0 0 8px 0; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; color: #8b5cf6;">Achaia Labs Partner</p>',
           '<h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 800; font-style: italic;">' + adConfig.title + '</h3>',
           '<p style="margin: 0 0 20px 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">' + adConfig.text + '</p>',
           '<a href="' + adConfig.link + '" style="display: inline-block; padding: 12px 32px; background: #fff; color: #000; text-decoration: none; border-radius: 99px; font-weight: 800; font-size: 12px; text-transform: uppercase;">Discover Now</a>',
        '</div>',
        '<div style="margin-top: 48px; text-align: center; border-top: 1px solid ' + theme.border + '; padding-top: 24px;">',
           '<p style="font-size: 10px; font-weight: 700; color: ' + theme.muted + '; text-transform: uppercase; letter-spacing: 0.1em;">',
             'Sent securely via SendMyForm (by Achaia Labs)',
           '</p>',
        '</div>',
      '</div>',
    '</div>'
  ].join('');
}
