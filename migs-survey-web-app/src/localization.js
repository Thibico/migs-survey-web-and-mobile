// import _ from 'lodash';
import Rabbit from "rabbit-node";

export const l10nMain = (s,l) => {
  let returnString = '';
  if (l === 'en') {
    returnString = s;
  } else {
    // console.log(s);
    if(typeof s === 'string') {
      returnString = translateString(s,l);
    } else if (Array.isArray(s)){
      returnString = s;
      // return s.forEach(item => item.label = translateString(item.label));
    } else if (typeof s === 'number' && Number.isInteger(s)) {
      returnString = translateNumber(s);
    }
  }
  return returnString;
}



const translateNumber = (number) => {
  let digits = number.toString().split('');
  digits = digits.map(d => {
    switch(d) {
      case '0':
        return '၀';
      case '1':
        return '၁';
      case '2':
        return '၂';
      case '3':
        return '၃';
      case '4':
        return '၄';
      case '5':
        return '၅';
      case '6':
        return '၆';
      case '7':
        return '၇';
      case '8':
        return '၈';
      case '9':
        return '၉';
      default:
        return d;
    }
  })
  digits = digits.join('')
  // console.log(digits);
  return digits;
}

export const replaceMMNumbers = (s) => {
  s = s.toString();
  s = s.split("၀").join("0");
  s = s.split("၁").join("1");
  s = s.split("၂").join("2");
  s = s.split("၃").join("3");
  s = s.split("၄").join("4");
  s = s.split("၅").join("5");
  s = s.split("၆").join("6");
  s = s.split("၇").join("7");
  s = s.split("၈").join("8");
  s = s.split("၉").join("9");
  return s;
}

