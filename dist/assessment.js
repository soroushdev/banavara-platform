(() => {
  const intro = document.querySelector('#intro');
  const wizard = document.querySelector('#wizard');
  const result = document.querySelector('#result');
  const form = document.querySelector('#assessment-form');
  const steps = [...document.querySelectorAll('.step')];
  const next = document.querySelector('#next');
  const back = document.querySelector('#back');
  const error = document.querySelector('#form-error');
  const progressText = document.querySelector('#progress-text');
  const progressPercent = document.querySelector('#progress-percent');
  const progressBar = document.querySelector('#progress-bar');
  let current = 0;

  const labels = {
    goal:{sale:'فروش بهتر',rent_long:'اجاره بلندمدت بهتر',rent_short:'اجاره کوتاه‌مدت بهتر',live:'سکونت و آسایش',restore:'احیای ملک رهاشده'},
    type:{villa:'ویلا',apartment:'آپارتمان',house:'خانه قدیمی',commercial:'ملک تجاری',other:'سایر'},
    location:{chalus:'چالوس و هچیرود',nowshahr:'نوشهر و سیسنگان',mountain:'مرزن‌آباد و کلاردشت',other:'سایر نقاط مازندران'},
    area:{small:'کمتر از ۱۰۰ متر',medium:'۱۰۰ تا ۲۰۰ متر',large:'۲۰۰ تا ۳۵۰ متر',xlarge:'بیشتر از ۳۵۰ متر'},
    age:{new:'کمتر از ۵ سال',mid:'۵ تا ۱۵ سال',old:'۱۵ تا ۳۰ سال',veryold:'بیشتر از ۳۰ سال'},
    issue:{appeal:'ظاهر قدیمی یا جذابیت پایین',visits:'بازدید بدون پیشنهاد',underpriced:'ارزیابی پایین‌تر از قیمت منطقه',damp:'نم، فرسودگی یا خرابی',systems:'برق، تأسیسات یا آسایش',layout:'پلان نامناسب',outdoor:'محوطه، ورودی یا امنیت'}
  };

  const issueData = {
    appeal:{priority:'ظاهر و ارائه ملک',text:'قبل از هزینه سنگین، رنگ، نور، ورودی، جزئیات و شیوه ارائه ملک باید بررسی شوند.',recs:['رنگ، نور و اولین تصویری که خریدار می‌بیند','نقاط فرسوده‌ای که ملک را کم‌ارزش نشان می‌دهند','عکاسی و ارائه حرفه‌ای پس از اصلاحات'],weight:17},
    visits:{priority:'مانع تصمیم خریدار',text:'تفاوت میان عکس آگهی و تجربه بازدید، قیمت‌گذاری و ایرادهای محسوس داخل ملک باید جداگانه بررسی شوند.',recs:['ورودی و پنج دقیقه اول بازدید','ایرادهای واضحی که اعتماد خریدار را کم می‌کنند','تناسب هزینه بازسازی با قیمت پیشنهادی ملک'],weight:22},
    underpriced:{priority:'علت شکاف قیمت با منطقه',text:'اول باید مشخص شود اختلاف قیمت از وضعیت ظاهری و فنی ملک است یا از سند، دسترسی، پارکینگ، موقعیت دقیق یا قیمت‌گذاری. بازسازی فقط بخش‌های قابل اصلاح را حل می‌کند.',recs:['مقایسه با ملک‌های واقعاً هم‌موقعیت و هم‌مشخصات','تفکیک ایرادهای حقوقی و مکانی از مشکلات قابل بازسازی','محاسبه هزینه اصلاحات در برابر اثر احتمالی بر جذابیت ملک'],weight:24},
    damp:{priority:'منشأ نم و خرابی',text:'پوشاندن نم با رنگ راه‌حل نیست؛ ابتدا باید منشأ رطوبت و میزان آسیب مشخص شود.',recs:['منشأ نفوذ یا تجمع رطوبت','سلامت زیرسازی، کف و دیوارهای مجاور','ترتیب صحیح خشک‌سازی، تعمیر و پوشش نهایی'],weight:28},
    systems:{priority:'عملکرد و مصرف انرژی',text:'برق، سرمایش و گرمایش، نشتی‌ها و تجهیزات فرسوده می‌توانند هم هزینه سکونت و هم اعتماد خریدار را پایین بیاورند.',recs:['ظرفیت و ایمنی برق و تابلو','وضعیت سرمایش، گرمایش و تهویه','راه‌های کاهش اتلاف انرژی و برق پشتیبان'],weight:25},
    layout:{priority:'کارکرد فضا و پلان',text:'هر جابه‌جایی دیوار مفید نیست؛ ابتدا باید گردش، نور، مبلمان‌پذیری و محدودیت سازه و تأسیسات بررسی شوند.',recs:['مسیر حرکت و استفاده واقعی از فضا','نورگیری و امکان چیدمان مناسب','محدودیت سازه‌ای و تأسیساتی تغییرات'],weight:21},
    outdoor:{priority:'ورودی، محوطه و حفاظت',text:'نمای ورودی و محوطه روی برداشت اولیه اثر دارند و نقاط نفوذ یا تجهیزات بی‌حفاظ نیز باید بررسی شوند.',recs:['زهکشی، مسیر آب و وضعیت محوطه','درب، پنجره، دیوار و نقاط ساده نفوذ','حفاظت پمپ، کولر، کابل و تجهیزات بیرونی'],weight:23}
  };

  function toFa(value){return String(value).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);}
  function answer(name){return form.elements[name].value;}
  function updateStep(){
    steps.forEach((step,index)=>step.classList.toggle('active',index===current));
    const percent = Math.round(((current+1)/steps.length)*100);
    progressText.textContent = `سؤال ${toFa(current+1)} از ${toFa(steps.length)}`;
    progressPercent.textContent = `${toFa(percent)}٪`;
    progressBar.style.width = `${percent}%`;
    back.hidden = current===0;
    next.innerHTML = current===steps.length-1 ? 'دیدن نتیجه <span>←</span>' : 'ادامه <span>←</span>';
    error.textContent = '';
    steps[current].querySelector('legend').focus?.();
  }
  function selectedCurrent(){return steps[current].querySelector('input:checked');}
  function calculate(){
    const data = Object.fromEntries(new FormData(form).entries());
    const ageScore = {new:4,mid:11,old:20,veryold:27}[data.age];
    const goalScore = {sale:12,rent_long:8,rent_short:11,live:7,restore:15}[data.goal];
    const areaScore = {small:2,medium:5,large:7,xlarge:9}[data.area];
    const typeScore = {villa:5,apartment:2,house:7,commercial:4,other:3}[data.type];
    const issue = issueData[data.issue];
    const score = Math.min(92, 27 + ageScore + goalScore + areaScore + typeScore + issue.weight);
    let title, summary, level;
    if(score>=76){title='ظرفیت بهسازی این ملک بالاست.';summary='ترکیب سن بنا، هدف و مسئله اصلی نشان می‌دهد بررسی دقیق‌تر می‌تواند فرصت‌های مهمی برای بهبود عملکرد یا ارائه ملک پیدا کند.';level='بررسی ارزش‌افزا و کامل';}
    else if(score>=61){title='بهسازی هدفمند می‌تواند اثرگذار باشد.';summary='احتمالاً لازم نیست همه‌چیز بازسازی شود. انتخاب چند اقدام درست می‌تواند از خرج پراکنده مؤثرتر باشد.';level='بازسازی هدفمند';}
    else{title='اول باید هزینه‌های غیرضروری را حذف کنیم.';summary='اطلاعات فعلی بازسازی گسترده را توجیه نمی‌کند. بررسی تصویری کمک می‌کند فقط نقاطی انتخاب شوند که واقعاً مسئله‌ای را حل می‌کنند.';level='اصلاحات ضروری و محدود';}
    if(data.type==='commercial'){summary+=' در ملک تجاری، دیده‌شدن، دسترسی، تأسیسات و تناسب فضا با نوع کسب‌وکار باید جداگانه سنجیده شوند.';}
    if(data.goal==='rent_short'){summary+=' برای اجاره کوتاه‌مدت، تجربه مهمان، دوام متریال و ارائه تصویری ملک اهمیت بیشتری دارند.';}
    if(data.issue==='underpriced'){summary+=' پیش از هر هزینه اجرایی، باید معلوم شود چه مقدار از این شکاف واقعاً با بهسازی قابل جبران است.';}
    document.querySelector('#score').textContent=toFa(score);
    document.querySelector('#result-title').textContent=title;
    document.querySelector('#result-summary').textContent=summary;
    document.querySelector('#priority').textContent=issue.priority;
    document.querySelector('#priority-text').textContent=issue.text;
    document.querySelector('#level').textContent=level;
    document.querySelector('#recommendations').innerHTML=issue.recs.map(item=>`<li>${item}</li>`).join('');
    const message = [
      'سلام، ارزیابی رایگان ملک را در سایت بناورا انجام دادم.',
      `هدف: ${labels.goal[data.goal]}`,
      `نوع ملک: ${labels.type[data.type]}`,
      `محدوده: ${labels.location[data.location]}`,
      `متراژ: ${labels.area[data.area]}`,
      `سن بنا: ${labels.age[data.age]}`,
      `مسئله اصلی: ${labels.issue[data.issue]}`,
      `امتیاز اولیه: ${score} از 100`,
      'می‌خواهم وارد مرحله بررسی تصویری شوم.'
    ].join('\n');
    document.querySelector('#whatsapp-result').href=`https://wa.me/989113690079?text=${encodeURIComponent(message)}`;
    wizard.hidden=true;result.hidden=false;window.scrollTo({top:0,behavior:'smooth'});
  }

  document.querySelector('#start').addEventListener('click',()=>{intro.hidden=true;wizard.hidden=false;updateStep();});
  next.addEventListener('click',()=>{
    if(!selectedCurrent()){error.textContent='برای ادامه، یکی از گزینه‌ها را انتخاب کن.';return;}
    if(current<steps.length-1){current+=1;updateStep();}else{calculate();}
  });
  back.addEventListener('click',()=>{if(current>0){current-=1;updateStep();}});
  form.addEventListener('change',event=>{
    if(event.target.matches('input[type="radio"]')){
      error.textContent='';
      if(window.matchMedia('(max-width:650px)').matches && current<steps.length-1){setTimeout(()=>{current+=1;updateStep();},180);}
    }
  });
  document.querySelector('#restart').addEventListener('click',()=>{form.reset();current=0;result.hidden=true;intro.hidden=false;window.scrollTo({top:0,behavior:'smooth'});});
})();
