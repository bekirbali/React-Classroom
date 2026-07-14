import { useState } from "react";
import { motion } from "framer-motion";

const About = () => {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  // Text analysis logic
  const textTrimmed = text.trim();
  const words = textTrimmed === "" ? [] : textTrimmed.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;
  const charCountWithSpaces = text.length;
  const charCountWithoutSpaces = text.replace(/\s/g, "").length;
  
  // Sentences count: split by . ! ?
  const sentences = textTrimmed === "" ? [] : textTrimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = sentences.length;
  
  // Paragraph count: split by double newlines or single newlines
  const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0).length;

  // Average word length
  let avgWordLength = 0;
  if (wordCount > 0) {
    const totalWordChars = words.reduce((acc, word) => acc + word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").length, 0);
    avgWordLength = parseFloat((totalWordChars / wordCount).toFixed(1));
  }

  // Longest word
  let longestWord = "";
  if (words.length > 0) {
    longestWord = words.reduce((longest, current) => {
      const cleanCurrent = current.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
      const cleanLongest = longest.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
      return cleanCurrent.length > cleanLongest.length ? current : longest;
    }, "");
    longestWord = longestWord.replace(/^[.,/#!$%^&*;:{}=\-_`~()]+|[.,/#!$%^&*;:{}=\-_`~()]+$/g, "");
  }

  // Readability
  let readability = "-";
  if (wordCount > 0) {
    if (avgWordLength < 5.0) readability = "Kolay / Akıcı";
    else if (avgWordLength < 6.0) readability = "Orta Seviye";
    else readability = "İleri / Akademik";
  }

  // Reading time
  const getReadingTime = (words) => {
    if (words === 0) return "0 sn";
    const wordsPerMinute = 200;
    const minutes = words / wordsPerMinute;
    if (minutes < 1) {
      const seconds = Math.ceil(minutes * 60);
      return `${seconds} sn`;
    }
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return secs > 0 ? `${mins} dk ${secs} sn` : `${mins} dk`;
  };
  const readingTime = getReadingTime(wordCount);

  // Actions
  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleClear = () => {
    setText("");
  };

  const handleInsertSample = () => {
    setText(
      "Eğitim, bir bireyin yeteneklerini, becerilerini ve değerlerini geliştirme sürecidir. Modern dünyada sınıf ortamları, teknolojinin entegrasyonuyla birlikte büyük bir dönüşüm geçirmektedir. Classroom platformu, bu dönüşümün bir parçası olarak öğretmenler ve öğrenciler arasındaki iletişimi güçlendirmeyi, dosya paylaşımını kolaylaştırmayı ve eğitim süreçlerini daha verimli hale getirmeyi amaçlar. Bu deneysel laboratuvar sayfasında, eğitim materyallerinizi analiz etmenize yardımcı olacak yeni ve yenilikçi araçları geliştirmeye devam edeceğiz!"
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header Section */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 border border-blue-200/50 mb-4 tracking-wide uppercase">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          Classroom Labs
        </span>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-4">
          Deneysel{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            Oyun Alanı
          </span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Eğitim deneyiminizi zenginleştirmek için tasarladığımız deneysel araçları,
          yardımcı widget'ları ve yeni özellikleri burada keşfedebilir ve test edebilirsiniz.
        </p>
      </motion.div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle Columns: The Active Tool (Word Counter) */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/40 p-6 md:p-8 relative overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-blue-50/50 to-transparent rounded-full -mr-20 -mt-20 -z-10 pointer-events-none"></div>

            {/* Tool Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">📝</span>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Gelişmiş Metin Analizör
                  </h2>
                </div>
                <p className="text-sm text-gray-500">
                  Girdiğiniz metni kelime, karakter, cümle ve okunabilirlik düzeyine göre analiz eder.
                </p>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100">
                Deney #01
              </span>
            </div>

            {/* Textarea Area */}
            <div className="relative mb-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Analiz etmek istediğiniz metni buraya yazın veya yapıştırın..."
                className="w-full h-64 p-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-gray-700 placeholder-gray-400 font-sans leading-relaxed text-base shadow-sm"
              />
              {text.length === 0 && (
                <div className="absolute bottom-4 right-4 pointer-events-none text-xs text-gray-400">
                  Boş metin
                </div>
              )}
            </div>

            {/* Toolbar / Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
              <div className="flex gap-2">
                <button
                  onClick={handleInsertSample}
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors duration-150 flex items-center gap-1.5"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Örnek Metin
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleClear}
                  disabled={!text}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 flex items-center gap-1.5 ${
                    text
                      ? "text-red-600 bg-red-50 hover:bg-red-100"
                      : "text-gray-400 bg-gray-50 cursor-not-allowed"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Temizle
                </button>

                <button
                  onClick={handleCopy}
                  disabled={!text}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-1.5 ${
                    text
                      ? copied
                        ? "text-green-600 bg-green-50 border border-green-200"
                        : "text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10"
                      : "text-gray-400 bg-gray-100 cursor-not-allowed"
                  }`}
                >
                  {copied ? (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Kopyalandı!
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                      Kopyala
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Word Count Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Kelime
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-black text-gray-800">
                  {wordCount}
                </span>
              </div>
            </div>

            {/* Character Count Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Karakter
              </span>
              <div className="mt-2">
                <div className="text-3xl font-black text-gray-800">
                  {charCountWithSpaces}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Boşluksuz: {charCountWithoutSpaces}
                </div>
              </div>
            </div>

            {/* Sentence Count Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Cümle
              </span>
              <div className="mt-2">
                <span className="text-3xl font-black text-gray-800">
                  {sentenceCount}
                </span>
                <div className="text-xs text-gray-400 mt-0.5">
                  Paragraf: {paragraphs}
                </div>
              </div>
            </div>

            {/* Reading Time Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Okuma Süresi
              </span>
              <div className="mt-2">
                <span className="text-2xl font-black text-indigo-700">
                  {readingTime}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Statistics and Insights */}
          {wordCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 border border-gray-100 rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase">
                  Ort. Kelime Uzunluğu
                </span>
                <p className="text-xl font-bold text-gray-700 mt-1">
                  {avgWordLength} <span className="text-xs text-gray-400 font-normal">karakter</span>
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase">
                  En Uzun Kelime
                </span>
                <p
                  className="text-sm font-bold text-gray-700 mt-1 truncate"
                  title={longestWord}
                >
                  {longestWord || "-"}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase">
                  Okunabilirlik Seviyesi
                </span>
                <p className="text-base font-bold text-indigo-600 mt-1">
                  {readability}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Right Column: Lab Info & Future Experiments */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {/* Lab Purpose Info */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <span>🧪</span> Lab Misyonumuz
            </h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              Classroom Lab, ana projenin kararlılığını etkilemeden yeni
              teknolojileri, kullanışlı araçları ve arayüz fikirlerini hızlıca test
              edebilmemiz için oluşturulmuş deneysel bir alandır. Buradaki araçlar
              kullanıcı geri bildirimlerine göre ana platforma entegre edilmektedir.
            </p>
          </div>

          {/* Future Experiments Dashboard */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Planlanan Deneyler
            </h3>
            <div className="space-y-4">
              {/* Future Exp 1 */}
              <div className="p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 opacity-70">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-gray-700">
                    🤖 Ders Notu Özetleyici (AI)
                  </span>
                  <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-gray-200 text-gray-600">
                    Ar-Ge
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Uzun ders notlarını ve PDF'leri saniyeler içinde yapay zeka ile
                  özetleyen ve önemli noktaları çıkaran modül.
                </p>
              </div>

              {/* Future Exp 2 */}
              <div className="p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 opacity-70">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-gray-700">
                    ❓ Soru Üretim Sihirbazı
                  </span>
                  <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-gray-200 text-gray-600">
                    Konsept
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Konu başlıklarına göre otomatik olarak çoktan seçmeli veya klasik
                  soru havuzu hazırlayan test aracı.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
