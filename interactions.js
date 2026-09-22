(() => {
  'use strict';
  const endpoint=window.KASOKO_CONFIG?.interactionEndpoint||'/api/interactions';
  const lang=()=>((typeof localStorage!=='undefined'&&localStorage.getItem('kt-lang'))==='sw'?'sw':'en');
  const rid=()=>((crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2)).replace(/[^a-zA-Z0-9-]/g,'').slice(0,60));
  const clean=(v,n=500)=>String(v||'').replace(/\s+/g,' ').trim().slice(0,n);
  const params=()=>{const q=new URLSearchParams(location.search);return {service:clean(q.get('service'),50),item:clean(q.get('item'),120)}};
  const keyFor=(action,target)=>'kst-notify:'+action+':'+clean(target,220);

  function recentlySent(action,target,ttlMs){
    try {
      const key=keyFor(action,target), now=Date.now(), prev=Number(sessionStorage.getItem(key)||0);
      if(prev&&now-prev<ttlMs) return true;
      sessionStorage.setItem(key,String(now));
    } catch {}
    return false;
  }

  function payload(action,extra={}){
    return {requestId:rid(),action,page:location.pathname+location.search,title:document.title,label:clean(extra.label,180),target:clean(extra.target,500),language:lang(),...params()};
  }

  function send(action,extra={},ttlMs=30000){
    if(recentlySent(action,extra.target||location.pathname,ttlMs)) return;
    const body=JSON.stringify(payload(action,extra));
    try {
      if(navigator.sendBeacon){
        const blob=new Blob([body],{type:'application/json'});
        if(navigator.sendBeacon(endpoint,blob)) return;
      }
    } catch {}
    fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body,keepalive:true,credentials:'same-origin'}).catch(()=>{});
  }

  document.addEventListener('click',event=>{
    const a=event.target.closest?.('a[href]');
    if(!a) return;
    const href=a.getAttribute('href')||'';
    const label=clean(a.textContent||a.getAttribute('aria-label')||'',180);
    if(/^booking\.html(?:\?|$)/i.test(href)) send('booking_cta',{label,target:href},45000);
    else if(/^tel:/i.test(href)) send('phone_click',{label,target:href},20000);
    else if(/(?:wa\.me|api\.whatsapp\.com|whatsapp:)/i.test(href)) send('whatsapp_click',{label,target:href},20000);
  },true);

  const form=document.getElementById('booking-form');
  if(form){
    let started=false;
    const startedOnce=()=>{
      if(started) return;
      started=true;
      const d=new FormData(form);
      const service=clean(d.get('service'),50), destination=clean(d.get('destination'),140);
      send('booking_started',{label:[service,destination].filter(Boolean).join(' · ')||'Booking form started',target:location.pathname+location.search},15*60*1000);
    };
    form.addEventListener('input',startedOnce,{passive:true});
    form.addEventListener('change',startedOnce,{passive:true});
  }
})();
