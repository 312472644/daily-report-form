export const projectOptions = [
  { value: '合同与计价系统', label: '合同与计价系统' },
  { value: '安全穿透式系统', label: '安全穿透式系统' },
  { value: '项目经济运行系统', label: '项目经济运行系统' },
  { value: '路基智能施工协管平台', label: '路基智能施工协管平台' },
  { value: '其他', label: '其他' },
];

export const workTypeOptions = [
  { value: '功能开发', label: '功能开发' },
  { value: 'Bug修复', label: 'Bug修复' },
  { value: '重构代码', label: '重构代码' },
  { value: '性能优化', label: '性能优化' },
  { value: '文档更新', label: '文档更新' },
  { value: '其他', label: '其他' },
];

export const workTypeTagMap = {
  功能开发: {
    tagType: 'info',
  },
  Bug修复: {
    tagType: 'error',
  },
  重构代码: {
    tagType: 'primary',
  },
  性能优化: {
    tagType: 'default',
  },
  文档更新: {
    tagType: 'success',
  },
  其他: {
    tagType: 'warning',
  },
};
