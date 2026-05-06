import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "app_name": "Local Bazaar",
      "login_phone": "Enter Phone Number",
      "login_btn": "Login",
      "home_feed": "Local Feed (5km)",
      "order_3_taps": "Order in 3 Taps",
      "no_minimum": "No Minimum Order",
      "call_us": "Call Us (Helpline)",
      "free_delivery": "100% Free Delivery",
      "export_data": "Export Data Backup",
      "offline_mode": "Offline Mode Active",
      "distance": "Distance",
      "buy_now": "Buy Now",
      "voice_message": "Send Voice Message",
      "premium_offer": "6 Months Free Premium"
    }
  },
  hi: {
    translation: {
      "app_name": "लोकल बाज़ार",
      "login_phone": "फ़ोन नंबर दर्ज करें",
      "login_btn": "लॉग इन करें",
      "home_feed": "लोकल फ़ीड (5किमी)",
      "order_3_taps": "3 टैप में ऑर्डर करें",
      "no_minimum": "कोई न्यूनतम ऑर्डर नहीं",
      "call_us": "हमें कॉल करें (हेल्पलाइन)",
      "free_delivery": "100% मुफ़्त डिलीवरी",
      "export_data": "डेटा बैकअप एक्सपोर्ट करें",
      "offline_mode": "ऑफ़लाइन मोड सक्रिय",
      "distance": "दूरी",
      "buy_now": "अभी खरीदें",
      "voice_message": "वॉयस मैसेज भेजें",
      "premium_offer": "6 महीने का मुफ़्त प्रीमियम"
    }
  },
  bho: {
    translation: {
      "app_name": "हमार बजार",
      "login_phone": "फोन नंबर डालीं",
      "login_btn": "लॉगिन करीं",
      "home_feed": "आस-पास के खबर (5km)",
      "order_3_taps": "3 बेर दाबि के ऑर्डर करीं",
      "no_minimum": "कौनो कम से कम ऑर्डर ना",
      "call_us": "हमनी के फोन करीं (हेल्पलाइन)",
      "free_delivery": "एकदम मुफ़्त पहुँचावल जाई",
      "export_data": "डेटा निकालल जाव",
      "offline_mode": "ऑफ़लाइन बा",
      "distance": "दूरी",
      "buy_now": "अभी खरीदीं",
      "voice_message": "आवाज के संदेस भेजीं",
      "premium_offer": "6 महिना फ्री प्रीमियम"
    }
  },
  mr: {
    translation: {
      "app_name": "लोकल बाजार",
      "login_phone": "फोन नंबर टाका",
      "login_btn": "लॉग इन करा",
      "home_feed": "स्थानिक फीड (5 किमी)",
      "order_3_taps": "3 टॅप्समध्ये ऑर्डर करा",
      "no_minimum": "किमान ऑर्डर नाही",
      "call_us": "आम्हाला कॉल करा (हेल्पलाइन)",
      "free_delivery": "100% मोफत डिलिव्हरी",
      "export_data": "डेटा एक्सपोर्ट करा",
      "offline_mode": "ऑफलाइन मोड सक्रिय",
      "distance": "अंतर",
      "buy_now": "आता खरेदी करा",
      "voice_message": "व्हॉइस मेसेज पाठवा",
      "premium_offer": "6 महिने मोफत प्रीमियम"
    }
  },
  bn: {
    translation: {
      "app_name": "লোকাল বাজার",
      "login_phone": "ফোন নম্বর লিখুন",
      "login_btn": "লগ ইন করুন",
      "home_feed": "লোকাল ফিড (৫কিমি)",
      "order_3_taps": "৩ ট্যাপে অর্ডার করুন",
      "no_minimum": "কোনো ন্যূনতম অর্ডার নেই",
      "call_us": "আমাদের কল করুন (হেল্পলাইন)",
      "free_delivery": "১০০% বিনামূল্যে ডেলিভারি",
      "export_data": "ডেটা এক্সপোর্ট করুন",
      "offline_mode": "অফলাইন মোড সক্রিয়",
      "distance": "দূরত্ব",
      "buy_now": "এখন কিনুন",
      "voice_message": "ভয়েস মেসেজ পাঠান",
      "premium_offer": "৬ মাসের ফ্রি প্রিমিয়াম"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", 
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
