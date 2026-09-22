import {createHash} from 'node:crypto';

const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const allowedActions=new Set(['booking_cta','booking_started','phone_click','whatsapp_click']);
const clean=(value,max=250)=>String(value??'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max);

export default {
  async fetch(request) {
    if(request.method!=='POST') return json({ok:false,error:'method_not_allowed'},405);
    if(!request.headers.get('content-type')?.startsWith('application/json')) return json({ok:false,error:'json_required'},415);
    const origin=request.headers.get('origin');
    if(origin&&origin!==new URL(request.url).origin) return json({ok:false,error:'origin_not_allowed'},403);
    let raw;
    try {
      const text=await request.text();
      if(text.length>7000) return json({ok:false,error:'request_too_large'},413);
      raw=JSON.parse(text);
    } catch {
      return json({ok:false,error:'invalid_json'},400);
    }
    if(!raw||Array.isArray(raw)||typeof raw!=='object') return json({ok:false,error:'invalid_request'},400);
    if(!/^[a-zA-Z0-9-]{16,80}$/.test(raw.requestId||'')) return json({ok:false,error:'invalid_request_id'},400);
    if(!allowedActions.has(raw.action)) return json({ok:false,error:'invalid_action'},400);

    const event={
      action: raw.action,
      page: clean(raw.page,500),
      title: clean(raw.title,180),
      label: clean(raw.label,180),
      target: clean(raw.target,500),
      language: raw.language==='sw'?'sw':'en',
      service: clean(raw.service,50),
      item: clean(raw.item,120),
      occurredAt: new Date().toISOString()
    };

    const endpoint=process.env.BOOKING_WEBHOOK_URL;
    const secret=process.env.BOOKING_WEBHOOK_SECRET;
    if(!endpoint||!secret) return json({ok:false,error:'notifications_unavailable'},503);
    let target;
    try {
      target=new URL(endpoint);
      if(target.protocol!=='https:'||target.hostname!=='script.google.com'||!target.pathname.endsWith('/exec')) throw Error();
    } catch {
      return json({ok:false,error:'notifications_unavailable'},503);
    }

    const eventId='KSI-'+createHash('sha256').update(raw.requestId+'\n'+JSON.stringify(event)).digest('hex').slice(0,12).toUpperCase();
    try {
      const response=await fetch(target,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret,kind:'interaction',eventId,event}),signal:AbortSignal.timeout(12000)});
      const result=await response.json();
      if(!response.ok||!result.ok||result.status!=='interaction_received'||result.eventId!==eventId) return json({ok:false,error:'delivery_failed'},502);
      return json({ok:true,status:'interaction_received',eventId});
    } catch {
      return json({ok:false,error:'delivery_failed'},502);
    }
  }
};
