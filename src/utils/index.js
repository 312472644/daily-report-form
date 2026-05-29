/**
 * 检查是否为移动端设备
 * @returns {boolean}
 */
export function isMobile() {
  const ua = navigator.userAgent.toLowerCase();
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);

  const isSmallScreen = window.innerWidth <= 768;

  return isMobileUA || isSmallScreen;
}
