FreeModel Studio — Premium UI + Automatic API Key Fallback
Render.com Docker deployment

DEPLOY
1) Updated folder GitHub repo me upload/push karo.
2) Render -> New -> Web Service -> apna repo select karo -> Runtime Docker.
3) Environment me FM_BASE_URL = https://freemodel.in/v1 set rakho.
4) Deploy karo. API keys sirf Render Environment Variables me rakho; HTML/browser me kabhi nahi.

API KEY FALLBACK
Primary key:
  FM_API_KEY = fm_...

Backup keys:
  FM_API_KEY_2 = fm_...
  FM_API_KEY_3 = fm_...
  FM_API_KEY_4 = fm_...
  FM_API_KEY_5 = fm_...
  ...jitni chaho add kar sakte ho (server 1 se 100 numbered slots read karta hai).

Agar FM_API_KEY_2 set kar rahe ho to exact env name FM_API_KEY_2 rakho.
FM_API_KEY2 (underscore ke bina) bhi accepted hai.
Agar pehli key invalid/expired, quota limit, rate limit, provider/server error ya network failure de, server next configured key try karega. 400/404 jaise normal request/model errors par key switch nahi karega.
Fallback same FM_BASE_URL aur same API request ke saath hota hai. Sab keys fail hon to server error return karega.
Render Dashboard -> your service -> Environment -> Add Environment Variable -> Save, phir deploy/restart.

OPTIONAL
APP_PASSWORD = set karoge to app password maangega. Empty = password disabled.
FM_BASE_URL = provider ka API base URL; default https://freemodel.in/v1

SECURITY
- API keys backend par rehti hain, browser source me nahi jaati.
- APP_PASSWORD set karna recommended hai, warna jiske paas app URL hai woh aapke API balance ka use kar sakta hai.
- Keys ko chat, HTML ya public GitHub repo me paste mat karna.
- Agar key kabhi public ho gayi ho to provider dashboard se rotate/revoke karo.

Health endpoint: /api/health
Key status (count only, no secrets): /api/info