const lookup = (() => {

  let lookup = {
    '0(a)': '၀(က)',
    '0(b)': '၀(ခ)',
    'which state/region is this questionnaire being administered in?': 'စစ်တမ်းကောက်သည့် ပြည်နယ်(သို့)တိုင်းဒေသကြီး',
    'ayeyarwaddy': 'ဧရာဝတီ',
    'chin': 'ချင်း',
    'kayin': 'ကရင်',
    'mandalay': 'မန္တလေး',
    'mon': 'မွန်',
    'yes, recorded': 'ရှိပါသည်။',
    'no, not recorded': 'မရှိပါ။',
    
    'was this household recorded on the household list?': 'ဤအိမ်ထောင်စုသည် ရပ်ကွက်/ ကျေးရွာတွင် စာရင်း၀င်/ စာရင်းပေါက်မှု ရှိပါသလား။',
    'january': 'ဇန်နဝါရီ',
    'february': 'ဖေဖော်ဝါရီ',
    'march': 'မတ်',
    'april': 'ဧပြီ',
    'may': 'မေ',
    'june': 'ဇွန်',
    'july': 'ဇူလိုင်',
    'august': 'သြဂုတ်',
    'september': 'စက်တင်ဘာ',
    'october': 'အောက်တိုဘာ',
    'november': 'နိုဝင်ဘာ',
    'december': 'ဒီဇင်ဘာ',
    'question': 'မေးခွန်း',
    'reset': 'မူရင်းအတိုင်း',
    'ward/village code number':'ရပ်ကွက်/ ကျေးရွာ ၏ ကုဒ်နံပါတ်',
    'what is your age?':'သင့်အသက်ကိုဖော်ပြပါ။',
    'what is your sex?':'ကျား သို့ မ ကိုဖော်ပြပါ။',
    'male':'ကျား',
    'female':'မ',
    'did not answer':'မဖြေပါ',
    'what is your relationship to the head of household?':'အိမ်ထောင်ဦးစီးနှင့် တော်စပ်ပုံ',
    'head':'အိမ်ထောင်ဦးစီး',
    'wife/husband':'ဇနီး /ခင်ပွန်း',
    'daughter/son':'သမီး/သား',
    'elder or younger sister/elder or younger brother':'ညီမ/အစ်မ/ညီ/အစ်ကို',
    'daughter-in-law/son-in-law':'ချွေးမ/သားမက်',
    'sister-in-law/brother-in-law':'ယောက်မ/ခဲအို',
    'grandchild':'မြေး',
    'parent':'မိဘ',
    'parent-in-law':'ယောက္ခမ',
    'other relative':'အခြားသောတော်စပ်ပုံ',
    'adopted/foster/step child':'မွေးစား/ စောင့်ရှောက်/ မယားပါ၊ လင်ပါ သားသမီး',
    'not related':'မတော်စပ်ပါ',
    'don’t know':'မသိပါ',
    'what is your marital status?':'အိမ်ထောင်ရေးအခြေအနေ',
    'married or living together':'လက်ထပ် သို့ အတူနေထိုင်ခြင်း',
    'divorced/separated':'ကွာရှင်း သို့ ခွဲခွာ၍နေထိုင်ခြင်း',
    'widowed':'မုဆိုးမ/ဖို',
    'never married and never lived together':'လက်မထပ်ထားခြင်း သို့ အတူလုံးဝမနေခြင်း',
    'what is your ethnicity?':'ဘာလူမျိုးလဲ။',
    'what is your religion?':'ကိုးကွယ်သည့်ဘာသာကိုဖော်ပြပါ။',
    'buddhist':'ဗုဒ္ဒဘာသာ',
    'christian':'ခရစ်ယာန်',
    'muslim':'မူစလင်',
    'hindu':'ဟိန္ဒူ',
    'animist':'နတ်ကိုးကွယ်',
    'other religion':'အခြားသောဘာသာ',
    'no religion':'ဘာသာမဲ့',
    'what is the highest level of education you have completed?':'အမြင့်ဆုံးပြီးစီးခဲ့သော ပညာရေး/ အတန်းပညာ',
    'less than 1st standard':'၁ တန်းအောက်',
    '1st standard':'၁ တန်း',
    '2nd standard':'၂ တန်း',
    '3rd standard':'၃ တန်း',
    '4th standard':'၄ တန်း',
    '5th standard':'၅ တန်း',
    '6th standard':'၆ တန်း',
    '7th standard':'၇ တန်း',
    '8th standard':'၈ တန်း',
    '9th standard':'၉ တန်း',
    '10th standard':'၁၀ တန်း',
    'bachelor’s degree':'ဘွဲ့ရ',
    'postgraduate degree':'ဘွဲ့လွန်',
    'vocational qualification':'အသက်မွေးဝမ်းကျောင်းပညာ',
    'what was your activity status during the last 12 months?':'လွန်ခဲ့သော ၁၂ လအတွင်း သင့်အလုပ်အကိုင်အခြေအနေကိုဖော်ပြပါ။ ',
    '1 - employee (government)':'၁ - အစိုးရဝန်ထမ်း',
    '2 - employee (private, org)':'၂ - အဖွဲ့အစည်းသို့ ကုမ္ပဏီဝန်ထမ်း',
    '3 - employer':'၃ - အလုပ်ရှင်',
    '4 - own account worker':'၄ - ကိုယ်ပိုင်လုပ်ငန်းလုပ်သူ',
    '5 - contributing family worker':'၅ - မိသားစုလုပ်ငန်းတွင်ကူညီသူ',
    '6 - sought work':'၆ - အလုပ်ရှာဖွေနေသူ',
    '7 - did not seek work':'၇ - အလုပ်လက်မဲ့',
    '8 - full-time student':'၈ - အချိန်ပြည့်ကျောင်းသား/သူ',
    '9 - household work':'၉ - အိမ်မှု ကိစ္စလုပ်သူ',
    '10 - pensioner, retired, elderly person':'၁၀ - ပင်စင်စား၊ အနားယူ၊ သက်ကြီးရွယ်အို',
    '11 - ill, disabled':'၁၁ - ဖျားနာ၊မသန်စွမ်းသူ',
    '12 - other':'၁၂ - အခြား',
    '(for those that responded with 1-5 or 12 to q11), what work were you mainly doing in the last 12 months?':'အထက်ပါ မေးခွန်း ၁၁ တွင် အချက် ၁ မှ ၅ (သို့) ၁၂ ဖြေကြားသူများသည် လွန်ခဲ့သော ၁၂ လ အတွင်း မည်သို့သော အလုပ်ကို အဓိကလုပ်ပါသလဲ။',
    'do you own a mobile telephone?':'လက်ကိုင်ဖုန်းပိုင်ဆိုင်ပါသလား။',
    'yes':'ပိုင်ဆိုင်ပါသည်',
    'no':'မပိုင်ဆိုင်ပါ',
    'was the survey done at the first house you visited?':'သင် ပထမဆုံး ရောက်ရှိခဲ့သော အိမ်တွင် စစ်တမ်းကောက်ယူမှု ပြုလုပ်ခဲ့ပါသလား။',
    'yes, it was':'ပြုလုပ်ခဲ့ပါသည်။',
    'no, it was not':'မပြုလုပ်ခဲ့ပါ။ ', 
    'connected': 'ဆက်စပ်သည်။',
    'not connected': 'ဆက်စပ်မှုမရှိပါ။',
    'yes, they have the right' : 'သုံးစွဲခွင့် ရရှိပါသည်။',
    'no, they do not have the right': 'သုံးစွဲခွင့် မရှိပါ။',
    'yes to ownership' : 'ရှိပါသည်။',
    'no to ownership' : 'မရှိပါ။',
    'does anyone else in your household own a mobile telephone?':'အခြားသော သင့်မိသားစုဝင်များ လည်း လက်ကိုင်ဖုန်းပိုင်ဆိုင်ပါသလား။',
    'allocate the union budget across the following ministries':'ပြည်ထောင်စုဘတ်ဂျက်ကို အောက်ပါဝန်ကြီးဌာနများ သို့ ခွဲဝေချထားပေးပါ။',
    'allocate the kayin regional government budget across the following ministries':'ကရင်ပြည်နယ်ဘတ်ဂျက်ကို အောက်ပါဝန်ကြီးဌာနများ သို့ ခွဲဝေချထားပေးပါ။',
    'allocate the budget between union and region/state level governments':'ပြည်ထောင်စုအဆင့်နှင့် တိုင်းဒေသကြီး / ပြည်နယ်အဆင့်အစိုးရများအကြား ဘတ်ဂျက်ခွဲဝေချထားပေးပါ။',
    'this survey started at':'ဒီစစ်တမ်း စတင်သည့်အချိန်',
    'submit questionnaire':'စစ်တမ်းအဖြေတင်သွင်း',
    'start questionnaire':'စစ်တမ်း စတင်ကောက်ယူပါမည်',
    'electricity and energy':'လျှပ်စစ်နှင့်စွမ်းအင်',
    'defence':'ကာကွယ်ရေး',
    'education':'ပညာရေး',
    'agriculture, livestock and irrigation':'စိုက်ပျိုးရေး, မွေးမြူရေးနှင့်ဆည်မြောင်း',
    'health and sports':'ကျန်းမာရေးနှင့်အားကစား',
    'home affairs':'ပြည်ထဲရေး',
    'unused percentage points':'အသုံးမပြုသေးတဲ့ရာခိုင်နှုန်းပိုင့်',
    'construction':'ဆောက်လုပ်ရေး',
    'electricity':'လျှပ်စစ်',
    'state government bodies':'ပြည်နယ်အစိုးရအဖွဲ့အစည်းများ',
    'municipal-daos':'စည်ပင်သာယာ နှင့် ခရိုင်ရုံးများ',
    'union':'ပြည်ထောင်စု',
    'region/state':'တိုင်းဒေသကြီး / ပြည်နယ်',
    'seconds': 'စက္ကန့်',
    'submitted today': 'ယနေ့တင်သွင်းပြီး',
    'pending': 'တင်သွင်းရန်',
    'enumerator name': 'စစ်တမ်းကောက်ယူသူအမည်',
    'submitted total today': 'ယနေ့တင်သွင်းပြီးစုစုပေါင်း',
    'submitted total all time': 'စစ်တမ်းကာလတင်သွင်းပြီးစုစုပေါင်း',
    'submitting': 'ဒေတာတင်သွင်းနေပါသည်',
    'data submitted': 'ဒေတာတင်သွင်း‌ခြင်း ‌အောင်မြင်သွားပါပြီ',
    'unable to answer': 'မဖြေနိုင်ပါ',
    'how many people live in this household in total?': 'ဤအိမ်ထောင်စုတွင် လူဦးရေ စုစုပေါင်း မည်မျှ နေထိုင်ပါသနည်း။ ',
    "what is the highest education level that the female household head or spouse of household head has completed?": 'အိမ်ထောင်စုကို ဦးဆောင်သော အမျိုးသမီး (သို့မဟုတ်) အိမ်ရှင်မ ၏ တက်ရောက် ပြီးစီးအောင်မြင်ခဲ့သော အတန်းပညာအရည်အချင်း ကို ဖော်ပြပါ။ ',
    "no female head/spouse": 'အိမ်ထောင်စုကို ဦးဆောင်သော အမျိုးသမီးမရှိ/ အိမ်ရှင်မ မရှိ',
    "no education/kindergarten/first standard": 'အတန်းပညာမရှိ/မူကြို မတက်ဘူးပါ /ပထမတန်း မတက်ဘူးပါ။',
    "second standard": 'ဒုတိယတန်း ',
    "third to fifth standard": 'တတိယတန်း မှ ပဉ္စမတန်း ',
    "sixth standard or higher": 'ဆဠမတန်း သို့ ဆဠမတန်း အထက်',
    "how many rooms does the household occupy, including bedrooms, living rooms, and rooms used for household businesses (do not count toilets, kitchens, balconies, or corridors)?": 'အိမ် တွင် အခန်းအရေအတွက် (အိပ်ခန်း၊ ဧည့်ခန်း၊ နှင့် အခြား အခန်း) မည်မျှ ရှိပါသနည်း။ (အိမ်သာ၊ မီးဖိုချောင်နှင့် ဝရန်တာ၊ လျှောက်လမ်းများကို ထည့်သွင်းမရေတွက်ပါ)',
    "one or none": 'တစ်ခန်း သို့မဟုတ် အခန်းဖွဲ့ထားခြင်းမရှိ',
    "two": 'နှစ်ခန်း ',
    "three": 'သုံးခန်း ',
    "four": 'လေးခန်း ',
    "five or more": 'ငါးခန်း နှင့် အထက် ',
    "what type of stove is used most often for cooking food in the household?": 'မိသားစု အတွက် အစားအသောက် ချက်ပြုတ်ရာတွင် မည်သည့် မီးဖိုအမျိုးအစားကို သုံးစွဲပါသနည်း။ ',
    "open fire, open stove, rice-hush stove or traditional closed stove": 'ထင်းမီး၊ ရိုးရိုးမီးဖို၊ စပါးခွံမီးဖို သို့မဟုတ် ဒေသသုံးမီးဖို',
    "improved stove, stove with electricity, gas, kerosene/diesel or biofuel": 'လျှပ်စစ်/ ဂတ်စ် / ရေနံဆီ/ ဒီဇယ် သို့ မီးသွေး၊ ထင်း မီးဖို',
    "does any household member own or have access to a bicycle or non-motorized boat, a motorcycle, power tiller, trishaw, motorboat, trawlarjee, three-wheeled motor vehicle, motorcar (4 wheels or more), or tractor (including one rented to others or pawned)?": 'မိသားစုဝင် တစ်ဦးဦးတွင် စက်ဘီးသို့မဟုတ် ရိုးရိုးလှေ၊ ဆိုင်ကယ်၊ လယ်ထွန်စက်သေး၊ ဆိုက်ကား၊ စက်လှေ၊  ထော်လာဂျီ၊ သုံးဘီးဆိုင်ကယ် (တုတ်တုတ်) ၊ မော်တော်ကား (လေးဘီး သို့ လေးဘီးအထက်)၊ သို့မဟုတ် လယ်ထွန်စက်ကြီး စသည့်  ပစ္စည်းတစ်ခုခု ပိုင်ဆိုင်ပါသလား။ (အခြားသူတစ်ဦးဦးကို ငှားရမ်းထားသည့် (သို့မဟုတ်) ပေါင်နှံထားသည့် ပစ္စည်းများလည်း ပါဝင်ပါသည်။)',
    "none of these": 'တစ်ခုမှ မပိုင်ဆိုင်ပါ။',
    "only bicylce or non-motorized boat": 'စက်ဘီး သို့မဟုတ် လှေ တစ်မျိုးတည်းသာ ပိုင်ဆိုင်ပါသည်။',
    "motorcycle, power tiller, thrishaw, motroboat, trawlarjee, three-wheeld motor vehicle, motorcar or tractor": 'ဆိုင်ကယ်၊လယ်ထွန်စက်သေး၊ ဆိုက်ကား၊ စက်လှေ၊ ထော်လာဂျီ၊ သုံးဘီး ဆိုင်ကယ် (တုတ်တုတ်)၊ မော်တော်ကား (သို့)  လယ်ထွန်စက်ကြီး',
    "is the main job of any household member connected with agriculture, hunting, forestry, fishery, mining, or quarrying?": 'မိသားစုဝင်တစ်ဦးဦး ၏ အဓိက အသက်မွေးဝမ်းကျောင်း လုပ်ငန်းသည် စိုက်ပျိုးရေး၊ အမဲလိုက်ခြင်း၊ သစ်တောလုပ်ငန်း၊ ငါးလုပ်ငန်း၊ သတ္ထုတူးဖော်ခြင်း (သို့မဟုတ်) ကျောက်ကျင်းတူးဖော်ခြင်း လုပ်ငန်းတစ်ခုခုနှင့် ဆက်စပ်နေပါသလား။',
    "if yes to q20, do they have the right to use land for agriculture, forestry, pasture, livestock breeding, or water surfaces?": 'အကယ်၍ ဆက်စပ်ပါက စိုက်ပျိုးရေးလုပ်ငန်း၊ သစ်တောလုပ်ငန်း၊ စားကျက်မြေ၊ မွေးမြူရေး (သို့) ရေ နှင့်ဆိုင်သောလုပ်ငန်းများ၏ လိုအပ်ချက်များအတွက် မြေယာသုံးစွဲခွင့် ရရှိပါသလား။',
    "if yes to q21, does the household own any non-draught oxen, non-draught buffalo, cows, mythun, horses, or donkeys/mules (including ones rented to others or pawned to others)?": 'အကယ်၍ မြေယာ သုံးစွဲခွင့် ရှိပါက မိမိတို့အိမ် တွင်  မွေးမြူရေး နွားထီး၊ မွေးမြူရေးကျွဲ၊ နို့စားနွားမများ၊ နွားနောက်၊ မြင်း (သို့) မြည်း စသည့် တိရစ္ဆာန်များ ရှိပါသလား။  (အခြားသူတို့ထံ ငှားရမ်းထားသော သို့မဟုတ် ပေါင်နှံထားသော တိရစ္ဆာန်များလည်း ပါဝင်ပါသည်)',
    "what is the major construction material of the floor of their home (observe, do not ask)?": 'အိမ်၏ ကြမ်းခင်းကို မည်သည့် ပစ္စည်းဖြင့် ဆောက်လုပ်ထားပါသနည်း။ (စစ်တမ်းကောက်ယူသူမှ လေ့လာရန်၊ ဖြေဆိုသူကို မမေးပါနှင့်။)',
    "earth/sand, palm/bamboo, combination earth and wood/palm/bamboo or other": 'မြေသားခင်း/ သဲခင်း၊ ထန်းလက်ခင်း/ ဝါးကြမ်းခင်း၊ မြေသားနှင့် ပျဉ်ခင်း/ ထန်းလက်ခင်း/ ဝါးကြမ်းခင်း (သို့မဟုတ်) အခြား',
    "wood planks, parquet or polished wood, cement, wood/cement with covering or combination of cement/wood and something else": 'သစ်ခင်း၊ ပါကေး (သို့မဟုတ်) ပေါ်လစ်တင်ထားသော ပျဉ်ခင်း၊ အင်္ဂတေခင်း၊  သစ်သား/ အင်္ဂတေခင်း (သို့မဟုတ်) အင်္ဂတေခင်း/ သစ်သား နှင့် အခြား ရောစပ်ခင်းခြင်း။',
    "what is the major construction material of the external (outer) walls of their home (observe, do not ask)?": 'အိမ်၏ နံရံကို မည်သည့် ပစ္စည်းဖြင့် ဆောက်လုပ်ထားပါသနည်း။ (စစ်တမ်းကောက်ယူသူမှ လေ့လာရန်၊ ဖြေဆိုသူကို မမေးပါနှင့်။)',
    "thatch/large leaves/palm/dhani or tarpaulin": 'သက်ကယ်/ သစ်ရွက်/ ထန်းလက်ကာ/ဓနိ (သို့မဟုတ်) တာပေါ်လင် ပလတ်စတစ်',
    "bamboo or rudimentary wood": 'ဝါးကပ်ကာ သို့မဟုတ် သစ်ကြမ်း',
    "unbaked brick and mud, finished wood": 'အုတ် အစိမ်း (နေလှန်းအုတ်) နှင့် ရွှံ့၊ သစ်ချော',
    "baked brick and cement or pucca cement": 'အုတ်ကျက် (မီးဖုတ်အုတ်) နှင့် အင်္ဂတေ သို့မဟုတ် ပတ်ကား အင်္ဂတေ',
  }

  return lookup;
})();

const translateString = (s,l) => {
  let sen = s.toLowerCase();
  sen= sen.split('|')[1] ? sen.split('|')[1] : sen;
  sen = sen.trim()

  // console.log(sen);
  // console.log(lookup);
  var smm = '';
  if (l === 'mm') {
    smm = lookup[sen] ? lookup[sen] : s;
  } else if ( l === 'zg') {
    // convert to Zawgyi
    smm = lookup[sen] ? Rabbit.uni2zg(lookup[sen]) : s;
  }

  return smm;
}
