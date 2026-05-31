import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Flame,
  RefreshCw,
  Trophy,
  Plus,
  RotateCcw,
  MessageCircle,
  PencilLine,
  Volume2,
  ChevronRight,
  Home,
  Layers,
  Award,
  Settings,
  Download,
  Upload,
} from "lucide-react";
import "./styles.css";

const STORAGE_KEY = "serbian_daily_15_progress_v1";
const APP_VERSION = "1.3.0";
const APP_BASE_URL = import.meta.env.BASE_URL || "/";

const lessons = [
  {
    id: "delivery",
    day: 1,
    title: "Доставка",
    subtitle: "Чтобы курьер понял с первого раза",
    badge: "Kurir Whisperer",
    words: [
      { sr: "porudžbina", ru: "заказ", ex: "Moja porudžbina stiže danas." },
      { sr: "komšija", ru: "сосед", ex: "Molim vas, ostavite kod komšije." },
      { sr: "stan", ru: "квартира", ex: "Stan broj 20." },
      { sr: "gotovina", ru: "наличные", ex: "Platiću gotovinom sutra." },
      { sr: "zgrada", ru: "здание / подъезд", ex: "Uđite u zgradu i pozovite me." },
      { sr: "javiti", ru: "сообщить", ex: "Javiću vam kad budem kod kuće." },
    ],
    phrases: [
      { ru: "Пожалуйста, оставьте заказ у соседа в квартире 20.", sr: "Molim vas, ostavite porudžbinu kod komšije u stanu 20." },
      { ru: "Я буду дома около 12.", sr: "Biću kod kuće oko 12." },
      { ru: "Оплату отдам завтра наличными.", sr: "Platiću sutra gotovinom." },
    ],
    dialogue: [
      ["Kurir", "Dobar dan, imam dostavu za vas."],
      ["Ti", "Dobar dan. Nisam kod kuće, molim vas ostavite kod komšije u stanu 20."],
      ["Kurir", "U redu. Da li je plaćeno?"],
      ["Ti", "Nije, ali platiću sutra gotovinom. Hvala."],
    ],
    task: {
      prompt: "Напиши по-сербски: “Пожалуйста, не оставляйте еду в подъезде. Оставьте у соседа.”",
      answer: "Molim vas, nemojte ostavljati hranu u ulazu. Ostavite kod komšije.",
    },
  },
  {
    id: "notary",
    day: 2,
    title: "Нотариус",
    subtitle: "Коротко объяснить, что тебе нужно",
    badge: "Notar nije pobedio",
    words: [
      { sr: "overiti", ru: "заверить", ex: "Treba da overim dokument." },
      { sr: "izvod", ru: "выписка", ex: "Imam izvod iz katastra." },
      { sr: "katastar", ru: "кадастр", ex: "Ovo je izvod iz katastra nepokretnosti." },
      { sr: "kopija", ru: "копия", ex: "Treba mi dve overene kopije." },
      { sr: "vlasnik", ru: "собственник", ex: "Imamo dva vlasnika." },
      { sr: "boravak", ru: "ВНЖ / пребывание", ex: "Dokument nam treba za stalni boravak." },
    ],
    phrases: [
      { ru: "Нам нужно заверить выписку из кадастра.", sr: "Treba da overimo izvod iz katastra." },
      { ru: "У нас два собственника.", sr: "Imamo dva vlasnika." },
      { ru: "Нам нужны две заверенные копии для подачи на ПМЖ.", sr: "Trebaju nam dve overene kopije za stalni boravak." },
    ],
    dialogue: [
      ["Ti", "Dobar dan. Treba da overimo izvod iz katastra."],
      ["Notar", "Koliko kopija vam treba?"],
      ["Ti", "Dve overene kopije, za stalni boravak."],
      ["Notar", "Da li su oba vlasnika ovde?"],
      ["Ti", "Da, imamo dva vlasnika i oboje smo ovde."],
    ],
    task: {
      prompt: "Напиши по-сербски: “Нам нужны две заверенные копии для подачи на ПМЖ.”",
      answer: "Trebaju nam dve overene kopije za stalni boravak.",
    },
  },
  {
    id: "appointment",
    day: 3,
    title: "Запись куда угодно",
    subtitle: "Врач, салон, сервис, документы",
    badge: "Termin Hunter",
    words: [
      { sr: "termin", ru: "запись / слот", ex: "Da li imate slobodan termin?" },
      { sr: "zakazati", ru: "записаться", ex: "Želim da zakažem termin." },
      { sr: "sledeća nedelja", ru: "следующая неделя", ex: "Može sledeće nedelje?" },
      { sr: "bilo koji dan", ru: "любой день", ex: "Može bilo koji dan." },
      { sr: "posle", ru: "после", ex: "Može posle 12?" },
      { sr: "pre", ru: "до", ex: "Ne mogu pre 10." },
    ],
    phrases: [
      { ru: "Можно записаться на следующей неделе?", sr: "Da li mogu da zakažem termin za sledeću nedelju?" },
      { ru: "Мне подойдёт любой день и любое время.", sr: "Odgovara mi bilo koji dan i bilo koje vreme." },
      { ru: "Можно после 12?", sr: "Da li može posle 12?" },
    ],
    dialogue: [
      ["Ti", "Dobar dan. Da li mogu da zakažem termin za sledeću nedelju?"],
      ["Recepcija", "Koji dan vam odgovara?"],
      ["Ti", "Bilo koji dan, najbolje posle 12."],
      ["Recepcija", "Imamo utorak u 13:30."],
      ["Ti", "Odlično, hvala. Zakažite me, molim vas."],
    ],
    task: {
      prompt: "Напиши по-сербски: “Мне подойдёт любой день, лучше после 12.”",
      answer: "Odgovara mi bilo koji dan, najbolje posle 12.",
    },
  },
  {
    id: "store",
    day: 4,
    title: "Магазин и оплата",
    subtitle: "Спросить цену, чек, карту, размер",
    badge: "Račun Master",
    words: [
      { sr: "račun", ru: "чек / счёт", ex: "Mogu li da dobijem račun?" },
      { sr: "kartica", ru: "карта", ex: "Mogu li karticom?" },
      { sr: "gotovina", ru: "наличные", ex: "Plaćam gotovinom." },
      { sr: "veličina", ru: "размер", ex: "Imate li veću veličinu?" },
      { sr: "popust", ru: "скидка", ex: "Da li imate popust?" },
      { sr: "probati", ru: "примерить", ex: "Mogu li da probam?" },
    ],
    phrases: [
      { ru: "Можно оплатить картой?", sr: "Da li mogu da platim karticom?" },
      { ru: "Можно чек, пожалуйста?", sr: "Mogu li da dobijem račun, molim vas?" },
      { ru: "У вас есть размер побольше?", sr: "Da li imate veću veličinu?" },
    ],
    dialogue: [
      ["Ti", "Dobar dan. Da li imate ovu veličinu?"],
      ["Prodavac", "Koju veličinu tražite?"],
      ["Ti", "Treba mi veća veličina, ako imate."],
      ["Prodavac", "Imamo. Da li želite da probate?"],
      ["Ti", "Da, hvala."],
    ],
    task: {
      prompt: "Напиши по-сербски: “Можно оплатить картой и получить чек?”",
      answer: "Da li mogu da platim karticom i dobijem račun?",
    },
  },
  {
    id: "doctor",
    day: 5,
    title: "Врач / аптека",
    subtitle: "Без паники объяснить проблему",
    badge: "Preživela ambulantu",
    words: [
      { sr: "bol", ru: "боль", ex: "Imam bol u kolenu." },
      { sr: "pregled", ru: "осмотр", ex: "Treba mi pregled." },
      { sr: "recept", ru: "рецепт", ex: "Da li mi treba recept?" },
      { sr: "lek", ru: "лекарство", ex: "Koji lek preporučujete?" },
      { sr: "alergija", ru: "аллергия", ex: "Nemam alergiju na lekove." },
      { sr: "osiguranje", ru: "страховка", ex: "Imam privatno osiguranje." },
    ],
    phrases: [
      { ru: "У меня болит колено после тренировки.", sr: "Boli me koleno posle treninga." },
      { ru: "Мне нужен осмотр.", sr: "Treba mi pregled." },
      { ru: "Можно купить это без рецепта?", sr: "Da li mogu ovo da kupim bez recepta?" },
    ],
    dialogue: [
      ["Ti", "Dobar dan. Boli me koleno posle treninga."],
      ["Lekar", "Koliko dugo traje bol?"],
      ["Ti", "Nije jak bol, ali traje nekoliko dana."],
      ["Lekar", "Da li ste imali povredu?"],
      ["Ti", "Ne, mislim da je od vežbanja."],
    ],
    task: {
      prompt: "Напиши по-сербски: “У меня не сильная боль, но она длится несколько дней.”",
      answer: "Bol nije jak, ali traje nekoliko dana.",
    },
  },
  {
    id: "neighbors",
    day: 6,
    title: "Соседи и дом",
    subtitle: "Вежливо, но нормально объяснить проблему",
    badge: "Komšija Diplomat",
    words: [
      { sr: "buka", ru: "шум", ex: "Čuje se buka noću." },
      { sr: "curi", ru: "течёт", ex: "Klima curi." },
      { sr: "klima", ru: "кондиционер", ex: "Klima jako vibrira." },
      { sr: "vibracija", ru: "вибрация", ex: "Vibracija se prenosi na zid." },
      { sr: "popravka", ru: "ремонт", ex: "Treba nam popravka." },
      { sr: "majstor", ru: "мастер", ex: "Možete li poslati majstora?" },
    ],
    phrases: [
      { ru: "Кондиционер вибрирует и отдаёт в стену.", sr: "Klima vibrira i vibracija se prenosi na zid." },
      { ru: "Кажется, кондиционер течёт.", sr: "Izgleda da klima curi." },
      { ru: "Можно отправить мастера?", sr: "Da li možete da pošaljete majstora?" },
    ],
    dialogue: [
      ["Ti", "Dobar dan. Imamo problem sa klimom."],
      ["Majstor", "Šta se dešava?"],
      ["Ti", "Klima vibrira, čuje se u zidu, i izgleda da curi."],
      ["Majstor", "Kada možemo da dođemo?"],
      ["Ti", "Može sutra posle 12."],
    ],
    task: {
      prompt: "Напиши по-сербски: “Кондиционер вибрирует, шум слышно в стене.”",
      answer: "Klima vibrira, buka se čuje u zidu.",
    },
  },
  {
    id: "smalltalk",
    day: 7,
    title: "Маленький разговор",
    subtitle: "Не зависать после первой фразы",
    badge: "Bez Google Translate 1 day",
    words: [
      { sr: "razumem", ru: "понимаю", ex: "Razumem malo srpski." },
      { sr: "ponoviti", ru: "повторить", ex: "Možete li da ponovite?" },
      { sr: "sporije", ru: "медленнее", ex: "Možete li sporije?" },
      { sr: "učim", ru: "учу", ex: "Učim srpski." },
      { sr: "izvinite", ru: "извините", ex: "Izvinite, nisam razumela." },
      { sr: "hvala puno", ru: "большое спасибо", ex: "Hvala puno na pomoći." },
    ],
    phrases: [
      { ru: "Я немного понимаю сербский.", sr: "Razumem malo srpski." },
      { ru: "Можно повторить медленнее?", sr: "Možete li da ponovite sporije?" },
      { ru: "Я учу сербский, поэтому могу ошибаться.", sr: "Učim srpski, zato mogu da pogrešim." },
    ],
    dialogue: [
      ["Osoba", "Da li vam treba pomoć?"],
      ["Ti", "Da, hvala. Učim srpski, možete li malo sporije?"],
      ["Osoba", "Naravno."],
      ["Ti", "Hvala puno. Razumem malo, ali još učim."],
    ],
    task: {
      prompt: "Напиши по-сербски: “Я учу сербский, можно чуть медленнее?”",
      answer: "Učim srpski, možete li malo sporije?",
    },
  },
];

