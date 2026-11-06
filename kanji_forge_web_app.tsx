import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Flame, 
  BookOpen, 
  Layers, 
  PenTool, 
  Award, 
  Upload, 
  Download, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Volume2, 
  Sparkles, 
  FileSpreadsheet, 
  HelpCircle,
  Eye,
  EyeOff,
  Check,
  RefreshCw,
  Zap
} from 'lucide-react';

// Preset Initial Data (JLPT N5/N4 samples)
const PRESET_KANJI = [
  { id: '1', kanji: '日', onyomi: 'ニチ, ジツ', kunyomi: 'ひ, -び, -か', meaning: 'Sun, Day', jlpt: 'N5', example: '日本 (Nihon) - Japan', mastered: false, reviewCount: 0 },
  { id: '2', kanji: '月', onyomi: 'ゲツ, ガツ', kunyomi: 'つき', meaning: 'Moon, Month', jlpt: 'N5', example: '月曜日 (Getsuyoubi) - Monday', mastered: false, reviewCount: 0 },
  { id: '3', kanji: '木', onyomi: 'ボク, モク', kunyomi: 'き, こ-', meaning: 'Tree, Wood', jlpt: 'N5', example: '大木 (Taiboku) - Large tree', mastered: false, reviewCount: 0 },
  { id: '4', kanji: '水', onyomi: 'スイ', kunyomi: 'みず', meaning: 'Water', jlpt: 'N5', example: '水泳 (Suiei) - Swimming', mastered: false, reviewCount: 0 },
  { id: '5', kanji: '火', onyomi: 'カ', kunyomi: 'ひ, -び, ほ-', meaning: 'Fire', jlpt: 'N5', example: '火山 (Kazan) - Volcano', mastered: false, reviewCount: 0 },
  { id: '6', kanji: '金', onyomi: 'キン, コン', kunyomi: 'かね, かな-', meaning: 'Gold, Money', jlpt: 'N5', example: 'お金 (Okane) - Money', mastered: false, reviewCount: 0 },
  { id: '7', kanji: '土', onyomi: 'ド, ト', kunyomi: 'つち', meaning: 'Soil, Earth, Ground', jlpt: 'N5', example: '土地 (Tochi) - Land', mastered: false, reviewCount: 0 },
  { id: '8', kanji: '人', onyomi: 'ジン, ニン', kunyomi: 'ひと', meaning: 'Person, Human', jlpt: 'N5', example: '日本人 (Nihonjin) - Japanese person', mastered: false, reviewCount: 0 },
  { id: '9', kanji: '大', onyomi: 'ダイ, タイ', kunyomi: 'おお-, おお.きい', meaning: 'Big, Large', jlpt: 'N5', example: '大学 (Daigaku) - University', mastered: false, reviewCount: 0 },
  { id: '10', kanji: '小', onyomi: 'ショウ', kunyomi: 'ちい.さい, こ-', meaning: 'Small, Little', jlpt: 'N5', example: '小学校 (Shougaakkou) - Elementary school', mastered: false, reviewCount: 0 },
  { id: '11', kanji: '山', onyomi: 'サン, セン', kunyomi: 'やま', meaning: 'Mountain', jlpt: 'N5', example: '富士山 (Fujisan) - Mt. Fuji', mastered: false, reviewCount: 0 },
  { id: '12', kanji: '川', onyomi: 'セン', kunyomi: 'かわ', meaning: 'River', jlpt: 'N5', example: 'ナイル川 (Nairu-gawa) - Nile River', mastered: false, reviewCount: 0 },
  { id: '13', kanji: '電', onyomi: 'デン', kunyomi: '', meaning: 'Electricity', jlpt: 'N4', example: '電車 (Densha) - Train', mastered: false, reviewCount: 0 },
  { id: '14', kanji: '雨', onyomi: 'ウ', kunyomi: 'あめ, あま-', meaning: 'Rain', jlpt: 'N5', example: '大雨 (Ooame) - Heavy rain', mastered: false, reviewCount: 0 },
  { id: '15', kanji: '学', onyomi: 'ガク', kunyomi: 'まな.ぶ', meaning: 'Study, Learn', jlpt: 'N5', example: '学生 (Gakusei) - Student', mastered: false, reviewCount: 0 }
];

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('flashcard'); // flashcard, quiz, canvas, vault, import
  
  // Data State
  const [kanjiList, setKanjiList] = useState(() => {
    const saved = localStorage.getItem('kanji_forge_data');
    return saved ? JSON.parse(saved) : PRESET_KANJI;
  });
  
  // Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('kanji_forge_data', JSON.stringify(kanjiList));
  }, [kanjiList]);

  // Global Mastery Stats
  const masteredCount = kanjiList.filter(k => k.mastered).length;
  const totalCount = kanjiList.length;
  const masteryPercentage = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  // Selected Kanji for Practice Canvas or Quick View
  const [selectedCanvasKanji, setSelectedCanvasKanji] = useState(kanjiList[0] || PRESET_KANJI[0]);

  // Handlers for data updates
  const toggleMastery = (id) => {
    setKanjiList(prev => prev.map(k => k.id === id ? { ...k, mastered: !k.mastered } : k));
  };

  const addKanji = (newItem) => {
    const item = { ...newItem, id: Date.now().toString(), mastered: false, reviewCount: 0 };
    setKanjiList(prev => [item, ...prev]);
  };

  const deleteKanji = (id) => {
    setKanjiList(prev => prev.filter(k => k.id !== id));
  };

  const resetAllProgress = () => {
    if (window.confirm("Apakah Anda yakin ingin meriset status hafalan semua Kanji?")) {
      setKanjiList(prev => prev.map(k => ({ ...k, mastered: false, reviewCount: 0 })));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-600 selection:text-white">
      {/* Header Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('flashcard')}>
            <div className="bg-gradient-to-tr from-rose-700 to-amber-600 p-2 rounded-lg shadow-lg shadow-rose-900/30">
              <Flame className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider bg-gradient-to-r from-rose-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                KANJI FORGE
              </h1>
              <p className="text-[10px] text-slate-400 tracking-widest uppercase">漢字鍛冶場 • Hafalan & Practice</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
            <NavButton id="flashcard" label="Flashcards" icon={BookOpen} activeTab={activeTab} setActiveTab={setActiveTab} />
            <NavButton id="quiz" label="Forge Quiz" icon={Zap} activeTab={activeTab} setActiveTab={setActiveTab} />
            <NavButton id="canvas" label="Kanji Canvas" icon={PenTool} activeTab={activeTab} setActiveTab={setActiveTab} />
            <NavButton id="vault" label="Kanji Vault" icon={Layers} activeTab={activeTab} setActiveTab={setActiveTab} />
            <NavButton id="import" label="Import CSV" icon={FileSpreadsheet} activeTab={activeTab} setActiveTab={setActiveTab} />
          </nav>

          {/* Quick Mastery Counter */}
          <div className="flex items-center space-x-3 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <Award className="w-5 h-5 text-amber-500" />
            <div className="text-right">
              <div className="text-xs text-slate-400">Mastery Rate</div>
              <div className="text-sm font-bold text-amber-400">{masteredCount} / {totalCount} ({masteryPercentage}%)</div>
            </div>
          </div>
        </div>

        {/* Mobile Nav Tabs */}
        <div className="md:hidden flex overflow-x-auto border-t border-slate-800/60 bg-slate-900 px-2 py-1 space-x-1 scrollbar-none">
          <NavButton id="flashcard" label="Cards" icon={BookOpen} activeTab={activeTab} setActiveTab={setActiveTab} mobile />
          <NavButton id="quiz" label="Quiz" icon={Zap} activeTab={activeTab} setActiveTab={setActiveTab} mobile />
          <NavButton id="canvas" label="Canvas" icon={PenTool} activeTab={activeTab} setActiveTab={setActiveTab} mobile />
          <NavButton id="vault" label="Vault" icon={Layers} activeTab={activeTab} setActiveTab={setActiveTab} mobile />
          <NavButton id="import" label="Import" icon={FileSpreadsheet} activeTab={activeTab} setActiveTab={setActiveTab} mobile />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {kanjiList.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
            <HelpCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Belum Ada Kanji</h2>
            <p className="text-slate-400 max-w-md mx-auto mb-6">Import file CSV atau muat ulang data preset untuk mulai menghafal Kanji.</p>
            <button 
              onClick={() => setKanjiList(PRESET_KANJI)} 
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition font-medium shadow-lg shadow-rose-900/40"
            >
              Muat Data Preset (N5/N4)
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'flashcard' && (
              <FlashcardMode 
                kanjiList={kanjiList} 
                toggleMastery={toggleMastery}
                onDrawPractice={(kanji) => {
                  setSelectedCanvasKanji(kanji);
                  setActiveTab('canvas');
                }} 
              />
            )}
            {activeTab === 'quiz' && <QuizMode kanjiList={kanjiList} toggleMastery={toggleMastery} />}
            {activeTab === 'canvas' && (
              <CanvasMode 
                kanjiList={kanjiList} 
                selectedKanji={selectedCanvasKanji}
                setSelectedKanji={setSelectedCanvasKanji}
              />
            )}
            {activeTab === 'vault' && (
              <VaultMode 
                kanjiList={kanjiList} 
                toggleMastery={toggleMastery}
                deleteKanji={deleteKanji}
                addKanji={addKanji}
                resetAllProgress={resetAllProgress}
                onSelectPractice={(kanji) => {
                  setSelectedCanvasKanji(kanji);
                  setActiveTab('canvas');
                }}
              />
            )}
            {activeTab === 'import' && (
              <ImportMode 
                setKanjiList={setKanjiList} 
                existingKanji={kanjiList}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-600">
        <p>
          Kanji Forge • Tempat Menggembleng Hafalan Kanji Jepang •{' '}
          <a href="/ai-quiz" className="text-rose-400 hover:text-rose-300">
            AI Quiz Generator
          </a>
        </p>
      </footer>
    </div>
  );
}

// Navigation Tab Button Component
function NavButton({ id, label, icon: Icon, activeTab, setActiveTab, mobile }) {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
      } ${mobile ? 'flex-1 justify-center whitespace-nowrap text-xs py-1.5' : ''}`}
    >
      <Icon className={`${mobile ? 'w-4 h-4' : 'w-4 h-4'}`} />
      <span>{label}</span>
    </button>
  );
}

/* =========================================================================
   1. FLASHCARD MODE
   ========================================================================= */
function FlashcardMode({ kanjiList, toggleMastery, onDrawPractice }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unmastered, mastered

  const filteredList = useMemo(() => {
    if (filter === 'unmastered') return kanjiList.filter(k => !k.mastered);
    if (filter === 'mastered') return kanjiList.filter(k => k.mastered);
    return kanjiList;
  }, [kanjiList, filter]);

  const currentKanji = filteredList[currentIndex] || filteredList[0];

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [filter]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        nextCard();
      } else if (e.code === 'ArrowLeft') {
        prevCard();
      } else if (e.code === 'Digit1') {
        if (currentKanji) toggleMastery(currentKanji.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredList, currentKanji]);

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % (filteredList.length || 1));
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + filteredList.length) % (filteredList.length || 1));
  };

  const playTTS = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!currentKanji) {
    return (
      <div className="text-center py-16 bg-slate-900/40 rounded-xl border border-slate-800">
        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-slate-200">Tidak ada Kanji di filter ini</h3>
        <p className="text-slate-400 text-sm mt-1">Coba ubah filter kategori di atas.</p>
        <button onClick={() => setFilter('all')} className="mt-4 text-rose-400 underline text-sm">Lihat Semua Kanji</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center">
      {/* Controls Header */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition ${filter === 'all' ? 'bg-slate-800 text-rose-400 font-semibold' : 'text-slate-400'}`}
          >
            Semua ({kanjiList.length})
          </button>
          <button 
            onClick={() => setFilter('unmastered')}
            className={`px-3 py-1.5 rounded-lg transition ${filter === 'unmastered' ? 'bg-slate-800 text-amber-400 font-semibold' : 'text-slate-400'}`}
          >
            Belum Hafal ({kanjiList.filter(k=>!k.mastered).length})
          </button>
          <button 
            onClick={() => setFilter('mastered')}
            className={`px-3 py-1.5 rounded-lg transition ${filter === 'mastered' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400'}`}
          >
            Sudah Master ({kanjiList.filter(k=>k.mastered).length})
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Card {currentIndex + 1} of {filteredList.length}
        </div>
      </div>

      {/* 3D Flip Card */}
      <div 
        className="w-full aspect-[4/3] max-w-xl perspective cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Card Front */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-slate-800 hover:border-rose-900/60 rounded-3xl p-8 flex flex-col items-center justify-between shadow-2xl backface-hidden">
            <div className="w-full flex justify-between items-center text-xs text-slate-500 font-mono">
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-md text-amber-400 font-bold border border-slate-700/50">
                {currentKanji.jlpt || 'N/A'}
              </span>
              <span>Klik atau [Tekan Spasi] untuk Balik</span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
              <span className="text-8xl sm:text-9xl font-extrabold bg-gradient-to-b from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent font-serif tracking-widest drop-shadow-md">
                {currentKanji.kanji}
              </span>
            </div>

            <div className="w-full flex justify-between items-center text-slate-400 text-xs">
              <span className="flex items-center gap-1 text-slate-500">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Tap untuk detail
              </span>
              <button 
                onClick={(e) => { e.stopPropagation(); playTTS(currentKanji.kanji); }}
                className="p-2 bg-slate-800/80 hover:bg-slate-700 rounded-full text-slate-300 transition"
                title="Dengarkan Pengucapan"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card Back */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-rose-900/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl backface-hidden rotate-y-180">
            <div>
              <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
                <div className="flex items-baseline space-x-3">
                  <span className="text-4xl font-bold text-rose-400 font-serif">{currentKanji.kanji}</span>
                  <span className="text-xl font-medium text-amber-300">{currentKanji.meaning}</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); playTTS(currentKanji.kanji); }}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs uppercase text-slate-500 font-semibold tracking-wider block">Onyomi (音読み)</span>
                  <p className="text-slate-200 font-medium">{currentKanji.onyomi || '-'}</p>
                </div>
                <div>
                  <span className="text-xs uppercase text-slate-500 font-semibold tracking-wider block">Kunyomi (訓読み)</span>
                  <p className="text-slate-200 font-medium">{currentKanji.kunyomi || '-'}</p>
                </div>
                {currentKanji.example && (
                  <div>
                    <span className="text-xs uppercase text-slate-500 font-semibold tracking-wider block">Contoh / Catatan</span>
                    <p className="text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs leading-relaxed">
                      {currentKanji.example}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-2">
              <button
                onClick={(e) => { e.stopPropagation(); onDrawPractice(currentKanji); }}
                className="flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 bg-amber-950/40 border border-amber-800/60 px-3 py-1.5 rounded-lg transition"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Latih Coretan</span>
              </button>

              <div className="text-xs text-slate-500">
                JLPT: <span className="text-slate-300 font-semibold">{currentKanji.jlpt || 'N/A'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Action Controls */}
      <div className="w-full max-w-xl mt-6 flex items-center justify-between gap-4">
        <button
          onClick={prevCard}
          className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl text-slate-300 transition flex items-center justify-center"
          title="Sebelumnya (Panah Kiri)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => toggleMastery(currentKanji.id)}
          className={`flex-1 py-3 px-6 rounded-2xl font-semibold text-sm flex items-center justify-center space-x-2 transition shadow-lg ${
            currentKanji.mastered
              ? 'bg-emerald-950 border border-emerald-700/80 text-emerald-300 hover:bg-emerald-900'
              : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40'
          }`}
        >
          {currentKanji.mastered ? (
            <>
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Sudah Dikuasai (Mastered)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Tandai Sudah Hafal</span>
            </>
          )}
        </button>

        <button
          onClick={nextCard}
          className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl text-slate-300 transition flex items-center justify-center"
          title="Berikutnya (Panah Kanan)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   2. FORGE TEST / QUIZ MODE
   ========================================================================= */
function QuizMode({ kanjiList, toggleMastery }) {
  const [quizType, setQuizType] = useState('kanjiToMeaning'); // kanjiToMeaning, meaningToKanji
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [totalAnswered, setTotalAnswered] = useState(0);

  // Generate Question
  const generateQuestion = () => {
    if (kanjiList.length < 4) return;
    setIsAnswered(false);
    setSelectedAnswer(null);

    // Select random item
    const randomIndex = Math.floor(Math.random() * kanjiList.length);
    const target = kanjiList[randomIndex];
    setCurrentQuestion(target);

    // Generate 3 wrong options
    const distractors = [];
    while (distractors.length < 3) {
      const rand = kanjiList[Math.floor(Math.random() * kanjiList.length)];
      if (rand.id !== target.id && !distractors.some(d => d.id === rand.id)) {
        distractors.push(rand);
      }
    }

    // Combine & Shuffle
    const allOptions = [target, ...distractors].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  };

  useEffect(() => {
    generateQuestion();
  }, [kanjiList, quizType]);

  const handleSelectOption = (option) => {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);
    setTotalAnswered(prev => prev + 1);

    if (option.id === currentQuestion.id) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      // Auto mark mastered if streak is high or option
    } else {
      setStreak(0);
    }
  };

  if (kanjiList.length < 4) {
    return (
      <div className="text-center py-16 bg-slate-900/50 rounded-xl border border-slate-800">
        <HelpCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold">Minimal 4 Kanji Diperlukan</h3>
        <p className="text-slate-400 text-sm mt-1">Tambahkan lebih banyak kanji di Kanji Vault untuk memulai kuis.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Quiz Header & Mode Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button 
            onClick={() => setQuizType('kanjiToMeaning')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${quizType === 'kanjiToMeaning' ? 'bg-rose-600 text-white' : 'text-slate-400'}`}
          >
            Kanji ➔ Arti
          </button>
          <button 
            onClick={() => setQuizType('meaningToKanji')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${quizType === 'meaningToKanji' ? 'bg-rose-600 text-white' : 'text-slate-400'}`}
          >
            Arti ➔ Kanji
          </button>
        </div>

        {/* Score & Streak */}
        <div className="flex items-center space-x-4 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 block uppercase">Score</span>
            <span className="text-sm font-bold text-amber-400">{score} / {totalAnswered}</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-center flex items-center space-x-1">
            <Flame className={`w-4 h-4 ${streak > 0 ? 'text-rose-500 animate-bounce' : 'text-slate-600'}`} />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Streak</span>
              <span className="text-sm font-bold text-rose-400">{streak}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Question Box */}
      {currentQuestion && (
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 text-center shadow-xl mb-6">
          <span className="text-xs uppercase text-slate-500 tracking-wider font-semibold">
            {quizType === 'kanjiToMeaning' ? 'Pilih Arti Yang Tepat' : 'Pilih Kanji Yang Sesuai'}
          </span>

          <div className="my-6">
            {quizType === 'kanjiToMeaning' ? (
              <span className="text-7xl font-extrabold text-slate-100 font-serif tracking-wider">
                {currentQuestion.kanji}
              </span>
            ) : (
              <div className="space-y-2">
                <span className="text-3xl font-bold text-amber-300 block">
                  {currentQuestion.meaning}
                </span>
                <p className="text-xs text-slate-400 italic">
                  Onyomi: {currentQuestion.onyomi || '-'} | Kunyomi: {currentQuestion.kunyomi || '-'}
                </p>
              </div>
            )}
          </div>

          {/* Multiple Choice Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            {options.map((opt) => {
              let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-rose-900/60 hover:bg-slate-900';
              if (isAnswered) {
                if (opt.id === currentQuestion.id) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-600 text-emerald-200 font-bold';
                } else if (selectedAnswer?.id === opt.id) {
                  btnStyle = 'bg-rose-950/80 border-rose-600 text-rose-200';
                } else {
                  btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isAnswered}
                  className={`p-4 rounded-xl border text-center transition flex flex-col items-center justify-center ${btnStyle}`}
                >
                  <span className="text-lg font-medium">
                    {quizType === 'kanjiToMeaning' ? opt.meaning : opt.kanji}
                  </span>
                  {quizType === 'kanjiToMeaning' && opt.onyomi && (
                    <span className="text-[10px] text-slate-500 mt-0.5">{opt.onyomi}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Next Button Footer */}
          {isAnswered && (
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-left text-xs">
                {selectedAnswer?.id === currentQuestion.id ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-4 h-4" /> Tepat sekali!
                  </span>
                ) : (
                  <span className="text-rose-400 font-semibold flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Jawaban benar: {quizType === 'kanjiToMeaning' ? currentQuestion.meaning : currentQuestion.kanji}
                  </span>
                )}
              </div>
              <button
                onClick={generateQuestion}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition flex items-center space-x-1 shadow-lg shadow-rose-900/40"
              >
                <span>Soal Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   3. KANJI CANVAS PRACTICE MODE
   ========================================================================= */
function CanvasMode({ kanjiList, selectedKanji, setSelectedKanji }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showOutline, setShowOutline] = useState(true);
  const [gridType, setGridType] = useState('rice'); // rice, cross, none
  const [strokeWidth, setStrokeWidth] = useState(12);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    clearCanvas();
  }, [selectedKanji]);

  // Handle Canvas Drawing
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    // Save current frame for undo
    setHistory(prev => [...prev, ctx.getImageData(0, 0, canvas.width, canvas.height)]);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#f43f5e'; // Crimson rose draw color
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
  };

  const undoCanvas = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const lastState = history[history.length - 1];
    ctx.putImageData(lastState, 0, 0);
    setHistory(prev => prev.slice(0, prev.length - 1));
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-6 items-start">
      {/* Kanji Selection Sidebar */}
      <div className="w-full lg:w-64 bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <h3 className="text-xs uppercase text-slate-400 font-semibold mb-3 tracking-wider">Pilih Kanji Latihan</h3>
        <div className="max-h-96 overflow-y-auto space-y-1.5 pr-1">
          {kanjiList.map(k => (
            <button
              key={k.id}
              onClick={() => setSelectedKanji(k)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition ${
                selectedKanji?.id === k.id
                  ? 'bg-rose-950/60 border-rose-600 text-rose-200'
                  : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:bg-slate-900'
              }`}
            >
              <span className="text-2xl font-serif">{k.kanji}</span>
              <div className="text-right">
                <span className="text-xs font-medium block truncate max-w-[100px]">{k.meaning}</span>
                <span className="text-[10px] text-slate-500">{k.jlpt}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center">
        {/* Info Header */}
        <div className="w-full flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <span className="text-rose-400 font-serif text-3xl">{selectedKanji?.kanji}</span>
              <span>({selectedKanji?.meaning})</span>
            </h2>
            <p className="text-xs text-slate-400">
              Onyomi: {selectedKanji?.onyomi || '-'} | Kunyomi: {selectedKanji?.kunyomi || '-'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowOutline(!showOutline)}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center space-x-1 transition ${
                showOutline ? 'bg-amber-950/50 border-amber-700 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
              title="Toggle Panutan Bayangan Kanji"
            >
              {showOutline ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span className="hidden sm:inline">Outline</span>
            </button>
          </div>
        </div>

        {/* Canvas Box */}
        <div className="relative w-80 h-80 sm:w-96 sm:h-96 bg-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
          
          {/* Background Grid Pattern */}
          {gridType === 'rice' && (
            <svg className="absolute inset-0 w-full h-full stroke-slate-800/50" pointerEvents="none">
              <line x1="0" y1="0" x2="100%" y2="100%" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="100%" y1="0" x2="0" y2="100%" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="50%" y1="0" x2="50%" y2="100%" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="0" y1="50%" x2="100%" y2="50%" strokeDasharray="4 4" strokeWidth="1" />
            </svg>
          )}

          {gridType === 'cross' && (
            <svg className="absolute inset-0 w-full h-full stroke-slate-800/50" pointerEvents="none">
              <line x1="50%" y1="0" x2="50%" y2="100%" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="0" y1="50%" x2="100%" y2="50%" strokeDasharray="4 4" strokeWidth="1" />
            </svg>
          )}

          {/* Reference Kanji Guide Outline */}
          {showOutline && selectedKanji && (
            <span className="absolute inset-0 flex items-center justify-center text-[220px] font-serif text-slate-800/40 select-none pointer-events-none">
              {selectedKanji.kanji}
            </span>
          )}

          {/* HTML5 Canvas */}
          <canvas
            ref={canvasRef}
            width={384}
            height={384}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
          />
        </div>

        {/* Toolbar & Controls */}
        <div className="w-full max-w-md mt-6 flex flex-col space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setGridType('rice')}
                className={`px-2.5 py-1 rounded-lg ${gridType === 'rice' ? 'bg-slate-800 text-amber-400' : 'text-slate-500'}`}
              >
                Grid 米
              </button>
              <button
                onClick={() => setGridType('cross')}
                className={`px-2.5 py-1 rounded-lg ${gridType === 'cross' ? 'bg-slate-800 text-amber-400' : 'text-slate-500'}`}
              >
                Grid 十
              </button>
              <button
                onClick={() => setGridType('none')}
                className={`px-2.5 py-1 rounded-lg ${gridType === 'none' ? 'bg-slate-800 text-amber-400' : 'text-slate-500'}`}
              >
                Polos
              </button>
            </div>

            {/* Stroke Width Slider */}
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span>Ketebalan:</span>
              <input 
                type="range" 
                min="6" 
                max="24" 
                value={strokeWidth} 
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-20 accent-rose-500" 
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={undoCanvas}
              disabled={history.length === 0}
              className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Undo Coretan</span>
            </button>

            <button
              onClick={clearCanvas}
              className="flex-1 py-2.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus Semua</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   4. KANJI VAULT / LIBRARY MODE
   ========================================================================= */
function VaultMode({ kanjiList, toggleMastery, deleteKanji, addKanji, resetAllProgress, onSelectPractice }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [jlptFilter, setJlptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Kanji Form State
  const [formData, setFormData] = useState({ kanji: '', onyomi: '', kunyomi: '', meaning: '', jlpt: 'N5', example: '' });

  const filteredVault = useMemo(() => {
    return kanjiList.filter(item => {
      const matchesSearch = 
        item.kanji.includes(searchTerm) || 
        item.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.onyomi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kunyomi.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesJlpt = jlptFilter === 'ALL' || item.jlpt === jlptFilter;
      const matchesStatus = 
        statusFilter === 'ALL' || 
        (statusFilter === 'MASTERED' && item.mastered) || 
        (statusFilter === 'UNMASTERED' && !item.mastered);

      return matchesSearch && matchesJlpt && matchesStatus;
    });
  }, [kanjiList, searchTerm, jlptFilter, statusFilter]);

  const handleSubmitNew = (e) => {
    e.preventDefault();
    if (!formData.kanji || !formData.meaning) return;
    addKanji(formData);
    setFormData({ kanji: '', onyomi: '', kunyomi: '', meaning: '', jlpt: 'N5', example: '' });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Cari berdasarkan Kanji, Arti, Onyomi, Kunyomi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* JLPT Filter */}
          <select
            value={jlptFilter}
            onChange={(e) => setJlptFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="ALL">Semua JLPT</option>
            <option value="N5">JLPT N5</option>
            <option value="N4">JLPT N4</option>
            <option value="N3">JLPT N3</option>
            <option value="N2">JLPT N2</option>
            <option value="N1">JLPT N1</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="MASTERED">Sudah Hafal</option>
            <option value="UNMASTERED">Belum Hafal</option>
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kanji</span>
          </button>

          <button
            onClick={resetAllProgress}
            className="p-2 text-slate-400 hover:text-rose-400 bg-slate-950 border border-slate-800 rounded-xl transition"
            title="Riset Hafalan All"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVault.map((item) => (
          <div
            key={item.id}
            className={`bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between transition-all ${
              item.mastered ? 'border-emerald-900/60 bg-emerald-950/10' : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl font-serif font-bold text-slate-100">{item.kanji}</span>
                  <div>
                    <span className="text-xs bg-slate-800 text-amber-400 px-2 py-0.5 rounded border border-slate-700 font-bold">
                      {item.jlpt || 'N/A'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleMastery(item.id)}
                  className={`p-1.5 rounded-lg transition ${
                    item.mastered 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                      : 'bg-slate-950 text-slate-600 border border-slate-800 hover:text-slate-400'
                  }`}
                  title={item.mastered ? 'Status: Mastered' : 'Tandai Mastered'}
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
              </div>

              <h4 className="text-sm font-semibold text-amber-300 mb-2">{item.meaning}</h4>

              <div className="space-y-1 text-xs text-slate-400">
                <p><span className="text-slate-500 font-mono">On:</span> {item.onyomi || '-'}</p>
                <p><span className="text-slate-500 font-mono">Kun:</span> {item.kunyomi || '-'}</p>
              </div>

              {item.example && (
                <div className="mt-3 text-[11px] text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                  {item.example}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 mt-4">
              <button
                onClick={() => onSelectPractice(item)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Coret Kanji</span>
              </button>

              <button
                onClick={() => deleteKanji(item.id)}
                className="text-slate-600 hover:text-rose-400 p-1 transition"
                title="Hapus dari Vault"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredVault.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-sm">
          Tidak ada data Kanji yang cocok dengan pencarian Anda.
        </div>
      )}

      {/* Modal Add Kanji */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-100">Tambah Kanji Manual</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-slate-300">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNew} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Kanji (Karakter)*</label>
                <input
                  type="text"
                  required
                  maxLength={2}
                  value={formData.kanji}
                  onChange={(e) => setFormData({ ...formData, kanji: e.target.value })}
                  placeholder="Contoh: 水"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Arti (Meaning)*</label>
                <input
                  type="text"
                  required
                  value={formData.meaning}
                  onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
                  placeholder="Contoh: Air / Water"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Onyomi</label>
                  <input
                    type="text"
                    value={formData.onyomi}
                    onChange={(e) => setFormData({ ...formData, onyomi: e.target.value })}
                    placeholder="スイ"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Kunyomi</label>
                  <input
                    type="text"
                    value={formData.kunyomi}
                    onChange={(e) => setFormData({ ...formData, kunyomi: e.target.value })}
                    placeholder="みず"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Level JLPT</label>
                  <select
                    value={formData.jlpt}
                    onChange={(e) => setFormData({ ...formData, jlpt: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  >
                    <option value="N5">N5</option>
                    <option value="N4">N4</option>
                    <option value="N3">N3</option>
                    <option value="N2">N2</option>
                    <option value="N1">N1</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Contoh Kata / Catatan</label>
                <textarea
                  rows={2}
                  value={formData.example}
                  onChange={(e) => setFormData({ ...formData, example: e.target.value })}
                  placeholder="Contoh: 水着 (Mizugi) - Baju renang"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-400 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl"
                >
                  Simpan Kanji
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   5. CSV IMPORT & EXPORT MANAGEMENT MODE
   ========================================================================= */
function ImportMode({ setKanjiList, existingKanji }) {
  const [dragActive, setDragActive] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  // Helper parsing CSV
  const parseCSV = (text) => {
    const lines = text.split(/\r\n|\n/);
    if (lines.length <= 1) return [];

    // Header detection
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Column Index Mapper
    const findIndex = (names) => headers.findIndex(h => names.some(n => h.includes(n)));
    
    const kanjiIdx = findIndex(['kanji', 'karakter', 'character', 'word']);
    const onyomiIdx = findIndex(['onyomi', 'on', 'katakana']);
    const kunyomiIdx = findIndex(['kunyomi', 'kun', 'hiragana']);
    const meaningIdx = findIndex(['meaning', 'arti', 'english', 'terjemahan']);
    const jlptIdx = findIndex(['jlpt', 'level']);
    const exampleIdx = findIndex(['example', 'contoh', 'notes', 'catatan']);

    const results = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Handle quoted commas correctly
      const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
      const cleanVal = (idx) => {
        if (idx === -1 || !values[idx]) return '';
        return values[idx].replace(/^"|"$/g, '').trim();
      };

      const kanjiChar = cleanVal(kanjiIdx !== -1 ? kanjiIdx : 0);
      if (!kanjiChar) continue;

      results.push({
        id: `imported-${Date.now()}-${i}`,
        kanji: kanjiChar,
        onyomi: cleanVal(onyomiIdx !== -1 ? onyomiIdx : 1),
        kunyomi: cleanVal(kunyomiIdx !== -1 ? kunyomiIdx : 2),
        meaning: cleanVal(meaningIdx !== -1 ? meaningIdx : 3) || 'Tanpa Arti',
        jlpt: cleanVal(jlptIdx !== -1 ? jlptIdx : 4) || 'N5',
        example: cleanVal(exampleIdx !== -1 ? exampleIdx : 5),
        mastered: false,
        reviewCount: 0
      });
    }

    return results;
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const parsed = parseCSV(content);
        if (parsed.length > 0) {
          setKanjiList(prev => [...parsed, ...prev]);
          setImportStatus({ type: 'success', message: `Berhasil mengimpor ${parsed.length} Kanji baru!` });
        } else {
          setImportStatus({ type: 'error', message: 'Gagal membaca CSV. Pastikan format kolom sesuai.' });
        }
      } catch (err) {
        setImportStatus({ type: 'error', message: 'Terjadi kesalahan saat memproses file.' });
      }
    };
    reader.readAsText(file);
  };

  const downloadSampleTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Kanji,Onyomi,Kunyomi,Meaning,JLPT,Example\n"
      + "日,ニチ,ひ,Sun / Day,N5,日本 (Nihon) - Japan\n"
      + "水,スイ,みず,Water,N5,水泳 (Suiei) - Swimming\n"
      + "電,デン,,Electricity,N4,電車 (Densha) - Train\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "kanji_forge_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportCurrentData = () => {
    let csvStr = "Kanji,Onyomi,Kunyomi,Meaning,JLPT,Example,Mastered\n";
    existingKanji.forEach(k => {
      csvStr += `"${k.kanji}","${k.onyomi}","${k.kunyomi}","${k.meaning}","${k.jlpt}","${k.example || ''}","${k.mastered ? 'YES' : 'NO'}"\n`;
    });

    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `kanji_forge_backup_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Upload Drag & Drop Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-xl">
        <h2 className="text-xl font-bold text-slate-100">Import Data Kanji via File CSV</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Tambahkan koleksi Kanji buatan Anda secara langsung dari spreadsheet Microsoft Excel / Google Sheets format .csv.
        </p>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
          className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition cursor-pointer ${
            dragActive ? 'border-rose-500 bg-rose-950/20' : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
          }`}
        >
          <Upload className="w-12 h-12 text-rose-500 mb-3 animate-bounce" />
          <p className="text-sm font-semibold text-slate-200">Tarik & Lepas File CSV di Sini</p>
          <p className="text-xs text-slate-500 mt-1">atau klik tombol di bawah untuk memilih file</p>
          
          <input
            type="file"
            accept=".csv"
            id="csvFileInput"
            className="hidden"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
          />
          <label
            htmlFor="csvFileInput"
            className="mt-4 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs transition cursor-pointer shadow-lg shadow-rose-900/30"
          >
            Pilih File CSV
          </label>
        </div>

        {importStatus && (
          <div className={`p-3 rounded-xl text-xs flex items-center justify-center space-x-2 ${
            importStatus.type === 'success' ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' : 'bg-rose-950 border border-rose-800 text-rose-300'
          }`}>
            {importStatus.type === 'success' ? <Check className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            <span>{importStatus.message}</span>
          </div>
        )}
      </div>

      {/* CSV Template & Export Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-200 text-sm mb-1 flex items-center gap-2">
              <Download className="w-4 h-4 text-amber-400" />
              <span>Download Contoh Template</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gunakan struktur kolom standar ini agar data Kanji Anda terpetakan sempurna (Kanji, Onyomi, Kunyomi, Meaning, JLPT, Example).
            </p>
          </div>
          <button
            onClick={downloadSampleTemplate}
            className="mt-4 py-2 px-4 bg-slate-950 hover:bg-slate-800 text-amber-400 border border-slate-800 rounded-xl text-xs font-semibold transition text-center"
          >
            Download Sample CSV
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-200 text-sm mb-1 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export Backup Data</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unduh seluruh daftar Kanji yang tersimpan saat ini ({existingKanji.length} item) ke dalam format CSV beserta status hafalannya.
            </p>
          </div>
          <button
            onClick={exportCurrentData}
            className="mt-4 py-2 px-4 bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-slate-800 rounded-xl text-xs font-semibold transition text-center"
          >
            Export Backup (.csv)
          </button>
        </div>
      </div>
    </div>
  );
}