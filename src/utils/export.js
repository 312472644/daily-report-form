import dayjs from 'dayjs';

/**
 * 导出日报为Markdown文件
 * @param {Array} reports
 */
export const exportToMarkdown = reports => {
  let md = '';
  reports.sort((a, b) => new Date(b.date) - new Date(a.date));

  reports.forEach(report => {
    md += `# ${report.date} 工作日报\n\n`;

    const projects = {};
    report.items.forEach(item => {
      if (!projects[item.project]) {
        projects[item.project] = {};
      }
      if (!projects[item.project][item.type]) {
        projects[item.project][item.type] = [];
      }
      let content = `- ${item.content}`;
      if (item.module) {
        content += ` (${item.module})`;
      }
      projects[item.project][item.type].push(content);
    });

    Object.keys(projects).forEach(project => {
      md += `## ${project}\n\n`;
      Object.keys(projects[project]).forEach(type => {
        md += `### ${type}\n`;
        projects[project][type].forEach(line => {
          md += `${line}\n`;
        });
        md += '\n';
      });
    });

    md += '---\n\n';
  });

  downloadFile(md, `日报_${dayjs().format('YYYY-MM-DD')}.md`, 'text/markdown');
};

/**
 * 导出日报为CSV文件
 * @param {Array} reports
 */
export const exportToCSV = reports => {
  let csv = '日期,项目名称,模块名称,工作类型,工作内容\n';
  reports.sort((a, b) => new Date(b.date) - new Date(a.date));

  reports.forEach(report => {
    report.items.forEach(item => {
      const content = `"${item.content.replace(/"/g, '""')}"`;
      csv += `${report.date},"${item.project}","${item.module || ''}","${item.type}",${content}\n`;
    });
  });

  downloadFile(csv, `日报_${dayjs().format('YYYY-MM-DD')}.csv`, 'text/csv');
};

/**
 * 下载文件
 * @param {string} content 文件内容字符串
 * @param {string} filename 文件名包含扩展名
 * @param {string} type mimetype 文件类型
 */
const downloadFile = (content, filename, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