const extraAchievements = [
  { id: "first_done", title: "Prvi korak", text: "Первый урок закрыт. Уже не ноль.", condition: (p) => p.completedLessons.length >= 1 },
  { id: "three_days", title: "Tri dana bez panike", text: "Три урока. Сербский начал сопротивляться меньше.", condition: (p) => p.completedLessons.length >= 3 },
  { id: "week", title: "Sedam dana, pošteno", text: "Неделя закрыта. Уже можно спорить с курьером мягко.", condition: (p) => p.completedLessons.length >= 7 },
  { id: "cards_30", title: "30 kartica", text: "30 карточек просмотрено. Мозг делает вид, что всё помнит.", condition: (p) => p.cardsReviewed >= 30 },
  { id: "tasks_5", title: "Pet rečenica", text: "5 письменных заданий. Уже не только читаешь, но и собираешь фразы.", condition: (p) => p.tasksDone >= 5 },
];

const initialProgress = {
  completedLessons: [],
  cardsReviewed: 0,
  tasksDone: 0,
  streak: 0,
  lastDoneDate: null,
  customCards: [],
  learnedBadges: [],
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialProgress;
    return { ...initialProgress, ...JSON.parse(raw) };
  } catch {
    return initialProgress;
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function speak(text) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "sr-RS";
  utterance.rate = 0.86;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}


