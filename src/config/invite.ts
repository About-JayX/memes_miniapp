export const inviteUrl = (code: string) =>
  `https://t.me/${import.meta.env.VITE_BOOTNAME}?startapp=code_${code}`
