/**
 * 文字列を指定された長さで切り詰めるユーティリティ関数
 * @param str 処理対象の文字列
 * @param maxLength 最大文字数（省略時は100文字）
 * @param ellipsis 省略記号（デフォルト: "..."）
 * @returns 切り詰められた文字列
 */
export const truncate = (str: string, maxLength = 100, ellipsis = '...'): string => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - ellipsis.length) + ellipsis;
};

/**
 * 文字列がメールアドレスとして有効かどうかを検証する
 * @param email 検証するメールアドレス
 * @returns 有効なメールアドレスの場合はtrue、それ以外はfalse
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 文字列がURLとして有効かどうかを検証する
 * @param url 検証するURL
 * @returns 有効なURLの場合はtrue、それ以外はfalse
 */
export const isValidUrl = (url: string): boolean => {
  try {
    // URLオブジェクトを作成
    const urlObj = new URL(url);
    
    // プロトコルのバリデーション (http: または https: のみ許可)
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // ホスト名の存在を確認
    if (!urlObj.hostname) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};