function usePWAUpdates() {
  const [state, setState] = useState({
    supported: false,
    checking: false,
    updateAvailable: false,
    registration: null,
    waitingWorker: null,
    currentVersion: APP_VERSION,
    latestVersion: APP_VERSION,
    error: "",
  });

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      setState((prev) => ({ ...prev, supported: false, error: "Service Worker не поддерживается в этом браузере." }));
      return;
    }

    setState((prev) => ({ ...prev, supported: true }));

    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    navigator.serviceWorker.register(`${APP_BASE_URL}sw.js`, { scope: APP_BASE_URL }).then((registration) => {
      const waitingWorker = registration.waiting;
      setState((prev) => ({
        ...prev,
        registration,
        waitingWorker,
        updateAvailable: Boolean(waitingWorker),
      }));

      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            setState((prev) => ({
              ...prev,
              updateAvailable: true,
              waitingWorker: registration.waiting || newWorker,
            }));
          }
        });
      });
    }).catch((error) => {
      setState((prev) => ({ ...prev, error: error?.message || "Не получилось подключить обновления." }));
    });
  }, []);

  const checkForUpdate = async () => {
    setState((prev) => ({ ...prev, checking: true, error: "" }));
    try {
      const versionResponse = await fetch(`${APP_BASE_URL}version.json?t=${Date.now()}`, { cache: "no-store" });
      if (versionResponse.ok) {
        const versionData = await versionResponse.json();
        setState((prev) => ({ ...prev, latestVersion: versionData.version || prev.latestVersion }));
      }

      const registration = state.registration || await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        const waitingWorker = registration.waiting;
        setState((prev) => ({
          ...prev,
          registration,
          waitingWorker,
          updateAvailable: Boolean(waitingWorker) || prev.updateAvailable,
          checking: false,
        }));
      } else {
        setState((prev) => ({ ...prev, checking: false }));
      }
    } catch (error) {
      setState((prev) => ({ ...prev, checking: false, error: error?.message || "Проверка обновлений не сработала." }));
    }
  };

  const applyUpdate = () => {
    const worker = state.waitingWorker || state.registration?.waiting;
    if (!worker) {
      window.location.reload();
      return;
    }
    worker.postMessage({ type: "SKIP_WAITING" });
  };

  return { updateState: state, checkForUpdate, applyUpdate };
}

