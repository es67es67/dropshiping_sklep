import{r as e,a as t,g as r}from"./vendor-DEQ385Nk.js";import{r as i,L as o,u as a,a as n,b as s,B as d,c,d as l,N as m}from"./router-B94szvA2.js";import{f as h,d as p,o as x}from"./styling-ZeV0Lijf.js";import{G as u}from"./icons-CtfUj4QE.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver(e=>{for(const r of e)if("childList"===r.type)for(const e of r.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)}).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?t.credentials="include":"anonymous"===e.crossOrigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();var g,j,y={exports:{}},b={};var f,w=(j||(j=1,y.exports=function(){if(g)return b;g=1;var t=e(),r=Symbol.for("react.element"),i=Symbol.for("react.fragment"),o=Object.prototype.hasOwnProperty,a=t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,n={key:!0,ref:!0,__self:!0,__source:!0};function s(e,t,i){var s,d={},c=null,l=null;for(s in void 0!==i&&(c=""+i),void 0!==t.key&&(c=""+t.key),void 0!==t.ref&&(l=t.ref),t)o.call(t,s)&&!n.hasOwnProperty(s)&&(d[s]=t[s]);if(e&&e.defaultProps)for(s in t=e.defaultProps)void 0===d[s]&&(d[s]=t[s]);return{$$typeof:r,type:e,key:c,ref:l,props:d,_owner:a.current}}return b.Fragment=i,b.jsx=s,b.jsxs=s,b}()),y.exports),k={};const v=r(function(){if(f)return k;f=1;var e=t();return k.createRoot=e.createRoot,k.hydrateRoot=e.hydrateRoot,k}()),z={primary:"#00D4AA",secondary:"#8B5CF6",accent:"#F59E0B",background:"#FFFFFF",surface:"#F8FAFC",text:"#1E293B",textSecondary:"#64748B",border:"#E2E8F0",success:"#10B981",error:"#EF4444",warning:"#F59E0B",info:"#3B82F6",shadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1)",shadowHover:"0 10px 15px -3px rgba(0, 0, 0, 0.1)",gradient:"linear-gradient(135deg, #00D4AA 0%, #8B5CF6 100%)",gradientHover:"linear-gradient(135deg, #00B894 0%, #7C3AED 100%)"},$={primary:"#00D4AA",secondary:"#8B5CF6",accent:"#F59E0B",background:"#0F172A",surface:"#1E293B",text:"#F1F5F9",textSecondary:"#94A3B8",border:"#334155",success:"#10B981",error:"#EF4444",warning:"#F59E0B",info:"#3B82F6",shadow:"0 4px 6px -1px rgba(0, 0, 0, 0.3)",shadowHover:"0 10px 15px -3px rgba(0, 0, 0, 0.3)",gradient:"linear-gradient(135deg, #00D4AA 0%, #8B5CF6 100%)",gradientHover:"linear-gradient(135deg, #00B894 0%, #7C3AED 100%)"},S=h`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background-color: ${e=>e.theme.background};
    color: ${e=>e.theme.text};
    transition: all 0.3s ease;
    line-height: 1.6;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${e=>e.theme.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${e=>e.theme.border};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${e=>e.theme.textSecondary};
  }

  /* Button styles */
  .btn {
    padding: 12px 24px;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .btn-primary {
    background: ${e=>e.theme.gradient};
    color: white;
  }

  .btn-primary:hover {
    background: ${e=>e.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadowHover};
  }

  .btn-secondary {
    background: ${e=>e.theme.surface};
    color: ${e=>e.theme.text};
    border: 2px solid ${e=>e.theme.border};
  }

  .btn-secondary:hover {
    background: ${e=>e.theme.border};
    transform: translateY(-2px);
  }

  /* Input styles */
  .input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid ${e=>e.theme.border};
    border-radius: 12px;
    font-size: 14px;
    transition: all 0.2s ease;
    background: ${e=>e.theme.surface};
    color: ${e=>e.theme.text};
  }

  .input:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
    box-shadow: 0 0 0 3px ${e=>e.theme.primary}20;
  }

  /* Card styles */
  .card {
    background: ${e=>e.theme.surface};
    border-radius: 16px;
    padding: 20px;
    box-shadow: ${e=>e.theme.shadow};
    transition: all 0.2s ease;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: ${e=>e.theme.shadowHover};
  }

  /* Animation classes */
  .fade-in {
    animation: fadeIn 0.3s ease-in;
  }

  .slide-up {
    animation: slideUp 0.3s ease-out;
  }

  .bounce {
    animation: bounce 0.6s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
    40%, 43% { transform: translate3d(0,-8px,0); }
    70% { transform: translate3d(0,-4px,0); }
    90% { transform: translate3d(0,-2px,0); }
  }

  /* Utility classes */
  .text-gradient {
    background: ${e=>e.theme.gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .glass-dark {
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
`,C=i.createContext(),N=()=>{const e=i.useContext(C);if(!e)throw new Error("useAuth must be used within an AuthProvider");return e},P=({children:e})=>{const[t,r]=i.useState(null),[o,a]=i.useState(!0),[n,s]=i.useState(!1);i.useEffect(()=>{(()=>{try{const e=localStorage.getItem("isLoggedIn"),t=localStorage.getItem("user");if("true"===e&&t){const e=JSON.parse(t);r(e),s(!0)}}catch(e){d()}finally{a(!1)}})()},[]);const d=()=>{localStorage.removeItem("user"),localStorage.removeItem("isLoggedIn"),localStorage.removeItem("token"),r(null),s(!1)},c=(e,i)=>{const o={...t,level:e,experience:i,lastLevelUpdate:(new Date).toISOString()};localStorage.setItem("user",JSON.stringify(o)),r(o)},l=e=>!!t&&(t.role===e||"admin"===t.role),m=()=>l("admin"),h={user:t,isAuthenticated:n,isLoading:o,login:async e=>{try{const i=await fetch("http://localhost:5000/api/users/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});let o=null,a="";const n=i.headers.get("content-type");try{a=await i.text(),o=n&&n.includes("application/json")&&a?JSON.parse(a):{error:a||"Brak odpowiedzi z serwera"}}catch(t){o={error:"Nieprawidłowa odpowiedź z serwera"}}if(!i.ok)return{success:!1,error:o.error||"Wystąpił błąd podczas logowania"};const d={...o.user,isLoggedIn:!0,loginTime:(new Date).toISOString()};return localStorage.setItem("user",JSON.stringify(d)),localStorage.setItem("isLoggedIn","true"),localStorage.setItem("token",o.token),r(d),s(!0),{success:!0,user:d}}catch(i){return{success:!1,error:"Wystąpił błąd podczas logowania (brak połączenia z serwerem)"}}},register:async e=>{try{const t=await fetch("/api/users/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e.username,email:e.email,password:e.password,firstName:e.firstName,lastName:e.lastName,dateOfBirth:e.dateOfBirth,phone:e.phone,city:e.city,gender:e.gender})}),i=await t.json();if(!t.ok)return{success:!1,error:i.error||"Wystąpił błąd podczas rejestracji"};const o={...i.user,isLoggedIn:!0,registrationTime:(new Date).toISOString()};return localStorage.setItem("user",JSON.stringify(o)),localStorage.setItem("isLoggedIn","true"),localStorage.setItem("token",i.token),r(o),s(!0),{success:!0,user:o}}catch(t){return{success:!1,error:"Wystąpił błąd podczas rejestracji"}}},logout:d,updateUser:e=>{const i={...t,...e};localStorage.setItem("user",JSON.stringify(i)),r(i)},updateUserLevel:c,addExperience:e=>{const r=t.experience+e,i=100*t.level;if(r>=i){const e=t.level+1;return c(e,r-i),{leveledUp:!0,newLevel:e,remainingExp:r-i}}return c(t.level,r),{leveledUp:!1,currentExp:r}},getUserStats:()=>t?{level:t.level,experience:t.experience,experienceForNextLevel:100*t.level,progress:t.experience/(100*t.level)*100}:null,hasRole:l,isAdmin:m,isModerator:()=>l("moderator")||m()};return w.jsx(C.Provider,{value:h,children:e})};function B(e){return u({attr:{viewBox:"0 0 448 512"},child:[{tag:"path",attr:{d:"M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z"},child:[]}]})(e)}function A(e){return u({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M509.5 184.6L458.9 32.8C452.4 13.2 434.1 0 413.4 0H272v192h238.7c-.4-2.5-.4-5-1.2-7.4zM240 0H98.6c-20.7 0-39 13.2-45.5 32.8L2.5 184.6c-.8 2.4-.8 4.9-1.2 7.4H240V0zM0 224v240c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V224H0z"},child:[]}]})(e)}function T(e){return u({attr:{viewBox:"0 0 448 512"},child:[{tag:"path",attr:{d:"M436 480h-20V24c0-13.255-10.745-24-24-24H56C42.745 0 32 10.745 32 24v456H12c-6.627 0-12 5.373-12 12v20h448v-20c0-6.627-5.373-12-12-12zM128 76c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12V76zm0 96c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12v-40zm52 148h-40c-6.627 0-12-5.373-12-12v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12zm76 160h-64v-84c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v84zm64-172c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40zm0-96c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40zm0-96c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12V76c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40z"},child:[]}]})(e)}function M(e){return u({attr:{viewBox:"0 0 448 512"},child:[{tag:"path",attr:{d:"M12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm436-44v-36c0-26.5-21.5-48-48-48h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v36c0 6.6 5.4 12 12 12h424c6.6 0 12-5.4 12-12z"},child:[]}]})(e)}function L(e){return u({attr:{viewBox:"0 0 448 512"},child:[{tag:"path",attr:{d:"M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"},child:[]}]})(e)}function E(e){return u({attr:{viewBox:"0 0 640 512"},child:[{tag:"path",attr:{d:"M616 192H480V24c0-13.26-10.74-24-24-24H312c-13.26 0-24 10.74-24 24v72h-64V16c0-8.84-7.16-16-16-16h-16c-8.84 0-16 7.16-16 16v80h-64V16c0-8.84-7.16-16-16-16H80c-8.84 0-16 7.16-16 16v80H24c-13.26 0-24 10.74-24 24v360c0 17.67 14.33 32 32 32h576c17.67 0 32-14.33 32-32V216c0-13.26-10.75-24-24-24zM128 404c0 6.63-5.37 12-12 12H76c-6.63 0-12-5.37-12-12v-40c0-6.63 5.37-12 12-12h40c6.63 0 12 5.37 12 12v40zm0-96c0 6.63-5.37 12-12 12H76c-6.63 0-12-5.37-12-12v-40c0-6.63 5.37-12 12-12h40c6.63 0 12 5.37 12 12v40zm0-96c0 6.63-5.37 12-12 12H76c-6.63 0-12-5.37-12-12v-40c0-6.63 5.37-12 12-12h40c6.63 0 12 5.37 12 12v40zm128 192c0 6.63-5.37 12-12 12h-40c-6.63 0-12-5.37-12-12v-40c0-6.63 5.37-12 12-12h40c6.63 0 12 5.37 12 12v40zm0-96c0 6.63-5.37 12-12 12h-40c-6.63 0-12-5.37-12-12v-40c0-6.63 5.37-12 12-12h40c6.63 0 12 5.37 12 12v40zm0-96c0 6.63-5.37 12-12 12h-40c-6.63 0-12-5.37-12-12v-40c0-6.63 5.37-12 12-12h40c6.63 0 12 5.37 12 12v40zm160 96c0 6.63-5.37 12-12 12h-40c-6.63 0-12-5.37-12-12v-40c0-6.63 5.37-12 12-12h40c6.63 0 12 5.37 12 12v40zm0-96c0 6.63-5.37 12-12 12h-40c-6.63 0-12-5.37-12-12v-40c0-6.63 5.37-12 12-12h40c6.63 0 12 5.37 12 12v40zm0-96c0 6.63-5.37 12-12 12h-40c-6.63 0-12-5.37-12-12V76c0-6.63 5.37-12 12-12h40c6.63 0 12 5.37 12 12v40zm160 288c0 6.63-5.37 12-12 12h-40c-6.63 0-12-5.37-12-12v-40c0-6.63 5.37-12 12-12h40c6.63 0 12 5.37 12 12v40zm0-96c0 6.63-5.37 12-12 12h-40c-6.63 0-12-5.37-12-12v-40c0-6.63 5.37-12 12-12h40c6.63 0 12 5.37 12 12v40z"},child:[]}]})(e)}function W(e){return u({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"},child:[]}]})(e)}function D(e){return u({attr:{viewBox:"0 0 576 512"},child:[{tag:"path",attr:{d:"M416 192c0-88.4-93.1-160-208-160S0 103.6 0 192c0 34.3 14.1 65.9 38 92-13.4 30.2-35.5 54.2-35.8 54.5-2.2 2.3-2.8 5.7-1.5 8.7S4.8 352 8 352c36.6 0 66.9-12.3 88.7-25 32.2 15.7 70.3 25 111.3 25 114.9 0 208-71.6 208-160zm122 220c23.9-26 38-57.7 38-92 0-66.9-53.5-124.2-129.3-148.1.9 6.6 1.3 13.3 1.3 20.1 0 105.9-107.7 192-240 192-10.8 0-21.3-.8-31.7-1.9C207.8 439.6 281.8 480 368 480c41 0 79.1-9.2 111.3-25 21.8 12.7 52.1 25 88.7 25 3.2 0 6.1-1.9 7.3-4.8 1.3-2.9.7-6.3-1.5-8.7-.3-.3-22.4-24.2-35.8-54.5z"},child:[]}]})(e)}function O(e){return u({attr:{viewBox:"0 0 576 512"},child:[{tag:"path",attr:{d:"M0 432c0 26.5 21.5 48 48 48h480c26.5 0 48-21.5 48-48V256H0v176zm192-68c0-6.6 5.4-12 12-12h136c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H204c-6.6 0-12-5.4-12-12v-40zm-128 0c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zM576 80v48H0V80c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48z"},child:[]}]})(e)}function I(e){return u({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"},child:[]}]})(e)}function F(e){return u({attr:{viewBox:"0 0 640 512"},child:[{tag:"path",attr:{d:"M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"},child:[]}]})(e)}function _(e){return u({attr:{viewBox:"0 0 576 512"},child:[{tag:"path",attr:{d:"M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"},child:[]}]})(e)}function R(e){return u({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z"},child:[]}]})(e)}function Z(e){return u({attr:{viewBox:"0 0 496 512"},child:[{tag:"path",attr:{d:"M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm200 248c0 22.5-3.9 44.2-10.8 64.4h-20.3c-4.3 0-8.4-1.7-11.4-4.8l-32-32.6c-4.5-4.6-4.5-12.1.1-16.7l12.5-12.5v-8.7c0-3-1.2-5.9-3.3-8l-9.4-9.4c-2.1-2.1-5-3.3-8-3.3h-16c-6.2 0-11.3-5.1-11.3-11.3 0-3 1.2-5.9 3.3-8l9.4-9.4c2.1-2.1 5-3.3 8-3.3h32c6.2 0 11.3-5.1 11.3-11.3v-9.4c0-6.2-5.1-11.3-11.3-11.3h-36.7c-8.8 0-16 7.2-16 16v4.5c0 6.9-4.4 13-10.9 15.2l-31.6 10.5c-3.3 1.1-5.5 4.1-5.5 7.6v2.2c0 4.4-3.6 8-8 8h-16c-4.4 0-8-3.6-8-8s-3.6-8-8-8H247c-3 0-5.8 1.7-7.2 4.4l-9.4 18.7c-2.7 5.4-8.2 8.8-14.3 8.8H194c-8.8 0-16-7.2-16-16V199c0-4.2 1.7-8.3 4.7-11.3l20.1-20.1c4.6-4.6 7.2-10.9 7.2-17.5 0-3.4 2.2-6.5 5.5-7.6l40-13.3c1.7-.6 3.2-1.5 4.4-2.7l26.8-26.8c2.1-2.1 3.3-5 3.3-8 0-6.2-5.1-11.3-11.3-11.3H258l-16 16v8c0 4.4-3.6 8-8 8h-16c-4.4 0-8-3.6-8-8v-20c0-2.5 1.2-4.9 3.2-6.4l28.9-21.7c1.9-.1 3.8-.3 5.7-.3C358.3 56 448 145.7 448 256zM130.1 149.1c0-3 1.2-5.9 3.3-8l25.4-25.4c2.1-2.1 5-3.3 8-3.3 6.2 0 11.3 5.1 11.3 11.3v16c0 3-1.2 5.9-3.3 8l-9.4 9.4c-2.1 2.1-5 3.3-8 3.3h-16c-6.2 0-11.3-5.1-11.3-11.3zm128 306.4v-7.1c0-8.8-7.2-16-16-16h-20.2c-10.8 0-26.7-5.3-35.4-11.8l-22.2-16.7c-11.5-8.6-18.2-22.1-18.2-36.4v-23.9c0-16 8.4-30.8 22.1-39l42.9-25.7c7.1-4.2 15.2-6.5 23.4-6.5h31.2c10.9 0 21.4 3.9 29.6 10.9l43.2 37.1h18.3c8.5 0 16.6 3.4 22.6 9.4l17.3 17.3c3.4 3.4 8.1 5.3 12.9 5.3H423c-32.4 58.9-93.8 99.5-164.9 103.1z"},child:[]}]})(e)}function H(e){return u({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"},child:[]}]})(e)}function U(e){return u({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M475.115 163.781L336 252.309v-68.28c0-18.916-20.931-30.399-36.885-20.248L160 252.309V56c0-13.255-10.745-24-24-24H24C10.745 32 0 42.745 0 56v400c0 13.255 10.745 24 24 24h464c13.255 0 24-10.745 24-24V184.029c0-18.917-20.931-30.399-36.885-20.248z"},child:[]}]})(e)}function K(e){return u({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M80 368H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm0-320H16A16 16 0 0 0 0 64v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16zm0 160H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm416 176H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"},child:[]}]})(e)}function Y(e){return u({attr:{viewBox:"0 0 576 512"},child:[{tag:"path",attr:{d:"M288 0c-69.59 0-126 56.41-126 126 0 56.26 82.35 158.8 113.9 196.02 6.39 7.54 17.82 7.54 24.2 0C331.65 284.8 414 182.26 414 126 414 56.41 357.59 0 288 0zm0 168c-23.2 0-42-18.8-42-42s18.8-42 42-42 42 18.8 42 42-18.8 42-42 42zM20.12 215.95A32.006 32.006 0 0 0 0 245.66v250.32c0 11.32 11.43 19.06 21.94 14.86L160 448V214.92c-8.84-15.98-16.07-31.54-21.25-46.42L20.12 215.95zM288 359.67c-14.07 0-27.38-6.18-36.51-16.96-19.66-23.2-40.57-49.62-59.49-76.72v182l192 64V266c-18.92 27.09-39.82 53.52-59.49 76.72-9.13 10.77-22.44 16.95-36.51 16.95zm266.06-198.51L416 224v288l139.88-55.95A31.996 31.996 0 0 0 576 426.34V176.02c0-11.32-11.43-19.06-21.94-14.86z"},child:[]}]})(e)}function V(e){return u({attr:{viewBox:"0 0 384 512"},child:[{tag:"path",attr:{d:"M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"},child:[]}]})(e)}function q(e){return u({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M507.31 84.69L464 41.37c-6-6-14.14-9.37-22.63-9.37H288V16c0-8.84-7.16-16-16-16h-32c-8.84 0-16 7.16-16 16v16H56c-13.25 0-24 10.75-24 24v80c0 13.25 10.75 24 24 24h385.37c8.49 0 16.62-3.37 22.63-9.37l43.31-43.31c6.25-6.26 6.25-16.38 0-22.63zM224 496c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V384h-64v112zm232-272H288v-32h-64v32H70.63c-8.49 0-16.62 3.37-22.63 9.37L4.69 276.69c-6.25 6.25-6.25 16.38 0 22.63L48 342.63c6 6 14.14 9.37 22.63 9.37H456c13.25 0 24-10.75 24-24v-80c0-13.25-10.75-24-24-24z"},child:[]}]})(e)}function G(e){return u({attr:{viewBox:"0 0 576 512"},child:[{tag:"path",attr:{d:"M0 117.66v346.32c0 11.32 11.43 19.06 21.94 14.86L160 416V32L20.12 87.95A32.006 32.006 0 0 0 0 117.66zM192 416l192 64V96L192 32v384zM554.06 33.16L416 96v384l139.88-55.95A31.996 31.996 0 0 0 576 394.34V48.02c0-11.32-11.43-19.06-21.94-14.86z"},child:[]}]})(e)}function J(e){return u({attr:{viewBox:"0 0 448 512"},child:[{tag:"path",attr:{d:"M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"},child:[]}]})(e)}function X(e){return u({attr:{viewBox:"0 0 448 512"},child:[{tag:"path",attr:{d:"M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"},child:[]}]})(e)}function Q(e){return u({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"},child:[]}]})(e)}function ee(e){return u({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M466.5 83.7l-192-80a48.15 48.15 0 0 0-36.9 0l-192 80C27.7 91.1 16 108.6 16 128c0 198.5 114.5 335.7 221.5 380.3 11.8 4.9 25.1 4.9 36.9 0C360.1 472.6 496 349.3 496 128c0-19.4-11.7-36.9-29.5-44.3zM256.1 446.3l-.1-381 175.9 73.3c-3.3 151.4-82.1 261.1-175.8 307.7z"},child:[]}]})(e)}function te(e){return u({attr:{viewBox:"0 0 576 512"},child:[{tag:"path",attr:{d:"M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z"},child:[]}]})(e)}function re(e){return u({attr:{viewBox:"0 0 320 512"},child:[{tag:"path",attr:{d:"M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z"},child:[]}]})(e)}function ie(e){return u({attr:{viewBox:"0 0 576 512"},child:[{tag:"path",attr:{d:"M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"},child:[]}]})(e)}function oe(e){return u({attr:{viewBox:"0 0 616 512"},child:[{tag:"path",attr:{d:"M602 118.6L537.1 15C531.3 5.7 521 0 510 0H106C95 0 84.7 5.7 78.9 15L14 118.6c-33.5 53.5-3.8 127.9 58.8 136.4 4.5.6 9.1.9 13.7.9 29.6 0 55.8-13 73.8-33.1 18 20.1 44.3 33.1 73.8 33.1 29.6 0 55.8-13 73.8-33.1 18 20.1 44.3 33.1 73.8 33.1 29.6 0 55.8-13 73.8-33.1 18.1 20.1 44.3 33.1 73.8 33.1 4.7 0 9.2-.3 13.7-.9 62.8-8.4 92.6-82.8 59-136.4zM529.5 288c-10 0-19.9-1.5-29.5-3.8V384H116v-99.8c-9.6 2.2-19.5 3.8-29.5 3.8-6 0-12.1-.4-18-1.2-5.6-.8-11.1-2.1-16.4-3.6V480c0 17.7 14.3 32 32 32h448c17.7 0 32-14.3 32-32V283.2c-5.4 1.6-10.8 2.9-16.4 3.6-6.1.8-12.1 1.2-18.2 1.2z"},child:[]}]})(e)}function ae(e){return u({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M149.333 56v80c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V56c0-13.255 10.745-24 24-24h101.333c13.255 0 24 10.745 24 24zm181.334 240v-80c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.256 0 24.001-10.745 24.001-24zm32-240v80c0 13.255 10.745 24 24 24H488c13.255 0 24-10.745 24-24V56c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24zm-32 80V56c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.256 0 24.001-10.745 24.001-24zm-205.334 56H24c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24zM0 376v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H24c-13.255 0-24 10.745-24 24zm386.667-56H488c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24zm0 160H488c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24zM181.333 376v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24z"},child:[]}]})(e)}function ne(e){return u({attr:{viewBox:"0 0 352 512"},child:[{tag:"path",attr:{d:"M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"},child:[]}]})(e)}function se(e){return u({attr:{viewBox:"0 0 448 512"},child:[{tag:"path",attr:{d:"M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"},child:[]}]})(e)}function de(e){return u({attr:{viewBox:"0 0 640 512"},child:[{tag:"path",attr:{d:"M624 352h-16V243.9c0-12.7-5.1-24.9-14.1-33.9L494 110.1c-9-9-21.2-14.1-33.9-14.1H416V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h16c0 53 43 96 96 96s96-43 96-96h128c0 53 43 96 96 96s96-43 96-96h48c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zM160 464c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm320 0c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-208H416V144h44.1l99.9 99.9V256z"},child:[]}]})(e)}function ce(e){return u({attr:{viewBox:"0 0 640 512"},child:[{tag:"path",attr:{d:"M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"},child:[]}]})(e)}const le=p.nav.withConfig({shouldForwardProp:e=>!["layout","theme"].includes(e)})`
  background: ${e=>"classic"===e.layout?e.theme.surface:"dark"===e.theme?"rgba(15, 23, 42, 0.95)":"rgba(255, 255, 255, 0.95)"};
  backdrop-filter: ${e=>"classic"===e.layout?"none":"blur(20px)"};
  padding: ${e=>"compact"===e.layout?"0.5rem 1rem":"1rem 2rem"};
  display: ${e=>(e.layout,"flex")};
  flex-direction: ${e=>"classic"===e.layout?"column":"row"};
  align-items: ${e=>"classic"===e.layout?"stretch":"center"};
  gap: ${e=>"compact"===e.layout?"0.5rem":"1.5rem"};
  box-shadow: ${e=>"classic"===e.layout?"none":"0 4px 20px rgba(0, 0, 0, 0.1)"};
  position: ${e=>"classic"===e.layout?"static":"sticky"};
  top: 0;
  z-index: 1000;
  border-bottom: ${e=>"classic"===e.layout?"none":"1px solid "+("dark"===e.theme?"rgba(255, 255, 255, 0.1)":"rgba(0, 0, 0, 0.1)")};
  height: ${e=>"classic"===e.layout?"100vh":"auto"};
  width: ${e=>"classic"===e.layout?"250px":"auto"};
  
  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1rem;
    flex-direction: row;
    height: auto;
    width: auto;
    position: sticky;
  }
`,me=p(o)`
  font-size: 1.5rem;
  font-weight: 800;
  text-decoration: none;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`,he=p.div.withConfig({shouldForwardProp:e=>!["isOpen","theme","layout"].includes(e)})`
  display: flex;
  align-items: ${e=>"classic"===e.layout?"stretch":"center"};
  flex-direction: ${e=>"classic"===e.layout?"column":"row"};
  gap: ${e=>"compact"===e.layout?"0.5rem":"1rem"};
  margin-left: ${e=>"classic"===e.layout?"0":"2rem"};
  flex: ${e=>"classic"===e.layout?"1":"none"};
  
  @media (max-width: 768px) {
    display: ${e=>e.isOpen?"flex":"none"};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: ${e=>"dark"===e.theme?"rgba(15, 23, 42, 0.98)":"rgba(255, 255, 255, 0.98)"};
    backdrop-filter: blur(20px);
    flex-direction: column;
    padding: 1rem;
    gap: 0.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid ${e=>"dark"===e.theme?"rgba(255, 255, 255, 0.1)":"rgba(0, 0, 0, 0.1)"};
    margin-left: 0;
    flex: none;
  }
`,pe=p(o)`
  color: ${e=>e.theme.text};
  text-decoration: none;
  font-weight: 500;
  padding: ${e=>"compact"===e.layout?"0.25rem 0.5rem":"0.5rem 1rem"};
  border-radius: ${e=>"compact"===e.layout?"4px":"8px"};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: ${e=>"classic"===e.layout?"100%":"auto"};
  justify-content: ${e=>"classic"===e.layout?"flex-start":"center"};
  
  &:hover {
    background: ${e=>e.theme.primary}20;
    color: ${e=>e.theme.primary};
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 0.75rem 1rem;
    justify-content: flex-start;
  }
`,xe=p.button`
  display: none;
  background: none;
  border: none;
  color: ${e=>e.theme.text};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  
  @media (max-width: 768px) {
    display: block;
    margin-left: auto;
  }
`,ue=p.button`
  background: none;
  border: 2px solid ${e=>e.theme.border};
  color: ${e=>e.theme.text};
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: auto;
  
  &:hover {
    background: ${e=>e.theme.primary}20;
    border-color: ${e=>e.theme.primary};
  }
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`,ge=p.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
  
  @media (max-width: 768px) {
    margin-left: 0;
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }
`,je=p(o)`
  color: ${e=>e.theme.text};
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${e=>e.theme.primary}20;
    color: ${e=>e.theme.primary};
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`,ye=p(o)`
  background: ${e=>e.theme.gradient};
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${e=>e.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`,be=p.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
  position: relative;
  
  @media (max-width: 768px) {
    margin-left: 0;
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }
`,fe=p.div.withConfig({shouldForwardProp:e=>!["isOpen","theme"].includes(e)})`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  min-width: 220px;
  z-index: 1000;
  overflow: hidden;
  opacity: ${e=>e.isOpen?"1":"0"};
  visibility: ${e=>e.isOpen?"visible":"hidden"};
  transform: ${e=>e.isOpen?"translateY(0)":"translateY(-10px)"};
  transition: all 0.2s ease;
  
  @media (max-width: 768px) {
    position: static;
    width: 100%;
    opacity: 1;
    visibility: visible;
    transform: none;
    box-shadow: none;
    border: none;
    background: transparent;
  }
`,we=p.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${e=>e.theme.text};
  transition: all 0.2s ease;
  border-bottom: 1px solid ${e=>e.theme.border};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${e=>e.theme.primary}10;
    color: ${e=>e.theme.primary};
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 0;
    border-bottom: none;
  }
`,ke=p.div`
  height: 1px;
  background: ${e=>e.theme.border};
  margin: 0.5rem 0;
  
  @media (max-width: 768px) {
    display: none;
  }
`,ve=p.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${e=>e.theme.primary}20;
  border-radius: 8px;
  color: ${e=>e.theme.text};
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`,ze=p.div`
  font-size: 1.2rem;
`,$e=p.div`
  display: flex;
  flex-direction: column;
  font-size: 0.875rem;
  
  @media (max-width: 768px) {
    align-items: center;
  }
`,Se=p.div.withConfig({shouldForwardProp:e=>!["isOpen","theme"].includes(e)})`
  font-size: 0.75rem;
  color: ${e=>e.theme.textSecondary};
  transition: transform 0.2s ease;
  transform: ${e=>e.isOpen?"rotate(180deg)":"rotate(0deg)"};
  
  @media (max-width: 768px) {
    display: none;
  }
`,Ce=p.span`
  font-weight: 600;
`,Ne=p.span`
  color: ${e=>e.theme.textSecondary};
  font-size: 0.75rem;
`;p.button`
  background: ${e=>e.theme.error};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.error}dd;
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;const Pe=p.div`
  position: relative;
  display: inline-block;
`,Be=p.div.withConfig({shouldForwardProp:e=>!["isOpen","theme"].includes(e)})`
  display: ${e=>e.isOpen?"block":"none"};
  position: absolute;
  background: ${e=>e.theme.surface};
  min-width: 220px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  border-radius: 12px;
  z-index: 1000;
  margin-top: 0.5rem;
  overflow: hidden;
`,Ae=p(o)`
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${e=>e.theme.text};
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  background: none;
  border: none;
  width: 100%;
  &:hover {
    background: ${e=>e.theme.primary}10;
    color: ${e=>e.theme.primary};
  }
`;p.div`
  padding: 0.75rem 1rem;
  color: ${e=>e.theme.textSecondary};
  font-weight: 600;
  background: ${e=>e.theme.surface};
  cursor: default;
`;const Te=p(o)`
  color: ${e=>e.theme.text};
  text-decoration: none;
  font-weight: 500;
  padding: ${e=>"compact"===e.layout?"0.25rem 0.5rem":"0.5rem 1rem"};
  border-radius: ${e=>"compact"===e.layout?"4px":"8px"};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: ${e=>"classic"===e.layout?"100%":"auto"};
  justify-content: ${e=>"classic"===e.layout?"flex-start":"center"};
  position: relative;
  
  &:hover {
    background: ${e=>e.theme.primary}20;
    color: ${e=>e.theme.primary};
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 0.75rem 1rem;
    justify-content: flex-start;
  }
`,Me=p.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: ${e=>e.theme.primary};
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  min-width: 20px;
`;function Le({theme:e,toggleTheme:t,layout:r="modern"}){const{user:o,isAuthenticated:a,logout:n}=N(),[s,d]=i.useState(!1),[c,l]=i.useState(!1),m=i.useRef(null),[h,p]=i.useState([]),[x,u]=i.useState(0),[g,j]=i.useState(!1),y=i.useRef(null),[b,f]=i.useState(0),k=i.useRef(null);i.useEffect(()=>{a&&(v(),z())},[a]);const v=async()=>{try{const e=await fetch("/api/notifications?limit=5",{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});if(e.ok){const t=await e.json();p(t.notifications),u(t.notifications.filter(e=>"unread"===e.status).length)}}catch(e){}},z=async()=>{try{const e=await fetch("http://localhost:5000/api/cart/summary",{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});if(e.ok){const t=await e.json();f(t.itemCount||0)}}catch(e){}},$=()=>{l(!1)};i.useEffect(()=>{const e=e=>{m.current&&!m.current.contains(e.target)&&l(!1)},t=e=>{"Escape"===e.key&&l(!1)};return c&&(document.addEventListener("mousedown",e),document.addEventListener("keydown",t)),()=>{document.removeEventListener("mousedown",e),document.removeEventListener("keydown",t)}},[c]),i.useEffect(()=>{const e=e=>{y.current&&!y.current.contains(e.target)&&j(!1)};return g&&document.addEventListener("mousedown",e),()=>{document.removeEventListener("mousedown",e)}},[g]);return w.jsxs(le,{theme:e,layout:r,children:[w.jsx(me,{to:"/",theme:e,children:"🏪 Portal"}),w.jsx(xe,{onClick:()=>{d(!s)},theme:e,children:s?"✕":"☰"}),w.jsxs(he,{isOpen:s,theme:e,layout:r,children:[w.jsx(pe,{to:"/",theme:e,layout:r,onClick:()=>d(!1),children:"🏠 Strona główna"}),w.jsx(pe,{to:"/products",theme:e,layout:r,onClick:()=>d(!1),children:"📦 Produkty"}),w.jsx(pe,{to:"/shops",theme:e,layout:r,onClick:()=>d(!1),children:"🏪 Sklepy"}),a&&w.jsxs(Te,{to:"/cart",theme:e,layout:r,onClick:()=>d(!1),children:["🛒 Koszyk",b>0&&w.jsx(Me,{theme:e,children:b>99?"99+":b})]}),w.jsx(pe,{to:"/messages",theme:e,layout:r,onClick:()=>d(!1),children:"💬 Wiadomości"}),w.jsx(pe,{to:"/gamification",theme:e,layout:r,onClick:()=>d(!1),children:"🏆 Gamifikacja"}),w.jsx(pe,{to:"/notifications",theme:e,layout:r,onClick:()=>d(!1),children:"🔔 Powiadomienia"}),w.jsx(pe,{to:"/company-profiles",theme:e,layout:r,onClick:()=>d(!1),children:"🏢 Firmy"}),w.jsx(pe,{to:"/advanced-features",theme:e,layout:r,onClick:()=>d(!1),children:"🚀 Zaawansowane"}),w.jsx(pe,{to:"/teryt-features",theme:e,layout:r,onClick:()=>d(!1),children:"🗺️ TERYT"}),o?.shops&&o.shops.length>0&&w.jsxs(w.Fragment,{children:[w.jsx(pe,{to:"/shop-management",theme:e,layout:r,onClick:()=>d(!1),children:"🏪 Zarządzaj sklepami"}),w.jsx(pe,{to:"/product-management",theme:e,layout:r,onClick:()=>d(!1),children:"📦 Zarządzaj produktami"})]}),w.jsxs(Pe,{ref:y,onMouseEnter:()=>{k.current&&(clearTimeout(k.current),k.current=null),j(!0)},onMouseLeave:()=>{k.current=setTimeout(()=>{j(!1)},200)},children:[w.jsxs(pe,{as:"div",theme:e,layout:r,style:{cursor:"pointer",userSelect:"none"},children:[w.jsx(Z,{style:{marginRight:6}})," Lokalizacje ",w.jsx(L,{style:{marginLeft:4,fontSize:12,transition:"transform 0.2s",transform:g?"rotate(180deg)":"rotate(0deg)"}})]}),w.jsxs(Be,{isOpen:g,theme:e,children:[w.jsxs(Ae,{to:"/location-map",theme:e,onClick:()=>d(!1),children:[w.jsx(G,{})," Mapa Lokalizacji"]}),w.jsxs(Ae,{to:"/country",theme:e,onClick:()=>d(!1),children:[w.jsx(Z,{})," Kraj"]}),w.jsxs(Ae,{to:"/voivodeships",theme:e,onClick:()=>d(!1),children:[w.jsx(Y,{})," Województwa"]}),w.jsxs(Ae,{to:"/counties",theme:e,onClick:()=>d(!1),children:[w.jsx(q,{})," Powiaty"]}),w.jsxs(Ae,{to:"/municipalities",theme:e,onClick:()=>d(!1),children:[w.jsx(E,{})," Gminy"]}),w.jsxs(Ae,{to:"/cities",theme:e,onClick:()=>d(!1),children:[w.jsx(E,{})," Miasta"]})]})]}),o?.roles&&o.roles.includes("admin")&&w.jsx(pe,{to:"/admin-panel",theme:e,layout:r,onClick:()=>d(!1),children:"⚙️ Panel Admina"})]}),w.jsx(ue,{onClick:t,theme:e,children:"dark"===e?"☀️":"🌙"}),a?w.jsxs(be,{ref:m,children:[w.jsxs(ve,{theme:e,onClick:()=>{l(!c)},style:{cursor:"pointer"},children:[w.jsx(ze,{children:"👤"}),w.jsxs($e,{children:[w.jsx(Ce,{children:o?.username}),w.jsxs(Ne,{theme:e,children:["Poziom ",o?.level||1]})]}),w.jsx(Se,{theme:e,isOpen:c,children:"▼"})]}),w.jsxs(fe,{theme:e,isOpen:c,children:[w.jsx(we,{onClick:()=>{window.location.href="/profile",$(),d(!1)},children:"👤 Mój profil"}),w.jsxs(we,{onClick:()=>{window.location.href="/cart",$(),d(!1)},children:["🛒 Mój koszyk ",b>0&&`(${b})`]}),o?.shops&&o.shops.length>0&&w.jsxs(w.Fragment,{children:[w.jsxs(we,{onClick:()=>{window.location.href="/shop-management",$(),d(!1)},children:["🏪 Moje sklepy (",o.shops.length,")"]}),w.jsx(we,{onClick:()=>{window.location.href="/my-products",$(),d(!1)},children:"📦 Moje produkty"})]}),w.jsx(we,{onClick:()=>{window.location.href="/local-products",$(),d(!1)},children:"🏘️ Produkty lokalne"}),w.jsx(we,{onClick:()=>{window.location.href="/friends",$(),d(!1)},children:"👥 Znajomi"}),w.jsx(we,{onClick:()=>{window.location.href="/settings",$(),d(!1)},children:"⚙️ Ustawienia"}),w.jsx(we,{onClick:()=>{window.location.href="/layout-customization",$(),d(!1)},children:"🎨 Dostosuj wygląd"}),o?.roles&&o.roles.includes("admin")&&w.jsxs(w.Fragment,{children:[w.jsx(ke,{theme:e}),w.jsx(we,{onClick:()=>{window.location.href="/admin-panel",$(),d(!1)},children:"🔧 Panel administracyjny"})]}),w.jsx(ke,{theme:e}),w.jsx(we,{onClick:()=>{n(),$(),d(!1)},style:{color:"#ef4444"},children:"🚪 Wyloguj"})]})]}):w.jsxs(ge,{children:[w.jsx(je,{to:"/login",theme:e,onClick:()=>d(!1),children:"🔑 Zaloguj"}),w.jsx(ye,{to:"/register",theme:e,onClick:()=>d(!1),children:"📝 Zarejestruj"})]})]})}const Ee=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`,We=p.div`
  text-align: center;
  margin-bottom: 3rem;
  padding: 3rem 0;
  
  @media (max-width: 768px) {
    padding: 2rem 0;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 0;
    margin-bottom: 1.5rem;
  }
`,De=p.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`,Oe=p.p`
  font-size: 1.2rem;
  color: ${e=>e.theme.textSecondary};
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
`,Ie=p.div`
  background: ${e=>e.theme.surface};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: ${e=>e.theme.shadow};
  margin-bottom: 2rem;
  text-align: center;
`,Fe=p.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${e=>e.theme.text};
`,_e=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`,Re=p.div`
  background: ${e=>e.theme.background};
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
`,Ze=p.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${e=>e.theme.primary};
  margin-bottom: 0.25rem;
`,He=p.div`
  font-size: 0.875rem;
  color: ${e=>e.theme.textSecondary};
`,Ue=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`,Ke=p.div`
  background: ${e=>e.theme.surface};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: ${e=>e.theme.shadow};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
`,Ye=p.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`,Ve=p.div`
  font-size: 2rem;
`,qe=p.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${e=>e.theme.text};
  margin: 0;
`,Ge=p.div`
  color: ${e=>e.theme.textSecondary};
  line-height: 1.6;
  margin-bottom: 1.5rem;
`,Je=p.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`,Xe=p(o)`
  background: ${e=>e.theme.gradient};
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.gradientHover};
    transform: translateY(-1px);
  }
`,Qe=p(o)`
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  border: 2px solid ${e=>e.theme.border};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.border};
  }
`,et=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 1.5rem;
  }
`,tt=p.div`
  background: ${e=>e.theme.surface};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: ${e=>e.theme.shadow};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
`,rt=p.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`,it=p.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${e=>e.theme.text};
`,ot=p.p`
  color: ${e=>e.theme.textSecondary};
  line-height: 1.6;
`,at=p.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: ${e=>e.theme.textSecondary};
`,nt=p.div`
  background: ${e=>e.theme.error}20;
  color: ${e=>e.theme.error};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;function st(){const{user:e,isAuthenticated:t}=N(),[r,o]=i.useState({totalShops:0,totalProducts:0,totalUsers:0,recentActivity:0}),[a,n]=i.useState(!0),[s,d]=i.useState(null);i.useEffect(()=>{t?c():n(!1)},[t]);const c=async()=>{try{n(!0);const e="http://localhost:5000",t=localStorage.getItem("token"),[r,i,a]=await Promise.allSettled([fetch(`${e}/api/shops`,{headers:{Authorization:`Bearer ${t}`}}),fetch(`${e}/api/products`,{headers:{Authorization:`Bearer ${t}`}}),fetch(`${e}/api/users`,{headers:{Authorization:`Bearer ${t}`}})]);let s=0,d=0,c=0;if("fulfilled"===r.status&&r.value.ok){s=(await r.value.json()).length||0}if("fulfilled"===i.status&&i.value.ok){d=(await i.value.json()).length||0}if("fulfilled"===a.status&&a.value.ok){c=(await a.value.json()).length||0}o({totalShops:s,totalProducts:d,totalUsers:c,recentActivity:Math.floor(50*Math.random())+10})}catch(e){d("Nie udało się pobrać statystyk")}finally{n(!1)}};return a?w.jsx(Ee,{children:w.jsx(at,{children:"Ładowanie dashboardu..."})}):w.jsxs(Ee,{children:[w.jsxs(We,{children:[w.jsx(De,{children:"Witaj w Portalu"}),w.jsx(Oe,{children:"Nowoczesna platforma e-commerce z modułową architekturą"})]}),s&&w.jsx(nt,{children:s}),t&&e&&w.jsxs(Ie,{children:[w.jsxs(Fe,{children:["Witaj, ",e.username||e.firstName||"Użytkowniku","! 👋"]}),w.jsxs(_e,{children:[w.jsxs(Re,{children:[w.jsx(Ze,{children:e.level||1}),w.jsx(He,{children:"Poziom"})]}),w.jsxs(Re,{children:[w.jsx(Ze,{children:e.experience||0}),w.jsx(He,{children:"Doświadczenie"})]}),w.jsxs(Re,{children:[w.jsx(Ze,{children:e.shops?.length||0}),w.jsx(He,{children:"Twoje sklepy"})]}),w.jsxs(Re,{children:[w.jsx(Ze,{children:r.recentActivity}),w.jsx(He,{children:"Aktywność dziś"})]})]})]}),w.jsxs(Ue,{children:[w.jsxs(Ke,{children:[w.jsxs(Ye,{children:[w.jsx(Ve,{children:"🏪"}),w.jsx(qe,{children:"Zarządzanie sklepami"})]}),w.jsx(Ge,{children:t?w.jsxs(w.Fragment,{children:[w.jsxs("p",{children:["Masz ",e.shops?.length||0," sklepów. Zarządzaj produktami, zamówieniami i klientami."]}),w.jsxs(Je,{children:[w.jsx(Xe,{to:"/shop-management",children:"🏪 Moje sklepy"}),w.jsx(Qe,{to:"/shop-create",children:"➕ Dodaj sklep"})]})]}):w.jsxs(w.Fragment,{children:[w.jsx("p",{children:"Zakładaj sklepy, dodawaj produkty i rozwijaj swój biznes online."}),w.jsxs(Je,{children:[w.jsx(Xe,{to:"/register",children:"📝 Zarejestruj się"}),w.jsx(Qe,{to:"/login",children:"🔑 Zaloguj się"})]})]})})]}),w.jsxs(Ke,{children:[w.jsxs(Ye,{children:[w.jsx(Ve,{children:"📦"}),w.jsx(qe,{children:"Produkty lokalne"})]}),w.jsxs(Ge,{children:[w.jsx("p",{children:"Odkryj produkty z Twojej okolicy. Wspieraj lokalnych sprzedawców i znajdź unikalne towary."}),w.jsxs(Je,{children:[w.jsx(Xe,{to:"/local-products",children:"🏘️ Produkty lokalne"}),w.jsx(Qe,{to:"/products",children:"🔍 Wszystkie produkty"})]})]})]}),w.jsxs(Ke,{children:[w.jsxs(Ye,{children:[w.jsx(Ve,{children:"📍"}),w.jsx(qe,{children:"Lokalizacje"})]}),w.jsxs(Ge,{children:[w.jsx("p",{children:"Przeglądaj województwa, powiaty i gminy. Znajdź sklepy i produkty w swojej okolicy."}),w.jsxs(Je,{children:[w.jsx(Xe,{to:"/voivodeships",children:"🏛️ Województwa"}),w.jsx(Qe,{to:"/location-analytics",children:"📊 Analityka"})]})]})]}),w.jsxs(Ke,{children:[w.jsxs(Ye,{children:[w.jsx(Ve,{children:"💬"}),w.jsx(qe,{children:"Komunikacja"})]}),w.jsxs(Ge,{children:[w.jsx("p",{children:"System wiadomości i powiadomień w czasie rzeczywistym. Bądź na bieżąco z aktywnością."}),w.jsxs(Je,{children:[w.jsx(Xe,{to:"/messages",children:"💬 Wiadomości"}),w.jsx(Qe,{to:"/notifications",children:"🔔 Powiadomienia"})]})]})]}),w.jsxs(Ke,{children:[w.jsxs(Ye,{children:[w.jsx(Ve,{children:"🏆"}),w.jsx(qe,{children:"Gamifikacja"})]}),w.jsxs(Ge,{children:[w.jsx("p",{children:"System osiągnięć, odznak i poziomów. Rozwijaj się i zdobywaj nagrody za aktywność."}),w.jsxs(Je,{children:[w.jsx(Xe,{to:"/gamification",children:"🏆 Osiągnięcia"}),w.jsx(Qe,{to:"/profile",children:"👤 Profil"})]})]})]}),w.jsxs(Ke,{children:[w.jsxs(Ye,{children:[w.jsx(Ve,{children:"⚙️"}),w.jsx(qe,{children:"Ustawienia"})]}),w.jsxs(Ge,{children:[w.jsx("p",{children:"Dostosuj wygląd aplikacji, zarządzaj kontem i ustawieniami prywatności."}),w.jsxs(Je,{children:[w.jsx(Xe,{to:"/settings",children:"⚙️ Ustawienia"}),w.jsx(Qe,{to:"/layout-customization",children:"🎨 Wygląd"})]})]})]})]}),w.jsxs(et,{children:[w.jsxs(tt,{children:[w.jsx(rt,{children:"🏪"}),w.jsx(it,{children:"Sklepy"}),w.jsx(ot,{children:"Zarządzaj swoim sklepem, dodawaj produkty i obsługuj klientów w jednym miejscu."})]}),w.jsxs(tt,{children:[w.jsx(rt,{children:"📍"}),w.jsx(it,{children:"Lokalizacje"}),w.jsx(ot,{children:"System lokalizacji oparty na danych TERYT z pełną hierarchią województw, powiatów i gmin."})]}),w.jsxs(tt,{children:[w.jsx(rt,{children:"💬"}),w.jsx(it,{children:"Komunikacja"}),w.jsx(ot,{children:"System wiadomości i powiadomień w czasie rzeczywistym z zaawansowanymi opcjami."})]}),w.jsxs(tt,{children:[w.jsx(rt,{children:"💳"}),w.jsx(it,{children:"Płatności"}),w.jsx(ot,{children:"Bezpieczne płatności online z modułowym systemem obsługującym różne metody płatności."})]}),w.jsxs(tt,{children:[w.jsx(rt,{children:"🏆"}),w.jsx(it,{children:"Gamifikacja"}),w.jsx(ot,{children:"System osiągnięć, odznak i poziomów dla użytkowników. Motywuj do aktywności."})]}),w.jsxs(tt,{children:[w.jsx(rt,{children:"🤖"}),w.jsx(it,{children:"AI & Automatyzacja"}),w.jsx(ot,{children:"Integracje z AI dla lepszego doświadczenia użytkownika i automatyzacji procesów."})]})]})]})}const dt=p.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
    max-width: 100%;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`,ct=p.h1`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
`,lt=p.form`
  background: ${e=>e.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${e=>e.theme.shadow};
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 12px;
  }
`,mt=p.div`
  margin-bottom: 1.5rem;
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`,ht=p.label`
  display: block;
  font-weight: 600;
  color: ${e=>e.theme.text};
  margin-bottom: 0.5rem;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`,pt=p.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
    box-shadow: 0 0 0 3px ${e=>e.theme.primary}20;
  }
  
  &::placeholder {
    color: ${e=>e.theme.textSecondary};
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
`,xt=p.button`
  width: 100%;
  padding: 1rem 2rem;
  background: ${e=>e.theme.gradient};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1rem;
  
  &:hover {
    background: ${e=>e.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 1.75rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
`,ut=p.div`
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: ${e=>e.theme.border};
  }
  
  span {
    background: ${e=>e.theme.surface};
    padding: 0 1rem;
    color: ${e=>e.theme.textSecondary};
    font-size: 0.875rem;
  }
  
  @media (max-width: 480px) {
    margin: 1rem 0;
    
    span {
      font-size: 0.8rem;
    }
  }
`,gt=p.button`
  width: 100%;
  padding: 1rem 2rem;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  border: 2px solid ${e=>e.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${e=>e.theme.primary}10;
    border-color: ${e=>e.theme.primary};
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 1.75rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
`,jt=p.div`
  text-align: center;
  margin-top: 1.5rem;
  color: ${e=>e.theme.textSecondary};
  
  a {
    color: ${e=>e.theme.primary};
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  @media (max-width: 480px) {
    margin-top: 1rem;
    font-size: 0.9rem;
  }
`,yt=p.div`
  color: ${e=>e.theme.error};
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: center;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`,bt=p.div`
  color: ${e=>e.theme.success};
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: center;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`,ft=p.div`
  background: ${e=>e.theme.background};
  border: 2px solid ${e=>e.theme.border};
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  
  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.75rem;
    border-radius: 8px;
  }
`,wt=p.div`
  font-weight: 600;
  color: ${e=>e.theme.text};
  margin-bottom: 0.5rem;
`,kt=p.div`
  color: ${e=>e.theme.textSecondary};
  margin-bottom: 0.25rem;
  
  @media (max-width: 480px) {
    word-break: break-all;
  }
`,vt=p.button`
  background: ${e=>e.theme.primary};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  margin-left: 0.5rem;
  
  &:hover {
    background: ${e=>e.theme.primary}dd;
  }
  
  @media (max-width: 480px) {
    padding: 0.2rem 0.4rem;
    font-size: 0.7rem;
    margin-left: 0.25rem;
  }
`;function zt(){const[e,t]=i.useState({emailOrUsername:"",password:""}),[r,n]=i.useState({}),[s,d]=i.useState(!1),[c,l]=i.useState(""),m=a(),{login:h,isAuthenticated:p}=N();i.useEffect(()=>{p&&m("/")},[p,m]);const x=i=>{const{name:o,value:a}=i.target;t({...e,[o]:a}),r[o]&&n({...r,[o]:""})},u=e=>{l(`Logowanie przez ${e} (symulacja)`)},g=e=>{navigator.clipboard.writeText(e),alert("Skopiowano do schowka!")};return w.jsxs(dt,{children:[w.jsx(ct,{children:"Logowanie"}),w.jsxs(lt,{onSubmit:async t=>{if(t.preventDefault(),l(""),(()=>{const t={};return e.emailOrUsername.trim()||(t.emailOrUsername="Email lub nazwa użytkownika jest wymagana"),e.password?e.password.length<6&&(t.password="Hasło musi mieć co najmniej 6 znaków"):t.password="Hasło jest wymagane",n(t),0===Object.keys(t).length})()){d(!0);try{const t=/\S+@\S+\.\S+/.test(e.emailOrUsername)?{email:e.emailOrUsername,password:e.password}:{username:e.emailOrUsername,password:e.password},r=await h(t);r.success?(l("Zalogowano pomyślnie! Przekierowywanie..."),setTimeout(()=>{m("/")},1e3)):l(r.error)}catch(r){l("Wystąpił błąd podczas logowania")}finally{d(!1)}}},children:[w.jsxs(ft,{children:[w.jsx(wt,{children:"🧪 Dane testowe:"}),w.jsxs(kt,{children:["Email: test@example.com",w.jsx(vt,{onClick:()=>g("test@example.com"),children:"Kopiuj"})]}),w.jsxs(kt,{children:["Nazwa użytkownika: testuser",w.jsx(vt,{onClick:()=>g("testuser"),children:"Kopiuj"})]}),w.jsxs(kt,{children:["Hasło: password123",w.jsx(vt,{onClick:()=>g("password123"),children:"Kopiuj"})]})]}),c&&(c.includes("pomyślnie")?w.jsx(bt,{children:c}):w.jsx(yt,{children:c})),w.jsxs(mt,{children:[w.jsx(ht,{children:"Email lub nazwa użytkownika"}),w.jsx(pt,{type:"text",name:"emailOrUsername",value:e.emailOrUsername,onChange:x,placeholder:"Wprowadź email lub nazwę użytkownika",disabled:s,autoComplete:"username"}),r.emailOrUsername&&w.jsx(yt,{children:r.emailOrUsername})]}),w.jsxs(mt,{children:[w.jsx(ht,{children:"Hasło"}),w.jsx(pt,{type:"password",name:"password",value:e.password,onChange:x,placeholder:"Wprowadź swoje hasło",disabled:s,autoComplete:"current-password"}),r.password&&w.jsx(yt,{children:r.password})]}),w.jsx(xt,{type:"submit",disabled:s,children:s?"Logowanie...":"Zaloguj się"}),w.jsx(ut,{children:w.jsx("span",{children:"lub"})}),w.jsx(gt,{type:"button",onClick:()=>u("Google"),children:"🔍 Zaloguj przez Google"}),w.jsx(gt,{type:"button",onClick:()=>u("Facebook"),children:"📘 Zaloguj przez Facebook"}),w.jsxs(jt,{children:["Nie masz konta? ",w.jsx(o,{to:"/register",children:"Zarejestruj się"})]})]})]})}const $t=p.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
    max-width: 100%;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`,St=p.h1`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
`,Ct=p.form`
  background: ${e=>e.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${e=>e.theme.shadow};
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 12px;
  }
`,Nt=p.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`,Pt=p.div`
  margin-bottom: 1.5rem;
  
  &.full-width {
    grid-column: 1 / -1;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`,Bt=p.label`
  display: block;
  font-weight: 600;
  color: ${e=>e.theme.text};
  margin-bottom: 0.5rem;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`,At=p.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
    box-shadow: 0 0 0 3px ${e=>e.theme.primary}20;
  }
  
  &::placeholder {
    color: ${e=>e.theme.textSecondary};
  }
  
  &.error {
    border-color: ${e=>e.theme.error};
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
`,Tt=p.select`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
    box-shadow: 0 0 0 3px ${e=>e.theme.primary}20;
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
`,Mt=p.button`
  width: 100%;
  padding: 1rem 2rem;
  background: ${e=>e.theme.gradient};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1rem;
  
  &:hover {
    background: ${e=>e.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 1.75rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
`,Lt=p.div`
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: ${e=>e.theme.border};
  }
  
  span {
    background: ${e=>e.theme.surface};
    padding: 0 1rem;
    color: ${e=>e.theme.textSecondary};
    font-size: 0.875rem;
  }
  
  @media (max-width: 480px) {
    margin: 1rem 0;
    
    span {
      font-size: 0.8rem;
    }
  }
`,Et=p.button`
  width: 100%;
  padding: 1rem 2rem;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  border: 2px solid ${e=>e.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${e=>e.theme.primary}10;
    border-color: ${e=>e.theme.primary};
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 1.75rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
`,Wt=p.div`
  text-align: center;
  margin-top: 1.5rem;
  color: ${e=>e.theme.textSecondary};
  
  a {
    color: ${e=>e.theme.primary};
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  @media (max-width: 480px) {
    margin-top: 1rem;
    font-size: 0.9rem;
  }
`,Dt=p.div`
  color: ${e=>e.theme.error};
  font-size: 0.875rem;
  margin-top: 0.5rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`,Ot=p.div`
  color: ${e=>e.theme.success};
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: center;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`,It=p.div`
  margin-top: 0.5rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`,Ft=p.div`
  height: 4px;
  background: ${e=>e.theme.border};
  border-radius: 2px;
  margin-top: 0.25rem;
  overflow: hidden;
`,_t=p.div`
  height: 100%;
  background: ${e=>"weak"===e.strength?e.theme.error:"medium"===e.strength?e.theme.warning:"strong"===e.strength?e.theme.success:e.theme.border};
  width: ${e=>"weak"===e.strength?"33%":"medium"===e.strength?"66%":"strong"===e.strength?"100%":"0%"};
  transition: all 0.3s ease;
`,Rt=p.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`,Zt=p.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`,Ht=p.label`
  font-size: 0.875rem;
  color: ${e=>e.theme.text};
  cursor: pointer;
  
  a {
    color: ${e=>e.theme.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;function Ut(){const[e,t]=i.useState({firstName:"",lastName:"",email:"",password:"",confirmPassword:"",phone:"",dateOfBirth:"",gender:"",city:"",username:"",acceptTerms:!1,acceptNewsletter:!1}),[r,n]=i.useState({}),[s,d]=i.useState(!1),[c,l]=i.useState(""),[m,h]=i.useState("weak"),p=a(),{register:x,isAuthenticated:u}=N();i.useEffect(()=>{u&&p("/")},[u,p]);const g=i=>{const{name:o,value:a,type:s,checked:d}=i.target;t({...e,[o]:"checkbox"===s?d:a}),r[o]&&n({...r,[o]:""}),"password"===o&&j(a)},j=e=>{let t=0;e.length>=8&&t++,/[a-z]/.test(e)&&t++,/[A-Z]/.test(e)&&t++,/[0-9]/.test(e)&&t++,/[^A-Za-z0-9]/.test(e)&&t++,h(t<=2?"weak":t<=4?"medium":"strong")},y=e=>{l(`Rejestracja przez ${e} (symulacja)`)};return w.jsxs($t,{children:[w.jsx(St,{children:"Rejestracja"}),w.jsxs(Ct,{onSubmit:async t=>{if(t.preventDefault(),l(""),(()=>{const t={};return e.firstName.trim()||(t.firstName="Imię jest wymagane"),e.lastName.trim()||(t.lastName="Nazwisko jest wymagane"),e.email.trim()?/\S+@\S+\.\S+/.test(e.email)||(t.email="Email jest nieprawidłowy"):t.email="Email jest wymagany",e.password?e.password.length<8&&(t.password="Hasło musi mieć co najmniej 8 znaków"):t.password="Hasło jest wymagane",e.password!==e.confirmPassword&&(t.confirmPassword="Hasła nie są identyczne"),e.phone.trim()||(t.phone="Telefon jest wymagany"),e.dateOfBirth||(t.dateOfBirth="Data urodzenia jest wymagana"),e.city.trim()||(t.city="Miasto jest wymagane"),e.username.trim()||(t.username="Nazwa użytkownika jest wymagana"),e.acceptTerms||(t.acceptTerms="Musisz zaakceptować regulamin"),n(t),0===Object.keys(t).length})()){d(!0);try{const t=await x(e);t.success?(l("Konto zostało utworzone pomyślnie! Przekierowywanie..."),setTimeout(()=>{p("/")},1500)):l(t.error)}catch(r){l("Wystąpił błąd podczas rejestracji")}finally{d(!1)}}},children:[c&&(c.includes("pomyślnie")?w.jsx(Ot,{children:c}):w.jsx(Dt,{style:{textAlign:"center"},children:c})),w.jsxs(Nt,{children:[w.jsxs(Pt,{children:[w.jsx(Bt,{children:"Imię *"}),w.jsx(At,{type:"text",name:"firstName",value:e.firstName,onChange:g,placeholder:"Wprowadź imię",disabled:s,className:r.firstName?"error":""}),r.firstName&&w.jsx(Dt,{children:r.firstName})]}),w.jsxs(Pt,{children:[w.jsx(Bt,{children:"Nazwisko *"}),w.jsx(At,{type:"text",name:"lastName",value:e.lastName,onChange:g,placeholder:"Wprowadź nazwisko",disabled:s,className:r.lastName?"error":""}),r.lastName&&w.jsx(Dt,{children:r.lastName})]})]}),w.jsxs(Pt,{children:[w.jsx(Bt,{children:"Email *"}),w.jsx(At,{type:"email",name:"email",value:e.email,onChange:g,placeholder:"Wprowadź swój email",disabled:s,className:r.email?"error":""}),r.email&&w.jsx(Dt,{children:r.email})]}),w.jsxs(Nt,{children:[w.jsxs(Pt,{children:[w.jsx(Bt,{children:"Hasło *"}),w.jsx(At,{type:"password",name:"password",value:e.password,onChange:g,placeholder:"Wprowadź hasło",disabled:s,className:r.password?"error":""}),w.jsxs(It,{children:["Siła hasła: ","weak"===m?"Słabe":"medium"===m?"Średnie":"Silne",w.jsx(Ft,{children:w.jsx(_t,{strength:m})})]}),r.password&&w.jsx(Dt,{children:r.password})]}),w.jsxs(Pt,{children:[w.jsx(Bt,{children:"Potwierdź hasło *"}),w.jsx(At,{type:"password",name:"confirmPassword",value:e.confirmPassword,onChange:g,placeholder:"Potwierdź hasło",disabled:s,className:r.confirmPassword?"error":""}),r.confirmPassword&&w.jsx(Dt,{children:r.confirmPassword})]})]}),w.jsxs(Nt,{children:[w.jsxs(Pt,{children:[w.jsx(Bt,{children:"Telefon *"}),w.jsx(At,{type:"tel",name:"phone",value:e.phone,onChange:g,placeholder:"+48 123 456 789",disabled:s,className:r.phone?"error":""}),r.phone&&w.jsx(Dt,{children:r.phone})]}),w.jsxs(Pt,{children:[w.jsx(Bt,{children:"Data urodzenia *"}),w.jsx(At,{type:"date",name:"dateOfBirth",value:e.dateOfBirth,onChange:g,disabled:s,className:r.dateOfBirth?"error":""}),r.dateOfBirth&&w.jsx(Dt,{children:r.dateOfBirth})]})]}),w.jsxs(Nt,{children:[w.jsxs(Pt,{children:[w.jsx(Bt,{children:"Płeć"}),w.jsxs(Tt,{name:"gender",value:e.gender,onChange:g,disabled:s,children:[w.jsx("option",{value:"",children:"Wybierz płeć"}),w.jsx("option",{value:"male",children:"Męska"}),w.jsx("option",{value:"female",children:"Żeńska"}),w.jsx("option",{value:"other",children:"Inna"})]})]}),w.jsxs(Pt,{children:[w.jsx(Bt,{children:"Miasto *"}),w.jsx(At,{type:"text",name:"city",value:e.city,onChange:g,placeholder:"Wprowadź miasto",disabled:s,className:r.city?"error":""}),r.city&&w.jsx(Dt,{children:r.city})]})]}),w.jsxs(Pt,{children:[w.jsx(Bt,{children:"Nazwa użytkownika *"}),w.jsx(At,{type:"text",name:"username",value:e.username,onChange:g,placeholder:"Wprowadź nazwę użytkownika",disabled:s,className:r.username?"error":""}),r.username&&w.jsx(Dt,{children:r.username})]}),w.jsxs(Pt,{className:"full-width",children:[w.jsxs(Rt,{children:[w.jsx(Zt,{type:"checkbox",name:"acceptTerms",checked:e.acceptTerms,onChange:g,disabled:s}),w.jsxs(Ht,{children:["Akceptuję ",w.jsx("a",{href:"#",onClick:e=>e.preventDefault(),children:"regulamin"})," i"," ",w.jsx("a",{href:"#",onClick:e=>e.preventDefault(),children:"politykę prywatności"})," *"]})]}),r.acceptTerms&&w.jsx(Dt,{children:r.acceptTerms})]}),w.jsx(Pt,{className:"full-width",children:w.jsxs(Rt,{children:[w.jsx(Zt,{type:"checkbox",name:"acceptNewsletter",checked:e.acceptNewsletter,onChange:g,disabled:s}),w.jsx(Ht,{children:"Chcę otrzymywać newsletter z ofertami i promocjami"})]})}),w.jsx(Mt,{type:"submit",disabled:s,children:s?"Tworzenie konta...":"Zarejestruj się"}),w.jsx(Lt,{children:w.jsx("span",{children:"lub"})}),w.jsx(Et,{type:"button",onClick:()=>y("Google"),children:"🔍 Zarejestruj przez Google"}),w.jsx(Et,{type:"button",onClick:()=>y("Facebook"),children:"📘 Zarejestruj przez Facebook"}),w.jsxs(Wt,{children:["Masz już konto? ",w.jsx(o,{to:"/login",children:"Zaloguj się"})]})]})]})}const Kt=({product:e,onAddToCart:t,onAddToWishlist:r,onQuickView:a})=>{const[n,s]=i.useState(0),[d,c]=i.useState(!1),{_id:l,name:m,description:h,price:p,originalPrice:x,images:u=[],mainImage:g,ratings:j={average:0,count:0},shop:y={},isOnSale:b=!1,isFeatured:f=!1,stock:k=0,shipping:v={},tags:z=[]}=e,$=u[n]||g||u[0]||"/placeholder-product.jpg",S=x?Math.round((x-p)/x*100):0,C=k>0;return w.jsxs("div",{className:"product-card bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group",onMouseEnter:()=>c(!0),onMouseLeave:()=>c(!1),children:[w.jsxs("div",{className:"absolute top-2 left-2 z-10 flex flex-col gap-1",children:[b&&w.jsxs("span",{className:"bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold",children:["-",S,"%"]}),f&&w.jsx("span",{className:"bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold",children:"Polecany"}),!C&&w.jsx("span",{className:"bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-semibold",children:"Niedostępny"})]}),w.jsxs("div",{className:"absolute top-2 right-2 z-10 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity",children:[w.jsx("button",{onClick:t=>{t.preventDefault(),t.stopPropagation(),r&&r(e)},className:"w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors",title:"Dodaj do ulubionych",children:w.jsx(H,{className:"text-sm"})}),w.jsx("button",{onClick:t=>{t.preventDefault(),t.stopPropagation(),a&&a(e)},className:"w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-blue-50 hover:text-blue-500 transition-colors",title:"Szybki podgląd",children:w.jsx(_,{className:"text-sm"})})]}),w.jsxs("div",{className:"relative aspect-square overflow-hidden",children:[w.jsx("img",{src:$,alt:m,className:"w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"}),u.length>1&&w.jsx("div",{className:"absolute bottom-2 left-2 right-2 flex gap-1 justify-center",children:u.slice(0,4).map((e,t)=>w.jsx("button",{onClick:()=>(e=>{s(e)})(t),className:"w-8 h-8 rounded border-2 transition-all "+(t===n?"border-blue-500 scale-110":"border-white hover:border-gray-300"),children:w.jsx("img",{src:e,alt:`${m} ${t+1}`,className:"w-full h-full object-cover rounded"})},t))})]}),w.jsxs("div",{className:"p-4",children:[y.name&&w.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[y.logo&&w.jsx("img",{src:y.logo,alt:y.name,className:"w-4 h-4 rounded"}),w.jsx("span",{className:"text-xs text-gray-600 hover:text-blue-600 cursor-pointer",children:y.name})]}),w.jsx(o,{to:`/product/${l}`,className:"block",children:w.jsx("h3",{className:"font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2",children:m})}),w.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[w.jsx("div",{className:"flex items-center",children:[...Array(5)].map((e,t)=>w.jsx(ie,{className:"w-3 h-3 "+(t<Math.floor(j.average)?"text-yellow-400":"text-gray-300")},t))}),w.jsxs("span",{className:"text-xs text-gray-600",children:["(",j.count,")"]})]}),w.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[w.jsxs("span",{className:"text-xl font-bold text-gray-900",children:[p.toFixed(2)," zł"]}),x&&x>p&&w.jsxs("span",{className:"text-sm text-gray-500 line-through",children:[x.toFixed(2)," zł"]})]}),v.freeShipping&&w.jsxs("div",{className:"flex items-center gap-1 text-xs text-green-600 mb-2",children:[w.jsx(de,{}),w.jsx("span",{children:"Darmowa dostawa"})]}),y.address?.city&&w.jsxs("div",{className:"flex items-center gap-1 text-xs text-gray-600 mb-3",children:[w.jsx(V,{}),w.jsx("span",{children:y.address.city})]}),z.length>0&&w.jsx("div",{className:"flex flex-wrap gap-1 mb-3",children:z.slice(0,3).map((e,t)=>w.jsx("span",{className:"text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded",children:e},t))}),w.jsx("div",{className:"flex gap-2",children:w.jsxs("button",{onClick:r=>{r.preventDefault(),r.stopPropagation(),t&&t(e)},disabled:!C,className:"flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors "+(C?"bg-blue-600 text-white hover:bg-blue-700":"bg-gray-300 text-gray-500 cursor-not-allowed"),children:[w.jsx(te,{}),C?"Dodaj do koszyka":"Niedostępny"]})}),C&&k<10&&w.jsxs("div",{className:"mt-2 text-xs text-orange-600",children:["Pozostało tylko ",k," sztuk!"]}),w.jsxs("div",{className:"flex items-center gap-1 mt-2 text-xs text-gray-500",children:[w.jsx(ee,{}),w.jsx("span",{children:"Bezpieczne zakupy"})]})]})]})},Yt=({products:e=[],loading:t=!1,onAddToCart:r,onAddToWishlist:o,onQuickView:a,onFiltersChange:n,onSortChange:s,onPageChange:d})=>{const[c,l]=i.useState("grid"),[m,h]=i.useState(!1),[p,x]=i.useState({category:"",minPrice:"",maxPrice:"",rating:"",availability:"",delivery:""}),[u,g]=i.useState("newest"),j=(e,t)=>{const r={...p,[e]:t};x(r),n&&n(r)},y=()=>{const e={category:"",minPrice:"",maxPrice:"",rating:"",availability:"",delivery:""};x(e),n&&n(e)};return t?w.jsx("div",{className:"flex justify-center items-center h-64",children:w.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"})}):0===e.length?w.jsxs("div",{className:"text-center py-12",children:[w.jsx("div",{className:"text-gray-400 text-6xl mb-4",children:"🔍"}),w.jsx("h3",{className:"text-xl font-semibold text-gray-700 mb-2",children:"Nie znaleziono produktów"}),w.jsx("p",{className:"text-gray-500 mb-4",children:"Spróbuj zmienić filtry lub wyszukiwanie"}),w.jsx("button",{onClick:y,className:"bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors",children:"Wyczyść filtry"})]}):w.jsxs("div",{className:"space-y-6",children:[w.jsxs("div",{className:"flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm",children:[w.jsxs("div",{className:"text-sm text-gray-600",children:["Znaleziono ",e.length," produktów"]}),w.jsxs("div",{className:"flex items-center gap-4",children:[w.jsxs("div",{className:"flex items-center bg-gray-100 rounded-lg p-1",children:[w.jsx("button",{onClick:()=>l("grid"),className:"p-2 rounded transition-colors "+("grid"===c?"bg-white text-blue-600 shadow-sm":"text-gray-600 hover:text-gray-800"),title:"Widok siatki",children:w.jsx(ae,{})}),w.jsx("button",{onClick:()=>l("list"),className:"p-2 rounded transition-colors "+("list"===c?"bg-white text-blue-600 shadow-sm":"text-gray-600 hover:text-gray-800"),title:"Widok listy",children:w.jsx(K,{})})]}),w.jsxs("div",{className:"relative",children:[w.jsxs("select",{value:u,onChange:e=>{return t=e.target.value,g(t),void(s&&s(t));var t},className:"appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",children:[w.jsx("option",{value:"newest",children:"Najnowsze"}),w.jsx("option",{value:"price_asc",children:"Cena: od najniższej"}),w.jsx("option",{value:"price_desc",children:"Cena: od najwyższej"}),w.jsx("option",{value:"rating",children:"Najwyżej oceniane"}),w.jsx("option",{value:"popularity",children:"Najpopularniejsze"}),w.jsx("option",{value:"name_asc",children:"Nazwa: A-Z"}),w.jsx("option",{value:"name_desc",children:"Nazwa: Z-A"})]}),w.jsx(re,{className:"absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"})]}),w.jsxs("button",{onClick:()=>h(!m),className:"flex items-center gap-2 px-4 py-2 rounded-lg transition-colors "+(m?"bg-blue-600 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"),children:[w.jsx(R,{}),w.jsx("span",{className:"hidden sm:inline",children:"Filtry"})]})]})]}),m&&w.jsxs("div",{className:"bg-white p-6 rounded-lg shadow-sm border",children:[w.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:[w.jsxs("div",{children:[w.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Kategoria"}),w.jsxs("select",{value:p.category,onChange:e=>j("category",e.target.value),className:"w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",children:[w.jsx("option",{value:"",children:"Wszystkie kategorie"}),w.jsx("option",{value:"electronics",children:"Elektronika"}),w.jsx("option",{value:"clothing",children:"Odzież"}),w.jsx("option",{value:"home",children:"Dom i ogród"}),w.jsx("option",{value:"sports",children:"Sport"}),w.jsx("option",{value:"books",children:"Książki"}),w.jsx("option",{value:"toys",children:"Zabawki"}),w.jsx("option",{value:"beauty",children:"Kosmetyki"}),w.jsx("option",{value:"food",children:"Żywność"})]})]}),w.jsxs("div",{children:[w.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Zakres cenowy"}),w.jsxs("div",{className:"flex gap-2",children:[w.jsx("input",{type:"number",placeholder:"Od",value:p.minPrice,onChange:e=>j("minPrice",e.target.value),className:"flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"}),w.jsx("input",{type:"number",placeholder:"Do",value:p.maxPrice,onChange:e=>j("maxPrice",e.target.value),className:"flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"})]})]}),w.jsxs("div",{children:[w.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Ocena"}),w.jsxs("select",{value:p.rating,onChange:e=>j("rating",e.target.value),className:"w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",children:[w.jsx("option",{value:"",children:"Wszystkie oceny"}),w.jsx("option",{value:"5",children:"5 gwiazdek"}),w.jsx("option",{value:"4",children:"4+ gwiazdki"}),w.jsx("option",{value:"3",children:"3+ gwiazdki"}),w.jsx("option",{value:"2",children:"2+ gwiazdki"}),w.jsx("option",{value:"1",children:"1+ gwiazdka"})]})]}),w.jsxs("div",{children:[w.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Dostępność"}),w.jsxs("select",{value:p.availability,onChange:e=>j("availability",e.target.value),className:"w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",children:[w.jsx("option",{value:"",children:"Wszystkie"}),w.jsx("option",{value:"in_stock",children:"W magazynie"}),w.jsx("option",{value:"on_sale",children:"Promocje"}),w.jsx("option",{value:"new",children:"Nowe produkty"})]})]}),w.jsxs("div",{children:[w.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Dostawa"}),w.jsxs("select",{value:p.delivery,onChange:e=>j("delivery",e.target.value),className:"w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",children:[w.jsx("option",{value:"",children:"Wszystkie opcje"}),w.jsx("option",{value:"free",children:"Darmowa dostawa"}),w.jsx("option",{value:"same_day",children:"Dostawa tego samego dnia"}),w.jsx("option",{value:"next_day",children:"Dostawa następnego dnia"})]})]})]}),w.jsxs("div",{className:"flex justify-between items-center mt-6 pt-4 border-t",children:[w.jsx("button",{onClick:y,className:"text-gray-600 hover:text-gray-800 text-sm",children:"Wyczyść wszystkie filtry"}),w.jsxs("div",{className:"flex gap-2",children:[w.jsx("button",{onClick:()=>h(!1),className:"px-4 py-2 text-gray-600 hover:text-gray-800",children:"Anuluj"}),w.jsx("button",{onClick:()=>h(!1),className:"px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700",children:"Zastosuj filtry"})]})]})]}),w.jsx("div",{className:"grid"===c?"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6":"space-y-4",children:e.map(e=>w.jsx(Kt,{product:e,onAddToCart:r,onAddToWishlist:o,onQuickView:a,viewMode:c},e._id))}),e.length>0&&w.jsxs("div",{className:"flex justify-center items-center gap-2 mt-8",children:[w.jsx("button",{className:"px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:"Poprzednia"}),w.jsx("div",{className:"flex gap-1",children:[1,2,3,4,5].map(e=>w.jsx("button",{className:"px-3 py-2 rounded-lg "+(1===e?"bg-blue-600 text-white":"border border-gray-300 hover:bg-gray-50"),children:e},e))}),w.jsx("button",{className:"px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50",children:"Następna"})]})]})},Vt=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`,qt=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`,Gt=p.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`,Jt=p(o)`
  background: ${e=>e.theme.gradient};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  
  &:hover {
    background: ${e=>e.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 1.75rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
`,Xt=p.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`,Qt=p.input`
  padding: 0.75rem 1rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 8px;
  background: ${e=>e.theme.surface};
  color: ${e=>e.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
`,er=p.select`
  padding: 0.75rem 1rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 8px;
  background: ${e=>e.theme.surface};
  color: ${e=>e.theme.text};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
`,tr=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`,rr=p.div`
  background: ${e=>e.theme.surface};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: ${e=>e.theme.shadow};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
  
  @media (max-width: 768px) {
    border-radius: 12px;
    
    &:hover {
      transform: translateY(-4px);
    }
  }
  
  @media (max-width: 480px) {
    border-radius: 8px;
    
    &:hover {
      transform: translateY(-2px);
    }
  }
`,ir=p.div`
  height: 120px;
  background: ${e=>e.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  position: relative;
  
  @media (max-width: 768px) {
    height: 100px;
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    height: 80px;
    font-size: 2rem;
  }
`,or=p.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${e=>"open"===e.status?"#10B981":"#EF4444"};
  color: white;
  
  @media (max-width: 480px) {
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.2rem 0.5rem;
    font-size: 0.7rem;
  }
`,ar=p.div`
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`,nr=p.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${e=>e.theme.text};
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`,sr=p.p`
  color: ${e=>e.theme.textSecondary};
  margin-bottom: 1rem;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`,dr=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.85rem;
  }
`,cr=p.div`
  color: ${e=>e.theme.textSecondary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`,lr=p.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${e=>e.theme.accent};
  font-weight: 600;
`,mr=p.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`,hr=p.div`
  text-align: center;
  padding: 0.75rem;
  background: ${e=>e.theme.background};
  border-radius: 8px;
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`,pr=p.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${e=>e.theme.primary};
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`,xr=p.div`
  font-size: 0.75rem;
  color: ${e=>e.theme.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`,ur=p.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`,gr=p.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background: ${e=>e.theme.primary};
    color: white;
    
    &:hover {
      background: ${e=>e.theme.primary}dd;
    }
  }
  
  &.secondary {
    background: ${e=>e.theme.surface};
    color: ${e=>e.theme.text};
    border: 2px solid ${e=>e.theme.border};
    
    &:hover {
      background: ${e=>e.theme.border};
    }
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.85rem;
  }
`,jr=p.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${e=>e.theme.textSecondary};
  
  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 2rem 0.5rem;
  }
`;function yr(){const{user:e}=N(),[t,r]=i.useState([]),[a,n]=i.useState(!0),[s,d]=i.useState(null),[c,l]=i.useState(""),[m,h]=i.useState("all"),[p,x]=i.useState("all"),[u,g]=i.useState(!1),j=async()=>{try{n(!0);const e="http://localhost:5000",t=localStorage.getItem("token"),i=u?"/api/shops":"/api/shops/user",o=await fetch(`${e}${i}`,{headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"}});if(!o.ok)throw new Error("Nie udało się pobrać sklepów");const a=await o.json(),s=a.shops||a;r(s)}catch(e){d(e.message)}finally{n(!1)}};i.useEffect(()=>{j()},[u]),i.useEffect(()=>{const e=()=>{j()};return window.addEventListener("focus",e),()=>window.removeEventListener("focus",e)},[]);const y=t.filter(e=>{if(!e||"object"!=typeof e)return!1;const t=e.name&&"string"==typeof e.name&&e.name.toLowerCase().includes(c.toLowerCase())||e.description&&"string"==typeof e.description&&e.description.toLowerCase().includes(c.toLowerCase()),r="all"===m||e.categories&&Array.isArray(e.categories)&&e.categories.some(e=>"string"==typeof e&&e===m),i="all"===p||(Boolean(e.isActive)?"open":"closed")===p;return t&&r&&i});return a?w.jsx(Vt,{children:w.jsxs("div",{style:{textAlign:"center",padding:"4rem"},children:[w.jsx("div",{style:{fontSize:"2rem",marginBottom:"1rem"},children:"⏳"}),w.jsx("p",{children:"Ładowanie sklepów..."})]})}):s?w.jsx(Vt,{children:w.jsxs("div",{style:{textAlign:"center",padding:"4rem"},children:[w.jsx("div",{style:{fontSize:"4rem",marginBottom:"1rem"},children:"❌"}),w.jsx("h3",{children:"Błąd podczas ładowania sklepów"}),w.jsx("p",{children:s}),w.jsx("button",{onClick:j,style:{marginTop:"1rem",padding:"0.5rem 1rem"},children:"Spróbuj ponownie"})]})}):w.jsxs(Vt,{children:[w.jsxs("div",{style:{background:"yellow",color:"red",fontSize:"2rem",textAlign:"center",padding:"1rem",marginBottom:"2rem"},children:["TEST: ShopList.jsx renderuje się! Liczba sklepów: ",Array.isArray(t)?t.length:"BŁĄD: shops nie jest tablicą"]}),w.jsxs(qt,{children:[w.jsx(Gt,{children:"Sklepy"}),w.jsx(Jt,{to:"/shop-create",children:"🏪 Dodaj sklep"})]}),w.jsx("div",{style:{margin:"1rem 0",textAlign:"center"},children:w.jsx("button",{style:{padding:"0.5rem 1rem",fontSize:"1rem",borderRadius:"8px",background:"#4CAF50",color:"white",border:"none",cursor:"pointer"},onClick:()=>alert("Testowy komunikat działa!"),children:"Pokaż testowy komunikat"})}),w.jsxs(Xt,{children:[w.jsx(Qt,{type:"text",placeholder:"Szukaj sklepów...",value:c,onChange:e=>l(e.target.value)}),w.jsxs(er,{value:m,onChange:e=>h(e.target.value),children:[w.jsx("option",{value:"all",children:"Wszystkie kategorie"}),w.jsx("option",{value:"Elektronika",children:"Elektronika"}),w.jsx("option",{value:"Odzież i moda",children:"Odzież i moda"}),w.jsx("option",{value:"Książki i multimedia",children:"Książki i multimedia"}),w.jsx("option",{value:"Sport i rekreacja",children:"Sport i rekreacja"}),w.jsx("option",{value:"Dom i ogród",children:"Dom i ogród"}),w.jsx("option",{value:"Motoryzacja",children:"Motoryzacja"}),w.jsx("option",{value:"Zdrowie i uroda",children:"Zdrowie i uroda"}),w.jsx("option",{value:"Zabawki i gry",children:"Zabawki i gry"}),w.jsx("option",{value:"Spożywcze",children:"Spożywcze"}),w.jsx("option",{value:"Inne",children:"Inne"})]}),w.jsxs(er,{value:p,onChange:e=>x(e.target.value),children:[w.jsx("option",{value:"all",children:"Wszystkie statusy"}),w.jsx("option",{value:"open",children:"Otwarte"}),w.jsx("option",{value:"closed",children:"Zamknięte"})]}),w.jsx("button",{onClick:()=>g(!u),style:{padding:"0.5rem 1rem",background:u?"#4CAF50":"#2196F3",color:"white",border:"none",borderRadius:"8px",cursor:"pointer",fontWeight:"600"},children:u?"🔒 Moje sklepy":"🔓 Wszystkie sklepy"})]}),0===y.length?w.jsxs(jr,{children:[w.jsx("div",{style:{fontSize:"4rem",marginBottom:"1rem"},children:"🏪"}),w.jsx("h3",{children:"Nie znaleziono sklepów"}),w.jsx("p",{children:"Spróbuj zmienić kryteria wyszukiwania lub dodaj pierwszy sklep"}),w.jsx(Jt,{to:"/shop-create",style:{display:"inline-block",marginTop:"1rem"},children:"🏪 Dodaj pierwszy sklep"})]}):w.jsx(tr,{children:y.map((e,t)=>w.jsxs(rr,{children:[w.jsxs(ir,{children:[w.jsx(or,{status:Boolean(e.isActive)?"open":"closed",children:Boolean(e.isActive)?"Otwarte":"Zamknięte"}),w.jsx("div",{style:{fontSize:"2rem"},children:"🏪"})]}),w.jsxs(ar,{children:[w.jsx(nr,{children:"string"==typeof e.name?e.name:"Brak nazwy"}),w.jsx(sr,{children:"string"==typeof e.description?e.description:"Brak opisu"}),w.jsxs(dr,{children:[w.jsxs(cr,{children:["📍 ","string"==typeof e.location?.name?e.location.name:"string"==typeof e.address?.city?e.address.city:"Brak lokalizacji"]}),w.jsxs(lr,{children:["⭐ ","number"==typeof e.rating?e.rating:"Brak ocen"]})]}),w.jsxs(mr,{children:[w.jsxs(hr,{children:[w.jsx(pr,{children:"number"==typeof e.stats?.totalProducts?e.stats.totalProducts:0}),w.jsx(xr,{children:"Produktów"})]}),w.jsxs(hr,{children:[w.jsx(pr,{children:"number"==typeof e.stats?.totalOrders?e.stats.totalOrders:0}),w.jsx(xr,{children:"Zamówień"})]})]}),w.jsxs(ur,{children:[w.jsx(gr,{className:"primary",as:o,to:`/shop/${"string"==typeof e._id?e._id:"string"==typeof e.id?e.id:"unknown"}`,children:"🛒 Przejdź do sklepu"}),w.jsx(gr,{className:"secondary",as:o,to:`/shop/${"string"==typeof e._id?e._id:"string"==typeof e.id?e.id:"unknown"}`,children:"👁️ Szczegóły"})]})]})]},"string"==typeof e._id?e._id:"string"==typeof e.id?e.id:`shop-${t}`))})]})}const br=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`,fr=p.h1`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`,wr=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`,kr=p.button`
  padding: 1rem 2rem;
  background: ${e=>e.theme.gradient};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
`,vr=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`,zr=p.div`
  background: ${e=>e.theme.surface};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: ${e=>e.theme.shadow};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
`,$r=p.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1rem;
`,Sr=p.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${e=>e.theme.text};
`,Cr=p.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${e=>e.theme.primary};
  margin-bottom: 0.5rem;
`,Nr=p.p`
  color: ${e=>e.theme.textSecondary};
  margin-bottom: 1rem;
  line-height: 1.5;
`,Pr=p.div`
  display: flex;
  gap: 0.5rem;
`,Br=p.button`
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.edit {
    background: ${e=>e.theme.info};
    color: white;
    
    &:hover {
      background: ${e=>e.theme.info}dd;
    }
  }
  
  &.delete {
    background: ${e=>e.theme.error};
    color: white;
    
    &:hover {
      background: ${e=>e.theme.error}dd;
    }
  }
`,Ar=p.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${e=>e.theme.textSecondary};
`,Tr=p.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`,Mr=p.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`,Lr=p.div`
  background: ${e=>e.theme.surface};
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`,Er=p.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`,Wr=p.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`,Dr=p.label`
  font-weight: 600;
  color: ${e=>e.theme.text};
`,Or=p.input`
  padding: 0.75rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
  }
`,Ir=p.textarea`
  padding: 0.75rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
  }
`,Fr=p.select`
  padding: 0.75rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
  }
`,_r=p.button`
  flex: 1;
  padding: 0.5rem 1rem;
  background: ${e=>e.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.primary}dd;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,Rr=p.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  
  &.success {
    background: #4caf50;
  }
  
  &.error {
    background: #f44336;
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;function Zr({shopId:e,theme:t,isOwner:r}){const{user:a,isAuthenticated:n}=N(),[s,d]=i.useState([]),[c,l]=i.useState(!0),[m,h]=i.useState(!1),[p,x]=i.useState(null),[u,g]=i.useState(null),[j,y]=i.useState({name:"",description:"",price:"",category:"",brand:"",stock:"0",images:[]}),b=void 0!==r?r:u&&a&&u._id===a._id;i.useEffect(()=>{f(),k()},[e]);const f=async()=>{try{const t="http://localhost:5000",r=localStorage.getItem("token"),i=await fetch(`${t}/api/shops/${e}`,{headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"}});if(i.ok){const e=await i.json();g(e.owner)}}catch(t){}},k=async()=>{try{const t="http://localhost:5000",r=localStorage.getItem("token"),i=await fetch(`${t}/api/products/shop/${e}`,{headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"}});if(i.ok){const e=await i.json();d(e.products||e)}}catch(t){}finally{l(!1)}},v=e=>{const{name:t,value:r}=e.target;y(e=>({...e,[t]:r}))},z=()=>{y({name:"",description:"",price:"",category:"",brand:"",stock:"0",images:[]})},$=()=>{h(!1),x(null),z()},[S,C]=i.useState(null);return i.useEffect(()=>{if(S){const e=setTimeout(()=>{C(null)},3e3);return()=>clearTimeout(e)}},[S]),c?w.jsx("div",{children:"Ładowanie produktów..."}):w.jsxs(br,{children:[S&&w.jsx(Rr,{className:S.type,children:S.message}),w.jsx(fr,{children:"Produkty sklepu"}),w.jsxs(wr,{children:[w.jsxs("h2",{children:["Lista produktów (",s.length,")"]}),b&&w.jsx(kr,{onClick:()=>h(!0),children:"➕ Dodaj produkt"})]}),0===s.length?w.jsxs(Ar,{children:[w.jsx(Tr,{children:"📦"}),w.jsx("h3",{children:"Brak produktów"}),w.jsx("p",{children:"Dodaj swój pierwszy produkt, aby rozpocząć sprzedaż!"})]}):w.jsx(vr,{children:s.map(e=>w.jsx(o,{to:`/product/${e._id}`,style:{textDecoration:"none"},children:w.jsxs(zr,{children:[e.images&&e.images[0]&&w.jsx($r,{src:e.images[0],alt:e.name}),w.jsx(Sr,{children:e.name}),w.jsxs(Cr,{children:[e.price," zł"]}),w.jsx(Nr,{children:e.description}),w.jsxs(Pr,{children:[n&&e.isActive&&e.stock>0&&w.jsx(_r,{theme:t,onClick:t=>(async(e,t)=>{if(t.preventDefault(),t.stopPropagation(),n)try{const t=await fetch("http://localhost:5000/api/cart/add",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`},body:JSON.stringify({productId:e,quantity:1})}),r=await t.json();t.ok?C({type:"success",message:"Dodano do koszyka!"}):C({type:"error",message:r.error||"Błąd dodawania do koszyka"})}catch(r){C({type:"error",message:"Błąd sieci"})}else C({type:"error",message:"Musisz się zalogować, aby dodać produkt do koszyka"})})(e._id,t),children:"🛒 Dodaj do koszyka"}),b&&w.jsxs(w.Fragment,{children:[w.jsx(Br,{className:"edit",onClick:t=>{t.preventDefault(),(e=>{x(e),y({name:e.name,description:e.description,price:e.price.toString(),category:e.category,brand:e.brand||"",stock:(e.stock||0).toString(),images:e.images||[]}),h(!0)})(e)},children:"✏️ Edytuj"}),w.jsx(Br,{className:"delete",onClick:t=>{t.preventDefault(),(async e=>{if(window.confirm("Czy na pewno chcesz usunąć ten produkt?"))try{const t="http://localhost:5000",r=localStorage.getItem("token"),i=await fetch(`${t}/api/products/${e}`,{method:"DELETE",headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"}});if(!i.ok){const e=await i.json();throw new Error(e.error||"Błąd podczas usuwania produktu")}alert("✅ Produkt usunięty!"),k()}catch(t){alert("❌ "+t.message)}})(e._id)},children:"🗑️ Usuń"})]})]})]})},e._id))}),m&&w.jsx(Mr,{onClick:$,children:w.jsxs(Lr,{onClick:e=>e.stopPropagation(),children:[w.jsx("h2",{children:p?"Edytuj produkt":"Dodaj nowy produkt"}),w.jsxs(Er,{onSubmit:async t=>{t.preventDefault();try{const t="http://localhost:5000",r=localStorage.getItem("token"),i={...j,shopId:e,price:parseFloat(j.price),stock:parseInt(j.stock)||0},o=p?`${t}/api/products/${p._id}`:`${t}/api/products`,a=p?"PUT":"POST",n=await fetch(o,{method:a,headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"},body:JSON.stringify(i)});if(!n.ok){const e=await n.json();throw new Error(e.error||"Błąd podczas zapisywania produktu")}alert(p?"✅ Produkt zaktualizowany!":"✅ Produkt dodany!"),h(!1),x(null),z(),k()}catch(r){alert("❌ "+r.message)}},children:[w.jsxs(Wr,{children:[w.jsx(Dr,{children:"Nazwa produktu *"}),w.jsx(Or,{type:"text",name:"name",value:j.name,onChange:v,required:!0})]}),w.jsxs(Wr,{children:[w.jsx(Dr,{children:"Opis"}),w.jsx(Ir,{name:"description",value:j.description,onChange:v})]}),w.jsxs(Wr,{children:[w.jsx(Dr,{children:"Cena (zł) *"}),w.jsx(Or,{type:"number",name:"price",value:j.price,onChange:v,step:"0.01",min:"0",required:!0})]}),w.jsxs(Wr,{children:[w.jsx(Dr,{children:"Kategoria"}),w.jsxs(Fr,{name:"category",value:j.category,onChange:v,children:[w.jsx("option",{value:"",children:"Wybierz kategorię"}),["Elektronika","Odzież i moda","Książki i multimedia","Sport i rekreacja","Dom i ogród","Motoryzacja","Zdrowie i uroda","Zabawki i gry","Spożywcze","Inne"].map(e=>w.jsx("option",{value:e,children:e},e))]})]}),w.jsxs(Wr,{children:[w.jsx(Dr,{children:"Marka"}),w.jsx(Or,{type:"text",name:"brand",value:j.brand,onChange:v})]}),w.jsxs(Wr,{children:[w.jsx(Dr,{children:"Stan magazynowy"}),w.jsx(Or,{type:"number",name:"stock",value:j.stock,onChange:v,min:"0"})]}),w.jsxs("div",{style:{display:"flex",gap:"1rem",marginTop:"1rem"},children:[w.jsx(kr,{type:"submit",children:p?"Zapisz zmiany":"Dodaj produkt"}),w.jsx(kr,{type:"button",onClick:$,style:{background:"#6B7280"},children:"Anuluj"})]})]})]})})]})}const Hr=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`,Ur=p.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`,Kr=p(o)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${e=>e.theme.primary};
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.primary}10;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`,Yr=p.div`
  background: ${e=>e.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: ${e=>e.theme.shadow};
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 12px;
  }
`,Vr=p.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
`,qr=p.div`
  width: 120px;
  height: 120px;
  background: ${e=>e.theme.gradient};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }
`,Gr=p.div`
  flex: 1;
`,Jr=p.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`,Xr=p.p`
  color: ${e=>e.theme.textSecondary};
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`,Qr=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`,ei=p.div`
  background: ${e=>e.theme.background};
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  
  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`,ti=p.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${e=>e.theme.primary};
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`,ri=p.div`
  font-size: 0.875rem;
  color: ${e=>e.theme.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`,ii=p.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`,oi=p.div`
  background: ${e=>e.theme.background};
  border-radius: 12px;
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`,ai=p.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${e=>e.theme.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`,ni=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${e=>e.theme.border};
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
`,si=p.span`
  color: ${e=>e.theme.textSecondary};
  font-size: 0.9rem;
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`,di=p.span`
  color: ${e=>e.theme.text};
  font-weight: 600;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`,ci=p.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`,li=p.button`
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &.primary {
    background: ${e=>e.theme.gradient};
    color: white;
    
    &:hover {
      background: ${e=>e.theme.gradientHover};
      transform: translateY(-2px);
      box-shadow: ${e=>e.theme.shadowHover};
    }
  }
  
  &.secondary {
    background: ${e=>e.theme.surface};
    color: ${e=>e.theme.text};
    border: 2px solid ${e=>e.theme.border};
    
    &:hover {
      background: ${e=>e.theme.border};
    }
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 1.75rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
`,mi=p.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${e=>"open"===e.status?"#10B981":"#EF4444"};
  color: white;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
`,hi=p.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${e=>e.theme.border};
`,pi=p.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-bottom: 2px solid transparent;
  border-radius: 8px 8px 0 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${e=>e.theme.textSecondary};
  background: ${e=>e.theme.surface};
  
  &:hover {
    color: ${e=>e.theme.primary};
  }
  
  ${e=>e.active&&`\n    border-bottom-color: ${e.theme.primary};\n    color: ${e.theme.primary};\n    background: ${e.theme.background};\n  `}
  
  @media (max-width: 480px) {
    padding: 0.6rem 1.25rem;
    font-size: 0.9rem;
  }
`;function xi({theme:e}){const{shopId:t}=n(),{user:r}=N(),[a,s]=i.useState(null),[d,c]=i.useState(!0),[l,m]=i.useState(null),[h,p]=i.useState("products"),x=a&&r&&a.owner&&a.owner._id===r._id;i.useEffect(()=>{u()},[t]);const u=async()=>{try{c(!0);const e="http://localhost:5000",r=localStorage.getItem("token"),i=await fetch(`${e}/api/shops/${t}`,{headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"}});if(!i.ok)throw new Error("Nie udało się pobrać szczegółów sklepu");const o=await i.json();s(o)}catch(e){m(e.message)}finally{c(!1)}};return d?w.jsx(Hr,{children:w.jsxs("div",{style:{textAlign:"center",padding:"4rem"},children:[w.jsx("div",{style:{fontSize:"2rem",marginBottom:"1rem"},children:"⏳"}),w.jsx("p",{children:"Ładowanie szczegółów sklepu..."})]})}):l?w.jsx(Hr,{children:w.jsxs("div",{style:{textAlign:"center",padding:"4rem"},children:[w.jsx("div",{style:{fontSize:"4rem",marginBottom:"1rem"},children:"❌"}),w.jsx("h3",{children:"Błąd podczas ładowania sklepu"}),w.jsx("p",{children:l}),w.jsx("button",{onClick:u,style:{marginTop:"1rem",padding:"0.5rem 1rem"},children:"Spróbuj ponownie"})]})}):a?w.jsxs(Hr,{children:[w.jsx(Ur,{children:w.jsx(Kr,{to:"/shops",children:"← Wróć do listy sklepów"})}),w.jsxs(Yr,{children:[w.jsxs(Vr,{children:[w.jsx(qr,{children:"🏪"}),w.jsxs(Gr,{children:[w.jsx(Jr,{children:a.name}),w.jsx(Xr,{children:a.description}),w.jsx(mi,{status:a.isActive?"open":"closed",children:a.isActive?"🟢 Aktywny":"🔴 Nieaktywny"})]})]}),w.jsxs(Qr,{children:[w.jsxs(ei,{children:[w.jsx(ti,{children:a.rating||"Brak"}),w.jsx(ri,{children:"Ocena"})]}),w.jsxs(ei,{children:[w.jsx(ti,{children:a.stats?.totalReviews||0}),w.jsx(ri,{children:"Recenzje"})]}),w.jsxs(ei,{children:[w.jsx(ti,{children:a.stats?.totalProducts||0}),w.jsx(ri,{children:"Produktów"})]}),w.jsxs(ei,{children:[w.jsx(ti,{children:a.stats?.totalOrders||0}),w.jsx(ri,{children:"Zamówień"})]})]}),w.jsx(ci,{children:x?w.jsxs(w.Fragment,{children:[w.jsx(o,{to:`/shop/${t}/edit`,style:{textDecoration:"none",flex:1},children:w.jsx(li,{className:"primary",children:"✏️ Edytuj sklep"})}),w.jsx(o,{to:`/shop/${t}/live`,style:{textDecoration:"none",flex:1},children:w.jsx(li,{className:"secondary",children:"🎥 Live Shopping"})}),w.jsx(li,{className:"secondary",children:"📊 Statystyki"})]}):w.jsxs(w.Fragment,{children:[w.jsx(li,{className:"primary",children:"🛒 Przejdź do sklepu"}),w.jsx(li,{className:"secondary",children:"💬 Skontaktuj się"}),w.jsx(li,{className:"secondary",children:"👁️ Obserwuj"})]})})]}),w.jsxs(hi,{children:[w.jsx(pi,{active:"products"===h,onClick:()=>p("products"),children:"📦 Produkty"}),w.jsx(pi,{active:"details"===h,onClick:()=>p("details"),children:"📋 Szczegóły"})]}),"details"===h&&w.jsxs(ii,{children:[w.jsxs(oi,{children:[w.jsx(ai,{children:"📞 Informacje kontaktowe"}),a.address&&w.jsxs(ni,{children:[w.jsx(si,{children:"Adres:"}),w.jsxs(di,{children:[a.address.street," ",a.address.houseNumber,", ",a.address.postalCode," ",a.address.city]})]}),a.phone&&w.jsxs(ni,{children:[w.jsx(si,{children:"Telefon:"}),w.jsx(di,{children:a.phone})]}),a.email&&w.jsxs(ni,{children:[w.jsx(si,{children:"Email:"}),w.jsx(di,{children:a.email})]}),a.website&&w.jsxs(ni,{children:[w.jsx(si,{children:"Strona WWW:"}),w.jsx(di,{children:a.website})]}),a.location&&w.jsxs(ni,{children:[w.jsx(si,{children:"Lokalizacja:"}),w.jsx(di,{children:a.location.name})]})]}),w.jsxs(oi,{children:[w.jsx(ai,{children:"🏢 Informacje o firmie"}),a.categories&&a.categories.length>0&&w.jsxs(ni,{children:[w.jsx(si,{children:"Kategorie:"}),w.jsx(di,{children:a.categories.join(", ")})]}),w.jsxs(ni,{children:[w.jsx(si,{children:"Właściciel:"}),w.jsxs(di,{children:[a.owner?.firstName," ",a.owner?.lastName," (",a.owner?.username,")"]})]}),w.jsxs(ni,{children:[w.jsx(si,{children:"Utworzony:"}),w.jsx(di,{children:new Date(a.createdAt).toLocaleDateString("pl-PL")})]}),w.jsxs(ni,{children:[w.jsx(si,{children:"Status:"}),w.jsx(di,{children:a.isActive?"Aktywny":"Nieaktywny"})]})]}),w.jsxs(oi,{children:[w.jsx(ai,{children:"🚚 Dostawa"}),(a.delivery||[]).map((e,t)=>w.jsxs(ni,{children:[w.jsxs(si,{children:["Metoda ",t+1,":"]}),w.jsx(di,{children:e})]},t))]}),w.jsxs(oi,{children:[w.jsx(ai,{children:"💳 Płatności"}),(a.payment||[]).map((e,t)=>w.jsxs(ni,{children:[w.jsxs(si,{children:["Metoda ",t+1,":"]}),w.jsx(di,{children:e})]},t))]}),w.jsxs(oi,{children:[w.jsx(ai,{children:"🕒 Godziny otwarcia"}),Object.entries(a.hours||{}).map(([e,t])=>w.jsxs(ni,{children:[w.jsxs(si,{children:[e.charAt(0).toUpperCase()+e.slice(1),":"]}),w.jsx(di,{children:t})]},e))]})]}),"products"===h&&w.jsx(Zr,{shopId:t,theme:e,isOwner:x})]}):w.jsx(Hr,{children:w.jsxs("div",{style:{textAlign:"center",padding:"4rem"},children:[w.jsx("div",{style:{fontSize:"4rem",marginBottom:"1rem"},children:"❌"}),w.jsx("h3",{children:"Sklep nie został znaleziony"}),w.jsx("p",{children:"Sprawdź czy adres URL jest poprawny"})]})})}const ui=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`,gi=p.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  gap: 15px;

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
  }

  .cart-icon {
    font-size: 2.5rem;
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`,ji=p.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  margin-bottom: 25px;
  overflow: hidden;
  border: 2px solid #f0f0f0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
    border-color: #667eea;
  }
`,yi=p.div`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;

  .seller-info {
    display: flex;
    align-items: center;
    gap: 15px;
    flex: 1;
  }

  .seller-logo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .seller-details {
    flex: 1;
  }

  .seller-name {
    font-size: 1.3rem;
    font-weight: 600;
    margin: 0 0 5px 0;
  }

  .seller-location {
    font-size: 0.9rem;
    opacity: 0.9;
    margin: 0;
  }

  .seller-summary {
    text-align: right;
    min-width: 150px;
  }

  .item-count {
    font-size: 0.9rem;
    opacity: 0.9;
    margin: 0 0 5px 0;
  }

  .subtotal {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0;
  }
`,bi=p.div`
  padding: 20px;
`,fi=p.div`
  display: grid;
  gap: 20px;
  margin-bottom: 20px;
`,wi=p.div`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  .product-image {
    width: 80px;
    height: 80px;
    border-radius: 10px;
    object-fit: cover;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  .product-info {
    flex: 1;
  }

  .product-name {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #333;
  }

  .product-price {
    font-size: 1.2rem;
    font-weight: 700;
    color: #667eea;
    margin: 0 0 8px 0;
  }

  .product-original-price {
    font-size: 0.9rem;
    color: #999;
    text-decoration: line-through;
    margin: 0 0 8px 0;
  }

  .quantity-controls {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .quantity-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    &:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }
  }

  .quantity-display {
    font-size: 1.1rem;
    font-weight: 600;
    min-width: 40px;
    text-align: center;
    color: #333;
  }

  .remove-btn {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 8px 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.9rem;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
    }
  }
`,ki=p.div`
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;

  .shipping-info {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #666;
    font-size: 0.9rem;
  }

  .seller-total {
    text-align: right;
  }

  .total-label {
    font-size: 0.9rem;
    color: #666;
    margin: 0 0 5px 0;
  }

  .total-amount {
    font-size: 1.4rem;
    font-weight: 700;
    color: #667eea;
    margin: 0;
  }
`,vi=p.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 15px;
  margin-top: 30px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);

  h2 {
    margin: 0 0 20px 0;
    font-size: 1.8rem;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 25px;
  }

  .summary-item {
    background: rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 10px;
    text-align: center;
  }

  .summary-label {
    font-size: 0.9rem;
    opacity: 0.9;
    margin: 0 0 5px 0;
  }

  .summary-value {
    font-size: 1.3rem;
    font-weight: 600;
    margin: 0;
  }

  .checkout-btn {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 15px 30px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 auto;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
    }
  }
`,zi=p.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);

  .empty-icon {
    font-size: 4rem;
    color: #ccc;
    margin-bottom: 20px;
  }

  h2 {
    color: #666;
    margin: 0 0 15px 0;
  }

  p {
    color: #999;
    margin: 0 0 30px 0;
  }

  .continue-shopping {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 12px 25px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }
  }
`,$i=p.div`
  text-align: center;
  padding: 40px;
  color: #666;
`,Si=()=>{const[e,t]=i.useState(null),[r,o]=i.useState(!0),[a,n]=i.useState(null);i.useEffect(()=>{s()},[]);const s=async()=>{try{o(!0);const e=await fetch("/api/cart",{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});if(!e.ok)throw new Error("Nie udało się pobrać koszyka");const r=await e.json();t(r)}catch(e){n(e.message)}finally{o(!1)}},d=async(e,t)=>{try{if(!(await fetch("/api/cart/update-quantity",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`},body:JSON.stringify({itemId:e,quantity:t})})).ok)throw new Error("Nie udało się zaktualizować ilości");await s()}catch(r){}};return r?w.jsx(ui,{children:w.jsx($i,{children:"Ładowanie koszyka..."})}):a?w.jsx(ui,{children:w.jsxs("div",{style:{textAlign:"center",color:"red"},children:["Błąd: ",a]})}):e&&e.sellerGroups&&0!==e.sellerGroups.length?w.jsxs(ui,{children:[w.jsxs(gi,{children:[w.jsx(te,{className:"cart-icon"}),w.jsx("h1",{children:"Koszyk zakupów"})]}),e.sellerGroups.map((e,t)=>w.jsxs(ji,{children:[w.jsxs(yi,{children:[w.jsxs("div",{className:"seller-info",children:[w.jsx("div",{className:"seller-logo",children:e.shopLogo?w.jsx("img",{src:e.shopLogo,alt:e.shopName,style:{width:"100%",height:"100%",borderRadius:"50%"}}):w.jsx(oe,{})}),w.jsxs("div",{className:"seller-details",children:[w.jsx("h3",{className:"seller-name",children:e.shopName}),w.jsx("p",{className:"seller-location",children:"📍 Lokalizacja sprzedawcy"})]})]}),w.jsxs("div",{className:"seller-summary",children:[w.jsxs("p",{className:"item-count",children:[e.itemCount," produktów"]}),w.jsxs("p",{className:"subtotal",children:[e.subtotal.toFixed(2)," zł"]})]})]}),w.jsx(bi,{children:w.jsx(fi,{children:e.items.map(e=>w.jsxs(wi,{children:[w.jsx("img",{src:e.product.mainImage||e.product.images?.[0]||"/placeholder-product.jpg",alt:e.product.name,className:"product-image",onError:e=>{e.target.src="/placeholder-product.jpg"}}),w.jsxs("div",{className:"product-info",children:[w.jsx("h4",{className:"product-name",children:e.product.name}),w.jsxs("p",{className:"product-price",children:[e.price.toFixed(2)," zł"]}),e.originalPrice&&e.originalPrice>e.price&&w.jsxs("p",{className:"product-original-price",children:[e.originalPrice.toFixed(2)," zł"]})]}),w.jsxs("div",{className:"quantity-controls",children:[w.jsx("button",{className:"quantity-btn",onClick:()=>d(e._id,e.quantity-1),disabled:e.quantity<=1,children:w.jsx(J,{})}),w.jsx("span",{className:"quantity-display",children:e.quantity}),w.jsx("button",{className:"quantity-btn",onClick:()=>d(e._id,e.quantity+1),children:w.jsx(X,{})})]}),w.jsxs("button",{className:"remove-btn",onClick:()=>(async e=>{try{if(!(await fetch(`/api/cart/remove/${e}`,{method:"DELETE",headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).ok)throw new Error("Nie udało się usunąć produktu");await s()}catch(t){}})(e._id),children:[w.jsx(se,{}),"Usuń"]})]},e._id))})}),w.jsxs(ki,{children:[w.jsxs("div",{className:"shipping-info",children:[w.jsx(de,{}),w.jsx("span",{children:0===e.shippingCost?"Darmowa dostawa":`Dostawa: ${e.shippingCost.toFixed(2)} zł`})]}),w.jsxs("div",{className:"seller-total",children:[w.jsx("p",{className:"total-label",children:"Suma częściowa:"}),w.jsxs("p",{className:"total-amount",children:[(e.subtotal+e.shippingCost).toFixed(2)," zł"]})]})]})]},e.shopId)),w.jsxs(vi,{children:[w.jsxs("h2",{children:[w.jsx(O,{}),"Podsumowanie zamówienia"]}),w.jsxs("div",{className:"summary-grid",children:[w.jsxs("div",{className:"summary-item",children:[w.jsx("p",{className:"summary-label",children:"Liczba sprzedawców"}),w.jsx("p",{className:"summary-value",children:e.summary.sellerCount})]}),w.jsxs("div",{className:"summary-item",children:[w.jsx("p",{className:"summary-label",children:"Łączna ilość produktów"}),w.jsx("p",{className:"summary-value",children:e.summary.itemCount})]}),w.jsxs("div",{className:"summary-item",children:[w.jsx("p",{className:"summary-label",children:"Suma częściowa"}),w.jsxs("p",{className:"summary-value",children:[e.summary.subtotal.toFixed(2)," zł"]})]}),w.jsxs("div",{className:"summary-item",children:[w.jsx("p",{className:"summary-label",children:"Dostawa"}),w.jsxs("p",{className:"summary-value",children:[e.summary.shipping.toFixed(2)," zł"]})]}),e.summary.discount>0&&w.jsxs("div",{className:"summary-item",children:[w.jsx("p",{className:"summary-label",children:"Rabat"}),w.jsxs("p",{className:"summary-value",children:["-",e.summary.discount.toFixed(2)," zł"]})]})]}),w.jsx("div",{style:{textAlign:"center",marginBottom:"20px"},children:w.jsxs("h3",{style:{fontSize:"2rem",margin:"0 0 10px 0"},children:["Razem: ",e.summary.total.toFixed(2)," zł"]})}),w.jsxs("button",{className:"checkout-btn",children:[w.jsx(O,{}),"Przejdź do kasy"]})]})]}):w.jsx(ui,{children:w.jsxs(zi,{children:[w.jsx("div",{className:"empty-icon",children:"🛒"}),w.jsx("h2",{children:"Twój koszyk jest pusty"}),w.jsx("p",{children:"Dodaj produkty, aby rozpocząć zakupy"}),w.jsx("button",{className:"continue-shopping",onClick:()=>window.history.back(),children:"Kontynuuj zakupy"})]})})},Ci=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  height: calc(100vh - 100px);
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    padding: 1rem;
  }
`,Ni=p.div`
  width: 300px;
  background: ${e=>e.theme.surface};
  border-radius: 16px;
  box-shadow: ${e=>e.theme.shadow};
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 300px;
  }
`,Pi=p.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${e=>e.theme.border};
`,Bi=p.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${e=>e.theme.text};
  margin-bottom: 0.5rem;
`,Ai=p.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 8px;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
  }
`,Ti=p.div`
  display: flex;
  border-bottom: 1px solid ${e=>e.theme.border};
`,Mi=p.button`
  flex: 1;
  padding: 1rem;
  border: none;
  background: ${e=>e.active?e.theme.primary:"transparent"};
  color: ${e=>e.active?"white":e.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  
  &:hover {
    background: ${e=>(e.active,e.theme.primary)}20;
  }
`,Li=p.div`
  flex: 1;
  overflow-y: auto;
`,Ei=p.div`
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid ${e=>e.theme.border};
  position: relative;
  
  &:hover {
    background: ${e=>e.theme.primary}10;
  }
  
  &.active {
    background: ${e=>e.theme.primary}20;
    border-left: 4px solid ${e=>e.theme.primary};
  }
`,Wi=p.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`,Di=p.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${e=>e.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  position: relative;
`,Oi=p.div`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #10B981;
  border: 2px solid ${e=>e.theme.surface};
`,Ii=p.div`
  flex: 1;
`,Fi=p.div`
  font-weight: 600;
  color: ${e=>e.theme.text};
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`,_i=p.span`
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  background: ${e=>e.theme.primary}20;
  color: ${e=>e.theme.primary};
`,Ri=p.div`
  font-size: 0.875rem;
  color: ${e=>e.theme.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,Zi=p.div`
  font-size: 0.75rem;
  color: ${e=>e.theme.textSecondary};
`,Hi=p.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: ${e=>e.theme.primary};
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
`,Ui=p.div`
  flex: 1;
  background: ${e=>e.theme.surface};
  border-radius: 16px;
  box-shadow: ${e=>e.theme.shadow};
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    height: 400px;
  }
`,Ki=p.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${e=>e.theme.border};
  display: flex;
  align-items: center;
  gap: 1rem;
`,Yi=p.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${e=>e.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.25rem;
  position: relative;
`,Vi=p.div`
  flex: 1;
`,qi=p.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${e=>e.theme.text};
  margin-bottom: 0.25rem;
`,Gi=p.div`
  font-size: 0.875rem;
  color: ${e=>e.theme.textSecondary};
`,Ji=p.div`
  display: flex;
  gap: 0.5rem;
`,Xi=p.button`
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.primary}20;
    color: ${e=>e.theme.primary};
  }
`,Qi=p.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`,eo=p.div`
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  
  &.own {
    flex-direction: row-reverse;
    
    .message-bubble {
      background: ${e=>e.theme.primary};
      color: white;
      border-radius: 18px 18px 4px 18px;
    }
  }
  
  &.other .message-bubble {
    background: ${e=>e.theme.background};
    color: ${e=>e.theme.text};
    border-radius: 18px 18px 18px 4px;
  }
`,to=p.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${e=>e.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
`,ro=p.div`
  max-width: 70%;
  padding: 0.75rem 1rem;
  box-shadow: ${e=>e.theme.shadow};
`,io=p.div`
  margin-bottom: 0.25rem;
  line-height: 1.4;
`,oo=p.div`
  font-size: 0.75rem;
  opacity: 0.7;
  text-align: right;
`,ao=p.div`
  padding: 1.5rem;
  border-top: 1px solid ${e=>e.theme.border};
  display: flex;
  gap: 1rem;
  align-items: center;
`,no=p.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 12px;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
  }
`,so=p.button`
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 12px;
  background: ${e=>e.disabled?e.theme.border:e.theme.primary};
  color: white;
  cursor: ${e=>e.disabled?"not-allowed":"pointer"};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${e=>e.theme.primary}dd;
  }
`,co=p.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${e=>e.theme.textSecondary};
  text-align: center;
`,lo=p.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${e=>e.theme.textSecondary};
`,mo=p.div`
  background: ${e=>e.theme.error}20;
  color: ${e=>e.theme.error};
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem;
`;function ho(){const{user:e,isAuthenticated:t}=N(),[r,o]=i.useState([]),[a,n]=i.useState(null),[s,d]=i.useState([]),[c,l]=i.useState(""),[m,h]=i.useState(!0),[p,x]=i.useState(null),[u,g]=i.useState("chats"),[j,y]=i.useState(""),b=i.useRef(null);i.useEffect(()=>{t?f():h(!1)},[t,u]),i.useEffect(()=>{a&&k(a._id||a.id)},[a]),i.useEffect(()=>{b.current?.scrollIntoView({behavior:"smooth"})},[s]);const f=async()=>{try{h(!0),x(null);const e="http://localhost:5000",t=localStorage.getItem("token");let r=`${e}/api/messages/contacts`;"groups"===u&&(r=`${e}/api/groups`);const i=await fetch(r,{headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"}});if(!i.ok)throw new Error("Nie udało się pobrać kontaktów");const a=await i.json();o(a.contacts||a||[])}catch(e){x(e.message),o([{_id:"1",name:"Jan Kowalski",lastMessage:"Dziękuję za szybką dostawę!",time:"14:30",avatar:"JK",online:!0,type:"user",unreadCount:2},{_id:"2",name:"Anna Nowak",lastMessage:"Czy produkt jest dostępny?",time:"12:15",avatar:"AN",online:!1,type:"user",unreadCount:0},{_id:"3",name:"Piotr Wiśniewski",lastMessage:"Zamówienie zostało złożone",time:"10:45",avatar:"PW",online:!0,type:"user",unreadCount:1},{_id:"4",name:"Grupa - Sklep TechStore",lastMessage:"Nowy produkt dostępny!",time:"09:20",avatar:"👥",online:!0,type:"group",unreadCount:5}])}finally{h(!1)}},k=async t=>{try{const e="http://localhost:5000",r=localStorage.getItem("token"),i=await fetch(`${e}/api/messages/${t}`,{headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"}});if(!i.ok)throw new Error("Nie udało się pobrać wiadomości");const o=await i.json();d(o.messages||o||[])}catch(r){d({1:[{_id:"1",text:"Witam! Czy mogę pomóc?",time:"14:25",sender:"1",own:!1},{_id:"2",text:"Tak, chciałbym złożyć zamówienie",time:"14:26",sender:e?._id,own:!0},{_id:"3",text:"Dziękuję za szybką dostawę!",time:"14:30",sender:"1",own:!1}],2:[{_id:"1",text:"Dzień dobry!",time:"12:10",sender:"2",own:!1},{_id:"2",text:"Czy produkt jest dostępny?",time:"12:15",sender:e?._id,own:!0}],3:[{_id:"1",text:"Zamówienie zostało złożone",time:"10:45",sender:e?._id,own:!0}],4:[{_id:"1",text:"Nowy produkt dostępny!",time:"09:20",sender:"4",own:!1},{_id:"2",text:"Świetnie!",time:"09:25",sender:e?._id,own:!0}]}[t]||[])}},v=async()=>{if(!c.trim()||!a)return;const t={_id:Date.now().toString(),text:c,time:(new Date).toLocaleTimeString("pl-PL",{hour:"2-digit",minute:"2-digit"}),sender:e?._id,own:!0};d([...s,t]),l("");try{const e="http://localhost:5000",t=localStorage.getItem("token");await fetch(`${e}/api/messages`,{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify({recipientId:a._id||a.id,text:c,type:a.type||"user"})})}catch(r){}},z=r.filter(e=>e.name.toLowerCase().includes(j.toLowerCase())),$=e=>e.split(" ").map(e=>e[0]).join("").toUpperCase();return t?m?w.jsx(Ci,{children:w.jsxs(lo,{children:[w.jsx("div",{style:{fontSize:"2rem",marginBottom:"1rem"},children:"⏳"}),w.jsx("p",{children:"Ładowanie wiadomości..."})]})}):w.jsxs(Ci,{children:[w.jsxs(Ni,{children:[w.jsxs(Pi,{children:[w.jsx(Bi,{children:"Wiadomości"}),w.jsx(Ai,{placeholder:"Szukaj kontaktów...",value:j,onChange:e=>y(e.target.value)})]}),w.jsxs(Ti,{children:[w.jsx(Mi,{active:"chats"===u,onClick:()=>g("chats"),children:"💬 Czaty"}),w.jsx(Mi,{active:"groups"===u,onClick:()=>g("groups"),children:"👥 Grupy"})]}),p&&w.jsx(mo,{children:p}),w.jsx(Li,{children:z.map(e=>w.jsxs(Ei,{className:a?._id===e._id?"active":"",onClick:()=>n(e),children:[w.jsxs(Wi,{children:[w.jsxs(Di,{children:["group"===e.type?e.avatar:$(e.name),e.online&&w.jsx(Oi,{})]}),w.jsxs(Ii,{children:[w.jsxs(Fi,{children:[e.name,w.jsx(_i,{children:"group"===e.type?"Grupa":"Użytkownik"})]}),w.jsx(Ri,{children:e.lastMessage})]}),w.jsx(Zi,{children:e.time})]}),e.unreadCount>0&&w.jsx(Hi,{children:e.unreadCount})]},e._id||e.id))})]}),w.jsx(Ui,{children:a?w.jsxs(w.Fragment,{children:[w.jsxs(Ki,{children:[w.jsxs(Yi,{children:["group"===a.type?a.avatar:$(a.name),a.online&&w.jsx(Oi,{})]}),w.jsxs(Vi,{children:[w.jsx(qi,{children:a.name}),w.jsxs(Gi,{children:[a.online?"🟢 Online":"⚪ Offline","group"===a.type&&" • Grupa"]})]}),w.jsxs(Ji,{children:[w.jsx(Xi,{title:"Zadzwoń",children:"📞"}),w.jsx(Xi,{title:"Wideo",children:"📹"}),w.jsx(Xi,{title:"Więcej",children:"⚙️"})]})]}),w.jsxs(Qi,{children:[s.map(t=>w.jsxs(eo,{className:t.own?"own":"other",children:[w.jsx(to,{children:t.own?$(e?.username||"TY"):"group"===a.type?a.avatar:$(a.name)}),w.jsxs(ro,{className:"message-bubble",children:[w.jsx(io,{children:t.text}),w.jsx(oo,{children:t.time})]})]},t._id||t.id)),w.jsx("div",{ref:b})]}),w.jsxs(ao,{children:[w.jsx(no,{type:"text",placeholder:"Napisz wiadomość...",value:c,onChange:e=>l(e.target.value),onKeyPress:e=>{"Enter"===e.key&&v()}}),w.jsx(so,{onClick:v,disabled:!c.trim(),children:"➤"})]})]}):w.jsx(co,{children:w.jsxs("div",{children:[w.jsx("div",{style:{fontSize:"4rem",marginBottom:"1rem"},children:"💬"}),w.jsx("h3",{children:"Wybierz kontakt"}),w.jsx("p",{children:"Wybierz kontakt z listy, aby rozpocząć rozmowę"})]})})})]}):w.jsx(Ci,{children:w.jsx(co,{children:w.jsxs("div",{children:[w.jsx("div",{style:{fontSize:"4rem",marginBottom:"1rem"},children:"🔐"}),w.jsx("h3",{children:"Zaloguj się"}),w.jsx("p",{children:"Musisz być zalogowany, aby korzystać z systemu wiadomości"})]})})})}const po=p.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`,xo=p.h1`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`,uo=p.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${e=>e.theme.border};
`,go=p.button`
  padding: 1rem 2rem;
  border: none;
  background: ${e=>e.active?e.theme.primary:"transparent"};
  color: ${e=>e.active?"white":e.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  border-radius: 8px 8px 0 0;
  
  &:hover {
    background: ${e=>(e.active,e.theme.primary)}20;
  }
`,jo=p.div`
  background: ${e=>e.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${e=>e.theme.shadow};
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`,yo=p.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid ${e=>e.selected?e.theme.primary:e.theme.border};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1rem;
  
  &:hover {
    border-color: ${e=>e.theme.primary};
    background: ${e=>e.theme.primary}10;
  }
`,bo=p.div`
  font-size: 2rem;
`,fo=p.div`
  flex: 1;
`,wo=p.div`
  font-weight: 600;
  color: ${e=>e.theme.text};
  margin-bottom: 0.25rem;
`,ko=p.div`
  font-size: 0.875rem;
  color: ${e=>e.theme.textSecondary};
`,vo=p.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
`,zo=p.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`,$o=p.input`
  padding: 1rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
    box-shadow: 0 0 0 3px ${e=>e.theme.primary}20;
  }
`,So=p.button`
  padding: 1rem 2rem;
  background: ${e=>e.theme.gradient};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`,Co=p.div`
  background: ${e=>e.theme.background};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`,No=p.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${e=>e.theme.text};
`,Po=p.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: ${e=>e.theme.textSecondary};
`,Bo=p.div`
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 1.125rem;
  color: ${e=>e.theme.text};
  border-top: 2px solid ${e=>e.theme.border};
  padding-top: 1rem;
  margin-top: 1rem;
`,Ao=p.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${e=>e.theme.success};
  font-size: 0.875rem;
  margin-top: 1rem;
`,To=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`,Mo=p.div`
  background: ${e=>e.theme.surface};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${e=>e.theme.shadow};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
`,Lo=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,Eo=p.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${e=>e.theme.primary};
`,Wo=p.div`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${e=>"completed"===e.status&&`\n    background: ${e.theme.success}20;\n    color: ${e.theme.success};\n  `}
  
  ${e=>"pending"===e.status&&`\n    background: ${e.theme.warning}20;\n    color: ${e.theme.warning};\n  `}
  
  ${e=>"failed"===e.status&&`\n    background: ${e.theme.error}20;\n    color: ${e.theme.error};\n  `}
`,Do=p.div`
  color: ${e=>e.theme.textSecondary};
  font-size: 0.875rem;
`,Oo=p.div`
  color: ${e=>e.theme.textSecondary};
  font-size: 0.75rem;
  margin-top: 0.5rem;
`,Io=p.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${e=>e.theme.textSecondary};
`,Fo=p.div`
  background: ${e=>e.theme.error}20;
  color: ${e=>e.theme.error};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`,_o=p.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${e=>e.theme.textSecondary};
`,Ro=e=>new Intl.NumberFormat("pl-PL",{style:"currency",currency:"PLN"}).format(e);function Zo(){const{user:e,isAuthenticated:t}=N(),r=s(),[o,a]=i.useState("payment"),[n,d]=i.useState("card"),[c,l]=i.useState({cardNumber:"",expiryDate:"",cvv:"",cardholderName:"",email:e?.email||""}),[m,h]=i.useState(!1),[p,x]=i.useState([]),[u,g]=i.useState(!1),[j,y]=i.useState(null),b=r.state?.orderData||JSON.parse(localStorage.getItem("currentOrder"))||{items:[{name:"Laptop Gaming Pro",price:4999,quantity:1},{name:"Dostawa",price:29.99,quantity:1},{name:"Ubezpieczenie",price:99.99,quantity:1}],orderId:"ORD-"+Date.now()};i.useEffect(()=>{t&&"history"===o&&f()},[t,o]);const f=async()=>{try{g(!0),y(null);const e="http://localhost:5000",t=localStorage.getItem("token"),r=await fetch(`${e}/api/payments/history`,{headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"}});if(!r.ok)throw new Error("Nie udało się pobrać historii płatności");const i=await r.json();x(i.payments||i||[])}catch(e){y(e.message),x([{_id:"1",amount:5128.98,currency:"PLN",status:"completed",method:"card",orderId:"ORD-12345",createdAt:new Date(Date.now()-864e5).toISOString(),description:"Zamówienie #12345"},{_id:"2",amount:299.99,currency:"PLN",status:"pending",method:"paypal",orderId:"ORD-12346",createdAt:new Date(Date.now()-1728e5).toISOString(),description:"Zamówienie #12346"},{_id:"3",amount:1499.99,currency:"PLN",status:"failed",method:"blik",orderId:"ORD-12347",createdAt:new Date(Date.now()-2592e5).toISOString(),description:"Zamówienie #12347"}])}finally{g(!1)}},k=b.items.reduce((e,t)=>e+t.price*t.quantity,0),v=.23*k,z=k+v,$=e=>{l({...c,[e.target.name]:e.target.value})},S=e=>{switch(e){case"completed":return"Zakończona";case"pending":return"W trakcie";case"failed":return"Nieudana";default:return e}};return t?w.jsxs(po,{children:[w.jsx(xo,{children:"System Płatności"}),w.jsxs(uo,{children:[w.jsx(go,{active:"payment"===o,onClick:()=>a("payment"),children:"💳 Nowa płatność"}),w.jsx(go,{active:"history"===o,onClick:()=>a("history"),children:"📋 Historia płatności"})]}),j&&w.jsx(Fo,{children:j}),"payment"===o&&w.jsxs(jo,{children:[w.jsxs(Co,{children:[w.jsxs(No,{children:["Podsumowanie zamówienia #",b.orderId]}),b.items.map((e,t)=>w.jsxs(Po,{children:[w.jsxs("span",{children:[e.name," ",e.quantity>1&&`(x${e.quantity})`]}),w.jsx("span",{children:Ro(e.price*e.quantity)})]},t)),w.jsxs(Po,{children:[w.jsx("span",{children:"Podatek VAT (23%)"}),w.jsx("span",{children:Ro(v)})]}),w.jsxs(Bo,{children:[w.jsx("span",{children:"Razem"}),w.jsx("span",{children:Ro(z)})]})]}),w.jsxs("div",{children:[w.jsx("h3",{style:{marginBottom:"1rem",color:"#1E293B"},children:"Wybierz metodę płatności"}),[{id:"card",name:"Karta kredytowa/debetowa",description:"Visa, Mastercard, American Express",icon:"💳"},{id:"paypal",name:"PayPal",description:"Szybka i bezpieczna płatność",icon:"🔵"},{id:"blik",name:"BLIK",description:"Płatność przez aplikację bankową",icon:"📱"},{id:"transfer",name:"Przelew bankowy",description:"Tradycyjny przelew online",icon:"🏦"}].map(e=>w.jsxs(yo,{selected:n===e.id,onClick:()=>d(e.id),children:[w.jsx(bo,{children:e.icon}),w.jsxs(fo,{children:[w.jsx(wo,{children:e.name}),w.jsx(ko,{children:e.description})]})]},e.id))]}),"card"===n&&w.jsxs(vo,{onSubmit:async e=>{e.preventDefault(),h(!0),y(null);try{const e="http://localhost:5000",t=localStorage.getItem("token"),r={amount:z,currency:"PLN",method:n,orderId:b.orderId,paymentDetails:c,items:b.items},i=await fetch(`${e}/api/payments`,{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify(r)});if(!i.ok)throw new Error("Błąd przetwarzania płatności");const o=await i.json();setTimeout(()=>{h(!1),alert(`Płatność została przetworzona pomyślnie! ID: ${o.paymentId||"PAY-"+Date.now()}`),window.location.href="/order-confirmation"},2e3)}catch(t){y(t.message),h(!1)}},children:[w.jsxs(zo,{children:[w.jsx($o,{type:"text",name:"cardNumber",placeholder:"Numer karty",value:c.cardNumber,onChange:$,required:!0}),w.jsx($o,{type:"text",name:"cardholderName",placeholder:"Imię i nazwisko",value:c.cardholderName,onChange:$,required:!0})]}),w.jsxs(zo,{children:[w.jsx($o,{type:"text",name:"expiryDate",placeholder:"MM/RR",value:c.expiryDate,onChange:$,required:!0}),w.jsx($o,{type:"text",name:"cvv",placeholder:"CVV",value:c.cvv,onChange:$,required:!0})]}),w.jsx($o,{type:"email",name:"email",placeholder:"Email do potwierdzenia",value:c.email,onChange:$,required:!0}),w.jsx(So,{type:"submit",disabled:m,children:m?"Przetwarzanie...":`Zapłać ${Ro(z)}`}),w.jsx(Ao,{children:"🔒 Płatność jest szyfrowana i bezpieczna"})]}),"paypal"===n&&w.jsxs("div",{style:{textAlign:"center",padding:"2rem"},children:[w.jsx("div",{style:{fontSize:"3rem",marginBottom:"1rem"},children:"🔵"}),w.jsx("h3",{children:"Przekierowanie do PayPal"}),w.jsx("p",{children:"Zostaniesz przekierowany do bezpiecznej strony PayPal"}),w.jsx(So,{style:{marginTop:"1rem"},children:"Kontynuuj z PayPal"})]}),"blik"===n&&w.jsxs("div",{style:{textAlign:"center",padding:"2rem"},children:[w.jsx("div",{style:{fontSize:"3rem",marginBottom:"1rem"},children:"📱"}),w.jsx("h3",{children:"Płatność BLIK"}),w.jsx("p",{children:"Otwórz aplikację bankową i wprowadź kod BLIK"}),w.jsx($o,{type:"text",placeholder:"Kod BLIK (6 cyfr)",style:{textAlign:"center",fontSize:"1.5rem",letterSpacing:"0.5rem"}}),w.jsx(So,{style:{marginTop:"1rem"},children:"Potwierdź płatność"})]}),"transfer"===n&&w.jsxs("div",{style:{textAlign:"center",padding:"2rem"},children:[w.jsx("div",{style:{fontSize:"3rem",marginBottom:"1rem"},children:"🏦"}),w.jsx("h3",{children:"Przelew bankowy"}),w.jsx("p",{children:"Dane do przelewu:"}),w.jsxs("div",{style:{background:"#f8f9fa",padding:"1rem",borderRadius:"8px",margin:"1rem 0"},children:[w.jsxs("p",{children:[w.jsx("strong",{children:"Nr konta:"})," 12 1234 5678 9012 3456 7890 1234"]}),w.jsxs("p",{children:[w.jsx("strong",{children:"Odbiorca:"})," Portal E-commerce Sp. z o.o."]}),w.jsxs("p",{children:[w.jsx("strong",{children:"Tytuł:"})," ",b.orderId]}),w.jsxs("p",{children:[w.jsx("strong",{children:"Kwota:"})," ",Ro(z)]})]}),w.jsx(So,{style:{marginTop:"1rem"},children:"Potwierdź przelew"})]})]}),"history"===o&&w.jsx(w.Fragment,{children:u?w.jsxs(Io,{children:[w.jsx("div",{style:{fontSize:"2rem",marginBottom:"1rem"},children:"⏳"}),w.jsx("p",{children:"Ładowanie historii płatności..."})]}):0===p.length?w.jsxs(_o,{children:[w.jsx("div",{style:{fontSize:"4rem",marginBottom:"1rem"},children:"📋"}),w.jsx("h3",{children:"Brak historii płatności"}),w.jsx("p",{children:"Nie masz jeszcze żadnych płatności"})]}):w.jsx(To,{children:p.map(e=>{return w.jsxs(Mo,{children:[w.jsxs(Lo,{children:[w.jsx(Eo,{children:Ro(e.amount)}),w.jsx(Wo,{status:e.status,children:S(e.status)})]}),w.jsxs(Do,{children:[w.jsxs("div",{children:["Metoda: ",(r=e.method,{card:"💳",paypal:"🔵",blik:"📱",transfer:"🏦"}[r]||"💰")," ",e.method]}),w.jsxs("div",{children:["Zamówienie: ",e.orderId]}),w.jsx("div",{children:e.description})]}),w.jsx(Oo,{children:(t=e.createdAt,new Date(t).toLocaleDateString("pl-PL",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"}))})]},e._id||e.id);var t,r})})})]}):w.jsx(po,{children:w.jsxs(_o,{children:[w.jsx("div",{style:{fontSize:"4rem",marginBottom:"1rem"},children:"🔐"}),w.jsx("h3",{children:"Zaloguj się"}),w.jsx("p",{children:"Musisz być zalogowany, aby korzystać z systemu płatności"})]})})}const Ho=p.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
`,Uo=p.h1`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`,Ko=p.div`
  background: ${e=>e.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${e=>e.theme.shadow};
`,Yo=p.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${e=>e.theme.primary}10;
  border: 2px solid ${e=>e.theme.primary};
  border-radius: 12px;
  margin-bottom: 2rem;
`,Vo=p.div`
  font-size: 1.5rem;
`,qo=p.div`
  flex: 1;
`,Go=p.div`
  font-weight: 600;
  color: ${e=>e.theme.text};
  margin-bottom: 0.25rem;
`,Jo=p.div`
  font-size: 0.875rem;
  color: ${e=>e.theme.textSecondary};
`,Xo=p.div`
  margin-bottom: 2rem;
`,Qo=p.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
    box-shadow: 0 0 0 3px ${e=>e.theme.primary}20;
  }
`,ea=p.div`
  max-height: 300px;
  overflow-y: auto;
`,ta=p.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid ${e=>e.selected?e.theme.primary:e.theme.border};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
  
  &:hover {
    border-color: ${e=>e.theme.primary};
    background: ${e=>e.theme.primary}10;
  }
  
  &.selected {
    background: ${e=>e.theme.primary}20;
  }
`,ra=p.div`
  font-size: 1.25rem;
`,ia=p.div`
  flex: 1;
`,oa=p.div`
  font-weight: 600;
  color: ${e=>e.theme.text};
  margin-bottom: 0.25rem;
`,aa=p.div`
  font-size: 0.875rem;
  color: ${e=>e.theme.textSecondary};
`,na=p.button`
  width: 100%;
  padding: 1rem 2rem;
  background: ${e=>e.theme.gradient};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
  
  &:hover {
    background: ${e=>e.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`,sa=p.div`
  margin-top: 2rem;
`,da=p.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${e=>e.theme.text};
`,ca=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`,la=p.div`
  padding: 1rem;
  background: ${e=>e.theme.background};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  
  &:hover {
    background: ${e=>e.theme.primary}10;
    transform: translateY(-2px);
  }
`,ma=p.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`,ha=p.div`
  font-weight: 600;
  color: ${e=>e.theme.text};
`;function pa(){const[e,t]=i.useState(""),[r,o]=i.useState(null),[a,n]=i.useState([]),[s,d]=i.useState(!0),c=[{id:1,name:"Warszawa",type:"Miasto",region:"Mazowieckie",icon:"🏙️"},{id:2,name:"Kraków",type:"Miasto",region:"Małopolskie",icon:"🏰"},{id:3,name:"Wrocław",type:"Miasto",region:"Dolnośląskie",icon:"🌉"},{id:4,name:"Poznań",type:"Miasto",region:"Wielkopolskie",icon:"🐐"},{id:5,name:"Gdańsk",type:"Miasto",region:"Pomorskie",icon:"⚓"},{id:6,name:"Łódź",type:"Miasto",region:"Łódzkie",icon:"🏭"}];i.useEffect(()=>{setTimeout(()=>{n(c),d(!1)},1e3)},[]);const l=a.filter(t=>t.name.toLowerCase().includes(e.toLowerCase())||t.region.toLowerCase().includes(e.toLowerCase())),m=e=>{o(e)};return s?w.jsx(Ho,{children:w.jsxs("div",{style:{textAlign:"center",padding:"4rem"},children:[w.jsx("div",{style:{fontSize:"2rem",marginBottom:"1rem"},children:"⏳"}),w.jsx("p",{children:"Ładowanie lokalizacji..."})]})}):w.jsxs(Ho,{children:[w.jsx(Uo,{children:"Wybierz lokalizację"}),w.jsxs(Ko,{children:[w.jsxs(Yo,{children:[w.jsx(Vo,{children:"📍"}),w.jsxs(qo,{children:[w.jsx(Go,{children:"Twoja lokalizacja"}),w.jsx(Jo,{children:"Warszawa, Mazowieckie (automatycznie wykryte)"})]})]}),w.jsxs(Xo,{children:[w.jsx(Qo,{type:"text",placeholder:"Szukaj miasta lub województwa...",value:e,onChange:e=>t(e.target.value)}),w.jsx(ea,{children:l.map(e=>w.jsxs(ta,{selected:r?.id===e.id,onClick:()=>m(e),children:[w.jsx(ra,{children:e.icon}),w.jsxs(ia,{children:[w.jsx(oa,{children:e.name}),w.jsxs(aa,{children:[e.type,", ",e.region]})]})]},e.id))})]}),w.jsx(na,{onClick:()=>{r&&alert(`Wybrano lokalizację: ${r.name}, ${r.region}`)},disabled:!r,children:r?`Potwierdź: ${r.name}`:"Wybierz lokalizację"}),w.jsxs(sa,{children:[w.jsx(da,{children:"Popularne lokalizacje"}),w.jsx(ca,{children:[{name:"Warszawa",icon:"🏙️"},{name:"Kraków",icon:"🏰"},{name:"Wrocław",icon:"🌉"},{name:"Poznań",icon:"🐐"}].map((e,t)=>w.jsxs(la,{onClick:()=>{const t=a.find(t=>t.name===e.name);t&&m(t)},children:[w.jsx(ma,{children:e.icon}),w.jsx(ha,{children:e.name})]},t))})]})]})]})}const xa=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`,ua=p.h1`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`,ga=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
`,ja=p.div`
  background: ${e=>e.theme.surface};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: ${e=>e.theme.shadow};
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`,ya=p.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`,ba=p.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${e=>e.theme.primary};
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`,fa=p.div`
  font-size: 1rem;
  color: ${e=>e.theme.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`,wa=p.div`
  width: 100%;
  height: 8px;
  background: ${e=>e.theme.border};
  border-radius: 4px;
  overflow: hidden;
  margin-top: 1rem;
`,ka=p.div`
  height: 100%;
  background: ${e=>e.theme.gradient};
  width: ${e=>e.progress}%;
  transition: width 0.3s ease;
`,va=p.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`,za=p.div`
  background: ${e=>e.theme.surface};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: ${e=>e.theme.shadow};
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`,$a=p.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${e=>e.theme.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`,Sa=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.75rem;
  }
`,Ca=p.div`
  text-align: center;
  padding: 1rem;
  border-radius: 12px;
  transition: all 0.2s ease;
  cursor: pointer;
  
  ${e=>e.unlocked?`\n    background: ${e.theme.primary}20;\n    border: 2px solid ${e.theme.primary};\n  `:`\n    background: ${e.theme.background};\n    border: 2px solid ${e.theme.border};\n    opacity: 0.6;\n  `}
  
  &:hover {
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`,Na=p.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  filter: ${e=>e.unlocked?"none":"grayscale(100%)"};
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`,Pa=p.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${e=>e.theme.text};
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`,Ba=p.div`
  font-size: 0.75rem;
  color: ${e=>e.theme.textSecondary};
  
  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`,Aa=p.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`,Ta=p.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  transition: all 0.2s ease;
  
  ${e=>e.earned?`\n    background: ${e.theme.primary}20;\n    border: 2px solid ${e.theme.primary};\n  `:`\n    background: ${e.theme.background};\n    border: 2px solid ${e.theme.border};\n    opacity: 0.6;\n  `}
  
  &:hover {
    transform: translateX(4px);
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem;
    gap: 0.75rem;
  }
`,Ma=p.div`
  font-size: 2rem;
  filter: ${e=>e.earned?"none":"grayscale(100%)"};
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`,La=p.div`
  flex: 1;
`,Ea=p.div`
  font-weight: 600;
  color: ${e=>e.theme.text};
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`,Wa=p.div`
  font-size: 0.875rem;
  color: ${e=>e.theme.textSecondary};
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`,Da=p.div`
  font-size: 0.75rem;
  color: ${e=>e.theme.textSecondary};
  
  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`,Oa=p.div`
  background: ${e=>e.theme.gradient};
  color: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`,Ia=p.div`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`,Fa=p.div`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`,_a=p.div`
  font-size: 1rem;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`,Ra=p.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${e=>e.theme.textSecondary};
`,Za=p.div`
  background: ${e=>e.theme.error}20;
  color: ${e=>e.theme.error};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`,Ha=p.div`
  text-align: center;
  padding: 2rem;
  color: ${e=>e.theme.textSecondary};
`,Ua=e=>Math.floor(100*e*1.5);function Ka(){const{user:e,isAuthenticated:t}=N(),[r,o]=i.useState({level:1,experience:0,nextLevelExp:150,achievements:0,totalAchievements:0,badges:0,totalBadges:0,orders:0,reviews:0,daysActive:0,shops:0,products:0}),[a,n]=i.useState([]),[s,d]=i.useState([]),[c,l]=i.useState(!0),[m,h]=i.useState(null);i.useEffect(()=>{t?p():l(!1)},[t]);const p=async()=>{try{l(!0),h(null);const t="http://localhost:5000",r=localStorage.getItem("token"),[i,a,s]=await Promise.allSettled([fetch(`${t}/api/gamification/stats`,{headers:{Authorization:`Bearer ${r}`}}),fetch(`${t}/api/gamification/achievements`,{headers:{Authorization:`Bearer ${r}`}}),fetch(`${t}/api/gamification/badges`,{headers:{Authorization:`Bearer ${r}`}})]);if("fulfilled"===i.status&&i.value.ok){const e=await i.value.json();o({...e,nextLevelExp:Ua(e.level||1)})}else o({level:e?.level||1,experience:e?.experience||0,nextLevelExp:Ua(e?.level||1),achievements:0,totalAchievements:20,badges:0,totalBadges:25,orders:e?.orders?.length||0,reviews:e?.reviews?.length||0,daysActive:Math.floor((Date.now()-new Date(e?.createdAt||Date.now()).getTime())/864e5),shops:e?.shops?.length||0,products:0});if("fulfilled"===a.status&&a.value.ok){const e=await a.value.json();n(e.achievements||e||[])}else n([{_id:"1",name:"Pierwszy zakup",desc:"Złóż pierwsze zamówienie",icon:"🛒",unlocked:!0,progress:100},{_id:"2",name:"Recenzent",desc:"Napisz 10 recenzji",icon:"⭐",unlocked:!1,progress:30},{_id:"3",name:"Wierny klient",desc:"Złóż 50 zamówień",icon:"👑",unlocked:!1,progress:20},{_id:"4",name:"Eksplorator",desc:"Odwiedź 10 różnych sklepów",icon:"🗺️",unlocked:!0,progress:100},{_id:"5",name:"Szybki",desc:"Złóż zamówienie w ciągu 1 minuty",icon:"⚡",unlocked:!0,progress:100},{_id:"6",name:"Kolekcjoner",desc:"Kup produkty z 5 kategorii",icon:"📦",unlocked:!1,progress:60},{_id:"7",name:"Społeczny",desc:"Poleć portal 5 znajomym",icon:"🤝",unlocked:!1,progress:0},{_id:"8",name:"Mistrz",desc:"Osiągnij poziom 20",icon:"🏆",unlocked:!1,progress:75}]);if("fulfilled"===s.status&&s.value.ok){const e=await s.value.json();d(e.badges||e||[])}else d([{_id:"1",name:"Nowicjusz",desc:"Dołącz do portalu",icon:"🌱",earned:!0,earnedAt:e?.createdAt||"2024-01-15"},{_id:"2",name:"Kupujący",desc:"Złóż pierwsze zamówienie",icon:"🛍️",earned:!0,earnedAt:"2024-01-20"},{_id:"3",name:"Recenzent",desc:"Napisz pierwszą recenzję",icon:"✍️",earned:!1},{_id:"4",name:"Wierny",desc:"30 dni aktywności",icon:"📅",earned:!1},{_id:"5",name:"Ekspert",desc:"Osiągnij poziom 10",icon:"🎯",earned:!1},{_id:"6",name:"Mistrz",desc:"Osiągnij poziom 20",icon:"👑",earned:!1},{_id:"7",name:"Legenda",desc:"Osiągnij poziom 50",icon:"🌟",earned:!1},{_id:"8",name:"Filantrop",desc:"Pomóż 100 użytkownikom",icon:"💝",earned:!1}])}catch(t){h(t.message)}finally{l(!1)}};if(!t)return w.jsx(xa,{children:w.jsxs(Ha,{children:[w.jsx("div",{style:{fontSize:"4rem",marginBottom:"1rem"},children:"🔐"}),w.jsx("h3",{children:"Zaloguj się"}),w.jsx("p",{children:"Musisz być zalogowany, aby zobaczyć swój postęp w gamifikacji"})]})});if(c)return w.jsx(xa,{children:w.jsxs(Ra,{children:[w.jsx("div",{style:{fontSize:"2rem",marginBottom:"1rem"},children:"⏳"}),w.jsx("p",{children:"Ładowanie danych gamifikacji..."})]})});const x=r.experience/r.nextLevelExp*100,u=a.filter(e=>e.unlocked).length,g=s.filter(e=>e.earned).length;return w.jsxs(xa,{children:[w.jsx(ua,{children:"Panel Gamifikacji"}),m&&w.jsx(Za,{children:m}),w.jsxs(Oa,{children:[w.jsx(Ia,{children:r.level}),w.jsx(Fa,{children:(j=r.level,j<5?"Nowicjusz":j<10?"Początkujący":j<20?"Doświadczony":j<30?"Ekspert":j<50?"Mistrz":"Legenda")}),w.jsxs(_a,{children:[r.experience," / ",r.nextLevelExp," XP"]}),w.jsx(wa,{children:w.jsx(ka,{progress:x})})]}),w.jsxs(ga,{children:[w.jsxs(ja,{children:[w.jsx(ya,{children:"📊"}),w.jsx(ba,{children:r.orders}),w.jsx(fa,{children:"Zamówienia"})]}),w.jsxs(ja,{children:[w.jsx(ya,{children:"⭐"}),w.jsx(ba,{children:r.reviews}),w.jsx(fa,{children:"Recenzje"})]}),w.jsxs(ja,{children:[w.jsx(ya,{children:"📅"}),w.jsx(ba,{children:r.daysActive}),w.jsx(fa,{children:"Dni aktywności"})]}),w.jsxs(ja,{children:[w.jsx(ya,{children:"🏆"}),w.jsxs(ba,{children:[u,"/",r.totalAchievements]}),w.jsx(fa,{children:"Osiągnięcia"})]}),w.jsxs(ja,{children:[w.jsx(ya,{children:"🎖️"}),w.jsxs(ba,{children:[g,"/",r.totalBadges]}),w.jsx(fa,{children:"Odznaki"})]}),w.jsxs(ja,{children:[w.jsx(ya,{children:"🏪"}),w.jsx(ba,{children:r.shops}),w.jsx(fa,{children:"Sklepy"})]})]}),w.jsxs(va,{children:[w.jsxs(za,{children:[w.jsx($a,{children:"🏆 Osiągnięcia"}),w.jsx(Sa,{children:a.map(e=>w.jsxs(Ca,{unlocked:e.unlocked,title:e.unlocked?"Osiągnięcie odblokowane!":`Postęp: ${e.progress||0}%`,children:[w.jsx(Na,{unlocked:e.unlocked,children:e.icon}),w.jsx(Pa,{children:e.name}),w.jsx(Ba,{children:e.desc}),!e.unlocked&&e.progress>0&&w.jsx(wa,{style:{marginTop:"0.5rem"},children:w.jsx(ka,{progress:e.progress})})]},e._id||e.id))})]}),w.jsxs(za,{children:[w.jsx($a,{children:"🎖️ Odznaki"}),w.jsx(Aa,{children:s.map(e=>{return w.jsxs(Ta,{earned:e.earned,title:e.earned?"Odznaka zdobyta!":"Odznaka do zdobycia",children:[w.jsx(Ma,{earned:e.earned,children:e.icon}),w.jsxs(La,{children:[w.jsx(Ea,{children:e.name}),w.jsx(Wa,{children:e.desc}),e.earned&&e.earnedAt&&w.jsxs(Da,{children:["Zdobyta: ",(t=e.earnedAt,new Date(t).toLocaleDateString("pl-PL"))]})]})]},e._id||e.id);var t})})]})]})]});var j}const Ya=()=>{const{isAuthenticated:e}=N(),[t,r]=i.useState([]),[o,a]=i.useState(!0),[n,s]=i.useState("all"),[d,c]=i.useState(!1),[l,m]=i.useState({email:!0,push:!0,sound:!0});i.useEffect(()=>{e&&h()},[e,n]);const h=async()=>{try{const e="all"===n?"http://localhost:5000/api/notifications":`http://localhost:5000/api/notifications?type=${n}`,t=await fetch(e,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});if(t.ok){const e=await t.json();r(e.notifications)}}catch(e){}finally{a(!1)}},p=e=>{switch(e){case"order_status":return"📦";case"payment":return"💳";case"delivery":return"🚚";case"promotion":return"🎉";case"security":return"🔒";case"system":return"⚙️";case"chat":return"💬";case"review":return"⭐";case"stock":return"📊";case"return":return"↩️";default:return"🔔"}},x=e=>{switch(e){case"order_status":return"bg-blue-100 text-blue-800";case"payment":return"bg-green-100 text-green-800";case"delivery":return"bg-purple-100 text-purple-800";case"promotion":return"bg-yellow-100 text-yellow-800";case"security":return"bg-red-100 text-red-800";case"system":default:return"bg-gray-100 text-gray-800";case"chat":return"bg-indigo-100 text-indigo-800";case"review":return"bg-orange-100 text-orange-800";case"stock":return"bg-teal-100 text-teal-800";case"return":return"bg-pink-100 text-pink-800"}},u=e=>{switch(e){case"urgent":return"border-red-500";case"high":return"border-orange-500";case"medium":return"border-blue-500";case"low":return"border-gray-500";default:return"border-gray-300"}},g=e=>{const t=new Date,r=new Date(e),i=Math.floor((t-r)/6e4);return i<1?"Teraz":i<60?`${i} min temu`:i<1440?`${Math.floor(i/60)} godz. temu`:r.toLocaleDateString("pl-PL")};if(!e)return w.jsx("div",{className:"min-h-screen bg-gray-50 flex items-center justify-center",children:w.jsxs("div",{className:"text-center",children:[w.jsx(B,{className:"text-6xl text-gray-400 mx-auto mb-4"}),w.jsx("h2",{className:"text-2xl font-bold text-gray-700 mb-2",children:"Zaloguj się"}),w.jsx("p",{className:"text-gray-600",children:"Aby zobaczyć powiadomienia, musisz się zalogować."})]})});if(o)return w.jsx("div",{className:"min-h-screen bg-gray-50 flex items-center justify-center",children:w.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"})});const j=t.filter(e=>"unread"===e.status).length;return w.jsx("div",{className:"min-h-screen bg-gray-50 py-8",children:w.jsxs("div",{className:"max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",children:[w.jsxs("div",{className:"mb-8",children:[w.jsxs("div",{className:"flex justify-between items-center mb-6",children:[w.jsxs("div",{children:[w.jsx("h1",{className:"text-3xl font-bold text-gray-900",children:"Powiadomienia"}),j>0&&w.jsxs("p",{className:"text-sm text-gray-600 mt-1",children:[j," nieprzeczytane powiadomienie",1!==j?"a":""]})]}),w.jsxs("div",{className:"flex gap-2",children:[w.jsx("button",{onClick:()=>c(!d),className:"p-2 text-gray-600 hover:text-gray-800",children:w.jsx(W,{})}),j>0&&w.jsx("button",{onClick:async()=>{try{(await fetch("http://localhost:5000/api/notifications/read-all",{method:"PUT",headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).ok&&r(t.map(e=>({...e,status:"read"})))}catch(e){}},className:"px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm",children:"Oznacz wszystkie jako przeczytane"})]})]}),w.jsx("div",{className:"flex gap-2 mb-6",children:[{value:"all",label:"Wszystkie"},{value:"unread",label:"Nieprzeczytane"},{value:"order_status",label:"Zamówienia"},{value:"payment",label:"Płatności"},{value:"promotion",label:"Promocje"},{value:"security",label:"Bezpieczeństwo"}].map(e=>w.jsx("button",{onClick:()=>s(e.value),className:"px-4 py-2 rounded-lg text-sm font-medium "+(n===e.value?"bg-blue-600 text-white":"bg-white text-gray-700 hover:bg-gray-50"),children:e.label},e.value))})]}),d&&w.jsxs("div",{className:"bg-white rounded-lg shadow-sm p-6 mb-6",children:[w.jsx("h3",{className:"text-lg font-semibold text-gray-900 mb-4",children:"Ustawienia powiadomień"}),w.jsxs("div",{className:"space-y-4",children:[w.jsxs("div",{className:"flex items-center justify-between",children:[w.jsxs("div",{children:[w.jsx("p",{className:"font-medium",children:"Powiadomienia email"}),w.jsx("p",{className:"text-sm text-gray-600",children:"Otrzymuj powiadomienia na email"})]}),w.jsxs("label",{className:"relative inline-flex items-center cursor-pointer",children:[w.jsx("input",{type:"checkbox",checked:l.email,onChange:e=>m({...l,email:e.target.checked}),className:"sr-only peer"}),w.jsx("div",{className:"w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"})]})]}),w.jsxs("div",{className:"flex items-center justify-between",children:[w.jsxs("div",{children:[w.jsx("p",{className:"font-medium",children:"Powiadomienia push"}),w.jsx("p",{className:"text-sm text-gray-600",children:"Otrzymuj powiadomienia w przeglądarce"})]}),w.jsxs("label",{className:"relative inline-flex items-center cursor-pointer",children:[w.jsx("input",{type:"checkbox",checked:l.push,onChange:e=>m({...l,push:e.target.checked}),className:"sr-only peer"}),w.jsx("div",{className:"w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"})]})]}),w.jsxs("div",{className:"flex items-center justify-between",children:[w.jsxs("div",{children:[w.jsx("p",{className:"font-medium",children:"Dźwięki"}),w.jsx("p",{className:"text-sm text-gray-600",children:"Odtwarzaj dźwięki przy nowych powiadomieniach"})]}),w.jsxs("label",{className:"relative inline-flex items-center cursor-pointer",children:[w.jsx("input",{type:"checkbox",checked:l.sound,onChange:e=>m({...l,sound:e.target.checked}),className:"sr-only peer"}),w.jsx("div",{className:"w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"})]})]})]}),w.jsxs("div",{className:"flex justify-end gap-2 mt-6",children:[w.jsx("button",{onClick:()=>c(!1),className:"px-4 py-2 text-gray-600 hover:text-gray-800",children:"Anuluj"}),w.jsx("button",{onClick:()=>(async e=>{try{(await fetch("http://localhost:5000/api/notifications/settings",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`},body:JSON.stringify(e)})).ok&&(m(e),c(!1))}catch(t){}})(l),className:"px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700",children:"Zapisz"})]})]}),0===t.length?w.jsxs("div",{className:"text-center py-12",children:[w.jsx(B,{className:"text-6xl text-gray-400 mx-auto mb-4"}),w.jsx("h2",{className:"text-2xl font-bold text-gray-700 mb-2",children:"Brak powiadomień"}),w.jsx("p",{className:"text-gray-600",children:"Nie masz jeszcze żadnych powiadomień."})]}):w.jsx("div",{className:"space-y-4",children:t.map(e=>w.jsx("div",{className:`bg-white rounded-lg shadow-sm p-6 border-l-4 ${u(e.priority)} ${"unread"===e.status?"ring-2 ring-blue-200":""}`,children:w.jsxs("div",{className:"flex items-start gap-4",children:[w.jsx("div",{className:"text-2xl",children:p(e.type)}),w.jsxs("div",{className:"flex-1",children:[w.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[w.jsx("h3",{className:"font-semibold text-gray-900",children:e.title}),w.jsx("span",{className:`px-2 py-1 rounded-full text-xs font-medium ${x(e.type)}`,children:e.type}),"urgent"===e.priority&&w.jsx("span",{className:"px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800",children:"Pilne"})]}),w.jsx("p",{className:"text-gray-700 mb-3",children:e.message}),w.jsxs("div",{className:"flex items-center justify-between",children:[w.jsxs("div",{className:"flex items-center gap-4 text-sm text-gray-600",children:[w.jsx("span",{children:g(e.createdAt)}),e.data?.url&&w.jsx("a",{href:e.data.url,className:"text-blue-600 hover:text-blue-800 underline",children:"Zobacz więcej"})]}),w.jsxs("div",{className:"flex items-center gap-2",children:["unread"===e.status&&w.jsx("button",{onClick:()=>(async e=>{try{(await fetch(`http://localhost:5000/api/notifications/${e}/read`,{method:"PUT",headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).ok&&r(t.map(t=>t._id===e?{...t,status:"read"}:t))}catch(i){}})(e._id),className:"p-2 text-gray-600 hover:text-gray-800",title:"Oznacz jako przeczytane",children:w.jsx(_,{})}),w.jsx("button",{onClick:()=>(async e=>{try{(await fetch(`http://localhost:5000/api/notifications/${e}/archive`,{method:"PUT",headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).ok&&r(t.map(t=>t._id===e?{...t,status:"archived"}:t))}catch(i){}})(e._id),className:"p-2 text-gray-600 hover:text-gray-800",title:"Archiwizuj",children:w.jsx(F,{})}),w.jsx("button",{onClick:()=>(async e=>{try{(await fetch(`http://localhost:5000/api/notifications/${e}`,{method:"DELETE",headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).ok&&r(t.filter(t=>t._id!==e))}catch(i){}})(e._id),className:"p-2 text-red-600 hover:text-red-800",title:"Usuń",children:w.jsx(se,{})})]})]})]})]})},e._id))})]})})},Va=p.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`,qa=p.h1`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
`,Ga=p.form`
  background: ${e=>e.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${e=>e.theme.shadow};
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 12px;
  }
`,Ja=p.div`
  margin-bottom: 2rem;
  
  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
  }
`,Xa=p.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${e=>e.theme.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`,Qa=p.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`,en=p.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`,tn=p.label`
  font-weight: 600;
  color: ${e=>e.theme.text};
  font-size: 0.875rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`,rn=p.input`
  padding: 1rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
    box-shadow: 0 0 0 3px ${e=>e.theme.primary}20;
  }
  
  &::placeholder {
    color: ${e=>e.theme.textSecondary};
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
`,on=p.textarea`
  padding: 1rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 120px;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
    box-shadow: 0 0 0 3px ${e=>e.theme.primary}20;
  }
  
  &::placeholder {
    color: ${e=>e.theme.textSecondary};
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 0.95rem;
    min-height: 100px;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
    min-height: 80px;
  }
`,an=p.select`
  padding: 1rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
    box-shadow: 0 0 0 3px ${e=>e.theme.primary}20;
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
`,nn=p.div`
  border: 2px dashed ${e=>e.theme.border};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${e=>e.theme.primary};
    background: ${e=>e.theme.primary}05;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`,sn=p.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${e=>e.theme.textSecondary};
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`,dn=p.div`
  color: ${e=>e.theme.textSecondary};
  margin-bottom: 0.5rem;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`,cn=p.div`
  font-size: 0.875rem;
  color: ${e=>e.theme.textSecondary};
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`,ln=p.div`
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  background: ${e=>e.theme.background};
  border: 2px solid ${e=>e.theme.border};
  margin: 1rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
  
  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
  }
`,mn=p.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  background: ${e=>e.theme.background};
  border: 2px solid ${e=>e.theme.border};
`,hn=p.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 0.75rem;
  
  &:hover {
    background: rgba(239, 68, 68, 1);
  }
`,pn=p.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`,xn=p.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${e=>e.theme.primary}20;
  color: ${e=>e.theme.primary};
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
`,un=p.button`
  background: none;
  border: none;
  color: ${e=>e.theme.primary};
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  
  &:hover {
    color: ${e=>e.theme.error};
  }
`,gn=p.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`,jn=p.button`
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background: ${e=>e.theme.gradient};
    color: white;
    
    &:hover {
      background: ${e=>e.theme.gradientHover};
      transform: translateY(-2px);
      box-shadow: ${e=>e.theme.shadowHover};
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }
  
  &.secondary {
    background: ${e=>e.theme.surface};
    color: ${e=>e.theme.text};
    border: 2px solid ${e=>e.theme.border};
    
    &:hover {
      background: ${e=>e.theme.border};
    }
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 1.75rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
`,yn=p.div`
  color: ${e=>e.theme.error};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;function bn(){const{user:e}=N(),[t,r]=i.useState({name:"",description:"",price:"",category:"",brand:"",sku:"",weight:"",dimensions:"",stock:"0",tags:[],shopId:""}),[o,a]=i.useState([]),[n,s]=i.useState(""),[d,c]=i.useState({}),[l,m]=i.useState(!1),[h,p]=i.useState([]),[x,u]=i.useState(!0),[g,j]=i.useState(!1);i.useEffect(()=>{y()},[]);const y=async()=>{try{u(!0);const e="http://localhost:5000",t=localStorage.getItem("token"),i=await fetch(`${e}/api/shops/user`,{headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"}});if(!i.ok)throw new Error("Nie udało się pobrać Twoich sklepów");const o=await i.json();p(o),o.length>0?(j(!0),1===o.length&&r(e=>({...e,shopId:o[0]._id}))):j(!1)}catch(e){c({shops:e.message}),j(!1)}finally{u(!1)}},b=e=>{const{name:i,value:o}=e.target;r({...t,[i]:o}),d[i]&&c({...d,[i]:""})},f=()=>{n.trim()&&!t.tags.includes(n.trim())&&(r({...t,tags:[...t.tags,n.trim()]}),s(""))};return w.jsxs(Va,{children:[w.jsx(qa,{children:"Dodaj nowy produkt"}),!x&&h.length>0?w.jsxs(Ga,{onSubmit:async e=>{if(e.preventDefault(),(()=>{const e={};return t.name.trim()||(e.name="Nazwa produktu jest wymagana"),t.description.trim()||(e.description="Opis produktu jest wymagany"),(!t.price||t.price<=0)&&(e.price="Cena musi być większa od 0"),t.category||(e.category="Kategoria jest wymagana"),t.shopId||(e.shopId="Musisz wybrać sklep"),c(e),0===Object.keys(e).length})()){m(!0);try{const e="http://localhost:5000",i=localStorage.getItem("token"),o={name:t.name,description:t.description,price:parseFloat(t.price),category:t.category,location:"Polska",shopId:t.shopId,brand:t.brand,sku:t.sku,weight:t.weight,dimensions:t.dimensions,stock:parseInt(t.stock)||0,tags:t.tags},n=await fetch(`${e}/api/products`,{method:"POST",headers:{Authorization:`Bearer ${i}`,"Content-Type":"application/json"},body:JSON.stringify(o)});if(!n.ok){const e=await n.json();throw new Error(e.error||"Nie udało się dodać produktu")}await n.json();alert("Produkt został dodany pomyślnie!"),r({name:"",description:"",price:"",category:"",brand:"",sku:"",weight:"",dimensions:"",stock:"0",tags:[],shopId:t.shopId}),a([]),c({})}catch(i){alert("Błąd podczas dodawania produktu: "+i.message)}finally{m(!1)}}},children:[w.jsxs(Ja,{children:[w.jsx(Xa,{children:"🏪 Wybór sklepu"}),w.jsxs(en,{children:[w.jsx(tn,{children:"Sklep *"}),w.jsxs(an,{name:"shopId",value:t.shopId,onChange:b,children:[w.jsx("option",{value:"",children:"Wybierz sklep"}),h.map(e=>w.jsxs("option",{value:e._id,children:[e.name," ",!e.isActive&&"(Nieaktywny)"]},e._id))]}),d.shopId&&w.jsx(yn,{children:d.shopId}),d.shops&&w.jsx(yn,{children:d.shops})]})]}),w.jsxs(Ja,{children:[w.jsx(Xa,{children:"📝 Podstawowe informacje"}),w.jsxs(Qa,{children:[w.jsxs(en,{children:[w.jsx(tn,{children:"Nazwa produktu *"}),w.jsx(rn,{type:"text",name:"name",value:t.name,onChange:b,placeholder:"Wprowadź nazwę produktu"}),d.name&&w.jsx(yn,{children:d.name})]}),w.jsxs(en,{children:[w.jsx(tn,{children:"Kategoria *"}),w.jsxs(an,{name:"category",value:t.category,onChange:b,children:[w.jsx("option",{value:"",children:"Wybierz kategorię"}),["Elektronika","Odzież","Książki","Sport","Dom i ogród","Motoryzacja","Zdrowie i uroda","Zabawki","Inne"].map(e=>w.jsx("option",{value:e,children:e},e))]}),d.category&&w.jsx(yn,{children:d.category})]}),w.jsxs(en,{children:[w.jsx(tn,{children:"Cena (zł) *"}),w.jsx(rn,{type:"number",name:"price",value:t.price,onChange:b,placeholder:"0.00",step:"0.01",min:"0"}),d.price&&w.jsx(yn,{children:d.price})]}),w.jsxs(en,{children:[w.jsx(tn,{children:"Marka"}),w.jsx(rn,{type:"text",name:"brand",value:t.brand,onChange:b,placeholder:"Nazwa marki"})]})]})]}),w.jsxs(Ja,{children:[w.jsx(Xa,{children:"📄 Opis produktu"}),w.jsxs(en,{children:[w.jsx(tn,{children:"Opis *"}),w.jsx(on,{name:"description",value:t.description,onChange:b,placeholder:"Opisz szczegółowo swój produkt..."}),d.description&&w.jsx(yn,{children:d.description})]})]}),w.jsxs(Ja,{children:[w.jsx(Xa,{children:"🏷️ Tagi"}),w.jsxs(en,{children:[w.jsx(tn,{children:"Dodaj tagi"}),w.jsxs("div",{style:{display:"flex",gap:"0.5rem"},children:[w.jsx(rn,{type:"text",value:n,onChange:e=>s(e.target.value),placeholder:"Wprowadź tag",onKeyPress:e=>"Enter"===e.key&&(e.preventDefault(),f())}),w.jsx(jn,{type:"button",className:"secondary",onClick:f,children:"Dodaj"})]}),w.jsx(pn,{children:t.tags.map(e=>w.jsxs(xn,{children:[e,w.jsx(un,{onClick:()=>{return i=e,void r({...t,tags:t.tags.filter(e=>e!==i)});var i},children:"×"})]},e))})]})]}),w.jsxs(Ja,{children:[w.jsx(Xa,{children:"📦 Szczegóły techniczne"}),w.jsxs(Qa,{children:[w.jsxs(en,{children:[w.jsx(tn,{children:"SKU"}),w.jsx(rn,{type:"text",name:"sku",value:t.sku,onChange:b,placeholder:"Kod produktu"})]}),w.jsxs(en,{children:[w.jsx(tn,{children:"Stan magazynowy"}),w.jsx(rn,{type:"number",name:"stock",value:t.stock,onChange:b,placeholder:"0",min:"0"})]}),w.jsxs(en,{children:[w.jsx(tn,{children:"Waga (kg)"}),w.jsx(rn,{type:"number",name:"weight",value:t.weight,onChange:b,placeholder:"0.0",step:"0.1",min:"0"})]}),w.jsxs(en,{children:[w.jsx(tn,{children:"Wymiary (cm)"}),w.jsx(rn,{type:"text",name:"dimensions",value:t.dimensions,onChange:b,placeholder:"Dł. x Szer. x Wys."})]})]})]}),w.jsxs(Ja,{children:[w.jsx(Xa,{children:"🖼️ Zdjęcia produktu"}),w.jsxs(nn,{children:[w.jsx("input",{type:"file",multiple:!0,accept:"image/*",onChange:e=>{const t=Array.from(e.target.files).map(e=>({id:Date.now()+Math.random(),file:e,preview:URL.createObjectURL(e)}));a([...o,...t])},style:{display:"none"},id:"image-upload"}),w.jsxs("label",{htmlFor:"image-upload",children:[w.jsx(sn,{children:"📷"}),w.jsx(dn,{children:"Kliknij aby dodać zdjęcia"}),w.jsx(cn,{children:"Maksymalnie 10 zdjęć, format JPG/PNG"})]})]}),o.length>0&&w.jsx(ln,{children:o.map(e=>w.jsxs(mn,{children:[w.jsx("img",{src:e.preview,alt:"Preview",style:{width:"100%",height:"100%",objectFit:"cover"}}),w.jsx(hn,{onClick:()=>{return t=e.id,void a(o.filter(e=>e.id!==t));var t},children:"×"})]},e.id))})]}),w.jsxs(gn,{children:[w.jsx(jn,{type:"submit",className:"primary",disabled:l,children:l?"Dodawanie...":"Dodaj produkt"}),w.jsx(jn,{type:"button",className:"secondary",onClick:()=>{window.confirm("Czy na pewno chcesz zresetować formularz?")&&(r({name:"",description:"",price:"",category:"",brand:"",sku:"",weight:"",dimensions:"",stock:"0",tags:[],shopId:t.shopId}),a([]),c({}))},children:"Resetuj"})]})]}):x?w.jsx("div",{style:{padding:"2rem",textAlign:"center",color:"#666"},children:"Ładowanie Twoich sklepów..."}):w.jsxs("div",{style:{padding:"2rem",textAlign:"center",color:"#ef4444"},children:["Nie masz żadnych sklepów. ",w.jsx("a",{href:"/shop-create",style:{color:"#00D4AA"},children:"Utwórz pierwszy sklep"})," aby móc dodawać produkty."]})]})}const fn=p.div`
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid ${e=>e.theme.border};
  position: relative;
  margin-bottom: 1rem;
`,wn=p.div`
  width: 100%;
  height: 100%;
  background: ${e=>e.theme.background};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: ${e=>e.theme.textSecondary};
  font-size: 1.2rem;
`,kn=p.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
  display: flex;
  gap: 0.5rem;
`,vn=p.button`
  background: white;
  border: 1px solid ${e=>e.theme.border};
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.primary}20;
    border-color: ${e=>e.theme.primary};
  }
`,zn=p.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
    box-shadow: 0 0 0 3px ${e=>e.theme.primary}20;
  }
`,$n=p.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: ${e=>e.theme.textSecondary};
`,Sn=p.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`,Cn=p.span`
  font-weight: 600;
  color: ${e=>e.theme.text};
`,Nn=p.span`
  font-family: monospace;
  background: ${e=>e.theme.surface};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid ${e=>e.theme.border};
`,Pn=p.button`
  background: ${e=>e.theme.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.primary}dd;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`,Bn=p.div`
  color: ${e=>e.theme.error};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`,An=p.div`
  color: ${e=>e.theme.success};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;function Tn({onLocationSelect:e,initialAddress:t="",initialCoordinates:r=null,theme:o}){const[a,n]=i.useState(t),[s,d]=i.useState(r||{lat:52.2297,lng:21.0122}),[c,l]=i.useState(!1),[m,h]=i.useState(""),[p,x]=i.useState(""),u=i.useRef(null),g=i.useRef(null),j=i.useRef(null);i.useEffect(()=>{if(window.google&&window.google.maps&&!g.current)y();else if(!window.google){const e=document.createElement("script");e.src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCwtl6-7ZwOqKa2rd967GHyp4JyCMgX2MI&libraries=places&async=true&defer=true",e.async=!0,e.defer=!0,e.onload=()=>{window.google&&window.google.maps&&!g.current&&y()},e.onerror=()=>{h("Google Maps nie jest dostępne. Możesz ręcznie wprowadzić adres.")},document.head.appendChild(e)}},[]);const y=()=>{if(u.current)try{const e={center:s,zoom:13,mapTypeId:window.google.maps.MapTypeId.ROADMAP,styles:[{featureType:"poi",elementType:"labels",stylers:[{visibility:"off"}]}]};g.current=new window.google.maps.Map(u.current,e),j.current=new window.google.maps.Marker({position:s,map:g.current,draggable:!0,title:"Lokalizacja sklepu"}),g.current.addListener("click",e=>{const t=e.latLng;d({lat:t.lat(),lng:t.lng()}),j.current.setPosition(t),b(t.lat(),t.lng())}),j.current.addListener("dragend",e=>{const t=e.latLng;d({lat:t.lat(),lng:t.lng()}),b(t.lat(),t.lng())})}catch(e){h("Nie udało się załadować mapy. Możesz ręcznie wprowadzić adres.")}},b=async(t,r)=>{try{if(!window.google||!window.google.maps)return;(new window.google.maps.Geocoder).geocode({location:{lat:t,lng:r}},(i,o)=>{if("OK"===o&&i[0]){const o=i[0].formatted_address;n(o),e({lat:t,lng:r},o)}})}catch(i){}};return w.jsxs("div",{children:[m&&w.jsxs("div",{style:{background:"#fef2f2",border:"1px solid #fecaca",color:"#dc2626",padding:"1rem",borderRadius:"8px",marginBottom:"1rem",fontSize:"0.875rem"},children:[w.jsx("strong",{children:"⚠️ Uwaga:"})," ",m,w.jsx("br",{}),w.jsx("small",{children:"Jeśli Google Maps nie działa, możesz ręcznie wprowadzić adres w polach poniżej. To nie wpłynie na funkcjonalność dodawania sklepu."})]}),w.jsxs("div",{children:[w.jsx(zn,{type:"text",value:a,onChange:e=>{n(e.target.value),h(""),x("")},placeholder:"Wprowadź adres sklepu...",theme:o}),w.jsxs("div",{style:{display:"flex",gap:"1rem",marginBottom:"1rem"},children:[w.jsx(Pn,{type:"button",onClick:async()=>{if(a.trim()){l(!0),h(""),x("");try{if(!window.google||!window.google.maps)throw new Error("Google Maps API nie jest dostępne");(new window.google.maps.Geocoder).geocode({address:a},(t,r)=>{if(l(!1),"OK"===r&&t[0]){const r=t[0].geometry.location,i={lat:r.lat(),lng:r.lng()};d(i),g.current&&(g.current.setCenter(r),g.current.setZoom(15),j.current.setPosition(r)),x("Lokalizacja została znaleziona!"),e(i,t[0].formatted_address)}else h("Nie udało się znaleźć podanego adresu. Możesz ręcznie wprowadzić koordynaty.")})}catch(t){l(!1),h("Google Maps nie jest dostępne. Możesz ręcznie wprowadzić adres i koordynaty.")}}else h("Wprowadź adres do wyszukania")},disabled:c,theme:o,children:c?"🔍 Wyszukiwanie...":"🔍 Wyszukaj"}),w.jsx(Pn,{type:"button",onClick:()=>{navigator.geolocation?(l(!0),navigator.geolocation.getCurrentPosition(e=>{const t={lat:e.coords.latitude,lng:e.coords.longitude};d(t),g.current&&(g.current.setCenter(t),g.current.setZoom(15),j.current.setPosition(t)),b(t.lat,t.lng),l(!1),x("Lokalizacja została ustawiona na Twoją pozycję!")},e=>{l(!1),h("Nie udało się pobrać Twojej lokalizacji")})):h("Twoja przeglądarka nie obsługuje geolokalizacji")},disabled:c,style:{background:"#10B981"},children:"📍 Moja lokalizacja"})]})]}),w.jsx(fn,{theme:o,children:window.google&&window.google.maps?w.jsxs(w.Fragment,{children:[w.jsx("div",{ref:u,style:{width:"100%",height:"100%"}}),w.jsxs(kn,{children:[w.jsx(vn,{onClick:()=>g.current?.setZoom(g.current.getZoom()+1),theme:o,children:"➕"}),w.jsx(vn,{onClick:()=>g.current?.setZoom(g.current.getZoom()-1),theme:o,children:"➖"})]})]}):w.jsxs(wn,{theme:o,children:[w.jsx("div",{style:{fontSize:"3rem",marginBottom:"1rem"},children:"🗺️"}),w.jsx("div",{children:"Mapa Google Maps"}),w.jsx("div",{style:{fontSize:"0.875rem",marginTop:"0.5rem"},children:"Kliknij na mapę, aby wybrać lokalizację sklepu"})]})}),w.jsxs($n,{theme:o,children:[w.jsxs(Sn,{children:[w.jsx(Cn,{children:"Szerokość geograficzna:"}),w.jsx(Nn,{children:s.lat.toFixed(6)})]}),w.jsxs(Sn,{children:[w.jsx(Cn,{children:"Długość geograficzna:"}),w.jsx(Nn,{children:s.lng.toFixed(6)})]})]}),m&&w.jsx(Bn,{theme:o,children:m}),p&&w.jsx(An,{theme:o,children:p})]})}const Mn=p.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`,Ln=p.h1`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`,En=p.form`
  background: ${e=>e.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${e=>e.theme.shadow};
`,Wn=p.div`
  margin-bottom: 2rem;
`,Dn=p.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${e=>e.theme.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`,On=p.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`,In=p.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`,Fn=p.label`
  font-weight: 600;
  color: ${e=>e.theme.text};
  font-size: 0.875rem;
`,_n=p.input`
  padding: 1rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
    box-shadow: 0 0 0 3px ${e=>e.theme.primary}20;
  }
  
  &::placeholder {
    color: ${e=>e.theme.textSecondary};
  }
`,Rn=p.textarea`
  padding: 1rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 120px;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
    box-shadow: 0 0 0 3px ${e=>e.theme.primary}20;
  }
  
  &::placeholder {
    color: ${e=>e.theme.textSecondary};
  }
`,Zn=p.select`
  padding: 1rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
    box-shadow: 0 0 0 3px ${e=>e.theme.primary}20;
  }
`,Hn=p.div`
  border: 2px dashed ${e=>e.theme.border};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${e=>e.theme.primary};
    background: ${e=>e.theme.primary}05;
  }
`,Un=p.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${e=>e.theme.textSecondary};
`,Kn=p.div`
  color: ${e=>e.theme.textSecondary};
  margin-bottom: 0.5rem;
`,Yn=p.div`
  font-size: 0.875rem;
  color: ${e=>e.theme.textSecondary};
`,Vn=p.div`
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  background: ${e=>e.theme.background};
  border: 2px solid ${e=>e.theme.border};
  margin: 1rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
`,qn=p.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`,Gn=p.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${e=>e.selected?e.theme.primary:e.theme.background};
  color: ${e=>e.selected?"white":e.theme.text};
  border: 2px solid ${e=>e.selected?e.theme.primary:e.theme.border};
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${e=>e.theme.primary};
    background: ${e=>(e.selected,e.theme.primary)}10;
  }
`,Jn=p.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`,Xn=p.button`
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background: ${e=>e.theme.gradient};
    color: white;
    
    &:hover {
      background: ${e=>e.theme.gradientHover};
      transform: translateY(-2px);
      box-shadow: ${e=>e.theme.shadowHover};
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }
  
  &.secondary {
    background: ${e=>e.theme.background};
    color: ${e=>e.theme.text};
    border: 2px solid ${e=>e.theme.border};
    
    &:hover {
      background: ${e=>e.theme.border};
    }
  }
`,Qn=p.div`
  color: ${e=>e.theme.error};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;function es({theme:e}){const{user:t,updateUser:r}=N(),o=a(),[n,s]=i.useState({name:"",description:"",category:"",address:"",city:"",postalCode:"",phone:"",email:"",website:"",openingHours:"",deliveryOptions:[],paymentMethods:[]}),[d,c]=i.useState(null),[l,m]=i.useState(null),[h,p]=i.useState({}),[x,u]=i.useState(!1),g=e=>{const{name:t,value:r}=e.target;s({...n,[t]:r}),h[t]&&p({...h,[t]:""})};return w.jsxs(Mn,{children:[w.jsx(Ln,{children:"Dodaj nowy sklep"}),w.jsxs(En,{onSubmit:async e=>{if(e.preventDefault(),(()=>{const e={};return n.name.trim()||(e.name="Nazwa sklepu jest wymagana"),n.description.trim()||(e.description="Opis sklepu jest wymagany"),n.category||(e.category="Kategoria jest wymagana"),n.address.trim()||(e.address="Adres jest wymagany"),n.city.trim()||(e.city="Miasto jest wymagane"),n.postalCode.trim()||(e.postalCode="Kod pocztowy jest wymagany"),n.phone.trim()||(e.phone="Telefon jest wymagany"),n.email.trim()||(e.email="Email jest wymagany"),0===n.deliveryOptions.length&&(e.deliveryOptions="Wybierz przynajmniej jedną opcję dostawy"),0===n.paymentMethods.length&&(e.paymentMethods="Wybierz przynajmniej jedną metodę płatności"),p(e),0===Object.keys(e).length})()){u(!0);try{const e="http://localhost:5000",a=localStorage.getItem("token"),l={name:n.name,description:n.description,categories:[n.category],address:{street:n.address,city:n.city,postalCode:n.postalCode},location:n.city,coordinates:d,phone:n.phone,email:n.email,website:n.website,openingHours:n.openingHours,deliveryOptions:n.deliveryOptions.map(e=>({type:e,description:`Dostawa ${e}`,cost:0})),paymentMethods:n.paymentMethods},h=await fetch(`${e}/api/shops`,{method:"POST",headers:{Authorization:`Bearer ${a}`,"Content-Type":"application/json"},body:JSON.stringify(l)});if(!h.ok){const e=await h.json();throw new Error(e.error||"Nie udało się utworzyć sklepu")}const p=await h.json();try{const t=await fetch(`${e}/api/users/profile`,{headers:{Authorization:`Bearer ${a}`,"Content-Type":"application/json"}});if(t.ok){const e=await t.json();r&&r(e)}}catch(i){if(r&&p._id){const e={...t,shops:[...t.shops||[],p._id]};r(e)}}u(!1),alert("✅ Sklep został dodany pomyślnie!"),s({name:"",description:"",category:"",address:"",city:"",postalCode:"",phone:"",email:"",website:"",openingHours:"",deliveryOptions:[],paymentMethods:[]}),m(null),c(null),o("/shop-management")}catch(a){u(!1),alert("❌ Błąd podczas tworzenia sklepu: "+a.message)}}},children:[w.jsxs(Wn,{children:[w.jsx(Dn,{children:"🏪 Podstawowe informacje"}),w.jsxs(On,{children:[w.jsxs(In,{children:[w.jsx(Fn,{children:"Nazwa sklepu *"}),w.jsx(_n,{type:"text",name:"name",value:n.name,onChange:g,placeholder:"Wprowadź nazwę sklepu"}),h.name&&w.jsx(Qn,{children:h.name})]}),w.jsxs(In,{children:[w.jsx(Fn,{children:"Kategoria *"}),w.jsxs(Zn,{name:"category",value:n.category,onChange:g,children:[w.jsx("option",{value:"",children:"Wybierz kategorię"}),["Elektronika","Odzież i moda","Książki i multimedia","Sport i rekreacja","Dom i ogród","Motoryzacja","Zdrowie i uroda","Zabawki i gry","Spożywcze","Inne"].map(e=>w.jsx("option",{value:e,children:e},e))]}),h.category&&w.jsx(Qn,{children:h.category})]})]}),w.jsxs(In,{children:[w.jsx(Fn,{children:"Opis sklepu *"}),w.jsx(Rn,{name:"description",value:n.description,onChange:g,placeholder:"Opisz swój sklep, oferowane produkty i usługi..."}),h.description&&w.jsx(Qn,{children:h.description})]})]}),w.jsxs(Wn,{children:[w.jsx(Dn,{children:"📍 Lokalizacja i dane kontaktowe"}),w.jsxs(In,{children:[w.jsx(Fn,{children:"Wybierz lokalizację na mapie *"}),w.jsx(Tn,{onLocationSelect:(e,t)=>{c(e),t&&s(e=>({...e,address:t}))},initialAddress:n.address,theme:e})]}),w.jsxs(On,{children:[w.jsxs(In,{children:[w.jsx(Fn,{children:"Adres *"}),w.jsx(_n,{type:"text",name:"address",value:n.address,onChange:g,placeholder:"Ulica i numer"}),h.address&&w.jsx(Qn,{children:h.address})]}),w.jsxs(In,{children:[w.jsx(Fn,{children:"Miasto *"}),w.jsx(_n,{type:"text",name:"city",value:n.city,onChange:g,placeholder:"Nazwa miasta"}),h.city&&w.jsx(Qn,{children:h.city})]}),w.jsxs(In,{children:[w.jsx(Fn,{children:"Kod pocztowy *"}),w.jsx(_n,{type:"text",name:"postalCode",value:n.postalCode,onChange:g,placeholder:"00-000"}),h.postalCode&&w.jsx(Qn,{children:h.postalCode})]}),w.jsxs(In,{children:[w.jsx(Fn,{children:"Telefon *"}),w.jsx(_n,{type:"tel",name:"phone",value:n.phone,onChange:g,placeholder:"+48 123 456 789"}),h.phone&&w.jsx(Qn,{children:h.phone})]}),w.jsxs(In,{children:[w.jsx(Fn,{children:"Email *"}),w.jsx(_n,{type:"email",name:"email",value:n.email,onChange:g,placeholder:"kontakt@sklep.pl"}),h.email&&w.jsx(Qn,{children:h.email})]}),w.jsxs(In,{children:[w.jsx(Fn,{children:"Strona internetowa"}),w.jsx(_n,{type:"url",name:"website",value:n.website,onChange:g,placeholder:"https://www.sklep.pl"})]})]}),w.jsxs(In,{children:[w.jsx(Fn,{children:"Godziny otwarcia"}),w.jsx(_n,{type:"text",name:"openingHours",value:n.openingHours,onChange:g,placeholder:"np. Pon-Pt 9:00-18:00, Sob 9:00-14:00"})]})]}),w.jsxs(Wn,{children:[w.jsx(Dn,{children:"🚚 Opcje dostawy *"}),w.jsx(qn,{children:["Dostawa kurierem","Odbiór osobisty","Poczta polska","Paczkomaty","Dostawa w dniu zamówienia"].map(e=>w.jsx(Gn,{selected:n.deliveryOptions.includes(e),onClick:()=>(e=>{s({...n,deliveryOptions:n.deliveryOptions.includes(e)?n.deliveryOptions.filter(t=>t!==e):[...n.deliveryOptions,e]})})(e),children:e},e))}),h.deliveryOptions&&w.jsx(Qn,{children:h.deliveryOptions})]}),w.jsxs(Wn,{children:[w.jsx(Dn,{children:"💳 Metody płatności *"}),w.jsx(qn,{children:["Płatność online","Płatność przy odbiorze","Przelew bankowy","Karta kredytowa","PayPal","BLIK"].map(e=>w.jsx(Gn,{selected:n.paymentMethods.includes(e),onClick:()=>(e=>{s({...n,paymentMethods:n.paymentMethods.includes(e)?n.paymentMethods.filter(t=>t!==e):[...n.paymentMethods,e]})})(e),children:e},e))}),h.paymentMethods&&w.jsx(Qn,{children:h.paymentMethods})]}),w.jsxs(Wn,{children:[w.jsx(Dn,{children:"🖼️ Logo sklepu"}),w.jsxs(Hn,{children:[w.jsx("input",{type:"file",accept:"image/*",onChange:e=>{const t=e.target.files[0];t&&m({file:t,preview:URL.createObjectURL(t)})},style:{display:"none"},id:"logo-upload"}),w.jsxs("label",{htmlFor:"logo-upload",children:[w.jsx(Un,{children:"📷"}),w.jsx(Kn,{children:"Kliknij aby dodać logo"}),w.jsx(Yn,{children:"Format JPG/PNG, maksymalnie 2MB"})]})]}),l&&w.jsx(Vn,{children:w.jsx("img",{src:l.preview,alt:"Logo preview",style:{width:"100%",height:"100%",objectFit:"cover"}})})]}),w.jsxs(Jn,{children:[w.jsx(Xn,{type:"submit",className:"primary",disabled:x,children:x?"Dodawanie...":"Dodaj sklep"}),w.jsx(Xn,{type:"button",className:"secondary",onClick:()=>{window.confirm("Czy na pewno chcesz zresetować formularz?")&&(s({name:"",description:"",category:"",address:"",city:"",postalCode:"",phone:"",email:"",website:"",openingHours:"",deliveryOptions:[],paymentMethods:[]}),m(null),p({}))},children:"Resetuj"})]})]})]})}p.div`
  color: ${e=>e.theme.success};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;const ts=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`,rs=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`,is=p.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    text-align: center;
  }
`,os=p(o)`
  padding: 1rem 2rem;
  background: ${e=>e.theme.gradient};
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
`,as=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`,ns=p.div`
  background: ${e=>e.theme.surface};
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: ${e=>e.theme.shadow};
  text-align: center;
`,ss=p.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`,ds=p.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${e=>e.theme.primary};
  margin-bottom: 0.5rem;
`,cs=p.div`
  color: ${e=>e.theme.textSecondary};
  font-size: 0.875rem;
`,ls=p.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${e=>e.theme.border};
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`,ms=p.button`
  padding: 1rem 2rem;
  background: ${e=>e.active?e.theme.primary:"transparent"};
  color: ${e=>e.active?"white":e.theme.text};
  border: none;
  border-radius: 12px 12px 0 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.active?e.theme.primary:e.theme.border};
  }
`,hs=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`,ps=p.div`
  background: ${e=>e.theme.surface};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: ${e=>e.theme.shadow};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
`,xs=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,us=p.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${e=>e.theme.text};
  margin: 0;
`,gs=p.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${e=>"active"===e.status?e.theme.success:e.theme.warning};
  color: white;
`,js=p.div`
  margin-bottom: 1rem;
`,ys=p.p`
  color: ${e=>e.theme.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`,bs=p.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
`,fs=p.div`
  text-align: center;
`,ws=p.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${e=>e.theme.primary};
`,ks=p.div`
  font-size: 0.75rem;
  color: ${e=>e.theme.textSecondary};
`,vs=p.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`,zs=p.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background: ${e=>e.theme.primary};
    color: white;
    
    &:hover {
      background: ${e=>e.theme.primary}dd;
    }
  }
  
  &.secondary {
    background: ${e=>e.theme.background};
    color: ${e=>e.theme.text};
    border: 2px solid ${e=>e.theme.border};
    
    &:hover {
      background: ${e=>e.theme.border};
    }
  }
  
  &.danger {
    background: ${e=>e.theme.error};
    color: white;
    
    &:hover {
      background: ${e=>e.theme.error}dd;
    }
  }
`,$s=p.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${e=>e.theme.textSecondary};
`,Ss=p.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${e=>e.theme.textSecondary};
`,Cs=p.div`
  background: ${e=>e.theme.error}20;
  color: ${e=>e.theme.error};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid ${e=>e.theme.error}40;
`;function Ns(){const{user:e}=N(),[t,r]=i.useState("overview"),[a,n]=i.useState([]),[s,d]=i.useState(!0),[c,l]=i.useState(null),[m,h]=i.useState({totalShops:0,activeShops:0,totalProducts:0,totalSales:0,totalViews:0,totalOrders:0});i.useEffect(()=>{p()},[]);const p=async()=>{try{d(!0);const e="http://localhost:5000",t=localStorage.getItem("token"),r=await fetch(`${e}/api/shops/user`,{headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"}});if(!r.ok)throw new Error("Nie udało się pobrać sklepów");const i=await r.json();n(i);const o=i.reduce((e,t)=>e+(t.stats?.totalProducts||0),0),a=i.reduce((e,t)=>e+(t.stats?.totalSales||0),0),s=i.reduce((e,t)=>e+(t.stats?.totalViews||0),0),c=i.filter(e=>e.isActive).length;h({totalShops:i.length,activeShops:c,totalProducts:o,totalSales:a,totalViews:s,totalOrders:i.reduce((e,t)=>e+(t.stats?.totalOrders||0),0)})}catch(e){l(e.message)}finally{d(!1)}};return s?w.jsx(ts,{children:w.jsxs(Ss,{children:[w.jsx("div",{style:{fontSize:"2rem",marginBottom:"1rem"},children:"⏳"}),w.jsx("p",{children:"Ładowanie panelu zarządzania..."})]})}):w.jsxs(ts,{children:[w.jsxs(rs,{children:[w.jsx(is,{children:"Zarządzanie sklepami"}),w.jsx(os,{to:"/shop-create",children:"🏪 Dodaj nowy sklep"})]}),c&&w.jsx(Cs,{children:c}),w.jsxs(ls,{children:[w.jsx(ms,{active:"overview"===t,onClick:()=>r("overview"),children:"📊 Przegląd"}),w.jsx(ms,{active:"products"===t,onClick:()=>r("products"),children:"📦 Produkty"}),w.jsx(ms,{active:"orders"===t,onClick:()=>r("orders"),children:"📋 Zamówienia"}),w.jsx(ms,{active:"analytics"===t,onClick:()=>r("analytics"),children:"📈 Analityka"})]}),0===a.length&&"overview"===t?w.jsxs($s,{children:[w.jsx("div",{style:{fontSize:"4rem",marginBottom:"1rem"},children:"🏪"}),w.jsx("h3",{children:"Nie masz jeszcze żadnych sklepów"}),w.jsx("p",{children:"Utwórz swój pierwszy sklep, aby rozpocząć sprzedaż"}),w.jsx(os,{to:"/shop-create",style:{display:"inline-block",marginTop:"1rem"},children:"🏪 Utwórz pierwszy sklep"})]}):w.jsxs(w.Fragment,{children:["overview"===t&&w.jsxs(w.Fragment,{children:[w.jsxs(as,{children:[w.jsxs(ns,{children:[w.jsx(ss,{children:"🏪"}),w.jsx(ds,{children:m.totalShops}),w.jsx(cs,{children:"Wszystkie sklepy"})]}),w.jsxs(ns,{children:[w.jsx(ss,{children:"✅"}),w.jsx(ds,{children:m.activeShops}),w.jsx(cs,{children:"Aktywne sklepy"})]}),w.jsxs(ns,{children:[w.jsx(ss,{children:"📦"}),w.jsx(ds,{children:m.totalProducts}),w.jsx(cs,{children:"Produktów"})]}),w.jsxs(ns,{children:[w.jsx(ss,{children:"💰"}),w.jsxs(ds,{children:[m.totalSales.toLocaleString()," zł"]}),w.jsx(cs,{children:"Całkowita sprzedaż"})]}),w.jsxs(ns,{children:[w.jsx(ss,{children:"👁️"}),w.jsx(ds,{children:m.totalViews.toLocaleString()}),w.jsx(cs,{children:"Wyświetlenia"})]}),w.jsxs(ns,{children:[w.jsx(ss,{children:"📋"}),w.jsx(ds,{children:m.totalOrders}),w.jsx(cs,{children:"Zamówienia"})]})]}),w.jsx(hs,{children:a.map(e=>w.jsxs(ps,{children:[w.jsxs(xs,{children:[w.jsx(us,{children:e.name}),w.jsx(gs,{status:e.isActive?"active":"inactive",children:e.isActive?"Aktywny":"Nieaktywny"})]}),w.jsxs(js,{children:[w.jsx(ys,{children:e.description}),w.jsxs(bs,{children:[w.jsxs(fs,{children:[w.jsx(ws,{children:e.stats?.totalProducts||0}),w.jsx(ks,{children:"Produktów"})]}),w.jsxs(fs,{children:[w.jsx(ws,{children:e.stats?.totalViews||0}),w.jsx(ks,{children:"Wyświetleń"})]})]})]}),w.jsxs(vs,{children:[w.jsx(zs,{className:"primary",as:o,to:`/shop/${e._id}`,children:"👁️ Podgląd"}),w.jsx(zs,{className:"secondary",as:o,to:`/shop/${e._id}/edit`,children:"✏️ Edytuj"}),w.jsx(zs,{className:"danger",onClick:()=>(async e=>{if(window.confirm("Czy na pewno chcesz usunąć ten sklep? Ta operacja jest nieodwracalna."))try{const t="http://localhost:5000",r=localStorage.getItem("token");if(!(await fetch(`${t}/api/shops/${e}`,{method:"DELETE",headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"}})).ok)throw new Error("Nie udało się usunąć sklepu");p()}catch(t){l(t.message)}})(e._id),children:"🗑️ Usuń"})]})]},e._id))})]}),"products"===t&&w.jsxs("div",{children:[w.jsx("h2",{children:"Zarządzanie produktami"}),w.jsx("p",{children:"Ta funkcjonalność będzie dostępna wkrótce."})]}),"orders"===t&&w.jsxs("div",{children:[w.jsx("h2",{children:"Zamówienia"}),w.jsx("p",{children:"Ta funkcjonalność będzie dostępna wkrótce."})]}),"analytics"===t&&w.jsxs("div",{children:[w.jsx("h2",{children:"Analityka"}),w.jsx("p",{children:"Ta funkcjonalność będzie dostępna wkrótce."})]})]})]})}const Ps=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`,Bs=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`,As=p.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    text-align: center;
  }
`,Ts=p(o)`
  padding: 1rem 2rem;
  background: ${e=>e.theme.gradient};
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
`,Ms=p.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`,Ls=p.input`
  flex: 1;
  min-width: 200px;
  padding: 0.75rem 1rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
  }
`,Es=p.select`
  padding: 0.75rem 1rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 8px;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  font-size: 0.875rem;
  cursor: pointer;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
  }
`,Ws=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`,Ds=p.div`
  background: ${e=>e.theme.surface};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: ${e=>e.theme.shadow};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
`,Os=p.div`
  width: 100%;
  height: 200px;
  background: ${e=>e.theme.background};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin-bottom: 1rem;
  border: 2px solid ${e=>e.theme.border};
`,Is=p.div`
  margin-bottom: 1rem;
`,Fs=p.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${e=>e.theme.text};
  margin-bottom: 0.5rem;
`,_s=p.p`
  color: ${e=>e.theme.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 1rem;
  line-height: 1.4;
`,Rs=p.div`
  font-size: 1.25rem;
  font-weight: 800;
  color: ${e=>e.theme.primary};
  margin-bottom: 0.5rem;
`,Zs=p.div`
  font-size: 0.75rem;
  color: ${e=>e.theme.textSecondary};
  margin-bottom: 1rem;
`,Hs=p.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`,Us=p.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background: ${e=>e.theme.primary};
    color: white;
    
    &:hover {
      background: ${e=>e.theme.primary}dd;
    }
  }
  
  &.secondary {
    background: ${e=>e.theme.background};
    color: ${e=>e.theme.text};
    border: 2px solid ${e=>e.theme.border};
    
    &:hover {
      background: ${e=>e.theme.border};
    }
  }
  
  &.danger {
    background: ${e=>e.theme.error};
    color: white;
    
    &:hover {
      background: ${e=>e.theme.error}dd;
    }
  }
`,Ks=p.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${e=>e.theme.textSecondary};
`,Ys=p.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${e=>e.theme.textSecondary};
`,Vs=p.div`
  background: ${e=>e.theme.error}20;
  color: ${e=>e.theme.error};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid ${e=>e.theme.error}40;
`,qs=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`,Gs=p.div`
  background: ${e=>e.theme.surface};
  padding: 1rem;
  border-radius: 12px;
  box-shadow: ${e=>e.theme.shadow};
  text-align: center;
`,Js=p.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${e=>e.theme.primary};
  margin-bottom: 0.25rem;
`,Xs=p.div`
  color: ${e=>e.theme.textSecondary};
  font-size: 0.75rem;
`;function Qs(){const{user:e}=N(),[t,r]=i.useState([]),[a,n]=i.useState(!0),[s,d]=i.useState(null),[c,l]=i.useState(""),[m,h]=i.useState("all"),[p,x]=i.useState("all"),[u,g]=i.useState([]),[j,y]=i.useState({totalProducts:0,activeProducts:0,totalValue:0,averagePrice:0});i.useEffect(()=>{b(),f()},[]);const b=async()=>{try{const e="http://localhost:5000",t=localStorage.getItem("token"),r=await fetch(`${e}/api/shops/user`,{headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"}});if(r.ok){const e=await r.json();g(e)}}catch(e){}},f=async()=>{try{n(!0);const e="http://localhost:5000",t=localStorage.getItem("token"),i=await fetch(`${e}/api/products/user`,{headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"}});if(!i.ok)throw new Error("Nie udało się pobrać produktów");const o=await i.json();r(o);const a=o.reduce((e,t)=>e+(t.price||0),0),s=o.length>0?a/o.length:0;y({totalProducts:o.length,activeProducts:o.filter(e=>!1!==e.isActive).length,totalValue:a,averagePrice:s})}catch(e){d(e.message)}finally{n(!1)}},k=t.filter(e=>{const t=e.name.toLowerCase().includes(c.toLowerCase())||e.description.toLowerCase().includes(c.toLowerCase()),r="all"===m||e.category===m,i="all"===p||e.shop===p;return t&&r&&i}),v=[...new Set(t.map(e=>e.category))];return a?w.jsx(Ps,{children:w.jsxs(Ys,{children:[w.jsx("div",{style:{fontSize:"2rem",marginBottom:"1rem"},children:"⏳"}),w.jsx("p",{children:"Ładowanie produktów..."})]})}):w.jsxs(Ps,{children:[w.jsxs(Bs,{children:[w.jsx(As,{children:"Zarządzanie produktami"}),w.jsx(Ts,{to:"/product-create",children:"📦 Dodaj nowy produkt"})]}),s&&w.jsx(Vs,{children:s}),w.jsxs(qs,{children:[w.jsxs(Gs,{children:[w.jsx(Js,{children:j.totalProducts}),w.jsx(Xs,{children:"Wszystkie produkty"})]}),w.jsxs(Gs,{children:[w.jsx(Js,{children:j.activeProducts}),w.jsx(Xs,{children:"Aktywne produkty"})]}),w.jsxs(Gs,{children:[w.jsxs(Js,{children:[j.totalValue.toLocaleString()," zł"]}),w.jsx(Xs,{children:"Wartość produktów"})]}),w.jsxs(Gs,{children:[w.jsxs(Js,{children:[j.averagePrice.toFixed(2)," zł"]}),w.jsx(Xs,{children:"Średnia cena"})]})]}),w.jsxs(Ms,{children:[w.jsx(Ls,{type:"text",placeholder:"Szukaj produktów...",value:c,onChange:e=>l(e.target.value)}),w.jsxs(Es,{value:m,onChange:e=>h(e.target.value),children:[w.jsx("option",{value:"all",children:"Wszystkie kategorie"}),v.map(e=>w.jsx("option",{value:e,children:e},e))]}),w.jsxs(Es,{value:p,onChange:e=>x(e.target.value),children:[w.jsx("option",{value:"all",children:"Wszystkie sklepy"}),u.map(e=>w.jsx("option",{value:e._id,children:e.name},e._id))]})]}),0===k.length?w.jsxs(Ks,{children:[w.jsx("div",{style:{fontSize:"4rem",marginBottom:"1rem"},children:"📦"}),w.jsx("h3",{children:"Nie znaleziono produktów"}),w.jsx("p",{children:"Spróbuj zmienić kryteria wyszukiwania lub dodaj nowy produkt"}),w.jsx(Ts,{to:"/product-create",style:{display:"inline-block",marginTop:"1rem"},children:"📦 Dodaj pierwszy produkt"})]}):w.jsx(Ws,{children:k.map(e=>w.jsxs(Ds,{children:[w.jsx(Os,{children:e.images&&e.images.length>0?w.jsx("img",{src:e.images[0],alt:e.name,style:{width:"100%",height:"100%",objectFit:"cover",borderRadius:"10px"}}):"📦"}),w.jsxs(Is,{children:[w.jsx(Fs,{children:e.name}),w.jsx(_s,{children:e.description}),w.jsxs(Rs,{children:[e.price?.toFixed(2)," zł"]}),w.jsxs(Zs,{children:["Kategoria: ",e.category]})]}),w.jsxs(Hs,{children:[w.jsx(Us,{className:"primary",as:o,to:`/product/${e._id}`,children:"👁️ Podgląd"}),w.jsx(Us,{className:"secondary",as:o,to:`/product/${e._id}/edit`,children:"✏️ Edytuj"}),w.jsx(Us,{className:"danger",onClick:()=>(async e=>{if(window.confirm("Czy na pewno chcesz usunąć ten produkt? Ta operacja jest nieodwracalna."))try{const t="http://localhost:5000",r=localStorage.getItem("token");if(!(await fetch(`${t}/api/products/${e}`,{method:"DELETE",headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"}})).ok)throw new Error("Nie udało się usunąć produktu");f()}catch(t){d(t.message)}})(e._id),children:"🗑️ Usuń"})]})]},e._id))})]})}const ed=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`,td=p.h1`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`,rd=p.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${e=>e.theme.border};
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`,id=p.button`
  padding: 1rem 2rem;
  background: ${e=>e.active?e.theme.primary:"transparent"};
  color: ${e=>e.active?"white":e.theme.text};
  border: none;
  border-radius: 12px 12px 0 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.active?e.theme.primary:e.theme.border};
  }
`,od=p.div`
  background: ${e=>e.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${e=>e.theme.shadow};
  margin-bottom: 2rem;
`,ad=p.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${e=>e.theme.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`,nd=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`,sd=p.div`
  border: 3px solid ${e=>e.selected?e.theme.primary:e.theme.border};
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${e=>e.selected?e.theme.primary+"10":e.theme.background};
  
  &:hover {
    border-color: ${e=>e.theme.primary};
    transform: translateY(-2px);
  }
`,dd=p.div`
  width: 100%;
  height: 200px;
  background: ${e=>e.theme.background};
  border-radius: 12px;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
  border: 2px solid ${e=>e.theme.border};
`,cd=p.div`
  height: 40px;
  background: ${e=>e.theme.primary};
  display: flex;
  align-items: center;
  padding: 0 1rem;
`,ld=p.div`
  position: absolute;
  left: 0;
  top: 40px;
  width: 60px;
  height: calc(100% - 40px);
  background: ${e=>e.theme.surface};
  border-right: 1px solid ${e=>e.theme.border};
`,md=p.div`
  position: absolute;
  left: 60px;
  top: 40px;
  right: 0;
  height: calc(100% - 40px);
  background: ${e=>e.theme.background};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: ${e=>e.theme.textSecondary};
`,hd=p.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${e=>e.theme.text};
  margin-bottom: 0.5rem;
`,pd=p.p`
  color: ${e=>e.theme.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`,xd=p.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`,ud=p.span`
  padding: 0.25rem 0.5rem;
  background: ${e=>e.theme.primary}20;
  color: ${e=>e.theme.primary};
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`,gd=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`,jd=p.div`
  border: 3px solid ${e=>e.selected?e.theme.primary:e.theme.border};
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${e=>e.selected?e.theme.primary+"10":e.theme.background};
  
  &:hover {
    border-color: ${e=>e.theme.primary};
    transform: translateY(-2px);
  }
`,yd=p.div`
  width: 100%;
  height: 120px;
  border-radius: 12px;
  margin-bottom: 1rem;
  background: ${e=>e.gradient||e.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`,bd=p.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${e=>e.theme.text};
  margin-bottom: 0.5rem;
`,fd=p.p`
  color: ${e=>e.theme.textSecondary};
  font-size: 0.875rem;
`,wd=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`,kd=p.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid ${e=>e.selected?e.theme.primary:e.theme.border};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${e=>e.theme.primary};
    background: ${e=>e.theme.primary}05;
  }
`,vd=p.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${e=>e.color};
  border: 2px solid ${e=>e.theme.border};
`,zd=p.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${e=>e.theme.text};
  text-align: center;
`,$d=p.button`
  padding: 1rem 2rem;
  background: ${e=>e.theme.gradient};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`,Sd=p.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`,Cd=p.div`
  background: ${e=>e.theme.success}20;
  color: ${e=>e.theme.success};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid ${e=>e.theme.success}40;
`;function Nd({theme:e,onSettingsSaved:t}){const{user:r}=N(),[o,a]=i.useState("portal");i.useEffect(()=>{const e=localStorage.getItem("token");localStorage.getItem("user");r&&e?r._id||p("Błąd: Brak ID użytkownika. Zaloguj się ponownie."):p("Błąd: Nie jesteś zalogowany. Zaloguj się ponownie.")},[r,e]);const[n,s]=i.useState("modern"),[d,c]=i.useState("default"),[l,m]=i.useState({primary:"#00D4AA",secondary:"#8B5CF6",accent:"#F59E0B"}),[h,p]=i.useState(""),x=e=>{switch(e){case"modern":return w.jsxs(dd,{children:[w.jsx(cd,{}),w.jsx(md,{children:"Nowoczesny layout"})]});case"classic":return w.jsxs(dd,{children:[w.jsx(cd,{}),w.jsx(ld,{}),w.jsx(md,{children:"Klasyczny layout"})]});case"compact":return w.jsxs(dd,{children:[w.jsx(cd,{style:{height:"30px"}}),w.jsx(md,{style:{top:"30px",height:"calc(100% - 30px)"},children:"Kompaktowy layout"})]});case"elegant":return w.jsxs(dd,{children:[w.jsx(cd,{style:{background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}}),w.jsx(md,{style:{background:"linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"},children:"Elegancki layout"})]});default:return w.jsx(dd,{children:"Podgląd"})}};return w.jsxs(ed,{children:[w.jsx(td,{children:"Dostosowywanie wyglądu"}),h&&w.jsx(Cd,{children:h}),w.jsxs(rd,{children:[w.jsx(id,{active:"portal"===o,onClick:()=>a("portal"),children:"🌐 Portal"}),w.jsx(id,{active:"shop"===o,onClick:()=>a("shop"),children:"🏪 Sklep"})]}),w.jsxs(od,{children:[w.jsx(ad,{children:"📐 Layout"}),w.jsx(nd,{children:[{id:"modern",name:"Nowoczesny",description:"Czysty i minimalistyczny design z dużą ilością białej przestrzeni",features:["Responsywny","Minimalistyczny","Szybki"],preview:"modern"},{id:"classic",name:"Klasyczny",description:"Tradycyjny layout z bocznym menu i dużą nawigacją",features:["Boczne menu","Tradycyjny","Przejrzysty"],preview:"classic"},{id:"compact",name:"Kompaktowy",description:"Optymalizowany dla maksymalnej wydajności i szybkiego dostępu",features:["Kompaktowy","Szybki","Wydajny"],preview:"compact"},{id:"elegant",name:"Elegancki",description:"Luksusowy design z zaawansowanymi animacjami i efektami",features:["Animacje","Luksusowy","Zaawansowany"],preview:"elegant"}].map(e=>w.jsxs(sd,{selected:n===e.id,onClick:()=>s(e.id),children:[x(e.preview),w.jsx(hd,{children:e.name}),w.jsx(pd,{children:e.description}),w.jsx(xd,{children:e.features.map(e=>w.jsx(ud,{children:e},e))})]},e.id))})]}),w.jsxs(od,{children:[w.jsx(ad,{children:"🎨 Motyw kolorystyczny"}),w.jsx(gd,{children:[{id:"default",name:"Domyślny",description:"Standardowy motyw z zielono-fioletowym gradientem",gradient:"linear-gradient(135deg, #00D4AA 0%, #8B5CF6 100%)",color:"#00D4AA"},{id:"ocean",name:"Ocean",description:"Spokojne odcienie niebieskiego i turkusu",gradient:"linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)",color:"#0EA5E9"},{id:"sunset",name:"Zachód słońca",description:"Ciepłe kolory pomarańczowego i różu",gradient:"linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)",color:"#F59E0B"},{id:"forest",name:"Las",description:"Naturalne zielenie i brązy",gradient:"linear-gradient(135deg, #10B981 0%, #8B5A2B 100%)",color:"#10B981"},{id:"midnight",name:"Północ",description:"Ciemne odcienie granatu i fioletu",gradient:"linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%)",color:"#1E40AF"},{id:"coral",name:"Koral",description:"Żywe kolory koralowe i różowe",gradient:"linear-gradient(135deg, #F97316 0%, #E11D48 100%)",color:"#F97316"}].map(e=>w.jsxs(jd,{selected:d===e.id,onClick:()=>c(e.id),children:[w.jsx(yd,{gradient:e.gradient,color:e.color,children:e.name}),w.jsx(bd,{children:e.name}),w.jsx(fd,{children:e.description})]},e.id))})]}),w.jsxs(od,{children:[w.jsx(ad,{children:"🎨 Kolory niestandardowe"}),w.jsx(wd,{children:[{name:"Zielony",color:"#10B981"},{name:"Niebieski",color:"#3B82F6"},{name:"Fioletowy",color:"#8B5CF6"},{name:"Pomarańczowy",color:"#F59E0B"},{name:"Różowy",color:"#EC4899"},{name:"Czerwony",color:"#EF4444"},{name:"Turkusowy",color:"#06B6D4"},{name:"Żółty",color:"#EAB308"}].map(e=>w.jsxs(kd,{selected:l.primary===e.color,onClick:()=>m(t=>({...t,primary:e.color})),children:[w.jsx(vd,{color:e.color}),w.jsx(zd,{children:e.name})]},e.name))})]}),w.jsxs(Sd,{children:[w.jsx($d,{onClick:async()=>{try{const e="http://localhost:5000",i=localStorage.getItem("token");if(!i)return p("Błąd: Nie jesteś zalogowany. Zaloguj się ponownie."),void setTimeout(()=>p(""),5e3);if(!r||!r._id)return p("Błąd: Brak ID użytkownika. Zaloguj się ponownie."),void setTimeout(()=>p(""),5e3);const a={layout:n,theme:d,colors:l,type:o},s=await fetch(`${e}/api/users/layout-settings`,{method:"POST",headers:{Authorization:`Bearer ${i}`,"Content-Type":"application/json"},body:JSON.stringify(a)});if(!s.ok){const e=await s.json();throw new Error(e.error||"Nie udało się zapisać ustawień")}await s.json();p("✅ Ustawienia zostały zapisane pomyślnie!"),setTimeout(()=>p(""),3e3),t&&t()}catch(e){p("❌ Błąd podczas zapisywania ustawień: "+e.message),setTimeout(()=>p(""),5e3)}},children:"💾 Zapisz ustawienia"}),w.jsx($d,{onClick:()=>{s("modern"),c("default"),m({primary:"#00D4AA",secondary:"#8B5CF6",accent:"#F59E0B"})},style:{background:"#6B7280"},children:"🔄 Resetuj"}),w.jsx($d,{onClick:()=>{alert("Test button działa!"),p("Test: Przycisk działa poprawnie!")},style:{background:"#F59E0B"},children:"🧪 Test przycisku"}),w.jsx($d,{onClick:()=>{alert(`Layout: ${n}\nTheme: ${d}\nUser: ${r?._id}`)},style:{background:"#8B5CF6"},children:"🔍 Debug state"})]})]})}const Pd=p.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`,Bd=p.h1`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
`,Ad=p.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
  }
`,Td=p.div`
  background: ${e=>e.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${e=>e.theme.shadow};
  height: fit-content;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 12px;
  }
`,Md=p.div`
  text-align: center;
  margin-bottom: 2rem;
  
  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
  }
`,Ld=p.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${e=>e.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  margin: 0 auto 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }
`,Ed=p.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${e=>e.theme.text};
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`,Wd=p.div`
  color: ${e=>e.theme.textSecondary};
  font-size: 0.875rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`,Dd=p.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`,Od=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${e=>e.theme.background};
  border-radius: 12px;
  
  @media (max-width: 768px) {
    padding: 0.875rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    border-radius: 8px;
  }
`,Id=p.div`
  color: ${e=>e.theme.textSecondary};
  font-size: 0.875rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`,Fd=p.div`
  font-weight: 600;
  color: ${e=>e.theme.text};
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`,_d=p.div`
  background: ${e=>e.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${e=>e.theme.shadow};
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 12px;
  }
`,Rd=p.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${e=>e.theme.border};
  padding-bottom: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.25rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
`,Zd=p.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${e=>e.active?e.theme.primary:"transparent"};
  color: ${e=>e.active?"white":e.theme.text};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  
  &:hover {
    background: ${e=>(e.active,e.theme.primary)}10;
  }
  
  @media (max-width: 768px) {
    padding: 0.625rem 1.25rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    border-radius: 6px;
  }
`,Hd=p.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (max-width: 480px) {
    gap: 1rem;
  }
`,Ud=p.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`,Kd=p.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`,Yd=p.label`
  font-weight: 600;
  color: ${e=>e.theme.text};
  font-size: 0.875rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`,Vd=p.input`
  padding: 1rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
    box-shadow: 0 0 0 3px ${e=>e.theme.primary}20;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
`,qd=p.textarea`
  padding: 1rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
    box-shadow: 0 0 0 3px ${e=>e.theme.primary}20;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 0.95rem;
    min-height: 100px;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
    min-height: 80px;
  }
`,Gd=p.button`
  padding: 1rem 2rem;
  background: ${e=>e.theme.gradient};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 1.75rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
`,Jd=p.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`,Xd=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: ${e=>e.theme.background};
  border-radius: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadow};
  }
`,Qd=p.div`
  flex: 1;
`,ec=p.div`
  font-weight: 600;
  color: ${e=>e.theme.text};
  margin-bottom: 0.25rem;
`,tc=p.div`
  font-size: 0.875rem;
  color: ${e=>e.theme.textSecondary};
`,rc=p.div`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  
  ${e=>{switch(e.status){case"completed":return"\n          background: #10B98120;\n          color: #10B981;\n        ";case"processing":return"\n          background: #F59E0B20;\n          color: #F59E0B;\n        ";case"shipped":return"\n          background: #3B82F620;\n          color: #3B82F6;\n        ";default:return`\n          background: ${e.theme.border};\n          color: ${e.theme.textSecondary};\n        `}}}
`,ic=p.div`
  font-weight: 600;
  color: ${e=>e.theme.text};
  margin-left: 1rem;
`,oc=p.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${e=>e.theme.textSecondary};
`,ac=p.div`
  background: ${e=>e.theme.background};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`,nc=p.h4`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${e=>e.theme.text};
`,sc=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid ${e=>e.theme.border};
  
  &:last-child {
    border-bottom: none;
  }
`,dc=p.div`
  color: ${e=>e.theme.text};
`,cc=p.div`
  color: ${e=>e.theme.textSecondary};
  font-size: 0.875rem;
`;function lc(){const{user:e,isAuthenticated:t}=N(),[r,o]=i.useState("personal"),[a,n]=i.useState({firstName:"",lastName:"",email:"",phone:"",bio:"",location:"",interests:[]}),[s,d]=i.useState([]),[c,l]=i.useState(!0),[m,h]=i.useState(!1),[p,x]=i.useState(""),[u,g]=i.useState("");i.useEffect(()=>{t&&e&&j()},[t,e]);const j=async()=>{try{l(!0);const e="http://localhost:5000",t=localStorage.getItem("token"),r=await fetch(`${e}/api/users/profile`,{headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"}});if(!r.ok)throw new Error("Nie udało się pobrać profilu użytkownika");const i=await r.json();n({firstName:i.firstName||"",lastName:i.lastName||"",email:i.email||"",phone:i.phone||"",bio:i.bio||"",location:i.location||"",interests:i.interests||[]}),l(!1)}catch(e){x(e.message),l(!1)}},y=e=>{const{name:t,value:r}=e.target;n({...a,[t]:r})},b=async()=>{try{const e="http://localhost:5000",t=localStorage.getItem("token"),r=await fetch(`${e}/api/users/profile`,{method:"PUT",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify(a)});if(!r.ok){const e=await r.json();throw new Error(e.error||"Nie udało się zaktualizować profilu")}h(!1),g("Profil został zaktualizowany pomyślnie!"),setTimeout(()=>g(""),3e3)}catch(e){x(e.message),setTimeout(()=>x(""),5e3)}},f=()=>{h(!1),j()};return c?w.jsx(Pd,{children:w.jsxs("div",{style:{textAlign:"center",padding:"4rem"},children:[w.jsx("div",{style:{fontSize:"2rem",marginBottom:"1rem"},children:"⏳"}),w.jsx("p",{children:"Ładowanie profilu..."})]})}):t?c?w.jsx(Pd,{children:w.jsxs("div",{style:{textAlign:"center",padding:"4rem"},children:[w.jsx("div",{style:{fontSize:"2rem",marginBottom:"1rem"},children:"⏳"}),w.jsx("p",{children:"Ładowanie profilu..."})]})}):w.jsxs(Pd,{children:[w.jsx(Bd,{children:"Profil użytkownika"}),p&&w.jsx("div",{style:{background:"#FEF2F2",color:"#DC2626",padding:"1rem",borderRadius:"8px",marginBottom:"1rem",border:"1px solid #FECACA"},children:p}),u&&w.jsx("div",{style:{background:"#F0FDF4",color:"#16A34A",padding:"1rem",borderRadius:"8px",marginBottom:"1rem",border:"1px solid #BBF7D0"},children:u}),w.jsxs(Ad,{children:[w.jsxs(Td,{children:[w.jsxs(Md,{children:[w.jsx(Ld,{children:"👤"}),w.jsxs(Ed,{children:[a.firstName," ",a.lastName]}),w.jsx(Wd,{children:a.email})]}),w.jsxs(Dd,{children:[w.jsxs(Od,{children:[w.jsx(Id,{children:"Zamówienia"}),w.jsx(Fd,{children:s.length})]}),w.jsxs(Od,{children:[w.jsx(Id,{children:"Dni aktywności"}),w.jsx(Fd,{children:"89"})]}),w.jsxs(Od,{children:[w.jsx(Id,{children:"Poziom"}),w.jsx(Fd,{children:"15"})]}),w.jsxs(Od,{children:[w.jsx(Id,{children:"Osiągnięcia"}),w.jsx(Fd,{children:"8/20"})]})]})]}),w.jsxs(_d,{children:[w.jsxs(Rd,{children:[w.jsx(Zd,{active:"personal"===r,onClick:()=>o("personal"),children:"Dane osobowe"}),w.jsx(Zd,{active:"orders"===r,onClick:()=>o("orders"),children:"Zamówienia"}),w.jsx(Zd,{active:"security"===r,onClick:()=>o("security"),children:"Bezpieczeństwo"})]}),"personal"===r&&w.jsxs(Hd,{children:[w.jsxs(Ud,{children:[w.jsxs(Kd,{children:[w.jsx(Yd,{children:"Imię"}),w.jsx(Vd,{type:"text",name:"firstName",value:a.firstName,onChange:y,disabled:!m,placeholder:"Wprowadź imię"})]}),w.jsxs(Kd,{children:[w.jsx(Yd,{children:"Nazwisko"}),w.jsx(Vd,{type:"text",name:"lastName",value:a.lastName,onChange:y,disabled:!m,placeholder:"Wprowadź nazwisko"})]}),w.jsxs(Kd,{children:[w.jsx(Yd,{children:"Email"}),w.jsx(Vd,{type:"email",name:"email",value:a.email,onChange:y,disabled:!m,placeholder:"Wprowadź email"})]}),w.jsxs(Kd,{children:[w.jsx(Yd,{children:"Telefon"}),w.jsx(Vd,{type:"tel",name:"phone",value:a.phone,onChange:y,disabled:!m,placeholder:"Wprowadź telefon"})]})]}),w.jsxs(Kd,{children:[w.jsx(Yd,{children:"O mnie"}),w.jsx(qd,{name:"bio",value:a.bio,onChange:y,disabled:!m,placeholder:"Napisz coś o sobie..."})]}),w.jsxs(Kd,{children:[w.jsx(Yd,{children:"Lokalizacja"}),w.jsx(Vd,{type:"text",name:"location",value:a.location,onChange:y,disabled:!m,placeholder:"Wprowadź lokalizację"})]}),m?w.jsxs("div",{style:{display:"flex",gap:"1rem",marginTop:"1rem"},children:[w.jsx(Gd,{onClick:b,children:"Zapisz zmiany"}),w.jsx(Gd,{onClick:f,style:{background:"#6B7280"},children:"Anuluj"})]}):w.jsx(Gd,{onClick:()=>h(!0),style:{marginTop:"1rem"},children:"Edytuj dane"})]}),"orders"===r&&w.jsx(Jd,{children:0===s.length?w.jsxs(oc,{children:[w.jsx("div",{style:{fontSize:"4rem",marginBottom:"1rem"},children:"📦"}),w.jsx("h3",{children:"Brak zamówień"}),w.jsx("p",{children:"Nie masz jeszcze żadnych zamówień"})]}):s.map(e=>w.jsxs(Xd,{children:[w.jsxs(Qd,{children:[w.jsx(ec,{children:e.id}),w.jsx(tc,{children:e.date})]}),w.jsxs(rc,{status:e.status,children:["completed"===e.status&&"Zrealizowane","processing"===e.status&&"W trakcie","shipped"===e.status&&"Wysłane"]}),w.jsx(ic,{children:e.total})]},e.id))}),"security"===r&&w.jsxs("div",{children:[w.jsxs(ac,{children:[w.jsx(nc,{children:"🔐 Bezpieczeństwo konta"}),w.jsxs(sc,{children:[w.jsx(dc,{children:"Hasło"}),w.jsx(cc,{children:"Ostatnia zmiana: 3 miesiące temu"})]}),w.jsxs(sc,{children:[w.jsx(dc,{children:"Weryfikacja email"}),w.jsx(cc,{children:"Zweryfikowany ✅"})]}),w.jsxs(sc,{children:[w.jsx(dc,{children:"Weryfikacja telefonu"}),w.jsx(cc,{children:"Zweryfikowany ✅"})]}),w.jsxs(sc,{children:[w.jsx(dc,{children:"Uwierzytelnianie dwuskładnikowe"}),w.jsx(cc,{children:"Nieaktywne"})]})]}),w.jsx(Gd,{children:"Zmień hasło"})]})]})]})]}):w.jsx(Pd,{children:w.jsxs("div",{style:{textAlign:"center",padding:"4rem"},children:[w.jsx("div",{style:{fontSize:"4rem",marginBottom:"1rem"},children:"🔒"}),w.jsx("h2",{children:"Zaloguj się"}),w.jsx("p",{children:"Aby zobaczyć swój profil, musisz się zalogować."})]})})}const mc=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`,hc=p.h1`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
`,pc=p.div`
  background: ${e=>e.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${e=>e.theme.shadow};
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
  }
`,xc=p.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`,uc=p.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
    box-shadow: 0 0 0 3px ${e=>e.theme.primary}20;
  }
  
  &::placeholder {
    color: ${e=>e.theme.textSecondary};
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 1.25rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
`,gc=p.button`
  padding: 1rem 2rem;
  background: ${e=>e.theme.gradient};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 1.75rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
`,jc=p.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 0.75rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`,yc=p.button`
  padding: 0.5rem 1rem;
  border: 2px solid ${e=>e.active?e.theme.primary:e.theme.border};
  background: ${e=>e.active?e.theme.primary:e.theme.background};
  color: ${e=>e.active?"white":e.theme.text};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  
  &:hover {
    border-color: ${e=>e.theme.primary};
    background: ${e=>(e.active,e.theme.primary)}10;
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 0.875rem;
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    border-radius: 6px;
  }
`,bc=p.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
  }
`,fc=p.div`
  background: ${e=>e.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${e=>e.theme.shadow};
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 12px;
  }
`,wc=p.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${e=>e.theme.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 1.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
`,kc=p.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`,vc=p.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${e=>e.theme.background};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadow};
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem;
    gap: 0.75rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    gap: 0.5rem;
    border-radius: 8px;
    
    &:hover {
      transform: translateY(-1px);
    }
  }
`,zc=p.div`
  font-size: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${e=>e.theme.primary}20;
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 1.75rem;
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
    border-radius: 8px;
  }
`,$c=p.div`
  flex: 1;
`,Sc=p.div`
  font-weight: 600;
  color: ${e=>e.theme.text};
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`,Cc=p.div`
  font-size: 0.875rem;
  color: ${e=>e.theme.textSecondary};
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`,Nc=p.div`
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: ${e=>e.theme.textSecondary};
  
  span {
    background: ${e=>e.theme.border};
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }
  
  @media (max-width: 480px) {
    gap: 0.75rem;
    font-size: 0.7rem;
  }
`,Pc=p.div`
  font-weight: 600;
  color: ${e=>e.theme.primary};
  font-size: 1.125rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`,Bc=p.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${e=>e.theme.textSecondary};
  
  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 2rem 0.5rem;
  }
`,Ac=p.div`
  text-align: center;
  padding: 2rem;
  color: ${e=>e.theme.textSecondary};
  
  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`,Tc=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: ${e=>e.theme.surface};
  border-radius: 12px;
  box-shadow: ${e=>e.theme.shadow};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`,Mc=p.div`
  font-size: 1rem;
  color: ${e=>e.theme.text};
  font-weight: 600;
`,Lc=p.select`
  padding: 0.5rem 1rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 8px;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  font-size: 0.875rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
  }
`,Ec=p.select`
  padding: 0.5rem 1rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 8px;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  font-size: 0.875rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
  }
`,Wc=p.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: ${e=>e.theme.surface};
  border-radius: 12px;
  box-shadow: ${e=>e.theme.shadow};
`,Dc=p.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${e=>e.theme.text};
`,Oc=p.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`,Ic=p.button`
  padding: 0.5rem 1rem;
  background: ${e=>e.theme.background};
  border: 2px solid ${e=>e.theme.border};
  border-radius: 8px;
  color: ${e=>e.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  
  &:hover {
    border-color: ${e=>e.theme.primary};
    background: ${e=>e.theme.primary}10;
  }
`,Fc=p.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${e=>e.theme.background};
  border-radius: 8px;
  border: 2px solid ${e=>e.theme.border};
`,_c=p.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`,Rc=p.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid ${e=>e.theme.border};
  border-radius: 6px;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
  }
`,Zc=p.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${e=>e.theme.text};
  cursor: pointer;
`,Hc=p.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`,Uc=p.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${e=>e.theme.surface};
  border: 2px solid ${e=>e.theme.border};
  border-top: none;
  border-radius: 0 0 12px 12px;
  box-shadow: ${e=>e.theme.shadow};
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
`,Kc=p.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid ${e=>e.theme.border};
  transition: background 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.primary}10;
  }
  
  &:last-child {
    border-bottom: none;
  }
`,Yc=p.div`
  position: relative;
  flex: 1;
`;function Vc(){const{user:e}=N(),[t,r]=i.useState(""),[o,a]=i.useState("all"),[n,s]=i.useState("relevance"),[d,c]=i.useState(!1),[l,m]=i.useState({products:[],shops:[]}),[h,p]=i.useState([]),[x,u]=i.useState([]),[g,j]=i.useState(!1),[y,b]=i.useState({minPrice:"",maxPrice:"",category:"",location:"",rating:"",inStock:!1});i.useEffect(()=>{f()},[]),i.useEffect(()=>{t.length>2?k():(u([]),j(!1))},[t]);const f=()=>{const e=JSON.parse(localStorage.getItem("searchHistory")||"[]");p(e.slice(0,10))},k=async()=>{try{const e="http://localhost:5000",r=localStorage.getItem("token"),i=await fetch(`${e}/api/search/suggestions?q=${encodeURIComponent(t)}`,{headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"}});if(i.ok){const e=await i.json();u(e),j(!0)}}catch(e){u([])}},v=async()=>{if(t.trim()){c(!0),j(!1),(e=>{const t=JSON.parse(localStorage.getItem("searchHistory")||"[]"),r=[e,...t.filter(t=>t!==e)].slice(0,20);localStorage.setItem("searchHistory",JSON.stringify(r)),p(r.slice(0,10))})(t);try{const e="http://localhost:5000",r=localStorage.getItem("token"),i=new URLSearchParams({q:t,filter:o,sort:n,...y}),a=await fetch(`${e}/api/search?${i}`,{headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"}});if(a.ok){const e=await a.json();m(e)}else m({products:[],shops:[]})}catch(e){m({products:[],shops:[]})}finally{c(!1)}}},z=(e,t)=>{b(r=>({...r,[e]:t}))};i.useEffect(()=>{t&&v()},[o,n,y]);const $=l.products.length+l.shops.length;return w.jsxs(mc,{children:[w.jsx(hc,{children:"🔍 Wyszukiwanie"}),w.jsxs(pc,{children:[w.jsxs(xc,{children:[w.jsxs(Yc,{children:[w.jsx(uc,{type:"text",placeholder:"Szukaj produktów, sklepów, kategorii...",value:t,onChange:e=>r(e.target.value),onKeyPress:e=>{"Enter"===e.key&&v()},onFocus:()=>t.length>2&&j(!0)}),g&&x.length>0&&w.jsx(Uc,{children:x.map((e,t)=>w.jsxs(Kc,{onClick:()=>(e=>{r(e),j(!1),v()})(e),children:["🔍 ",e]},t))})]}),w.jsx(gc,{onClick:v,children:"🔍 Szukaj"})]}),w.jsx(jc,{children:[{id:"all",label:"Wszystko",icon:"🔍"},{id:"products",label:"Produkty",icon:"📦"},{id:"shops",label:"Sklepy",icon:"🏪"},{id:"electronics",label:"Elektronika",icon:"💻"},{id:"clothing",label:"Odzież",icon:"👕"},{id:"books",label:"Książki",icon:"📚"},{id:"local",label:"Lokalne",icon:"🏘️"}].map(e=>w.jsxs(yc,{active:o===e.id,onClick:()=>a(e.id),children:[e.icon," ",e.label]},e.id))}),w.jsxs(Fc,{children:[w.jsx("h4",{children:"Filtry zaawansowane"}),w.jsxs(_c,{children:[w.jsx(Rc,{type:"number",placeholder:"Cena min (zł)",value:y.minPrice,onChange:e=>z("minPrice",e.target.value)}),w.jsx(Rc,{type:"number",placeholder:"Cena max (zł)",value:y.maxPrice,onChange:e=>z("maxPrice",e.target.value)}),w.jsx(Rc,{type:"text",placeholder:"Kategoria",value:y.category,onChange:e=>z("category",e.target.value)}),w.jsx(Rc,{type:"text",placeholder:"Lokalizacja",value:y.location,onChange:e=>z("location",e.target.value)})]}),w.jsxs(_c,{children:[w.jsxs(Zc,{children:[w.jsx(Hc,{type:"checkbox",checked:y.inStock,onChange:e=>z("inStock",e.target.checked)}),"Tylko dostępne"]}),w.jsxs(Ec,{value:y.rating,onChange:e=>z("rating",e.target.value),children:[w.jsx("option",{value:"",children:"Dowolna ocena"}),w.jsx("option",{value:"4",children:"4+ gwiazdki"}),w.jsx("option",{value:"3",children:"3+ gwiazdki"}),w.jsx("option",{value:"2",children:"2+ gwiazdki"})]})]})]})]}),h.length>0&&!t&&w.jsxs(Wc,{children:[w.jsx(Dc,{children:"Ostatnie wyszukiwania"}),w.jsx(Oc,{children:h.map((e,t)=>w.jsxs(Ic,{onClick:()=>(e=>{r(e),v()})(e),children:["🔍 ",e]},t))})]}),t&&w.jsxs(Tc,{"data-testid":"search-stats",children:[w.jsxs(Mc,{children:["Znaleziono ",$,' wyników dla "',t,'"']}),w.jsx(Lc,{value:n,onChange:e=>s(e.target.value),children:[{value:"relevance",label:"Trafność"},{value:"price-low",label:"Cena: od najniższej"},{value:"price-high",label:"Cena: od najwyższej"},{value:"rating",label:"Ocena"},{value:"newest",label:"Najnowsze"},{value:"popular",label:"Popularność"}].map(e=>w.jsx("option",{value:e.value,children:e.label},e.value))})]}),d?w.jsxs(Ac,{children:[w.jsx("div",{style:{fontSize:"2rem",marginBottom:"1rem"},children:"⏳"}),w.jsx("p",{children:"Wyszukiwanie..."})]}):t?w.jsxs(bc,{children:[w.jsxs(fc,{children:[w.jsxs(wc,{children:["📦 Produkty (",l.products.length,")"]}),0===l.products.length?w.jsxs(Bc,{children:[w.jsx("div",{style:{fontSize:"3rem",marginBottom:"1rem"},children:"📦"}),w.jsx("p",{children:"Nie znaleziono produktów"})]}):w.jsx(kc,{children:l.products.map(e=>w.jsxs(vc,{onClick:()=>window.location.href=`/product/${e._id}`,children:[w.jsx(zc,{children:"Elektronika"===e.category?"💻":"Odzież"===e.category?"👕":"Książki"===e.category?"📚":"📦"}),w.jsxs($c,{children:[w.jsx(Sc,{children:e.name}),w.jsx(Cc,{children:e.description}),w.jsxs(Nc,{children:[w.jsx("span",{children:e.category}),w.jsxs("span",{children:["⭐ ",e.rating||"Brak ocen"]}),w.jsx("span",{children:e.shop?.name||"Brak sklepu"})]})]}),w.jsxs(Pc,{children:[e.price," zł"]})]},e._id))})]}),w.jsxs(fc,{children:[w.jsxs(wc,{children:["🏪 Sklepy (",l.shops.length,")"]}),0===l.shops.length?w.jsxs(Bc,{children:[w.jsx("div",{style:{fontSize:"3rem",marginBottom:"1rem"},children:"🏪"}),w.jsx("p",{children:"Nie znaleziono sklepów"})]}):w.jsx(kc,{children:l.shops.map(e=>w.jsxs(vc,{onClick:()=>window.location.href=`/shop/${e._id}`,children:[w.jsx(zc,{children:"🏪"}),w.jsxs($c,{children:[w.jsx(Sc,{children:e.name}),w.jsx(Cc,{children:e.description}),w.jsxs(Nc,{children:[w.jsx("span",{children:e.category}),w.jsxs("span",{children:["⭐ ",e.rating||"Brak ocen"]}),w.jsxs("span",{children:[e.products?.length||0," produktów"]}),w.jsx("span",{children:e.location?.name||"Brak lokalizacji"})]})]})]},e._id))})]})]}):!h.length&&w.jsxs(Bc,{children:[w.jsx("div",{style:{fontSize:"4rem",marginBottom:"1rem"},children:"🔍"}),w.jsx("h3",{children:"Rozpocznij wyszukiwanie"}),w.jsx("p",{children:"Wprowadź nazwę produktu, sklepu lub kategorię"})]})]})}const qc=p.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`,Gc=p.h1`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`,Jc=p.div`
  background: ${e=>e.theme.surface};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${e=>e.theme.shadow};
  margin-bottom: 2rem;
`,Xc=p.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${e=>e.theme.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`,Qc=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid ${e=>e.theme.border};
  
  &:last-child {
    border-bottom: none;
  }
`,el=p.div`
  flex: 1;
`,tl=p.div`
  font-weight: 600;
  color: ${e=>e.theme.text};
  margin-bottom: 0.25rem;
`,rl=p.div`
  font-size: 0.875rem;
  color: ${e=>e.theme.textSecondary};
`,il=p.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`,ol=p.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background: ${e=>e.theme.primary};
  }
  
  &:checked + span:before {
    transform: translateX(26px);
  }
`,al=p.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${e=>e.theme.border};
  transition: 0.3s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background: white;
    transition: 0.3s;
    border-radius: 50%;
  }
`,nl=p.select`
  padding: 0.75rem 1rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 8px;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  font-size: 0.875rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
  }
`,sl=p.button`
  padding: 0.75rem 1.5rem;
  background: ${e=>e.theme.gradient};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.gradientHover};
    transform: translateY(-1px);
  }
  
  &.danger {
    background: #EF4444;
    
    &:hover {
      background: #DC2626;
    }
  }
  
  &.secondary {
    background: ${e=>e.theme.background};
    color: ${e=>e.theme.text};
    border: 2px solid ${e=>e.theme.border};
    
    &:hover {
      background: ${e=>e.theme.border};
    }
  }
`,dl=p.div`
  display: flex;
  gap: 0.5rem;
`,cl=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`,ll=p.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid ${e=>e.selected?e.theme.primary:e.theme.border};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${e=>e.theme.primary};
    background: ${e=>e.theme.primary}05;
  }
`,ml=p.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${e=>e.color};
  border: 2px solid ${e=>e.theme.border};
`,hl=p.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${e=>e.theme.text};
  text-align: center;
`,pl=p.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`,xl=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid ${e=>e.theme.border};
  
  &:last-child {
    border-bottom: none;
  }
`,ul=p.div`
  flex: 1;
`,gl=p.div`
  font-weight: 600;
  color: ${e=>e.theme.text};
  margin-bottom: 0.25rem;
`,jl=p.div`
  font-size: 0.875rem;
  color: ${e=>e.theme.textSecondary};
`,yl=p.button`
  padding: 1rem 2rem;
  background: ${e=>e.theme.gradient};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
  
  &:hover {
    background: ${e=>e.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`,bl=p.div`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-weight: 600;
  
  &.success {
    background: ${e=>e.theme.success}20;
    color: ${e=>e.theme.success};
    border: 1px solid ${e=>e.theme.success};
  }
  
  &.error {
    background: ${e=>e.theme.error}20;
    color: ${e=>e.theme.error};
    border: 1px solid ${e=>e.theme.error};
  }
`,fl=p.div`
  text-align: center;
  padding: 2rem;
  color: ${e=>e.theme.textSecondary};
`,wl=p.div`
  border: 2px solid ${e=>e.theme.error};
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
`,kl=p.h3`
  color: ${e=>e.theme.error};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;function vl(){const{user:e,logout:t}=N(),[r,o]=i.useState({theme:"light",language:"pl",notifications:{email:!0,push:!0,sms:!1,marketing:!1,orderUpdates:!0,promotions:!0,security:!0,messages:!0,reviews:!0},privacy:{profileVisibility:"public",showEmail:!1,showPhone:!1,allowMessages:!0,showLocation:!0,showStats:!0},security:{twoFactorAuth:!1,loginNotifications:!0,sessionTimeout:"24h",passwordChangeRequired:!1},preferences:{autoSave:!0,darkMode:!1,compactView:!1,showTutorials:!0}}),[a,n]=i.useState(!0),[s,d]=i.useState(!1),[c,l]=i.useState(null),[m,h]=i.useState(!1);i.useEffect(()=>{p()},[]);const p=async()=>{try{n(!0);const e="http://localhost:5000",t=localStorage.getItem("token");if(!t)return void n(!1);const r=await fetch(`${e}/api/users/layout-settings/portal`,{headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"}});if(r.ok){const e=await r.json();o(t=>({...t,theme:e.theme||"light",language:e.language||"pl",preferences:{...t.preferences,compactView:"compact"===e.layout}}))}}catch(e){}finally{n(!1)}},x=(e,t)=>{o(r=>({...r,[e]:{...r[e],[t]:!r[e][t]}})),h(!0)},u=(e,t,r)=>{o(i=>({...i,[e]:{...i[e],[t]:r}})),h(!0)};return a?w.jsxs(qc,{children:[w.jsx(Gc,{children:"Ustawienia"}),w.jsx(fl,{children:"Ładowanie ustawień..."})]}):w.jsxs(qc,{children:[w.jsx(Gc,{children:"⚙️ Ustawienia"}),c&&w.jsx(bl,{className:c.type,children:c.text}),w.jsxs(Jc,{children:[w.jsx(Xc,{children:"🎨 Wygląd"}),w.jsx(Qc,{children:w.jsxs(el,{children:[w.jsx(tl,{children:"Motyw kolorystyczny"}),w.jsx(rl,{children:"Wybierz preferowany motyw interfejsu"})]})}),w.jsx(cl,{children:[{id:"light",name:"Jasny",color:"#F3F4F6"},{id:"dark",name:"Ciemny",color:"#1F2937"},{id:"blue",name:"Niebieski",color:"#3B82F6"},{id:"green",name:"Zielony",color:"#10B981"},{id:"purple",name:"Fioletowy",color:"#8B5CF6"},{id:"orange",name:"Pomarańczowy",color:"#F59E0B"}].map(e=>w.jsxs(ll,{selected:r.theme===e.id,onClick:()=>{return t=e.id,o(e=>({...e,theme:t})),void h(!0);var t},children:[w.jsx(ml,{color:e.color}),w.jsx(hl,{children:e.name})]},e.id))}),w.jsxs(Qc,{children:[w.jsxs(el,{children:[w.jsx(tl,{children:"Język"}),w.jsx(rl,{children:"Wybierz język interfejsu"})]}),w.jsx(nl,{value:r.language,onChange:e=>u("","language",e.target.value),children:[{code:"pl",name:"Polski"},{code:"en",name:"English"},{code:"de",name:"Deutsch"},{code:"fr",name:"Français"},{code:"es",name:"Español"},{code:"it",name:"Italiano"}].map(e=>w.jsx("option",{value:e.code,children:e.name},e.code))})]}),w.jsxs(Qc,{children:[w.jsxs(el,{children:[w.jsx(tl,{children:"Tryb ciemny"}),w.jsx(rl,{children:"Automatyczne przełączanie na ciemny motyw"})]}),w.jsxs(il,{children:[w.jsx(ol,{type:"checkbox",checked:r.preferences.darkMode,onChange:()=>x("preferences","darkMode")}),w.jsx(al,{})]})]}),w.jsxs(Qc,{children:[w.jsxs(el,{children:[w.jsx(tl,{children:"Kompaktowy widok"}),w.jsx(rl,{children:"Zmniejsz odstępy w interfejsie"})]}),w.jsxs(il,{children:[w.jsx(ol,{type:"checkbox",checked:r.preferences.compactView,onChange:()=>x("preferences","compactView")}),w.jsx(al,{})]})]})]}),w.jsxs(Jc,{children:[w.jsx(Xc,{children:"🔔 Powiadomienia"}),w.jsxs(pl,{children:[w.jsxs(xl,{children:[w.jsxs(ul,{children:[w.jsx(gl,{children:"Powiadomienia email"}),w.jsx(jl,{children:"Otrzymuj powiadomienia na email"})]}),w.jsxs(il,{children:[w.jsx(ol,{type:"checkbox",checked:r.notifications.email,onChange:()=>x("notifications","email")}),w.jsx(al,{})]})]}),w.jsxs(xl,{children:[w.jsxs(ul,{children:[w.jsx(gl,{children:"Powiadomienia push"}),w.jsx(jl,{children:"Powiadomienia w przeglądarce"})]}),w.jsxs(il,{children:[w.jsx(ol,{type:"checkbox",checked:r.notifications.push,onChange:()=>x("notifications","push")}),w.jsx(al,{})]})]}),w.jsxs(xl,{children:[w.jsxs(ul,{children:[w.jsx(gl,{children:"SMS"}),w.jsx(jl,{children:"Powiadomienia SMS"})]}),w.jsxs(il,{children:[w.jsx(ol,{type:"checkbox",checked:r.notifications.sms,onChange:()=>x("notifications","sms")}),w.jsx(al,{})]})]}),w.jsxs(xl,{children:[w.jsxs(ul,{children:[w.jsx(gl,{children:"Marketing"}),w.jsx(jl,{children:"Oferty i promocje"})]}),w.jsxs(il,{children:[w.jsx(ol,{type:"checkbox",checked:r.notifications.marketing,onChange:()=>x("notifications","marketing")}),w.jsx(al,{})]})]}),w.jsxs(xl,{children:[w.jsxs(ul,{children:[w.jsx(gl,{children:"Aktualizacje zamówień"}),w.jsx(jl,{children:"Status i śledzenie zamówień"})]}),w.jsxs(il,{children:[w.jsx(ol,{type:"checkbox",checked:r.notifications.orderUpdates,onChange:()=>x("notifications","orderUpdates")}),w.jsx(al,{})]})]}),w.jsxs(xl,{children:[w.jsxs(ul,{children:[w.jsx(gl,{children:"Wiadomości"}),w.jsx(jl,{children:"Powiadomienia o nowych wiadomościach"})]}),w.jsxs(il,{children:[w.jsx(ol,{type:"checkbox",checked:r.notifications.messages,onChange:()=>x("notifications","messages")}),w.jsx(al,{})]})]}),w.jsxs(xl,{children:[w.jsxs(ul,{children:[w.jsx(gl,{children:"Recenzje"}),w.jsx(jl,{children:"Powiadomienia o nowych recenzjach"})]}),w.jsxs(il,{children:[w.jsx(ol,{type:"checkbox",checked:r.notifications.reviews,onChange:()=>x("notifications","reviews")}),w.jsx(al,{})]})]})]})]}),w.jsxs(Jc,{children:[w.jsx(Xc,{children:"🔒 Prywatność"}),w.jsxs(Qc,{children:[w.jsxs(el,{children:[w.jsx(tl,{children:"Widoczność profilu"}),w.jsx(rl,{children:"Kto może zobaczyć Twój profil"})]}),w.jsxs(nl,{value:r.privacy.profileVisibility,onChange:e=>u("privacy","profileVisibility",e.target.value),children:[w.jsx("option",{value:"public",children:"Publiczny"}),w.jsx("option",{value:"friends",children:"Tylko znajomi"}),w.jsx("option",{value:"private",children:"Prywatny"})]})]}),w.jsxs(Qc,{children:[w.jsxs(el,{children:[w.jsx(tl,{children:"Pokaż email"}),w.jsx(rl,{children:"Pozwól innym zobaczyć Twój email"})]}),w.jsxs(il,{children:[w.jsx(ol,{type:"checkbox",checked:r.privacy.showEmail,onChange:()=>x("privacy","showEmail")}),w.jsx(al,{})]})]}),w.jsxs(Qc,{children:[w.jsxs(el,{children:[w.jsx(tl,{children:"Pokaż telefon"}),w.jsx(rl,{children:"Pozwól innym zobaczyć Twój telefon"})]}),w.jsxs(il,{children:[w.jsx(ol,{type:"checkbox",checked:r.privacy.showPhone,onChange:()=>x("privacy","showPhone")}),w.jsx(al,{})]})]}),w.jsxs(Qc,{children:[w.jsxs(el,{children:[w.jsx(tl,{children:"Pozwól na wiadomości"}),w.jsx(rl,{children:"Pozwól innym wysyłać Ci wiadomości"})]}),w.jsxs(il,{children:[w.jsx(ol,{type:"checkbox",checked:r.privacy.allowMessages,onChange:()=>x("privacy","allowMessages")}),w.jsx(al,{})]})]}),w.jsxs(Qc,{children:[w.jsxs(el,{children:[w.jsx(tl,{children:"Pokaż lokalizację"}),w.jsx(rl,{children:"Pokaż swoją lokalizację w profilu"})]}),w.jsxs(il,{children:[w.jsx(ol,{type:"checkbox",checked:r.privacy.showLocation,onChange:()=>x("privacy","showLocation")}),w.jsx(al,{})]})]}),w.jsxs(Qc,{children:[w.jsxs(el,{children:[w.jsx(tl,{children:"Pokaż statystyki"}),w.jsx(rl,{children:"Pokaż swoje statystyki publicznie"})]}),w.jsxs(il,{children:[w.jsx(ol,{type:"checkbox",checked:r.privacy.showStats,onChange:()=>x("privacy","showStats")}),w.jsx(al,{})]})]})]}),w.jsxs(Jc,{children:[w.jsx(Xc,{children:"🛡️ Bezpieczeństwo"}),w.jsxs(Qc,{children:[w.jsxs(el,{children:[w.jsx(tl,{children:"Uwierzytelnianie dwuskładnikowe"}),w.jsx(rl,{children:"Dodatkowa warstwa bezpieczeństwa"})]}),w.jsxs(il,{children:[w.jsx(ol,{type:"checkbox",checked:r.security.twoFactorAuth,onChange:()=>x("security","twoFactorAuth")}),w.jsx(al,{})]})]}),w.jsxs(Qc,{children:[w.jsxs(el,{children:[w.jsx(tl,{children:"Powiadomienia o logowaniu"}),w.jsx(rl,{children:"Otrzymuj powiadomienia o nowych logowaniach"})]}),w.jsxs(il,{children:[w.jsx(ol,{type:"checkbox",checked:r.security.loginNotifications,onChange:()=>x("security","loginNotifications")}),w.jsx(al,{})]})]}),w.jsxs(Qc,{children:[w.jsxs(el,{children:[w.jsx(tl,{children:"Czas sesji"}),w.jsx(rl,{children:"Jak długo sesja pozostaje aktywna"})]}),w.jsxs(nl,{value:r.security.sessionTimeout,onChange:e=>u("security","sessionTimeout",e.target.value),children:[w.jsx("option",{value:"1h",children:"1 godzina"}),w.jsx("option",{value:"6h",children:"6 godzin"}),w.jsx("option",{value:"24h",children:"24 godziny"}),w.jsx("option",{value:"7d",children:"7 dni"})]})]}),w.jsxs(dl,{children:[w.jsx(sl,{onClick:()=>{window.location.href="/change-password"},children:"🔑 Zmień hasło"}),w.jsx(sl,{className:"secondary",onClick:async()=>{try{const t="http://localhost:5000",r=localStorage.getItem("token"),i=await fetch(`${t}/api/users/export-data`,{headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"}});if(i.ok){const t=await i.json(),r=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),o=window.URL.createObjectURL(r),a=document.createElement("a");a.href=o,a.download=`user_data_${e?.username||"user"}_${(new Date).toISOString().split("T")[0]}.json`,document.body.appendChild(a),a.click(),window.URL.revokeObjectURL(o),document.body.removeChild(a),l({type:"success",text:"Dane zostały wyeksportowane"})}else{const e=await i.json();l({type:"error",text:e.message||"Błąd podczas eksportu danych"})}}catch(t){l({type:"error",text:"Błąd połączenia z serwerem"})}},children:"📥 Eksportuj dane"})]})]}),w.jsxs(wl,{children:[w.jsx(kl,{children:"⚠️ Strefa niebezpieczna"}),w.jsx("p",{style:{marginBottom:"1rem",color:"#666"},children:"Te operacje są nieodwracalne. Użyj ich ostrożnie."}),w.jsx(dl,{children:w.jsx(sl,{className:"danger",onClick:async()=>{if(window.confirm("Czy na pewno chcesz usunąć konto? Ta operacja jest nieodwracalna i usunie wszystkie Twoje dane."))try{const e="http://localhost:5000",r=localStorage.getItem("token"),i=await fetch(`${e}/api/users/account`,{method:"DELETE",headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"}});if(i.ok)alert("Konto zostało usunięte"),t();else{const e=await i.json();alert(e.message||"Błąd podczas usuwania konta")}}catch(e){alert("Błąd połączenia z serwerem")}},children:"🗑️ Usuń konto"})})]}),m&&w.jsx(yl,{onClick:async()=>{try{d(!0),l(null);const e="http://localhost:5000",t=localStorage.getItem("token"),i={theme:r.theme,layout:r.preferences.compactView?"compact":"modern",language:r.language},o=await fetch(`${e}/api/users/layout-settings`,{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify(i)});if(o.ok)l({type:"success",text:"Ustawienia zostały zapisane"}),h(!1),r.theme&&(document.documentElement.setAttribute("data-theme",r.theme),localStorage.setItem("theme",r.theme)),setTimeout(()=>{window.location.reload()},1e3);else{const e=await o.json();l({type:"error",text:e.message||"Błąd podczas zapisywania ustawień"})}}catch(e){l({type:"error",text:"Błąd połączenia z serwerem"})}finally{d(!1)}},disabled:s,children:s?"Zapisywanie...":"💾 Zapisz ustawienia"})]})}const zl=p.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto 1rem;
`,$l=p.div`
  position: relative;
  display: flex;
  align-items: center;
`,Sl=p.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 25px;
  background: ${e=>e.theme.surface};
  color: ${e=>e.theme.text};
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;

  &:focus {
    border-color: ${e=>e.theme.primary};
    box-shadow: 0 0 0 3px ${e=>e.theme.primary}20;
  }

  &::placeholder {
    color: ${e=>e.theme.textSecondary};
  }
`,Cl=p.div`
  position: absolute;
  left: 1rem;
  color: ${e=>e.theme.textSecondary};
  z-index: 1;
`,Nl=p.button`
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  color: ${e=>e.theme.textSecondary};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${e=>e.theme.primary}10;
    color: ${e=>e.theme.primary};
  }
`,Pl=p.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 0.25rem;
`,Bl=p.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  color: ${e=>e.theme.text};
  transition: all 0.2s ease;
  border-bottom: 1px solid ${e=>e.theme.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${e=>e.theme.primary}10;
    color: ${e=>e.theme.primary};
  }

  ${e=>e.isHighlighted&&`\n    background: ${e.theme.primary}20;\n    color: ${e.theme.primary};\n    font-weight: 500;\n  `}
`,Al=p.div`
  padding: 1rem;
  text-align: center;
  color: ${e=>e.theme.textSecondary};
  font-style: italic;
`,Tl=({placeholder:e="Wyszukaj...",data:t=[],onSearch:r,onSelect:o,searchKey:a="name",theme:n,minChars:s=2,maxSuggestions:d=10})=>{const[c,l]=i.useState(""),[m,h]=i.useState([]),[p,x]=i.useState(!1),[u,g]=i.useState(-1),[j,y]=i.useState(!1),b=i.useRef(null),f=i.useRef(null),k=e=>{l(e[a]),x(!1),h([]),o&&o(e)};return i.useEffect(()=>{const e=e=>{b.current&&!b.current.contains(e.target)&&f.current&&!f.current.contains(e.target)&&(x(!1),g(-1))};return document.addEventListener("mousedown",e),()=>document.removeEventListener("mousedown",e)},[]),i.useEffect(()=>{if(u>=0&&f.current){const e=f.current.children[u];e&&e.scrollIntoView({block:"nearest"})}},[u]),w.jsxs(zl,{children:[w.jsxs($l,{children:[w.jsx(Cl,{theme:n,children:w.jsx(Q,{})}),w.jsx(Sl,{ref:b,type:"text",value:c,onChange:e=>{const i=e.target.value;if(l(i),i.length>=s){const e=!(o=i)||o.length<s?[]:t.filter(e=>(e[a]?.toLowerCase()||"").includes(o.toLowerCase())).slice(0,d);h(e),x(e.length>0),g(-1)}else h([]),x(!1);var o;r&&r(i)},onKeyDown:e=>{if(p)switch(e.key){case"ArrowDown":e.preventDefault(),g(e=>e<m.length-1?e+1:e);break;case"ArrowUp":e.preventDefault(),g(e=>e>0?e-1:-1);break;case"Enter":e.preventDefault(),u>=0&&m[u]&&k(m[u]);break;case"Escape":x(!1),g(-1)}},onFocus:()=>{m.length>0&&x(!0)},placeholder:e,theme:n}),c&&w.jsx(Nl,{onClick:()=>{l(""),h([]),x(!1),g(-1),r&&r(""),b.current?.focus()},theme:n,children:w.jsx(ne,{})})]}),p&&w.jsx(Pl,{ref:f,theme:n,children:m.length>0?m.map((e,t)=>w.jsxs(Bl,{onClick:()=>k(e),isHighlighted:t===u,theme:n,children:[e[a],e.voivodeship&&` (${e.voivodeship})`,e.population&&` - ${e.population.toLocaleString()} mieszkańców`]},e.id||t)):w.jsxs(Al,{theme:n,children:['Brak wyników dla "',c,'"']})})]})},Ml=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`,Ll=p.div`
  text-align: center;
  margin-bottom: 2rem;
`,El=p.h1`
  font-size: 2.5rem;
  color: ${e=>e.theme.text};
  margin-bottom: 0.5rem;
`,Wl=p.p`
  font-size: 1.1rem;
  color: ${e=>e.theme.textSecondary};
`,Dl=p.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: ${e=>e.theme.surface};
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`,Ol=p.span`
  font-weight: 500;
  color: ${e=>e.theme.text};
`,Il=p.div`
  position: relative;
  display: inline-block;
`,Fl=p.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${e=>e.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${e=>e.theme.primary}dd;
  }
`,_l=p.div.withConfig({shouldForwardProp:e=>!["isOpen","theme"].includes(e)})`
  display: ${e=>e.isOpen?"block":"none"};
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
`,Rl=p.div.withConfig({shouldForwardProp:e=>!["isSelected","theme"].includes(e)})`
  padding: 0.75rem 1rem;
  cursor: pointer;
  color: ${e=>e.theme.text};
  transition: all 0.2s ease;
  border-bottom: 1px solid ${e=>e.theme.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${e=>e.theme.primary}10;
    color: ${e=>e.theme.primary};
  }

  ${e=>e.isSelected&&`\n    background: ${e.theme.primary}20;\n    color: ${e.theme.primary};\n    font-weight: 500;\n  `}
`,Zl=p.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${e=>e.theme.border};
`,Hl=p.div.withConfig({shouldForwardProp:e=>!["$active","theme"].includes(e)})`
  padding: 1rem 2rem;
  margin: 0 0.5rem;
  border: none;
  background: ${e=>e.$active?e.theme.primary:"transparent"};
  color: ${e=>e.$active?"white":e.theme.text};
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;

  &:hover {
    background: ${e=>(e.$active,e.theme.primary)}20;
  }
`,Ul=p.div`
  min-height: 400px;
  padding: 2rem;
  background: ${e=>e.theme.surface};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`,Kl=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`,Yl=p.div`
  background: ${e=>e.theme.surface};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  border: 1px solid ${e=>e.theme.border};
`,Vl=p.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${e=>e.theme.primary};
  margin-bottom: 0.5rem;
`,ql=p.div`
  color: ${e=>e.theme.textSecondary};
  font-size: 0.9rem;
`,Gl=p.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: ${e=>e.theme.textSecondary};
`,Jl=p.div`
  color: ${e=>e.theme.error};
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
`,Xl=p.div`
  margin-top: 2rem;
`,Ql=p.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  background: ${e=>e.theme.primary}10;
  border-radius: 8px;
  font-weight: 600;
  color: ${e=>e.theme.primary};
  margin-bottom: 1rem;
`,em=p.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid ${e=>e.theme.border};
  transition: background 0.2s ease;

  &:hover {
    background: ${e=>e.theme.primary}05;
  }

  &:last-child {
    border-bottom: none;
  }
`,tm=p.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${e=>e.theme.text};
`,rm=p.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #ffd700;
`,im=p.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${e=>e.theme.textSecondary};
  font-size: 0.9rem;
`,om=p.span`
  color: ${e=>e.theme.primary};
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: ${e=>e.theme.primary}cc;
    text-decoration: underline;
  }
`;function am({theme:e}){const t=s(),{voivodeshipCode:r}=n(),o=a(),d=[{id:"02",name:"Dolnośląskie",code:"DS"},{id:"04",name:"Kujawsko-pomorskie",code:"KP"},{id:"06",name:"Lubelskie",code:"LU"},{id:"08",name:"Lubuskie",code:"LB"},{id:"10",name:"Łódzkie",code:"LD"},{id:"12",name:"Małopolskie",code:"MA"},{id:"14",name:"Mazowieckie",code:"MZ"},{id:"16",name:"Opolskie",code:"OP"},{id:"18",name:"Podkarpackie",code:"PK"},{id:"20",name:"Podlaskie",code:"PD"},{id:"22",name:"Pomorskie",code:"PM"},{id:"24",name:"Śląskie",code:"SL"},{id:"26",name:"Świętokrzyskie",code:"SK"},{id:"28",name:"Warmińsko-mazurskie",code:"WN"},{id:"30",name:"Wielkopolskie",code:"WP"},{id:"32",name:"Zachodniopomorskie",code:"ZP"}],[c,l]=i.useState("shops"),[m,h]=i.useState(null),[p,x]=i.useState(!1),[u,g]=i.useState(d),[j,y]=i.useState({}),[b,f]=i.useState(!0),[k,v]=i.useState(null),z={shops:[{_id:"6875773831cf77c7af5e07b4",name:"Sklep Elektroniczny TechMax",location:"Wrocław",rating:4.8,products:156,created:"2024-01-15"},{_id:"6875773831cf77c7af5e07b5",name:"Butik Mody Elegance",location:"Wrocław",rating:4.6,products:89,created:"2024-01-10"},{_id:"6875773831cf77c7af5e07b6",name:"Sklep Sportowy ActiveLife",location:"Wrocław",rating:4.9,products:234,created:"2024-01-08"},{_id:"6875773831cf77c7af5e07b7",name:"Księgarnia Literacka",location:"Wrocław",rating:4.7,products:567,created:"2024-01-12"},{_id:"6875773831cf77c7af5e07b8",name:"Sklep Ogrodniczy Zielony",location:"Wrocław",rating:4.5,products:123,created:"2024-01-05"}],posts:[{_id:"6875773831cf77c7af5e07b9",title:"Nowe trendy w modzie 2024",author:"Anna Kowalska",location:"Wrocław",likes:156,created:"2024-01-15"},{_id:"6875773831cf77c7af5e07ba",title:"Recenzja nowego smartfona",author:"Piotr Nowak",location:"Wrocław",likes:89,created:"2024-01-14"},{_id:"6875773831cf77c7af5e07bb",title:"Przepis na domowe ciasto",author:"Maria Wiśniewska",location:"Wrocław",likes:234,created:"2024-01-13"},{_id:"6875773831cf77c7af5e07bc",title:"Porady ogrodnicze",author:"Jan Kowalczyk",location:"Wrocław",likes:67,created:"2024-01-12"},{_id:"6875773831cf77c7af5e07bd",title:"Recenzja restauracji",author:"Katarzyna Zielińska",location:"Wrocław",likes:123,created:"2024-01-11"}],companies:[{_id:"6875773831cf77c7af5e07b4",name:"TechCorp Sp. z o.o.",industry:"Technologia",location:"Wrocław",employees:150,rating:4.8},{_id:"6875773831cf77c7af5e07ba",name:"Fashion House",industry:"Moda",location:"Wrocław",employees:45,rating:4.6},{_id:"6875773831cf77c7af5e07bb",name:"Green Solutions",industry:"Ekologia",location:"Wrocław",employees:78,rating:4.9},{_id:"6875773831cf77c7af5e07bc",name:"Digital Agency",industry:"Marketing",location:"Wrocław",employees:32,rating:4.7},{_id:"6875773831cf77c7af5e07bd",name:"Food & Beverage Co.",industry:"Gastronomia",location:"Wrocław",employees:120,rating:4.5}],products:[{_id:"6875773831cf77c7af5e07be",name:"iPhone 15 Pro",category:"Elektronika",price:"4999 zł",rating:4.9,location:"Wrocław"},{_id:"6875773831cf77c7af5e07bf",name:"Sukienka wieczorowa",category:"Moda",price:"299 zł",rating:4.7,location:"Wrocław"},{_id:"6875773831cf77c7af5e07c0",name:"Nike Air Max",category:"Sport",price:"599 zł",rating:4.8,location:"Wrocław"},{_id:"6875773831cf77c7af5e07c1",name:'Książka "Władca Pierścieni"',category:"Książki",price:"89 zł",rating:4.9,location:"Wrocław"},{_id:"6875773831cf77c7af5e07c2",name:"Roślina doniczkowa",category:"Ogród",price:"45 zł",rating:4.6,location:"Wrocław"}],users:[{_id:"6875773831cf77c7af5e07c3",name:"Anna Kowalska",location:"Wrocław",posts:23,followers:156,joined:"2023-03-15"},{_id:"6875773831cf77c7af5e07c4",name:"Piotr Nowak",location:"Wrocław",posts:15,followers:89,joined:"2023-05-20"},{_id:"6875773831cf77c7af5e07c5",name:"Maria Wiśniewska",location:"Wrocław",posts:34,followers:234,joined:"2023-02-10"},{_id:"6875773831cf77c7af5e07c6",name:"Jan Kowalczyk",location:"Wrocław",posts:8,followers:67,joined:"2023-07-05"},{_id:"6875773831cf77c7af5e07c7",name:"Katarzyna Zielińska",location:"Wrocław",posts:19,followers:123,joined:"2023-04-12"}]},$=[{id:"shops",label:"Sklepy"},{id:"posts",label:"Posty"},{id:"companies",label:"Firmy"},{id:"products",label:"Produkty"},{id:"users",label:"Użytkownicy"}];i.useEffect(()=>{if(r){const e=d.find(e=>e.id===r||e.code.toLowerCase()===r.toLowerCase());if(e)return h(e),void S(e.id)}if(t.state?.selectedVoivodeship){const e=d.find(e=>e.id===t.state.selectedVoivodeship.code);if(e)return h(e),void S(e.id)}const e=d.find(e=>"14"===e.id)||d[0];h(e),S(e.id)},[t.state,r]);const S=async e=>{try{f(!0),v(null);const e="http://localhost:5000",r=localStorage.getItem("token");let i=[],o=[],a=[],n=[],s=[];try{const t={"Content-Type":"application/json"};r&&(t.Authorization=`Bearer ${r}`);const o=await fetch(`${e}/api/company-profiles/list?limit=10`,{headers:t});if(o.ok){const e=await o.json();i=e.companyProfiles||e.companies||[]}else i=z.companies}catch(t){i=z.companies}try{const t={"Content-Type":"application/json"};r&&(t.Authorization=`Bearer ${r}`);const i=await fetch(`${e}/api/shops?limit=10`,{headers:t});if(i.ok){const e=await i.json();o=e.shops||e.data||[]}else o=z.shops}catch(t){o=z.shops}a=z.posts,n=z.products,s=z.users;const d={shops:{count:o.length,items:o},posts:{count:a.length,items:a},companies:{count:i.length,items:i},products:{count:n.length,items:n},users:{count:s.length,items:s}};y(d)}catch(r){v("Błąd podczas pobierania danych województwa");const e={shops:{count:z.shops.length,items:z.shops},posts:{count:z.posts.length,items:z.posts},companies:{count:z.companies.length,items:z.companies},products:{count:z.products.length,items:z.products},users:{count:z.users.length,items:z.users}};y(e)}finally{f(!1)}},C=()=>{switch(c){case"shops":return["Nazwa sklepu","Lokalizacja","Ocena","Produkty","Utworzono"];case"posts":return["Tytuł postu","Autor","Lokalizacja","Polubienia","Data"];case"companies":return["Nazwa firmy","Branża","Lokalizacja","Pracownicy","Ocena"];case"products":return["Nazwa produktu","Kategoria","Cena","Ocena","Lokalizacja"];case"users":return["Nazwa użytkownika","Lokalizacja","Posty","Obserwujący","Dołączył"];default:return[]}},N=t=>{switch(c){case"shops":return w.jsxs(w.Fragment,{children:[w.jsx(tm,{theme:e,children:w.jsx(om,{theme:e,onClick:()=>o(`/shop/${t._id}`),children:t.name})}),w.jsx(tm,{theme:e,children:"object"==typeof t.location?t.location?.name:t.location||""}),w.jsx(tm,{theme:e,children:w.jsxs(rm,{children:[w.jsx(ie,{})," ",t.rating]})}),w.jsx(tm,{theme:e,children:t.products}),w.jsx(tm,{theme:e,children:w.jsxs(im,{theme:e,children:[w.jsx(M,{})," ",t.created]})})]});case"posts":return w.jsxs(w.Fragment,{children:[w.jsx(tm,{theme:e,children:w.jsx(om,{theme:e,onClick:()=>o(`/posts/${t._id}`),children:t.title})}),w.jsx(tm,{theme:e,children:w.jsx(om,{theme:e,onClick:()=>o(`/users/${t.authorId||"6875773831cf77c7af5e07c3"}`),children:"object"==typeof t.author?t.author?.name||t.author?.username:t.author||""})}),w.jsx(tm,{theme:e,children:w.jsxs(im,{theme:e,children:[w.jsx(V,{})," ","object"==typeof t.location?t.location?.name:t.location||""]})}),w.jsx(tm,{theme:e,children:t.likes}),w.jsx(tm,{theme:e,children:w.jsxs(im,{theme:e,children:[w.jsx(M,{})," ",t.created]})})]});case"companies":return w.jsxs(w.Fragment,{children:[w.jsx(tm,{theme:e,children:w.jsx(om,{theme:e,onClick:()=>o(`/company-profiles/${t._id}`),children:t.name})}),w.jsx(tm,{theme:e,children:"object"==typeof t.industry?t.industry?.name:t.industry||""}),w.jsx(tm,{theme:e,children:w.jsxs(im,{theme:e,children:[w.jsx(V,{})," ","object"==typeof t.location?t.location?.name:t.location||""]})}),w.jsx(tm,{theme:e,children:t.employees}),w.jsx(tm,{theme:e,children:w.jsxs(rm,{children:[w.jsx(ie,{})," ",t.rating]})})]});case"products":return w.jsxs(w.Fragment,{children:[w.jsx(tm,{theme:e,children:w.jsx(om,{theme:e,onClick:()=>o(`/products/${t._id}`),children:t.name})}),w.jsx(tm,{theme:e,children:"object"==typeof t.category?t.category?.name:t.category||""}),w.jsx(tm,{theme:e,children:t.price}),w.jsx(tm,{theme:e,children:w.jsxs(rm,{children:[w.jsx(ie,{})," ",t.rating]})}),w.jsx(tm,{theme:e,children:w.jsxs(im,{theme:e,children:[w.jsx(V,{})," ","object"==typeof t.location?t.location?.name:t.location||""]})})]});case"users":return w.jsxs(w.Fragment,{children:[w.jsx(tm,{theme:e,children:w.jsx(om,{theme:e,onClick:()=>o(`/users/${t._id}`),children:t.name})}),w.jsx(tm,{theme:e,children:w.jsxs(im,{theme:e,children:[w.jsx(V,{})," ","object"==typeof t.location?t.location?.name:t.location||""]})}),w.jsx(tm,{theme:e,children:t.posts}),w.jsx(tm,{theme:e,children:t.followers}),w.jsx(tm,{theme:e,children:w.jsxs(im,{theme:e,children:[w.jsx(M,{})," ",t.joined]})})]});default:return null}};return w.jsxs(Ml,{children:[w.jsxs(Ll,{children:[w.jsx(El,{theme:e,children:"🏛️ Województwa"}),w.jsx(Wl,{theme:e,children:"Dane z województw Polski"})]}),w.jsxs(Dl,{theme:e,children:[w.jsx(Ol,{theme:e,children:"Wybrane województwo:"}),w.jsxs(Il,{children:[w.jsxs(Fl,{onClick:()=>x(!p),theme:e,children:[w.jsx(Y,{}),m?m.name:"Wybierz województwo",w.jsx(L,{})]}),w.jsx(_l,{isOpen:p,theme:e,children:u.map(t=>w.jsx(Rl,{isSelected:m?.id===t.id,onClick:()=>(e=>{h(e),x(!1),S(e.id)})(t),theme:e,children:t.name},t.id))})]})]}),w.jsx(Tl,{placeholder:"Wyszukaj województwo...",data:d,onSearch:e=>{if(!e||e.length<2)g(d);else{const t=d.filter(t=>t.name.toLowerCase().includes(e.toLowerCase()));g(t)}},onSelect:e=>{h(e),S(e.id)},searchKey:"name",theme:e,minChars:2,maxSuggestions:16}),w.jsx(Zl,{theme:e,children:$.map(t=>w.jsxs(Hl,{$active:c===t.id,onClick:()=>l(t.id),theme:e,children:["shops"===t.id&&w.jsx(oe,{}),"posts"===t.id&&w.jsx(D,{}),"companies"===t.id&&w.jsx(T,{}),"products"===t.id&&w.jsx(A,{}),"users"===t.id&&w.jsx(ce,{}),t.label]},t.id))}),w.jsx(Ul,{theme:e,children:(()=>{if(b)return w.jsx(Gl,{theme:e,children:"Ładowanie danych..."});if(k)return w.jsx(Jl,{theme:e,children:k});const t=j[c];return t&&t.items?w.jsxs("div",{children:[w.jsxs(Kl,{children:[w.jsxs(Yl,{theme:e,children:[w.jsx(Vl,{theme:e,children:t?.count||0}),w.jsxs(ql,{theme:e,children:["Łącznie ",$.find(e=>e.id===c)?.label.toLowerCase()]})]}),w.jsxs(Yl,{theme:e,children:[w.jsx(Vl,{theme:e,children:(.15*t?.count).toFixed(0)}),w.jsx(ql,{theme:e,children:"Aktywne dzisiaj"})]}),w.jsxs(Yl,{theme:e,children:[w.jsx(Vl,{theme:e,children:(.08*t?.count).toFixed(0)}),w.jsx(ql,{theme:e,children:"Nowe w tym tygodniu"})]})]}),w.jsxs(Xl,{children:[w.jsx(Ql,{theme:e,children:C().map((e,t)=>w.jsx("div",{children:e},t))}),t.items.map((t,r)=>w.jsx(em,{theme:e,children:N(t)},t._id||r))]})]}):w.jsx(Gl,{theme:e,children:"Ładowanie danych..."})})()})]})}const nm=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`,sm=p.div`
  text-align: center;
  margin-bottom: 2rem;
`,dm=p.h1`
  font-size: 2.5rem;
  color: ${e=>e.theme.text};
  margin-bottom: 0.5rem;
`,cm=p.p`
  font-size: 1.1rem;
  color: ${e=>e.theme.textSecondary};
`,lm=p.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: ${e=>e.theme.surface};
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`,mm=p.span`
  font-weight: 500;
  color: ${e=>e.theme.text};
`,hm=p.div`
  position: relative;
  display: inline-block;
`,pm=p.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${e=>e.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${e=>e.theme.primary}dd;
  }
`,xm=p.div.withConfig({shouldForwardProp:e=>!["isOpen","theme"].includes(e)})`
  display: ${e=>e.isOpen?"block":"none"};
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
`,um=p.div.withConfig({shouldForwardProp:e=>!["isSelected","theme"].includes(e)})`
  padding: 0.75rem 1rem;
  cursor: pointer;
  color: ${e=>e.theme.text};
  transition: all 0.2s ease;
  border-bottom: 1px solid ${e=>e.theme.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${e=>e.theme.primary}10;
    color: ${e=>e.theme.primary};
  }

  ${e=>e.isSelected&&`\n    background: ${e.theme.primary}20;\n    color: ${e.theme.primary};\n    font-weight: 500;\n  `}
`,gm=p.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${e=>e.theme.border};
`,jm=p.button.withConfig({shouldForwardProp:e=>!["active","theme"].includes(e)})`
  padding: 1rem 2rem;
  margin: 0 0.5rem;
  border: none;
  background: ${e=>e.active?e.theme.primary:"transparent"};
  color: ${e=>e.active?"white":e.theme.text};
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;

  &:hover {
    background: ${e=>(e.active,e.theme.primary)}20;
  }
`,ym=p.div`
  min-height: 400px;
  padding: 2rem;
  background: ${e=>e.theme.surface};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`,bm=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`,fm=p.div`
  background: ${e=>e.theme.surface};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  border: 1px solid ${e=>e.theme.border};
`,wm=p.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${e=>e.theme.primary};
  margin-bottom: 0.5rem;
`,km=p.div`
  color: ${e=>e.theme.textSecondary};
  font-size: 0.9rem;
`,vm=p.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: ${e=>e.theme.textSecondary};
`,zm=p.div`
  color: ${e=>e.theme.error};
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
`,$m=p.div`
  margin-top: 2rem;
`,Sm=p.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  background: ${e=>e.theme.primary}10;
  border-radius: 8px;
  font-weight: 600;
  color: ${e=>e.theme.primary};
  margin-bottom: 1rem;
`,Cm=p.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid ${e=>e.theme.border};
  transition: background-color 0.2s ease;

  &:hover {
    background: ${e=>e.theme.primary}05;
  }

  &:last-child {
    border-bottom: none;
  }
`,Nm=p.div`
  color: ${e=>e.theme.text};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`,Pm=p.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #FFD700;
  font-weight: 500;
`,Bm=p.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${e=>e.theme.textSecondary};
  font-size: 0.8rem;
`;p.div`
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: ${e=>e.theme.primary};
  }
`,p.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`,p.h3`
  color: ${e=>e.theme.primary};
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
`,p.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${e=>e.theme.textSecondary};
  font-size: 0.9rem;
`,p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`,p.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${e=>e.theme.textSecondary};
  font-size: 0.9rem;
`,p.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`,p(o)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${e=>e.theme.primary};
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${e=>e.theme.primary}dd;
    transform: translateY(-1px);
  }
`,p.div`
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: ${e=>e.theme.primary};
  }
`,p.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`,p.h3`
  color: ${e=>e.theme.primary};
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
`,p.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${e=>e.theme.textSecondary};
  font-size: 0.9rem;
  background: ${e=>e.theme.primary}10;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
`,p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`,p.div`
  text-align: center;
  padding: 0.75rem;
  background: ${e=>e.theme.background};
  border-radius: 8px;
`,p.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${e=>e.theme.primary};
`;const Am=p.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`,Tm=p.select`
  padding: 0.5rem 1rem;
  border: 1px solid ${e=>e.theme.border};
  border-radius: 6px;
  background: ${e=>e.theme.surface};
  color: ${e=>e.theme.text};
  font-size: 0.9rem;
`,Mm=p.div`
  text-align: center;
  padding: 3rem;
  color: ${e=>e.theme.textSecondary};
`,Lm=p.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;function Em({theme:e}){const{voivodeshipCode:t}=n(),r=s(),o=a(),[d,c]=i.useState(null),[l,m]=i.useState(!0),[h,p]=i.useState(null),[x,u]=i.useState("overview"),[g,j]=i.useState(""),[y,b]=i.useState(null),[f,k]=i.useState([]),[v,z]=i.useState(!1),[$,S]=i.useState([]),[C,N]=i.useState([]),[P,B]=i.useState({}),[A,E]=i.useState(""),[W,O]=i.useState(""),[I,F]=i.useState("name"),[_,R]=i.useState(""),[Z,H]=i.useState(""),[U,K]=i.useState("name"),q=[{id:"overview",label:"Przegląd",icon:w.jsx(Y,{})},{id:"shops",label:"Sklepy",icon:w.jsx(oe,{})},{id:"companies",label:"Firmy",icon:w.jsx(T,{})},{id:"posts",label:"Posty",icon:w.jsx(D,{})},{id:"users",label:"Użytkownicy",icon:w.jsx(ce,{})}],G=[{id:"0201",name:"Warszawa",voivodeship:"Mazowieckie",type:"miasto na prawach powiatu"},{id:"0202",name:"Ostrołęka",voivodeship:"Mazowieckie",type:"miasto na prawach powiatu"},{id:"0203",name:"Płock",voivodeship:"Mazowieckie",type:"miasto na prawach powiatu"},{id:"0204",name:"Radom",voivodeship:"Mazowieckie",type:"miasto na prawach powiatu"},{id:"0205",name:"Siedlce",voivodeship:"Mazowieckie",type:"miasto na prawach powiatu"},{id:"0210",name:"Białobrzegi",voivodeship:"Mazowieckie",type:"powiat"},{id:"0211",name:"Ciechanów",voivodeship:"Mazowieckie",type:"powiat"},{id:"0212",name:"Garwolin",voivodeship:"Mazowieckie",type:"powiat"},{id:"0213",name:"Gostynin",voivodeship:"Mazowieckie",type:"powiat"},{id:"0214",name:"Grodzisk Mazowiecki",voivodeship:"Mazowieckie",type:"powiat"},{id:"0215",name:"Grójec",voivodeship:"Mazowieckie",type:"powiat"},{id:"0216",name:"Kozienice",voivodeship:"Mazowieckie",type:"powiat"},{id:"0217",name:"Legionowo",voivodeship:"Mazowieckie",type:"powiat"},{id:"0218",name:"Lipsko",voivodeship:"Mazowieckie",type:"powiat"},{id:"0219",name:"Łosice",voivodeship:"Mazowieckie",type:"powiat"},{id:"0220",name:"Maków",voivodeship:"Mazowieckie",type:"powiat"},{id:"0221",name:"Mińsk",voivodeship:"Mazowieckie",type:"powiat"},{id:"0222",name:"Mława",voivodeship:"Mazowieckie",type:"powiat"},{id:"0223",name:"Nowy Dwór Mazowiecki",voivodeship:"Mazowieckie",type:"powiat"},{id:"0224",name:"Ostrołęka",voivodeship:"Mazowieckie",type:"powiat"},{id:"0225",name:"Ostrów Mazowiecka",voivodeship:"Mazowieckie",type:"powiat"},{id:"0226",name:"Piaseczno",voivodeship:"Mazowieckie",type:"powiat"},{id:"0227",name:"Płock",voivodeship:"Mazowieckie",type:"powiat"},{id:"0228",name:"Płońsk",voivodeship:"Mazowieckie",type:"powiat"},{id:"0229",name:"Pruszków",voivodeship:"Mazowieckie",type:"powiat"},{id:"0230",name:"Przasnysz",voivodeship:"Mazowieckie",type:"powiat"},{id:"0231",name:"Przysucha",voivodeship:"Mazowieckie",type:"powiat"},{id:"0232",name:"Pułtusk",voivodeship:"Mazowieckie",type:"powiat"},{id:"0233",name:"Radom",voivodeship:"Mazowieckie",type:"powiat"},{id:"0234",name:"Siedlce",voivodeship:"Mazowieckie",type:"powiat"},{id:"0235",name:"Sierpc",voivodeship:"Mazowieckie",type:"powiat"},{id:"0236",name:"Sochaczew",voivodeship:"Mazowieckie",type:"powiat"},{id:"0237",name:"Sokołów",voivodeship:"Mazowieckie",type:"powiat"},{id:"0238",name:"Szydłowiec",voivodeship:"Mazowieckie",type:"powiat"},{id:"0239",name:"Warszawa Zachodni",voivodeship:"Mazowieckie",type:"powiat"},{id:"0240",name:"Węgrów",voivodeship:"Mazowieckie",type:"powiat"},{id:"0241",name:"Wołomin",voivodeship:"Mazowieckie",type:"powiat"},{id:"0242",name:"Wyszków",voivodeship:"Mazowieckie",type:"powiat"},{id:"0243",name:"Zwoleń",voivodeship:"Mazowieckie",type:"powiat"},{id:"0244",name:"Żuromin",voivodeship:"Mazowieckie",type:"powiat"},{id:"0245",name:"Żyrardów",voivodeship:"Mazowieckie",type:"powiat"}],J={posts:[{id:1,title:"Nowe produkty w TechStore",author:"Jan Kowalski",location:"Warszawa",likes:45,created:"2024-01-20"},{id:2,title:"Promocja w FashionHub",author:"Anna Nowak",location:"Radom",likes:32,created:"2024-01-19"},{id:3,title:"Recenzja książki",author:"Piotr Wiśniewski",location:"Płock",likes:28,created:"2024-01-18"}],users:[{id:1,name:"Jan Kowalski",location:"Warszawa",posts:15,followers:234,joined:"2023-06-15"},{id:2,name:"Anna Nowak",location:"Radom",posts:8,followers:156,joined:"2023-08-22"},{id:3,name:"Piotr Wiśniewski",location:"Płock",posts:23,followers:445,joined:"2023-05-10"}]},X=async e=>{if(e)try{m(!0);const t=await fetch(`/api/locations/${e}/stats`);if(t.ok){const e=await t.json();B(e.stats)}else B({shops:{total:15,verified:12},companies:{total:8},products:{total:234},topCategories:[{_id:"Elektronika",count:5},{_id:"Odzież",count:4},{_id:"Książki",count:3}]});const r=await fetch(`/api/locations/${e}/shops?limit=20`);if(r.ok){const e=await r.json();S(e.shops)}else S([{_id:"1",name:"TechStore Warszawa",description:"Najlepsze produkty elektroniczne w Warszawie",category:"Elektronika",address:{city:"Warszawa",voivodeship:"Mazowieckie"},ratings:{average:4.5,count:23},stats:{totalProducts:150},createdAt:"2024-01-15",isActive:!0},{_id:"2",name:"FashionHub Radom",description:"Moda i styl w centrum Radomia",category:"Odzież",address:{city:"Radom",voivodeship:"Mazowieckie"},ratings:{average:4.2,count:18},stats:{totalProducts:89},createdAt:"2024-01-10",isActive:!0},{_id:"3",name:"BookWorld Płock",description:"Księgarnia z największym wyborem książek",category:"Książki",address:{city:"Płock",voivodeship:"Mazowieckie"},ratings:{average:4.7,count:31},stats:{totalProducts:234},createdAt:"2024-01-08",isActive:!0}]);const i=await fetch(`/api/locations/${e}/companies?limit=20`);if(i.ok){const e=await i.json();N(e.companies)}else N([{_id:"1",name:"TechCorp Sp. z o.o.",industry:"Technologia",shortDescription:"Innowacyjne rozwiązania technologiczne",address:{city:"Warszawa",voivodeship:"Mazowieckie"},stats:{averageRating:4.8,profileViews:1250,followers:89},companyInfo:{employees:45}},{_id:"2",name:"EcoSolutions",industry:"Ekologia",shortDescription:"Zrównoważone rozwiązania ekologiczne",address:{city:"Radom",voivodeship:"Mazowieckie"},stats:{averageRating:4.5,profileViews:890,followers:56},companyInfo:{employees:23}},{_id:"3",name:"MarketingPro",industry:"Marketing",shortDescription:"Profesjonalne usługi marketingowe",address:{city:"Płock",voivodeship:"Mazowieckie"},stats:{averageRating:4.3,profileViews:567,followers:34},companyInfo:{employees:12}}])}catch(t){B({shops:{total:15,verified:12},companies:{total:8},products:{total:234},topCategories:[{_id:"Elektronika",count:5},{_id:"Odzież",count:4},{_id:"Książki",count:3}]}),S([{_id:"1",name:"TechStore Warszawa",description:"Najlepsze produkty elektroniczne w Warszawie",category:"Elektronika",address:{city:"Warszawa",voivodeship:"Mazowieckie"},ratings:{average:4.5,count:23},stats:{totalProducts:150},createdAt:"2024-01-15",isActive:!0}]),N([{_id:"1",name:"TechCorp Sp. z o.o.",industry:"Technologia",shortDescription:"Innowacyjne rozwiązania technologiczne",address:{city:"Warszawa",voivodeship:"Mazowieckie"},stats:{averageRating:4.8,profileViews:1250,followers:89},companyInfo:{employees:45}}])}finally{m(!1)}};i.useEffect(()=>{d&&X(d.id)},[d]),i.useEffect(()=>{if(t){const e=G.find(e=>e.id===t);if(e)return c(e),void ee(e.id)}if(r.state?.selectedCounty){const e=G.find(e=>e.id===r.state.selectedCounty.code);if(e)return c(e),void ee(e.id)}Q()},[t,r.state]),i.useEffect(()=>{k(G)},[G]);const Q=async()=>{try{const e=localStorage.getItem("token");if(!e){const e=G.find(e=>"0201"===e.id)||G[0];return c(e),void ee(e.id)}const t="http://localhost:5000",r=await fetch(`${t}/api/users/profile`,{headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"}});if(r.ok){const i=await r.json();if(i.location){const r=await fetch(`${t}/api/locations/${i.location}`,{headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"}});if(r.ok){const e=await r.json(),t=G.find(t=>e.name?.includes(t.name)||e.hierarchy?.powiat?.name?.includes(t.name));if(t)return c(t),void ee(t.id)}}}const i=G.find(e=>"0201"===e.id)||G[0];c(i),ee(i.id)}catch(e){const t=G.find(e=>"0201"===e.id)||G[0];c(t),ee(t.id)}},ee=async e=>{try{m(!0),await X(e)}catch(t){p("Błąd podczas pobierania danych")}finally{m(!1)}},te=()=>{switch(x){case"shops":return["Nazwa sklepu","Kategoria","Lokalizacja","Ocena","Status"];case"companies":return["Nazwa firmy","Branża","Lokalizacja","Ocena","Status"];case"posts":return["Tytuł","Autor","Data","Likes","Komentarze"];case"users":return["Nazwa użytkownika","Email","Rola","Status","Data rejestracji"];default:return[]}},re=t=>{switch(x){case"shops":return w.jsxs(w.Fragment,{children:[w.jsx(Nm,{theme:e,children:w.jsx(LinkCell,{theme:e,onClick:()=>o(`/shop/${t._id}`),children:t.name})}),w.jsx(Nm,{theme:e,children:t.category}),w.jsx(Nm,{theme:e,children:w.jsxs(Bm,{theme:e,children:[w.jsx(V,{})," ",`${t.address?.city}, ${t.address?.voivodeship}`]})}),w.jsx(Nm,{theme:e,children:w.jsxs(Pm,{children:[w.jsx(ie,{})," ",t.ratings?.average?.toFixed(1)||"Brak"]})}),w.jsx(Nm,{theme:e,children:w.jsxs(Bm,{theme:e,children:[w.jsx(M,{})," ",new Date(t.createdAt).toLocaleDateString("pl-PL")]})})]});case"companies":return w.jsxs(w.Fragment,{children:[w.jsx(Nm,{theme:e,children:w.jsx(LinkCell,{theme:e,onClick:()=>o(`/company-profiles/${t._id}`),children:t.name})}),w.jsx(Nm,{theme:e,children:t.industry}),w.jsx(Nm,{theme:e,children:w.jsxs(Bm,{theme:e,children:[w.jsx(V,{})," ",`${t.address?.city}, ${t.address?.voivodeship}`]})}),w.jsx(Nm,{theme:e,children:w.jsxs(Pm,{children:[w.jsx(ie,{})," ",t.stats?.averageRating?.toFixed(1)||"Brak"]})}),w.jsx(Nm,{theme:e,children:t.companyInfo?.employees||"N/A"})]});case"posts":return w.jsxs(w.Fragment,{children:[w.jsx(Nm,{theme:e,children:w.jsx(LinkCell,{theme:e,onClick:()=>o(`/posts/${t._id}`),children:t.title})}),w.jsx(Nm,{theme:e,children:w.jsx(LinkCell,{theme:e,onClick:()=>o(`/users/${t.authorId||"6875773831cf77c7af5e07c3"}`),children:t.author})}),w.jsx(Nm,{theme:e,children:w.jsxs(Bm,{theme:e,children:[w.jsx(M,{})," ",new Date(t.createdAt).toLocaleDateString("pl-PL")]})}),w.jsx(Nm,{theme:e,children:t.likes||0}),w.jsx(Nm,{theme:e,children:t.comments?.length||0})]});case"users":return w.jsxs(w.Fragment,{children:[w.jsx(Nm,{theme:e,children:w.jsx(LinkCell,{theme:e,onClick:()=>o(`/users/${t._id}`),children:t.username})}),w.jsx(Nm,{theme:e,children:t.email}),w.jsx(Nm,{theme:e,children:t.role}),w.jsx(Nm,{theme:e,children:t.isActive?"Aktywny":"Nieaktywny"}),w.jsx(Nm,{theme:e,children:w.jsxs(Bm,{theme:e,children:[w.jsx(M,{})," ",new Date(t.createdAt).toLocaleDateString("pl-PL")]})})]});default:return null}};return h?w.jsx(zm,{theme:e,children:h}):w.jsxs(nm,{theme:e,children:[w.jsxs(sm,{theme:e,children:[w.jsx(dm,{theme:e,children:"Powiaty - Mazowieckie"}),w.jsx(cm,{theme:e,children:"Przeglądaj sklepy, firmy i aktywność w powiatach województwa mazowieckiego"})]}),w.jsxs(lm,{theme:e,children:[w.jsx(mm,{theme:e,children:"Wybierz powiat:"}),w.jsxs(hm,{children:[w.jsxs(pm,{theme:e,onClick:()=>z(!v),children:[d?d.name:"Wybierz powiat",w.jsx(L,{})]}),w.jsx(xm,{theme:e,isOpen:v,children:f.map(t=>w.jsxs(um,{theme:e,isSelected:d?.id===t.id,onClick:()=>(e=>{c(e),u("overview"),ee(e.id)})(t),children:[t.name," (",t.type,")"]},t.id))})]}),w.jsx(Tl,{placeholder:"Wyszukaj powiat...",value:g,onChange:e=>(e=>{if(j(e),!e||e.length<2)k(G);else{const t=G.filter(t=>t.name.toLowerCase().includes(e.toLowerCase())||t.voivodeship.toLowerCase().includes(e.toLowerCase()));k(t)}})(e.target.value)})]}),d&&w.jsxs(w.Fragment,{children:[w.jsx(gm,{theme:e,children:q.map(t=>w.jsxs(jm,{theme:e,active:x===t.id,onClick:()=>u(t.id),children:[t.icon,t.label]},t.id))}),w.jsx(ym,{theme:e,children:(()=>{switch(x){case"overview":return w.jsxs("div",{children:[w.jsxs(bm,{children:[w.jsxs(fm,{children:[w.jsx(wm,{children:P.shops?.total||0}),w.jsx(km,{children:"Sklepy"})]}),w.jsxs(fm,{children:[w.jsx(wm,{children:P.companies?.total||0}),w.jsx(km,{children:"Firmy"})]}),w.jsxs(fm,{children:[w.jsx(wm,{children:P.products?.total||0}),w.jsx(km,{children:"Produkty"})]}),w.jsxs(fm,{children:[w.jsx(wm,{children:P.shops?.verified||0}),w.jsx(km,{children:"Zweryfikowane"})]})]}),P.topCategories&&P.topCategories.length>0&&w.jsxs("div",{children:[w.jsx("h3",{children:"Top Kategorie"}),w.jsx("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap",marginTop:"1rem"},children:P.topCategories.map((t,r)=>w.jsxs("div",{style:{background:e.primary+"20",color:e.primary,padding:"0.5rem 1rem",borderRadius:"20px",fontSize:"0.9rem"},children:[t._id," (",t.count,")"]},r))})]})]});case"shops":return w.jsxs("div",{children:[w.jsxs(Am,{children:[w.jsx(Tl,{placeholder:"Wyszukaj sklepy...",value:A,onChange:e=>E(e.target.value)}),w.jsxs(Tm,{value:W,onChange:e=>O(e.target.value),children:[w.jsx("option",{value:"",children:"Wszystkie kategorie"}),w.jsx("option",{value:"Elektronika",children:"Elektronika"}),w.jsx("option",{value:"Odzież",children:"Odzież"}),w.jsx("option",{value:"Książki",children:"Książki"}),w.jsx("option",{value:"Sport",children:"Sport"}),w.jsx("option",{value:"Zdrowie i Uroda",children:"Zdrowie i Uroda"})]}),w.jsxs(Tm,{value:I,onChange:e=>F(e.target.value),children:[w.jsx("option",{value:"name",children:"Nazwa A-Z"}),w.jsx("option",{value:"rating",children:"Najwyżej oceniane"}),w.jsx("option",{value:"newest",children:"Najnowsze"}),w.jsx("option",{value:"oldest",children:"Najstarsze"})]})]}),l?w.jsx(vm,{children:"Ładowanie sklepów..."}):$.length>0?w.jsxs($m,{children:[w.jsx(Sm,{theme:e,children:te().map((e,t)=>w.jsx("div",{children:e},t))}),$.map(t=>w.jsx(Cm,{theme:e,children:re(t)},t._id))]}):w.jsxs(Mm,{children:[w.jsx(Lm,{children:"🏪"}),w.jsx("h3",{children:"Brak sklepów w tej lokalizacji"}),w.jsx("p",{children:"Nie znaleziono żadnych sklepów w wybranej lokalizacji."})]})]});case"companies":return w.jsxs("div",{children:[w.jsxs(Am,{children:[w.jsx(Tl,{placeholder:"Wyszukaj firmy...",value:_,onChange:e=>R(e.target.value)}),w.jsxs(Tm,{value:Z,onChange:e=>H(e.target.value),children:[w.jsx("option",{value:"",children:"Wszystkie branże"}),w.jsx("option",{value:"Technologia",children:"Technologia"}),w.jsx("option",{value:"Moda",children:"Moda"}),w.jsx("option",{value:"Ekologia",children:"Ekologia"}),w.jsx("option",{value:"Marketing",children:"Marketing"}),w.jsx("option",{value:"Gastronomia",children:"Gastronomia"})]}),w.jsxs(Tm,{value:U,onChange:e=>K(e.target.value),children:[w.jsx("option",{value:"name",children:"Nazwa A-Z"}),w.jsx("option",{value:"rating",children:"Najwyżej oceniane"}),w.jsx("option",{value:"newest",children:"Najnowsze"}),w.jsx("option",{value:"oldest",children:"Najstarsze"})]})]}),l?w.jsx(vm,{children:"Ładowanie firm..."}):C.length>0?w.jsxs($m,{children:[w.jsx(Sm,{theme:e,children:te().map((e,t)=>w.jsx("div",{children:e},t))}),C.map(t=>w.jsx(Cm,{theme:e,children:re(t)},t._id))]}):w.jsxs(Mm,{children:[w.jsx(Lm,{children:"🏢"}),w.jsx("h3",{children:"Brak firm w tej lokalizacji"}),w.jsx("p",{children:"Nie znaleziono żadnych firm w wybranej lokalizacji."})]})]});case"posts":return w.jsxs("div",{children:[w.jsx(Am,{children:w.jsx(Tl,{placeholder:"Wyszukaj posty...",value:g,onChange:e=>j(e.target.value)})}),l?w.jsx(vm,{children:"Ładowanie postów..."}):w.jsxs($m,{children:[w.jsx(Sm,{theme:e,children:te().map((e,t)=>w.jsx("div",{children:e},t))}),J.posts.map(t=>w.jsx(Cm,{theme:e,children:re(t).map((t,r)=>w.jsx(Nm,{theme:e,children:t},r))},t.id))]})]});case"users":return w.jsxs("div",{children:[w.jsx(Am,{children:w.jsx(Tl,{placeholder:"Wyszukaj użytkowników...",value:g,onChange:e=>j(e.target.value)})}),l?w.jsx(vm,{children:"Ładowanie użytkowników..."}):w.jsxs($m,{children:[w.jsx(Sm,{theme:e,children:te().map((e,t)=>w.jsx("div",{children:e},t))}),J.users.map(t=>w.jsx(Cm,{theme:e,children:re(t).map((t,r)=>w.jsx(Nm,{theme:e,children:t},r))},t.id))]})]});default:return w.jsx("div",{children:"Wybierz zakładkę"})}})()})]})]})}const Wm=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`,Dm=p.div`
  text-align: center;
  margin-bottom: 2rem;
`,Om=p.h1`
  font-size: 2.5rem;
  color: ${e=>e.theme.text};
  margin-bottom: 0.5rem;
`,Im=p.p`
  font-size: 1.1rem;
  color: ${e=>e.theme.textSecondary};
`,Fm=p.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: ${e=>e.theme.surface};
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`,_m=p.span`
  font-weight: 500;
  color: ${e=>e.theme.text};
`,Rm=p.div`
  position: relative;
  display: inline-block;
`,Zm=p.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${e=>e.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${e=>e.theme.primary}dd;
  }
`,Hm=p.div.withConfig({shouldForwardProp:e=>!["isOpen","theme"].includes(e)})`
  display: ${e=>e.isOpen?"block":"none"};
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
`,Um=p.div.withConfig({shouldForwardProp:e=>!["isSelected","theme"].includes(e)})`
  padding: 0.75rem 1rem;
  cursor: pointer;
  color: ${e=>e.theme.text};
  transition: all 0.2s ease;
  border-bottom: 1px solid ${e=>e.theme.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${e=>e.theme.primary}10;
    color: ${e=>e.theme.primary};
  }

  ${e=>e.isSelected&&`\n    background: ${e.theme.primary}20;\n    color: ${e.theme.primary};\n    font-weight: 500;\n  `}
`,Km=p.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${e=>e.theme.border};
`,Ym=p.button.withConfig({shouldForwardProp:e=>!["active","theme"].includes(e)})`
  padding: 1rem 2rem;
  margin: 0 0.5rem;
  border: none;
  background: ${e=>e.active?e.theme.primary:"transparent"};
  color: ${e=>e.active?"white":e.theme.text};
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;

  &:hover {
    background: ${e=>(e.active,e.theme.primary)}20;
  }
`,Vm=p.div`
  min-height: 400px;
  padding: 2rem;
  background: ${e=>e.theme.surface};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`,qm=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`,Gm=p.div.withConfig({shouldForwardProp:e=>!["theme"].includes(e)})`
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: ${e=>e.theme.primary};
  }
`,Jm=p.div.withConfig({shouldForwardProp:e=>!["theme"].includes(e)})`
  font-size: 2rem;
  font-weight: bold;
  color: ${e=>e.theme.primary};
  margin-bottom: 0.5rem;
`,Xm=p.div.withConfig({shouldForwardProp:e=>!["theme"].includes(e)})`
  color: ${e=>e.theme.textSecondary};
  font-size: 0.9rem;
`,Qm=p.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: ${e=>e.theme.textSecondary};
`,eh=p.div`
  color: #e74c3c;
  text-align: center;
  padding: 2rem;
  background: #e74c3c10;
  border-radius: 8px;
  margin: 1rem 0;
`,th=p.div`
  margin-top: 2rem;
`,rh=p.div.withConfig({shouldForwardProp:e=>!["theme"].includes(e)})`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  background: ${e=>e.theme.primary}10;
  border-radius: 8px;
  font-weight: 600;
  color: ${e=>e.theme.primary};
  margin-bottom: 1rem;
`,ih=p.div.withConfig({shouldForwardProp:e=>!["theme"].includes(e)})`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid ${e=>e.theme.border};
  transition: background-color 0.2s ease;

  &:hover {
    background: ${e=>e.theme.primary}05;
  }

  &:last-child {
    border-bottom: none;
  }
`,oh=p.div`
  color: ${e=>e.theme.text};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;p.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #FFD700;
  font-weight: 500;
`,p.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${e=>e.theme.textSecondary};
  font-size: 0.8rem;
`;const ah=p.div`
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: ${e=>e.theme.primary};
  }
`,nh=p.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`,sh=p.h3`
  color: ${e=>e.theme.primary};
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
`,dh=p.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${e=>e.theme.textSecondary};
  font-size: 0.9rem;
`,ch=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`,lh=p.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${e=>e.theme.textSecondary};
  font-size: 0.9rem;
`,mh=p.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`,hh=p(o)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${e=>e.theme.primary};
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${e=>e.theme.primary}dd;
    transform: translateY(-1px);
  }
`,ph=p.div`
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: ${e=>e.theme.primary};
  }
`,xh=p.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`,uh=p.h3`
  color: ${e=>e.theme.primary};
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
`,gh=p.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${e=>e.theme.textSecondary};
  font-size: 0.9rem;
  background: ${e=>e.theme.primary}10;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
`,jh=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`,yh=p.div`
  text-align: center;
  padding: 0.75rem;
  background: ${e=>e.theme.background};
  border-radius: 8px;
`,bh=p.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${e=>e.theme.primary};
`,fh=p.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`,wh=p.select`
  padding: 0.5rem 1rem;
  border: 1px solid ${e=>e.theme.border};
  border-radius: 6px;
  background: ${e=>e.theme.surface};
  color: ${e=>e.theme.text};
  font-size: 0.9rem;
`,kh=p.div`
  text-align: center;
  padding: 3rem;
  color: ${e=>e.theme.textSecondary};
`,vh=p.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;function zh({theme:e}){const{countyCode:t}=n(),r=s(),[o,a]=i.useState(null),[d,c]=i.useState(!0),[l,m]=i.useState(null),[h,p]=i.useState("overview"),[x,u]=i.useState(""),[g,j]=i.useState(null),[y,b]=i.useState([]),[f,k]=i.useState(!1),[v,z]=i.useState({}),[$,S]=i.useState([]),[C,N]=i.useState([]),[P,B]=i.useState({}),[M,E]=i.useState(""),[W,O]=i.useState(""),[F,_]=i.useState("name"),[R,Z]=i.useState(""),[H,K]=i.useState(""),[q,G]=i.useState("name"),J=[{id:"overview",label:"Przegląd",icon:w.jsx(Y,{})},{id:"shops",label:"Sklepy",icon:w.jsx(oe,{})},{id:"companies",label:"Firmy",icon:w.jsx(T,{})},{id:"posts",label:"Posty",icon:w.jsx(D,{})},{id:"users",label:"Użytkownicy",icon:w.jsx(ce,{})}],X=[{id:"020101",name:"Warszawa",type:"gmina miejska",county:"Warszawa",population:1783321},{id:"020201",name:"Grodzisk Mazowiecki",type:"gmina miejsko-wiejska",county:"powiat grodziski",population:45e3},{id:"020202",name:"Milanówek",type:"gmina miejska",county:"powiat grodziski",population:16e3},{id:"020203",name:"Podkowa Leśna",type:"gmina miejska",county:"powiat grodziski",population:4e3},{id:"020204",name:"Baranów",type:"gmina wiejska",county:"powiat grodziski",population:12e3},{id:"020205",name:"Jaktorów",type:"gmina wiejska",county:"powiat grodziski",population:11e3},{id:"020206",name:"Żabia Wola",type:"gmina wiejska",county:"powiat grodziski",population:6500},{id:"020301",name:"Legionowo",type:"gmina miejska",county:"powiat legionowski",population:54e3},{id:"020302",name:"Serock",type:"gmina miejsko-wiejska",county:"powiat legionowski",population:15e3},{id:"020303",name:"Wieliszew",type:"gmina wiejska",county:"powiat legionowski",population:12e3}],Q={shops:[{id:1,name:"TechStore Warszawa",category:"Elektronika",location:"Warszawa, Mazowieckie",rating:4.5,products:150,created:"2024-01-15"},{id:2,name:"FashionHub Grodzisk",category:"Odzież",location:"Grodzisk Mazowiecki, Mazowieckie",rating:4.2,products:89,created:"2024-01-10"},{id:3,name:"BookWorld Legionowo",category:"Książki",location:"Legionowo, Mazowieckie",rating:4.7,products:234,created:"2024-01-08"}],companies:[{id:1,name:"TechCorp Sp. z o.o.",industry:"Technologia",location:"Warszawa, Mazowieckie",employees:45,rating:4.8},{id:2,name:"EcoSolutions",industry:"Ekologia",location:"Grodzisk Mazowiecki, Mazowieckie",employees:23,rating:4.5},{id:3,name:"MarketingPro",industry:"Marketing",location:"Legionowo, Mazowieckie",employees:12,rating:4.3}],posts:[{id:1,title:"Nowe produkty w TechStore",author:"Jan Kowalski",location:"Warszawa",likes:45,created:"2024-01-20"},{id:2,title:"Promocja w FashionHub",author:"Anna Nowak",location:"Grodzisk Mazowiecki",likes:32,created:"2024-01-19"},{id:3,title:"Recenzja książki",author:"Piotr Wiśniewski",location:"Legionowo",likes:28,created:"2024-01-18"}],users:[{id:1,name:"Jan Kowalski",location:"Warszawa",posts:15,followers:234,joined:"2023-06-15"},{id:2,name:"Anna Nowak",location:"Grodzisk Mazowiecki",posts:8,followers:156,joined:"2023-08-22"},{id:3,name:"Piotr Wiśniewski",location:"Legionowo",posts:23,followers:445,joined:"2023-05-10"}],products:[{id:1,name:"iPhone 15 Pro",category:"Elektronika",price:"4999 zł",rating:4.8,location:"Warszawa"},{id:2,name:"Nike Air Max",category:"Sport",price:"899 zł",rating:4.6,location:"Grodzisk Mazowiecki"},{id:3,name:"Harry Potter Box Set",category:"Książki",price:"299 zł",rating:4.9,location:"Legionowo"}]};i.useEffect(()=>{if(t){const e=X.find(e=>e.id===t);if(e)return a(e),void re(e.id)}if(r.state?.selectedMunicipality){const e=X.find(e=>e.id===r.state.selectedMunicipality.code);if(e)return a(e),void re(e.id)}ee()},[t,r.state]);const ee=async()=>{try{const e=localStorage.getItem("token");if(!e){const e=X.find(e=>"020101"===e.id)||X[0];return a(e),void re(e.id)}const t="http://localhost:5000",r=await fetch(`${t}/api/users/profile`,{headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"}});if(r.ok){const i=await r.json();if(i.location){const r=await fetch(`${t}/api/locations/${i.location}`,{headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"}});if(r.ok){const e=await r.json(),t=X.find(t=>e.name?.includes(t.name)||e.hierarchy?.gmina?.name?.includes(t.name));if(t)return a(t),void re(t.id)}}}const i=X.find(e=>"020101"===e.id)||X[0];a(i),re(i.id)}catch(e){const t=X.find(e=>"020101"===e.id)||X[0];a(t),re(t.id)}},re=async e=>{try{c(!0),m(null);const e={overview:{count:0,items:[]},shops:{count:Math.floor(50*Math.random())+10,items:Q.shops},posts:{count:Math.floor(150*Math.random())+30,items:Q.posts},companies:{count:Math.floor(40*Math.random())+8,items:Q.companies},users:{count:Math.floor(250*Math.random())+50,items:Q.users}};z(e),c(!1)}catch(t){m("Błąd podczas pobierania danych gminy"),c(!1)}};i.useEffect(()=>{o&&(async e=>{if(e)try{c(!0);const t=await fetch(`/api/locations/${e}/stats`);if(t.ok){const e=await t.json();B(e.stats)}const r=await fetch(`/api/locations/${e}/shops?limit=20`);if(r.ok){const e=await r.json();S(e.shops)}const i=await fetch(`/api/locations/${e}/companies?limit=20`);if(i.ok){const e=await i.json();N(e.companies)}c(!1)}catch(t){c(!1)}})(o.id)},[o]),i.useEffect(()=>{b(X)},[X]);const ae=()=>{switch(h){case"shops":return["Nazwa sklepu","Kategoria","Lokalizacja","Ocena","Status"];case"companies":return["Nazwa firmy","Branża","Lokalizacja","Ocena","Status"];case"posts":return["Tytuł","Autor","Data","Likes","Komentarze"];case"users":return["Nazwa użytkownika","Email","Rola","Status","Data rejestracji"];default:return[]}},ne=e=>{switch(h){case"shops":return[e.name,e.category,`${e.address?.city}, ${e.address?.voivodeship}`,e.ratings?.average?.toFixed(1)||"Brak",e.isActive?"Aktywny":"Nieaktywny"];case"companies":return[e.name,e.industry,`${e.address?.city}, ${e.address?.voivodeship}`,e.stats?.averageRating?.toFixed(1)||"Brak",e.isActive?"Aktywna":"Nieaktywna"];case"posts":return[e.title,e.author,new Date(e.createdAt).toLocaleDateString("pl-PL"),e.likes||0,e.comments?.length||0];case"users":return[e.username,e.email,e.role,e.isActive?"Aktywny":"Nieaktywny",new Date(e.createdAt).toLocaleDateString("pl-PL")];default:return[]}};return w.jsxs(Wm,{theme:e,children:[w.jsxs(Dm,{theme:e,children:[w.jsx(Om,{theme:e,children:"Gminy - Mazowieckie"}),w.jsx(Im,{theme:e,children:"Przeglądaj sklepy, firmy i aktywność w gminach województwa mazowieckiego"})]}),w.jsxs(Fm,{theme:e,children:[w.jsx(_m,{theme:e,children:"Wybierz gminę:"}),w.jsxs(Rm,{children:[w.jsxs(Zm,{theme:e,onClick:()=>k(!f),children:[o?o.name:"Wybierz gminę",w.jsx(L,{})]}),w.jsx(Hm,{theme:e,isOpen:f,children:y.map(t=>w.jsxs(Um,{theme:e,isSelected:o?.id===t.id,onClick:()=>(e=>{a(e),p("overview"),c(!0),setTimeout(()=>{c(!1)},1e3)})(t),children:[t.name," (",t.type,") - ",t.population.toLocaleString()," mieszkańców"]},t.id))})]}),w.jsx(Tl,{placeholder:"Wyszukaj gminę...",value:x,onChange:e=>(e=>{if(u(e),!e||e.length<2)b(X);else{const t=X.filter(t=>t.name.toLowerCase().includes(e.toLowerCase())||t.county.toLowerCase().includes(e.toLowerCase()));b(t)}})(e.target.value)})]}),o&&w.jsxs(w.Fragment,{children:[w.jsx(Km,{theme:e,children:J.map(t=>w.jsxs(Ym,{theme:e,active:h===t.id,onClick:()=>p(t.id),children:[t.icon,t.label]},t.id))}),w.jsx(Vm,{theme:e,children:(()=>{if(d)return w.jsx(Qm,{theme:e,children:"Ładowanie danych..."});if(l)return w.jsx(eh,{theme:e,children:l});switch(h){case"overview":return w.jsxs("div",{children:[w.jsxs(qm,{children:[w.jsxs(Gm,{theme:e,children:[w.jsx(Jm,{theme:e,children:v.shops?.count||0}),w.jsx(Xm,{theme:e,children:"Sklepy"})]}),w.jsxs(Gm,{theme:e,children:[w.jsx(Jm,{theme:e,children:v.companies?.count||0}),w.jsx(Xm,{theme:e,children:"Firmy"})]}),w.jsxs(Gm,{theme:e,children:[w.jsx(Jm,{theme:e,children:v.posts?.count||0}),w.jsx(Xm,{theme:e,children:"Posty"})]}),w.jsxs(Gm,{theme:e,children:[w.jsx(Jm,{theme:e,children:v.users?.count||0}),w.jsx(Xm,{theme:e,children:"Użytkownicy"})]})]}),w.jsxs("div",{style:{marginTop:"2rem"},children:[w.jsx("h3",{style:{color:e.primary,marginBottom:"1rem"},children:"Ostatnia aktywność"}),w.jsxs(th,{children:[w.jsxs(rh,{theme:e,children:[w.jsx("div",{children:"Typ"}),w.jsx("div",{children:"Nazwa"}),w.jsx("div",{children:"Lokalizacja"}),w.jsx("div",{children:"Data"}),w.jsx("div",{children:"Status"})]}),[{type:"Sklep",name:"TechStore Warszawa",location:"Warszawa",date:"2024-01-20",status:"Aktywny"},{type:"Firma",name:"TechCorp Sp. z o.o.",location:"Warszawa",date:"2024-01-19",status:"Aktywna"},{type:"Post",name:"Nowe produkty w TechStore",location:"Warszawa",date:"2024-01-18",status:"Opublikowany"}].map((t,r)=>w.jsxs(ih,{theme:e,children:[w.jsx(oh,{theme:e,children:t.type}),w.jsx(oh,{theme:e,children:t.name}),w.jsx(oh,{theme:e,children:t.location}),w.jsx(oh,{theme:e,children:t.date}),w.jsx(oh,{theme:e,children:t.status})]},r))]})]})]});case"shops":return w.jsxs("div",{children:[w.jsxs(fh,{children:[w.jsx(Tl,{placeholder:"Wyszukaj sklepy...",value:M,onChange:e=>E(e.target.value)}),w.jsxs(wh,{value:W,onChange:e=>O(e.target.value),children:[w.jsx("option",{value:"",children:"Wszystkie kategorie"}),w.jsx("option",{value:"elektronika",children:"Elektronika"}),w.jsx("option",{value:"odzież",children:"Odzież"}),w.jsx("option",{value:"książki",children:"Książki"}),w.jsx("option",{value:"sport",children:"Sport"})]}),w.jsxs(wh,{value:F,onChange:e=>_(e.target.value),children:[w.jsx("option",{value:"name",children:"Sortuj po nazwie"}),w.jsx("option",{value:"rating",children:"Sortuj po ocenie"}),w.jsx("option",{value:"date",children:"Sortuj po dacie"})]})]}),d?w.jsx(Qm,{children:"Ładowanie sklepów..."}):w.jsx("div",{children:$.length>0?$.map(t=>w.jsxs(ah,{theme:e,children:[w.jsxs(nh,{children:[w.jsx(sh,{theme:e,children:t.name}),w.jsxs(dh,{theme:e,children:[w.jsx(ie,{}),t.ratings?.average?.toFixed(1)||"Brak ocen"]})]}),w.jsxs(ch,{children:[w.jsxs(lh,{theme:e,children:[w.jsx(V,{}),t.address?.city,", ",t.address?.voivodeship]}),w.jsxs(lh,{theme:e,children:[w.jsx(A,{}),t.category||"Brak kategorii"]}),w.jsxs(lh,{theme:e,children:[w.jsx(te,{}),t.products?.length||0," produktów"]})]}),w.jsxs(mh,{children:[w.jsxs(hh,{to:`/shop/${t.id}`,theme:e,children:[w.jsx(I,{}),"Zobacz sklep"]}),w.jsxs(hh,{to:`/shop/${t.id}/products`,theme:e,children:[w.jsx(A,{}),"Produkty"]})]})]},t.id)):w.jsxs(kh,{theme:e,children:[w.jsx(vh,{children:"🏪"}),w.jsx("p",{children:"Brak sklepów w tej lokalizacji"})]})})]});case"companies":return w.jsxs("div",{children:[w.jsxs(fh,{children:[w.jsx(Tl,{placeholder:"Wyszukaj firmy...",value:R,onChange:e=>Z(e.target.value)}),w.jsxs(wh,{value:H,onChange:e=>K(e.target.value),children:[w.jsx("option",{value:"",children:"Wszystkie branże"}),w.jsx("option",{value:"technologia",children:"Technologia"}),w.jsx("option",{value:"ekologia",children:"Ekologia"}),w.jsx("option",{value:"marketing",children:"Marketing"}),w.jsx("option",{value:"gastronomia",children:"Gastronomia"})]}),w.jsxs(wh,{value:q,onChange:e=>G(e.target.value),children:[w.jsx("option",{value:"name",children:"Sortuj po nazwie"}),w.jsx("option",{value:"rating",children:"Sortuj po ocenie"}),w.jsx("option",{value:"employees",children:"Sortuj po liczbie pracowników"})]})]}),d?w.jsx(Qm,{children:"Ładowanie firm..."}):w.jsx("div",{children:C.length>0?C.map(t=>w.jsxs(ph,{theme:e,children:[w.jsxs(xh,{children:[w.jsx(uh,{theme:e,children:t.name}),w.jsxs(gh,{theme:e,children:[w.jsx(U,{}),t.industry||"Brak branży"]})]}),w.jsxs(jh,{children:[w.jsxs(yh,{theme:e,children:[w.jsx(bh,{theme:e,children:t.employees||0}),w.jsx(Xm,{theme:e,children:"Pracowników"})]}),w.jsxs(yh,{theme:e,children:[w.jsx(bh,{theme:e,children:t.stats?.averageRating?.toFixed(1)||"Brak"}),w.jsx(Xm,{theme:e,children:"Ocena"})]}),w.jsxs(yh,{theme:e,children:[w.jsx(bh,{theme:e,children:t.stats?.products||0}),w.jsx(Xm,{theme:e,children:"Produktów"})]})]}),w.jsxs(mh,{children:[w.jsxs(hh,{to:`/company/${t.id}`,theme:e,children:[w.jsx(I,{}),"Zobacz firmę"]}),w.jsxs(hh,{to:`/company/${t.id}/products`,theme:e,children:[w.jsx(A,{}),"Produkty"]})]})]},t.id)):w.jsxs(kh,{theme:e,children:[w.jsx(vh,{children:"🏢"}),w.jsx("p",{children:"Brak firm w tej lokalizacji"})]})})]});case"posts":return w.jsxs("div",{children:[w.jsx(fh,{children:w.jsx(Tl,{placeholder:"Wyszukaj posty...",value:x,onChange:e=>u(e.target.value)})}),d?w.jsx(Qm,{children:"Ładowanie postów..."}):w.jsxs(th,{children:[w.jsx(rh,{theme:e,children:ae().map((e,t)=>w.jsx("div",{children:e},t))}),Q.posts.map(t=>w.jsx(ih,{theme:e,children:ne(t).map((t,r)=>w.jsx(oh,{theme:e,children:t},r))},t.id))]})]});case"users":return w.jsxs("div",{children:[w.jsx(fh,{children:w.jsx(Tl,{placeholder:"Wyszukaj użytkowników...",value:x,onChange:e=>u(e.target.value)})}),d?w.jsx(Qm,{children:"Ładowanie użytkowników..."}):w.jsxs(th,{children:[w.jsx(rh,{theme:e,children:ae().map((e,t)=>w.jsx("div",{children:e},t))}),Q.users.map(t=>w.jsx(ih,{theme:e,children:ne(t).map((t,r)=>w.jsx(oh,{theme:e,children:t},r))},t.id))]})]});default:return w.jsx("div",{children:"Wybierz zakładkę"})}})()})]})]})}const $h=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`,Sh=p.div`
  text-align: center;
  margin-bottom: 2rem;
`,Ch=p.h1`
  font-size: 2.5rem;
  color: ${e=>e.theme.text};
  margin-bottom: 0.5rem;
`,Nh=p.p`
  font-size: 1.1rem;
  color: ${e=>e.theme.textSecondary};
`,Ph=p.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: ${e=>e.theme.surface};
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`,Bh=p.span`
  font-weight: 500;
  color: ${e=>e.theme.text};
`,Ah=p.div`
  position: relative;
  display: inline-block;
`,Th=p.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${e=>e.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${e=>e.theme.primary}dd;
  }
`,Mh=p.div.withConfig({shouldForwardProp:e=>!["isOpen","theme"].includes(e)})`
  display: ${e=>e.isOpen?"block":"none"};
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
`,Lh=p.div.withConfig({shouldForwardProp:e=>!["isSelected","theme"].includes(e)})`
  padding: 0.75rem 1rem;
  cursor: pointer;
  color: ${e=>e.theme.text};
  transition: all 0.2s ease;
  border-bottom: 1px solid ${e=>e.theme.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${e=>e.theme.primary}10;
    color: ${e=>e.theme.primary};
  }

  ${e=>e.isSelected&&`\n    background: ${e.theme.primary}20;\n    color: ${e.theme.primary};\n    font-weight: 500;\n  `}
`,Eh=p.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${e=>e.theme.border};
`,Wh=p.button.withConfig({shouldForwardProp:e=>!["active","theme"].includes(e)})`
  padding: 1rem 2rem;
  margin: 0 0.5rem;
  border: none;
  background: ${e=>e.active?e.theme.primary:"transparent"};
  color: ${e=>e.active?"white":e.theme.text};
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;

  &:hover {
    background: ${e=>(e.active,e.theme.primary)}20;
  }
`,Dh=p.div`
  min-height: 400px;
  padding: 2rem;
  background: ${e=>e.theme.surface};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`,Oh=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`,Ih=p.div.withConfig({shouldForwardProp:e=>!["theme"].includes(e)})`
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: ${e=>e.theme.primary};
  }
`,Fh=p.div.withConfig({shouldForwardProp:e=>!["theme"].includes(e)})`
  font-size: 2rem;
  font-weight: bold;
  color: ${e=>e.theme.primary};
  margin-bottom: 0.5rem;
`,_h=p.div.withConfig({shouldForwardProp:e=>!["theme"].includes(e)})`
  color: ${e=>e.theme.textSecondary};
  font-size: 0.9rem;
`,Rh=p.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: ${e=>e.theme.textSecondary};
`,Zh=p.div`
  color: ${e=>e.theme.error};
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
`,Hh=p.div`
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 12px;
  overflow: hidden;
`,Uh=p.div.withConfig({shouldForwardProp:e=>!["theme"].includes(e)})`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  background: ${e=>e.theme.primary}10;
  border-bottom: 1px solid ${e=>e.theme.border};
  font-weight: 600;
  color: ${e=>e.theme.primary};
  font-size: 0.9rem;
`,Kh=p.div.withConfig({shouldForwardProp:e=>!["theme"].includes(e)})`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid ${e=>e.theme.border};
  transition: background-color 0.2s ease;

  &:hover {
    background: ${e=>e.theme.primary}05;
  }

  &:last-child {
    border-bottom: none;
  }
`,Yh=p.div`
  color: ${e=>e.theme.text};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;p.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #FFD700;
  font-weight: 500;
`,p.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${e=>e.theme.textSecondary};
  font-size: 0.8rem;
`,p.div`
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: ${e=>e.theme.primary};
  }
`,p.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`,p.h3`
  color: ${e=>e.theme.primary};
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
`,p.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${e=>e.theme.textSecondary};
  font-size: 0.9rem;
`,p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`,p.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${e=>e.theme.textSecondary};
  font-size: 0.9rem;
`,p.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`,p(o)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${e=>e.theme.primary};
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${e=>e.theme.primary}dd;
    transform: translateY(-1px);
  }
`,p.div`
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: ${e=>e.theme.primary};
  }
`,p.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`,p.h3`
  color: ${e=>e.theme.primary};
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
`,p.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${e=>e.theme.textSecondary};
  font-size: 0.9rem;
  background: ${e=>e.theme.primary}10;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
`,p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`,p.div`
  text-align: center;
  padding: 0.75rem;
  background: ${e=>e.theme.background};
  border-radius: 8px;
`,p.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${e=>e.theme.primary};
`;const Vh=p.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;function qh({theme:e}){const{municipalityCode:t}=n();s();const[r,o]=i.useState("overview"),[a,d]=i.useState(null),[c,l]=i.useState(!1),[m,h]=i.useState({}),[p,x]=i.useState(!0),[u,g]=i.useState(null),[j,y]=i.useState(""),[b,f]=i.useState(null),[k,v]=i.useState(U),[z,$]=i.useState([]),[S,C]=i.useState([]),[N,P]=i.useState({}),[B,A]=i.useState(""),[M,E]=i.useState(""),[W,O]=i.useState("name"),[I,F]=i.useState(""),[_,R]=i.useState(""),[Z,H]=i.useState("name"),U=[{id:"020101",name:"Warszawa",voivodeship:"Mazowieckie",population:1783321,type:"miasto stołeczne"},{id:"020102",name:"Kraków",voivodeship:"Małopolskie",population:779115,type:"miasto"},{id:"020103",name:"Wrocław",voivodeship:"Dolnośląskie",population:642869,type:"miasto"},{id:"020104",name:"Poznań",voivodeship:"Wielkopolskie",population:534813,type:"miasto"},{id:"020105",name:"Gdańsk",voivodeship:"Pomorskie",population:470907,type:"miasto"},{id:"020106",name:"Szczecin",voivodeship:"Zachodniopomorskie",population:401907,type:"miasto"},{id:"020107",name:"Bydgoszcz",voivodeship:"Kujawsko-pomorskie",population:346739,type:"miasto"},{id:"020108",name:"Lublin",voivodeship:"Lubelskie",population:339784,type:"miasto"},{id:"020109",name:"Katowice",voivodeship:"Śląskie",population:294510,type:"miasto"},{id:"020110",name:"Białystok",voivodeship:"Podlaskie",population:297554,type:"miasto"},{id:"020111",name:"Olkusz",voivodeship:"Małopolskie",population:36512,type:"miasto"},{id:"020112",name:"Kielce",voivodeship:"Świętokrzyskie",population:194852,type:"miasto"},{id:"020113",name:"Rzeszów",voivodeship:"Podkarpackie",population:196821,type:"miasto"},{id:"020114",name:"Opole",voivodeship:"Opolskie",population:128035,type:"miasto"},{id:"020115",name:"Zielona Góra",voivodeship:"Lubuskie",population:141280,type:"miasto"},{id:"020116",name:"Łódź",voivodeship:"Łódzkie",population:670642,type:"miasto"},{id:"020117",name:"Toruń",voivodeship:"Kujawsko-pomorskie",population:201447,type:"miasto"},{id:"020118",name:"Gorzów Wielkopolski",voivodeship:"Lubuskie",population:123341,type:"miasto"},{id:"020119",name:"Wałbrzych",voivodeship:"Dolnośląskie",population:110603,type:"miasto"},{id:"020120",name:"Elbląg",voivodeship:"Warmińsko-mazurskie",population:119317,type:"miasto"}],K={shops:[{id:1,name:"Sklep Elektroniczny TechMax",location:"Warszawa",rating:4.8,products:156,created:"2024-01-15"},{id:2,name:"Butik Mody Elegance",location:"Warszawa",rating:4.6,products:89,created:"2024-01-10"},{id:3,name:"Sklep Sportowy ActiveLife",location:"Warszawa",rating:4.9,products:234,created:"2024-01-08"},{id:4,name:"Księgarnia Literacka",location:"Warszawa",rating:4.7,products:567,created:"2024-01-12"},{id:5,name:"Sklep Ogrodniczy Zielony",location:"Warszawa",rating:4.5,products:123,created:"2024-01-05"}],posts:[{id:1,title:"Nowe trendy w modzie 2024",author:"Anna Kowalska",location:"Warszawa",likes:156,created:"2024-01-15"},{id:2,title:"Recenzja nowego smartfona",author:"Piotr Nowak",location:"Warszawa",likes:89,created:"2024-01-14"},{id:3,title:"Przepis na domowe ciasto",author:"Maria Wiśniewska",location:"Warszawa",likes:234,created:"2024-01-13"},{id:4,title:"Porady ogrodnicze",author:"Jan Kowalczyk",location:"Warszawa",likes:67,created:"2024-01-12"},{id:5,title:"Recenzja restauracji",author:"Katarzyna Zielińska",location:"Warszawa",likes:123,created:"2024-01-11"}],companies:[{id:1,name:"TechCorp Sp. z o.o.",industry:"Technologia",location:"Warszawa",employees:150,rating:4.8},{id:2,name:"Fashion House",industry:"Moda",location:"Warszawa",employees:45,rating:4.6},{id:3,name:"Green Solutions",industry:"Ekologia",location:"Warszawa",employees:78,rating:4.9},{id:4,name:"Digital Agency",industry:"Marketing",location:"Warszawa",employees:32,rating:4.7},{id:5,name:"Food & Beverage Co.",industry:"Gastronomia",location:"Warszawa",employees:120,rating:4.5}],products:[{id:1,name:"iPhone 15 Pro",category:"Elektronika",price:"4999 zł",rating:4.9,location:"Warszawa"},{id:2,name:"Sukienka wieczorowa",category:"Moda",price:"299 zł",rating:4.7,location:"Warszawa"},{id:3,name:"Nike Air Max",category:"Sport",price:"599 zł",rating:4.8,location:"Warszawa"},{id:4,name:'Książka "Władca Pierścieni"',category:"Książki",price:"89 zł",rating:4.9,location:"Warszawa"},{id:5,name:"Roślina doniczkowa",category:"Ogród",price:"45 zł",rating:4.6,location:"Warszawa"}],users:[{id:1,name:"Anna Kowalska",location:"Warszawa",posts:23,followers:156,joined:"2023-03-15"},{id:2,name:"Piotr Nowak",location:"Warszawa",posts:15,followers:89,joined:"2023-05-20"},{id:3,name:"Maria Wiśniewska",location:"Warszawa",posts:34,followers:234,joined:"2023-02-10"},{id:4,name:"Jan Kowalczyk",location:"Warszawa",posts:8,followers:67,joined:"2023-07-05"},{id:5,name:"Katarzyna Zielińska",location:"Warszawa",posts:19,followers:123,joined:"2023-04-12"}]},V=[{id:"overview",label:"Przegląd",icon:w.jsx(Y,{})},{id:"shops",label:"Sklepy",icon:w.jsx(oe,{})},{id:"companies",label:"Firmy",icon:w.jsx(T,{})},{id:"posts",label:"Posty",icon:w.jsx(D,{})},{id:"users",label:"Użytkownicy",icon:w.jsx(ce,{})}];i.useEffect(()=>{q()},[]),i.useEffect(()=>{v(U)},[U]);const q=async()=>{try{const e=localStorage.getItem("token");if(!e){const e=U.find(e=>"020101"===e.id)||U[0];return d(e),void G(e.id)}const t="http://localhost:5000",r=await fetch(`${t}/api/users/profile`,{headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"}});if(r.ok){const i=await r.json();if(i.location){const r=await fetch(`${t}/api/locations/${i.location}`,{headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"}});if(r.ok){const e=await r.json(),t=U.find(t=>e.name?.includes(t.name)||e.hierarchy?.miasto?.name?.includes(t.name));if(t)return d(t),void G(t.id)}}}const i=U.find(e=>"020101"===e.id)||U[0];d(i),G(i.id)}catch(e){const t=U.find(e=>"020101"===e.id)||U[0];d(t),G(t.id)}},G=async e=>{try{x(!0),g(null);const e={overview:{count:0,items:[]},shops:{count:Math.floor(200*Math.random())+50,items:K.shops},posts:{count:Math.floor(500*Math.random())+100,items:K.posts},companies:{count:Math.floor(150*Math.random())+30,items:K.companies},users:{count:Math.floor(1e3*Math.random())+200,items:K.users}};h(e),x(!1)}catch(t){g("Błąd podczas pobierania danych miasta"),x(!1)}},J=()=>{switch(r){case"shops":return["Nazwa sklepu","Kategoria","Lokalizacja","Ocena","Status"];case"companies":return["Nazwa firmy","Branża","Lokalizacja","Ocena","Status"];case"posts":return["Tytuł","Autor","Data","Likes","Komentarze"];case"users":return["Nazwa użytkownika","Email","Rola","Status","Data rejestracji"];default:return[]}},X=e=>{switch(r){case"shops":return[e.name,e.category,`${e.address?.city}, ${e.address?.voivodeship}`,e.ratings?.average?.toFixed(1)||"Brak",e.isActive?"Aktywny":"Nieaktywny"];case"companies":return[e.name,e.industry,`${e.address?.city}, ${e.address?.voivodeship}`,e.stats?.averageRating?.toFixed(1)||"Brak",e.isActive?"Aktywna":"Nieaktywna"];case"posts":return[e.title,e.author,new Date(e.createdAt).toLocaleDateString("pl-PL"),e.likes||0,e.comments?.length||0];case"users":return[e.username,e.email,e.role,e.isActive?"Aktywny":"Nieaktywny",new Date(e.createdAt).toLocaleDateString("pl-PL")];default:return[]}};return u?w.jsx(Zh,{theme:e,children:u}):w.jsxs($h,{theme:e,children:[w.jsxs(Sh,{theme:e,children:[w.jsx(Ch,{theme:e,children:"Miasta - Polska"}),w.jsx(Nh,{theme:e,children:"Przeglądaj sklepy, firmy i aktywność w miastach Polski"})]}),w.jsxs(Ph,{theme:e,children:[w.jsx(Bh,{theme:e,children:"Wybierz miasto:"}),w.jsxs(Ah,{children:[w.jsxs(Th,{theme:e,onClick:()=>l(!c),children:[a?a.name:"Wybierz miasto",w.jsx(L,{})]}),w.jsx(Mh,{theme:e,isOpen:c,children:k.map(t=>w.jsxs(Lh,{theme:e,isSelected:a?.id===t.id,onClick:()=>(e=>{d(e),o("overview"),x(!0),setTimeout(()=>{x(!1)},1e3)})(t),children:[t.name," (",t.voivodeship,") - ",t.population.toLocaleString()," mieszkańców"]},t.id))})]}),w.jsx(Tl,{placeholder:"Wyszukaj miasto...",value:j,onChange:e=>(e=>{if(!e||e.length<2)v(U);else{const t=U.filter(t=>t.name.toLowerCase().includes(e.toLowerCase())||t.voivodeship.toLowerCase().includes(e.toLowerCase()));v(t)}})(e.target.value)})]}),a&&w.jsxs(w.Fragment,{children:[w.jsx(Eh,{theme:e,children:V.map(t=>w.jsxs(Wh,{theme:e,active:r===t.id,onClick:()=>o(t.id),children:[t.icon,t.label]},t.id))}),w.jsx(Dh,{theme:e,children:(()=>{if(p)return w.jsx(Rh,{theme:e,children:"Ładowanie danych..."});if(u)return w.jsx(Zh,{theme:e,children:u});switch(r){case"overview":return w.jsxs("div",{children:[w.jsxs(Oh,{children:[w.jsxs(Ih,{theme:e,children:[w.jsx(Fh,{theme:e,children:m.shops?.count||0}),w.jsx(_h,{theme:e,children:"Sklepy"})]}),w.jsxs(Ih,{theme:e,children:[w.jsx(Fh,{theme:e,children:m.companies?.count||0}),w.jsx(_h,{theme:e,children:"Firmy"})]}),w.jsxs(Ih,{theme:e,children:[w.jsx(Fh,{theme:e,children:m.posts?.count||0}),w.jsx(_h,{theme:e,children:"Posty"})]}),w.jsxs(Ih,{theme:e,children:[w.jsx(Fh,{theme:e,children:m.users?.count||0}),w.jsx(_h,{theme:e,children:"Użytkownicy"})]})]}),w.jsxs("div",{style:{marginTop:"2rem"},children:[w.jsx("h3",{style:{color:e.primary,marginBottom:"1rem"},children:"Ostatnia aktywność"}),w.jsxs(Hh,{children:[w.jsxs(Uh,{theme:e,children:[w.jsx("div",{children:"Typ"}),w.jsx("div",{children:"Nazwa"}),w.jsx("div",{children:"Lokalizacja"}),w.jsx("div",{children:"Data"}),w.jsx("div",{children:"Status"})]}),[{type:"Sklep",name:"TechStore Warszawa",location:"Warszawa",date:"2024-01-20",status:"Aktywny"},{type:"Firma",name:"TechCorp Sp. z o.o.",location:"Warszawa",date:"2024-01-19",status:"Aktywna"},{type:"Post",name:"Nowe produkty w TechStore",location:"Warszawa",date:"2024-01-18",status:"Opublikowany"}].map((t,r)=>w.jsxs(Kh,{theme:e,children:[w.jsx(Yh,{theme:e,children:t.type}),w.jsx(Yh,{theme:e,children:t.name}),w.jsx(Yh,{theme:e,children:t.location}),w.jsx(Yh,{theme:e,children:t.date}),w.jsx(Yh,{theme:e,children:t.status})]},r))]})]})]});case"shops":return w.jsxs("div",{children:[w.jsx(Vh,{children:w.jsx(Tl,{placeholder:"Wyszukaj sklepy...",value:j,onChange:e=>y(e.target.value)})}),p?w.jsx(Rh,{children:"Ładowanie sklepów..."}):w.jsxs(Hh,{children:[w.jsx(Uh,{theme:e,children:J().map((e,t)=>w.jsx("div",{children:e},t))}),K.shops.map(t=>w.jsx(Kh,{theme:e,children:X(t).map((t,r)=>w.jsx(Yh,{theme:e,children:t},r))},t.id))]})]});case"companies":return w.jsxs("div",{children:[w.jsx(Vh,{children:w.jsx(Tl,{placeholder:"Wyszukaj firmy...",value:j,onChange:e=>y(e.target.value)})}),p?w.jsx(Rh,{children:"Ładowanie firm..."}):w.jsxs(Hh,{children:[w.jsx(Uh,{theme:e,children:J().map((e,t)=>w.jsx("div",{children:e},t))}),K.companies.map(t=>w.jsx(Kh,{theme:e,children:X(t).map((t,r)=>w.jsx(Yh,{theme:e,children:t},r))},t.id))]})]});case"posts":return w.jsxs("div",{children:[w.jsx(Vh,{children:w.jsx(Tl,{placeholder:"Wyszukaj posty...",value:j,onChange:e=>y(e.target.value)})}),p?w.jsx(Rh,{children:"Ładowanie postów..."}):w.jsxs(Hh,{children:[w.jsx(Uh,{theme:e,children:J().map((e,t)=>w.jsx("div",{children:e},t))}),K.posts.map(t=>w.jsx(Kh,{theme:e,children:X(t).map((t,r)=>w.jsx(Yh,{theme:e,children:t},r))},t.id))]})]});case"users":return w.jsxs("div",{children:[w.jsx(Vh,{children:w.jsx(Tl,{placeholder:"Wyszukaj użytkowników...",value:j,onChange:e=>y(e.target.value)})}),p?w.jsx(Rh,{children:"Ładowanie użytkowników..."}):w.jsxs(Hh,{children:[w.jsx(Uh,{theme:e,children:J().map((e,t)=>w.jsx("div",{children:e},t))}),K.users.map(t=>w.jsx(Kh,{theme:e,children:X(t).map((t,r)=>w.jsx(Yh,{theme:e,children:t},r))},t.id))]})]});default:return w.jsx("div",{children:"Wybierz zakładkę"})}})()})]})]})}p.select`
  padding: 0.5rem 1rem;
  border: 1px solid ${e=>e.theme.border};
  border-radius: 6px;
  background: ${e=>e.theme.surface};
  color: ${e=>e.theme.text};
  font-size: 0.9rem;
`,p.div`
  text-align: center;
  padding: 3rem;
  color: ${e=>e.theme.textSecondary};
`,p.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;const Gh=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`,Jh=p.div`
  text-align: center;
  margin-bottom: 2rem;
`,Xh=p.h1`
  font-size: 2.5rem;
  color: ${e=>e.theme.text};
  margin-bottom: 0.5rem;
`,Qh=p.p`
  font-size: 1.1rem;
  color: ${e=>e.theme.textSecondary};
`,ep=p.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${e=>e.theme.border};
`,tp=p.button`
  padding: 1rem 2rem;
  margin: 0 0.5rem;
  border: none;
  background: ${e=>e.active?e.theme.primary:"transparent"};
  color: ${e=>e.active?"white":e.theme.text};
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;

  &:hover {
    background: ${e=>(e.active,e.theme.primary)}20;
  }
`,rp=p.div`
  min-height: 400px;
  padding: 2rem;
  background: ${e=>e.theme.surface};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`,ip=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`,op=p.div`
  background: ${e=>e.theme.surface};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  border: 1px solid ${e=>e.theme.border};
`,ap=p.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${e=>e.theme.primary};
  margin-bottom: 0.5rem;
`,np=p.div`
  color: ${e=>e.theme.textSecondary};
  font-size: 0.9rem;
`,sp=p.div`
  margin-top: 2rem;
`,dp=p.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  background: ${e=>e.theme.primary}10;
  border-radius: 8px;
  font-weight: 600;
  color: ${e=>e.theme.primary};
  margin-bottom: 1rem;
`,cp=p.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid ${e=>e.theme.border};
  transition: background 0.2s ease;

  &:hover {
    background: ${e=>e.theme.primary}05;
  }

  &:last-child {
    border-bottom: none;
  }
`,lp=p.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${e=>e.theme.text};
`,mp=p.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #ffd700;
`,hp=p.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${e=>e.theme.textSecondary};
  font-size: 0.9rem;
`,pp=p.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: ${e=>e.theme.textSecondary};
`,xp=p.div`
  color: ${e=>e.theme.error};
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
`;function up({theme:e}){const[t,r]=i.useState("shops"),[o,a]=i.useState({}),[n,s]=i.useState(!0),[d,c]=i.useState(null),l=[{id:"shops",label:"Sklepy",icon:w.jsx(oe,{})},{id:"posts",label:"Posty",icon:w.jsx(D,{})},{id:"companies",label:"Firmy",icon:w.jsx(T,{})},{id:"products",label:"Produkty",icon:w.jsx(A,{})},{id:"users",label:"Użytkownicy",icon:w.jsx(ce,{})}],m={shops:[{id:1,name:"Sklep Elektroniczny TechMax",location:"Warszawa",rating:4.8,products:156,created:"2024-01-15"},{id:2,name:"Butik Mody Elegance",location:"Kraków",rating:4.6,products:89,created:"2024-01-10"},{id:3,name:"Sklep Sportowy ActiveLife",location:"Wrocław",rating:4.9,products:234,created:"2024-01-08"},{id:4,name:"Księgarnia Literacka",location:"Poznań",rating:4.7,products:567,created:"2024-01-12"},{id:5,name:"Sklep Ogrodniczy Zielony",location:"Gdańsk",rating:4.5,products:123,created:"2024-01-05"}],posts:[{id:1,title:"Nowe trendy w modzie 2024",author:"Anna Kowalska",location:"Warszawa",likes:156,created:"2024-01-15"},{id:2,title:"Recenzja nowego smartfona",author:"Piotr Nowak",location:"Kraków",likes:89,created:"2024-01-14"},{id:3,title:"Przepis na domowe ciasto",author:"Maria Wiśniewska",location:"Wrocław",likes:234,created:"2024-01-13"},{id:4,title:"Porady ogrodnicze",author:"Jan Kowalczyk",location:"Poznań",likes:67,created:"2024-01-12"},{id:5,title:"Recenzja restauracji",author:"Katarzyna Zielińska",location:"Gdańsk",likes:123,created:"2024-01-11"}],companies:[{id:1,name:"TechCorp Sp. z o.o.",industry:"Technologia",location:"Warszawa",employees:150,rating:4.8},{id:2,name:"Fashion House",industry:"Moda",location:"Kraków",employees:45,rating:4.6},{id:3,name:"Green Solutions",industry:"Ekologia",location:"Wrocław",employees:78,rating:4.9},{id:4,name:"Digital Agency",industry:"Marketing",location:"Poznań",employees:32,rating:4.7},{id:5,name:"Food & Beverage Co.",industry:"Gastronomia",location:"Gdańsk",employees:120,rating:4.5}],products:[{id:1,name:"iPhone 15 Pro",category:"Elektronika",price:"4999 zł",rating:4.9,location:"Warszawa"},{id:2,name:"Sukienka wieczorowa",category:"Moda",price:"299 zł",rating:4.7,location:"Kraków"},{id:3,name:"Nike Air Max",category:"Sport",price:"599 zł",rating:4.8,location:"Wrocław"},{id:4,name:'Książka "Władca Pierścieni"',category:"Książki",price:"89 zł",rating:4.9,location:"Poznań"},{id:5,name:"Roślina doniczkowa",category:"Ogród",price:"45 zł",rating:4.6,location:"Gdańsk"}],users:[{id:1,name:"Anna Kowalska",location:"Warszawa",posts:23,followers:156,joined:"2023-03-15"},{id:2,name:"Piotr Nowak",location:"Kraków",posts:15,followers:89,joined:"2023-05-20"},{id:3,name:"Maria Wiśniewska",location:"Wrocław",posts:34,followers:234,joined:"2023-02-10"},{id:4,name:"Jan Kowalczyk",location:"Poznań",posts:8,followers:67,joined:"2023-07-05"},{id:5,name:"Katarzyna Zielińska",location:"Gdańsk",posts:19,followers:123,joined:"2023-04-12"}]};i.useEffect(()=>{h()},[]);const h=async()=>{try{s(!0),c(null);a({shops:{count:1250,items:m.shops},posts:{count:3400,items:m.posts},companies:{count:890,items:m.companies},products:{count:15600,items:m.products},users:{count:8900,items:m.users}})}catch(e){c("Błąd podczas pobierania danych")}finally{s(!1)}},p=()=>{switch(t){case"shops":return["Nazwa sklepu","Lokalizacja","Ocena","Produkty","Utworzono"];case"posts":return["Tytuł postu","Autor","Lokalizacja","Polubienia","Data"];case"companies":return["Nazwa firmy","Branża","Lokalizacja","Pracownicy","Ocena"];case"products":return["Nazwa produktu","Kategoria","Cena","Ocena","Lokalizacja"];case"users":return["Nazwa użytkownika","Lokalizacja","Posty","Obserwujący","Dołączył"];default:return[]}},x=r=>{switch(t){case"shops":return w.jsxs(w.Fragment,{children:[w.jsx(lp,{theme:e,children:r.name}),w.jsx(lp,{theme:e,children:w.jsxs(hp,{theme:e,children:[w.jsx(V,{})," ",r.location]})}),w.jsx(lp,{theme:e,children:w.jsxs(mp,{children:[w.jsx(ie,{})," ",r.rating]})}),w.jsx(lp,{theme:e,children:r.products}),w.jsx(lp,{theme:e,children:w.jsxs(hp,{theme:e,children:[w.jsx(M,{})," ",r.created]})})]});case"posts":return w.jsxs(w.Fragment,{children:[w.jsx(lp,{theme:e,children:r.title}),w.jsx(lp,{theme:e,children:r.author}),w.jsx(lp,{theme:e,children:w.jsxs(hp,{theme:e,children:[w.jsx(V,{})," ",r.location]})}),w.jsx(lp,{theme:e,children:r.likes}),w.jsx(lp,{theme:e,children:w.jsxs(hp,{theme:e,children:[w.jsx(M,{})," ",r.created]})})]});case"companies":return w.jsxs(w.Fragment,{children:[w.jsx(lp,{theme:e,children:r.name}),w.jsx(lp,{theme:e,children:r.industry}),w.jsx(lp,{theme:e,children:w.jsxs(hp,{theme:e,children:[w.jsx(V,{})," ",r.location]})}),w.jsx(lp,{theme:e,children:r.employees}),w.jsx(lp,{theme:e,children:w.jsxs(mp,{children:[w.jsx(ie,{})," ",r.rating]})})]});case"products":return w.jsxs(w.Fragment,{children:[w.jsx(lp,{theme:e,children:r.name}),w.jsx(lp,{theme:e,children:r.category}),w.jsx(lp,{theme:e,children:r.price}),w.jsx(lp,{theme:e,children:w.jsxs(mp,{children:[w.jsx(ie,{})," ",r.rating]})}),w.jsx(lp,{theme:e,children:w.jsxs(hp,{theme:e,children:[w.jsx(V,{})," ",r.location]})})]});case"users":return w.jsxs(w.Fragment,{children:[w.jsx(lp,{theme:e,children:r.name}),w.jsx(lp,{theme:e,children:w.jsxs(hp,{theme:e,children:[w.jsx(V,{})," ",r.location]})}),w.jsx(lp,{theme:e,children:r.posts}),w.jsx(lp,{theme:e,children:r.followers}),w.jsx(lp,{theme:e,children:w.jsxs(hp,{theme:e,children:[w.jsx(M,{})," ",r.joined]})})]});default:return null}};return w.jsxs(Gh,{children:[w.jsxs(Jh,{children:[w.jsx(Xh,{theme:e,children:"🇵🇱 Polska"}),w.jsx(Qh,{theme:e,children:"Dane z całego kraju"})]}),w.jsx(ep,{theme:e,children:l.map(i=>w.jsxs(tp,{active:t===i.id,onClick:()=>r(i.id),theme:e,children:[i.icon," ",i.label]},i.id))}),w.jsx(rp,{theme:e,children:(()=>{if(n)return w.jsx(pp,{theme:e,children:"Ładowanie danych..."});if(d)return w.jsx(xp,{theme:e,children:d});const r=o[t];return w.jsxs("div",{children:[w.jsxs(ip,{children:[w.jsxs(op,{theme:e,children:[w.jsx(ap,{theme:e,children:r?.count||0}),w.jsxs(np,{theme:e,children:["Łącznie ",l.find(e=>e.id===t)?.label.toLowerCase()]})]}),w.jsxs(op,{theme:e,children:[w.jsx(ap,{theme:e,children:(.15*r?.count).toFixed(0)}),w.jsx(np,{theme:e,children:"Aktywne dzisiaj"})]}),w.jsxs(op,{theme:e,children:[w.jsx(ap,{theme:e,children:(.08*r?.count).toFixed(0)}),w.jsx(np,{theme:e,children:"Nowe w tym tygodniu"})]})]}),w.jsxs(sp,{children:[w.jsx(dp,{theme:e,children:p().map((e,t)=>w.jsx("div",{children:e},t))}),r?.items?.map((t,r)=>w.jsx(cp,{theme:e,children:x(t)},t.id||r))]})]})})()})]})}const gp=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`,jp=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`,yp=p.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`,bp=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`,fp=p.div`
  background: ${e=>e.theme.surface};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: ${e=>e.theme.shadow};
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
`,wp=p.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`,kp=p.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${e=>e.theme.primary};
  margin-bottom: 0.5rem;
`,vp=p.div`
  color: ${e=>e.theme.textSecondary};
  font-size: 1rem;
  font-weight: 500;
`,zp=p.div`
  font-size: 0.875rem;
  margin-top: 0.5rem;
  color: ${e=>e.change>=0?"#10b981":"#ef4444"};
`,$p=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`,Sp=p.div`
  background: ${e=>e.theme.surface};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: ${e=>e.theme.shadow};
`,Cp=p.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${e=>e.theme.text};
`,Np=p.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${e=>e.theme.background};
  border-radius: 8px;
  color: ${e=>e.theme.textSecondary};
  font-size: 1.1rem;
`,Pp=p.div`
  background: ${e=>e.theme.surface};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: ${e=>e.theme.shadow};
`,Bp=p.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${e=>e.theme.text};
`,Ap=p.table`
  width: 100%;
  border-collapse: collapse;
`,Tp=p.th`
  text-align: left;
  padding: 1rem;
  border-bottom: 2px solid ${e=>e.theme.border};
  color: ${e=>e.theme.text};
  font-weight: 600;
`,Mp=p.td`
  padding: 1rem;
  border-bottom: 1px solid ${e=>e.theme.border};
  color: ${e=>e.theme.text};
`,Lp=p.tr`
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.primary}10;
  }
`,Ep=p.span`
  background: ${e=>"success"===e.variant?"#10b981":"warning"===e.variant?"#f59e0b":"#ef4444"};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`,Wp=p.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: ${e=>e.theme.textSecondary};
`,Dp=p.div`
  background: ${e=>e.theme.error}20;
  color: ${e=>e.theme.error};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;function Op(){const[e,t]=i.useState(!0),[r,o]=i.useState(null),[a,n]=i.useState({totalLocations:0,activeLocations:0,totalPopulation:0,averagePopulation:0,topVoivodeship:null,recentActivity:0}),[s,d]=i.useState([]),[c,l]=i.useState([]);i.useEffect(()=>{m()},[]);const m=async()=>{try{t(!0);const e="http://localhost:5000",r=await fetch(`${e}/api/locations/analytics`);if(!r.ok)throw new Error("Błąd podczas pobierania danych analitycznych");const i=await r.json();n(i.stats),d(i.topLocations||[]),l(i.activityData||[])}catch(e){o(e.message),n({totalLocations:2477,activeLocations:2477,totalPopulation:38168e3,averagePopulation:15400,topVoivodeship:"Mazowieckie",recentActivity:156}),d([{name:"Warszawa",population:1783321,type:"miasto",voivodeship:"Mazowieckie"},{name:"Kraków",population:779115,type:"miasto",voivodeship:"Małopolskie"},{name:"Łódź",population:677286,type:"miasto",voivodeship:"Łódzkie"},{name:"Wrocław",population:674079,type:"miasto",voivodeship:"Dolnośląskie"},{name:"Poznań",population:534813,type:"miasto",voivodeship:"Wielkopolskie"}]),l([{date:"2024-01-15",count:12,type:"Dodano"},{date:"2024-01-14",count:8,type:"Zaktualizowano"},{date:"2024-01-13",count:15,type:"Dodano"},{date:"2024-01-12",count:6,type:"Zaktualizowano"},{date:"2024-01-11",count:10,type:"Dodano"}])}finally{t(!1)}};return e?w.jsx(gp,{children:w.jsx(Wp,{children:"Ładowanie analityki..."})}):w.jsxs(gp,{children:[w.jsx(jp,{children:w.jsx(yp,{children:"📊 Analityka Lokalizacji"})}),r&&w.jsx(Dp,{children:r}),w.jsxs(bp,{children:[w.jsxs(fp,{children:[w.jsx(wp,{children:"📍"}),w.jsx(kp,{children:a.totalLocations.toLocaleString()}),w.jsx(vp,{children:"Wszystkie lokalizacje"}),w.jsx(zp,{change:5,children:"+5% w tym miesiącu"})]}),w.jsxs(fp,{children:[w.jsx(wp,{children:"✅"}),w.jsx(kp,{children:a.activeLocations.toLocaleString()}),w.jsx(vp,{children:"Aktywne lokalizacje"}),w.jsx(zp,{change:2,children:"+2% w tym miesiącu"})]}),w.jsxs(fp,{children:[w.jsx(wp,{children:"👥"}),w.jsxs(kp,{children:[(a.totalPopulation/1e6).toFixed(1),"M"]}),w.jsx(vp,{children:"Łączna populacja"}),w.jsx(zp,{change:.5,children:"+0.5% w tym roku"})]}),w.jsxs(fp,{children:[w.jsx(wp,{children:"📈"}),w.jsx(kp,{children:a.averagePopulation.toLocaleString()}),w.jsx(vp,{children:"Średnia populacja"}),w.jsx(zp,{change:-1,children:"-1% w tym roku"})]}),w.jsxs(fp,{children:[w.jsx(wp,{children:"🏆"}),w.jsx(kp,{children:a.topVoivodeship}),w.jsx(vp,{children:"Największe województwo"}),w.jsx(zp,{change:0,children:"Bez zmian"})]}),w.jsxs(fp,{children:[w.jsx(wp,{children:"🔄"}),w.jsx(kp,{children:a.recentActivity}),w.jsx(vp,{children:"Ostatnia aktywność"}),w.jsx(zp,{change:12,children:"+12 dzisiaj"})]})]}),w.jsxs($p,{children:[w.jsxs(Sp,{children:[w.jsx(Cp,{children:"Rozkład populacji według województw"}),w.jsx(Np,{children:"📊 Wykres będzie dostępny po integracji z biblioteką wykresów"})]}),w.jsxs(Sp,{children:[w.jsx(Cp,{children:"Aktywność w ostatnich dniach"}),w.jsx(Np,{children:"📈 Wykres będzie dostępny po integracji z biblioteką wykresów"})]})]}),w.jsxs(Pp,{children:[w.jsx(Bp,{children:"Top 5 największych miast"}),w.jsxs(Ap,{children:[w.jsx("thead",{children:w.jsxs("tr",{children:[w.jsx(Tp,{children:"Pozycja"}),w.jsx(Tp,{children:"Nazwa"}),w.jsx(Tp,{children:"Populacja"}),w.jsx(Tp,{children:"Typ"}),w.jsx(Tp,{children:"Województwo"}),w.jsx(Tp,{children:"Status"})]})}),w.jsx("tbody",{children:s.map((e,t)=>w.jsxs(Lp,{children:[w.jsxs(Mp,{children:["#",t+1]}),w.jsx(Mp,{children:e.name}),w.jsx(Mp,{children:e.population.toLocaleString()}),w.jsx(Mp,{children:e.type}),w.jsx(Mp,{children:e.voivodeship}),w.jsx(Mp,{children:w.jsx(Ep,{variant:"success",children:"Aktywna"})})]},t))})]})]}),w.jsxs(Pp,{style:{marginTop:"2rem"},children:[w.jsx(Bp,{children:"Ostatnia aktywność"}),w.jsxs(Ap,{children:[w.jsx("thead",{children:w.jsxs("tr",{children:[w.jsx(Tp,{children:"Data"}),w.jsx(Tp,{children:"Liczba operacji"}),w.jsx(Tp,{children:"Typ"}),w.jsx(Tp,{children:"Status"})]})}),w.jsx("tbody",{children:c.map((e,t)=>w.jsxs(Lp,{children:[w.jsx(Mp,{children:e.date}),w.jsx(Mp,{children:e.count}),w.jsx(Mp,{children:e.type}),w.jsx(Mp,{children:w.jsx(Ep,{variant:"Dodano"===e.type?"success":"warning",children:e.type})})]},t))})]})]})]})}const Ip=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`,Fp=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`,_p=p.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`,Rp=p.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${e=>e.theme.border};
  overflow-x: auto;
`,Zp=p.button`
  padding: 1rem 2rem;
  border: none;
  background: ${e=>e.active?e.theme.primary:"transparent"};
  color: ${e=>e.active?"white":e.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  border-radius: 8px 8px 0 0;
  white-space: nowrap;
  
  &:hover {
    background: ${e=>(e.active,e.theme.primary)}20;
  }
`,Hp=p.div`
  background: ${e=>e.theme.surface};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: ${e=>e.theme.shadow};
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`,Up=p.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${e=>e.theme.text};
`,Kp=p.div`
  border: 2px dashed ${e=>e.theme.border};
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: ${e=>e.theme.primary};
    background: ${e=>e.theme.primary}10;
  }
  
  ${e=>e.isDragOver&&`\n    border-color: ${e.theme.primary};\n    background: ${e.theme.primary}20;\n  `}
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`,Yp=p.input`
  display: none;
`,Vp=p.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`,qp=p.div`
  font-size: 1.1rem;
  color: ${e=>e.theme.textSecondary};
  margin-bottom: 0.5rem;
`,Gp=p.div`
  font-size: 0.875rem;
  color: ${e=>e.theme.textSecondary};
`,Jp=p.div`
  background: ${e=>e.theme.primary}20;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`,Xp=p.div`
  font-size: 1.5rem;
`,Qp=p.div`
  flex: 1;
`,ex=p.div`
  font-weight: 600;
  color: ${e=>e.theme.text};
`,tx=p.div`
  font-size: 0.875rem;
  color: ${e=>e.theme.textSecondary};
`,rx=p.div`
  font-size: 0.875rem;
  margin-top: 0.5rem;
  
  ${e=>e.isValid&&`\n    color: ${e.theme.success};\n  `}
  
  ${e=>!e.isValid&&`\n    color: ${e.theme.error};\n  `}
`,ix=p.button`
  background: ${e=>e.theme.error};
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  
  &:hover {
    background: ${e=>e.theme.error}dd;
  }
`,ox=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`,ax=p.div`
  background: ${e=>e.theme.background};
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid ${e=>e.theme.border};
`,nx=p.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${e=>e.theme.text};
`,sx=p.p`
  color: ${e=>e.theme.textSecondary};
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`,dx=p.input`
  margin-right: 0.5rem;
`,cx=p.label`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: ${e=>e.theme.text};
  cursor: pointer;
`,lx=p.select`
  margin-left: 0.5rem;
  padding: 0.25rem;
  border: 1px solid ${e=>e.theme.border};
  border-radius: 4px;
  background: ${e=>e.theme.surface};
  color: ${e=>e.theme.text};
  font-size: 0.875rem;
`,mx=p.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`,hx=p.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${e=>"primary"===e.variant&&`\n    background: ${e.theme.gradient};\n    color: white;\n    \n    &:hover {\n      background: ${e.theme.gradientHover};\n      transform: translateY(-2px);\n      box-shadow: ${e.theme.shadowHover};\n    }\n  `}
  
  ${e=>"secondary"===e.variant&&`\n    background: ${e.theme.surface};\n    color: ${e.theme.text};\n    border: 2px solid ${e.theme.border};\n    \n    &:hover {\n      background: ${e.theme.primary}20;\n      border-color: ${e.theme.primary};\n    }\n  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`,px=p.div`
  margin-top: 2rem;
`,xx=p.div`
  width: 100%;
  height: 8px;
  background: ${e=>e.theme.border};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
`,ux=p.div`
  height: 100%;
  background: ${e=>e.theme.gradient};
  width: ${e=>e.progress}%;
  transition: width 0.3s ease;
`,gx=p.div`
  text-align: center;
  color: ${e=>e.theme.textSecondary};
  font-size: 0.875rem;
`,jx=p.div`
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  font-weight: 500;
  
  ${e=>"success"===e.type&&`\n    background: ${e.theme.success}20;\n    color: ${e.theme.success};\n  `}
  
  ${e=>"error"===e.type&&`\n    background: ${e.theme.error}20;\n    color: ${e.theme.error};\n  `}
  
  ${e=>"info"===e.type&&`\n    background: ${e.theme.primary}20;\n    color: ${e.theme.primary};\n  `}
`,yx=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`,bx=p.div`
  background: ${e=>e.theme.surface};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: ${e=>e.theme.shadow};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
`,fx=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,wx=p.div`
  font-weight: 600;
  color: ${e=>e.theme.text};
`,kx=p.div`
  font-size: 0.875rem;
  color: ${e=>e.theme.textSecondary};
`,vx=p.div`
  color: ${e=>e.theme.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`,zx=p.div`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${e=>"completed"===e.status&&`\n    background: ${e.theme.success}20;\n    color: ${e.theme.success};\n  `}
  
  ${e=>"processing"===e.status&&`\n    background: ${e.theme.warning}20;\n    color: ${e.theme.warning};\n  `}
  
  ${e=>"failed"===e.status&&`\n    background: ${e.theme.error}20;\n    color: ${e.theme.error};\n  `}
`,$x=p.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${e=>e.theme.textSecondary};
`,Sx=p.div`
  background: ${e=>e.theme.error}20;
  color: ${e=>e.theme.error};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`,Cx=p.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${e=>e.theme.textSecondary};
`,Nx=e=>{if(0===e)return"0 Bytes";const t=Math.floor(Math.log(e)/Math.log(1024));return parseFloat((e/Math.pow(1024,t)).toFixed(2))+" "+["Bytes","KB","MB","GB"][t]};function Px(){const{isAuthenticated:e}=N(),[t,r]=i.useState("import"),[o,a]=i.useState(null),[n,s]=i.useState(!1),[d,c]=i.useState(!1),[l,m]=i.useState(0),[h,p]=i.useState(null),[x,u]=i.useState({isValid:!1,errors:[]}),[g,j]=i.useState([]),[y,b]=i.useState(!1),[f,k]=i.useState(null),v=i.useRef(null),[z,$]=i.useState({updateExisting:!0,validateData:!0,createBackup:!0,skipDuplicates:!1,batchSize:100,encoding:"utf8",delimiter:",",createMissingParents:!0});i.useEffect(()=>{e&&"history"===t&&S()},[e,t]);const S=async()=>{try{b(!0),k(null);const e="http://localhost:5000",t=localStorage.getItem("token"),r=await fetch(`${e}/api/locations/import/history`,{headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"}});if(!r.ok)throw new Error("Błąd pobierania historii importów");const i=await r.json();j(i.history||i||[])}catch(e){k(e.message),j([{_id:"1",filename:"lokalizacje.csv",format:"csv",status:"completed",recordsImported:1250,recordsSkipped:15,createdAt:new Date(Date.now()-864e5).toISOString(),fileSize:"2.5 MB"},{_id:"2",filename:"powiaty.xml",format:"xml",status:"completed",recordsImported:380,recordsSkipped:0,createdAt:new Date(Date.now()-1728e5).toISOString(),fileSize:"1.2 MB"},{_id:"3",filename:"gminy.csv",format:"csv",status:"failed",error:"Błąd walidacji danych",createdAt:new Date(Date.now()-2592e5).toISOString(),fileSize:"3.1 MB"}])}finally{b(!1)}},C=e=>{const t=(e=>{const t=[];return e.size>52428800&&t.push("Plik jest za duży. Maksymalny rozmiar to 50MB."),["text/csv","application/xml","text/xml"].includes(e.type)||[".csv",".xml"].some(t=>e.name.toLowerCase().endsWith(t))||t.push("Nieobsługiwany format pliku. Dozwolone są tylko pliki CSV i XML."),{isValid:0===t.length,errors:t}})(e);u(t),t.isValid?(a(e),p({type:"info",message:`Wybrano plik: ${e.name}`})):(a(null),p({type:"error",message:t.errors.join(", ")}))},P=(e,t)=>{$(r=>({...r,[e]:t}))},B=e=>{switch(e){case"completed":return"Zakończony";case"processing":return"W trakcie";case"failed":return"Nieudany";default:return e}};return e?w.jsxs(Ip,{children:[w.jsx(Fp,{children:w.jsx(_p,{children:"📥 Import Lokalizacji"})}),w.jsxs(Rp,{children:[w.jsx(Zp,{active:"import"===t,onClick:()=>r("import"),children:"📥 Nowy import"}),w.jsx(Zp,{active:"history"===t,onClick:()=>r("history"),children:"📋 Historia importów"})]}),f&&w.jsx(Sx,{children:f}),"import"===t&&w.jsxs(w.Fragment,{children:[w.jsxs(Hp,{children:[w.jsx(Up,{children:"Wybierz plik do importu"}),w.jsxs(Kp,{isDragOver:n,onDragOver:e=>{e.preventDefault(),s(!0)},onDragLeave:e=>{e.preventDefault(),s(!1)},onDrop:e=>{e.preventDefault(),s(!1);const t=e.dataTransfer.files;t.length>0&&C(t[0])},onClick:()=>v.current?.click(),children:[w.jsx(Yp,{ref:v,type:"file",accept:".csv,.xml",onChange:e=>e.target.files[0]&&C(e.target.files[0])}),w.jsx(Vp,{children:"📁"}),w.jsx(qp,{children:"Przeciągnij plik tutaj lub kliknij aby wybrać"}),w.jsx(Gp,{children:"Obsługiwane formaty: CSV, XML (maks. 50MB)"})]}),o&&w.jsxs(Jp,{children:[w.jsx(Xp,{children:"📄"}),w.jsxs(Qp,{children:[w.jsx(ex,{children:o.name}),w.jsx(tx,{children:Nx(o.size)}),w.jsx(rx,{isValid:x.isValid,children:x.isValid?"✅ Plik jest poprawny":`❌ ${x.errors.join(", ")}`})]}),w.jsx(ix,{onClick:()=>{a(null),u({isValid:!1,errors:[]}),p(null),v.current&&(v.current.value="")},children:"🗑️"})]})]}),w.jsxs(Hp,{children:[w.jsx(Up,{children:"Opcje importu"}),w.jsxs(ox,{children:[w.jsxs(ax,{children:[w.jsx(nx,{children:"Zachowanie danych"}),w.jsx(sx,{children:"Wybierz jak system ma obsługiwać istniejące dane podczas importu"}),w.jsxs(cx,{children:[w.jsx(dx,{type:"checkbox",checked:z.updateExisting,onChange:e=>P("updateExisting",e.target.checked)}),"Aktualizuj istniejące rekordy"]}),w.jsxs(cx,{children:[w.jsx(dx,{type:"checkbox",checked:z.skipDuplicates,onChange:e=>P("skipDuplicates",e.target.checked)}),"Pomiń duplikaty"]}),w.jsxs(cx,{children:[w.jsx(dx,{type:"checkbox",checked:z.createMissingParents,onChange:e=>P("createMissingParents",e.target.checked)}),"Utwórz brakujące lokalizacje nadrzędne"]})]}),w.jsxs(ax,{children:[w.jsx(nx,{children:"Walidacja i bezpieczeństwo"}),w.jsx(sx,{children:"Opcje związane z weryfikacją danych i bezpieczeństwem"}),w.jsxs(cx,{children:[w.jsx(dx,{type:"checkbox",checked:z.validateData,onChange:e=>P("validateData",e.target.checked)}),"Waliduj dane przed importem"]}),w.jsxs(cx,{children:[w.jsx(dx,{type:"checkbox",checked:z.createBackup,onChange:e=>P("createBackup",e.target.checked)}),"Utwórz kopię zapasową"]})]}),w.jsxs(ax,{children:[w.jsx(nx,{children:"Wydajność"}),w.jsx(sx,{children:"Ustawienia wpływające na szybkość i wydajność importu"}),w.jsxs(cx,{children:["Rozmiar partii:",w.jsxs(lx,{value:z.batchSize,onChange:e=>P("batchSize",parseInt(e.target.value)),children:[w.jsx("option",{value:50,children:"50"}),w.jsx("option",{value:100,children:"100"}),w.jsx("option",{value:200,children:"200"}),w.jsx("option",{value:500,children:"500"})]})]}),w.jsxs(cx,{children:["Kodowanie:",w.jsxs(lx,{value:z.encoding,onChange:e=>P("encoding",e.target.value),children:[w.jsx("option",{value:"utf8",children:"UTF-8"}),w.jsx("option",{value:"iso-8859-2",children:"ISO-8859-2"}),w.jsx("option",{value:"windows-1250",children:"Windows-1250"})]})]}),w.jsxs(cx,{children:["Separator (CSV):",w.jsxs(lx,{value:z.delimiter,onChange:e=>P("delimiter",e.target.value),children:[w.jsx("option",{value:",",children:"Przecinek (,)"}),w.jsx("option",{value:";",children:"Średnik (;)"}),w.jsx("option",{value:"\\t",children:"Tabulator"})]})]})]})]}),w.jsxs(mx,{children:[w.jsx(hx,{variant:"primary",onClick:async()=>{if(o)if(x.isValid){c(!0),m(0),p({type:"info",message:"Rozpoczynanie importu..."}),k(null);try{const e=new FormData;e.append("file",o),e.append("options",JSON.stringify(z));const t="http://localhost:5000",r=localStorage.getItem("token"),i=await fetch(`${t}/api/locations/import`,{method:"POST",headers:{Authorization:`Bearer ${r}`},body:e});if(!i.ok)throw new Error("Błąd podczas importu");const a=await i.json(),n=setInterval(()=>{m(e=>e>=100?(clearInterval(n),c(!1),p({type:"success",message:`Import zakończony pomyślnie! Zaimportowano ${a.importedCount||0} rekordów.`}),100):e+10)},200)}catch(e){c(!1),k(e.message),p({type:"error",message:`Błąd importu: ${e.message}`})}}else p({type:"error",message:"Plik nie przeszedł walidacji"});else p({type:"error",message:"Proszę wybrać plik do importu"})},disabled:!o||!x.isValid||d,children:d?"🔄 Importowanie...":"🚀 Rozpocznij import"}),d&&w.jsx(hx,{variant:"secondary",onClick:()=>{c(!1),m(0),p({type:"info",message:"Import anulowany"})},children:"❌ Anuluj"})]}),d&&w.jsxs(px,{children:[w.jsx(xx,{children:w.jsx(ux,{progress:l})}),w.jsxs(gx,{children:[l,"% ukończono"]})]}),h&&w.jsx(jx,{type:h.type,children:h.message})]})]}),"history"===t&&w.jsx(w.Fragment,{children:y?w.jsxs($x,{children:[w.jsx("div",{style:{fontSize:"2rem",marginBottom:"1rem"},children:"⏳"}),w.jsx("p",{children:"Ładowanie historii importów..."})]}):0===g.length?w.jsxs(Cx,{children:[w.jsx("div",{style:{fontSize:"4rem",marginBottom:"1rem"},children:"📋"}),w.jsx("h3",{children:"Brak historii importów"}),w.jsx("p",{children:"Nie masz jeszcze żadnych importów"})]}):w.jsx(yx,{children:g.map(e=>{return w.jsxs(bx,{children:[w.jsxs(fx,{children:[w.jsxs(wx,{children:[(r=e.format,{csv:"📄",xml:"📋"}[r]||"📁")," ",e.filename]}),w.jsx(zx,{status:e.status,children:B(e.status)})]}),w.jsxs(vx,{children:[w.jsxs("div",{children:["Format: ",e.format.toUpperCase()]}),w.jsxs("div",{children:["Rozmiar: ",e.fileSize]}),e.recordsImported&&w.jsxs("div",{children:["Zaimportowano: ",e.recordsImported," rekordów"]}),e.recordsSkipped&&w.jsxs("div",{children:["Pominięto: ",e.recordsSkipped," rekordów"]}),e.error&&w.jsxs("div",{children:["Błąd: ",e.error]})]}),w.jsx(kx,{children:(t=e.createdAt,new Date(t).toLocaleDateString("pl-PL",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"}))})]},e._id||e.id);var t,r})})})]}):w.jsx(Ip,{children:w.jsxs(Cx,{children:[w.jsx("div",{style:{fontSize:"4rem",marginBottom:"1rem"},children:"🔐"}),w.jsx("h3",{children:"Zaloguj się"}),w.jsx("p",{children:"Musisz być zalogowany, aby korzystać z importu danych"})]})})}const Bx=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`,Ax=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`,Tx=p.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`,Mx=p.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${e=>e.theme.border};
  overflow-x: auto;
`,Lx=p.button`
  padding: 1rem 2rem;
  border: none;
  background: ${e=>e.active?e.theme.primary:"transparent"};
  color: ${e=>e.active?"white":e.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  border-radius: 8px 8px 0 0;
  white-space: nowrap;
  
  &:hover {
    background: ${e=>(e.active,e.theme.primary)}20;
  }
`,Ex=p.div`
  background: ${e=>e.theme.surface};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: ${e=>e.theme.shadow};
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`,Wx=p.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${e=>e.theme.text};
`,Dx=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`,Ox=p.div`
  background: ${e=>e.theme.background};
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid ${e=>e.theme.border};
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${e=>e.theme.primary};
    transform: translateY(-2px);
  }
`,Ix=p.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${e=>e.theme.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`,Fx=p.p`
  color: ${e=>e.theme.textSecondary};
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`,_x=p.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`,Rx=p.label`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: ${e=>e.theme.text};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.primary}10;
  }
`,Zx=p.input`
  margin-right: 0.5rem;
`,Hx=p.input`
  margin-right: 0.5rem;
`,Ux=p.label`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: ${e=>e.theme.text};
  cursor: pointer;
`,Kx=p.select`
  width: 100%;
  padding: 0.5rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 4px;
  background: ${e=>e.theme.surface};
  color: ${e=>e.theme.text};
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
  }
`,Yx=p.input`
  width: 100%;
  padding: 0.5rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 4px;
  background: ${e=>e.theme.surface};
  color: ${e=>e.theme.text};
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
  }
`,Vx=p.div`
  margin-bottom: 1rem;
`,qx=p.h4`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${e=>e.theme.text};
`,Gx=p.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`,Jx=p.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${e=>"primary"===e.variant&&`\n    background: ${e.theme.gradient};\n    color: white;\n    \n    &:hover {\n      background: ${e.theme.gradientHover};\n      transform: translateY(-2px);\n      box-shadow: ${e.theme.shadowHover};\n    }\n  `}
  
  ${e=>"secondary"===e.variant&&`\n    background: ${e.theme.surface};\n    color: ${e.theme.text};\n    border: 2px solid ${e.theme.border};\n    \n    &:hover {\n      background: ${e.theme.primary}20;\n      border-color: ${e.theme.primary};\n    }\n  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`,Xx=p.a`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  background: ${e=>e.theme.success};
  color: white;
  
  &:hover {
    background: ${e=>e.theme.success}dd;
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
`,Qx=p.div`
  margin-top: 2rem;
`,eu=p.div`
  width: 100%;
  height: 8px;
  background: ${e=>e.theme.border};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
`,tu=p.div`
  height: 100%;
  background: ${e=>e.theme.gradient};
  width: ${e=>e.progress}%;
  transition: width 0.3s ease;
`,ru=p.div`
  text-align: center;
  color: ${e=>e.theme.textSecondary};
  font-size: 0.875rem;
`,iu=p.div`
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  font-weight: 500;
  
  ${e=>"success"===e.type&&`\n    background: ${e.theme.success}20;\n    color: ${e.theme.success};\n  `}
  
  ${e=>"error"===e.type&&`\n    background: ${e.theme.error}20;\n    color: ${e.theme.error};\n  `}
  
  ${e=>"info"===e.type&&`\n    background: ${e.theme.primary}20;\n    color: ${e.theme.primary};\n  `}
`,ou=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`,au=p.div`
  background: ${e=>e.theme.surface};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: ${e=>e.theme.shadow};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
`,nu=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,su=p.div`
  font-weight: 600;
  color: ${e=>e.theme.text};
`,du=p.div`
  font-size: 0.875rem;
  color: ${e=>e.theme.textSecondary};
`,cu=p.div`
  color: ${e=>e.theme.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`,lu=p.div`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${e=>"completed"===e.status&&`\n    background: ${e.theme.success}20;\n    color: ${e.theme.success};\n  `}
  
  ${e=>"processing"===e.status&&`\n    background: ${e.theme.warning}20;\n    color: ${e.theme.warning};\n  `}
  
  ${e=>"failed"===e.status&&`\n    background: ${e.theme.error}20;\n    color: ${e.theme.error};\n  `}
`,mu=p.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${e=>e.theme.textSecondary};
`,hu=p.div`
  background: ${e=>e.theme.error}20;
  color: ${e=>e.theme.error};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`,pu=p.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${e=>e.theme.textSecondary};
`;function xu(){const{isAuthenticated:e}=N(),[t,r]=i.useState("export"),[o,a]=i.useState(!1),[n,s]=i.useState(0),[d,c]=i.useState(null),[l,m]=i.useState(null),[h,p]=i.useState([]),[x,u]=i.useState([]),[g,j]=i.useState(!1),[y,b]=i.useState(null),[f,k]=i.useState({format:"csv",includeHeaders:!0,encoding:"utf8",compression:!1,includeStats:!0,includeRelations:!1}),[v,z]=i.useState({voivodeship:"all",county:"all",type:"all",active:"all",dateFrom:"",dateTo:"",populationMin:"",populationMax:""});i.useEffect(()=>{e&&($(),"history"===t&&S())},[e,t]);const $=async()=>{try{j(!0),b(null);const e="http://localhost:5000",t=localStorage.getItem("token"),r=await fetch(`${e}/api/locations/voivodeships`,{headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"}});if(!r.ok)throw new Error("Błąd pobierania województw");const i=await r.json();p(i.voivodeships||i||[])}catch(e){b(e.message),p([{id:"02",name:"Dolnośląskie"},{id:"04",name:"Kujawsko-pomorskie"},{id:"06",name:"Lubelskie"},{id:"08",name:"Lubuskie"},{id:"10",name:"Łódzkie"},{id:"12",name:"Małopolskie"},{id:"14",name:"Mazowieckie"},{id:"16",name:"Opolskie"},{id:"18",name:"Podkarpackie"},{id:"20",name:"Podlaskie"},{id:"22",name:"Pomorskie"},{id:"24",name:"Śląskie"},{id:"26",name:"Świętokrzyskie"},{id:"28",name:"Warmińsko-mazurskie"},{id:"30",name:"Wielkopolskie"},{id:"32",name:"Zachodniopomorskie"}])}finally{j(!1)}},S=async()=>{try{j(!0),b(null);const e="http://localhost:5000",t=localStorage.getItem("token"),r=await fetch(`${e}/api/locations/export/history`,{headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"}});if(!r.ok)throw new Error("Błąd pobierania historii eksportów");const i=await r.json();u(i.history||i||[])}catch(e){b(e.message),u([{_id:"1",format:"csv",filters:{voivodeship:"all",type:"all"},status:"completed",createdAt:new Date(Date.now()-864e5).toISOString(),downloadUrl:"#",fileSize:"2.5 MB"},{_id:"2",format:"json",filters:{voivodeship:"14",type:"gmina"},status:"completed",createdAt:new Date(Date.now()-1728e5).toISOString(),downloadUrl:"#",fileSize:"1.8 MB"},{_id:"3",format:"excel",filters:{voivodeship:"all",type:"all"},status:"failed",createdAt:new Date(Date.now()-2592e5).toISOString(),error:"Błąd serwera"}])}finally{j(!1)}},C=(e,t)=>{k(r=>({...r,[e]:t}))},P=(e,t)=>{z(r=>({...r,[e]:t}))},B=e=>{switch(e){case"completed":return"Zakończony";case"processing":return"W trakcie";case"failed":return"Nieudany";default:return e}};return e?w.jsxs(Bx,{children:[w.jsx(Ax,{children:w.jsx(Tx,{children:"📤 Eksport Lokalizacji"})}),w.jsxs(Mx,{children:[w.jsx(Lx,{active:"export"===t,onClick:()=>r("export"),children:"📤 Nowy eksport"}),w.jsx(Lx,{active:"history"===t,onClick:()=>r("history"),children:"📋 Historia eksportów"})]}),y&&w.jsx(hu,{children:y}),"export"===t&&w.jsxs(Ex,{children:[w.jsx(Wx,{children:"Format eksportu"}),w.jsxs(Dx,{children:[w.jsxs(Ox,{children:[w.jsx(Ix,{children:"📄 Format pliku"}),w.jsx(Fx,{children:"Wybierz format w jakim chcesz wyeksportować dane"}),w.jsxs(_x,{children:[w.jsxs(Rx,{children:[w.jsx(Zx,{type:"radio",name:"format",value:"csv",checked:"csv"===f.format,onChange:e=>C("format",e.target.value)}),"CSV (Comma Separated Values)"]}),w.jsxs(Rx,{children:[w.jsx(Zx,{type:"radio",name:"format",value:"json",checked:"json"===f.format,onChange:e=>C("format",e.target.value)}),"JSON (JavaScript Object Notation)"]}),w.jsxs(Rx,{children:[w.jsx(Zx,{type:"radio",name:"format",value:"xml",checked:"xml"===f.format,onChange:e=>C("format",e.target.value)}),"XML (Extensible Markup Language)"]}),w.jsxs(Rx,{children:[w.jsx(Zx,{type:"radio",name:"format",value:"excel",checked:"excel"===f.format,onChange:e=>C("format",e.target.value)}),"Excel (XLSX)"]})]})]}),w.jsxs(Ox,{children:[w.jsx(Ix,{children:"⚙️ Opcje eksportu"}),w.jsx(Fx,{children:"Dodatkowe opcje konfiguracji eksportu"}),w.jsxs(Ux,{children:[w.jsx(Hx,{type:"checkbox",checked:f.includeHeaders,onChange:e=>C("includeHeaders",e.target.checked)}),"Dołącz nagłówki kolumn"]}),w.jsxs(Ux,{children:[w.jsx(Hx,{type:"checkbox",checked:f.includeStats,onChange:e=>C("includeStats",e.target.checked)}),"Dołącz statystyki"]}),w.jsxs(Ux,{children:[w.jsx(Hx,{type:"checkbox",checked:f.includeRelations,onChange:e=>C("includeRelations",e.target.checked)}),"Dołącz relacje między lokalizacjami"]}),w.jsxs(Ux,{children:[w.jsx(Hx,{type:"checkbox",checked:f.compression,onChange:e=>C("compression",e.target.checked)}),"Kompresuj plik (ZIP)"]}),w.jsxs(Vx,{children:[w.jsx(qx,{children:"Kodowanie:"}),w.jsxs(Kx,{value:f.encoding,onChange:e=>C("encoding",e.target.value),children:[w.jsx("option",{value:"utf8",children:"UTF-8"}),w.jsx("option",{value:"iso-8859-2",children:"ISO-8859-2 (Latin-2)"}),w.jsx("option",{value:"windows-1250",children:"Windows-1250"})]})]})]}),w.jsxs(Ox,{children:[w.jsx(Ix,{children:"🔍 Filtry danych"}),w.jsx(Fx,{children:"Wybierz jakie dane chcesz wyeksportować"}),w.jsxs(Vx,{children:[w.jsx(qx,{children:"Województwo:"}),w.jsxs(Kx,{value:v.voivodeship,onChange:e=>P("voivodeship",e.target.value),children:[w.jsx("option",{value:"all",children:"Wszystkie"}),h.map(e=>w.jsx("option",{value:e.id,children:e.name},e.id))]})]}),w.jsxs(Vx,{children:[w.jsx(qx,{children:"Typ lokalizacji:"}),w.jsxs(Kx,{value:v.type,onChange:e=>P("type",e.target.value),children:[w.jsx("option",{value:"all",children:"Wszystkie"}),w.jsx("option",{value:"województwo",children:"Województwa"}),w.jsx("option",{value:"powiat",children:"Powiaty"}),w.jsx("option",{value:"gmina",children:"Gminy"}),w.jsx("option",{value:"miasto",children:"Miasta"})]})]}),w.jsxs(Vx,{children:[w.jsx(qx,{children:"Status:"}),w.jsxs(Kx,{value:v.active,onChange:e=>P("active",e.target.value),children:[w.jsx("option",{value:"all",children:"Wszystkie"}),w.jsx("option",{value:"true",children:"Aktywne"}),w.jsx("option",{value:"false",children:"Nieaktywne"})]})]}),w.jsxs(Vx,{children:[w.jsx(qx,{children:"Liczba mieszkańców (min):"}),w.jsx(Yx,{type:"number",placeholder:"np. 1000",value:v.populationMin,onChange:e=>P("populationMin",e.target.value)})]}),w.jsxs(Vx,{children:[w.jsx(qx,{children:"Liczba mieszkańców (max):"}),w.jsx(Yx,{type:"number",placeholder:"np. 100000",value:v.populationMax,onChange:e=>P("populationMax",e.target.value)})]})]})]}),w.jsxs(Gx,{children:[w.jsx(Jx,{variant:"primary",onClick:async()=>{a(!0),s(0),c({type:"info",message:"Przygotowywanie eksportu..."}),m(null),b(null);try{const e="http://localhost:5000",t=localStorage.getItem("token"),r=await fetch(`${e}/api/locations/export`,{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify({options:f,filters:v})});if(!r.ok)throw new Error("Błąd podczas eksportu");const i=await r.json(),o=setInterval(()=>{s(e=>e>=100?(clearInterval(o),a(!1),c({type:"success",message:"Eksport zakończony pomyślnie!"}),m(i.downloadUrl||`data:text/csv;charset=utf-8,${encodeURIComponent("Nazwa,Kod,Typ,Województwo\nWarszawa,1465011,miasto,Mazowieckie\nKraków,1261011,miasto,Małopolskie")}`),100):e+10)},200)}catch(e){a(!1),b(e.message),c({type:"error",message:`Błąd eksportu: ${e.message}`})}},disabled:o,children:o?"🔄 Eksportowanie...":"📤 Rozpocznij eksport"}),o&&w.jsx(Jx,{variant:"secondary",onClick:()=>{a(!1),s(0),c({type:"info",message:"Eksport anulowany"})},children:"❌ Anuluj"}),l&&w.jsx(Xx,{href:l,download:`lokalizacje_${(new Date).toISOString().split("T")[0]}.${f.format}`,children:"💾 Pobierz plik"})]}),o&&w.jsxs(Qx,{children:[w.jsx(eu,{children:w.jsx(tu,{progress:n})}),w.jsxs(ru,{children:[n,"% ukończono"]})]}),d&&w.jsx(iu,{type:d.type,children:d.message})]}),"history"===t&&w.jsx(w.Fragment,{children:g?w.jsxs(mu,{children:[w.jsx("div",{style:{fontSize:"2rem",marginBottom:"1rem"},children:"⏳"}),w.jsx("p",{children:"Ładowanie historii eksportów..."})]}):0===x.length?w.jsxs(pu,{children:[w.jsx("div",{style:{fontSize:"4rem",marginBottom:"1rem"},children:"📋"}),w.jsx("h3",{children:"Brak historii eksportów"}),w.jsx("p",{children:"Nie masz jeszcze żadnych eksportów"})]}):w.jsx(ou,{children:x.map(e=>{return w.jsxs(au,{children:[w.jsxs(nu,{children:[w.jsxs(su,{children:[(r=e.format,{csv:"📄",json:"🔧",xml:"📋",excel:"📊"}[r]||"📁")," Eksport ",e.format.toUpperCase()]}),w.jsx(lu,{status:e.status,children:B(e.status)})]}),w.jsxs(cu,{children:[w.jsxs("div",{children:["Filtry: ","all"===e.filters.voivodeship?"Wszystkie województwa":`Województwo ${e.filters.voivodeship}`]}),w.jsxs("div",{children:["Typ: ","all"===e.filters.type?"Wszystkie":e.filters.type]}),e.fileSize&&w.jsxs("div",{children:["Rozmiar: ",e.fileSize]}),e.error&&w.jsxs("div",{children:["Błąd: ",e.error]})]}),w.jsx(du,{children:(t=e.createdAt,new Date(t).toLocaleDateString("pl-PL",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"}))}),e.downloadUrl&&"completed"===e.status&&w.jsx(Xx,{href:e.downloadUrl,download:`lokalizacje_${new Date(e.createdAt).toISOString().split("T")[0]}.${e.format}`,style:{marginTop:"1rem",justifyContent:"center"},children:"💾 Pobierz ponownie"})]},e._id||e.id);var t,r})})})]}):w.jsx(Bx,{children:w.jsxs(pu,{children:[w.jsx("div",{style:{fontSize:"4rem",marginBottom:"1rem"},children:"🔐"}),w.jsx("h3",{children:"Zaloguj się"}),w.jsx("p",{children:"Musisz być zalogowany, aby korzystać z eksportu danych"})]})})}const uu=p.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
`,gu=p.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`,ju=p.th`
  background: #f5f5f5;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 10;
`,yu=p.td`
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: top;
`,bu=p.tr`
  &:hover {
    background: #f8f9fa;
  }
`,fu=p.button`
  padding: 6px 12px;
  margin: 0 4px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  
  &.edit {
    background: #1976d2;
    color: white;
  }
  
  &.delete {
    background: #d32f2f;
    color: white;
  }
  
  &.view {
    background: #388e3c;
    color: white;
  }
`,wu=p.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
`,ku=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
`,vu=p.button`
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 4px;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.active {
    background: #1976d2;
    color: white;
    border-color: #1976d2;
  }
`,zu=p.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`,$u=p.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`,Su=p.div`
  margin-bottom: 16px;
`,Cu=p.label`
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
`,Nu=p.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;p.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
`;const Pu=p.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`,Bu=p.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &.primary {
    background: #1976d2;
    color: white;
  }
  
  &.secondary {
    background: #6c757d;
    color: white;
  }
`,Au=({collection:e,data:t,onEdit:r,onDelete:o,onView:a,onAdd:n,loading:s=!1,error:d=null})=>{const[c,l]=i.useState(""),[m,h]=i.useState(1),[p]=i.useState(10),[x,u]=i.useState(null),[g,j]=i.useState(!1),[y,b]=i.useState("view"),f=t.filter(e=>!c||Object.values(e).some(e=>String(e).toLowerCase().includes(c.toLowerCase()))),k=Math.ceil(f.length/p),v=(m-1)*p,z=v+p,$=f.slice(v,z),S=t.length>0?Object.keys(t[0]):[],C=e=>null==e?"-":"object"==typeof e?JSON.stringify(e):"boolean"==typeof e?e?"Tak":"Nie":"string"==typeof e&&e.length>50?e.substring(0,50)+"...":String(e);return s?w.jsx("div",{style:{textAlign:"center",padding:"40px"},children:"Ładowanie danych..."}):d?w.jsxs("div",{style:{color:"red",textAlign:"center",padding:"40px"},children:["Błąd: ",d]}):w.jsxs("div",{children:[w.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"},children:[w.jsxs("h3",{children:["Kolekcja: ",e]}),n&&w.jsx(Bu,{className:"primary",onClick:()=>{u({}),b("add"),j(!0)},children:"+ Dodaj nowy"})]}),w.jsx(wu,{type:"text",placeholder:"Wyszukaj...",value:c,onChange:e=>l(e.target.value)}),w.jsxs(uu,{children:[w.jsxs(gu,{children:[w.jsx("thead",{children:w.jsxs("tr",{children:[S.map(e=>w.jsx(ju,{children:e},e)),w.jsx(ju,{children:"Akcje"})]})}),w.jsx("tbody",{children:$.map((e,t)=>w.jsxs(bu,{children:[S.map(t=>w.jsx(yu,{children:C(e[t])},t)),w.jsxs(yu,{children:[a&&w.jsx(fu,{className:"view",onClick:()=>(e=>{u(e),b("view"),j(!0)})(e),children:"Podgląd"}),r&&w.jsx(fu,{className:"edit",onClick:()=>(e=>{u(e),b("edit"),j(!0)})(e),children:"Edytuj"}),o&&w.jsx(fu,{className:"delete",onClick:()=>(e=>{window.confirm("Czy na pewno chcesz usunąć ten element?")&&o(e)})(e),children:"Usuń"})]})]},e._id||t))})]}),w.jsxs(ku,{children:[w.jsxs("div",{children:["Pokazano ",v+1,"-",Math.min(z,f.length)," z ",f.length," elementów"]}),w.jsxs("div",{children:[w.jsx(vu,{onClick:()=>h(m-1),disabled:1===m,children:"Poprzednia"}),Array.from({length:k},(e,t)=>t+1).map(e=>w.jsx(vu,{onClick:()=>h(e),className:m===e?"active":"",children:e},e)),w.jsx(vu,{onClick:()=>h(m+1),disabled:m===k,children:"Następna"})]})]})]}),g&&w.jsx(zu,{onClick:()=>j(!1),children:w.jsxs($u,{onClick:e=>e.stopPropagation(),children:[w.jsx("h3",{children:"add"===y?"Dodaj nowy element":"edit"===y?"Edytuj element":"Podgląd elementu"}),Object.keys(x||{}).map(e=>w.jsxs(Su,{children:[w.jsx(Cu,{children:e}),"view"===y?w.jsx("div",{style:{padding:"8px 12px",background:"#f8f9fa",borderRadius:"4px"},children:C(x[e])}):w.jsx(Nu,{type:"text",value:x[e]||"",onChange:t=>u({...x,[e]:t.target.value}),disabled:"_id"===e})]},e)),w.jsxs(Pu,{children:[w.jsx(Bu,{className:"secondary",onClick:()=>j(!1),children:"Anuluj"}),"view"!==y&&w.jsx(Bu,{className:"primary",onClick:()=>{"edit"===y&&r?r(x):"add"===y&&n&&n(x),j(!1),u(null)},children:"Zapisz"})]})]})})]})},Tu=p.div`
  padding: 20px;
`,Mu=p.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`,Lu=p.button`
  padding: 10px 20px;
  border: 1px solid #ddd;
  background: ${e=>e.$active?"#1976d2":"white"};
  color: ${e=>e.$active?"white":"#333"};
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background: ${e=>e.$active?"#1565c0":"#f5f5f5"};
  }
`,Eu=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`,Wu=p.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
`,Du=p.div`
  font-size: 24px;
  font-weight: bold;
  color: #1976d2;
  margin-bottom: 4px;
`,Ou=p.div`
  color: #666;
  font-size: 14px;
`,Iu=p.div`
  background: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  border: 1px solid #ffcdd2;
`,Fu=p.div`
  background: #e8f5e8;
  color: #2e7d32;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  border: 1px solid #c8e6c9;
`,_u=()=>{const[e,t]=i.useState("users"),[r,o]=i.useState([]),[a,n]=i.useState(!1),[s,d]=i.useState(null),[c,l]=i.useState(null),[m,h]=i.useState({}),p=async e=>{n(!0),d(null);try{const t="http://localhost:5000",r=await fetch(`${t}/api/admin/${e}`);if(!r.ok)throw new Error(`HTTP error! status: ${r.status}`);const i=await r.json();o(i.data||[])}catch(t){d(`Błąd podczas ładowania danych: ${t.message}`),o([])}finally{n(!1)}};return i.useEffect(()=>{p(e),(async()=>{try{const e="http://localhost:5000",t=await fetch(`${e}/api/admin/stats`);if(t.ok){const e=await t.json();h(e)}}catch(e){}})()},[e]),i.useEffect(()=>{if(c){const e=setTimeout(()=>l(null),3e3);return()=>clearTimeout(e)}},[c]),i.useEffect(()=>{if(s){const e=setTimeout(()=>d(null),5e3);return()=>clearTimeout(e)}},[s]),w.jsxs(Tu,{children:[w.jsx("h2",{children:"Zarządzanie danymi"}),c&&w.jsx(Fu,{children:c}),s&&w.jsx(Iu,{children:s}),w.jsx(Eu,{children:Object.entries(m).map(([e,t])=>w.jsxs(Wu,{children:[w.jsx(Du,{children:t}),w.jsx(Ou,{children:e})]},e))}),w.jsx(Mu,{children:[{key:"users",label:"Użytkownicy",icon:"👥"},{key:"locations",label:"Lokalizacje",icon:"📍"},{key:"shops",label:"Sklepy",icon:"🏪"},{key:"products",label:"Produkty",icon:"📦"},{key:"posts",label:"Posty",icon:"📝"},{key:"messages",label:"Wiadomości",icon:"💬"},{key:"groups",label:"Grupy",icon:"👥"},{key:"reviews",label:"Recenzje",icon:"⭐"},{key:"notifications",label:"Powiadomienia",icon:"🔔"},{key:"achievements",label:"Osiągnięcia",icon:"🏆"},{key:"badges",label:"Odznaki",icon:"🎖️"},{key:"payments",label:"Płatności",icon:"💳"},{key:"orders",label:"Zamówienia",icon:"📋"}].map(r=>w.jsxs(Lu,{$active:e===r.key,onClick:()=>t(r.key),children:[r.icon," ",r.label]},r.key))}),w.jsx(Au,{collection:e,data:r,onEdit:async t=>{try{const r="http://localhost:5000";if(!(await fetch(`${r}/api/admin/${e}/${t._id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})).ok)throw new Error("Błąd podczas aktualizacji");l("Element został zaktualizowany pomyślnie!"),p(e)}catch(r){d(`Błąd podczas edycji: ${r.message}`)}},onDelete:async t=>{try{const r="http://localhost:5000";if(!(await fetch(`${r}/api/admin/${e}/${t._id}`,{method:"DELETE"})).ok)throw new Error("Błąd podczas usuwania");l("Element został usunięty pomyślnie!"),p(e)}catch(r){d(`Błąd podczas usuwania: ${r.message}`)}},onView:e=>{},onAdd:async t=>{try{const r="http://localhost:5000";if(!(await fetch(`${r}/api/admin/${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})).ok)throw new Error("Błąd podczas dodawania");l("Element został dodany pomyślnie!"),p(e)}catch(r){d(`Błąd podczas dodawania: ${r.message}`)}},loading:a,error:s})]})},Ru=p.div`
  padding: 20px;
`,Zu=p.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 24px;
  margin-bottom: 20px;
`,Hu=p.div`
  margin-bottom: 16px;
`,Uu=p.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`,Ku=p.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
`,Yu=p.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
`,Vu=p.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
`,qu=p.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  cursor: pointer;
`,Gu=p.input`
  margin: 0;
`,Ju=p.button`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  
  &.primary {
    background: #1976d2;
    color: white;
    
    &:hover {
      background: #1565c0;
    }
    
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
  
  &.secondary {
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #5a6268;
    }
  }
`,Xu=p.div`
  margin-top: 16px;
`,Qu=p.div`
  width: 100%;
  height: 20px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 8px;
`,eg=p.div`
  height: 100%;
  background: linear-gradient(90deg, #1976d2, #1565c0);
  width: ${e=>e.progress}%;
  transition: width 0.3s;
`,tg=p.div`
  text-align: center;
  font-size: 14px;
  color: #666;
`,rg=p.div`
  background: #1e1e1e;
  color: #00ff00;
  padding: 16px;
  border-radius: 6px;
  height: 200px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  margin-top: 16px;
`,ig=p.div`
  margin-bottom: 4px;
  
  &.error {
    color: #ff6b6b;
  }
  
  &.success {
    color: #51cf66;
  }
  
  &.warning {
    color: #ffd43b;
  }
`,og=()=>{const[e,t]=i.useState([]),[r,o]=i.useState("json"),[a,n]=i.useState(!0),[s,d]=i.useState({start:"",end:""}),[c,l]=i.useState({}),[m,h]=i.useState(!1),[p,x]=i.useState(0),[u,g]=i.useState([]),[j,y]=i.useState(null),b=[{key:"users",label:"Użytkownicy",count:0},{key:"locations",label:"Lokalizacje",count:0},{key:"shops",label:"Sklepy",count:0},{key:"products",label:"Produkty",count:0},{key:"posts",label:"Posty",count:0},{key:"messages",label:"Wiadomości",count:0},{key:"groups",label:"Grupy",count:0},{key:"reviews",label:"Recenzje",count:0},{key:"notifications",label:"Powiadomienia",count:0},{key:"achievements",label:"Osiągnięcia",count:0},{key:"badges",label:"Odznaki",count:0},{key:"payments",label:"Płatności",count:0},{key:"orders",label:"Zamówienia",count:0}],f=(e,t="info")=>{const r=(new Date).toLocaleTimeString();g(i=>[...i,{message:`[${r}] ${e}`,type:t}])};return w.jsxs(Ru,{children:[w.jsx("h2",{children:"Eksport danych"}),w.jsxs(Zu,{children:[w.jsx("h3",{children:"1. Wybierz kolekcje do eksportu"}),w.jsxs("div",{style:{marginBottom:"16px"},children:[w.jsx(Ju,{className:"secondary",onClick:()=>{t(b.map(e=>e.key))},style:{marginRight:"8px"},children:"Wybierz wszystkie"}),w.jsx(Ju,{className:"secondary",onClick:()=>{t([])},children:"Wyczyść wybór"})]}),w.jsx(Vu,{children:b.map(r=>w.jsxs(qu,{children:[w.jsx(Gu,{type:"checkbox",checked:e.includes(r.key),onChange:()=>{return e=r.key,void t(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e]);var e}}),r.label," (",r.count,")"]},r.key))})]}),w.jsxs(Zu,{children:[w.jsx("h3",{children:"2. Ustawienia eksportu"}),w.jsxs(Hu,{children:[w.jsx(Uu,{children:"Format eksportu"}),w.jsxs(Ku,{value:r,onChange:e=>o(e.target.value),children:[w.jsx("option",{value:"json",children:"JSON"}),w.jsx("option",{value:"csv",children:"CSV"}),w.jsx("option",{value:"xml",children:"XML"}),w.jsx("option",{value:"excel",children:"Excel (XLSX)"})]})]}),w.jsxs(Hu,{children:[w.jsx(Uu,{children:"Zakres dat (opcjonalnie)"}),w.jsxs("div",{style:{display:"flex",gap:"12px"},children:[w.jsx(Yu,{type:"date",value:s.start,onChange:e=>d(t=>({...t,start:e.target.value})),placeholder:"Data od"}),w.jsx(Yu,{type:"date",value:s.end,onChange:e=>d(t=>({...t,end:e.target.value})),placeholder:"Data do"})]})]}),w.jsx(Hu,{children:w.jsxs(qu,{children:[w.jsx(Gu,{type:"checkbox",checked:a,onChange:e=>n(e.target.checked)}),"Dołącz metadane (timestamp, wersja, itp.)"]})})]}),w.jsxs(Zu,{children:[w.jsx("h3",{children:"3. Eksportuj dane"}),w.jsx(Ju,{className:"primary",onClick:async()=>{if(0!==e.length){h(!0),x(0),g([]),y(null),f("Rozpoczęcie eksportu danych...","info");try{const t={collections:e,format:r,includeMetadata:a,dateRange:s.start&&s.end?s:null,filters:c};f(`Eksportowanie kolekcji: ${e.join(", ")}`,"info");const i="http://localhost:5000",o=await fetch(`${i}/api/admin/export`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!o.ok)throw new Error(`HTTP error! status: ${o.status}`);const n=await o.json();x(100),y(n),f("Eksport zakończony pomyślnie!","success"),f(`Wyeksportowano ${n.totalRecords} rekordów`,"success"),n.downloadUrl&&f(`Plik dostępny do pobrania: ${n.downloadUrl}`,"success")}catch(t){f(`Błąd podczas eksportu: ${t.message}`,"error"),x(0)}finally{h(!1)}}else f("Wybierz przynajmniej jedną kolekcję do eksportu","error")},disabled:m||0===e.length,children:m?"Eksportowanie...":"Rozpocznij eksport"}),m&&w.jsxs(Xu,{children:[w.jsx(Qu,{children:w.jsx(eg,{progress:p})}),w.jsxs(tg,{children:[p,"% ukończono"]})]}),j&&w.jsxs("div",{style:{marginTop:"16px",padding:"16px",background:"#e8f5e8",borderRadius:"6px"},children:[w.jsx("h4",{children:"Eksport zakończony!"}),w.jsxs("p",{children:["Wyeksportowano ",j.totalRecords," rekordów z ",j.collections.length," kolekcji."]}),j.downloadUrl&&w.jsx(Ju,{className:"primary",onClick:()=>{j&&j.downloadUrl&&window.open(j.downloadUrl,"_blank")},children:"Pobierz plik"})]}),u.length>0&&w.jsx(rg,{children:u.map((e,t)=>w.jsx(ig,{className:e.type,children:e.message},t))})]})]})},ag=p.div`
  max-width: 1400px;
  margin: 40px auto;
  padding: 24px;
  background: ${e=>e.theme.surface};
  border-radius: 16px;
  box-shadow: ${e=>e.theme.shadow};
  
  @media (max-width: 768px) {
    margin: 20px auto;
    padding: 16px;
  }
`,ng=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${e=>e.theme.border};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
`,sg=p.h1`
  color: ${e=>e.theme.text};
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`,dg=p.div`
  text-align: right;
  color: ${e=>e.theme.textSecondary};
  
  @media (max-width: 768px) {
    text-align: left;
  }
`,cg=p.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  border-bottom: 1px solid ${e=>e.theme.border};
  padding-bottom: 0;
  overflow-x: auto;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`,lg=p.button`
  padding: 12px 24px;
  border: none;
  background: ${e=>e.active?e.theme.primary:"transparent"};
  color: ${e=>e.active?"#fff":e.theme.text};
  border-radius: 8px 8px 0 0;
  font-weight: 600;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
  border-bottom: 3px solid ${e=>e.active?e.theme.primary:"transparent"};
  white-space: nowrap;
  
  &:hover {
    background: ${e=>(e.active,e.theme.primary)}20;
  }
  
  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`,mg=p.div`
  min-height: 400px;
`,hg=p.div`
  text-align: center;
  padding: 60px 20px;
  color: ${e=>e.theme.textSecondary};
`,pg=p.div`
  font-size: 64px;
  margin-bottom: 16px;
`,xg=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 24px;
`,ug=p.div`
  padding: 20px;
  border: 1px solid ${e=>e.theme.border};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  background: ${e=>e.theme.background};
  
  &:hover {
    background: ${e=>e.theme.primary}10;
    border-color: ${e=>e.theme.primary};
    transform: translateY(-2px);
  }
`,gg=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`,jg=p.div`
  background: ${e=>e.theme.surface};
  padding: 20px;
  border-radius: 12px;
  box-shadow: ${e=>e.theme.shadow};
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
`,yg=p.div`
  font-size: 2.5rem;
  margin-bottom: 12px;
`,bg=p.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${e=>e.theme.primary};
  margin-bottom: 8px;
`,fg=p.div`
  color: ${e=>e.theme.textSecondary};
  font-size: 0.875rem;
  font-weight: 500;
`,wg=p.div`
  font-size: 0.75rem;
  margin-top: 8px;
  color: ${e=>e.change>=0?e.theme.success:e.theme.error};
`,kg=p.div`
  background: ${e=>e.theme.surface};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${e=>e.theme.shadow};
`,vg=p.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto;
  gap: 16px;
  padding: 16px;
  background: ${e=>e.theme.primary}10;
  font-weight: 600;
  color: ${e=>e.theme.text};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 12px;
  }
`,zg=p.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid ${e=>e.theme.border};
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.primary}05;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 12px;
  }
`,$g=p.div`
  color: ${e=>e.theme.text};
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`,Sg=p.span`
  background: ${e=>"admin"===e.variant?e.theme.primary:"moderator"===e.variant?e.theme.warning:"user"===e.variant?e.theme.success:e.theme.error};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`,Cg=p.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 4px;
  
  &.edit {
    background: ${e=>e.theme.warning};
    color: white;
    
    &:hover {
      background: ${e=>e.theme.warning}dd;
    }
  }
  
  &.delete {
    background: ${e=>e.theme.error};
    color: white;
    
    &:hover {
      background: ${e=>e.theme.error}dd;
    }
  }
`,Ng=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`,Pg=p.div`
  background: ${e=>e.theme.surface};
  padding: 20px;
  border-radius: 12px;
  box-shadow: ${e=>e.theme.shadow};
`,Bg=p.h3`
  color: ${e=>e.theme.text};
  margin-bottom: 16px;
  font-size: 1.25rem;
`,Ag=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${e=>e.theme.border};
  
  &:last-child {
    border-bottom: none;
  }
`,Tg=p.div`
  color: ${e=>e.theme.text};
  font-weight: 500;
`;p.div`
  color: ${e=>e.theme.textSecondary};
`;const Mg=p.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${e=>e.theme.border};
    transition: .4s;
    border-radius: 24px;
    
    &:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
  }
  
  input:checked + span {
    background-color: ${e=>e.theme.primary};
  }
  
  input:checked + span:before {
    transform: translateX(26px);
  }
`,Lg=p.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${e=>e.theme.textSecondary};
`,Eg=p.div`
  background: ${e=>e.theme.error}20;
  color: ${e=>e.theme.error};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`,Wg=[{key:"dashboard",label:"📊 Dashboard",icon:"📊",description:"Przegląd systemu i statystyki"},{key:"data",label:"🗄️ Zarządzanie danymi",icon:"🗄️",description:"Przeglądanie, edycja i zarządzanie danymi"},{key:"export",label:"📤 Eksport danych",icon:"📤",description:"Eksport danych do różnych formatów"},{key:"users",label:"👥 Użytkownicy",icon:"👥",description:"Zarządzanie użytkownikami i uprawnieniami"},{key:"system",label:"⚙️ System",icon:"⚙️",description:"Ustawienia systemu i konfiguracja"}],Dg=()=>{const{user:e}=N(),[t,r]=i.useState("dashboard"),[o,a]=i.useState({totalUsers:0,totalShops:0,totalProducts:0,totalOrders:0,activeUsers:0,revenue:0}),[n,s]=i.useState([]),[d,c]=i.useState({maintenanceMode:!1,registrationEnabled:!0,emailNotifications:!0,autoBackup:!0}),[l,m]=i.useState(!1),[h,p]=i.useState(null);i.useEffect(()=>{"dashboard"===t?x():"users"===t?u():"system"===t&&g()},[t]);const x=async()=>{try{m(!0),p(null);const e="http://localhost:5000",t=localStorage.getItem("token"),r=await fetch(`${e}/api/admin/dashboard`,{headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"}});if(!r.ok)throw new Error("Błąd pobierania statystyk dashboardu");const i=await r.json();a(i)}catch(e){p(e.message),a({totalUsers:1247,totalShops:89,totalProducts:3456,totalOrders:1234,activeUsers:456,revenue:45678.9})}finally{m(!1)}},u=async()=>{try{m(!0),p(null);const e="http://localhost:5000",t=localStorage.getItem("token"),r=await fetch(`${e}/api/admin/users`,{headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"}});if(!r.ok)throw new Error("Błąd pobierania użytkowników");const i=await r.json();s(i.users||i||[])}catch(e){p(e.message),s([{_id:"1",username:"admin",email:"admin@portal.com",role:"admin",createdAt:"2024-01-01",lastLogin:"2024-01-11T10:30:00Z",status:"active"},{_id:"2",username:"moderator1",email:"mod@portal.com",role:"moderator",createdAt:"2024-01-05",lastLogin:"2024-01-11T09:15:00Z",status:"active"},{_id:"3",username:"user123",email:"user@example.com",role:"user",createdAt:"2024-01-10",lastLogin:"2024-01-11T08:45:00Z",status:"active"}])}finally{m(!1)}},g=async()=>{try{m(!0),p(null);const e="http://localhost:5000",t=localStorage.getItem("token"),r=await fetch(`${e}/api/admin/settings`,{headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"}});if(!r.ok)throw new Error("Błąd pobierania ustawień systemu");const i=await r.json();c(i)}catch(e){p(e.message)}finally{m(!1)}},j=async(e,t)=>{try{const r="http://localhost:5000",i=localStorage.getItem("token");if(!(await fetch(`${r}/api/admin/settings`,{method:"PUT",headers:{Authorization:`Bearer ${i}`,"Content-Type":"application/json"},body:JSON.stringify({[e]:t})})).ok)throw new Error("Błąd aktualizacji ustawienia");c(r=>({...r,[e]:t}))}catch(r){p(r.message)}};if(!e||!e.roles||!e.roles.includes("admin"))return w.jsxs(hg,{children:[w.jsx(pg,{children:"🚫"}),w.jsx("h2",{children:"Brak dostępu"}),w.jsx("p",{children:"Panel administracyjny jest dostępny tylko dla administratorów."}),w.jsx("p",{children:"Zaloguj się jako administrator, aby uzyskać dostęp."})]});return w.jsxs(ag,{children:[w.jsxs(ng,{children:[w.jsx(sg,{children:"Panel administracyjny"}),w.jsxs(dg,{children:[w.jsxs("div",{children:["Zalogowany jako: ",w.jsx("strong",{children:e.username||e.email})]}),w.jsx("div",{style:{fontSize:"14px"},children:"Rola: Administrator"})]})]}),w.jsx(cg,{children:Wg.map(e=>w.jsx(lg,{$active:t===e.key,onClick:()=>r(e.key),children:e.label},e.key))}),w.jsx(mg,{children:(()=>{if(l)return w.jsxs(Lg,{children:[w.jsx("div",{style:{fontSize:"2rem",marginBottom:"1rem"},children:"⏳"}),w.jsx("p",{children:"Ładowanie..."})]});switch(t){case"dashboard":return w.jsxs("div",{children:[w.jsx("h2",{children:"Dashboard administracyjny"}),w.jsx("p",{children:"Przegląd systemu i kluczowe statystyki"}),h&&w.jsx(Eg,{children:h}),w.jsxs(gg,{children:[w.jsxs(jg,{children:[w.jsx(yg,{children:"👥"}),w.jsx(bg,{children:o.totalUsers.toLocaleString()}),w.jsx(fg,{children:"Użytkownicy"}),w.jsx(wg,{change:12,children:"+12% z ostatniego miesiąca"})]}),w.jsxs(jg,{children:[w.jsx(yg,{children:"🏪"}),w.jsx(bg,{children:o.totalShops.toLocaleString()}),w.jsx(fg,{children:"Sklepy"}),w.jsx(wg,{change:8,children:"+8% z ostatniego miesiąca"})]}),w.jsxs(jg,{children:[w.jsx(yg,{children:"📦"}),w.jsx(bg,{children:o.totalProducts.toLocaleString()}),w.jsx(fg,{children:"Produkty"}),w.jsx(wg,{change:15,children:"+15% z ostatniego miesiąca"})]}),w.jsxs(jg,{children:[w.jsx(yg,{children:"🛒"}),w.jsx(bg,{children:o.totalOrders.toLocaleString()}),w.jsx(fg,{children:"Zamówienia"}),w.jsx(wg,{change:23,children:"+23% z ostatniego miesiąca"})]}),w.jsxs(jg,{children:[w.jsx(yg,{children:"💰"}),w.jsx(bg,{children:o.revenue.toLocaleString("pl-PL",{style:"currency",currency:"PLN"})}),w.jsx(fg,{children:"Przychody"}),w.jsx(wg,{change:18,children:"+18% z ostatniego miesiąca"})]}),w.jsxs(jg,{children:[w.jsx(yg,{children:"🟢"}),w.jsx(bg,{children:o.activeUsers.toLocaleString()}),w.jsx(fg,{children:"Aktywni użytkownicy"}),w.jsx(wg,{change:5,children:"+5% z ostatniego miesiąca"})]})]}),w.jsx(xg,{children:Wg.slice(1).map(e=>w.jsxs(ug,{onClick:()=>r(e.key),children:[w.jsx("div",{style:{fontSize:"32px",marginBottom:"12px"},children:e.icon}),w.jsx("h3",{style:{margin:"0 0 8px 0",color:"#1E293B"},children:e.label}),w.jsx("p",{style:{margin:0,color:"#64748B"},children:e.description})]},e.key))})]});case"data":return w.jsx(_u,{});case"export":return w.jsx(og,{});case"users":return w.jsxs("div",{children:[w.jsx("h2",{children:"Zarządzanie użytkownikami"}),w.jsx("p",{children:"Przegląd i zarządzanie użytkownikami systemu"}),h&&w.jsx(Eg,{children:h}),w.jsxs(kg,{children:[w.jsxs(vg,{children:[w.jsx("div",{children:"Użytkownik"}),w.jsx("div",{children:"Email"}),w.jsx("div",{children:"Rola"}),w.jsx("div",{children:"Ostatnie logowanie"}),w.jsx("div",{children:"Akcje"})]}),n.map(e=>{return w.jsxs(zg,{children:[w.jsx($g,{children:w.jsx("strong",{children:e.username})}),w.jsx($g,{children:e.email}),w.jsx($g,{children:(r=e.role,w.jsx(Sg,{variant:{admin:"admin",moderator:"moderator",user:"user"}[r]||"user",children:r}))}),w.jsx($g,{children:(t=e.lastLogin,new Date(t).toLocaleDateString("pl-PL",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}))}),w.jsxs($g,{children:[w.jsx(Cg,{className:"edit",children:"Edytuj"}),w.jsx(Cg,{className:"delete",children:"Usuń"})]})]},e._id||e.id);var t,r})]})]});case"system":return w.jsxs("div",{children:[w.jsx("h2",{children:"Ustawienia systemu"}),w.jsx("p",{children:"Konfiguracja systemu i funkcjonalności"}),h&&w.jsx(Eg,{children:h}),w.jsxs(Ng,{children:[w.jsxs(Pg,{children:[w.jsx(Bg,{children:"🔧 Ogólne"}),w.jsxs(Ag,{children:[w.jsx(Tg,{children:"Tryb konserwacji"}),w.jsxs(Mg,{children:[w.jsx("input",{type:"checkbox",checked:d.maintenanceMode,onChange:e=>j("maintenanceMode",e.target.checked)}),w.jsx("span",{})]})]}),w.jsxs(Ag,{children:[w.jsx(Tg,{children:"Rejestracja użytkowników"}),w.jsxs(Mg,{children:[w.jsx("input",{type:"checkbox",checked:d.registrationEnabled,onChange:e=>j("registrationEnabled",e.target.checked)}),w.jsx("span",{})]})]})]}),w.jsxs(Pg,{children:[w.jsx(Bg,{children:"📧 Powiadomienia"}),w.jsxs(Ag,{children:[w.jsx(Tg,{children:"Powiadomienia email"}),w.jsxs(Mg,{children:[w.jsx("input",{type:"checkbox",checked:d.emailNotifications,onChange:e=>j("emailNotifications",e.target.checked)}),w.jsx("span",{})]})]}),w.jsxs(Ag,{children:[w.jsx(Tg,{children:"Automatyczne kopie zapasowe"}),w.jsxs(Mg,{children:[w.jsx("input",{type:"checkbox",checked:d.autoBackup,onChange:e=>j("autoBackup",e.target.checked)}),w.jsx("span",{})]})]})]})]})]});default:return w.jsx("div",{children:"Nieznana zakładka"})}})()})]})},Og=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`,Ig=p.h1`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`,Fg=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`,_g=p.div`
  display: flex;
  gap: 1rem;
  flex: 1;
  max-width: 500px;
`,Rg=p.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
  }
`,Zg=p.select`
  padding: 0.75rem 1rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
  }
`,Hg=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`,Ug=p.div`
  background: ${e=>e.theme.surface};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: ${e=>e.theme.shadow};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
`,Kg=p.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1rem;
`,Yg=p.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${e=>e.theme.text};
`,Vg=p.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${e=>e.theme.primary};
  margin-bottom: 0.5rem;
`,qg=p.p`
  color: ${e=>e.theme.textSecondary};
  margin-bottom: 1rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`,Gg=p.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: ${e=>e.theme.primary}10;
  border-radius: 8px;
`,Jg=p.span`
  font-weight: 600;
  color: ${e=>e.theme.primary};
`,Xg=p.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: ${e=>e.theme.textSecondary};
`,Qg=p.div`
  display: flex;
  gap: 0.5rem;
`,ej=p.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background: ${e=>e.theme.primary};
    color: white;
    
    &:hover {
      background: ${e=>e.theme.primary}dd;
    }
  }
  
  &.secondary {
    background: ${e=>e.theme.surface};
    color: ${e=>e.theme.text};
    border: 2px solid ${e=>e.theme.border};
    
    &:hover {
      background: ${e=>e.theme.border};
    }
  }
`,tj=p.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${e=>e.theme.textSecondary};
`,rj=p.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`,ij=p.div`
  text-align: center;
  padding: 2rem;
  color: ${e=>e.theme.textSecondary};
`,oj=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${e=>e.theme.surface};
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: ${e=>e.theme.shadow};
`,aj=p.div`
  text-align: center;
`,nj=p.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${e=>e.theme.primary};
`,sj=p.div`
  font-size: 0.875rem;
  color: ${e=>e.theme.textSecondary};
`;function dj(){const{user:e}=N(),[t,r]=i.useState([]),[o,a]=i.useState(!0),[n,s]=i.useState(""),[d,c]=i.useState(""),[l,m]=i.useState("newest");i.useEffect(()=>{h()},[]);const h=async()=>{try{a(!0);const t="http://localhost:5000",i=localStorage.getItem("token"),o=e?.location||"Warszawa",n=await fetch(`${t}/api/products/local?location=${encodeURIComponent(o)}`,{headers:{Authorization:`Bearer ${i}`,"Content-Type":"application/json"}});if(n.ok){const e=await n.json();r(e)}else r([])}catch(t){r([])}finally{a(!1)}},p=t.filter(e=>{const t=e.name.toLowerCase().includes(n.toLowerCase())||e.description.toLowerCase().includes(n.toLowerCase())||e.shop?.name.toLowerCase().includes(n.toLowerCase()),r=""===d||"Wszystkie"===d||e.category===d;return t&&r}),x=[...p].sort((e,t)=>{switch(l){case"price-low":return e.price-t.price;case"price-high":return t.price-e.price;case"newest":return new Date(t.createdAt)-new Date(e.createdAt);case"oldest":return new Date(e.createdAt)-new Date(t.createdAt);default:return 0}}),u=e=>{window.location.href=`/shop/${e}`};return o?w.jsxs(Og,{children:[w.jsx(Ig,{children:"Produkty lokalne"}),w.jsx(ij,{children:"Ładowanie produktów lokalnych..."})]}):w.jsxs(Og,{children:[w.jsx(Ig,{children:"🏘️ Produkty lokalne"}),w.jsxs(oj,{"data-testid":"stats-bar",children:[w.jsxs(aj,{children:[w.jsx(nj,{children:t.length}),w.jsx(sj,{children:"Wszystkie produkty"})]}),w.jsxs(aj,{children:[w.jsx(nj,{children:p.length}),w.jsx(sj,{children:"Po filtrowaniu"})]}),w.jsxs(aj,{children:[w.jsx(nj,{children:new Set(t.map(e=>e.shop?._id)).size}),w.jsx(sj,{children:"Sklepy lokalne"})]})]}),w.jsxs(Fg,{children:[w.jsx(_g,{children:w.jsx(Rg,{type:"text",placeholder:"Szukaj produktów, sklepów...",value:n,onChange:e=>s(e.target.value)})}),w.jsx(Zg,{value:d,onChange:e=>c(e.target.value),children:["Wszystkie","Elektronika","Odzież i moda","Książki i multimedia","Sport i rekreacja","Dom i ogród","Motoryzacja","Zdrowie i uroda","Zabawki i gry","Spożywcze","Inne"].map(e=>w.jsx("option",{value:e,children:e},e))}),w.jsxs(Zg,{value:l,onChange:e=>m(e.target.value),children:[w.jsx("option",{value:"newest",children:"Najnowsze"}),w.jsx("option",{value:"oldest",children:"Najstarsze"}),w.jsx("option",{value:"price-low",children:"Cena: od najniższej"}),w.jsx("option",{value:"price-high",children:"Cena: od najwyższej"})]})]}),0===x.length?w.jsxs(tj,{children:[w.jsx(rj,{children:"🏘️"}),w.jsx("h3",{children:"Brak produktów lokalnych"}),w.jsx("p",{children:"W Twojej okolicy nie ma jeszcze produktów. Sprawdź później lub rozszerz wyszukiwanie."})]}):w.jsx(Hg,{children:x.map(e=>w.jsxs(Ug,{onClick:()=>(e=>{window.location.href=`/product/${e._id}`})(e),children:[e.images&&e.images[0]&&w.jsx(Kg,{src:e.images[0],alt:e.name}),w.jsx(Yg,{children:e.name}),w.jsxs(Vg,{children:[e.price," zł"]}),w.jsx(qg,{children:e.description}),e.shop&&w.jsxs(Gg,{onClick:t=>{t.stopPropagation(),u(e.shop._id)},children:[w.jsx("span",{children:"🏪"}),w.jsx(Jg,{children:e.shop.name}),w.jsxs(Xg,{children:["📍 ",e.shop.location?.name||"Lokalizacja"]})]}),w.jsxs(Qg,{children:[w.jsx(ej,{className:"primary",onClick:t=>{t.stopPropagation(),(e=>{window.location.href=`/messages?shop=${e.shop._id}`})(e)},children:"💬 Skontaktuj się"}),w.jsx(ej,{className:"secondary",onClick:t=>{t.stopPropagation(),u(e.shop._id)},children:"🏪 Zobacz sklep"})]})]},e._id))})]})}const cj=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`,lj=p.h1`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`,mj=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`,hj=p.button`
  padding: 1rem 2rem;
  background: ${e=>e.theme.gradient};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
`,pj=p.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`,xj=p.button`
  padding: 0.75rem 1.5rem;
  background: ${e=>e.isActive?e.theme.primary:e.theme.surface};
  color: ${e=>e.isActive?"white":e.theme.text};
  border: 2px solid ${e=>e.isActive?e.theme.primary:e.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background: ${e=>(e.isActive,e.theme.primary)}20;
    transform: translateY(-1px);
  }
`,uj=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${e=>e.theme.surface};
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: ${e=>e.theme.shadow};
`,gj=p.div`
  text-align: center;
`,jj=p.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${e=>e.theme.primary};
`,yj=p.div`
  font-size: 0.875rem;
  color: ${e=>e.theme.textSecondary};
`,bj=p.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${e=>e.theme.textSecondary};
`,fj=p.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`,wj=p.div`
  text-align: center;
  padding: 2rem;
  color: ${e=>e.theme.textSecondary};
`;function kj(){const{user:e}=N(),[t,r]=i.useState([]),[o,a]=i.useState(null),[n,s]=i.useState(!0),[d,c]=i.useState(0);i.useEffect(()=>{l()},[]);const l=async()=>{try{s(!0);const e="http://localhost:5000",t=localStorage.getItem("token"),i=await fetch(`${e}/api/shops/user`,{headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"}});if(i.ok){const e=await i.json();r(e),e.length>0&&a(e[0])}else r([])}catch(e){r([])}finally{s(!1)}},m=()=>{window.location.href="/shop-create"};return n?w.jsxs(cj,{children:[w.jsx(lj,{children:"Moje produkty"}),w.jsx(wj,{children:"Ładowanie sklepów..."})]}):0===t.length?w.jsxs(cj,{children:[w.jsx(lj,{children:"📦 Moje produkty"}),w.jsxs(bj,{children:[w.jsx(fj,{children:"🏪"}),w.jsx("h3",{children:"Nie masz jeszcze żadnych sklepów"}),w.jsx("p",{children:"Aby zarządzać produktami, najpierw utwórz sklep."}),w.jsx(hj,{onClick:m,children:"➕ Utwórz pierwszy sklep"})]})]}):w.jsxs(cj,{children:[w.jsx(lj,{children:"📦 Moje produkty"}),w.jsxs(mj,{children:[w.jsx("h2",{children:"Zarządzaj produktami w swoich sklepach"}),w.jsx(hj,{onClick:m,children:"➕ Dodaj nowy sklep"})]}),w.jsxs(uj,{"data-testid":"stats-bar",children:[w.jsxs(gj,{children:[w.jsx(jj,{children:t.length}),w.jsx(yj,{children:"Moje sklepy"})]}),w.jsxs(gj,{children:[w.jsx(jj,{children:d}),w.jsx(yj,{children:"Wszystkie produkty"})]}),w.jsxs(gj,{children:[w.jsx(jj,{children:o?.stats?.totalViews||0}),w.jsx(yj,{children:"Wyświetlenia"})]})]}),w.jsx(pj,{children:t.map(e=>w.jsxs(xj,{"data-testid":"shop-tab",isActive:o?._id===e._id,onClick:()=>(e=>{a(e)})(e),children:["🏪 ",e.name," (",e.stats?.totalProducts||0,")"]},e._id))}),o&&w.jsxs("div",{children:[w.jsxs("h3",{children:["Produkty w sklepie: ",o.name]}),w.jsx(Zr,{shopId:o._id})]})]})}const vj=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`,zj=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`,$j=p.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`,Sj=p(o)`
  background: ${e=>e.theme.gradient};
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.gradientHover};
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
`,Cj=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`,Nj=p.div`
  background: ${e=>e.theme.surface};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: ${e=>e.theme.shadow};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${e=>e.theme.shadowHover};
  }
`,Pj=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,Bj=p.div`
  background: ${e=>"open"===e.status?"#10b981":"#ef4444"};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
`,Aj=p.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`,Tj=p.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
`,Mj=p.p`
  color: ${e=>e.theme.textSecondary};
  font-size: 0.875rem;
  margin: 0;
`,Lj=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: ${e=>e.theme.textSecondary};
`,Ej=p.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
`,Wj=p.div`
  text-align: center;
`,Dj=p.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${e=>e.theme.primary};
`,Oj=p.div`
  font-size: 0.75rem;
  color: ${e=>e.theme.textSecondary};
`,Ij=p.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`,Fj=p(o)`
  flex: 1;
  text-align: center;
  padding: 0.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &.primary {
    background: ${e=>e.theme.primary};
    color: white;
    
    &:hover {
      background: ${e=>e.theme.primary}dd;
    }
  }
  
  &.secondary {
    background: ${e=>e.theme.border};
    color: ${e=>e.theme.text};
    
    &:hover {
      background: ${e=>e.theme.primary}20;
      color: ${e=>e.theme.primary};
    }
  }
  
  &.danger {
    background: ${e=>e.theme.error};
    color: white;
    
    &:hover {
      background: ${e=>e.theme.error}dd;
    }
  }
`,_j=p.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${e=>e.theme.textSecondary};
`,Rj=p.div`
  text-align: center;
  padding: 4rem;
  font-size: 1.2rem;
  color: ${e=>e.theme.textSecondary};
`;function Zj(){const{user:e}=N(),[t,r]=i.useState([]),[o,a]=i.useState(!0),[n,s]=i.useState(null);i.useEffect(()=>{d()},[]);const d=async()=>{try{a(!0);const e="http://localhost:5000",t=localStorage.getItem("token"),i=await fetch(`${e}/api/shops/user`,{headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"}});if(!i.ok)throw new Error("Nie udało się pobrać Twoich sklepów");const o=await i.json();r(o)}catch(e){s(e.message)}finally{a(!1)}};return o?w.jsx(vj,{children:w.jsxs(Rj,{children:[w.jsx("div",{style:{fontSize:"2rem",marginBottom:"1rem"},children:"⏳"}),w.jsx("p",{children:"Ładowanie Twoich sklepów..."})]})}):n?w.jsx(vj,{children:w.jsxs("div",{style:{textAlign:"center",padding:"4rem"},children:[w.jsx("div",{style:{fontSize:"4rem",marginBottom:"1rem"},children:"❌"}),w.jsx("h3",{children:"Błąd podczas ładowania sklepów"}),w.jsx("p",{children:n}),w.jsx("button",{onClick:d,style:{marginTop:"1rem",padding:"0.5rem 1rem"},children:"Spróbuj ponownie"})]})}):w.jsxs(vj,{children:[w.jsxs(zj,{children:[w.jsx($j,{children:"Moje sklepy"}),w.jsx(Sj,{to:"/shop-create",children:"🏪 Dodaj nowy sklep"})]}),0===t.length?w.jsxs(_j,{children:[w.jsx("div",{style:{fontSize:"4rem",marginBottom:"1rem"},children:"🏪"}),w.jsx("h3",{children:"Nie masz jeszcze żadnych sklepów"}),w.jsx("p",{children:"Rozpocznij swoją przygodę z e-commerce i dodaj pierwszy sklep!"}),w.jsx(Sj,{to:"/shop-create",style:{display:"inline-block",marginTop:"1rem"},children:"🏪 Dodaj pierwszy sklep"})]}):w.jsx(Cj,{children:t.map(e=>w.jsxs(Nj,{children:[w.jsxs(Pj,{children:[w.jsx(Bj,{status:e.isActive?"open":"closed",children:e.isActive?"Aktywny":"Nieaktywny"}),w.jsx("div",{style:{fontSize:"2rem"},children:"🏪"})]}),w.jsxs(Aj,{children:[w.jsx(Tj,{children:e.name}),w.jsx(Mj,{children:e.description}),w.jsxs(Lj,{children:[w.jsxs("span",{children:["📍 ",e.address?.city||"Brak lokalizacji"]}),w.jsxs("span",{children:["⭐ ",e.rating||"Brak ocen"]})]}),w.jsxs(Ej,{children:[w.jsxs(Wj,{children:[w.jsx(Dj,{children:e.stats?.totalProducts||0}),w.jsx(Oj,{children:"Produktów"})]}),w.jsxs(Wj,{children:[w.jsx(Dj,{children:e.stats?.totalViews||0}),w.jsx(Oj,{children:"Wyświetleń"})]}),w.jsxs(Wj,{children:[w.jsx(Dj,{children:e.stats?.totalFollowers||0}),w.jsx(Oj,{children:"Obserwujących"})]})]}),w.jsxs(Ij,{children:[w.jsx(Fj,{className:"primary",to:`/shop/${e._id}`,children:"🛒 Przejdź do sklepu"}),w.jsx(Fj,{className:"secondary",to:`/shop-edit/${e._id}`,children:"✏️ Edytuj"}),w.jsx(Fj,{className:"danger",as:"button",onClick:()=>(async e=>{if(window.confirm("Czy na pewno chcesz usunąć ten sklep? Tej operacji nie można cofnąć."))try{const i="http://localhost:5000",o=localStorage.getItem("token");if(!(await fetch(`${i}/api/shops/${e}`,{method:"DELETE",headers:{Authorization:`Bearer ${o}`,"Content-Type":"application/json"}})).ok)throw new Error("Nie udało się usunąć sklepu");r(t.filter(t=>t._id!==e))}catch(i){alert("Nie udało się usunąć sklepu: "+i.message)}})(e._id),style:{border:"none",cursor:"pointer"},children:"🗑️ Usuń"})]})]})]},e._id))})]})}const Hj=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`,Uj=p.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  background: ${e=>e.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`,Kj=p.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`,Yj=p.div`
  background: ${e=>e.theme.surface};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: ${e=>e.theme.shadow};
`,Vj=p.div`
  width: 100%;
  height: 400px;
  background: ${e=>e.theme.background};
  border: 2px dashed ${e=>e.theme.border};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${e=>e.theme.textSecondary};
  font-size: 1.1rem;
  margin-bottom: 1rem;
`,qj=p.div`
  margin-bottom: 1.5rem;
`,Gj=p.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${e=>e.theme.text};
`,Jj=p.p`
  color: ${e=>e.theme.textSecondary};
  margin-bottom: 1rem;
`,Xj=p.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
`,Qj=p.div`
  text-align: center;
`,ey=p.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${e=>e.theme.primary};
`,ty=p.div`
  font-size: 0.875rem;
  color: ${e=>e.theme.textSecondary};
`,ry=p.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`,iy=p.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background: ${e=>e.theme.gradient};
    color: white;
    
    &:hover:not(:disabled) {
      background: ${e=>e.theme.gradientHover};
      transform: translateY(-2px);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
  
  &.danger {
    background: #ef4444;
    color: white;
    
    &:hover:not(:disabled) {
      background: #dc2626;
      transform: translateY(-2px);
    }
  }
  
  &.secondary {
    background: ${e=>e.theme.border};
    color: ${e=>e.theme.text};
    
    &:hover {
      background: ${e=>e.theme.primary}20;
    }
  }
`,oy=p.div`
  background: ${e=>e.theme.surface};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: ${e=>e.theme.shadow};
  display: flex;
  flex-direction: column;
  height: 500px;
`,ay=p.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${e=>e.theme.border};
`,ny=p.div`
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`,sy=p.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${e=>e.theme.text};
`,dy=p.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding-right: 0.5rem;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${e=>e.theme.background};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${e=>e.theme.border};
    border-radius: 2px;
  }
`,cy=p.div`
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  background: ${e=>e.own?e.theme.primary+"20":e.theme.background};
`,ly=p.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`,my=p.span`
  font-weight: 600;
  color: ${e=>e.theme.primary};
  font-size: 0.875rem;
`,hy=p.span`
  font-size: 0.75rem;
  color: ${e=>e.theme.textSecondary};
`,py=p.div`
  color: ${e=>e.theme.text};
  font-size: 0.875rem;
`,xy=p.div`
  display: flex;
  gap: 0.5rem;
`,uy=p.input`
  flex: 1;
  padding: 0.75rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 8px;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
  }
`,gy=p.button`
  padding: 0.75rem 1rem;
  background: ${e=>e.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover:not(:disabled) {
    background: ${e=>e.theme.primary}dd;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`,jy=p.div`
  background: ${e=>e.theme.surface};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: ${e=>e.theme.shadow};
  margin-top: 2rem;
`,yy=p.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${e=>e.theme.text};
`,by=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`,fy=p.div`
  background: ${e=>e.theme.background};
  border-radius: 12px;
  padding: 1rem;
  border: 2px solid ${e=>e.theme.border};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${e=>e.theme.primary};
    transform: translateY(-2px);
  }
`,wy=p.div`
  width: 100%;
  height: 120px;
  background: ${e=>e.theme.border};
  border-radius: 8px;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${e=>e.theme.textSecondary};
`,ky=p.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${e=>e.theme.text};
`,vy=p.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${e=>e.theme.primary};
`,zy=p.div`
  text-align: center;
  padding: 3rem;
  color: ${e=>e.theme.textSecondary};
`;function $y(){const{user:e}=N(),{shopId:t}=n(),[r,o]=i.useState(null),[a,s]=i.useState(null),[d,c]=i.useState([]),[l,m]=i.useState(""),[h,p]=i.useState([]),[x,u]=i.useState(!0),[g,j]=i.useState(!1),y=i.useRef(null);i.useEffect(()=>{t&&(f(),k())},[t]),i.useEffect(()=>{b()},[d]);const b=()=>{y.current?.scrollIntoView({behavior:"smooth"})},f=async()=>{try{u(!0);const e="http://localhost:5000",r=localStorage.getItem("token"),i=await fetch(`${e}/api/shops/${t}`,{headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"}});if(i.ok){const e=await i.json();o(e);const t=e.liveStreams?.find(e=>e.isActive);t&&(s(t),j(!0))}}catch(e){}finally{u(!1)}},k=async()=>{try{const e="http://localhost:5000",r=localStorage.getItem("token"),i=await fetch(`${e}/api/products/shop/${t}`,{headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"}});if(i.ok){const e=await i.json();p(e)}}catch(e){}},v=async()=>{if(!l.trim()||!a)return;const t={id:Date.now(),text:l,username:e?.username||"Anonim",timestamp:(new Date).toLocaleTimeString(),own:!0};c(e=>[...e,t]),m("")};if(x)return w.jsx(Hj,{children:w.jsx(zy,{children:"Ładowanie..."})});if(!r)return w.jsx(Hj,{children:w.jsx(zy,{children:"Sklep nie został znaleziony"})});const z=e?._id===r.owner?._id;return w.jsxs(Hj,{children:[w.jsxs(Uj,{children:["Live Shopping - ",r.name]}),w.jsxs(Kj,{children:[w.jsxs(Yj,{children:[w.jsx(qj,{children:a?w.jsxs(w.Fragment,{children:[w.jsx(Gj,{children:a.title}),w.jsx(Jj,{children:a.description}),w.jsxs(Xj,{children:[w.jsxs(Qj,{children:[w.jsx(ey,{children:a.viewers?.length||0}),w.jsx(ty,{children:"Oglądających"})]}),w.jsxs(Qj,{children:[w.jsx(ey,{children:h.length}),w.jsx(ty,{children:"Produktów"})]}),w.jsxs(Qj,{children:[w.jsx(ey,{children:d.length}),w.jsx(ty,{children:"Wiadomości"})]})]})]}):w.jsx(Gj,{children:"Brak aktywnej transmisji"})}),w.jsx(Vj,{children:g?"🎥 Transmisja na żywo":"📹 Brak aktywnej transmisji"}),z&&w.jsx(ry,{children:g?w.jsx(iy,{className:"danger",onClick:async()=>{if(a)try{const e="http://localhost:5000",r=localStorage.getItem("token");(await fetch(`${e}/api/shops/${t}/live/${a._id}/end`,{method:"POST",headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"}})).ok&&(s(null),j(!1),alert("Transmisja zakończona!"))}catch(e){alert("Błąd podczas kończenia transmisji")}},children:"⏹️ Zakończ transmisję"}):w.jsx(iy,{className:"primary",onClick:async()=>{try{const e="http://localhost:5000",i=localStorage.getItem("token"),o=await fetch(`${e}/api/shops/${t}/live/start`,{method:"POST",headers:{Authorization:`Bearer ${i}`,"Content-Type":"application/json"},body:JSON.stringify({title:"Live Shopping - "+r?.name,description:"Transmisja na żywo z produktami",products:h.map(e=>e._id)})});if(o.ok){const e=await o.json();s(e.liveStreams[e.liveStreams.length-1]),j(!0),alert("Transmisja rozpoczęta!")}}catch(e){alert("Błąd podczas rozpoczynania transmisji")}},children:"🎥 Rozpocznij transmisję"})})]}),w.jsxs(oy,{children:[w.jsxs(ay,{children:[w.jsx(ny,{}),w.jsx(sy,{children:"Chat na żywo"})]}),w.jsxs(dy,{children:[0===d.length?w.jsx(zy,{children:"Brak wiadomości"}):d.map(e=>w.jsxs(cy,{own:e.own,children:[w.jsxs(ly,{children:[w.jsx(my,{children:e.username}),w.jsx(hy,{children:e.timestamp})]}),w.jsx(py,{children:e.text})]},e.id)),w.jsx("div",{ref:y})]}),w.jsxs(xy,{children:[w.jsx(uy,{value:l,onChange:e=>m(e.target.value),onKeyPress:e=>{"Enter"===e.key&&v()},placeholder:"Napisz wiadomość...",disabled:!g}),w.jsx(gy,{onClick:v,disabled:!g||!l.trim(),children:"Wyślij"})]})]})]}),w.jsxs(jy,{children:[w.jsx(yy,{children:"Produkty w transmisji"}),0===h.length?w.jsx(zy,{children:"Brak produktów w sklepie"}):w.jsx(by,{children:h.map(e=>w.jsxs(fy,{children:[w.jsx(wy,{children:e.images?.[0]?"🖼️":"📦"}),w.jsx(ky,{children:e.name}),w.jsxs(vy,{children:[e.price," zł"]})]},e._id))})]})]})}p.div`
  background: ${e=>e.theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${e=>e.theme.colors.border||e.theme.colors.primary};
  padding: 24px;
  margin: 24px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`,p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${e=>e.theme.colors.border||e.theme.colors.primary};
`,p.h2`
  margin: 0;
  color: ${e=>e.theme.colors.text};
  font-size: 24px;
  font-weight: 600;
`,p.div`
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
`,p.div`
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 8px;
`,p.div`
  font-size: 16px;
  opacity: 0.9;
`,p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${e=>e.theme.colors.surface};
  border: 1px solid ${e=>e.theme.colors.border||e.theme.colors.primary};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
`,p.div`
  background: ${e=>{switch(e.level){case"diamond":return"linear-gradient(135deg, #b8e6b8 0%, #7dd3fc 100%)";case"platinum":return"linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)";case"gold":return"linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)";case"silver":return"linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)";default:return"linear-gradient(135deg, #cd7f32 0%, #a0522d 100%)"}}};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
`,p.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin: 12px 0;
`,p.div`
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%);
  width: ${e=>e.progress}%;
  transition: width 0.3s ease;
`,p.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  margin: 20px 0;
`,p.div`
  text-align: center;
  padding: 16px;
  border: 2px solid ${e=>e.earned?e.theme.colors.success:"#e5e7eb"};
  border-radius: 8px;
  background: ${e=>e.earned?"rgba(34, 197, 94, 0.1)":e.theme.colors.surface};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`,p.div`
  font-size: 32px;
  margin-bottom: 8px;
`,p.div`
  font-weight: 600;
  font-size: 12px;
  color: ${e=>e.theme.colors.text};
  margin-bottom: 4px;
`,p.div`
  font-size: 10px;
  color: ${e=>e.theme.colors.textSecondary};
`,p.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin: 20px 0;
`,p.div`
  border: 1px solid ${e=>e.theme.colors.border||e.theme.colors.primary};
  border-radius: 8px;
  padding: 16px;
  background: ${e=>e.theme.colors.surface};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`,p.div`
  font-weight: 600;
  color: ${e=>e.theme.colors.text};
  margin-bottom: 8px;
`,p.div`
  font-size: 14px;
  color: ${e=>e.theme.colors.textSecondary};
  margin-bottom: 12px;
`,p.button`
  width: 100%;
  padding: 8px 16px;
  background: ${e=>e.available?e.theme.colors.primary:"#e5e7eb"};
  color: ${e=>e.available?"white":"#9ca3af"};
  border: none;
  border-radius: 6px;
  cursor: ${e=>e.available?"pointer":"not-allowed"};
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.available?e.theme.colors.secondary:"#e5e7eb"};
  }
`,p.div`
  max-height: 300px;
  overflow-y: auto;
`,p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid ${e=>e.theme.colors.border||"#e5e7eb"};
  
  &:last-child {
    border-bottom: none;
  }
`,p.div`
  flex: 1;
`,p.div`
  font-weight: 600;
  color: ${e=>e.theme.colors.text};
  margin-bottom: 4px;
`,p.div`
  font-size: 12px;
  color: ${e=>e.theme.colors.textSecondary};
`,p.div`
  font-weight: 600;
  color: ${e=>e.points>0?e.theme.colors.success:e.theme.colors.error};
`,p.div`
  display: flex;
  border-bottom: 1px solid ${e=>e.theme.colors.border||"#e5e7eb"};
  margin-bottom: 20px;
`,p.button`
  padding: 12px 24px;
  border: none;
  background: none;
  color: ${e=>e.active?e.theme.colors.primary:e.theme.colors.textSecondary};
  cursor: pointer;
  font-weight: ${e=>e.active?"600":"400"};
  border-bottom: 2px solid ${e=>e.active?e.theme.colors.primary:"transparent"};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${e=>e.theme.colors.primary};
  }
`;const Sy=p.div`
  background: ${e=>e.theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${e=>e.theme.colors.border||e.theme.colors.primary};
  padding: 24px;
  margin: 24px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`,Cy=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${e=>e.theme.colors.border||e.theme.colors.primary};
`,Ny=p.h2`
  margin: 0;
  color: ${e=>e.theme.colors.text};
  font-size: 24px;
  font-weight: 600;
`,Py=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`,By=p.div`
  background: ${e=>e.theme.colors.surface};
  border: 1px solid ${e=>e.theme.colors.border||e.theme.colors.primary};
  border-radius: 8px;
  padding: 16px;
  text-align: center;
`,Ay=p.div`
  font-size: 24px;
  font-weight: bold;
  color: ${e=>e.theme.colors.primary};
  margin-bottom: 4px;
`,Ty=p.div`
  font-size: 14px;
  color: ${e=>e.theme.colors.textSecondary};
`,My=p.div`
  display: flex;
  border-bottom: 1px solid ${e=>e.theme.colors.border||"#e5e7eb"};
  margin-bottom: 20px;
`,Ly=p.button`
  padding: 12px 24px;
  border: none;
  background: none;
  color: ${e=>e.active?e.theme.colors.primary:e.theme.colors.textSecondary};
  cursor: pointer;
  font-weight: ${e=>e.active?"600":"400"};
  border-bottom: 2px solid ${e=>e.active?e.theme.colors.primary:"transparent"};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${e=>e.theme.colors.primary};
  }
`,Ey=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 20px;
`,Wy=p.div`
  border: 1px solid ${e=>e.theme.colors.border||e.theme.colors.primary};
  border-radius: 8px;
  padding: 16px;
  background: ${e=>e.theme.colors.surface};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`,Dy=p.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${e=>e.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
`,Oy=p.div`
  font-weight: 600;
  color: ${e=>e.theme.colors.text};
  margin-bottom: 4px;
`,Iy=p.div`
  font-size: 14px;
  color: ${e=>e.theme.colors.textSecondary};
  margin-bottom: 8px;
`,Fy=p.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`,_y=p.button`
  padding: 6px 12px;
  border: 1px solid ${e=>e.theme.colors.primary};
  border-radius: 6px;
  background: ${e=>"primary"===e.variant?e.theme.colors.primary:"transparent"};
  color: ${e=>"primary"===e.variant?"white":e.theme.colors.primary};
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>"primary"===e.variant?e.theme.colors.secondary:"rgba(59, 130, 246, 0.1)"};
  }
`,Ry=p.div`
  border: 1px solid ${e=>e.theme.colors.border||e.theme.colors.primary};
  border-radius: 8px;
  padding: 16px;
  background: ${e=>e.theme.colors.surface};
  margin-bottom: 12px;
`,Zy=p.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`,Hy=p.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: ${e=>e.theme.colors.success||"#10b981"};
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.colors.success||"#059669"};
  }
`,Uy=p.button`
  padding: 8px 16px;
  border: 1px solid ${e=>e.theme.colors.error||"#ef4444"};
  border-radius: 6px;
  background: transparent;
  color: ${e=>e.theme.colors.error||"#ef4444"};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.colors.error||"#ef4444"};
    color: white;
  }
`,Ky=p.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${e=>e.theme.colors.border||e.theme.colors.primary};
  border-radius: 6px;
  background: ${e=>e.theme.colors.surface};
  color: ${e=>e.theme.colors.text};
  margin-bottom: 16px;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`,Yy=p.div`
  text-align: center;
  padding: 40px;
  color: ${e=>e.theme.colors.textSecondary};
`,Vy=({userId:e})=>{const[t,r]=i.useState("friends"),[o,a]=i.useState([]),[n,s]=i.useState([]),[d,c]=i.useState([]),[l,m]=i.useState([]),[h,p]=i.useState([]),[x,u]=i.useState({}),[g,j]=i.useState(!0),[y,b]=i.useState("");i.useEffect(()=>{e&&f()},[e,t]);const f=async()=>{j(!0);try{const e="http://localhost:5000",t=localStorage.getItem("token"),[r,i,o,n,d,l]=await Promise.all([fetch(`${e}/api/friendships/friends`,{headers:{Authorization:`Bearer ${t}`}}),fetch(`${e}/api/friendships/pending-requests`,{headers:{Authorization:`Bearer ${t}`}}),fetch(`${e}/api/friendships/sent-requests`,{headers:{Authorization:`Bearer ${t}`}}),fetch(`${e}/api/friendships/blocked-users`,{headers:{Authorization:`Bearer ${t}`}}),fetch(`${e}/api/friendships/suggestions`,{headers:{Authorization:`Bearer ${t}`}}),fetch(`${e}/api/friendships/stats`,{headers:{Authorization:`Bearer ${t}`}})]);if(r.ok){const e=await r.json();a(e.friends||[])}if(i.ok){const e=await i.json();s(e.requests||[])}if(o.ok){const e=await o.json();c(e.requests||[])}if(n.ok){const e=await n.json();m(e.blockedUsers||[])}if(d.ok){const e=await d.json();p(e.suggestions||[])}if(l.ok){const e=await l.json();u(e.stats||{})}}catch(e){}finally{j(!1)}},k=(e,t)=>`${e?.charAt(0)||""}${t?.charAt(0)||""}`.toUpperCase(),v=o.filter(e=>e.firstName?.toLowerCase().includes(y.toLowerCase())||e.lastName?.toLowerCase().includes(y.toLowerCase())||e.username?.toLowerCase().includes(y.toLowerCase()));return e?w.jsxs(Sy,{children:[w.jsx(Cy,{children:w.jsx(Ny,{children:"System Znajomych"})}),w.jsxs(Py,{children:[w.jsxs(By,{children:[w.jsx(Ay,{children:x.totalFriends||0}),w.jsx(Ty,{children:"Znajomi"})]}),w.jsxs(By,{children:[w.jsx(Ay,{children:x.pendingRequests||0}),w.jsx(Ty,{children:"Oczekujące"})]}),w.jsxs(By,{children:[w.jsx(Ay,{children:x.sentRequests||0}),w.jsx(Ty,{children:"Wysłane"})]}),w.jsxs(By,{children:[w.jsx(Ay,{children:x.blockedUsers||0}),w.jsx(Ty,{children:"Zablokowani"})]})]}),w.jsxs(My,{children:[w.jsxs(Ly,{active:"friends"===t,onClick:()=>r("friends"),children:["Znajomi (",o.length,")"]}),w.jsxs(Ly,{active:"pending"===t,onClick:()=>r("pending"),children:["Oczekujące (",n.length,")"]}),w.jsxs(Ly,{active:"sent"===t,onClick:()=>r("sent"),children:["Wysłane (",d.length,")"]}),w.jsxs(Ly,{active:"suggestions"===t,onClick:()=>r("suggestions"),children:["Sugestie (",h.length,")"]}),w.jsxs(Ly,{active:"blocked"===t,onClick:()=>r("blocked"),children:["Zablokowani (",l.length,")"]})]}),"friends"===t&&w.jsxs("div",{children:[w.jsx(Ky,{type:"text",placeholder:"Szukaj znajomych...",value:y,onChange:e=>b(e.target.value)}),g?w.jsx(Yy,{children:"Ładowanie znajomych..."}):v.length>0?w.jsx(Ey,{children:v.map(e=>w.jsxs(Wy,{children:[w.jsx(Dy,{children:e.avatar?w.jsx("img",{src:e.avatar,alt:"Avatar",style:{width:"100%",height:"100%",borderRadius:"50%"}}):k(e.firstName,e.lastName)}),w.jsxs(Oy,{children:[e.firstName," ",e.lastName]}),w.jsxs(Iy,{children:["@",e.username]}),w.jsxs(Fy,{children:[w.jsx(_y,{variant:"primary",children:"Wiadomość"}),w.jsx(_y,{onClick:()=>(async e=>{if(confirm("Czy na pewno chcesz usunąć tego znajomego?"))try{const t="http://localhost:5000",r=localStorage.getItem("token"),i=await fetch(`${t}/api/friendships/remove/${e}`,{method:"DELETE",headers:{Authorization:`Bearer ${r}`}});if(i.ok)alert("Znajomy został usunięty"),f();else{const e=await i.json();alert(`Błąd: ${e.error}`)}}catch(t){alert("Błąd usuwania znajomego")}})(e.friendshipId),children:"Usuń"})]})]},e._id))}):w.jsxs(Yy,{children:[w.jsx("div",{style:{fontSize:"48px",marginBottom:"16px"},children:"👥"}),w.jsx("h3",{children:"Brak znajomych"}),w.jsx("p",{children:"Dodaj znajomych, aby zobaczyć ich tutaj"})]})]}),"pending"===t&&w.jsx("div",{children:g?w.jsx(Yy,{children:"Ładowanie zaproszeń..."}):n.length>0?w.jsx("div",{children:n.map(e=>w.jsxs(Ry,{children:[w.jsxs("div",{style:{display:"flex",alignItems:"center",marginBottom:"12px"},children:[w.jsx(Dy,{style:{marginBottom:0,marginRight:"12px"},children:e.requester.avatar?w.jsx("img",{src:e.requester.avatar,alt:"Avatar",style:{width:"100%",height:"100%",borderRadius:"50%"}}):k(e.requester.firstName,e.requester.lastName)}),w.jsxs("div",{children:[w.jsxs(Oy,{children:[e.requester.firstName," ",e.requester.lastName]}),w.jsxs(Iy,{children:["@",e.requester.username]})]})]}),e.message&&w.jsxs("div",{style:{marginBottom:"12px",color:"#6b7280"},children:['"',e.message,'"']}),w.jsxs(Zy,{children:[w.jsx(Hy,{onClick:()=>(async e=>{try{const t="http://localhost:5000",r=localStorage.getItem("token"),i=await fetch(`${t}/api/friendships/accept/${e}`,{method:"POST",headers:{Authorization:`Bearer ${r}`}});if(i.ok)alert("Zaproszenie zostało zaakceptowane!"),f();else{const e=await i.json();alert(`Błąd: ${e.error}`)}}catch(t){alert("Błąd akceptowania zaproszenia")}})(e._id),children:"Akceptuj"}),w.jsx(Uy,{onClick:()=>(async e=>{try{const t="http://localhost:5000",r=localStorage.getItem("token"),i=await fetch(`${t}/api/friendships/reject/${e}`,{method:"POST",headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"},body:JSON.stringify({reason:"Odrzucone przez użytkownika"})});if(i.ok)alert("Zaproszenie zostało odrzucone"),f();else{const e=await i.json();alert(`Błąd: ${e.error}`)}}catch(t){alert("Błąd odrzucania zaproszenia")}})(e._id),children:"Odrzuć"})]})]},e._id))}):w.jsxs(Yy,{children:[w.jsx("div",{style:{fontSize:"48px",marginBottom:"16px"},children:"📨"}),w.jsx("h3",{children:"Brak oczekujących zaproszeń"})]})}),"sent"===t&&w.jsx("div",{children:g?w.jsx(Yy,{children:"Ładowanie wysłanych zaproszeń..."}):d.length>0?w.jsx("div",{children:d.map(e=>w.jsx(Ry,{children:w.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[w.jsx(Dy,{style:{marginBottom:0,marginRight:"12px"},children:e.recipient.avatar?w.jsx("img",{src:e.recipient.avatar,alt:"Avatar",style:{width:"100%",height:"100%",borderRadius:"50%"}}):k(e.recipient.firstName,e.recipient.lastName)}),w.jsxs("div",{children:[w.jsxs(Oy,{children:[e.recipient.firstName," ",e.recipient.lastName]}),w.jsxs(Iy,{children:["@",e.recipient.username]}),w.jsxs("div",{style:{fontSize:"12px",color:"#6b7280"},children:["Wysłano: ",new Date(e.requestedAt).toLocaleDateString("pl-PL")]})]})]})},e._id))}):w.jsxs(Yy,{children:[w.jsx("div",{style:{fontSize:"48px",marginBottom:"16px"},children:"📤"}),w.jsx("h3",{children:"Brak wysłanych zaproszeń"})]})}),"suggestions"===t&&w.jsx("div",{children:g?w.jsx(Yy,{children:"Ładowanie sugestii..."}):h.length>0?w.jsx(Ey,{children:h.map(e=>w.jsxs(Wy,{children:[w.jsx(Dy,{children:e.user.avatar?w.jsx("img",{src:e.user.avatar,alt:"Avatar",style:{width:"100%",height:"100%",borderRadius:"50%"}}):k(e.user.firstName,e.user.lastName)}),w.jsxs(Oy,{children:[e.user.firstName," ",e.user.lastName]}),w.jsxs(Iy,{children:["@",e.user.username]}),w.jsxs("div",{style:{fontSize:"12px",color:"#6b7280",marginBottom:"12px"},children:[e.mutualFriendsCount," wspólnych znajomych"]}),w.jsx(Fy,{children:w.jsx(_y,{variant:"primary",onClick:()=>(async(e,t="")=>{try{const r="http://localhost:5000",i=localStorage.getItem("token"),o=await fetch(`${r}/api/friendships/send-request`,{method:"POST",headers:{Authorization:`Bearer ${i}`,"Content-Type":"application/json"},body:JSON.stringify({recipientId:e,message:t})});if(o.ok)alert("Zaproszenie zostało wysłane!"),f();else{const e=await o.json();alert(`Błąd: ${e.error}`)}}catch(r){alert("Błąd wysyłania zaproszenia")}})(e.user._id),children:"Dodaj"})})]},e.user._id))}):w.jsxs(Yy,{children:[w.jsx("div",{style:{fontSize:"48px",marginBottom:"16px"},children:"💡"}),w.jsx("h3",{children:"Brak sugestii"}),w.jsx("p",{children:"Nie mamy jeszcze sugestii znajomych dla Ciebie"})]})}),"blocked"===t&&w.jsx("div",{children:g?w.jsx(Yy,{children:"Ładowanie zablokowanych użytkowników..."}):l.length>0?w.jsx(Ey,{children:l.map(e=>w.jsxs(Wy,{children:[w.jsx(Dy,{children:e.avatar?w.jsx("img",{src:e.avatar,alt:"Avatar",style:{width:"100%",height:"100%",borderRadius:"50%"}}):k(e.firstName,e.lastName)}),w.jsxs(Oy,{children:[e.firstName," ",e.lastName]}),w.jsxs(Iy,{children:["@",e.username]}),w.jsxs("div",{style:{fontSize:"12px",color:"#6b7280",marginBottom:"12px"},children:["Zablokowano: ",new Date(e.blockedAt).toLocaleDateString("pl-PL")]}),w.jsx(Fy,{children:w.jsx(_y,{children:"Odblokuj"})})]},e._id))}):w.jsxs(Yy,{children:[w.jsx("div",{style:{fontSize:"48px",marginBottom:"16px"},children:"🚫"}),w.jsx("h3",{children:"Brak zablokowanych użytkowników"})]})})]}):null},qy="http://localhost:5000/api",Gy=()=>{const{user:e,token:t}=N(),[r,o]=i.useState([]),[a,n]=i.useState([]),[s,d]=i.useState(""),[c,l]=i.useState([]),[m,h]=i.useState(!1),[p,x]=i.useState("friends");i.useEffect(()=>{t&&(u(),g())},[t]);const u=async()=>{try{h(!0);const e=await fetch(`${qy}/api/friendships/friends`,{headers:{Authorization:`Bearer ${t}`}});if(e.ok){const t=await e.json();o(t.friends||[])}}catch(e){}finally{h(!1)}},g=async()=>{try{const e=await fetch(`${qy}/api/friendships/pending`,{headers:{Authorization:`Bearer ${t}`}});if(e.ok){const t=await e.json();n(t.requests||[])}}catch(e){}};return w.jsxs("div",{className:"friends-container",children:[w.jsx("h2",{children:"Znajomi"}),w.jsxs("div",{className:"friends-tabs",children:[w.jsxs("button",{className:"friends"===p?"active":"",onClick:()=>x("friends"),children:["Znajomi (",r.length,")"]}),w.jsxs("button",{className:"requests"===p?"active":"",onClick:()=>x("requests"),children:["Zaproszenia (",a.length,")"]}),w.jsx("button",{className:"search"===p?"active":"",onClick:()=>x("search"),children:"Znajdź znajomych"})]}),"friends"===p&&w.jsx("div",{className:"friends-list",children:m?w.jsx("p",{children:"Ładowanie znajomych..."}):0===r.length?w.jsx("p",{children:'Nie masz jeszcze znajomych. Dodaj ich w zakładce "Znajdź znajomych"!'}):r.map(e=>w.jsxs("div",{className:"friend-item",children:[w.jsx("div",{className:"friend-avatar",children:e.avatar?w.jsx("img",{src:e.avatar,alt:e.firstName}):w.jsxs("div",{className:"avatar-placeholder",children:[e.firstName.charAt(0),e.lastName.charAt(0)]})}),w.jsxs("div",{className:"friend-info",children:[w.jsxs("h4",{children:[e.firstName," ",e.lastName]}),w.jsxs("p",{children:["@",e.username]}),w.jsxs("small",{children:["Znajomi od: ",new Date(e.friendsSince).toLocaleDateString()]})]}),w.jsxs("div",{className:"friend-actions",children:[w.jsx("button",{className:"btn btn-primary",onClick:()=>window.location.href=`/profile/${e._id}`,children:"Profil"}),w.jsx("button",{className:"btn btn-danger",onClick:()=>(async e=>{if(window.confirm("Czy na pewno chcesz usunąć tego znajomego?"))try{(await fetch(`${qy}/api/friendships/${e}`,{method:"DELETE",headers:{Authorization:`Bearer ${t}`}})).ok&&(alert("Znajomy został usunięty!"),u())}catch(r){}})(e.friendshipId),children:"Usuń"})]})]},e._id))}),"requests"===p&&w.jsx("div",{className:"requests-list",children:0===a.length?w.jsx("p",{children:"Brak oczekujących zaproszeń."}):a.map(e=>w.jsxs("div",{className:"request-item",children:[w.jsx("div",{className:"request-avatar",children:e.requester.avatar?w.jsx("img",{src:e.requester.avatar,alt:e.requester.firstName}):w.jsxs("div",{className:"avatar-placeholder",children:[e.requester.firstName.charAt(0),e.requester.lastName.charAt(0)]})}),w.jsxs("div",{className:"request-info",children:[w.jsxs("h4",{children:[e.requester.firstName," ",e.requester.lastName]}),w.jsxs("p",{children:["@",e.requester.username]}),e.message&&w.jsxs("p",{className:"request-message",children:['"',e.message,'"']}),w.jsx("small",{children:new Date(e.requestedAt).toLocaleDateString()})]}),w.jsxs("div",{className:"request-actions",children:[w.jsx("button",{className:"btn btn-success",onClick:()=>(async e=>{try{(await fetch(`${qy}/api/friendships/${e}/accept`,{method:"PUT",headers:{Authorization:`Bearer ${t}`}})).ok&&(alert("Zaproszenie zostało zaakceptowane!"),u(),g())}catch(r){}})(e._id),children:"Akceptuj"}),w.jsx("button",{className:"btn btn-danger",onClick:()=>(async e=>{try{(await fetch(`${qy}/api/friendships/${e}/reject`,{method:"PUT",headers:{Authorization:`Bearer ${t}`}})).ok&&(alert("Zaproszenie zostało odrzucone!"),g())}catch(r){}})(e._id),children:"Odrzuć"})]})]},e._id))}),"search"===p&&w.jsxs("div",{className:"search-section",children:[w.jsx("div",{className:"search-input",children:w.jsx("input",{type:"text",placeholder:"Wyszukaj użytkowników...",value:s,onChange:e=>{const r=e.target.value;d(r),r.length>=2?(async e=>{if(e.trim())try{const r=await fetch(`${qy}/api/users/search?q=${encodeURIComponent(e)}`,{headers:{Authorization:`Bearer ${t}`}});if(r.ok){const e=await r.json();l(e.users||[])}}catch(r){}else l([])})(r):l([])}})}),w.jsx("div",{className:"search-results",children:c.map(e=>w.jsxs("div",{className:"search-result-item",children:[w.jsx("div",{className:"result-avatar",children:e.avatar?w.jsx("img",{src:e.avatar,alt:e.firstName}):w.jsxs("div",{className:"avatar-placeholder",children:[e.firstName.charAt(0),e.lastName.charAt(0)]})}),w.jsxs("div",{className:"result-info",children:[w.jsxs("h4",{children:[e.firstName," ",e.lastName]}),w.jsxs("p",{children:["@",e.username]}),e.bio&&w.jsx("p",{className:"user-bio",children:e.bio})]}),w.jsxs("div",{className:"result-actions",children:[w.jsx("button",{className:"btn btn-primary",onClick:()=>(async e=>{try{(await fetch(`${qy}/api/friendships/send-request`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({recipientId:e})})).ok&&(alert("Zaproszenie zostało wysłane!"),l([]),d(""))}catch(r){}})(e._id),children:"Dodaj znajomego"}),w.jsx("button",{className:"btn btn-secondary",onClick:()=>window.location.href=`/profile/${e._id}`,children:"Zobacz profil"})]})]},e._id))})]}),w.jsx("style",{jsx:!0,children:"\n        .friends-container {\n          max-width: 800px;\n          margin: 0 auto;\n          padding: 20px;\n        }\n\n        .friends-tabs {\n          display: flex;\n          margin-bottom: 20px;\n          border-bottom: 1px solid #ddd;\n        }\n\n        .friends-tabs button {\n          padding: 10px 20px;\n          border: none;\n          background: none;\n          cursor: pointer;\n          border-bottom: 2px solid transparent;\n        }\n\n        .friends-tabs button.active {\n          border-bottom-color: #007bff;\n          color: #007bff;\n        }\n\n        .friend-item, .request-item, .search-result-item {\n          display: flex;\n          align-items: center;\n          padding: 15px;\n          border: 1px solid #ddd;\n          margin-bottom: 10px;\n          border-radius: 8px;\n        }\n\n        .friend-avatar, .request-avatar, .result-avatar {\n          margin-right: 15px;\n        }\n\n        .friend-avatar img, .request-avatar img, .result-avatar img {\n          width: 50px;\n          height: 50px;\n          border-radius: 50%;\n          object-fit: cover;\n        }\n\n        .avatar-placeholder {\n          width: 50px;\n          height: 50px;\n          border-radius: 50%;\n          background: #007bff;\n          color: white;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          font-weight: bold;\n        }\n\n        .friend-info, .request-info, .result-info {\n          flex: 1;\n        }\n\n        .friend-info h4, .request-info h4, .result-info h4 {\n          margin: 0 0 5px 0;\n        }\n\n        .friend-info p, .request-info p, .result-info p {\n          margin: 0 0 5px 0;\n          color: #666;\n        }\n\n        .friend-actions, .request-actions, .result-actions {\n          display: flex;\n          gap: 10px;\n        }\n\n        .btn {\n          padding: 8px 16px;\n          border: none;\n          border-radius: 4px;\n          cursor: pointer;\n          font-size: 14px;\n        }\n\n        .btn-primary {\n          background: #007bff;\n          color: white;\n        }\n\n        .btn-success {\n          background: #28a745;\n          color: white;\n        }\n\n        .btn-danger {\n          background: #dc3545;\n          color: white;\n        }\n\n        .btn-secondary {\n          background: #6c757d;\n          color: white;\n        }\n\n        .search-input input {\n          width: 100%;\n          padding: 12px;\n          border: 1px solid #ddd;\n          border-radius: 4px;\n          font-size: 16px;\n          margin-bottom: 20px;\n        }\n\n        .request-message {\n          font-style: italic;\n          color: #666;\n          margin: 5px 0;\n        }\n\n        .user-bio {\n          font-size: 14px;\n          color: #666;\n          margin: 5px 0;\n        }\n      "})]})},Jy=()=>{const{user:e,token:t}=N(),[r,o]=i.useState(""),[a,n]=i.useState([]),[s,d]=i.useState(""),[c,l]=i.useState(!0),[m,h]=i.useState(!1),[p,x]=i.useState([]),u=i.useRef(null);return w.jsxs("div",{className:"post-create-container",children:[w.jsx("h2",{children:"Utwórz nowy post"}),w.jsxs("form",{onSubmit:async e=>{if(e.preventDefault(),r.trim()){h(!0);try{const e=new FormData;e.append("content",r),e.append("isPublic",c),s.trim()&&e.append("tags",s),a.forEach((t,r)=>{e.append("images",t)});const i=await fetch(`${qy}/api/posts`,{method:"POST",headers:{Authorization:`Bearer ${t}`},body:e});if(i.ok){await i.json();alert("Post został opublikowany!"),o(""),n([]),d(""),l(!0),x([]),window.location.href="/posts"}else{const e=await i.json();alert(`Błąd: ${e.error||"Nie udało się opublikować postu"}`)}}catch(i){alert("Wystąpił błąd podczas publikowania postu")}finally{h(!1)}}else alert("Treść postu jest wymagana!")},className:"post-form",children:[w.jsxs("div",{className:"form-group",children:[w.jsx("label",{children:"Treść postu:"}),w.jsx("textarea",{value:r,onChange:e=>o(e.target.value),placeholder:"Co chcesz udostępnić?",rows:6,maxLength:1e3,required:!0}),w.jsxs("small",{children:[r.length,"/1000 znaków"]})]}),w.jsxs("div",{className:"form-group",children:[w.jsx("label",{children:"Zdjęcia (maksymalnie 5):"}),w.jsxs("div",{className:"image-upload-area",onDragOver:e=>{e.preventDefault()},onDrop:e=>{e.preventDefault();const t=Array.from(e.dataTransfer.files).filter(e=>e.type.startsWith("image/"));if(t.length>0){if(t.length+a.length>5)return void alert("Możesz dodać maksymalnie 5 zdjęć!");const e=[...a,...t];n(e);const r=t.map(e=>({file:e,preview:URL.createObjectURL(e)}));x([...p,...r])}},onClick:()=>u.current?.click(),children:[w.jsx("input",{ref:u,type:"file",multiple:!0,accept:"image/*",onChange:e=>{const t=Array.from(e.target.files).filter(e=>e.type.startsWith("image/"));if(t.length+a.length>5)return void alert("Możesz dodać maksymalnie 5 zdjęć!");const r=[...a,...t];n(r);const i=t.map(e=>({file:e,preview:URL.createObjectURL(e)}));x([...p,...i])},style:{display:"none"}}),w.jsxs("div",{className:"upload-placeholder",children:[w.jsx("i",{className:"upload-icon",children:"📷"}),w.jsx("p",{children:"Kliknij lub przeciągnij zdjęcia tutaj"}),w.jsx("small",{children:"Maksymalnie 5 zdjęć"})]})]})]}),p.length>0&&w.jsxs("div",{className:"image-previews",children:[w.jsx("h4",{children:"Podgląd zdjęć:"}),w.jsx("div",{className:"preview-grid",children:p.map((e,t)=>w.jsxs("div",{className:"image-preview",children:[w.jsx("img",{src:e.preview,alt:`Podgląd ${t+1}`}),w.jsx("button",{type:"button",className:"remove-image",onClick:()=>(e=>{const t=a.filter((t,r)=>r!==e),r=p.filter((t,r)=>r!==e);n(t),x(r)})(t),children:"✕"})]},t))})]}),w.jsxs("div",{className:"form-group",children:[w.jsx("label",{children:"Tagi (oddzielone przecinkami):"}),w.jsx("input",{type:"text",value:s,onChange:e=>d(e.target.value),placeholder:"np. podróże, jedzenie, technologia"})]}),w.jsx("div",{className:"form-group",children:w.jsxs("label",{className:"checkbox-label",children:[w.jsx("input",{type:"checkbox",checked:c,onChange:e=>l(e.target.checked)}),"Post publiczny (widoczny dla wszystkich)"]})}),w.jsxs("div",{className:"form-actions",children:[w.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>window.history.back(),children:"Anuluj"}),w.jsx("button",{type:"submit",className:"btn btn-primary",disabled:m||!r.trim(),children:m?"Publikowanie...":"Opublikuj post"})]})]}),w.jsx("style",{jsx:!0,children:'\n        .post-create-container {\n          max-width: 600px;\n          margin: 0 auto;\n          padding: 20px;\n        }\n\n        .post-form {\n          background: white;\n          padding: 20px;\n          border-radius: 8px;\n          box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n        }\n\n        .form-group {\n          margin-bottom: 20px;\n        }\n\n        .form-group label {\n          display: block;\n          margin-bottom: 5px;\n          font-weight: bold;\n        }\n\n        .form-group textarea,\n        .form-group input[type="text"] {\n          width: 100%;\n          padding: 12px;\n          border: 1px solid #ddd;\n          border-radius: 4px;\n          font-size: 16px;\n          resize: vertical;\n        }\n\n        .form-group small {\n          color: #666;\n          font-size: 12px;\n        }\n\n        .image-upload-area {\n          border: 2px dashed #ddd;\n          border-radius: 8px;\n          padding: 40px;\n          text-align: center;\n          cursor: pointer;\n          transition: border-color 0.3s;\n        }\n\n        .image-upload-area:hover {\n          border-color: #007bff;\n        }\n\n        .upload-placeholder {\n          color: #666;\n        }\n\n        .upload-icon {\n          font-size: 48px;\n          margin-bottom: 10px;\n          display: block;\n        }\n\n        .image-previews {\n          margin-top: 20px;\n        }\n\n        .preview-grid {\n          display: grid;\n          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));\n          gap: 10px;\n          margin-top: 10px;\n        }\n\n        .image-preview {\n          position: relative;\n          border-radius: 8px;\n          overflow: hidden;\n        }\n\n        .image-preview img {\n          width: 100%;\n          height: 150px;\n          object-fit: cover;\n        }\n\n        .remove-image {\n          position: absolute;\n          top: 5px;\n          right: 5px;\n          background: rgba(255, 0, 0, 0.8);\n          color: white;\n          border: none;\n          border-radius: 50%;\n          width: 24px;\n          height: 24px;\n          cursor: pointer;\n          font-size: 12px;\n        }\n\n        .checkbox-label {\n          display: flex;\n          align-items: center;\n          cursor: pointer;\n        }\n\n        .checkbox-label input[type="checkbox"] {\n          margin-right: 10px;\n        }\n\n        .form-actions {\n          display: flex;\n          gap: 10px;\n          justify-content: flex-end;\n          margin-top: 20px;\n        }\n\n        .btn {\n          padding: 12px 24px;\n          border: none;\n          border-radius: 4px;\n          cursor: pointer;\n          font-size: 16px;\n          transition: background-color 0.3s;\n        }\n\n        .btn-primary {\n          background: #007bff;\n          color: white;\n        }\n\n        .btn-primary:hover:not(:disabled) {\n          background: #0056b3;\n        }\n\n        .btn-primary:disabled {\n          background: #ccc;\n          cursor: not-allowed;\n        }\n\n        .btn-secondary {\n          background: #6c757d;\n          color: white;\n        }\n\n        .btn-secondary:hover {\n          background: #545b62;\n        }\n      '})]})},Xy=()=>{const{user:e,token:t}=N(),[r,o]=i.useState([]),[a,n]=i.useState(null),[s,d]=i.useState([]),[c,l]=i.useState(""),[m,h]=i.useState(!1),[p,x]=i.useState(""),[u,g]=i.useState([]),j=i.useRef(null);i.useEffect(()=>{t&&b()},[t]),i.useEffect(()=>{a&&f(a._id)},[a]),i.useEffect(()=>{y()},[s]);const y=()=>{j.current?.scrollIntoView({behavior:"smooth"})},b=async()=>{try{h(!0);const e=await fetch(`${qy}/api/messages/conversations`,{headers:{Authorization:`Bearer ${t}`}});if(e.ok){const t=await e.json();o(t.conversations||[])}}catch(e){}finally{h(!1)}},f=async e=>{try{const r=await fetch(`${qy}/api/messages/${e}`,{headers:{Authorization:`Bearer ${t}`}});if(r.ok){const e=await r.json();d(e.messages||[])}}catch(r){}},k=t=>t.participants.find(t=>t._id!==e._id),v=e=>{const t=new Date(e),r=(new Date-t)/36e5;return r<24?t.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):r<48?"Wczoraj":t.toLocaleDateString()};return w.jsxs("div",{className:"messages-container",children:[w.jsxs("div",{className:"messages-sidebar",children:[w.jsxs("div",{className:"sidebar-header",children:[w.jsx("h3",{children:"Wiadomości"}),w.jsx("button",{className:"btn btn-primary",onClick:()=>document.getElementById("search-users").focus(),children:"Nowa wiadomość"})]}),w.jsxs("div",{className:"search-section",children:[w.jsx("input",{id:"search-users",type:"text",placeholder:"Wyszukaj użytkowników...",value:p,onChange:i=>{const o=i.target.value;x(o),o.length>=2?(async i=>{if(i.trim())try{const o=await fetch(`${qy}/api/users/search?q=${encodeURIComponent(i)}`,{headers:{Authorization:`Bearer ${t}`}});if(o.ok){const t=await o.json(),i=r.map(t=>t.participants.find(t=>t._id!==e._id)?._id),a=t.users.filter(t=>t._id!==e._id&&!i.includes(t._id));g(a)}}catch(o){}else g([])})(o):g([])}}),u.length>0&&w.jsx("div",{className:"search-results",children:u.map(e=>w.jsxs("div",{className:"search-result",children:[w.jsx("div",{className:"user-avatar",children:e.avatar?w.jsx("img",{src:e.avatar,alt:e.firstName}):w.jsxs("div",{className:"avatar-placeholder",children:[e.firstName.charAt(0),e.lastName.charAt(0)]})}),w.jsxs("div",{className:"user-info",children:[w.jsxs("h4",{children:[e.firstName," ",e.lastName]}),w.jsxs("p",{children:["@",e.username]})]}),w.jsx("button",{className:"btn btn-sm btn-primary",onClick:()=>(async e=>{try{const i=await fetch(`${qy}/api/messages/conversations`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({participantId:e})});if(i.ok){const e=await i.json();o([e.conversation,...r]),n(e.conversation),g([]),x("")}}catch(i){}})(e._id),children:"Napisz"})]},e._id))})]}),w.jsx("div",{className:"conversations-list",children:m?w.jsx("p",{children:"Ładowanie konwersacji..."}):0===r.length?w.jsx("p",{children:"Brak konwersacji. Rozpocznij nową wiadomość!"}):r.map(e=>{const t=k(e);return w.jsxs("div",{className:"conversation-item "+(a?._id===e._id?"active":""),onClick:()=>n(e),children:[w.jsx("div",{className:"conversation-avatar",children:t.avatar?w.jsx("img",{src:t.avatar,alt:t.firstName}):w.jsxs("div",{className:"avatar-placeholder",children:[t.firstName.charAt(0),t.lastName.charAt(0)]})}),w.jsxs("div",{className:"conversation-info",children:[w.jsxs("h4",{children:[t.firstName," ",t.lastName]}),e.lastMessage&&w.jsx("p",{className:"last-message",children:e.lastMessage.content.length>30?e.lastMessage.content.substring(0,30)+"...":e.lastMessage.content}),w.jsx("small",{children:e.lastMessage?v(e.lastMessage.createdAt):""})]})]},e._id)})})]}),w.jsx("div",{className:"messages-main",children:a?w.jsxs(w.Fragment,{children:[w.jsx("div",{className:"chat-header",children:(()=>{const e=k(a);return w.jsx(w.Fragment,{children:w.jsxs("div",{className:"chat-user-info",children:[w.jsx("div",{className:"user-avatar",children:e.avatar?w.jsx("img",{src:e.avatar,alt:e.firstName}):w.jsxs("div",{className:"avatar-placeholder",children:[e.firstName.charAt(0),e.lastName.charAt(0)]})}),w.jsxs("div",{children:[w.jsxs("h3",{children:[e.firstName," ",e.lastName]}),w.jsxs("small",{children:["@",e.username]})]})]})})})()}),w.jsxs("div",{className:"messages-list",children:[s.map(t=>w.jsx("div",{className:"message "+(t.sender._id===e._id?"sent":"received"),children:w.jsxs("div",{className:"message-content",children:[w.jsx("p",{children:t.content}),w.jsx("small",{children:v(t.createdAt)})]})},t._id)),w.jsx("div",{ref:j})]}),w.jsxs("form",{onSubmit:async e=>{if(e.preventDefault(),c.trim()&&a)try{const e=await fetch(`${qy}/api/messages/${a._id}`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({content:c})});if(e.ok){const t=await e.json();d([...s,t.message]),l("");const i=r.map(e=>e._id===a._id?{...e,lastMessage:t.message}:e);o(i)}}catch(i){}},className:"message-form",children:[w.jsx("input",{type:"text",value:c,onChange:e=>l(e.target.value),placeholder:"Napisz wiadomość...",maxLength:500}),w.jsx("button",{type:"submit",disabled:!c.trim(),children:"Wyślij"})]})]}):w.jsxs("div",{className:"no-conversation",children:[w.jsx("h3",{children:"Wybierz konwersację"}),w.jsx("p",{children:"Wybierz konwersację z listy po lewej stronie, aby rozpocząć czat."})]})}),w.jsx("style",{jsx:!0,children:"\n        .messages-container {\n          display: flex;\n          height: 80vh;\n          max-width: 1200px;\n          margin: 0 auto;\n          border: 1px solid #ddd;\n          border-radius: 8px;\n          overflow: hidden;\n        }\n\n        .messages-sidebar {\n          width: 300px;\n          border-right: 1px solid #ddd;\n          display: flex;\n          flex-direction: column;\n        }\n\n        .sidebar-header {\n          padding: 20px;\n          border-bottom: 1px solid #ddd;\n          display: flex;\n          justify-content: space-between;\n          align-items: center;\n        }\n\n        .sidebar-header h3 {\n          margin: 0;\n        }\n\n        .search-section {\n          padding: 15px;\n          border-bottom: 1px solid #ddd;\n        }\n\n        .search-section input {\n          width: 100%;\n          padding: 8px;\n          border: 1px solid #ddd;\n          border-radius: 4px;\n        }\n\n        .search-results {\n          margin-top: 10px;\n        }\n\n        .search-result {\n          display: flex;\n          align-items: center;\n          padding: 10px;\n          border: 1px solid #ddd;\n          margin-bottom: 5px;\n          border-radius: 4px;\n        }\n\n        .conversations-list {\n          flex: 1;\n          overflow-y: auto;\n        }\n\n        .conversation-item {\n          display: flex;\n          align-items: center;\n          padding: 15px;\n          border-bottom: 1px solid #eee;\n          cursor: pointer;\n          transition: background-color 0.2s;\n        }\n\n        .conversation-item:hover,\n        .conversation-item.active {\n          background-color: #f8f9fa;\n        }\n\n        .conversation-avatar,\n        .user-avatar {\n          margin-right: 10px;\n        }\n\n        .conversation-avatar img,\n        .user-avatar img {\n          width: 40px;\n          height: 40px;\n          border-radius: 50%;\n          object-fit: cover;\n        }\n\n        .avatar-placeholder {\n          width: 40px;\n          height: 40px;\n          border-radius: 50%;\n          background: #007bff;\n          color: white;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          font-weight: bold;\n          font-size: 14px;\n        }\n\n        .conversation-info {\n          flex: 1;\n        }\n\n        .conversation-info h4 {\n          margin: 0 0 5px 0;\n          font-size: 14px;\n        }\n\n        .last-message {\n          margin: 0 0 5px 0;\n          color: #666;\n          font-size: 12px;\n        }\n\n        .conversation-info small {\n          color: #999;\n          font-size: 11px;\n        }\n\n        .messages-main {\n          flex: 1;\n          display: flex;\n          flex-direction: column;\n        }\n\n        .chat-header {\n          padding: 20px;\n          border-bottom: 1px solid #ddd;\n          background: #f8f9fa;\n        }\n\n        .chat-user-info {\n          display: flex;\n          align-items: center;\n        }\n\n        .chat-user-info h3 {\n          margin: 0 0 5px 0;\n        }\n\n        .chat-user-info small {\n          color: #666;\n        }\n\n        .messages-list {\n          flex: 1;\n          padding: 20px;\n          overflow-y: auto;\n          display: flex;\n          flex-direction: column;\n          gap: 10px;\n        }\n\n        .message {\n          display: flex;\n          margin-bottom: 10px;\n        }\n\n        .message.sent {\n          justify-content: flex-end;\n        }\n\n        .message.received {\n          justify-content: flex-start;\n        }\n\n        .message-content {\n          max-width: 70%;\n          padding: 10px 15px;\n          border-radius: 18px;\n          position: relative;\n        }\n\n        .message.sent .message-content {\n          background: #007bff;\n          color: white;\n        }\n\n        .message.received .message-content {\n          background: #e9ecef;\n          color: #333;\n        }\n\n        .message-content p {\n          margin: 0 0 5px 0;\n        }\n\n        .message-content small {\n          font-size: 11px;\n          opacity: 0.7;\n        }\n\n        .message-form {\n          padding: 20px;\n          border-top: 1px solid #ddd;\n          display: flex;\n          gap: 10px;\n        }\n\n        .message-form input {\n          flex: 1;\n          padding: 12px;\n          border: 1px solid #ddd;\n          border-radius: 20px;\n          outline: none;\n        }\n\n        .message-form button {\n          padding: 12px 20px;\n          background: #007bff;\n          color: white;\n          border: none;\n          border-radius: 20px;\n          cursor: pointer;\n        }\n\n        .message-form button:disabled {\n          background: #ccc;\n          cursor: not-allowed;\n        }\n\n        .no-conversation {\n          flex: 1;\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          justify-content: center;\n          color: #666;\n        }\n\n        .btn {\n          padding: 8px 16px;\n          border: none;\n          border-radius: 4px;\n          cursor: pointer;\n          font-size: 14px;\n        }\n\n        .btn-primary {\n          background: #007bff;\n          color: white;\n        }\n\n        .btn-sm {\n          padding: 4px 8px;\n          font-size: 12px;\n        }\n      "})]})};function Qy(){return w.jsx("div",{style:{background:"red",color:"white",fontSize:"3rem",textAlign:"center",padding:"5rem",margin:"2rem"},children:"TEST KOMPONENTU DZIAŁA!"})}const eb=p.div`
  min-height: 100vh;
  background: #f5f5f5;
  color: #333;
  padding: 2rem;
`,tb=p.div`
  text-align: center;
  margin-bottom: 2rem;
`,rb=p.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #00D4AA;
  margin-bottom: 0.5rem;
`,ib=p.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
`,ob=p.div`
  width: 100%;
  height: 600px;
  border-radius: 16px;
  overflow: hidden;
  border: 3px solid #ddd;
  position: relative;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`,ab=p.div`
  width: 100%;
  height: 100%;
  position: relative;
`,nb=p.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fff 0%, #f5f5f5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #666;
  font-size: 1.2rem;
`,sb=p.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`,db=p.select`
  padding: 0.75rem 1rem;
  border: 2px solid #ddd;
  border-radius: 12px;
  background: white;
  color: #333;
  font-size: 1rem;
  min-width: 200px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #00D4AA;
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.2);
  }
  
  &:hover {
    border-color: #00D4AA;
  }
`,cb=p.div`
  background: white;
  border: 2px solid #ddd;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
`,lb=p.h2`
  font-size: 1.5rem;
  color: #00D4AA;
  margin-bottom: 1rem;
`,mb=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`,hb=p.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`,pb=p.span`
  font-weight: 600;
  color: #666;
  font-size: 0.875rem;
`,xb=p.span`
  font-size: 1rem;
  color: #333;
`,ub=p.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`,gb=p.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid #ddd;
  border-radius: 12px;
  background: white;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #00D4AA;
    background: rgba(0, 212, 170, 0.1);
  }
  
  &.primary {
    background: #00D4AA;
    color: white;
    border-color: #00D4AA;
    
    &:hover {
      background: #00B894;
    }
  }
`,jb=p.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #ddd;
  border-radius: 50%;
  border-top-color: #00D4AA;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`,yb=p.div`
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid #e74c3c;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: center;
`,bb=p.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
  background: white;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`,fb=p.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`,wb=p.button`
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #f5f5f5;
  }
`,kb=p.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  background: white;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`,vb=p.button`
  display: block;
  width: 100%;
  padding: 8px 12px;
  margin: 2px 0;
  border: 1px solid #ddd;
  background: ${e=>e.active?"#00D4AA":"white"};
  color: ${e=>e.active?"white":"#333"};
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: ${e=>e.active?"#00B894":"#f5f5f5"};
  }
`,zb=p.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 8px;
  font-size: 12px;
  max-width: 300px;
`;function $b(){a();const[e,t]=i.useState(""),[r,o]=i.useState(""),[n,s]=i.useState(""),[d,c]=i.useState(""),[l,m]=i.useState([]),[h,p]=i.useState([]),[x,u]=i.useState([]),[g,j]=i.useState([]),[y,b]=i.useState(null),[f,k]=i.useState(!1),[v,z]=i.useState(""),[$,S]=i.useState(!1),[C,N]=i.useState("województwo"),[P,B]=i.useState([]),[A,T]=i.useState(6),[M,L]=i.useState(""),E=i.useRef(null),W=i.useRef(null),D=i.useRef(null),O=i.useRef(null),I=i.useRef([]);i.useEffect(()=>{K(),Z()},[]),i.useEffect(()=>{$&&F()},[$,C]);const F=async()=>{try{k(!0);const e=await fetch(`/api/locations/boundaries?type=${C}`),t=await e.json();t.success&&(B(t.boundaries),_(t.boundaries))}catch(e){z("Nie udało się załadować granic administracyjnych")}finally{k(!1)}},_=e=>{W.current&&window.google&&(I.current.forEach(e=>{e.setMap(null)}),I.current=[],e.forEach(e=>{const t=e.bounds,r=new window.google.maps.Polygon({paths:[{lat:t.north,lng:t.west},{lat:t.north,lng:t.east},{lat:t.south,lng:t.east},{lat:t.south,lng:t.west}],strokeColor:"#00D4AA",strokeOpacity:.8,strokeWeight:2,fillColor:"#00D4AA",fillOpacity:.1,map:W.current,title:e.name});r.addListener("click",t=>{const r=new window.google.maps.LatLngBounds;r.extend({lat:e.bounds.north,lng:e.bounds.west}),r.extend({lat:e.bounds.south,lng:e.bounds.east}),W.current.fitBounds(r),O.current&&(O.current.setContent(`\n            <div style="padding: 15px; max-width: 250px; font-family: Arial, sans-serif;">\n              <div style="margin-bottom: 10px;">\n                <strong style="font-size: 16px; color: #333;">${e.name}</strong>\n              </div>\n              <div style="margin-bottom: 8px;">\n                <span style="color: #666; font-size: 0.9em;">Typ: ${e.type}</span>\n              </div>\n              <div style="margin-bottom: 8px;">\n                <span style="color: #666; font-size: 0.9em;">Kod: ${e.code}</span>\n              </div>\n              <div style="margin-top: 12px;">\n                <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333; font-size: 14px;">\n                  Przejdź do poziomu:\n                </label>\n                <select id="levelSelect" onchange="window.navigateToSelectedLevel()" style="width: 100%; padding: 8px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px; background: white; cursor: pointer;">\n                  <option value="">Wybierz poziom administracyjny...</option>\n                  <option value="wojewodztwo">Województwo</option>\n                  <option value="powiat">Powiat</option>\n                  <option value="gmina">Gmina</option>\n                  <option value="miejscowosc">Miejscowość</option>\n                </select>\n              </div>\n            </div>\n          `),O.current.setPosition(t.latLng),O.current.open(W.current)),window.navigateToSelectedLevel=()=>{const t=document.getElementById("levelSelect").value;if(!t)return;const r=e.hierarchy||{};switch(t){case"wojewodztwo":r.wojewodztwo?window.location.href=`/voivodeships/${r.wojewodztwo.code}`:window.location.href=`/voivodeships/${e.code.substring(0,2)}`;break;case"powiat":r.powiat?window.location.href=`/counties/${r.powiat.code}`:window.location.href=`/counties/${e.code.substring(0,4)}`;break;case"gmina":r.gmina?window.location.href=`/municipalities/${r.gmina.code}`:window.location.href=`/municipalities/${e.code.substring(0,6)}`;break;case"miejscowosc":window.location.href=`/cities/${e.code}`}}}),r.addListener("mouseover",()=>{r.setOptions({fillOpacity:.3,strokeWeight:3}),L(`Kliknij aby przejść do: ${e.name}`)}),r.addListener("mouseout",()=>{r.setOptions({fillOpacity:.1,strokeWeight:2}),L("")}),I.current.push(r)}))},R=e=>{N(e),T("województwo"===e?6:"powiat"===e?8:"gmina"===e?10:12),W.current&&W.current.setZoom(A)},Z=async()=>{try{if(window.google&&window.google.maps)return void H();const e=document.createElement("script");e.src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places",e.async=!0,e.defer=!0,e.onload=()=>{H()},e.onerror=()=>{z("Nie udało się załadować Google Maps API")},document.head.appendChild(e)}catch(e){z("Błąd inicjalizacji Google Maps")}},H=()=>{try{if(!window.google||!window.google.maps)return void z("Google Maps API nie jest dostępne");const e=new window.google.maps.Map(E.current,{center:{lat:52.2297,lng:21.0122},zoom:A,mapTypeId:window.google.maps.MapTypeId.ROADMAP,styles:[{featureType:"poi",elementType:"labels",stylers:[{visibility:"off"}]}]});W.current=e;const t=new window.google.maps.Marker({position:{lat:52.2297,lng:21.0122},map:e,title:"Warszawa"});D.current=t;const r=new window.google.maps.InfoWindow({content:'<div style="padding: 10px;"><strong>Warszawa</strong><br>Stolica Polski</div>'});O.current=r,t.addListener("click",()=>{r.open(e,t)}),e.addListener("click",e=>{U(e)}),S(!0)}catch(e){z("Błąd inicjalizacji mapy Google Maps")}},U=async e=>{try{const t=e.latLng.lat(),r=e.latLng.lng(),i=await fetch(`/api/locations/by-coordinates?lat=${t}&lng=${r}`),o=await i.json();o.success&&(b(o.location),O.current&&(O.current.setContent(`\n            <div style="padding: 10px; max-width: 200px;">\n              <strong>${o.location.name}</strong><br>\n              <span style="color: #666; font-size: 0.9em;">${o.location.type}</span><br>\n              <span style="color: #666; font-size: 0.9em;">Współrzędne: ${t.toFixed(4)}, ${r.toFixed(4)}</span>\n            </div>\n          `),O.current.setPosition(e.latLng),O.current.open(W.current)))}catch(t){}},K=async()=>{try{k(!0);const e=await fetch("/api/locations/voivodeships"),t=await e.json();m(t||[])}catch(e){z("Nie udało się pobrać listy województw")}finally{k(!1)}},Y=async(e,t,r)=>{try{k(!0),z("");const i={id:t,name:r,type:e,code:t,coordinates:{lat:52.2297+.1*Math.random(),lng:21.0122+.1*Math.random()}};if(b(i),$&&W.current&&D.current&&i.coordinates){const e=W.current,t=D.current,r={lat:i.coordinates.lat,lng:i.coordinates.lng};e.setCenter(r),e.setZoom(12),t.setPosition(r),t.setMap(e),O.current&&(O.current.setContent(`\n            <div style="padding: 10px; max-width: 200px;">\n              <strong>${i.name}</strong><br>\n              <span style="color: #666; font-size: 0.9em;">${i.type}</span><br>\n              <span style="color: #666; font-size: 0.9em;">Kod: ${i.code}</span>\n            </div>\n          `),O.current.open(e,t))}}catch(i){z("Nie udało się pobrać szczegółów lokalizacji")}finally{k(!1)}};return w.jsxs(eb,{children:[w.jsxs(tb,{children:[w.jsx(rb,{children:"Interaktywna Mapa Lokalizacji"}),w.jsx(ib,{children:"Kliknij na obszar administracyjny aby przejść do odpowiedniej strony"})]}),v&&w.jsx(yb,{children:v}),w.jsxs(sb,{children:[w.jsxs(db,{value:e,onChange:e=>{const r=e.target.value;if(t(r),o(""),s(""),c(""),p([]),u([]),j([]),r){const e=l.find(e=>e.code===r);e&&(Y("województwo",r,e.name),(async e=>{try{k(!0);const t=await fetch(`/api/locations/voivodeships/${e}/counties`),r=await t.json();p(r.counties||[])}catch(t){z("Nie udało się pobrać listy powiatów")}finally{k(!1)}})(r))}},children:[w.jsx("option",{value:"",children:"Wybierz województwo"}),l.map((e,t)=>w.jsx("option",{value:e.code,children:e.name},`voivodeship-${e.code}-${t}`))]}),w.jsxs(db,{value:r,onChange:e=>{const t=e.target.value;if(o(t),s(""),c(""),u([]),j([]),t){const e=h.find(e=>e.code===t);e&&(Y("powiat",t,e.name),(async e=>{try{k(!0);const t=await fetch(`/api/locations/counties/${e}/municipalities`),r=await t.json();u(r.municipalities||[])}catch(t){z("Nie udało się pobrać listy gmin")}finally{k(!1)}})(t))}},disabled:!e,children:[w.jsx("option",{value:"",children:"Wybierz powiat"}),h.map((e,t)=>w.jsx("option",{value:e.code,children:e.name},`county-${e.code}-${t}`))]}),w.jsxs(db,{value:n,onChange:e=>{const t=e.target.value;if(s(t),c(""),j([]),t){const e=x.find(e=>e.code===t);e&&(Y("gmina",t,e.name),(async e=>{try{k(!0);const t=await fetch(`/api/locations/municipalities/${e}/towns`),r=await t.json();j(r.towns||[])}catch(t){z("Nie udało się pobrać listy miejscowości")}finally{k(!1)}})(t))}},disabled:!r,children:[w.jsx("option",{value:"",children:"Wybierz gminę"}),x.map((e,t)=>w.jsx("option",{value:e.code,children:e.name},`municipality-${e.code}-${t}`))]}),w.jsxs(db,{value:d,onChange:e=>{const t=e.target.value;if(c(t),t){const e=g.find(e=>e.code===t);e&&Y("miejscowość",t,e.name)}},disabled:!n,children:[w.jsx("option",{value:"",children:"Wybierz miejscowość"}),g.map((e,t)=>w.jsx("option",{value:e.code,children:e.name},`town-${e.code}-${t}`))]})]}),w.jsx(ob,{children:w.jsxs(ab,{children:[w.jsx("div",{ref:E,style:{width:"100%",height:"100%"}}),w.jsx(bb,{children:w.jsxs(fb,{children:[w.jsx(wb,{onClick:()=>{W.current&&W.current.setZoom(W.current.getZoom()+1)},children:"+"}),w.jsx(wb,{onClick:()=>{W.current&&W.current.setZoom(W.current.getZoom()-1)},children:"-"})]})}),w.jsxs(kb,{children:[w.jsx(vb,{active:"województwo"===C,onClick:()=>R("województwo"),children:"Województwa"}),w.jsx(vb,{active:"powiat"===C,onClick:()=>R("powiat"),children:"Powiaty"}),w.jsx(vb,{active:"gmina"===C,onClick:()=>R("gmina"),children:"Gminy"}),w.jsx(vb,{active:"miejscowość"===C,onClick:()=>R("miejscowość"),children:"Miejscowości"})]}),M&&w.jsx(zb,{children:M}),!$&&w.jsxs(nb,{children:[w.jsx("div",{children:"Ładowanie mapy..."}),f&&w.jsx(jb,{})]})]})}),y&&w.jsxs(cb,{children:[w.jsx(lb,{children:y.name}),w.jsxs(mb,{children:[w.jsxs(hb,{children:[w.jsx(pb,{children:"Typ"}),w.jsx(xb,{children:y.type})]}),w.jsxs(hb,{children:[w.jsx(pb,{children:"Kod"}),w.jsx(xb,{children:y.code})]}),w.jsxs(hb,{children:[w.jsx(pb,{children:"Współrzędne"}),w.jsxs(xb,{children:[y.lat,", ",y.lng]})]})]}),w.jsxs(ub,{children:[w.jsx(gb,{onClick:()=>{y&&(localStorage.setItem("selectedLocation",JSON.stringify(y)),alert(`Ustawiono lokalizację: ${y.name}`))},children:"Ustaw jako lokalizację"}),w.jsx(gb,{onClick:()=>{y&&alert(`Szczegóły lokalizacji: ${y.name} (${y.type})`)},children:"Zobacz szczegóły"})]})]})]})}const Sb=p.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`,Cb=p.h1`
  font-size: 2.2rem;
  margin-bottom: 1rem;
`,Nb=p.button`
  margin-bottom: 1.5rem;
  background: ${({theme:e})=>e.primary};
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
`,Pb=p.div`
  margin-bottom: 2rem;
`,Bb=p.div`
  font-weight: bold;
  margin-bottom: 0.3rem;
`,Ab=p.div`
  margin-bottom: 0.7rem;
`;function Tb({theme:e}){const{id:t}=n(),r=a(),[o,s]=i.useState(null),[d,c]=i.useState(!0),[l,m]=i.useState(null);return i.useEffect(()=>{(async()=>{c(!0),m(null);try{const e="http://localhost:5000",r=await fetch(`${e}/api/company-profiles/${t}`);if(!r.ok)throw new Error("Nie znaleziono firmy");const i=await r.json();s(i)}catch(e){m(e.message)}finally{c(!1)}})()},[t]),d?w.jsx(Sb,{children:"Ładowanie..."}):l?w.jsxs(Sb,{children:["Błąd: ",l]}):o?w.jsxs(Sb,{children:[w.jsx(Nb,{theme:e,onClick:()=>r(-1),children:"← Powrót"}),w.jsx(Cb,{children:o.name}),w.jsxs(Pb,{children:[w.jsx(Bb,{children:"Opis:"}),w.jsx(Ab,{children:o.description||"Brak opisu"}),w.jsx(Bb,{children:"Branża:"}),w.jsx(Ab,{children:o.industry||"Brak danych"}),w.jsx(Bb,{children:"Właściciel:"}),w.jsx(Ab,{children:o.owner?.username||"Brak danych"}),o.logo&&w.jsx("img",{src:o.logo,alt:"Logo",style:{maxWidth:180,margin:"1rem 0"}})]}),w.jsxs(Pb,{children:[w.jsx(Bb,{children:"Produkty:"}),w.jsx(Ab,{children:o.products?.length?o.products.map(e=>e.name).join(", "):"Brak produktów"})]}),w.jsxs(Pb,{children:[w.jsx(Bb,{children:"Posty firmowe:"}),w.jsx(Ab,{children:o.posts?.length?o.posts.map(e=>e.title).join(", "):"Brak postów"})]})]}):w.jsx(Sb,{children:"Brak danych firmy."})}const Mb=p.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`,Lb=p.h1`
  font-size: 2.2rem;
  margin-bottom: 1rem;
`,Eb=p.button`
  margin-bottom: 1.5rem;
  background: ${({theme:e})=>e.primary};
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
`,Wb=p.div`
  margin-bottom: 2rem;
`,Db=p.div`
  font-weight: bold;
  margin-bottom: 0.3rem;
`,Ob=p.div`
  margin-bottom: 0.7rem;
`;function Ib({theme:e}){const{id:t}=n(),r=a(),[o,s]=i.useState(null),[d,c]=i.useState(!0),[l,m]=i.useState(null);return i.useEffect(()=>{(async()=>{c(!0),m(null);try{const e="http://localhost:5000",r=await fetch(`${e}/api/products/${t}`);if(!r.ok)throw new Error("Nie znaleziono produktu");const i=await r.json();s(i)}catch(e){m(e.message)}finally{c(!1)}})()},[t]),d?w.jsx(Mb,{children:"Ładowanie..."}):l?w.jsxs(Mb,{children:["Błąd: ",l]}):o?w.jsxs(Mb,{children:[w.jsx(Eb,{theme:e,onClick:()=>r(-1),children:"← Powrót"}),w.jsx(Lb,{children:o.name}),w.jsxs(Wb,{children:[w.jsx(Db,{children:"Opis:"}),w.jsx(Ob,{children:o.description||"Brak opisu"}),w.jsx(Db,{children:"Cena:"}),w.jsx(Ob,{children:o.price?`${o.price} zł`:"Brak ceny"}),w.jsx(Db,{children:"Kategoria:"}),w.jsx(Ob,{children:o.category||"Brak danych"}),w.jsx(Db,{children:"Sklep:"}),w.jsx(Ob,{children:o.shop?.name||"Brak danych"}),o.mainImage&&w.jsx("img",{src:o.mainImage,alt:"Zdjęcie",style:{maxWidth:220,margin:"1rem 0"}})]})]}):w.jsx(Mb,{children:"Brak danych produktu."})}const Fb=p.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`,_b=p.h1`
  font-size: 2.2rem;
  margin-bottom: 1rem;
`,Rb=p.button`
  margin-bottom: 1.5rem;
  background: ${({theme:e})=>e.primary};
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
`,Zb=p.div`
  margin-bottom: 2rem;
`,Hb=p.div`
  font-weight: bold;
  margin-bottom: 0.3rem;
`,Ub=p.div`
  margin-bottom: 0.7rem;
`;function Kb({theme:e}){const{id:t}=n(),r=a(),[o,s]=i.useState(null),[d,c]=i.useState(!0),[l,m]=i.useState(null);return i.useEffect(()=>{(async()=>{c(!0),m(null);try{const e="http://localhost:5000",r=await fetch(`${e}/api/users/${t}`);if(!r.ok)throw new Error("Nie znaleziono użytkownika");const i=await r.json();s(i)}catch(e){m(e.message)}finally{c(!1)}})()},[t]),d?w.jsx(Fb,{children:"Ładowanie..."}):l?w.jsxs(Fb,{children:["Błąd: ",l]}):o?w.jsxs(Fb,{children:[w.jsx(Rb,{theme:e,onClick:()=>r(-1),children:"← Powrót"}),w.jsx(_b,{children:o.username||o.firstName+" "+o.lastName}),w.jsxs(Zb,{children:[w.jsx(Hb,{children:"Email:"}),w.jsx(Ub,{children:o.email||"Brak emaila"}),w.jsx(Hb,{children:"Imię i nazwisko:"}),w.jsxs(Ub,{children:[o.firstName," ",o.lastName]}),o.avatar&&w.jsx("img",{src:o.avatar,alt:"Avatar",style:{maxWidth:120,margin:"1rem 0"}}),w.jsx(Hb,{children:"Bio:"}),w.jsx(Ub,{children:o.bio||"Brak opisu"})]}),w.jsxs(Zb,{children:[w.jsx(Hb,{children:"Sklepy:"}),w.jsx(Ub,{children:o.shops?.length?o.shops.map(e=>e.name).join(", "):"Brak sklepów"})]}),w.jsxs(Zb,{children:[w.jsx(Hb,{children:"Posty:"}),w.jsx(Ub,{children:o.posts?.length?o.posts.map(e=>e.title).join(", "):"Brak postów"})]})]}):w.jsx(Fb,{children:"Brak danych użytkownika."})}const Yb=p.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`,Vb=p.h1`
  font-size: 2.2rem;
  margin-bottom: 1rem;
`,qb=p.button`
  margin-bottom: 1.5rem;
  background: ${({theme:e})=>e.primary};
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
`,Gb=p.div`
  margin-bottom: 2rem;
`,Jb=p.div`
  font-weight: bold;
  margin-bottom: 0.3rem;
`,Xb=p.div`
  margin-bottom: 0.7rem;
`;function Qb({theme:e}){const{id:t}=n(),r=a(),[o,s]=i.useState(null),[d,c]=i.useState(!0),[l,m]=i.useState(null);return i.useEffect(()=>{(async()=>{c(!0),m(null);try{const e="http://localhost:5000",r=await fetch(`${e}/api/posts/${t}`);if(!r.ok)throw new Error("Nie znaleziono posta");const i=await r.json();s(i)}catch(e){m(e.message)}finally{c(!1)}})()},[t]),d?w.jsx(Yb,{children:"Ładowanie..."}):l?w.jsxs(Yb,{children:["Błąd: ",l]}):o?w.jsxs(Yb,{children:[w.jsx(qb,{theme:e,onClick:()=>r(-1),children:"← Powrót"}),w.jsx(Vb,{children:o.title}),w.jsxs(Gb,{children:[w.jsx(Jb,{children:"Autor:"}),w.jsx(Xb,{children:o.author?.username||"Brak danych"}),w.jsx(Jb,{children:"Data:"}),w.jsx(Xb,{children:o.createdAt?new Date(o.createdAt).toLocaleString():"Brak daty"}),w.jsx(Jb,{children:"Treść:"}),w.jsx(Xb,{children:o.content||"Brak treści"}),w.jsx(Jb,{children:"Liczba polubień:"}),w.jsx(Xb,{children:o.likes?.length||0}),w.jsx(Jb,{children:"Komentarze:"}),w.jsx(Xb,{children:o.comments?.length?o.comments.map(e=>e.content).join(" | "):"Brak komentarzy"})]})]}):w.jsx(Yb,{children:"Brak danych posta."})}const ef=p.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`,tf=p.div`
  width: 350px;
  height: 500px;
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
  transform: ${e=>e.isOpen?"translateY(0)":"translateY(100%)"};
  opacity: ${e=>e.isOpen?1:0};
`,rf=p.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`,of=p.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
`,af=p.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`,nf=p.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`,sf=p.div`
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
  
  ${e=>e.isUser?"\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    color: white;\n    align-self: flex-end;\n    border-bottom-right-radius: 5px;\n  ":`\n    background: ${e.theme.background};\n    color: ${e.theme.text};\n    border: 1px solid ${e.theme.border};\n    align-self: flex-start;\n    border-bottom-left-radius: 5px;\n  `}
`,df=p.div`
  padding: 15px;
  border-top: 1px solid ${e=>e.theme.border};
  display: flex;
  gap: 10px;
`,cf=p.input`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid ${e=>e.theme.border};
  border-radius: 20px;
  font-size: 14px;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
`,lf=p.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`,mf=p.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  display: ${e=>e.isOpen?"none":"flex"};
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
  }
`,hf=p.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`,pf=p.button`
  background: ${e=>e.theme.background};
  border: 1px solid ${e=>e.theme.border};
  color: ${e=>e.theme.text};
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }
`,xf=p.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 15px;
  color: ${e=>e.theme.textSecondary};
  font-size: 14px;
  
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${e=>e.theme.textSecondary};
    animation: typing 1.4s infinite ease-in-out;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }
  
  @keyframes typing {
    0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
    40% { transform: scale(1); opacity: 1; }
  }
`,uf=p.div`
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 8px;
  padding: 10px;
  margin-top: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #667eea;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
  }
`,gf=p.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 10px;
`,jf=p.div`
  display: flex;
  align-items: center;
`,yf=p.div`
  flex: 1;
`,bf=p.div`
  font-weight: 600;
  font-size: 14px;
  color: ${e=>e.theme.text};
`,ff=p.div`
  font-size: 12px;
  color: ${e=>e.theme.textSecondary};
`,wf=({theme:e})=>{const[t,r]=i.useState(!1),[o,a]=i.useState([]),[n,s]=i.useState(""),[d,c]=i.useState(!1),[l,m]=i.useState({}),h=i.useRef(null);i.useEffect(()=>{t&&0===o.length&&x("Cześć! Jestem Twoim AI asystentem produktowym. Pomogę Ci znaleźć idealne produkty! 🛍️\n\nMożesz zapytać mnie o:\n• Rekomendacje produktów\n• Porównania cen\n• Najlepsze oferty\n• Specyfikacje techniczne\n• Opinie użytkowników")},[t]),i.useEffect(()=>{p()},[o]);const p=()=>{h.current?.scrollIntoView({behavior:"smooth"})},x=(e,t=null)=>{a(r=>[...r,{id:Date.now(),text:e,isUser:!1,suggestions:t}])},u=e=>{a(t=>[...t,{id:Date.now(),text:e,isUser:!0}])},g=async e=>{c(!0),await new Promise(e=>setTimeout(e,1500+1e3*Math.random())),c(!1);const t=e.toLowerCase();t.includes("laptop")||t.includes("komputer")?x("Świetnie! Pomogę Ci znaleźć idealny laptop. 🖥️\n\nOto kilka pytań, które pomogą mi lepiej Ci doradzić:\n• Jaki jest Twój budżet?\n• Do czego głównie będziesz używać laptopa?\n• Preferujesz markę?\n• Ważny jest dla Ciebie czas pracy na baterii?",[{name:"Laptop gamingowy",price:"od 3000 zł"},{name:"Laptop biznesowy",price:"od 2500 zł"},{name:"Laptop studencki",price:"od 1500 zł"}]):t.includes("smartfon")||t.includes("telefon")?x("Pomogę Ci wybrać idealny smartfon! 📱\n\nOto moje rekomendacje w różnych kategoriach:",[{name:"iPhone 15 Pro",price:"od 4999 zł"},{name:"Samsung Galaxy S24",price:"od 3999 zł"},{name:"Xiaomi Redmi Note 13",price:"od 999 zł"}]):t.includes("promocj")||t.includes("oferta")?x("Sprawdzam najlepsze promocje! 🔥\n\nOto dzisiejsze hity:",[{name:"Słuchawki Sony WH-1000XM5",price:"1299 zł (-300 zł)"},{name:"Tablet iPad Air",price:"2499 zł (-500 zł)"},{name:"Kamera GoPro Hero 11",price:"1899 zł (-400 zł)"}]):t.includes("budżet")||t.includes("tani")?x("Rozumiem, szukasz produktów w dobrej cenie! 💰\n\nOto moje rekomendacje budżetowe:",[{name:"Laptop Lenovo IdeaPad",price:"1499 zł"},{name:"Smartfon Samsung Galaxy A15",price:"699 zł"},{name:"Tablet Amazon Fire HD",price:"399 zł"}]):x("Dziękuję za wiadomość! 🤖\n\nJestem tu, aby pomóc Ci znaleźć idealne produkty. Możesz zapytać mnie o konkretne kategorie, porównania cen lub rekomendacje na podstawie Twoich potrzeb.")},j=async()=>{if(!n.trim())return;const e=n.trim();u(e),s(""),await g(e)};return w.jsxs(ef,{children:[w.jsxs(tf,{isOpen:t,theme:e,children:[w.jsxs(rf,{onClick:()=>r(!1),children:[w.jsx(of,{children:"🤖 AI Asystent Produktowy"}),w.jsx(af,{children:"×"})]}),w.jsxs(nf,{children:[o.map(t=>w.jsxs("div",{children:[w.jsx(sf,{isUser:t.isUser,theme:e,children:t.text}),t.suggestions&&w.jsx("div",{children:t.suggestions.map((t,r)=>w.jsx(uf,{theme:e,onClick:()=>(e=>{x(`Świetny wybór! ${e.name} to naprawdę dobry produkt w cenie ${e.price}. 🎉\n\nChcesz, żebym pokazał Ci więcej szczegółów lub podobne produkty?`)})(t),children:w.jsxs(jf,{children:[w.jsx(gf,{src:`https://picsum.photos/50/50?random=${r}`,alt:t.name}),w.jsxs(yf,{children:[w.jsx(bf,{theme:e,children:t.name}),w.jsx(ff,{theme:e,children:t.price})]})]})},r))})]},t.id)),d&&w.jsxs(xf,{theme:e,children:[w.jsx("span",{children:"AI pisze"}),w.jsx("div",{className:"dot"}),w.jsx("div",{className:"dot"}),w.jsx("div",{className:"dot"})]}),w.jsx("div",{ref:h})]}),w.jsxs(df,{theme:e,children:[w.jsx(cf,{value:n,onChange:e=>s(e.target.value),onKeyPress:e=>{"Enter"===e.key&&j()},placeholder:"Napisz wiadomość...",theme:e}),w.jsx(lf,{onClick:j,disabled:!n.trim(),children:"➤"})]}),1===o.length&&w.jsx("div",{style:{padding:"0 15px 15px"},children:w.jsx(hf,{children:["Pomóż mi znaleźć laptop","Najlepsze smartfony","Promocje dzisiaj","Porównaj produkty","Rekomendacje"].map((t,r)=>w.jsx(pf,{theme:e,onClick:()=>(e=>{u(e),g(e)})(t),children:t},r))})})]}),w.jsx(mf,{isOpen:t,onClick:()=>r(!0),children:"🤖"})]})},kf=p.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
`,vf=p.input`
  flex: 1;
  padding: 12px 50px 12px 15px;
  border: 2px solid ${e=>e.isListening?"#667eea":e.theme.border};
  border-radius: 25px;
  font-size: 16px;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  transition: all 0.3s ease;
  box-shadow: ${e=>e.isListening?"0 0 0 3px rgba(102, 126, 234, 0.1)":"none"};
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: ${e=>e.theme.textSecondary};
  }
`,zf=p.button`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: ${e=>e.isListening?"linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)":"linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  animation: ${e=>e.isListening?"pulse 1.5s infinite":"none"};
  
  &:hover {
    transform: translateY(-50%) scale(1.05);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: translateY(-50%);
  }
  
  @keyframes pulse {
    0% { transform: translateY(-50%) scale(1); }
    50% { transform: translateY(-50%) scale(1.1); }
    100% { transform: translateY(-50%) scale(1); }
  }
`,$f=p.div`
  position: absolute;
  top: -30px;
  right: 0;
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  color: ${e=>e.theme.text};
  display: ${e=>e.show?"block":"none"};
  animation: slideIn 0.3s ease;
  
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`,Sf=p.div`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: 8px;
  
  .bar {
    width: 3px;
    background: #667eea;
    border-radius: 2px;
    animation: wave 1s infinite ease-in-out;
    
    &:nth-child(1) { animation-delay: -0.4s; }
    &:nth-child(2) { animation-delay: -0.3s; }
    &:nth-child(3) { animation-delay: -0.2s; }
    &:nth-child(4) { animation-delay: -0.1s; }
    &:nth-child(5) { animation-delay: 0s; }
  }
  
  @keyframes wave {
    0%, 40%, 100% { height: 8px; }
    20% { height: 20px; }
  }
`,Cf=p.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 8px;
  margin-top: 5px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`,Nf=p.div`
  padding: 10px 15px;
  cursor: pointer;
  border-bottom: 1px solid ${e=>e.theme.border};
  transition: background 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.background};
  }
  
  &:last-child {
    border-bottom: none;
  }
`,Pf=p.div`
  font-size: 14px;
  color: ${e=>e.theme.text};
`,Bf=p.div`
  font-size: 12px;
  color: ${e=>e.theme.textSecondary};
  margin-top: 2px;
`,Af=p.div`
  position: absolute;
  top: -40px;
  right: 0;
  background: #ff6b6b;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  animation: slideIn 0.3s ease;
`,Tf=({theme:e,onSearch:t,placeholder:r="Wyszukaj głosowo..."})=>{const[o,a]=i.useState(!1),[n,s]=i.useState(""),[d,c]=i.useState([]),[l,m]=i.useState(""),[h,p]=i.useState(!1),x=i.useRef(null),u=i.useRef(null),g=[{text:"laptop gamingowy",category:"Elektronika"},{text:"smartfon samsung",category:"Telefony"},{text:"słuchawki bezprzewodowe",category:"Akcesoria"},{text:"tablet apple",category:"Tablety"},{text:"kamera go pro",category:"Fotografia"}];i.useEffect(()=>{if(!("webkitSpeechRecognition"in window)&&!("SpeechRecognition"in window))return void m("Twoja przeglądarka nie obsługuje rozpoznawania mowy");const e=window.SpeechRecognition||window.webkitSpeechRecognition;return x.current=new e,x.current.continuous=!1,x.current.interimResults=!0,x.current.lang="pl-PL",x.current.onstart=()=>{a(!0),m("")},x.current.onresult=e=>{let t="",r="";for(let o=e.resultIndex;o<e.results.length;o++){const i=e.results[o][0].transcript;e.results[o].isFinal?t+=i:r+=i}const i=t||r;s(i),i.length>2&&j(i)},x.current.onerror=e=>{switch(a(!1),e.error){case"no-speech":m("Nie wykryto mowy. Spróbuj ponownie.");break;case"audio-capture":m("Błąd dostępu do mikrofonu. Sprawdź uprawnienia.");break;case"not-allowed":m("Dostęp do mikrofonu został zablokowany.");break;default:m("Wystąpił błąd podczas rozpoznawania mowy.")}},x.current.onend=()=>{a(!1),n.trim()&&y(n)},()=>{x.current&&x.current.stop()}},[]);const j=e=>{const t=g.filter(t=>t.text.toLowerCase().includes(e.toLowerCase()));c(t),p(t.length>0)},y=e=>{t&&e.trim()&&t(e.trim()),p(!1)};return w.jsxs(kf,{children:[w.jsx(vf,{ref:u,type:"text",value:n,onChange:e=>{const t=e.target.value;s(t),t.length>2?j(t):p(!1)},onKeyPress:e=>{"Enter"===e.key&&y(n)},placeholder:r,theme:e,isListening:o}),w.jsx(zf,{onClick:()=>{o?x.current&&x.current.stop():x.current&&(s(""),c([]),p(!1),m(""),x.current.start())},isListening:o,disabled:!x.current,title:o?"Zatrzymaj nagrywanie":"Rozpocznij nagrywanie głosowe",children:o?w.jsxs(Sf,{children:[w.jsx("div",{className:"bar"}),w.jsx("div",{className:"bar"}),w.jsx("div",{className:"bar"}),w.jsx("div",{className:"bar"}),w.jsx("div",{className:"bar"})]}):"🎤"}),w.jsxs($f,{show:o,theme:e,children:["Słucham... ",o&&w.jsxs(Sf,{children:[w.jsx("div",{className:"bar"}),w.jsx("div",{className:"bar"}),w.jsx("div",{className:"bar"})]})]}),l&&w.jsx(Af,{children:l}),h&&w.jsx(Cf,{theme:e,children:d.map((t,r)=>w.jsxs(Nf,{theme:e,onClick:()=>(e=>{s(e.text),y(e.text)})(t),children:[w.jsx(Pf,{theme:e,children:t.text}),w.jsx(Bf,{theme:e,children:t.category})]},r))})]})},Mf=p.div`
  position: relative;
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`,Lf=p.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: ${e=>e.isActive?"url(https://picsum.photos/800/600?random=1) center/cover":"rgba(0,0,0,0.3)"};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
`,Ef=p.div`
  position: absolute;
  width: ${e=>100*e.scale}px;
  height: ${e=>100*e.scale}px;
  background: ${e=>e.productImage?`url(${e.productImage}) center/cover`:"#fff"};
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  cursor: move;
  user-select: none;
  transform: translate(${e=>e.x}px, ${e=>e.y}px) rotate(${e=>e.rotation}deg);
  transition: transform 0.1s ease;
  
  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }
`,Wf=p.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 25px;
  padding: 15px 25px;
  display: flex;
  gap: 15px;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
`,Df=p.button`
  background: ${e=>e.active?"#667eea":"rgba(102, 126, 234, 0.1)"};
  color: ${e=>e.active?"white":"#667eea"};
  border: 2px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  
  &:hover {
    background: #667eea;
    color: white;
    transform: scale(1.1);
  }
`,Of=p.input`
  width: 100px;
  height: 4px;
  border-radius: 2px;
  background: #ddd;
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
    border: none;
  }
`,If=p.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 15px;
  max-width: 250px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`,Ff=p.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
`,_f=p.div`
  font-size: 18px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8px;
`,Rf=p.p`
  margin: 0;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
`,Zf=p.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: ${e=>"scanning"===e.status?"#ffa726":"detected"===e.status?"#4caf50":"#f44336"};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`,Hf=p.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
  animation: ${e=>e.pulsing?"pulse 1.5s infinite":"none"};
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`,Uf=p.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  max-width: 300px;
  display: ${e=>e.show?"block":"none"};
`,Kf=p.p`
  margin: 0 0 15px 0;
  font-size: 14px;
  line-height: 1.5;
`,Yf=p.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #5a6fd8;
    transform: scale(1.05);
  }
`,Vf=({product:e,theme:t})=>{const[r,o]=i.useState(!1),[a,n]=i.useState("ready"),[s,d]=i.useState({x:0,y:0}),[c,l]=i.useState(1),[m,h]=i.useState(0),[p,x]=i.useState(!1),[u,g]=i.useState({x:0,y:0}),j=i.useRef(null),y=e||{name:"iPhone 15 Pro",price:"4999 zł",description:"Najnowszy iPhone z kamerą 48MP, chipem A17 Pro i tytanową obudową.",image:"https://picsum.photos/200/200?random=10"};i.useEffect(()=>{r&&(n("scanning"),setTimeout(()=>{n("detected")},2e3))},[r]);const b=()=>{x(!1)};return w.jsxs(Mf,{children:[w.jsxs(Lf,{ref:j,isActive:r,onMouseMove:e=>{if(!p||!r)return;const t=j.current.getBoundingClientRect(),i=e.clientX-t.left-u.x,o=e.clientY-t.top-u.y;d({x:i,y:o})},onMouseUp:b,onMouseLeave:b,children:[r&&w.jsx(Ef,{productImage:y.image,x:s.x,y:s.y,scale:c,rotation:m,onMouseDown:e=>{if(!r)return;const t=j.current.getBoundingClientRect(),i=e.clientX-t.left,o=e.clientY-t.top;x(!0),g({x:i-s.x,y:o-s.y})},style:{cursor:p?"grabbing":"grab"}}),w.jsxs(Zf,{status:a,children:[w.jsx(Hf,{pulsing:"scanning"===a}),"ready"===a&&"Gotowy do AR","scanning"===a&&"Skanowanie...","detected"===a&&"Powierzchnia wykryta"]}),w.jsxs(If,{children:[w.jsx(Ff,{children:y.name}),w.jsx(_f,{children:y.price}),w.jsx(Rf,{children:y.description})]}),w.jsxs(Uf,{show:!r,children:[w.jsxs(Kf,{children:["🎯 Wskazówki AR:",w.jsx("br",{}),"• Ustaw telefon na płaskiej powierzchni",w.jsx("br",{}),"• Poruszaj telefonem, aby skanować otoczenie",w.jsx("br",{}),"• Dotknij ekranu, aby umieścić produkt"]}),w.jsx(Yf,{onClick:()=>{o(!0)},children:"🚀 Rozpocznij AR"})]})]}),w.jsxs(Wf,{children:[w.jsx(Df,{onClick:()=>{d({x:0,y:0}),l(1),h(0)},title:"Resetuj pozycję",children:"🔄"}),w.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"5px"},children:[w.jsx("span",{style:{fontSize:"10px",color:"#666"},children:"Skala"}),w.jsx(Of,{type:"range",min:"0.5",max:"2",step:"0.1",value:c,onChange:e=>{l(parseFloat(e.target.value))}})]}),w.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"5px"},children:[w.jsx("span",{style:{fontSize:"10px",color:"#666"},children:"Obrót"}),w.jsx(Of,{type:"range",min:"0",max:"360",step:"1",value:m,onChange:e=>{h(parseFloat(e.target.value))}})]}),w.jsx(Df,{onClick:()=>{alert("Zrzut ekranu został zapisany! 📸")},title:"Zrzut ekranu",children:"📸"}),w.jsx(Df,{onClick:()=>{navigator.share?navigator.share({title:`Podgląd AR: ${y.name}`,text:`Sprawdź jak wygląda ${y.name} w AR!`,url:window.location.href}):alert("Link do podglądu AR został skopiowany do schowka! 🔗")},title:"Udostępnij",children:"📤"})]})]})},qf=p.div`
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 12px;
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
`,Gf=p.div`
  text-align: center;
  margin-bottom: 20px;
`,Jf=p.h2`
  color: ${e=>e.theme.text};
  margin: 0 0 8px 0;
  font-size: 24px;
`,Xf=p.p`
  color: ${e=>e.theme.textSecondary};
  margin: 0;
  font-size: 14px;
`,Qf=p.div`
  margin-bottom: 20px;
`,ew=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  margin-top: 10px;
`,tw=p.div`
  background: ${e=>e.selected?"linear-gradient(135deg, #667eea 0%, #764ba2 100%)":e.theme.background};
  color: ${e=>e.selected?"white":e.theme.text};
  border: 2px solid ${e=>e.selected?"#667eea":e.theme.border};
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
  }
`,rw=p.div`
  font-size: 24px;
  margin-bottom: 8px;
`,iw=p.div`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
`,ow=p.div`
  font-size: 12px;
  opacity: 0.8;
`,aw=p.div`
  margin-bottom: 20px;
`,nw=p.div`
  margin-bottom: 15px;
`,sw=p.label`
  display: block;
  margin-bottom: 5px;
  color: ${e=>e.theme.text};
  font-weight: 500;
  font-size: 14px;
`,dw=p.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${e=>e.theme.border};
  border-radius: 8px;
  background: ${e=>e.theme.background};
  color: ${e=>e.theme.text};
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
`,cw=p.div`
  background: ${e=>e.theme.background};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  text-align: center;
`,lw=p.div`
  font-size: 12px;
  color: ${e=>e.theme.textSecondary};
  margin-bottom: 5px;
`,mw=p.div`
  font-size: 24px;
  font-weight: bold;
  color: ${e=>e.theme.text};
`,hw=p.div`
  font-size: 14px;
  color: ${e=>e.theme.textSecondary};
  margin-top: 5px;
`,pw=p.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
`,xw=p.h4`
  margin: 0 0 10px 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`,uw=p.div`
  font-size: 12px;
  line-height: 1.4;
`,gw=p.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 8px;
  margin-top: 8px;
  font-family: monospace;
  font-size: 11px;
  word-break: break-all;
`,jw=p.button`
  width: 100%;
  padding: 15px;
  background: ${e=>e.disabled?"#ccc":"linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${e=>e.disabled?"not-allowed":"pointer"};
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }
`,yw=p.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
  padding: 10px;
  border-radius: 8px;
  background: ${e=>{switch(e.status){case"pending":return"#fff3cd";case"confirmed":return"#d4edda";case"failed":return"#f8d7da";default:return"transparent"}}};
  color: ${e=>{switch(e.status){case"pending":return"#856404";case"confirmed":return"#155724";case"failed":return"#721c24";default:return e.theme.text}}};
  font-size: 14px;
`,bw=p.div`
  width: 100%;
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 10px;
`,fw=p.div`
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: ${e=>e.progress}%;
  transition: width 0.3s ease;
`,ww=p.div`
  margin-top: 20px;
`,kw=p.h4`
  color: ${e=>e.theme.text};
  margin: 0 0 10px 0;
  font-size: 16px;
`,vw=p.div`
  background: ${e=>e.theme.background};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`,zw=p.div`
  flex: 1;
`,$w=p.div`
  font-family: monospace;
  font-size: 12px;
  color: ${e=>e.theme.textSecondary};
  margin-bottom: 4px;
`,Sw=p.div`
  font-weight: 600;
  color: ${e=>e.theme.text};
`,Cw=p.div`
  font-size: 12px;
  color: ${e=>"confirmed"===e.status?"#28a745":"pending"===e.status?"#ffc107":"#dc3545"};
`,Nw=({theme:e,amount:t=100,onPaymentComplete:r})=>{const[o,a]=i.useState("ETH"),[n,s]=i.useState(""),[d,c]=i.useState("idle"),[l,m]=i.useState(0),[h,p]=i.useState([]),x=[{symbol:"ETH",name:"Ethereum",price:2500,icon:"Ξ"},{symbol:"BTC",name:"Bitcoin",price:45e3,icon:"₿"},{symbol:"USDT",name:"Tether",price:1,icon:"₮"},{symbol:"USDC",name:"USD Coin",price:1,icon:"💲"},{symbol:"BNB",name:"Binance Coin",price:300,icon:"🟡"},{symbol:"ADA",name:"Cardano",price:.5,icon:"₳"}],u=t/x.find(e=>e.symbol===o).price,g="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6";return w.jsxs(qf,{theme:e,children:[w.jsxs(Gf,{children:[w.jsx(Jf,{children:"💎 Płatność Blockchain"}),w.jsx(Xf,{children:"Bezpieczne płatności kryptowalutami z smart kontraktami"})]}),w.jsxs(Qf,{children:[w.jsx(sw,{theme:e,children:"Wybierz kryptowalutę:"}),w.jsx(ew,{children:x.map(t=>w.jsxs(tw,{selected:o===t.symbol,theme:e,onClick:()=>a(t.symbol),children:[w.jsx(rw,{children:t.icon}),w.jsx(iw,{children:t.name}),w.jsxs(ow,{children:["$",t.price.toLocaleString()]})]},t.symbol))})]}),w.jsxs(cw,{theme:e,children:[w.jsx(lw,{children:"Kwota do zapłaty:"}),w.jsxs(mw,{theme:e,children:[t," PLN"]}),w.jsxs(hw,{theme:e,children:["≈ ",u.toFixed(6)," ",o]})]}),w.jsxs(pw,{children:[w.jsx(xw,{children:"🔗 Smart Kontrakt"}),w.jsxs(uw,{children:["Ten produkt jest zabezpieczony inteligentnym kontraktem Ethereum, który automatycznie:",w.jsx("br",{}),"• Weryfikuje płatność",w.jsx("br",{}),"• Zwalnia produkt po potwierdzeniu",w.jsx("br",{}),"• Zapewnia zwrot w przypadku problemów"]}),w.jsxs(gw,{children:[g,w.jsx("button",{onClick:()=>{navigator.clipboard.writeText(g),alert("Adres smart kontraktu skopiowany!")},style:{background:"none",border:"none",color:"white",cursor:"pointer",marginLeft:"10px"},children:"📋"})]})]}),w.jsxs(aw,{children:[w.jsxs(nw,{children:[w.jsx(sw,{theme:e,children:"Adres portfela:"}),w.jsx(dw,{type:"text",value:n,onChange:e=>s(e.target.value),placeholder:"0x...",theme:e})]}),!n&&w.jsx(jw,{onClick:()=>{const e=`0x${Math.random().toString(36).substr(2,40)}`;s(e)},children:"🔗 Połącz Portfel"}),n&&w.jsx(jw,{onClick:async()=>{if(!n.trim())return void alert("Proszę wprowadzić adres portfela");c("pending"),m(0);const e=[{progress:20,message:"Inicjalizacja transakcji..."},{progress:40,message:"Podpisywanie smart kontraktu..."},{progress:60,message:"Wysyłanie do sieci blockchain..."},{progress:80,message:"Oczekiwanie na potwierdzenie..."},{progress:100,message:"Transakcja potwierdzona!"}];for(let r=0;r<e.length;r++)await new Promise(e=>setTimeout(e,1e3)),m(e[r].progress);await new Promise(e=>setTimeout(e,2e3)),c("confirmed");const t={id:Date.now(),hash:`0x${Math.random().toString(36).substr(2,64)}`,amount:u.toFixed(6),crypto:o,status:"confirmed",timestamp:(new Date).toISOString()};p(e=>[t,...e]),r&&r(t)},disabled:"pending"===d,children:"pending"===d?"⏳ Przetwarzanie...":"💳 Zapłać Kryptowalutą"})]}),"idle"!==d&&w.jsxs(yw,{status:d,theme:e,children:["pending"===d&&"⏳ Przetwarzanie transakcji...","confirmed"===d&&"✅ Transakcja potwierdzona!","failed"===d&&"❌ Błąd transakcji"]}),"pending"===d&&w.jsx(bw,{children:w.jsx(fw,{progress:l})}),h.length>0&&w.jsxs(ww,{children:[w.jsx(kw,{theme:e,children:"Historia transakcji:"}),h.map(t=>w.jsxs(vw,{theme:e,children:[w.jsxs(zw,{children:[w.jsxs($w,{theme:e,children:[t.hash.substring(0,10),"...",t.hash.substring(t.hash.length-8)]}),w.jsxs(Sw,{theme:e,children:[t.amount," ",t.crypto]})]}),w.jsx(Cw,{status:t.status,children:"confirmed"===t.status?"✅":"pending"===t.status?"⏳":"❌"})]},t.id))]})]})},Pw=p.div`
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 12px;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`,Bw=p.div`
  text-align: center;
  margin-bottom: 20px;
`,Aw=p.h2`
  color: ${e=>e.theme.text};
  margin: 0 0 8px 0;
  font-size: 24px;
`,Tw=p.p`
  color: ${e=>e.theme.textSecondary};
  margin: 0;
  font-size: 14px;
`,Mw=p.div`
  display: flex;
  border-bottom: 1px solid ${e=>e.theme.border};
  margin-bottom: 20px;
`,Lw=p.button`
  background: none;
  border: none;
  padding: 12px 20px;
  color: ${e=>e.active?"#667eea":e.theme.textSecondary};
  font-weight: ${e=>e.active?"600":"400"};
  cursor: pointer;
  border-bottom: 2px solid ${e=>e.active?"#667eea":"transparent"};
  transition: all 0.3s ease;
  
  &:hover {
    color: #667eea;
  }
`,Ew=p.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  color: white;
`,Ww=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`,Dw=p.h3`
  margin: 0;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
`,Ow=p.div`
  background: #ff4757;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`,Iw=p.div`
  display: flex;
  gap: 20px;
  font-size: 14px;
`,Fw=p.div`
  display: flex;
  align-items: center;
  gap: 5px;
`,_w=p.div`
  width: 100%;
  height: 300px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  position: relative;
`,Rw=p.button`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`,Zw=p.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  height: 200px;
  overflow-y: auto;
  margin-bottom: 15px;
`,Hw=p.div`
  margin-bottom: 8px;
  font-size: 14px;
`,Uw=p.input`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 14px;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.3);
  }
`,Kw=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`,Yw=p.div`
  background: ${e=>e.theme.background};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`,Vw=p.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`,qw=p.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`,Gw=p.div`
  flex: 1;
`,Jw=p.div`
  font-weight: 600;
  color: ${e=>e.theme.text};
  font-size: 14px;
`,Xw=p.div`
  font-size: 12px;
  color: ${e=>e.theme.textSecondary};
`,Qw=p.div`
  color: ${e=>e.theme.text};
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 10px;
`,ek=p.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 10px;
`,tk=p.div`
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: ${e=>e.theme.textSecondary};
`,rk=p.button`
  background: none;
  border: none;
  color: ${e=>e.theme.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.2s ease;
  
  &:hover {
    color: #667eea;
  }
`,ik=p.div`
  background: ${e=>e.theme.background};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
`,ok=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`,ak=p.h4`
  margin: 0;
  color: ${e=>e.theme.text};
  font-size: 16px;
`,nk=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
`,sk=p.div`
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 6px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
  }
`,dk=p.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 8px;
`,ck=p.div`
  font-size: 12px;
  color: ${e=>e.theme.text};
  margin-bottom: 4px;
`,lk=p.div`
  font-size: 12px;
  color: #667eea;
  font-weight: 600;
`,mk=p.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
`,hk=p.button`
  background: ${e=>e.color};
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
`,pk=({theme:e})=>{const[t,r]=i.useState("live"),[o,a]=i.useState(!0),[n,s]=i.useState(1247),[d,c]=i.useState(892),[l,m]=i.useState([]),[h,p]=i.useState(""),[x,u]=i.useState(!1),g=[{id:1,user:"Anna_K",message:"Świetny produkt! 🎉",time:"2 min temu"},{id:2,user:"Marek_T",message:"Jakie są kolory?",time:"1 min temu"},{id:3,user:"Kasia_L",message:"Kupuję! 💳",time:"30 sek temu"},{id:4,user:"Piotr_W",message:"Jaka jest dostawa?",time:"15 sek temu"}],j=[{id:1,user:"TechStore",avatar:"https://picsum.photos/40/40?random=1",content:"Nowe smartfony już dostępne! 📱 Sprawdź naszą ofertę #tech #smartphone",image:"https://picsum.photos/300/200?random=2",likes:45,comments:12,shares:8,time:"2 godziny temu"},{id:2,user:"FashionHub",avatar:"https://picsum.photos/40/40?random=3",content:"Kolekcja wiosenna 2024! 🌸 #fashion #spring #style",image:"https://picsum.photos/300/200?random=4",likes:89,comments:23,shares:15,time:"4 godziny temu"}],y=[{id:1,name:"iPhone 15 Pro",price:"4999 zł",image:"https://picsum.photos/60/60?random=5"},{id:2,name:"Samsung Galaxy S24",price:"3999 zł",image:"https://picsum.photos/60/60?random=6"},{id:3,name:"MacBook Air M2",price:"5999 zł",image:"https://picsum.photos/60/60?random=7"},{id:4,name:"AirPods Pro",price:"999 zł",image:"https://picsum.photos/60/60?random=8"}];i.useEffect(()=>{m(g);const e=setInterval(()=>{const e={id:Date.now(),user:`User_${Math.floor(1e3*Math.random())}`,message:["Świetnie! 👍","Kupuję! 💳","Jakie kolory?","Dostawa? 🚚"][Math.floor(4*Math.random())],time:"teraz"};m(t=>[...t,e])},5e3);return()=>clearInterval(e)},[]),i.useEffect(()=>{const e=setInterval(()=>{s(e=>e+Math.floor(10*Math.random())-5),c(e=>e+Math.floor(5*Math.random()))},3e3);return()=>clearInterval(e)},[]);const b=e=>{if(e.preventDefault(),h.trim()){const e={id:Date.now(),user:"Ty",message:h,time:"teraz"};m(t=>[...t,e]),p("")}},f=e=>{const t=window.location.href;switch(e){case"facebook":window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(t)}`);break;case"twitter":window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("Sprawdź te niesamowite produkty! 🛍️")}&url=${encodeURIComponent(t)}`);break;case"instagram":alert("Udostępnij na Instagram Stories! 📸");break;case"tiktok":alert("Udostępnij na TikTok! 🎵")}};return w.jsxs(Pw,{theme:e,children:[w.jsxs(Bw,{children:[w.jsx(Aw,{children:"📱 Social Commerce"}),w.jsx(Tw,{children:"Integracja z social media, live streaming i funkcje społecznościowe"})]}),w.jsxs(Mw,{theme:e,children:[w.jsx(Lw,{active:"live"===t,onClick:()=>r("live"),theme:e,children:"🎥 Live Shopping"}),w.jsx(Lw,{active:"social"===t,onClick:()=>r("social"),theme:e,children:"📱 Social Feed"}),w.jsx(Lw,{active:"products"===t,onClick:()=>r("products"),theme:e,children:"🛍️ Produkty"})]}),"live"===t&&w.jsxs(Ew,{children:[w.jsxs(Ww,{children:[w.jsxs(Dw,{children:["🎥 Live Shopping: Nowe Smartfony",o&&w.jsx(Ow,{children:"LIVE"})]}),w.jsxs(Iw,{children:[w.jsxs(Fw,{children:["👥 ",n.toLocaleString()," widzów"]}),w.jsxs(Fw,{children:["❤️ ",d.toLocaleString()," polubień"]})]})]}),w.jsx(_w,{children:x?w.jsx("div",{style:{color:"white",textAlign:"center"},children:"🎥 Transmisja na żywo"}):w.jsx(Rw,{onClick:()=>u(!0),children:"▶️"})}),w.jsx(Zw,{children:l.map(e=>w.jsxs(Hw,{children:[w.jsxs("strong",{children:[e.user,":"]})," ",e.message,w.jsx("span",{style:{opacity:.7,marginLeft:"10px"},children:e.time})]},e.id))}),w.jsx("form",{onSubmit:b,children:w.jsx(Uw,{value:h,onChange:e=>p(e.target.value),placeholder:"Napisz wiadomość..."})})]}),"social"===t&&w.jsx(Kw,{children:j.map(t=>w.jsxs(Yw,{theme:e,children:[w.jsxs(Vw,{children:[w.jsx(qw,{src:t.avatar,alt:t.user}),w.jsxs(Gw,{children:[w.jsx(Jw,{theme:e,children:t.user}),w.jsx(Xw,{theme:e,children:t.time})]})]}),w.jsx(Qw,{theme:e,children:t.content}),t.image&&w.jsx(ek,{src:t.image,alt:"Post"}),w.jsxs(tk,{children:[w.jsxs(rk,{theme:e,children:["❤️ ",t.likes]}),w.jsxs(rk,{theme:e,children:["💬 ",t.comments]}),w.jsxs(rk,{theme:e,children:["📤 ",t.shares]})]})]},t.id))}),"products"===t&&w.jsxs(ik,{theme:e,children:[w.jsx(ok,{children:w.jsx(ak,{theme:e,children:"🔥 Gorące produkty"})}),w.jsx(nk,{children:y.map(t=>w.jsxs(sk,{theme:e,children:[w.jsx(dk,{src:t.image,alt:t.name}),w.jsx(ck,{theme:e,children:t.name}),w.jsx(lk,{theme:e,children:t.price})]},t.id))})]}),w.jsxs(mk,{children:[w.jsx(hk,{color:"#1877f2",onClick:()=>f("facebook"),children:"📘 Facebook"}),w.jsx(hk,{color:"#1da1f2",onClick:()=>f("twitter"),children:"🐦 Twitter"}),w.jsx(hk,{color:"#e4405f",onClick:()=>f("instagram"),children:"📸 Instagram"}),w.jsx(hk,{color:"#000000",onClick:()=>f("tiktok"),children:"🎵 TikTok"})]})]})},xk=p.div`
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 12px;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`,uk=p.div`
  text-align: center;
  margin-bottom: 20px;
`,gk=p.h2`
  color: ${e=>e.theme.text};
  margin: 0 0 8px 0;
  font-size: 24px;
`,jk=p.p`
  color: ${e=>e.theme.textSecondary};
  margin: 0;
  font-size: 14px;
`,yk=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
`,bk=p.div`
  background: ${e=>e.theme.background};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 8px;
  padding: 15px;
  text-align: center;
`,fk=p.div`
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 5px;
`,wk=p.div`
  font-size: 12px;
  color: ${e=>e.theme.textSecondary};
`,kk=p.div`
  margin-bottom: 25px;
`,vk=p.h3`
  color: ${e=>e.theme.text};
  margin: 0 0 15px 0;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
`,zk=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
`,$k=p.div`
  background: ${e=>e.theme.background};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    border-color: #667eea;
  }
`,Sk=p.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 10px;
`,Ck=p.div`
  font-weight: 600;
  color: ${e=>e.theme.text};
  margin-bottom: 5px;
  font-size: 14px;
`,Nk=p.div`
  color: #667eea;
  font-weight: 600;
  margin-bottom: 5px;
`,Pk=p.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: ${e=>e.theme.textSecondary};
  margin-bottom: 8px;
`,Bk=p.div`
  background: ${e=>{const t=e.score;return t>=80?"#10b981":t>=60?"#f59e0b":"#ef4444"}};
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
`,Ak=p.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
`,Tk=p.h4`
  margin: 0 0 10px 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`,Mk=p.ul`
  margin: 0;
  padding-left: 20px;
  font-size: 14px;
  line-height: 1.5;
`,Lk=p.li`
  margin-bottom: 5px;
`,Ek=p.div`
  margin-bottom: 15px;
`,Wk=p.label`
  display: block;
  margin-bottom: 5px;
  color: ${e=>e.theme.text};
  font-size: 14px;
  font-weight: 500;
`,Dk=p.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #ddd;
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
    border: none;
  }
`,Ok=p.div`
  text-align: center;
  font-size: 12px;
  color: ${e=>e.theme.textSecondary};
  margin-top: 5px;
`,Ik=p.button`
  background: ${e=>e.disabled?"#ccc":"linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: ${e=>e.disabled?"not-allowed":"pointer"};
  transition: all 0.3s ease;
  margin-right: 10px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }
`,Fk=p.div`
  background: ${e=>e.theme.background};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
`,_k=p.div`
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 10px;
`,Rk=p.div`
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: ${e=>e.progress}%;
  transition: width 0.3s ease;
`,Zk=p.div`
  font-size: 12px;
  color: ${e=>e.theme.textSecondary};
  margin-top: 5px;
`,Hk=({theme:e})=>{const[t,r]=i.useState({price:50,quality:70,brand:60,category:40}),[o,a]=i.useState(75),[n,s]=i.useState([]),[d,c]=i.useState(!1),l=[{id:1,name:"iPhone 15 Pro",price:"4999 zł",rating:4.8,confidence:95,image:"https://picsum.photos/200/120?random=1",reason:"Podobne do produktów, które Ci się podobały"},{id:2,name:"Samsung Galaxy S24",price:"3999 zł",rating:4.6,confidence:87,image:"https://picsum.photos/200/120?random=2",reason:"Dopasowane do Twoich preferencji cenowych"},{id:3,name:"MacBook Air M2",price:"5999 zł",rating:4.9,confidence:92,image:"https://picsum.photos/200/120?random=3",reason:"Wysoka ocena w kategorii, którą przeglądasz"},{id:4,name:"AirPods Pro",price:"999 zł",rating:4.7,confidence:78,image:"https://picsum.photos/200/120?random=4",reason:"Często kupowane z produktami w Twoim koszyku"}];i.useEffect(()=>{s(l)},[]);const m=(e,t)=>{r(r=>({...r,[e]:parseInt(t)}))};return w.jsxs(xk,{theme:e,children:[w.jsxs(uk,{children:[w.jsx(gk,{theme:e,children:"🧠 AI System Rekomendacji"}),w.jsx(jk,{theme:e,children:"Inteligentne rekomendacje produktów oparte na uczeniu maszynowym i Twoich preferencjach"})]}),w.jsx(yk,{children:[{label:"Dokładność AI",value:"94.2%"},{label:"Produkty przeanalizowane",value:"2.3M"},{label:"Użytkowników",value:"45.2K"},{label:"Rekomendacji dziennie",value:"12.8K"}].map((t,r)=>w.jsxs(bk,{theme:e,children:[w.jsx(fk,{children:t.value}),w.jsx(wk,{theme:e,children:t.label})]},r))}),w.jsxs(Ak,{children:[w.jsx(Tk,{children:"🔍 AI Analiza Twoich Preferencji"}),w.jsxs(Mk,{children:[w.jsxs(Lk,{children:["Preferujesz produkty premium (ocena jakości: ",t.quality,"%)"]}),w.jsxs(Lk,{children:["Jesteś wrażliwy na cenę (priorytet: ",t.price,"%)"]}),w.jsxs(Lk,{children:["Lubisz sprawdzone marki (ważność: ",t.brand,"%)"]}),w.jsxs(Lk,{children:["Eksplorujesz różne kategorie (otwartość: ",t.category,"%)"]})]})]}),w.jsxs(Fk,{theme:e,children:[w.jsx(vk,{theme:e,children:"📈 Progres Uczenia AI"}),w.jsx(_k,{children:w.jsx(Rk,{progress:o})}),w.jsxs(Zk,{theme:e,children:["Model AI uczy się na podstawie Twoich interakcji: ",o,"% kompletne"]})]}),w.jsxs(kk,{children:[w.jsx(vk,{theme:e,children:"🎯 Spersonalizowane Rekomendacje"}),w.jsx(zk,{children:n.map(t=>{return w.jsxs($k,{theme:e,children:[w.jsx(Sk,{src:t.image,alt:t.name}),w.jsx(Ck,{theme:e,children:t.name}),w.jsx(Nk,{theme:e,children:t.price}),w.jsxs(Pk,{theme:e,children:["⭐ ",t.rating," (",t.confidence,"% pewności)"]}),w.jsxs(Bk,{score:t.confidence,children:[(r=t.confidence,r>=80?"Wysokie":r>=60?"Średnie":"Niskie")," dopasowanie"]}),w.jsx("div",{style:{fontSize:"11px",color:e.textSecondary,marginTop:"8px"},children:t.reason})]},t.id);var r})})]}),w.jsxs(kk,{children:[w.jsx(vk,{theme:e,children:"⚙️ Dostosuj Preferencje"}),w.jsxs(Ek,{children:[w.jsx(Wk,{theme:e,children:"Wrażliwość na cenę"}),w.jsx(Dk,{type:"range",min:"0",max:"100",value:t.price,onChange:e=>m("price",e.target.value)}),w.jsxs(Ok,{theme:e,children:[t.price,"%"]})]}),w.jsxs(Ek,{children:[w.jsx(Wk,{theme:e,children:"Priorytet jakości"}),w.jsx(Dk,{type:"range",min:"0",max:"100",value:t.quality,onChange:e=>m("quality",e.target.value)}),w.jsxs(Ok,{theme:e,children:[t.quality,"%"]})]}),w.jsxs(Ek,{children:[w.jsx(Wk,{theme:e,children:"Ważność marki"}),w.jsx(Dk,{type:"range",min:"0",max:"100",value:t.brand,onChange:e=>m("brand",e.target.value)}),w.jsxs(Ok,{theme:e,children:[t.brand,"%"]})]}),w.jsxs(Ek,{children:[w.jsx(Wk,{theme:e,children:"Otwartość na nowe kategorie"}),w.jsx(Dk,{type:"range",min:"0",max:"100",value:t.category,onChange:e=>m("category",e.target.value)}),w.jsxs(Ok,{theme:e,children:[t.category,"%"]})]})]}),w.jsxs("div",{style:{textAlign:"center",marginTop:"20px"},children:[w.jsx(Ik,{onClick:async()=>{c(!0);for(let e=0;e<=100;e+=10)await new Promise(e=>setTimeout(e,200)),a(e);c(!1),setTimeout(()=>{const e=l.map(e=>({...e,confidence:Math.min(100,e.confidence+Math.floor(10*Math.random()))}));s(e)},1e3)},disabled:d,children:d?"🧠 Uczenie w toku...":"🧠 Trenuj AI"}),w.jsx(Ik,{onClick:()=>{const e=[...l].sort(()=>.5-Math.random());s(e.slice(0,4))},children:"🔄 Odśwież rekomendacje"})]})]})},Uk=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`,Kk=p.div`
  text-align: center;
  margin-bottom: 40px;
`,Yk=p.h1`
  color: ${e=>e.theme.text};
  font-size: 36px;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`,Vk=p.p`
  color: ${e=>e.theme.textSecondary};
  font-size: 18px;
  margin: 0;
`,qk=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
`,Gk=p.div`
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 12px;
  padding: 25px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`,Jk=p.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
`,Xk=p.div`
  font-size: 32px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`,Qk=p.h3`
  color: ${e=>e.theme.text};
  margin: 0;
  font-size: 20px;
`,ev=p.p`
  color: ${e=>e.theme.textSecondary};
  margin: 0 0 20px 0;
  line-height: 1.6;
`,tv=p.div`
  min-height: 200px;
`,rv=p.div`
  display: flex;
  border-bottom: 1px solid ${e=>e.theme.border};
  margin-bottom: 20px;
  overflow-x: auto;
`,iv=p.button`
  background: none;
  border: none;
  padding: 12px 20px;
  color: ${e=>e.active?"#667eea":e.theme.textSecondary};
  font-weight: ${e=>e.active?"600":"400"};
  cursor: pointer;
  border-bottom: 2px solid ${e=>e.active?"#667eea":"transparent"};
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    color: #667eea;
  }
`,ov=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`,av=p.div`
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 12px;
  padding: 20px;
  text-align: center;
`,nv=p.div`
  font-size: 32px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8px;
`,sv=p.div`
  color: ${e=>e.theme.textSecondary};
  font-size: 14px;
`,dv=p.div`
  background: ${e=>e.theme.surface};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 40px;
`,cv=p.h3`
  color: ${e=>e.theme.text};
  margin: 0 0 20px 0;
  text-align: center;
`,lv=p.table`
  width: 100%;
  border-collapse: collapse;
`,mv=p.th`
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid ${e=>e.theme.border};
  color: ${e=>e.theme.text};
  font-weight: 600;
`,hv=p.td`
  padding: 12px;
  border-bottom: 1px solid ${e=>e.theme.border};
  color: ${e=>e.theme.text};
`,pv=p.span`
  font-size: 18px;
`,xv=({theme:e})=>{const[t,r]=i.useState("ai-recommendations"),o=[{id:"ai-assistant",title:"AI Asystent Produktowy",icon:"🤖",description:"Inteligentny chatbot pomagający w wyborze produktów z rekomendacjami i sugestiami.",component:w.jsx(wf,{theme:e})},{id:"ai-recommendations",title:"AI System Rekomendacji",icon:"🧠",description:"Inteligentne rekomendacje produktów oparte na uczeniu maszynowym i preferencjach użytkownika.",component:w.jsx(Hk,{theme:e})},{id:"voice-search",title:"Wyszukiwanie Głosowe",icon:"🎤",description:"Wyszukuj produkty używając głosu z rozpoznawaniem mowy i syntezą głosu.",component:w.jsx(Tf,{theme:e,onSearch:e=>{}})},{id:"ar-preview",title:"Podgląd AR",icon:"👁️",description:"Augmented Reality - umieść produkty w swoim otoczeniu przed zakupem.",component:w.jsx(Vf,{theme:e})},{id:"blockchain-payment",title:"Płatności Blockchain",icon:"💎",description:"Bezpieczne płatności kryptowalutami z smart kontraktami Ethereum.",component:w.jsx(Nw,{theme:e,amount:299})},{id:"social-commerce",title:"Social Commerce",icon:"📱",description:"Integracja z social media, live streaming i funkcje społecznościowe.",component:w.jsx(pk,{theme:e})}],a=o.find(e=>e.id===t);return w.jsxs(Uk,{children:[w.jsxs(Kk,{children:[w.jsx(Yk,{theme:e,children:"🚀 Zaawansowane Funkcje"}),w.jsx(Vk,{theme:e,children:"Portal e-commerce z funkcjami przyszłości - AI, AR, Blockchain i więcej"})]}),w.jsx(ov,{children:[{number:"6+",label:"Zaawansowane funkcje"},{number:"99.9%",label:"Dostępność"},{number:"<2s",label:"Czas ładowania"},{number:"50k+",label:"Użytkowników"}].map((t,r)=>w.jsxs(av,{theme:e,children:[w.jsx(nv,{children:t.number}),w.jsx(sv,{theme:e,children:t.label})]},r))}),w.jsx(rv,{theme:e,children:o.map(i=>w.jsxs(iv,{active:t===i.id,onClick:()=>r(i.id),theme:e,children:[i.icon," ",i.title]},i.id))}),a&&w.jsxs(Gk,{theme:e,children:[w.jsxs(Jk,{children:[w.jsx(Xk,{children:a.icon}),w.jsxs("div",{children:[w.jsx(Qk,{theme:e,children:a.title}),w.jsx(ev,{theme:e,children:a.description})]})]}),w.jsx(tv,{children:a.component})]}),w.jsxs(dv,{theme:e,children:[w.jsx(cv,{theme:e,children:"Porównanie z innymi platformami"}),w.jsxs(lv,{children:[w.jsx("thead",{children:w.jsxs("tr",{children:[w.jsx(mv,{theme:e,children:"Funkcja"}),w.jsx(mv,{theme:e,children:"Nasz Portal"}),w.jsx(mv,{theme:e,children:"Amazon"}),w.jsx(mv,{theme:e,children:"Allegro"}),w.jsx(mv,{theme:e,children:"eBay"})]})}),w.jsx("tbody",{children:[{feature:"AI Chat Assistant",ourPortal:"✅",amazon:"❌",allegro:"❌",ebay:"❌"},{feature:"AI Recommendations",ourPortal:"✅",amazon:"✅",allegro:"❌",ebay:"❌"},{feature:"Voice Search",ourPortal:"✅",amazon:"✅",allegro:"❌",ebay:"❌"},{feature:"AR Preview",ourPortal:"✅",amazon:"✅",allegro:"❌",ebay:"❌"},{feature:"Blockchain Payments",ourPortal:"✅",amazon:"❌",allegro:"❌",ebay:"❌"},{feature:"Social Commerce",ourPortal:"✅",amazon:"❌",allegro:"✅",ebay:"❌"},{feature:"Live Shopping",ourPortal:"✅",amazon:"❌",allegro:"✅",ebay:"❌"}].map((t,r)=>w.jsxs("tr",{children:[w.jsx(hv,{theme:e,children:t.feature}),w.jsx(hv,{theme:e,children:w.jsx(pv,{children:t.ourPortal})}),w.jsx(hv,{theme:e,children:w.jsx(pv,{children:t.amazon})}),w.jsx(hv,{theme:e,children:w.jsx(pv,{children:t.allegro})}),w.jsx(hv,{theme:e,children:w.jsx(pv,{children:t.ebay})})]},r))})]})]}),w.jsx(qk,{children:o.map(t=>w.jsxs(Gk,{theme:e,children:[w.jsxs(Jk,{children:[w.jsx(Xk,{children:t.icon}),w.jsx(Qk,{theme:e,children:t.title})]}),w.jsx(ev,{theme:e,children:t.description})]},t.id))})]})};function uv(e){return u({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"rect",attr:{x:"2",y:"7",width:"20",height:"14",rx:"2",ry:"2"},child:[]},{tag:"path",attr:{d:"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"},child:[]}]})(e)}function gv(e){return u({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"circle",attr:{cx:"12",cy:"12",r:"10"},child:[]},{tag:"line",attr:{x1:"2",y1:"12",x2:"22",y2:"12"},child:[]},{tag:"path",attr:{d:"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"},child:[]}]})(e)}function jv(e){return u({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"},child:[]},{tag:"polyline",attr:{points:"9 22 9 12 15 12 15 22"},child:[]}]})(e)}function yv(e){return u({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"circle",attr:{cx:"12",cy:"12",r:"10"},child:[]},{tag:"line",attr:{x1:"12",y1:"16",x2:"12",y2:"12"},child:[]},{tag:"line",attr:{x1:"12",y1:"8",x2:"12.01",y2:"8"},child:[]}]})(e)}function bv(e){return u({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"},child:[]},{tag:"circle",attr:{cx:"12",cy:"10",r:"3"},child:[]}]})(e)}function fv(e){return u({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"circle",attr:{cx:"11",cy:"11",r:"8"},child:[]},{tag:"line",attr:{x1:"21",y1:"21",x2:"16.65",y2:"16.65"},child:[]}]})(e)}function wv(e){return u({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"circle",attr:{cx:"12",cy:"12",r:"3"},child:[]},{tag:"path",attr:{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"},child:[]}]})(e)}function kv(e){return u({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"line",attr:{x1:"18",y1:"6",x2:"6",y2:"18"},child:[]},{tag:"line",attr:{x1:"6",y1:"6",x2:"18",y2:"18"},child:[]}]})(e)}const vv=p.div`
  background: ${e=>e.theme.cardBackground};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`,zv=p.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    margin: 0;
    color: ${e=>e.theme.primary};
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  .icon {
    margin-right: 0.75rem;
    font-size: 1.5rem;
    color: ${e=>e.theme.primary};
  }
`,$v=p.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`,Sv=p.div`
  display: flex;
  flex-direction: column;
  
  label {
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: ${e=>e.theme.text};
    font-size: 0.9rem;
  }
  
  input, select {
    padding: 0.75rem;
    border: 2px solid ${e=>e.theme.border};
    border-radius: 8px;
    font-size: 1rem;
    background: ${e=>e.theme.inputBackground};
    color: ${e=>e.theme.text};
    transition: border-color 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: ${e=>e.theme.primary};
    }
    
    &::placeholder {
      color: ${e=>e.theme.textSecondary};
    }
  }
`,Cv=p.button`
  background: ${e=>e.theme.gradient};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${e=>e.theme.gradientHover};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`,Nv=p.div`
  margin-top: 2rem;
`,Pv=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h3 {
    margin: 0;
    color: ${e=>e.theme.text};
  }
  
  .count {
    background: ${e=>e.theme.primary};
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
  }
`,Bv=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`,Av=p.div`
  background: ${e=>e.theme.cardBackground};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`,Tv=p.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
  
  .teryt-tag {
    background: ${e=>e.theme.secondary}20;
    color: ${e=>e.theme.secondary};
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
  }
`,Mv=p.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  
  .spinner {
    border: 3px solid ${e=>e.theme.border};
    border-top: 3px solid ${e=>e.theme.primary};
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`,Lv=p.div`
  background: #fee;
  color: #c53030;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #fed7d7;
  margin-top: 1rem;
`,Ev=()=>{const[e,t]=i.useState({tercCode:"",simcCode:"",ulicCode:"",fullCode:"",voivodeshipCode:"",countyCode:"",municipalityCode:"",searchType:"all"}),[r,o]=i.useState({shops:[],companies:[],users:[]}),[a,n]=i.useState(!1),[s,d]=i.useState(""),[c,l]=i.useState(0),m=e=>{const{name:r,value:i}=e.target;t(e=>({...e,[r]:i}))},h=async t=>{t.preventDefault(),n(!0),d("");try{if(!(e.tercCode||e.simcCode||e.ulicCode||e.fullCode||e.voivodeshipCode||e.countyCode||e.municipalityCode))return d("Podaj przynajmniej jeden kod TERYT do wyszukiwania"),void n(!1);const t=localStorage.getItem("token"),i={"Content-Type":"application/json"};if(t&&(i.Authorization=`Bearer ${t}`),"all"===e.searchType||"shops"===e.searchType){const t=await fetch(`/api/shops/search-by-teryt?${new URLSearchParams(e)}`,{headers:i});if(t.ok){const e=await t.json();o(t=>({...t,shops:e.shops||[]}))}}if("all"===e.searchType||"companies"===e.searchType){const t=await fetch(`/api/company-profiles/search-by-teryt?${new URLSearchParams(e)}`,{headers:i});if(t.ok){const e=await t.json();o(t=>({...t,companies:e.companies||[]}))}}if("all"===e.searchType||"users"===e.searchType){const t=await fetch(`/api/users/search-by-teryt?${new URLSearchParams(e)}`,{headers:i});if(t.ok){const e=await t.json();o(t=>({...t,users:e.users||[]}))}}const a=r.shops.length+r.companies.length+r.users.length;l(a)}catch(i){d("Wystąpił błąd podczas wyszukiwania. Spróbuj ponownie.")}finally{n(!1)}},p=(e,t)=>w.jsxs(Av,{children:[w.jsxs("div",{style:{display:"flex",alignItems:"center",marginBottom:"0.5rem"},children:[w.jsx("span",{style:{marginRight:"0.5rem",color:"#666"},children:(()=>{switch(t){case"shop":return w.jsx(uv,{});case"company":return w.jsx(gv,{});case"user":return w.jsx(jv,{});default:return w.jsx(bv,{})}})()}),w.jsxs("h4",{style:{margin:0,color:"#333"},children:["shop"===t&&e.name,"company"===t&&e.name,"user"===t&&`${e.firstName} ${e.lastName}`]})]}),w.jsxs("p",{style:{margin:"0.5rem 0",color:"#666",fontSize:"0.9rem"},children:["shop"===t&&e.description,"company"===t&&e.shortDescription,"user"===t&&e.email]}),e.address&&w.jsxs("p",{style:{margin:"0.5rem 0",color:"#666",fontSize:"0.9rem"},children:["📍 ",e.address.city,", ",e.address.street]}),e.teryt?w.jsxs(Tv,{children:[e.teryt.tercCode&&w.jsxs("span",{className:"teryt-tag",children:["TERC: ",e.teryt.tercCode]}),e.teryt.simcCode&&w.jsxs("span",{className:"teryt-tag",children:["SIMC: ",e.teryt.simcCode]}),e.teryt.ulicCode&&w.jsxs("span",{className:"teryt-tag",children:["ULIC: ",e.teryt.ulicCode]}),e.teryt.fullCode&&w.jsxs("span",{className:"teryt-tag",children:["Pełny: ",e.teryt.fullCode]})]}):null]},e._id);return w.jsxs(vv,{children:[w.jsxs(zv,{children:[w.jsx(fv,{className:"icon"}),w.jsx("h2",{children:"Wyszukiwanie zaawansowane TERYT"})]}),w.jsxs($v,{onSubmit:h,children:[w.jsxs(Sv,{children:[w.jsx("label",{children:"Kod TERC (województwo + powiat + gmina)"}),w.jsx("input",{type:"text",name:"tercCode",value:e.tercCode,onChange:m,placeholder:"np. 140101"})]}),w.jsxs(Sv,{children:[w.jsx("label",{children:"Kod SIMC (miejscowość)"}),w.jsx("input",{type:"text",name:"simcCode",value:e.simcCode,onChange:m,placeholder:"np. 0918123"})]}),w.jsxs(Sv,{children:[w.jsx("label",{children:"Kod ULIC (ulica)"}),w.jsx("input",{type:"text",name:"ulicCode",value:e.ulicCode,onChange:m,placeholder:"np. 12345"})]}),w.jsxs(Sv,{children:[w.jsx("label",{children:"Pełny kod TERYT"}),w.jsx("input",{type:"text",name:"fullCode",value:e.fullCode,onChange:m,placeholder:"np. 140101091812312345"})]}),w.jsxs(Sv,{children:[w.jsx("label",{children:"Kod województwa"}),w.jsx("input",{type:"text",name:"voivodeshipCode",value:e.voivodeshipCode,onChange:m,placeholder:"np. 14"})]}),w.jsxs(Sv,{children:[w.jsx("label",{children:"Kod powiatu"}),w.jsx("input",{type:"text",name:"countyCode",value:e.countyCode,onChange:m,placeholder:"np. 1401"})]}),w.jsxs(Sv,{children:[w.jsx("label",{children:"Kod gminy"}),w.jsx("input",{type:"text",name:"municipalityCode",value:e.municipalityCode,onChange:m,placeholder:"np. 140101"})]}),w.jsxs(Sv,{children:[w.jsx("label",{children:"Typ wyszukiwania"}),w.jsxs("select",{name:"searchType",value:e.searchType,onChange:m,children:[w.jsx("option",{value:"all",children:"Wszystko"}),w.jsx("option",{value:"shops",children:"Sklepy"}),w.jsx("option",{value:"companies",children:"Firmy"}),w.jsx("option",{value:"users",children:"Użytkownicy"})]})]})]}),w.jsxs("div",{style:{display:"flex",gap:"1rem"},children:[w.jsx(Cv,{type:"submit",onClick:h,disabled:a,children:a?w.jsxs(w.Fragment,{children:[w.jsx("div",{className:"spinner",style:{width:"16px",height:"16px",borderWidth:"2px"}}),"Wyszukiwanie..."]}):w.jsxs(w.Fragment,{children:[w.jsx(fv,{}),"Wyszukaj"]})}),w.jsx(Cv,{type:"button",onClick:()=>{t({tercCode:"",simcCode:"",ulicCode:"",fullCode:"",voivodeshipCode:"",countyCode:"",municipalityCode:"",searchType:"all"}),o({shops:[],companies:[],users:[]}),l(0),d("")},style:{background:"#6c757d",color:"white"},children:"Wyczyść"})]}),s&&w.jsx(Lv,{children:s}),a&&w.jsx(Mv,{children:w.jsx("div",{className:"spinner"})}),c>0&&w.jsxs(Nv,{children:[w.jsxs(Pv,{children:[w.jsx("h3",{children:"Wyniki wyszukiwania"}),w.jsxs("span",{className:"count",children:[c," wyników"]})]}),"all"===e.searchType||"shops"===e.searchType?r.shops.length>0&&w.jsxs("div",{style:{marginBottom:"2rem"},children:[w.jsxs("h4",{style:{marginBottom:"1rem",color:"#333"},children:["🏪 Sklepy (",r.shops.length,")"]}),w.jsx(Bv,{children:r.shops.map(e=>p(e,"shop"))})]}):null,"all"===e.searchType||"companies"===e.searchType?r.companies.length>0&&w.jsxs("div",{style:{marginBottom:"2rem"},children:[w.jsxs("h4",{style:{marginBottom:"1rem",color:"#333"},children:["🏢 Firmy (",r.companies.length,")"]}),w.jsx(Bv,{children:r.companies.map(e=>p(e,"company"))})]}):null,"all"===e.searchType||"users"===e.searchType?r.users.length>0&&w.jsxs("div",{style:{marginBottom:"2rem"},children:[w.jsxs("h4",{style:{marginBottom:"1rem",color:"#333"},children:["👤 Użytkownicy (",r.users.length,")"]}),w.jsx(Bv,{children:r.users.map(e=>p(e,"user"))})]}):null]})]})},Wv=p.div`
  position: relative;
  width: 100%;
`,Dv=p.div`
  position: relative;
  display: flex;
  align-items: center;
`,Ov=p.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background: ${e=>e.theme.inputBackground};
  color: ${e=>e.theme.text};
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.primary};
  }
  
  &::placeholder {
    color: ${e=>e.theme.textSecondary};
  }
`,Iv=p.div`
  position: absolute;
  left: 0.75rem;
  color: ${e=>e.theme.textSecondary};
  z-index: 1;
`,Fv=p.button`
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: ${e=>e.theme.textSecondary};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${e=>e.theme.border};
    color: ${e=>e.theme.text};
  }
`,_v=p.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${e=>e.theme.cardBackground};
  border: 1px solid ${e=>e.theme.border};
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 0;
  padding: 0;
  list-style: none;
`,Rv=p.li`
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid ${e=>e.theme.border};
  transition: background-color 0.2s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${e=>e.theme.primary}10;
  }
  
  &.selected {
    background: ${e=>e.theme.primary}20;
  }
`,Zv=p.div`
  font-weight: 500;
  color: ${e=>e.theme.text};
  margin-bottom: 0.25rem;
`;p.div`
  font-size: 0.85rem;
  color: ${e=>e.theme.textSecondary};
`;const Hv=p.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.25rem;
`,Uv=p.span`
  background: ${e=>e.theme.secondary}20;
  color: ${e=>e.theme.secondary};
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`,Kv=p.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  
  .spinner {
    border: 2px solid ${e=>e.theme.border};
    border-top: 2px solid ${e=>e.theme.primary};
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`,Yv=p.div`
  padding: 1rem;
  text-align: center;
  color: ${e=>e.theme.textSecondary};
  font-style: italic;
`,Vv=p.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${e=>e.theme.primary}10;
  border: 1px solid ${e=>e.theme.primary}30;
  border-radius: 8px;
`,qv=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  h4 {
    margin: 0;
    color: ${e=>e.theme.primary};
    font-size: 1rem;
  }
`,Gv=({onAddressSelect:e,placeholder:t="Wpisz adres...",showSelected:r=!0,initialValue:o=""})=>{const[a,n]=i.useState(o),[s,d]=i.useState([]),[c,l]=i.useState(!1),[m,h]=i.useState(-1),[p,x]=i.useState(!1),[u,g]=i.useState(null),[j,y]=i.useState(""),b=i.useRef(null),f=i.useRef(null),k=i.useRef(null);i.useEffect(()=>(a.length>=3?(k.current&&clearTimeout(k.current),k.current=setTimeout(()=>{v(a)},300)):(d([]),x(!1)),()=>{k.current&&clearTimeout(k.current)}),[a]);const v=async e=>{l(!0),y("");try{const t=await fetch(`/api/geocoding/autocomplete?query=${encodeURIComponent(e)}&limit=10`);if(t.ok){const e=await t.json();d(e.data||[]),x(!0),h(-1)}else y("Błąd podczas wyszukiwania adresów")}catch(t){y("Błąd połączenia")}finally{l(!1)}},z=t=>{n(t.description),g(t),x(!1),h(-1),e&&e(t)};return w.jsxs(Wv,{children:[w.jsxs(Dv,{children:[w.jsx(Iv,{children:w.jsx(fv,{})}),w.jsx(Ov,{ref:b,type:"text",value:a,onChange:t=>{const r=t.target.value;n(r),g(null),e&&e(null)},onKeyDown:e=>{if(p)switch(e.key){case"ArrowDown":e.preventDefault(),h(e=>e<s.length-1?e+1:e);break;case"ArrowUp":e.preventDefault(),h(e=>e>0?e-1:-1);break;case"Enter":e.preventDefault(),m>=0&&s[m]&&z(s[m]);break;case"Escape":x(!1),h(-1)}},onFocus:()=>{s.length>0&&x(!0)},onBlur:()=>{setTimeout(()=>{x(!1),h(-1)},200)},placeholder:t}),a&&w.jsx(Fv,{onClick:()=>{n(""),g(null),d([]),x(!1),h(-1),e&&e(null),b.current&&b.current.focus()},children:w.jsx(kv,{})})]}),p&&w.jsx(_v,{ref:f,children:c?w.jsx(Kv,{children:w.jsx("div",{className:"spinner"})}):s.length>0?s.map((e,t)=>((e,t)=>{const r=t===m;return w.jsxs(Rv,{className:r?"selected":"",onClick:()=>z(e),onMouseEnter:()=>h(t),children:[w.jsxs(Zv,{children:[w.jsx(bv,{style:{marginRight:"0.5rem",fontSize:"0.9rem"}}),e.description]}),e.teryt&&w.jsxs(Hv,{children:[e.teryt.tercCode&&w.jsxs(Uv,{children:["TERC: ",e.teryt.tercCode]}),e.teryt.simcCode&&w.jsxs(Uv,{children:["SIMC: ",e.teryt.simcCode]}),e.teryt.ulicCode&&w.jsxs(Uv,{children:["ULIC: ",e.teryt.ulicCode]})]})]},e.placeId||t)})(e,t)):w.jsxs(Yv,{children:['Brak wyników dla "',a,'"']})}),r&&u&&w.jsxs(Vv,{children:[w.jsxs(qv,{children:[w.jsx("h4",{children:"Wybrany adres:"}),w.jsx(Fv,{onClick:()=>g(null),children:w.jsx(kv,{})})]}),w.jsx("div",{style:{marginBottom:"0.5rem"},children:w.jsx("strong",{children:u.description})}),u.teryt&&w.jsxs(Hv,{children:[u.teryt.tercCode&&w.jsxs(Uv,{children:["TERC: ",u.teryt.tercCode]}),u.teryt.simcCode&&w.jsxs(Uv,{children:["SIMC: ",u.teryt.simcCode]}),u.teryt.ulicCode&&w.jsxs(Uv,{children:["ULIC: ",u.teryt.ulicCode]}),u.teryt.fullCode&&w.jsxs(Uv,{children:["Pełny: ",u.teryt.fullCode]})]})]}),j&&w.jsx("div",{style:{color:"#c53030",fontSize:"0.85rem",marginTop:"0.5rem"},children:j})]})},Jv=p.div`
  background: ${e=>e.theme.cardBackground};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`,Xv=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    margin: 0;
    color: ${e=>e.theme.primary};
    font-size: 1.5rem;
    font-weight: 600;
  }
`,Qv=p.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1.5rem;
  min-height: 500px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`,ez=p.div`
  background: ${e=>e.theme.inputBackground};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 8px;
  padding: 1rem;
  height: fit-content;
`,tz=p.div`
  margin-bottom: 1.5rem;
  
  h3 {
    margin: 0 0 0.75rem 0;
    color: ${e=>e.theme.text};
    font-size: 1rem;
    font-weight: 600;
  }
`,rz=p.div`
  margin-bottom: 1rem;
  
  label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: ${e=>e.theme.text};
    font-size: 0.9rem;
  }
  
  input, select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid ${e=>e.theme.border};
    border-radius: 4px;
    font-size: 0.9rem;
    background: ${e=>e.theme.cardBackground};
    color: ${e=>e.theme.text};
    
    &:focus {
      outline: none;
      border-color: ${e=>e.theme.primary};
    }
  }
`,iz=p.button`
  width: 100%;
  background: ${e=>e.theme.gradient};
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${e=>e.theme.gradientHover};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`,oz=p.button`
  width: 100%;
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  
  &:hover {
    background: #5a6268;
  }
`,az=p.div`
  background: #f8f9fa;
  border: 1px solid ${e=>e.theme.border};
  border-radius: 8px;
  position: relative;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
`,nz=p.div`
  text-align: center;
  color: ${e=>e.theme.textSecondary};
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: ${e=>e.theme.primary};
  }
  
  h3 {
    margin: 0 0 0.5rem 0;
    color: ${e=>e.theme.text};
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
  }
`,sz=p.div`
  max-height: 400px;
  overflow-y: auto;
  margin-top: 1rem;
`,dz=p.div`
  background: ${e=>e.theme.cardBackground};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${e=>e.theme.primary};
    transform: translateY(-1px);
  }
  
  &.selected {
    border-color: ${e=>e.theme.primary};
    background: ${e=>e.theme.primary}10;
  }
`,cz=p.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  
  .icon {
    margin-right: 0.5rem;
    color: ${e=>e.theme.primary};
  }
  
  h4 {
    margin: 0;
    color: ${e=>e.theme.text};
    font-size: 0.9rem;
  }
`,lz=p.div`
  font-size: 0.8rem;
  color: ${e=>e.theme.textSecondary};
  margin-bottom: 0.5rem;
`,mz=p.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
`,hz=p.span`
  background: ${e=>e.theme.secondary}20;
  color: ${e=>e.theme.secondary};
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
`,pz=p.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  
  .spinner {
    border: 3px solid ${e=>e.theme.border};
    border-top: 3px solid ${e=>e.theme.primary};
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`,xz=p.div`
  background: #fee;
  color: #c53030;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #fed7d7;
  margin-top: 1rem;
`,uz=()=>{const[e,t]=i.useState({tercCode:"",simcCode:"",ulicCode:"",fullCode:"",voivodeshipCode:"",countyCode:"",municipalityCode:"",radius:10,objectType:"all"}),[r,o]=i.useState([]),[a,n]=i.useState(!1),[s,d]=i.useState(""),[c,l]=i.useState(null),[m,h]=i.useState({lat:52.2297,lng:21.0122}),p=e=>{const{name:r,value:i}=e.target;t(e=>({...e,[r]:i}))},x=e=>{switch(e){case"shop":return w.jsx(uv,{});case"company":return w.jsx(gv,{});case"user":return w.jsx(jv,{});default:return w.jsx(bv,{})}},u=(e,t)=>{const r=c?._id===e._id;return w.jsxs(dz,{className:r?"selected":"",onClick:()=>(e=>{l(e),e.location?.coordinates&&h({lat:e.location.coordinates.lat,lng:e.location.coordinates.lng})})(e),children:[w.jsxs(cz,{children:[w.jsx("span",{className:"icon",children:x(e.type)}),w.jsxs("h4",{children:["shop"===e.type&&e.name,"company"===e.type&&e.name,"user"===e.type&&`${e.firstName} ${e.lastName}`]})]}),w.jsxs(lz,{children:["shop"===e.type&&e.description,"company"===e.type&&e.shortDescription,"user"===e.type&&e.email]}),e.address&&w.jsxs(lz,{children:["📍 ",e.address.city,", ",e.address.street]}),e.distance&&w.jsxs(lz,{children:["📏 Odległość: ",e.distance.toFixed(2)," km"]}),e.teryt&&w.jsxs(mz,{children:[e.teryt.tercCode&&w.jsxs(hz,{children:["TERC: ",e.teryt.tercCode]}),e.teryt.simcCode&&w.jsxs(hz,{children:["SIMC: ",e.teryt.simcCode]}),e.teryt.ulicCode&&w.jsxs(hz,{children:["ULIC: ",e.teryt.ulicCode]})]})]},e._id||t)};return w.jsxs(Jv,{children:[w.jsx(Xv,{children:w.jsx("h2",{children:"🗺️ Mapa z filtrowaniem TERYT"})}),w.jsxs(Qv,{children:[w.jsxs(ez,{children:[w.jsxs(tz,{children:[w.jsx("h3",{children:"Filtry TERYT"}),w.jsxs(rz,{children:[w.jsx("label",{children:"Kod TERC"}),w.jsx("input",{type:"text",name:"tercCode",value:e.tercCode,onChange:p,placeholder:"np. 140101"})]}),w.jsxs(rz,{children:[w.jsx("label",{children:"Kod SIMC"}),w.jsx("input",{type:"text",name:"simcCode",value:e.simcCode,onChange:p,placeholder:"np. 0918123"})]}),w.jsxs(rz,{children:[w.jsx("label",{children:"Kod ULIC"}),w.jsx("input",{type:"text",name:"ulicCode",value:e.ulicCode,onChange:p,placeholder:"np. 12345"})]}),w.jsxs(rz,{children:[w.jsx("label",{children:"Pełny kod TERYT"}),w.jsx("input",{type:"text",name:"fullCode",value:e.fullCode,onChange:p,placeholder:"np. 140101091812312345"})]}),w.jsxs(rz,{children:[w.jsx("label",{children:"Kod województwa"}),w.jsx("input",{type:"text",name:"voivodeshipCode",value:e.voivodeshipCode,onChange:p,placeholder:"np. 14"})]}),w.jsxs(rz,{children:[w.jsx("label",{children:"Kod powiatu"}),w.jsx("input",{type:"text",name:"countyCode",value:e.countyCode,onChange:p,placeholder:"np. 1401"})]}),w.jsxs(rz,{children:[w.jsx("label",{children:"Kod gminy"}),w.jsx("input",{type:"text",name:"municipalityCode",value:e.municipalityCode,onChange:p,placeholder:"np. 140101"})]})]}),w.jsxs(tz,{children:[w.jsx("h3",{children:"Ustawienia wyszukiwania"}),w.jsxs(rz,{children:[w.jsx("label",{children:"Promień wyszukiwania (km)"}),w.jsx("input",{type:"number",name:"radius",value:e.radius,onChange:p,min:"1",max:"100"})]}),w.jsxs(rz,{children:[w.jsx("label",{children:"Typ obiektów"}),w.jsxs("select",{name:"objectType",value:e.objectType,onChange:p,children:[w.jsx("option",{value:"all",children:"Wszystkie"}),w.jsx("option",{value:"shops",children:"Sklepy"}),w.jsx("option",{value:"companies",children:"Firmy"}),w.jsx("option",{value:"users",children:"Użytkownicy"})]})]})]}),w.jsx(iz,{onClick:async()=>{n(!0),d("");try{if(!(e.tercCode||e.simcCode||e.ulicCode||e.fullCode||e.voivodeshipCode||e.countyCode||e.municipalityCode))return d("Podaj przynajmniej jeden kod TERYT do wyszukiwania"),void n(!1);const t=localStorage.getItem("token"),r={"Content-Type":"application/json"};t&&(r.Authorization=`Bearer ${t}`);const i=new URLSearchParams({...e,lat:m.lat,lng:m.lng,radius:e.radius,types:e.objectType}),a=await fetch(`/api/geocoding/search-nearby?${i}`,{headers:r});if(a.ok){const e=await a.json();if(o(e.data?.results||[]),e.data?.results?.length>0){const t=e.data.results[0];t.location?.coordinates&&h({lat:t.location.coordinates.lat,lng:t.location.coordinates.lng})}}else d("Błąd podczas wyszukiwania obiektów w pobliżu")}catch(t){d("Wystąpił błąd podczas wyszukiwania. Spróbuj ponownie.")}finally{n(!1)}},disabled:a,children:a?w.jsxs(w.Fragment,{children:[w.jsx("div",{className:"spinner",style:{width:"16px",height:"16px",borderWidth:"2px"}}),"Wyszukiwanie..."]}):w.jsxs(w.Fragment,{children:[w.jsx(fv,{}),"Wyszukaj w pobliżu"]})}),w.jsxs(oz,{onClick:()=>{t({tercCode:"",simcCode:"",ulicCode:"",fullCode:"",voivodeshipCode:"",countyCode:"",municipalityCode:"",radius:10,objectType:"all"}),o([]),l(null),d("")},children:[w.jsx(kv,{}),"Wyczyść filtry"]}),s&&w.jsx(xz,{children:s})]}),w.jsxs("div",{children:[w.jsx(az,{children:a?w.jsx(pz,{children:w.jsx("div",{className:"spinner"})}):r.length>0?w.jsxs(nz,{children:[w.jsx("div",{className:"icon",children:"🗺️"}),w.jsx("h3",{children:"Mapa z wynikami"}),w.jsxs("p",{children:["Znaleziono ",r.length," obiektów w promieniu ",e.radius,"km"]}),w.jsxs("p",{children:["Centrum: ",m.lat.toFixed(4),", ",m.lng.toFixed(4)]})]}):w.jsxs(nz,{children:[w.jsx("div",{className:"icon",children:"🗺️"}),w.jsx("h3",{children:"Mapa TERYT"}),w.jsx("p",{children:"Użyj filtrów po lewej stronie, aby wyszukać obiekty"}),w.jsxs("p",{children:["Centrum: ",m.lat.toFixed(4),", ",m.lng.toFixed(4)]})]})}),r.length>0&&w.jsxs(sz,{children:[w.jsxs("h3",{style:{margin:"1rem 0 0.5rem 0",color:"#333"},children:["Wyniki (",r.length,")"]}),r.map((e,t)=>u(e,t))]})]})]})]})},gz=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`,jz=p.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    color: ${e=>e.theme.primary};
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }
  
  p {
    color: ${e=>e.theme.textSecondary};
    font-size: 1.1rem;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
`,yz=p.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${e=>e.theme.border};
`,bz=p.button`
  background: none;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${e=>e.active?e.theme.primary:e.theme.textSecondary};
  cursor: pointer;
  border-bottom: 3px solid ${e=>e.active?e.theme.primary:"transparent"};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: ${e=>e.theme.primary};
  }
`,fz=p.div`
  min-height: 400px;
`,wz=p.div`
  background: ${e=>e.theme.primary}10;
  border: 1px solid ${e=>e.theme.primary}30;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  h3 {
    color: ${e=>e.theme.primary};
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  ul {
    margin: 0;
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 0.5rem;
      color: ${e=>e.theme.text};
      line-height: 1.5;
    }
  }
`,kz=p.div`
  background: ${e=>e.theme.cardBackground};
  border: 1px solid ${e=>e.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  h3 {
    color: ${e=>e.theme.text};
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
  }
`,vz=()=>{const[e,t]=i.useState("search"),[r,o]=i.useState(null),a=[{id:"search",label:"Wyszukiwanie TERYT",icon:w.jsx(fv,{}),description:"Zaawansowane wyszukiwanie sklepów, firm i użytkowników po kodach TERYT"},{id:"autocomplete",label:"Autouzupełnianie",icon:w.jsx(gv,{}),description:"Inteligentne autouzupełnianie adresów z kodami TERYT"},{id:"map",label:"Mapa TERYT",icon:w.jsx(bv,{}),description:"Wizualizacja obiektów na mapie z filtrowaniem po kodach administracyjnych"}],n=e=>{o(e)};return w.jsxs(gz,{children:[w.jsxs(jz,{children:[w.jsx("h1",{children:"🗺️ Funkcjonalności TERYT"}),w.jsx("p",{children:"Zaawansowane narzędzia do wyszukiwania i analizy danych geograficznych z wykorzystaniem polskich kodów administracyjnych TERYT/SIMC/ULIC"})]}),w.jsxs(wz,{children:[w.jsxs("h3",{children:[w.jsx(yv,{}),"Informacje o kodach TERYT"]}),w.jsxs("ul",{children:[w.jsxs("li",{children:[w.jsx("strong",{children:"TERC"})," - kod jednostki administracyjnej (województwo + powiat + gmina)"]}),w.jsxs("li",{children:[w.jsx("strong",{children:"SIMC"})," - kod identyfikacyjny miejscowości"]}),w.jsxs("li",{children:[w.jsx("strong",{children:"ULIC"})," - kod identyfikacyjny ulicy"]}),w.jsxs("li",{children:[w.jsx("strong",{children:"Pełny kod TERYT"})," - kombinacja wszystkich kodów dla dokładnej lokalizacji"]})]})]}),w.jsx(yz,{children:a.map(r=>w.jsxs(bz,{active:e===r.id,onClick:()=>t(r.id),children:[r.icon,r.label]},r.id))}),w.jsx(fz,{children:(()=>{switch(e){case"search":default:return w.jsx(Ev,{});case"autocomplete":return w.jsxs("div",{children:[w.jsxs(kz,{children:[w.jsx("h3",{children:"Autouzupełnianie adresów z kodami TERYT"}),w.jsx("p",{style:{marginBottom:"1rem",color:"#666"},children:"Wpisz adres, aby zobaczyć sugestie z kodami TERYT/SIMC/ULIC:"}),w.jsx(Gv,{onAddressSelect:n,placeholder:"Wpisz adres, np. 'Warszawa, Marszałkowska'",showSelected:!0})]}),r&&w.jsxs(kz,{children:[w.jsx("h3",{children:"Wybrany adres"}),w.jsxs("div",{style:{padding:"1rem",background:"#f8f9fa",borderRadius:"8px"},children:[w.jsxs("p",{children:[w.jsx("strong",{children:"Adres:"})," ",r.description]}),r.teryt&&w.jsxs("div",{style:{marginTop:"0.5rem"},children:[w.jsx("p",{children:w.jsx("strong",{children:"Kody TERYT:"})}),w.jsxs("ul",{style:{margin:"0.5rem 0 0 1.5rem"},children:[r.teryt.tercCode&&w.jsxs("li",{children:["TERC: ",r.teryt.tercCode]}),r.teryt.simcCode&&w.jsxs("li",{children:["SIMC: ",r.teryt.simcCode]}),r.teryt.ulicCode&&w.jsxs("li",{children:["ULIC: ",r.teryt.ulicCode]}),r.teryt.fullCode&&w.jsxs("li",{children:["Pełny kod: ",r.teryt.fullCode]})]})]})]})]})]});case"map":return w.jsx(uz,{})}})()}),w.jsxs(wz,{children:[w.jsxs("h3",{children:[w.jsx(wv,{}),"Jak korzystać z funkcjonalności TERYT"]}),w.jsxs("ul",{children:[w.jsxs("li",{children:[w.jsx("strong",{children:"Wyszukiwanie:"})," Użyj kodów TERYT do precyzyjnego wyszukiwania obiektów w określonej lokalizacji"]}),w.jsxs("li",{children:[w.jsx("strong",{children:"Autouzupełnianie:"})," Wpisz adres, aby otrzymać sugestie z kodami administracyjnymi"]}),w.jsxs("li",{children:[w.jsx("strong",{children:"Mapa:"})," Wizualizuj obiekty na mapie z filtrowaniem po kodach TERYT"]}),w.jsxs("li",{children:[w.jsx("strong",{children:"Integracja:"})," Wszystkie funkcjonalności są zintegrowane z systemem sklepów, firm i użytkowników"]})]})]})]})},zz=p.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`,$z=p(o)`
  display: inline-block;
  margin-bottom: 1.5rem;
  color: ${e=>e.theme.primary};
  text-decoration: none;
  font-weight: 600;
`,Sz=p.div`
  display: flex;
  gap: 2rem;
  background: ${e=>e.theme.surface};
  border-radius: 16px;
  box-shadow: ${e=>e.theme.shadow};
  padding: 2rem;
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
  }
`,Cz=p.img`
  width: 320px;
  height: 320px;
  object-fit: cover;
  border-radius: 12px;
  background: #f0f0f0;
  @media (max-width: 480px) {
    width: 100%;
    height: 200px;
  }
`,Nz=p.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`,Pz=p.h1`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
`,Bz=p.div`
  font-size: 1.7rem;
  font-weight: 700;
  color: ${e=>e.theme.primary};
`,Az=p.p`
  color: ${e=>e.theme.textSecondary};
  font-size: 1.1rem;
`,Tz=p.span`
  font-weight: 600;
  color: ${e=>e.theme.text};
`,Mz=p.button`
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background: ${e=>e.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${e=>e.theme.primary}cc;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,Lz=p.div`
  background: ${e=>e.theme.surface};
  border-radius: 16px;
  box-shadow: ${e=>e.theme.shadow};
  overflow: hidden;
`,Ez=p.div`
  display: flex;
  border-bottom: 1px solid ${e=>e.theme.border};
`,Wz=p.button`
  flex: 1;
  padding: 1rem 1.5rem;
  background: ${e=>"true"===e.active?e.theme.primary:"transparent"};
  color: ${e=>"true"===e.active?"white":e.theme.text};
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  &:hover {
    background: ${e=>"true"===e.active?e.theme.primary:e.theme.background};
  }
`,Dz=p.div`
  padding: 2rem;
`,Oz=p.div`
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: ${e=>e.theme.text};
  }
  
  p {
    line-height: 1.6;
    color: ${e=>e.theme.textSecondary};
    margin-bottom: 1rem;
  }
`,Iz=p.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`,Fz=p.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: ${e=>e.theme.background};
  border-radius: 8px;
  
  .label {
    font-weight: 600;
    color: ${e=>e.theme.text};
  }
  
  .value {
    color: ${e=>e.theme.textSecondary};
  }
`,_z=p.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`,Rz=p.div`
  display: flex;
  gap: 0.25rem;
  font-size: 1.5rem;
`,Zz=p.span`
  color: ${e=>"true"===e.filled?"#FFD700":"#ddd"};
  cursor: pointer;
`,Hz=p.div`
  .rating {
    font-size: 2rem;
    font-weight: 700;
    color: ${e=>e.theme.text};
  }
  
  .count {
    color: ${e=>e.theme.textSecondary};
    font-size: 0.9rem;
  }
`,Uz=p.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`,Kz=p.div`
  padding: 1.5rem;
  background: ${e=>e.theme.background};
  border-radius: 12px;
  border-left: 4px solid ${e=>e.theme.primary};
`,Yz=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,Vz=p.div`
  .name {
    font-weight: 600;
    color: ${e=>e.theme.text};
  }
  
  .date {
    font-size: 0.9rem;
    color: ${e=>e.theme.textSecondary};
  }
`,qz=p.div`
  color: ${e=>e.theme.textSecondary};
  line-height: 1.6;
`,Gz=p.div`
  text-align: center;
  padding: 3rem;
  color: ${e=>e.theme.textSecondary};
  font-style: italic;
`,Jz=p.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`,Xz=p.button`
  width: 40px;
  height: 40px;
  border: 2px solid ${e=>e.theme.primary};
  background: white;
  color: ${e=>e.theme.primary};
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background: ${e=>e.theme.primary};
    color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,Qz=p.input`
  width: 60px;
  height: 40px;
  text-align: center;
  border: 2px solid ${e=>e.theme.border};
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
`,e$=p.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  
  &.success {
    background: #4caf50;
  }
  
  &.error {
    background: #f44336;
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;function t$(){const{productId:e}=n(),{user:t,isAuthenticated:r}=N(),[o,a]=i.useState(null),[s,d]=i.useState(!0),[c,l]=i.useState(null),[m,h]=i.useState("description"),[p,x]=i.useState([]),[u,g]=i.useState(!1),[j,y]=i.useState({rating:5,comment:""}),[b,f]=i.useState(null),[k,v]=i.useState(!1),[z,$]=i.useState(null),[S,C]=i.useState(1),[P,B]=i.useState(!1),[A,T]=i.useState(null);i.useEffect(()=>{M(),L()},[e]),i.useEffect(()=>{if(r&&t&&p.length>0){const e=p.find(e=>e.user===t.id);$(e||null)}else $(null)},[p,t,r]);const M=async()=>{try{d(!0);const t="http://localhost:5000",r=await fetch(`${t}/api/products/${e}`);if(!r.ok)throw new Error("Nie udało się pobrać produktu");const i=await r.json();a(i)}catch(t){l(t.message)}finally{d(!1)}},L=async()=>{try{g(!0);const t="http://localhost:5000",r=await fetch(`${t}/api/products/${e}/reviews`);if(r.ok){const e=await r.json();x(e.reviews||[])}}catch(t){}finally{g(!1)}},E=e=>Array.from({length:5},(t,r)=>w.jsx(Zz,{filled:(r<e).toString(),children:"★"},r)),W=e=>{y({...j,[e.target.name]:e.target.value})},D=async t=>{t.preventDefault(),f(null),v(null);try{const t="http://localhost:5000",r=await fetch(`${t}/api/products/${e}/reviews`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`},body:JSON.stringify(j)}),i=await r.json();r.ok?(v("Dziękujemy za recenzję!"),y({rating:5,comment:""}),L()):f(i.error||"Błąd dodawania recenzji")}catch(r){f("Błąd sieci")}},O=e=>{const t=Math.max(1,Math.min(e,o?.stock||1));C(t)};i.useEffect(()=>{if(A){const e=setTimeout(()=>{T(null)},3e3);return()=>clearTimeout(e)}},[A]);return s?w.jsx(zz,{children:"Ładowanie produktu..."}):c?w.jsxs(zz,{children:["Błąd: ",c]}):o?w.jsxs(zz,{children:[A&&w.jsx(e$,{className:A.type,children:A.message}),w.jsx($z,{to:o.shop?`/shop/${o.shop}`:"/shops",children:"← Wróć do sklepu"}),w.jsxs(Sz,{children:[w.jsx(Cz,{src:o.mainImage||o.images&&o.images[0]||"https://via.placeholder.com/400x300",alt:o.name}),w.jsxs(Nz,{children:[w.jsx(Pz,{children:o.name}),w.jsxs(Bz,{children:[o.price," zł"]}),w.jsx(Az,{children:o.description}),w.jsxs("div",{children:[w.jsx(Tz,{children:"Kategoria:"})," ",o.category]}),w.jsxs("div",{children:[w.jsx(Tz,{children:"Marka:"})," ",o.brand]}),w.jsxs("div",{children:[w.jsx(Tz,{children:"Dostępność:"})," ",o.isActive?"Dostępny":"Niedostępny"," (",o.stock," szt.)"]}),w.jsxs("div",{children:[w.jsx(Tz,{children:"Tagi:"})," ",o.tags&&o.tags.join(", ")]}),o.isActive&&o.stock>0&&w.jsxs(w.Fragment,{children:[w.jsxs(Jz,{children:[w.jsx(Xz,{onClick:()=>O(S-1),disabled:S<=1,children:"-"}),w.jsx(Qz,{type:"number",min:"1",max:o.stock,value:S,onChange:e=>O(parseInt(e.target.value)||1)}),w.jsx(Xz,{onClick:()=>O(S+1),disabled:S>=o.stock,children:"+"})]}),w.jsx(Mz,{onClick:async()=>{if(r)if(o&&o.isActive)if(S>o.stock)T({type:"error",message:"Niewystarczający stan magazynowy"});else{B(!0);try{const e=await fetch("http://localhost:5000/api/cart/add",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`},body:JSON.stringify({productId:o._id,quantity:S})}),t=await e.json();e.ok?(T({type:"success",message:`Dodano ${S} szt. do koszyka!`}),C(1)):T({type:"error",message:t.error||"Błąd dodawania do koszyka"})}catch(e){T({type:"error",message:"Błąd sieci"})}finally{B(!1)}}else T({type:"error",message:"Produkt jest niedostępny"});else T({type:"error",message:"Musisz się zalogować, aby dodać produkt do koszyka"})},disabled:P||!r,children:P?"Dodawanie...":"🛒 Dodaj do koszyka"})]}),!o.isActive&&w.jsx("div",{style:{color:"#f44336",fontWeight:600,marginTop:"1rem"},children:"Produkt niedostępny"}),o.isActive&&0===o.stock&&w.jsx("div",{style:{color:"#f44336",fontWeight:600,marginTop:"1rem"},children:"Brak w magazynie"})]})]}),w.jsxs(Lz,{children:[w.jsxs(Ez,{children:[w.jsx(Wz,{active:("description"===m).toString(),onClick:()=>h("description"),children:"Opis"}),w.jsx(Wz,{active:("specifications"===m).toString(),onClick:()=>h("specifications"),children:"Specyfikacje"}),w.jsxs(Wz,{active:("reviews"===m).toString(),onClick:()=>h("reviews"),children:["Recenzje (",p.length,")"]})]}),w.jsx(Dz,{children:(()=>{switch(m){case"description":return w.jsxs(Oz,{children:[w.jsx("h3",{children:"Opis produktu"}),w.jsx("p",{children:o.description}),o.longDescription&&w.jsx("p",{children:o.longDescription})]});case"specifications":return w.jsxs(Oz,{children:[w.jsx("h3",{children:"Specyfikacje techniczne"}),w.jsxs(Iz,{children:[o.specifications&&Object.entries(o.specifications).map(([e,t])=>w.jsxs(Fz,{children:[w.jsx("span",{className:"label",children:e}),w.jsx("span",{className:"value",children:t})]},e)),w.jsxs(Fz,{children:[w.jsx("span",{className:"label",children:"Kategoria"}),w.jsx("span",{className:"value",children:o.category})]}),w.jsxs(Fz,{children:[w.jsx("span",{className:"label",children:"Marka"}),w.jsx("span",{className:"value",children:o.brand||"Brak informacji"})]}),w.jsxs(Fz,{children:[w.jsx("span",{className:"label",children:"Stan magazynowy"}),w.jsxs("span",{className:"value",children:[o.stock," szt."]})]}),w.jsxs(Fz,{children:[w.jsx("span",{className:"label",children:"Status"}),w.jsx("span",{className:"value",children:o.isActive?"Dostępny":"Niedostępny"})]}),o.tags&&o.tags.length>0&&w.jsxs(Fz,{children:[w.jsx("span",{className:"label",children:"Tagi"}),w.jsx("span",{className:"value",children:o.tags.join(", ")})]})]})]});case"reviews":return w.jsxs(Oz,{children:[w.jsx("h3",{children:"Recenzje i oceny"}),w.jsxs(_z,{children:[w.jsx(Rz,{children:E(o.rating||0)}),w.jsxs(Hz,{children:[w.jsx("div",{className:"rating",children:o.rating||0}),w.jsxs("div",{className:"count",children:[p.length," recenzji"]})]})]}),r&&!z&&w.jsxs("form",{onSubmit:D,style:{marginBottom:"2rem",background:"#f9f9f9",padding:"1.5rem",borderRadius:"12px"},children:[w.jsx("h4",{children:"Dodaj swoją recenzję"}),w.jsxs("div",{style:{marginBottom:"1rem"},children:[w.jsx("label",{children:"Ocena: "}),w.jsx("select",{name:"rating",value:j.rating,onChange:W,children:[5,4,3,2,1].map(e=>w.jsx("option",{value:e,children:e},e))})]}),w.jsxs("div",{style:{marginBottom:"1rem"},children:[w.jsx("label",{children:"Komentarz:"}),w.jsx("br",{}),w.jsx("textarea",{name:"comment",value:j.comment,onChange:W,rows:4,style:{width:"100%"},required:!0,minLength:10})]}),b&&w.jsx("div",{style:{color:"red",marginBottom:"1rem"},children:b}),k&&w.jsx("div",{style:{color:"green",marginBottom:"1rem"},children:k}),w.jsx("button",{type:"submit",children:"Dodaj recenzję"})]}),r&&z&&w.jsx("div",{style:{marginBottom:"2rem",color:"#4caf50",fontWeight:600},children:"Dziękujemy za Twoją recenzję!"}),u?w.jsx("div",{children:"Ładowanie recenzji..."}):p.length>0?w.jsx(Uz,{children:p.map(e=>w.jsxs(Kz,{children:[w.jsxs(Yz,{children:[w.jsxs(Vz,{children:[w.jsx("div",{className:"name",children:e.userName||"Anonimowy użytkownik"}),w.jsx("div",{className:"date",children:new Date(e.createdAt).toLocaleDateString("pl-PL")})]}),w.jsx(Rz,{children:E(e.rating)})]}),w.jsx(qz,{children:e.comment})]},e._id))}):w.jsx(Gz,{children:"Brak recenzji dla tego produktu. Bądź pierwszym, który oceni ten produkt!"})]});default:return null}})()})]})]}):w.jsx(zz,{children:"Nie znaleziono produktu."})}function r$(){const[e,t]=i.useState("light"),[r,o]=i.useState("modern"),[a,n]=i.useState("default");i.useEffect(()=>{const e=localStorage.getItem("theme")||"light";t(e),s()},[]);const s=async()=>{try{const e=localStorage.getItem("token");if(!e)return;const t=await fetch("/api/users/layout-settings/portal",{headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"}});if(t.ok){const e=await t.json();o(e.layout||"modern"),n(e.theme||"default")}}catch(e){}},h=()=>{const r="light"===e?"dark":"light";t(r),localStorage.setItem("theme",r)},p=((e,t)=>{const r={default:{primary:"#00D4AA",secondary:"#8B5CF6",gradient:"linear-gradient(135deg, #00D4AA 0%, #8B5CF6 100%)",gradientHover:"linear-gradient(135deg, #00B894 0%, #7C3AED 100%)"},ocean:{primary:"#0EA5E9",secondary:"#06B6D4",gradient:"linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)",gradientHover:"linear-gradient(135deg, #0284C7 0%, #0891B2 100%)"},sunset:{primary:"#F59E0B",secondary:"#EC4899",gradient:"linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)",gradientHover:"linear-gradient(135deg, #D97706 0%, #DB2777 100%)"},forest:{primary:"#10B981",secondary:"#8B5A2B",gradient:"linear-gradient(135deg, #10B981 0%, #8B5A2B 100%)",gradientHover:"linear-gradient(135deg, #059669 0%, #A16207 100%)"},midnight:{primary:"#1E40AF",secondary:"#7C3AED",gradient:"linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%)",gradientHover:"linear-gradient(135deg, #1D4ED8 0%, #6D28D9 100%)"},coral:{primary:"#F97316",secondary:"#E11D48",gradient:"linear-gradient(135deg, #F97316 0%, #E11D48 100%)",gradientHover:"linear-gradient(135deg, #EA580C 0%, #BE185D 100%)"}};return{...e,...r[t]||r.default}})("light"===e?z:$,a),u=()=>{s()};return w.jsxs(x,{theme:p,children:[w.jsx(S,{}),w.jsx(P,{children:w.jsx(d,{children:(()=>{const e=w.jsxs(c,{children:[w.jsx(l,{path:"/test-route",element:w.jsx("div",{children:"TEST ROUTE DZIAŁA"})}),w.jsx(l,{path:"/test-shop-page",element:w.jsxs("div",{style:{padding:"2rem",textAlign:"center",fontFamily:"Arial, sans-serif",backgroundColor:"#f5f5f5",minHeight:"100vh"},children:[w.jsx("h1",{style:{color:"#2196F3",fontSize:"2.5rem",marginBottom:"1rem"},children:"🧪 Testowa Strona Sklepu"}),w.jsxs("div",{style:{backgroundColor:"white",padding:"2rem",borderRadius:"12px",boxShadow:"0 4px 6px rgba(0,0,0,0.1)",maxWidth:"600px",margin:"0 auto"},children:[w.jsx("h2",{style:{color:"#4CAF50",marginBottom:"1rem"},children:"✅ Jeśli widzisz tę stronę, routing działa poprawnie!"}),w.jsx("p",{style:{fontSize:"1.1rem",marginBottom:"1rem"},children:"To jest testowa strona, która potwierdza, że:"}),w.jsxs("ul",{style:{textAlign:"left",fontSize:"1rem",lineHeight:"1.6"},children:[w.jsx("li",{children:"✅ React Router działa poprawnie"}),w.jsx("li",{children:"✅ Komponenty się renderują"}),w.jsx("li",{children:"✅ Stylowanie działa"}),w.jsx("li",{children:"✅ Routing dynamiczny powinien działać"})]}),w.jsxs("div",{style:{marginTop:"2rem",padding:"1rem",backgroundColor:"#e3f2fd",borderRadius:"8px"},children:[w.jsx("h3",{style:{color:"#1976d2",marginBottom:"0.5rem"},children:"🔗 Testuj te linki:"}),w.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[w.jsx("a",{href:"/shop/6875773831cf77c7af5e07b4",style:{color:"#2196F3",textDecoration:"none"},children:"🏪 /shop/6875773831cf77c7af5e07b4 - Szczegóły sklepu (prawdziwy ID)"}),w.jsx("a",{href:"/company-profiles/6875773831cf77c7af5e07b4",style:{color:"#2196F3",textDecoration:"none"},children:"🏢 /company-profiles/6875773831cf77c7af5e07b4 - Szczegóły firmy (prawdziwy ID)"}),w.jsx("a",{href:"/shop/1",style:{color:"#2196F3",textDecoration:"none"},children:"🏪 /shop/1 - Szczegóły sklepu ID 1"}),w.jsx("a",{href:"/shops/1",style:{color:"#2196F3",textDecoration:"none"},children:"🏪 /shops/1 - Przekierowanie do /shop/1"}),w.jsx("a",{href:"/test-route",style:{color:"#2196F3",textDecoration:"none"},children:"🧪 /test-route - Prosty test"})]})]}),w.jsx("button",{onClick:()=>alert("Testowy przycisk działa!"),style:{marginTop:"1rem",padding:"0.75rem 1.5rem",backgroundColor:"#2196F3",color:"white",border:"none",borderRadius:"8px",fontSize:"1rem",cursor:"pointer"},children:"🎯 Testowy Przycisk"})]})]})}),w.jsx(l,{path:"/",element:w.jsx(st,{})}),w.jsx(l,{path:"/login",element:w.jsx(zt,{})}),w.jsx(l,{path:"/register",element:w.jsx(Ut,{})}),w.jsx(l,{path:"/products",element:w.jsx(Yt,{})}),w.jsx(l,{path:"/shops",element:w.jsx(yr,{})}),w.jsx(l,{path:"/shop/:shopId",element:w.jsx(xi,{theme:p})}),w.jsx(l,{path:"/shops/:id",element:w.jsx(m,{to:e=>`/shop/${e.pathname.split("/").pop()}`,replace:!0})}),w.jsx(l,{path:"/cart",element:w.jsx(Si,{})}),w.jsx(l,{path:"/messages",element:w.jsx(ho,{})}),w.jsx(l,{path:"/payment",element:w.jsx(Zo,{})}),w.jsx(l,{path:"/location",element:w.jsx(pa,{})}),w.jsx(l,{path:"/gamification",element:w.jsx(Ka,{})}),w.jsx(l,{path:"/notifications",element:w.jsx(Ya,{})}),w.jsx(l,{path:"/product-create",element:w.jsx(bn,{})}),w.jsx(l,{path:"/products/create",element:w.jsx(bn,{})}),w.jsx(l,{path:"/shop-create",element:w.jsx(es,{theme:p})}),w.jsx(l,{path:"/shops/create",element:w.jsx(es,{theme:p})}),w.jsx(l,{path:"/shop-management",element:w.jsx(Ns,{})}),w.jsx(l,{path:"/product-management",element:w.jsx(Qs,{})}),w.jsx(l,{path:"/layout-customization",element:w.jsx(Nd,{theme:p,onSettingsSaved:u})}),w.jsx(l,{path:"/profile",element:w.jsx(lc,{})}),w.jsx(l,{path:"/search",element:w.jsx(Vc,{})}),w.jsx(l,{path:"/settings",element:w.jsx(vl,{})}),w.jsx(l,{path:"/country",element:w.jsx(up,{theme:p})}),w.jsx(l,{path:"/voivodeships",element:w.jsx(am,{theme:p})}),w.jsx(l,{path:"/voivodeships/:voivodeshipCode",element:w.jsx(am,{theme:p})}),w.jsx(l,{path:"/counties",element:w.jsx(Em,{theme:p})}),w.jsx(l,{path:"/counties/:countyCode",element:w.jsx(Em,{theme:p})}),w.jsx(l,{path:"/municipalities",element:w.jsx(zh,{theme:p})}),w.jsx(l,{path:"/municipalities/:municipalityCode",element:w.jsx(zh,{theme:p})}),w.jsx(l,{path:"/cities",element:w.jsx(qh,{theme:p})}),w.jsx(l,{path:"/cities/:cityCode",element:w.jsx(qh,{theme:p})}),w.jsx(l,{path:"/location-analytics",element:w.jsx(Op,{})}),w.jsx(l,{path:"/location-import",element:w.jsx(Px,{})}),w.jsx(l,{path:"/location-export",element:w.jsx(xu,{})}),w.jsx(l,{path:"/admin-panel",element:w.jsx(Dg,{})}),w.jsx(l,{path:"/admin",element:w.jsx(Dg,{})}),w.jsx(l,{path:"/local-products",element:w.jsx(dj,{})}),w.jsx(l,{path:"/my-products",element:w.jsx(kj,{})}),w.jsx(l,{path:"/my-shops",element:w.jsx(Zj,{})}),w.jsx(l,{path:"/shop/:shopId/live",element:w.jsx($y,{})}),w.jsx(l,{path:"/friends",element:w.jsx(Gy,{})}),w.jsx(l,{path:"/friendship",element:w.jsx(Vy,{userId:localStorage.getItem("userId")})}),w.jsx(l,{path:"/posts/create",element:w.jsx(Jy,{})}),w.jsx(l,{path:"/messages",element:w.jsx(Xy,{})}),w.jsx(l,{path:"/test",element:w.jsx(Qy,{})}),w.jsx(l,{path:"/location-map",element:w.jsx($b,{theme:p})}),w.jsx(l,{path:"/company-profiles/:id",element:w.jsx(Tb,{theme:p})}),w.jsx(l,{path:"/products/:id",element:w.jsx(Ib,{theme:p})}),w.jsx(l,{path:"/users/:id",element:w.jsx(Kb,{theme:p})}),w.jsx(l,{path:"/posts/:id",element:w.jsx(Qb,{theme:p})}),w.jsx(l,{path:"/advanced-features",element:w.jsx(xv,{theme:p})}),w.jsx(l,{path:"/teryt-features",element:w.jsx(vz,{theme:p})}),w.jsx(l,{path:"/product/:productId",element:w.jsx(t$,{})})]});switch(r){case"classic":return w.jsxs("div",{style:{minHeight:"100vh",background:p.background,color:p.text,display:"flex"},children:[w.jsx("div",{style:{width:"250px",background:p.surface,borderRight:`1px solid ${p.border}`,padding:"1rem"},children:w.jsx(Le,{theme:p,toggleTheme:h,layout:r})}),w.jsx("div",{style:{flex:1,padding:"20px"},children:e})]});case"compact":return w.jsxs("div",{style:{minHeight:"100vh",background:p.background,color:p.text},children:[w.jsx(Le,{theme:p,toggleTheme:h,layout:r}),w.jsx("div",{style:{padding:"10px"},children:e})]});default:return w.jsxs("div",{style:{minHeight:"100vh",background:p.background,color:p.text},children:[w.jsx(Le,{theme:p,toggleTheme:h,layout:r}),w.jsx("div",{style:{padding:"20px"},children:e})]})}})()})})]})}v.createRoot(document.getElementById("root")).render(w.jsx(r$,{}));
