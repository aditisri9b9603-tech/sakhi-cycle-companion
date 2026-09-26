export type Doc = {
  id: string; photo: string;
  name: string; clinic: string; city: string; experience: number; rating: number;
  languages: string[]; phone: string; fee: string; hours: string;
  emergency: boolean; online: boolean; specialty: string;
  qualifications: string; bio: string;
};

const DOCTORS_RAW: Omit<Doc, "id" | "photo">[] = [
  // Mumbai
  { name: "Dr. Priya Sharma", clinic: "Apollo Cradle, Bandra", city: "Mumbai", experience: 14, rating: 4.9, languages: ["English", "Hindi", "Marathi"], phone: "+912226670000", fee: "₹1200", hours: "24×7", emergency: true, online: true, specialty: "PCOS & fertility",
    qualifications: "MBBS, MS (OBGY), FMAS", bio: "A warm, evidence-driven specialist who has helped over 3,000 women manage PCOS and irregular cycles through nutrition, hormone therapy, and lifestyle coaching. Trained at Seth GS Medical College, Mumbai; regular speaker at FOGSI conferences on adolescent gynaecology." },
  { name: "Dr. Anjali Mehra", clinic: "Fortis La Femme, Mulund", city: "Mumbai", experience: 22, rating: 4.8, languages: ["English", "Hindi", "Marathi"], phone: "+912266546565", fee: "₹1500", hours: "9am–9pm", emergency: false, online: true, specialty: "High-risk pregnancy",
    qualifications: "MBBS, MD (OBGY), DNB Fetal Medicine", bio: "One of Mumbai's most trusted names in high-risk pregnancy and prenatal ultrasound. Believes in gentle, informed birth — every consult includes time for questions and a written care plan you can share with family." },
  { name: "Dr. Meera Joshi", clinic: "Hinduja Hospital, Mahim", city: "Mumbai", experience: 19, rating: 4.7, languages: ["English", "Hindi", "Gujarati"], phone: "+912224447000", fee: "₹1300", hours: "24×7", emergency: true, online: false, specialty: "Endometriosis",
    qualifications: "MBBS, MD, Fellowship in Endometriosis (Germany)", bio: "Advanced laparoscopic surgeon focused on endometriosis and chronic pelvic pain. Runs a monthly support circle for patients — you'll leave her clinic feeling heard, not dismissed." },
  // Delhi
  { name: "Dr. Sunita Verma", clinic: "Max Smart, Saket", city: "Delhi", experience: 26, rating: 4.8, languages: ["English", "Hindi", "Punjabi"], phone: "+911140554055", fee: "₹1400", hours: "24×7", emergency: true, online: true, specialty: "Adolescent gynae",
    qualifications: "MBBS, MD (OBGY), FICOG", bio: "The go-to gynaecologist for teens and young adults in Delhi NCR. Known for making first-visit consultations feel safe and unhurried, and for demystifying period problems for parents too." },
  { name: "Dr. Radhika Kapoor", clinic: "Sir Ganga Ram, Rajinder Nagar", city: "Delhi", experience: 30, rating: 4.9, languages: ["English", "Hindi"], phone: "+911125750000", fee: "₹1800", hours: "10am–6pm", emergency: false, online: true, specialty: "Menopause care",
    qualifications: "MBBS, MD, Menopause Society Certified", bio: "Three decades of expertise in perimenopause, bone health, and hormone replacement therapy. Combines conventional medicine with yoga and Ayurvedic wellness for a whole-body approach." },
  { name: "Dr. Nisha Aggarwal", clinic: "BLK-Max, Pusa Road", city: "Delhi", experience: 17, rating: 4.7, languages: ["English", "Hindi"], phone: "+911130403040", fee: "₹1200", hours: "24×7", emergency: true, online: true, specialty: "IVF & infertility",
    qualifications: "MBBS, MD, Fellowship Reproductive Medicine", bio: "IVF specialist with a strong track record in unexplained infertility and recurrent pregnancy loss. Transparent about success rates and never pushes procedures you don't need." },
  // Bangalore
  { name: "Dr. Kavita Reddy", clinic: "Cloudnine, Jayanagar", city: "Bangalore", experience: 11, rating: 4.7, languages: ["English", "Kannada", "Telugu"], phone: "+918049699999", fee: "₹900", hours: "24×7", emergency: true, online: true, specialty: "Pregnancy & birth",
    qualifications: "MBBS, MS (OBGY), DNB", bio: "Champion of respectful, low-intervention birth. Runs prenatal classes with partners welcome, and is fiercely on your side for VBAC and water-birth choices where medically safe." },
  { name: "Dr. Lakshmi Rao", clinic: "Manipal, Old Airport Rd", city: "Bangalore", experience: 24, rating: 4.8, languages: ["English", "Kannada", "Tamil"], phone: "+918025023344", fee: "₹1100", hours: "9am–10pm", emergency: false, online: true, specialty: "PCOS",
    qualifications: "MBBS, MD (OBGY), Diabetes in Pregnancy Cert.", bio: "PCOS expert who treats hormones, insulin, and mental health together. Publishes a quarterly newsletter on new PCOS research in plain language — ask her clinic to add you to the list." },
  { name: "Dr. Smitha Iyer", clinic: "Aster CMI, Hebbal", city: "Bangalore", experience: 16, rating: 4.6, languages: ["English", "Hindi", "Malayalam"], phone: "+918043420100", fee: "₹1000", hours: "24×7", emergency: true, online: true, specialty: "Adolescent & teen",
    qualifications: "MBBS, MD (OBGY), Adolescent Health Cert.", bio: "Approachable specialist who works closely with schools on menstrual health workshops. Excellent at explaining vaccines (HPV, Gardasil) and first-period care to both teens and their parents." },
  // Hyderabad
  { name: "Dr. Padma Rani", clinic: "Rainbow Children's, Banjara Hills", city: "Hyderabad", experience: 20, rating: 4.9, languages: ["English", "Telugu", "Hindi"], phone: "+914044665555", fee: "₹800", hours: "24×7", emergency: true, online: true, specialty: "Maternity",
    qualifications: "MBBS, MD (OBGY), FICOG", bio: "Has delivered over 5,000 babies across two decades. Known for calm 3 am labour-room energy and unwavering support for feeding choices — breast, bottle, or both." },
  { name: "Dr. Anitha Krishnan", clinic: "Apollo, Jubilee Hills", city: "Hyderabad", experience: 18, rating: 4.7, languages: ["English", "Telugu", "Tamil"], phone: "+914023607777", fee: "₹1000", hours: "10am–8pm", emergency: false, online: true, specialty: "Hormonal disorders",
    qualifications: "MBBS, MD, DNB Reproductive Endocrinology", bio: "Deep expertise in thyroid, PCOS, and adrenal issues. Requests only the tests you actually need — no upselling — and walks you through every lab result personally." },
  // Pune
  { name: "Dr. Shruti Deshmukh", clinic: "Jehangir Hospital, Sassoon Rd", city: "Pune", experience: 15, rating: 4.7, languages: ["English", "Marathi", "Hindi"], phone: "+912066819999", fee: "₹900", hours: "24×7", emergency: true, online: true, specialty: "General gynae",
    qualifications: "MBBS, MS (OBGY)", bio: "Your friendly-neighbourhood gynae for annual check-ups, contraception counselling, and everyday period concerns. Runs a free WhatsApp help line for previous patients." },
  { name: "Dr. Pooja Kulkarni", clinic: "Sahyadri, Kothrud", city: "Pune", experience: 12, rating: 4.6, languages: ["English", "Marathi"], phone: "+912067213000", fee: "₹800", hours: "9am–9pm", emergency: false, online: true, specialty: "PCOD & lifestyle",
    qualifications: "MBBS, DGO, Certified Lifestyle Medicine", bio: "Believes food and movement are medicine. Pairs medical treatment with 1:1 nutrition plans for PCOD, insulin resistance, and thyroid — recipes included." },
  // Chennai
  { name: "Dr. Lakshmi Subramanian", clinic: "Apollo, Greams Road", city: "Chennai", experience: 23, rating: 4.8, languages: ["English", "Tamil"], phone: "+914428290200", fee: "₹1100", hours: "24×7", emergency: true, online: true, specialty: "High-risk pregnancy",
    qualifications: "MBBS, MD (OBGY), Fellowship Maternal-Fetal Medicine", bio: "Trusted for twin and high-risk pregnancies across Tamil Nadu. Coordinates with paediatricians and anaesthetists early so your birth plan has no surprises." },
  { name: "Dr. Revathi Murugan", clinic: "MIOT, Manapakkam", city: "Chennai", experience: 19, rating: 4.7, languages: ["English", "Tamil", "Malayalam"], phone: "+914422492288", fee: "₹950", hours: "10am–7pm", emergency: false, online: true, specialty: "Endometriosis",
    qualifications: "MBBS, MS, Advanced Laparoscopy Cert.", bio: "Minimal-access surgeon for endometriosis and fibroids. Specialises in fertility-preserving procedures and second opinions for surgery decisions." },
  // Kolkata
  { name: "Dr. Ananya Banerjee", clinic: "AMRI Dhakuria", city: "Kolkata", experience: 21, rating: 4.8, languages: ["English", "Bengali", "Hindi"], phone: "+913366800000", fee: "₹850", hours: "24×7", emergency: true, online: true, specialty: "Maternity & IVF",
    qualifications: "MBBS, MD (OBGY), Fellowship IVF (UK)", bio: "Combines maternity care with fertility support under one roof. Compassionate with pregnancy loss and known for follow-up calls the day after every difficult consultation." },
  { name: "Dr. Ritika Bansal", clinic: "Apollo Gleneagles, Salt Lake", city: "Kolkata", experience: 9, rating: 4.6, languages: ["English", "Hindi", "Bengali"], phone: "+913323203040", fee: "₹700", hours: "9am–9pm", emergency: false, online: true, specialty: "Adolescent gynae",
    qualifications: "MBBS, DNB (OBGY)", bio: "Younger practitioner who gets that Gen Z has different questions. Active on social media with reels about first periods, cramps, and PCOS myths — a favourite with college students." },
  // Ahmedabad
  { name: "Dr. Hetal Shah", clinic: "Sterling Hospital, Memnagar", city: "Ahmedabad", experience: 16, rating: 4.7, languages: ["English", "Gujarati", "Hindi"], phone: "+917940013000", fee: "₹800", hours: "24×7", emergency: true, online: true, specialty: "General gynae",
    qualifications: "MBBS, MD (OBGY), FICOG", bio: "Reliable, no-fuss gynaecologist for cycle irregularities, UTIs, and preventive check-ups. Runs a Saturday-morning free camp for women from rural Gujarat every month." },
];



export function doctorId(name: string) {
  return name.toLowerCase().replace(/^dr\.?\s*/, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Realistic portrait photos (stable per doctor).
const PHOTO_IDX = [44, 65, 68, 79, 12, 33, 90, 21, 57, 26, 47, 72, 8, 36, 50, 61, 17, 85];

export const DOCTORS: Doc[] = DOCTORS_RAW.map((d, i) => ({
  ...d,
  id: doctorId(d.name),
  photo: `https://randomuser.me/api/portraits/women/${PHOTO_IDX[i % PHOTO_IDX.length]}.jpg`,
}));

export const CITIES = Array.from(new Set(DOCTORS.map((d) => d.city))).sort();

export function findDoctor(id: string | null | undefined) {
  return DOCTORS.find((d) => d.id === id) ?? null;
}