function useInstallPrompt() {
  const [installEvent, setInstallEvent] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem("serbian_daily_15_install_dismissed") === "1");

  useEffect(() => {
    const standalone = window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone === true;
    setIsInstalled(Boolean(standalone));

    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallEvent(event);
      setDismissed(false);
      localStorage.removeItem("serbian_daily_15_install_dismissed");
    };

    const onInstalled = () => {
      setIsInstalled(true);
      setInstallEvent(null);
      setDismissed(true);
      localStorage.setItem("serbian_daily_15_install_dismissed", "1");
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!installEvent) return;
    installEvent.prompt();
    const choice = await installEvent.userChoice.catch(() => null);
    setInstallEvent(null);
    if (choice?.outcome === "accepted") {
      setDismissed(true);
      localStorage.setItem("serbian_daily_15_install_dismissed", "1");
    }
  };

  const hide = () => {
    setDismissed(true);
    localStorage.setItem("serbian_daily_15_install_dismissed", "1");
  };

  return { canInstall: Boolean(installEvent) && !isInstalled && !dismissed, isInstalled, install, hide };
}

function SectionTitle({ icon: Icon, title, text }) {
  return (
    <div className="section-title">
      <div className="section-icon"><Icon size={20} /></div>
      <div>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
    </div>
  );
}

