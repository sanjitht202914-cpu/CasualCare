// Optional Supabase Edge Function. Requires Twilio secrets; never put them in frontend .env.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
Deno.serve(async (req) => {
  const headers={'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') || 'http://localhost:5173','Access-Control-Allow-Headers':'authorization, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Content-Type':'application/json'};
  if(req.method==='OPTIONS')return new Response(null,{headers});
  if(req.method!=='POST')return new Response(JSON.stringify({error:'Method not allowed'}),{status:405,headers});
  const token=req.headers.get('Authorization')?.replace(/^Bearer /,'');
  if(!token)return new Response(JSON.stringify({error:'Sign in required'}),{status:401,headers});
  const supabase=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_ANON_KEY')!);
  const {data:{user},error}=await supabase.auth.getUser(token);
  if(error||!user)return new Response(JSON.stringify({error:'Unauthorized'}),{status:401,headers});
  const {to,message}=await req.json();
  if(typeof to!=='string'||!/^\+[1-9]\d{7,14}$/.test(to)||typeof message!=='string'||message.length<1||message.length>320)return new Response(JSON.stringify({error:'Valid E.164 phone and message (1-320 chars) required'}),{status:400,headers});
  const sid=Deno.env.get('TWILIO_ACCOUNT_SID'),secret=Deno.env.get('TWILIO_AUTH_TOKEN'),from=Deno.env.get('TWILIO_FROM_NUMBER');
  if(!sid||!secret||!from)return new Response(JSON.stringify({error:'SMS provider not configured'}),{status:503,headers});
  const form=new URLSearchParams({To:to,From:from,Body:message});
  const res=await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,{method:'POST',headers:{Authorization:'Basic '+btoa(`${sid}:${secret}`),'Content-Type':'application/x-www-form-urlencoded'},body:form});
  const result=await res.json();
  return new Response(JSON.stringify(res.ok?{success:true,sid:result.sid,status:result.status}:{success:false,error:result.message||'SMS request failed'}),{status:res.ok?200:502,headers});
});
