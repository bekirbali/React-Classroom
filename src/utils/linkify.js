// URL'leri tespit eden regex pattern
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

/**
 * Metindeki URL'leri otomatik olarak tıklanılabilir linkler haline getirir
 * @param {string} text - İşlenecek metin
 * @returns {JSX.Element} - Linkleştirilmiş içerik
 */
export const linkify = (text) => {
  if (!text) return text;

  const parts = text.split(URL_REGEX);

  return parts.map((part, index) => {
    if (URL_REGEX.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline break-all"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

/**
 * Daha kapsamlı URL tespiti için gelişmiş regex
 * www. ile başlayan URL'leri de yakalar
 */
const ADVANCED_URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;

/**
 * Gelişmiş linkleştirme fonksiyonu
 * www. ile başlayan URL'leri de tespit eder ve http:// ekler
 * @param {string} text - İşlenecek metin
 * @returns {JSX.Element} - Linkleştirilmiş içerik
 */
export const linkifyAdvanced = (text) => {
  if (!text) return text;

  const parts = text.split(ADVANCED_URL_REGEX);

  return parts.map((part, index) => {
    if (ADVANCED_URL_REGEX.test(part)) {
      // www. ile başlıyorsa http:// ekle
      const href = part.startsWith("www.") ? `http://${part}` : part;

      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline break-all"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

/**
 * Email adreslerini de tespit eden kapsamlı linkleştirme
 */
const EMAIL_REGEX = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
const COMPREHENSIVE_REGEX =
  /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

/**
 * URL'ler ve email adreslerini tespit eden kapsamlı linkleştirme
 * @param {string} text - İşlenecek metin
 * @returns {JSX.Element} - Linkleştirilmiş içerik
 */
export const linkifyComprehensive = (text) => {
  if (!text) return text;

  const parts = text.split(COMPREHENSIVE_REGEX);

  return parts.map((part, index) => {
    if (EMAIL_REGEX.test(part)) {
      // Email adresi
      return (
        <a
          key={index}
          href={`mailto:${part}`}
          className="text-blue-600 hover:text-blue-800 underline break-all"
        >
          {part}
        </a>
      );
    } else if (ADVANCED_URL_REGEX.test(part)) {
      // URL
      const href = part.startsWith("www.") ? `http://${part}` : part;

      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline break-all"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};