function ProgressRing({ value }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="progress-ring">
      <svg viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={radius} className="ring-bg" />
        <circle cx="48" cy="48" r={radius} className="ring-value" strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div className="ring-text">
        <strong>{value}%</strong>
        <span>progress</span>
      </div>
    </div>
  );
}

function WordCard({ word, onReviewed }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        setFlipped(!flipped);
        if (!flipped) onReviewed();
      }}
      className="word-card"
    >
      <div className="word-card-top">
        <div>
          <p className="eyebrow">карточка</p>
          <p className="word-main">{flipped ? word.ru : word.sr}</p>
        </div>
        <div className="icon-row">
          <span><RefreshCw size={16} /></span>
          <span
            onClick={(e) => {
              e.stopPropagation();
              speak(word.sr);
            }}
          >
            <Volume2 size={16} />
          </span>
        </div>
      </div>
      <p className="word-example">{flipped ? word.ex : "Нажми, чтобы увидеть перевод и пример."}</p>
    </motion.button>
  );
}

function BottomNav({ tab, setTab }) {
  const items = [
    { id: "today", label: "Сегодня", icon: Home },
    { id: "cards", label: "Карточки", icon: Layers },
    { id: "scenarios", label: "Фразы", icon: MessageCircle },
    { id: "wins", label: "Прогресс", icon: Award },
  ];

  return (
    <div className="bottom-nav-wrap">
      <div className="bottom-nav">
        {items.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button key={item.id} onClick={() => setTab(item.id)} className={active ? "active" : ""}>
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TodayView({ lesson, progress, setProgress }) {
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const completed = progress.completedLessons.includes(lesson.id);

  const finishLesson = () => {
    setProgress((prev) => {
      const today = todayKey();
      const alreadyDoneToday = prev.lastDoneDate === today;
      const completedLessons = prev.completedLessons.includes(lesson.id) ? prev.completedLessons : [...prev.completedLessons, lesson.id];
      const learnedBadges = prev.learnedBadges.includes(lesson.badge) ? prev.learnedBadges : [...prev.learnedBadges, lesson.badge];
      return {
        ...prev,
        completedLessons,
        learnedBadges,
        tasksDone: showAnswer ? prev.tasksDone + 1 : prev.tasksDone,
        streak: alreadyDoneToday ? prev.streak : prev.streak + 1,
        lastDoneDate: today,
      };
    });
  };

  return (
    <div className="stack">
      <div className="hero-card">
        <div className="hero-inner">
          <div>
            <div className="pill"><Flame size={16} /> 15 минут в день</div>
            <h1>День {lesson.day}. {lesson.title}</h1>
            <p>{lesson.subtitle}</p>
          </div>
          <ProgressRing value={Math.round((progress.completedLessons.length / lessons.length) * 100)} />
        </div>
      </div>

      <div className="stats-grid">
        <div><strong>{progress.streak}</strong><span>streak</span></div>
        <div><strong>{progress.cardsReviewed}</strong><span>карточек</span></div>
        <div><strong>{progress.completedLessons.length}</strong><span>уроков</span></div>
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="words" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="stack">
            <SectionTitle icon={BookOpen} title="5–7 слов на сегодня" text="Нажимай на карточку. Лучше не зубрить, а узнавать слово в примере." />
            {lesson.words.map((word, index) => (
              <WordCard key={`${word.sr}-${index}`} word={word} onReviewed={() => setProgress((p) => ({ ...p, cardsReviewed: p.cardsReviewed + 1 }))} />
            ))}
            <button className="primary-btn" onClick={() => setStep(1)}>Дальше: готовые фразы <ChevronRight size={20} /></button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="phrases" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="stack">
            <SectionTitle icon={MessageCircle} title="Фразы, которые реально пригодятся" text="Не отдельные слова, а готовые куски речи." />
            {lesson.phrases.map((phrase, index) => (
              <div key={index} className="phrase-card">
                <p className="phrase-ru">{phrase.ru}</p>
                <div className="phrase-line">
                  <p>{phrase.sr}</p>
                  <button onClick={() => speak(phrase.sr)}><Volume2 size={16} /></button>
                </div>
              </div>
            ))}
            <button className="primary-btn" onClick={() => setStep(2)}>Дальше: мини-диалог <ChevronRight size={20} /></button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="dialogue" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="stack">
            <SectionTitle icon={MessageCircle} title="Мини-диалог" text="Прочитай вслух. Да, вслух. Иначе оно не вылезет в жизни." />
            <div className="dialogue-card">
              {lesson.dialogue.map(([name, text], index) => (
                <div key={index} className={name === "Ti" ? "bubble-row me" : "bubble-row"}>
                  <div className={name === "Ti" ? "bubble me" : "bubble"}>
                    <p className="bubble-name">{name}</p>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="primary-btn" onClick={() => setStep(3)}>Дальше: собрать фразу <ChevronRight size={20} /></button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="task" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="stack">
            <SectionTitle icon={PencilLine} title="Активное задание" text="Тут смысл не в идеальности. Смысл — заставить мозг собрать фразу самому." />
            <div className="task-card">
              <p>{lesson.task.prompt}</p>
              <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Пиши здесь на сербском..." />
              <div className="button-row">
                <button className="secondary-btn" onClick={() => setShowAnswer(true)}>Показать ответ</button>
                <button className="primary-btn compact" onClick={finishLesson}>Готово</button>
              </div>
              {showAnswer && <div className="answer-box"><span>вариант ответа</span><p>{lesson.task.answer}</p></div>}
            </div>
            {completed && <div className="done-box"><CheckCircle2 size={24} /><div><strong>Урок закрыт</strong><p>Ачивка: {lesson.badge}</p></div></div>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CardsView({ progress, setProgress }) {
  const [customSr, setCustomSr] = useState("");
  const [customRu, setCustomRu] = useState("");
  const allWords = useMemo(() => {
    const base = lessons.flatMap((l) => l.words.map((w) => ({ ...w, source: l.title })));
    const custom = progress.customCards.map((c) => ({ ...c, source: "Мои слова", ex: c.ex || "Своя карточка" }));
    return [...custom, ...base];
  }, [progress.customCards]);

  const addCard = () => {
    if (!customSr.trim() || !customRu.trim()) return;
    setProgress((p) => ({ ...p, customCards: [{ sr: customSr.trim(), ru: customRu.trim(), ex: "Своя карточка" }, ...p.customCards] }));
    setCustomSr("");
    setCustomRu("");
  };

  return (
    <div className="stack">
      <SectionTitle icon={Layers} title="Все карточки" text="Повторение без большого курса и чувства вины." />
      <div className="form-card">
        <p>Добавить своё слово</p>
        <input value={customSr} onChange={(e) => setCustomSr(e.target.value)} placeholder="serbian word / phrase" />
        <input value={customRu} onChange={(e) => setCustomRu(e.target.value)} placeholder="перевод" />
        <button className="primary-btn" onClick={addCard}><Plus size={16} /> Добавить</button>
      </div>
      {allWords.map((word, index) => (
        <div key={`${word.sr}-${index}`}>
          <WordCard word={word} onReviewed={() => setProgress((p) => ({ ...p, cardsReviewed: p.cardsReviewed + 1 }))} />
          <p className="source-label">{word.source}</p>
        </div>
      ))}
    </div>
  );
}

function ScenariosView() {
  return (
    <div className="stack">
      <SectionTitle icon={MessageCircle} title="Боевые сценарии" text="Это не теория. Это фразы для ситуаций, которые реально случаются в Сербии." />
      {lessons.map((lesson) => (
        <details key={lesson.id} className="scenario-card">
          <summary>
            <div>
              <p>День {lesson.day}</p>
              <h3>{lesson.title}</h3>
              <span>{lesson.subtitle}</span>
            </div>
            <ChevronRight size={20} />
          </summary>
          <div className="scenario-body">
            {lesson.phrases.map((phrase, index) => (
              <div key={index} className="scenario-phrase">
                <p className="phrase-ru">{phrase.ru}</p>
                <div className="phrase-line">
                  <p>{phrase.sr}</p>
                  <button onClick={() => speak(phrase.sr)}><Volume2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

function WinsView({ progress, setProgress, updateState, onCheckForUpdate, onApplyUpdate }) {
  const earned = extraAchievements.filter((a) => a.condition(progress));
  const next = extraAchievements.filter((a) => !a.condition(progress));

  const exportData = async () => {
    const data = JSON.stringify(progress, null, 2);
    try {
      await navigator.clipboard.writeText(data);
      alert("Прогресс скопирован. Можно сохранить в заметки.");
    } catch {
      alert(data);
    }
  };

  const importData = () => {
    const data = prompt("Вставь сюда сохранённый JSON прогресса");
    if (!data) return;
    try {
      const parsed = JSON.parse(data);
      setProgress({ ...initialProgress, ...parsed });
    } catch {
      alert("Не получилось импортировать. Похоже, JSON сломан.");
    }
  };

  const reset = () => {
    if (!confirm("Сбросить весь прогресс?")) return;
    setProgress(initialProgress);
  };

  return (
    <div className="stack">
      <SectionTitle icon={Trophy} title="Прогресс и ачивки" text="Накопительные штуки, чтобы был смысл возвращаться." />
      <div className="stats-grid two">
        <div><strong>{progress.completedLessons.length}/{lessons.length}</strong><span>уроков закрыто</span></div>
        <div><strong>{progress.streak}</strong><span>дней streak</span></div>
      </div>

      <div className="badge-card">
        <p>Полученные бейджи</p>
        {progress.learnedBadges.length === 0 ? <span>Пока пусто. Закрой первый урок, и тут будет первая победа.</span> : <div>{progress.learnedBadges.map((b) => <em key={b}>{b}</em>)}</div>}
      </div>

      {earned.map((a) => <div key={a.id} className="achievement earned"><CheckCircle2 size={24} /><div><strong>{a.title}</strong><p>{a.text}</p></div></div>)}
      {next.map((a) => <div key={a.id} className="achievement"><strong>{a.title}</strong><p>{a.text}</p></div>)}

      <div className="settings-card update-card">
        <div className="settings-title"><Settings size={20} /><p>Обновления приложения</p></div>
        <div className="version-line">
          <span>Текущая версия</span>
          <strong>v{updateState.currentVersion}</strong>
        </div>
        <div className="version-line">
          <span>Последняя проверенная</span>
          <strong>v{updateState.latestVersion}</strong>
        </div>
        {updateState.updateAvailable ? (
          <div className="update-ready">
            <strong>Доступна новая версия</strong>
            <p>Нажми обновить. Прогресс останется в памяти телефона.</p>
            <button className="primary-btn" onClick={onApplyUpdate}><RefreshCw size={16} /> Обновить сейчас</button>
          </div>
        ) : (
          <p className="settings-note">Обновления проверяются при запуске. Можно проверить вручную после нового деплоя на GitHub Pages, Vercel или Netlify.</p>
        )}
        {updateState.error && <p className="settings-error">{updateState.error}</p>}
        <button className="secondary-btn" onClick={onCheckForUpdate} disabled={updateState.checking}>
          <RefreshCw size={16} /> {updateState.checking ? "Проверяю..." : "Проверить обновления"}
        </button>
      </div>

      <div className="settings-card">
        <div className="settings-title"><Settings size={20} /><p>Сохранение</p></div>
        <button className="secondary-btn" onClick={exportData}><Download size={16} /> Экспорт прогресса</button>
        <button className="secondary-btn" onClick={importData}><Upload size={16} /> Импорт прогресса</button>
        <button className="danger-btn" onClick={reset}><RotateCcw size={16} /> Сбросить прогресс</button>
      </div>
    </div>
  );
}

function SerbianDaily15PWA() {
  const [progress, setProgress] = useState(initialProgress);
  const [tab, setTab] = useState("today");
  const { updateState, checkForUpdate, applyUpdate } = usePWAUpdates();
  const installPrompt = useInstallPrompt();

  useEffect(() => setProgress(loadProgress()), []);
  useEffect(() => saveProgress(progress), [progress]);

  const todayLesson = useMemo(() => {
    const next = lessons.find((l) => !progress.completedLessons.includes(l.id));
    return next || lessons[(new Date().getDay() + lessons.length - 1) % lessons.length];
  }, [progress.completedLessons]);

  return (
    <div className="app">
      <div className="bg-orbs"><span /><span /><span /></div>
      <main>
        <div className="topbar">
          <div>
            <p>Serbian Daily</p>
            <h2>15 минут</h2>
          </div>
          <div className="date-pill">v{APP_VERSION}</div>
        </div>

        {updateState.updateAvailable && (
          <div className="update-banner">
            <div>
              <strong>Есть новая версия</strong>
              <p>Можно обновить без потери прогресса.</p>
            </div>
            <button onClick={applyUpdate}>Обновить</button>
          </div>
        )}

        {installPrompt.canInstall && (
          <div className="install-banner">
            <div>
              <strong>Установить на главный экран</strong>
              <p>Откроется как приложение. После установки кнопка пропадёт.</p>
            </div>
            <div className="install-actions">
              <button onClick={installPrompt.install}>Добавить</button>
              <button className="ghost" onClick={installPrompt.hide}>Не сейчас</button>
            </div>
          </div>
        )}

        {tab === "today" && <TodayView lesson={todayLesson} progress={progress} setProgress={setProgress} />}
        {tab === "cards" && <CardsView progress={progress} setProgress={setProgress} />}
        {tab === "scenarios" && <ScenariosView />}
        {tab === "wins" && <WinsView progress={progress} setProgress={setProgress} updateState={updateState} onCheckForUpdate={checkForUpdate} onApplyUpdate={applyUpdate} />}
      </main>
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}

createRoot(document.getElementById("root")).render(<SerbianDaily15PWA />);
