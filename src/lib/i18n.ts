import { useCallback, useEffect, useState } from "react";

export const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "mr", label: "मराठी" },
] as const;
export type Lang = (typeof LANGS)[number]["code"];

type Dict = Record<string, string>;
const en: Dict = {
  home: "Home", cycle: "Cycle", ai: "Sakhi AI", lifestyle: "Lifestyle", products: "Products", doctors: "Doctors",
  forum: "Forum", buddy: "Buddy", vibes: "Vibes", more: "More", menu: "Menu", tagline: "your gentle companion", language: "Language",
  doctorsTitle: "Trusted gynaecologists", doctorsSub: "Swipe through specialists across India",
  book: "Book appointment", call: "Call", maps: "Maps", readBio: "Read full bio", showLess: "Show less",
  myRequests: "My requests", signInToBook: "Sign in to book and track your requests", signIn: "Sign in",
  noRequests: "No appointment requests yet. Tap “Book appointment” on any doctor to pick a date and time.",
  requested: "Requested · awaiting clinic", confirmed: "Confirmed by clinic", declined: "Declined by clinic", cancelled: "Cancelled",
  cancel: "Cancel", remove: "Remove", allCities: "All cities", search: "Search by name, specialty, language…",
  lifeTitle: "Your personal lifestyle consultant", lifeSub: "Fresh advice every day, tuned to your cycle phase.",
  todaysAdvice: "Today's advice", moodCheck: "How are you feeling today?", moodSaved: "Mood saved to your cycle log",
  styleGuide: "Premium style guide", phaseGuide: "Phase-by-phase guide", demo: "Demo profile",
};
const hi: Dict = {
  home: "होम", cycle: "चक्र", ai: "सखी AI", lifestyle: "जीवनशैली", products: "उत्पाद", doctors: "डॉक्टर",
  forum: "फ़ोरम", buddy: "साथी", vibes: "वाइब्स", more: "और", menu: "मेनू", tagline: "आपकी कोमल साथी", language: "भाषा",
  doctorsTitle: "भरोसेमंद स्त्री रोग विशेषज्ञ", doctorsSub: "पूरे भारत के विशेषज्ञों को स्वाइप करें",
  book: "अपॉइंटमेंट बुक करें", call: "कॉल", maps: "नक्शा", readBio: "पूरा परिचय पढ़ें", showLess: "कम दिखाएँ",
  myRequests: "मेरे अनुरोध", signInToBook: "बुक करने और अनुरोध देखने के लिए साइन इन करें", signIn: "साइन इन",
  noRequests: "अभी कोई अनुरोध नहीं। किसी डॉक्टर पर “अपॉइंटमेंट बुक करें” दबाएँ।",
  requested: "अनुरोधित · क्लिनिक की प्रतीक्षा", confirmed: "क्लिनिक ने पुष्टि की", declined: "क्लिनिक ने अस्वीकार किया", cancelled: "रद्द",
  cancel: "रद्द करें", remove: "हटाएँ", allCities: "सभी शहर", search: "नाम, विशेषता, भाषा से खोजें…",
  lifeTitle: "आपकी निजी जीवनशैली सलाहकार", lifeSub: "हर दिन नई सलाह, आपके चक्र के अनुसार।",
  todaysAdvice: "आज की सलाह", moodCheck: "आज आप कैसा महसूस कर रही हैं?", moodSaved: "मूड आपके लॉग में सेव हुआ",
  styleGuide: "प्रीमियम स्टाइल गाइड", phaseGuide: "चरण-दर-चरण गाइड", demo: "डेमो प्रोफ़ाइल",
};
const bn: Dict = {
  home: "হোম", cycle: "চক্র", ai: "সখী AI", lifestyle: "জীবনধারা", products: "পণ্য", doctors: "ডাক্তার",
  forum: "ফোরাম", buddy: "বন্ধু", vibes: "ভাইবস", more: "আরও", menu: "মেনু", tagline: "তোমার কোমল সঙ্গী", language: "ভাষা",
  doctorsTitle: "বিশ্বস্ত স্ত্রীরোগ বিশেষজ্ঞ", doctorsSub: "ভারত জুড়ে বিশেষজ্ঞদের সোয়াইপ করুন",
  book: "অ্যাপয়েন্টমেন্ট বুক করুন", call: "কল", maps: "ম্যাপ", readBio: "পুরো পরিচয়", showLess: "কম দেখান",
  myRequests: "আমার অনুরোধ", signInToBook: "বুক করতে সাইন ইন করুন", signIn: "সাইন ইন",
  noRequests: "এখনও কোনো অনুরোধ নেই।", requested: "অনুরোধ করা হয়েছে", confirmed: "নিশ্চিত", declined: "প্রত্যাখ্যাত", cancelled: "বাতিল",
  cancel: "বাতিল", remove: "মুছুন", allCities: "সব শহর", search: "নাম, বিশেষত্ব, ভাষা দিয়ে খুঁজুন…",
  lifeTitle: "তোমার ব্যক্তিগত জীবনধারা পরামর্শদাতা", lifeSub: "প্রতিদিন নতুন পরামর্শ, তোমার চক্র অনুযায়ী।",
  todaysAdvice: "আজকের পরামর্শ", moodCheck: "আজ কেমন লাগছে?", moodSaved: "মুড সেভ হয়েছে",
  styleGuide: "প্রিমিয়াম স্টাইল গাইড", phaseGuide: "পর্যায় গাইড", demo: "ডেমো প্রোফাইল",
};
const ta: Dict = {
  home: "முகப்பு", cycle: "சுழற்சி", ai: "சகி AI", lifestyle: "வாழ்க்கை முறை", products: "பொருட்கள்", doctors: "மருத்துவர்கள்",
  forum: "மன்றம்", buddy: "தோழி", vibes: "வைப்ஸ்", more: "மேலும்", menu: "பட்டியல்", tagline: "உங்கள் மென்மையான துணை", language: "மொழி",
  doctorsTitle: "நம்பகமான மகப்பேறு மருத்துவர்கள்", doctorsSub: "இந்தியா முழுவதும் நிபுணர்களை ஸ்வைப் செய்யுங்கள்",
  book: "சந்திப்பு பதிவு", call: "அழை", maps: "வரைபடம்", readBio: "முழு விவரம்", showLess: "குறைவாக",
  myRequests: "என் கோரிக்கைகள்", signInToBook: "பதிவு செய்ய உள்நுழையவும்", signIn: "உள்நுழை",
  noRequests: "இன்னும் கோரிக்கைகள் இல்லை.", requested: "கோரப்பட்டது", confirmed: "உறுதி செய்யப்பட்டது", declined: "நிராகரிக்கப்பட்டது", cancelled: "ரத்து",
  cancel: "ரத்து", remove: "நீக்கு", allCities: "அனைத்து நகரங்கள்", search: "பெயர், சிறப்பு, மொழி மூலம் தேடுங்கள்…",
  lifeTitle: "உங்கள் தனிப்பட்ட வாழ்க்கை முறை ஆலோசகர்", lifeSub: "தினமும் புதிய ஆலோசனை.",
  todaysAdvice: "இன்றைய ஆலோசனை", moodCheck: "இன்று எப்படி உணர்கிறீர்கள்?", moodSaved: "மனநிலை சேமிக்கப்பட்டது",
  styleGuide: "பிரீமியம் ஸ்டைல் கையேடு", phaseGuide: "கட்ட வழிகாட்டி", demo: "டெமோ சுயவிவரம்",
};
const te: Dict = {
  home: "హోమ్", cycle: "చక్రం", ai: "సఖి AI", lifestyle: "జీవనశైలి", products: "ఉత్పత్తులు", doctors: "డాక్టర్లు",
  forum: "ఫోరమ్", buddy: "స్నేహితురాలు", vibes: "వైబ్స్", more: "మరిన్ని", menu: "మెనూ", tagline: "మీ సున్నితమైన తోడు", language: "భాష",
  doctorsTitle: "నమ్మకమైన గైనకాలజిస్టులు", doctorsSub: "భారతదేశం అంతటా నిపుణులను స్వైప్ చేయండి",
  book: "అపాయింట్‌మెంట్ బుక్", call: "కాల్", maps: "మ్యాప్", readBio: "పూర్తి వివరాలు", showLess: "తక్కువ",
  myRequests: "నా అభ్యర్థనలు", signInToBook: "బుక్ చేయడానికి సైన్ ఇన్ చేయండి", signIn: "సైన్ ఇన్",
  noRequests: "ఇంకా అభ్యర్థనలు లేవు.", requested: "అభ్యర్థించబడింది", confirmed: "నిర్ధారించబడింది", declined: "తిరస్కరించబడింది", cancelled: "రద్దు",
  cancel: "రద్దు", remove: "తొలగించు", allCities: "అన్ని నగరాలు", search: "పేరు, ప్రత్యేకత, భాషతో వెతకండి…",
  lifeTitle: "మీ వ్యక్తిగత జీవనశైలి సలహాదారు", lifeSub: "ప్రతిరోజూ కొత్త సలహా.",
  todaysAdvice: "నేటి సలహా", moodCheck: "ఈ రోజు ఎలా అనిపిస్తోంది?", moodSaved: "మూడ్ సేవ్ అయింది",
  styleGuide: "ప్రీమియం స్టైల్ గైడ్", phaseGuide: "దశల గైడ్", demo: "డెమో ప్రొఫైల్",
};
const mr: Dict = {
  home: "मुख्यपृष्ठ", cycle: "चक्र", ai: "सखी AI", lifestyle: "जीवनशैली", products: "उत्पादने", doctors: "डॉक्टर",
  forum: "फोरम", buddy: "मैत्रीण", vibes: "वाइब्स", more: "अधिक", menu: "मेनू", tagline: "तुमची सौम्य सोबती", language: "भाषा",
  doctorsTitle: "विश्वासू स्त्रीरोगतज्ज्ञ", doctorsSub: "भारतभरातील तज्ज्ञ स्वाइप करा",
  book: "अपॉइंटमेंट बुक करा", call: "कॉल", maps: "नकाशा", readBio: "संपूर्ण माहिती", showLess: "कमी दाखवा",
  myRequests: "माझ्या विनंत्या", signInToBook: "बुक करण्यासाठी साइन इन करा", signIn: "साइन इन",
  noRequests: "अजून विनंत्या नाहीत.", requested: "विनंती केली", confirmed: "पुष्टी झाली", declined: "नाकारली", cancelled: "रद्द",
  cancel: "रद्द करा", remove: "काढा", allCities: "सर्व शहरे", search: "नाव, विशेषता, भाषेने शोधा…",
  lifeTitle: "तुमची वैयक्तिक जीवनशैली सल्लागार", lifeSub: "दररोज नवा सल्ला, तुमच्या चक्रानुसार.",
  todaysAdvice: "आजचा सल्ला", moodCheck: "आज कसं वाटतंय?", moodSaved: "मूड सेव्ह झाला",
  styleGuide: "प्रीमियम स्टाइल गाइड", phaseGuide: "टप्प्यांचा गाइड", demo: "डेमो प्रोफाइल",
};
const DICTS: Record<Lang, Dict> = { en, hi, bn, ta, te, mr };

const KEY = "sakhi:lang";

export function useLang() {
  const [lang, setL] = useState<Lang>("en");
  useEffect(() => {
    const read = () => {
      const v = localStorage.getItem(KEY) as Lang | null;
      const l = v && v in DICTS ? v : "en";
      setL(l);
      document.documentElement.lang = l;
    };
    read();
    window.addEventListener("sakhi:lang", read);
    return () => window.removeEventListener("sakhi:lang", read);
  }, []);
  const setLang = useCallback((l: Lang) => {
    localStorage.setItem(KEY, l);
    window.dispatchEvent(new CustomEvent("sakhi:lang"));
  }, []);
  const t = useCallback((k: string) => DICTS[lang][k] ?? en[k] ?? k, [lang]);
  return { lang, setLang, t };
}
