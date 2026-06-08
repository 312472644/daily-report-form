import dayjs from 'dayjs';

/**
 * 解析Markdown格式的日报文件
 * @param {string} content Markdown文件内容
 * @returns {Array} 日报数据数组
 */
export const parseMarkdown = content => {
  const reports = [];
  const sections = content.split('---\n');

  sections.forEach(section => {
    if (!section.trim()) return;

    const lines = section.trim().split('\n');
    if (lines.length === 0) return;

    const dateMatch = lines[0].match(/^# (\d{4}-\d{2}-\d{2})(.*)?/);
    if (!dateMatch) return;

    const date = dateMatch[1];

    if (!dayjs(date, 'YYYY-MM-DD').isValid()) {
      return;
    }

    const report = {
      date,
      items: [],
    };

    let currentProject = '';
    let currentType = '';

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) continue;

      const projectMatch = line.match(/^## (.+)/);
      if (projectMatch) {
        currentProject = projectMatch[1];
        continue;
      }

      const typeMatch = line.match(/^### (.+)/);
      if (typeMatch) {
        currentType = typeMatch[1];
        continue;
      }

      const contentMatch = line.match(/^- (.+)/);
      if (contentMatch) {
        let itemContent = contentMatch[1];
        let module = '';

        const moduleMatch = itemContent.match(/\(([^)]+)\)$/);
        if (moduleMatch) {
          module = moduleMatch[1];
          itemContent = itemContent.replace(/\([^)]+\)$/, '').trim();
        }

        if (currentProject && currentType && itemContent) {
          report.items.push({
            project: currentProject,
            type: currentType,
            module,
            content: itemContent,
          });
        }
      }
    }

    if (report.items.length > 0) {
      reports.push(report);
    }
  });

  return reports;
};

/**
 * 解析CSV格式的日报文件
 * @param {string} content CSV文件内容
 * @returns {Array} 日报数据数组
 */
export const parseCSV = content => {
  const reports = [];

  // 移除BOM头（如果存在）
  if (content.charCodeAt(0) === 0xfeff) {
    content = content.slice(1);
  }

  // 正确解析CSV，处理字段内的换行符
  const parsedLines = parseCSVWithMultiline(content);

  if (parsedLines.length < 2) return reports;

  const header = parsedLines[0].map(p => p.trim());
  if (!header.includes('日期') || !header.includes('项目名称')) {
    throw new Error('CSV文件格式不正确，缺少必要的列');
  }

  // 查找列索引
  const dateIndex = header.indexOf('日期');
  const projectIndex = header.indexOf('项目名称');
  const moduleIndex = header.indexOf('模块名称');
  const typeIndex = header.indexOf('工作类型');
  const contentIndex = header.indexOf('工作内容');

  const dateMap = {};

  for (let i = 1; i < parsedLines.length; i++) {
    const parts = parsedLines[i];

    const date = parts[dateIndex]?.trim();

    // 跳过无效日期
    if (!date || !dayjs(date, 'YYYY-MM-DD').isValid()) {
      continue;
    }

    if (!dateMap[date]) {
      dateMap[date] = {
        date,
        items: [],
      };
    }

    dateMap[date].items.push({
      project: parts[projectIndex]?.trim() || '',
      module: moduleIndex >= 0 ? parts[moduleIndex]?.trim() || '' : '',
      type: typeIndex >= 0 ? parts[typeIndex]?.trim() || '' : '',
      content: contentIndex >= 0 ? parts[contentIndex]?.trim() || '' : '',
    });
  }

  Object.keys(dateMap).forEach(date => {
    if (dateMap[date].items.length > 0) {
      reports.push(dateMap[date]);
    }
  });

  return reports;
};

/**
 * 解析CSV内容，正确处理字段内的换行符
 * @param {string} content CSV文件内容
 * @returns {Array} 二维数组，每行为一个记录，每个元素为字段值
 */
const parseCSVWithMultiline = content => {
  const result = [];
  const lines = content.split(/\r\n|\r|\n/);
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let j = 0;

    while (j < line.length) {
      const char = line[j];

      if (char === '"') {
        if (inQuotes && line[j + 1] === '"') {
          // 双引号转义
          currentField += '"';
          j += 2;
        } else {
          // 切换引号状态
          inQuotes = !inQuotes;
          j++;
        }
      } else if (char === ',' && !inQuotes) {
        // 字段分隔符
        currentRow.push(currentField);
        currentField = '';
        j++;
      } else {
        currentField += char;
        j++;
      }
    }

    // 如果不在引号中，表示当前行结束
    if (!inQuotes) {
      currentRow.push(currentField);
      result.push(currentRow);
      currentRow = [];
      currentField = '';
    } else {
      // 在引号中，表示字段跨行，添加换行符
      currentField += '\n';
    }
  }

  return result;
};

/**
 * 检测文件格式
 * @param {string} content 文件内容
 * @returns {string} 'markdown' | 'csv' | null
 */
export const detectFormat = content => {
  if (content.startsWith('# ') && content.includes('## ') && content.includes('---')) {
    return 'markdown';
  }
  if (content.startsWith('日期,') || (content.includes('项目名称') && content.includes(','))) {
    return 'csv';
  }
  return null;
};

/**
 * 导入日报数据
 * @param {string} content 文件内容
 * @param {string} format 文件格式 'markdown' | 'csv'
 * @returns {Object} { success: boolean, message: string, count: number }
 */
export const importReports = (content, format) => {
  try {
    let reports;

    if (format === 'markdown') {
      reports = parseMarkdown(content);
    } else if (format === 'csv') {
      reports = parseCSV(content);
    } else {
      throw new Error('不支持的文件格式');
    }

    if (reports.length === 0) {
      return {
        success: false,
        message: '未解析到有效的日报数据',
        count: 0,
      };
    }

    return {
      success: true,
      message: `成功解析到 ${reports.length} 条日报数据`,
      count: reports.length,
      data: reports,
    };
  } catch (error) {
    return {
      success: false,
      message: `解析失败：${error.message}`,
      count: 0,
    };
  }
};
