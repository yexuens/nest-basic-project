export function generateKey(pattern: string, args: any[]): string {
  if (!pattern.includes('#')) return pattern;

  // 简单的正则替换 #0, #1 等
  return pattern.replace(/#(\d+)/g, (_, index) => {
    return args[parseInt(index)]?.toString() || '';
  });
}