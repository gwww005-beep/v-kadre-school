(() => {
  'use strict';
  const c = window.SCHOOL || {};
  const q = s => document.querySelector(s);
  const text = (s, value) => document.querySelectorAll(s).forEach(el => { el.textContent = value; });
  const safePhone = /^\+?[\d\s()\-]{10,24}$/;
  if (c.phone && safePhone.test(c.phone)) {
    document.querySelectorAll('.phone-value').forEach(el => {
      el.textContent = c.phone; el.href = c.demo ? '#contacts' : 'tel:' + c.phone.replace(/[^\d+]/g, '');
      el.setAttribute('aria-label', c.demo ? 'Демонстрационный номер школы' : 'Позвонить в школу: ' + c.phone);
    });
  }
  if (c.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) {
    document.querySelectorAll('.email-value').forEach(el => {
      const link = document.createElement('a'); link.href = c.demo ? '#contacts' : 'mailto:' + c.email; link.textContent = c.email;
      link.className = el.className; el.replaceWith(link);
    });
  }
  text('.studio-value', c.studioAddress || 'Москва. Площадка уточняется.');
  if(c.legalName) text('.operator-label', [c.legalName,c.inn && 'ИНН ' + c.inn].filter(Boolean).join(', '));
  if(Number.isFinite(c.monthlyPrice) && c.monthlyPrice > 0 && q('#price-display')) {
    const price=q('#price-display'); const period=document.createElement('span');period.textContent=c.pricePeriod || 'за месяц';
    price.replaceChildren(document.createTextNode(new Intl.NumberFormat('ru-RU').format(c.monthlyPrice)+' ₽ '),period);
  }
  const pricesReady=Array.isArray(c.plans) && c.plans.length===3 && new Set(c.plans.map(p=>p.id)).size===3 && c.plans.every(p=>['start','practice','direction'].includes(p.id) && Number.isFinite(p.price) && p.price>0 && typeof p.period==='string' && p.period.trim());
  const ready = c.demo !== true && c.leadsEnabled === true && c.legalApproved === true && c.priceApproved === true && pricesReady && !!c.legalName && !!c.privacyEmail && !!c.email && !!c.phone;
  if(c.priceApproved === true && pricesReady)document.querySelectorAll('.package-draft-note').forEach(el=>el.hidden=true);
  if(c.priceApproved === true) document.querySelectorAll('.price-draft').forEach(el=>el.hidden=true);
  if(Array.isArray(c.plans)) c.plans.forEach(plan=>{
    if(!['start','practice','direction'].includes(plan.id))return;
    const amount=q('[data-plan-price="'+plan.id+'"]');
    const period=q('[data-plan-period="'+plan.id+'"]');
    if(amount && Number.isFinite(plan.price) && plan.price>0)amount.textContent=new Intl.NumberFormat('ru-RU').format(plan.price)+' ₽';
    if(period && typeof plan.period==='string' && plan.period.trim())period.textContent=plan.period;
  });
  if(ready && q('#form-readiness')) q('#form-readiness').hidden = true;
  if(ready && q('#robots')) q('#robots').content='index,follow';
  if(q('#year')) q('#year').textContent = new Date().getFullYear();
  const menu=q('#mobile-menu'), menuButton=q('.menu-toggle');
  if(menuButton && menu) {
    const close=()=>{menu.hidden=true;menuButton.setAttribute('aria-expanded','false');};
    menuButton.addEventListener('click',()=>{menu.hidden=!menu.hidden;menuButton.setAttribute('aria-expanded',String(!menu.hidden));});
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    document.addEventListener('keydown',e=>{if(e.key==='Escape' && !menu.hidden){close();menuButton.focus();}});
  }
  if(Array.isArray(c.teachers) && c.teachers.length && q('#team-content')) {
    const host=q('#team-content');host.replaceChildren();host.className='teacher-grid';
    c.teachers.forEach(t=>{if(!t.name || !t.discipline)return;const article=document.createElement('article');article.className='teacher-card';
      if(typeof t.photo==='string' && /^assets\/[a-zA-Z0-9_\/-]+\.(webp|png|jpe?g)$/i.test(t.photo)){const frame=document.createElement('div');frame.className='teacher-portrait';const photo=document.createElement('img');photo.src=t.photo;photo.alt=t.name;photo.loading='lazy';frame.append(photo);article.append(frame);}
      const role=document.createElement('p');role.className='teacher-role';role.textContent=t.discipline;const h=document.createElement('h3');h.textContent=t.name;const p=document.createElement('p');p.textContent=t.experience || '';article.append(role,h,p);host.append(article);});
    const notice=q('.teacher-notice');if(notice)notice.textContent='С преподавателем можно познакомиться на первом бесплатном занятии.';
  }
  // No tracker is loaded, and no form input is written to browser storage.
  const privacyKey='vk-privacy-v1', ttl=180*24*60*60*1000;
  let choice=null;
  try{choice=JSON.parse(localStorage.getItem(privacyKey));if(!choice || !choice.expires || choice.expires<Date.now()){localStorage.removeItem(privacyKey);choice=null;}}catch(_){choice=null;}
  const banner=q('#privacy-banner'), dialog=q('#privacy-dialog');
  // No optional trackers: settings remain available without a blocking banner.
  if(banner)banner.hidden=true;
  const savePrivacy=()=>{try{localStorage.setItem(privacyKey,JSON.stringify({necessary:true,expires:Date.now()+ttl}));}catch(_){}if(banner)banner.hidden=true;if(dialog && dialog.open)dialog.close();};
  document.querySelectorAll('[data-privacy-open]').forEach(b=>b.addEventListener('click',()=>{if(dialog && typeof dialog.showModal==='function')dialog.showModal();else if(banner)banner.hidden=false;}));
  q('#privacy-confirm')?.addEventListener('click',savePrivacy);
  q('#privacy-save')?.addEventListener('click',savePrivacy);
  q('#privacy-close')?.addEventListener('click',()=>dialog.close());
  dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left || e.clientX>r.right || e.clientY<r.top || e.clientY>r.bottom)dialog.close();}});
  const form=q('#lead-form'), status=q('#form-status'), button=q('#submit-lead');
  const setStatus=(msg,state='error')=>{status.textContent=msg;status.dataset.state=state;status.setAttribute('role',state==='error'?'alert':'status');};
  if(form) {
    const name=q('#name'), phone=q('#phone');
    const fieldError=(input,message)=>{
      input.setAttribute('aria-invalid',String(!!message));
      const node=q('#'+input.id+'-error');
      if(node){node.textContent=message;node.hidden=!message;}
    };
    [name,phone,q('#consent')].forEach(input=>input.addEventListener(input.type==='checkbox'?'change':'input',()=>fieldError(input,'')));
    // Drafts do not collect personal data. Enable after operator details are complete.
    if(!ready && !c.demo){name.disabled=true;phone.disabled=true;q('#consent').disabled=true;}
    let token=null, busy=false;
    const endpoint = new URL(c.endpoint || 'api/lead.php',location.href);
    const validEndpoint=endpoint.origin===location.origin;
    const getToken=async(signal)=>{const r=await fetch(endpoint.href,{signal,credentials:'same-origin',headers:{Accept:'application/json'}});const data=await r.json();if(!r.ok || !data.token)throw new Error('service');return data.token;};
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      if(busy)return;
      const n=name.value.trim(), p=phone.value.trim(), digits=p.replace(/\D/g,'');
      fieldError(name,n.length<2 || n.length>80?'Укажите имя: от 2 до 80 символов.':'');
      fieldError(phone,!safePhone.test(p) || digits.length<10 || digits.length>15?'Укажите телефон с кодом страны: от 10 до 15 цифр.':'');
      fieldError(q('#consent'),!q('#consent').checked?'Для ответа на запрос нужно согласие на обработку данных.':'');
      const invalid=form.querySelector('[aria-invalid="true"]');
      if(invalid){setStatus('Проверьте отмеченные поля.');invalid.focus();return;}
      if(!ready){setStatus('Это демонстрационная форма. Запись пока не открыта. Данные не отправлялись.','info');return;}
      if(!validEndpoint){setStatus('Форма временно недоступна. Используйте телефон школы.');return;}
      busy=true;button.disabled=true;setStatus('Отправляем запрос…','pending');
      const controller=new AbortController(), timeout=setTimeout(()=>controller.abort(),18000);
      try {
        if(!token)token=await getToken(controller.signal);
        const r=await fetch(endpoint.href,{method:'POST',credentials:'same-origin',signal:controller.signal,headers:{'Content-Type':'application/json',Accept:'application/json','X-CSRF-Token':token},body:JSON.stringify({name:n,phone:p,consent:true,consentVersion:c.consentVersion,website:q('#website').value})});
        const data=await r.json();
        if(!r.ok){if(r.status===403)token=null;throw new Error(data.message || 'Не удалось отправить запрос. Попробуйте позже или позвоните в школу.');}
        if(data.ok!==true)throw new Error('Отправка не подтверждена. Позвоните в школу.');
        form.reset();setStatus('Запрос принят. Свяжемся с вами по указанному телефону.','success');token=null;
      } catch(err) {setStatus(err.name==='AbortError'?'Сервис не ответил вовремя. Статус отправки неизвестен — уточните по телефону школы.':(err.message==='service'?'Форма временно недоступна. Позвоните в школу.':err.message));}
      finally{clearTimeout(timeout);busy=false;button.disabled=false;}
    });
  }
  const videoHost=q('#video-grid');
  if(videoHost && Array.isArray(c.videos)) {
    c.videos.slice(0,3).forEach((item,index)=>{
      const article=document.createElement('article');article.className='video-item'+(item.portrait?' video-portrait':' video-wide');
      const frame=document.createElement('div');frame.className='video-frame';
      const localMedia=value=>{if(!value)return false;try{const u=new URL(value,location.href);return u.origin===location.origin && !u.search && !u.hash && /\.(mp4|webm|vtt|png|webp|jpg|jpeg)$/i.test(u.pathname);}catch(_){return false;}};
      if(localMedia(item.src) && /\.(mp4|webm)$/i.test(item.src)){
        const video=document.createElement('video');video.controls=true;video.preload='none';video.playsInline=true;video.src=item.src;video.setAttribute('aria-label',item.title);if(localMedia(item.poster))video.poster=item.poster;
        if(localMedia(item.captions) && /\.vtt$/i.test(item.captions)){const track=document.createElement('track');track.kind='captions';track.src=item.captions;track.srclang='ru';track.label='Русские субтитры';video.append(track);}frame.append(video);
      }else{
        const placeholder=document.createElement('div');placeholder.className='video-placeholder';
        const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 32 32');svg.setAttribute('aria-hidden','true');
        const rect=document.createElementNS(svg.namespaceURI,'rect');rect.setAttribute('x','3');rect.setAttribute('y','6');rect.setAttribute('width','20');rect.setAttribute('height','20');rect.setAttribute('rx','4');
        const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d','M23 12L29 9V23L23 20');svg.append(rect,path);
        const badge=document.createElement('span');badge.className='video-pending';badge.textContent='Видео готовится';placeholder.append(svg,badge);frame.append(placeholder);
      }
      const h=document.createElement('h3');h.textContent=item.title;article.append(frame,h);videoHost.append(article);
    });
  }
  // Populate operator details on separate legal pages using textContent only.
  const fields={name:c.legalName,inn:c.inn,ogrn:c.ogrn,address:c.legalAddress,phone:c.phone,email:c.email,privacyEmail:c.privacyEmail,domain:c.domain,version:c.policyVersion};
  Object.entries(fields).forEach(([key,value])=>{if(value)document.querySelectorAll('[data-legal="'+key+'"]').forEach(el=>el.textContent=value);});
  if(c.legalApproved && c.legalName)document.querySelectorAll('.draft-notice').forEach(el=>el.hidden=true);
})();
