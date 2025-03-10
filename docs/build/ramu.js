var V={volume:.3,sampleRate:44100,x:new AudioContext,play:function(...n){return this.playSamples(this.buildSamples(...n))},playSamples:function(...n){let t=this.x.createBuffer(n.length,n[0].length,this.sampleRate),r=this.x.createBufferSource();return n.map((e,o)=>t.getChannelData(o).set(e)),r.buffer=t,r.connect(this.x.destination),r.start(),r},buildSamples:function(n=1,t=.05,r=220,e=0,o=0,s=.1,a=0,h=1,l=0,I=0,R=0,L=0,g=0,et=0,U=0,rt=0,f=0,W=1,E=0,j=0,S=0){let c=Math.PI*2,k=ht=>ht<0?-1:1,i=this.sampleRate,ot=l*=500*c/i/i,G=r*=(1+t*2*Math.random()-t)*c/i,F=[],p=0,st=0,u=0,y=1,at=0,ut=0,m=0,P,x,it=2,Z=c*Math.abs(S)*2/i,w=Math.cos(Z),q=Math.sin(Z)/2/it,T=1+q,ct=-2*w/T,mt=(1-q)/T,D=(1+k(S)*w)/2/T,ft=-(k(S)+w)/T,pt=D,X=0,$=0,K=0,Q=0;for(e=e*i+9,E*=i,o*=i,s*=i,f*=i,I*=500*c/i**3,U*=c/i,R*=c/i,L*=i,g=g*i|0,n*=this.volume,x=e+E+o+s+f|0;u<x;F[u++]=m*n)++ut%(rt*100|0)||(m=a?a>1?a>2?a>3?Math.sin(p*p):Math.max(Math.min(Math.tan(p),1),-1):1-(2*p/c%2+2)%2:1-4*Math.abs(Math.round(p/c)-p/c):Math.sin(p),m=(g?1-j+j*Math.sin(c*u/g):1)*k(m)*Math.abs(m)**h*(u<e?u/e:u<e+E?1-(u-e)/E*(1-W):u<e+E+o?W:u<x-f?(x-u-f)/s*W:0),m=f?m/2+(f>u?0:(u<x-f?1:(x-u)/f)*F[u-f|0]/2/n):m,S&&(m=Q=pt*X+ft*(X=$)+D*($=m)-mt*K-ct*(K=Q))),P=(r+=l+=I)*Math.cos(U*st++),p+=P+P*et*Math.sin(u**5),y&&++y>L&&(r+=R,G+=R,y=0),g&&!(++at%g)&&(r=G,l=ot,y=y||1);return F},getNote:function(n=0,t=440){return t*2**(n/12)}};var lt=[1,.05,220,0,0,.1,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0];var M=class{id;zzArray;constructor(t,r){this.zzArray=lt.map((e,o)=>r[o]??e),this.id=t}play(t,r){let e=this.zzArray.slice();return e[0]*=t.volume??1,V.play(...e)}};var b=n=>t=>typeof n=="number"?n:n(t),A=class{data;state;constructor(t){this.data=t,this.state={...t.uniforms}}send(t){Object.assign(this.data.uniforms,t)}step(){let t=[];for(let r of this.data.generators){let e=r.next(Object.assign(this.state,this.data.uniforms));if(e.done)throw new Error("NoteGenerator can never finish");e&&(Object.assign(this.state,e.value.state),e.value.notes&&t.push(...e.value.notes))}return t}pitchToFrequency(t){return this.data.root*Math.pow(2,t/this.data.notesPerOctave)}};var z=class{random=Math.random;randrange(t,r){return Math.floor(this.random()*(r-t))+t}choose(t,r){if(r){if(r.length!=t.length)throw new Error("Weights array is not the same length as values array")}else return t[this.randrange(0,t.length)];let e=r.reduce((h,l)=>h+l,0),o=this.randrange(0,e);for(var s=0,a=0;a<t.length;a++)if(s+=r[a],s>o)return t[a];throw"unreachable"}percent(t){return t>=this.randrange(1,101)}pickOne(t,r,e){let o=1/(1+Math.exp(-e));return this.choose([t,r],[1-o,o])}},N=new z;function*Y(n,t,r=4){var e=[0,0,0,0,0];let o=e.map(h=>0),s=()=>{e=e.map(h=>N.choose(n,t))};for(s();;){yield{state:{clock:o,clockBases:e,invClock:o.map((h,l)=>e[l]-h)}},o[0]++;for(var a=0;a<o.length&&o[a]>=e[a];a++)o[a]=0,a+1<o.length&&(o[a+1]++,a+1===r&&s())}}function*v(n,t){let r=[];for(var e={};;){let o=b(t)({...e,history:r});r.push(o??0),e=yield{notes:o&&o>0?[{instrument:n,volume:o,duration:1}]:[]}}}function B(n=0){return t=>t?.clock?.slice(0,n).every(r=>r===0)?1:0}function C(n,t=0){let r=B(t-1);return e=>{if(!r(e))return 0;let o=(e?.clock)[t];return(e?.clockBases)[t]*n>o?1:0}}function d(n,t=2){return r=>{let e=b(n)(r);if(!e)return;let o=e*r.clockBases.slice(t).reduce((s,a)=>s*a,1);return r.history.at(-o)}}function O(...n){return t=>{let r=n.map(s=>Array.isArray(s)?[b(s[0])(t),b(s[1])?.(t)??1]:[b(s)(t),1]),e=r.flatMap(([s,a])=>s?[s]:[]),o=r.flatMap(([s,a])=>s?[a]:[]);if(!(e.length===0||o.every(s=>s===0)))return N.choose(e,o)}}function _(...n){return t=>n.map(r=>r(t)).reduce((r,e)=>(r??0)*(e??0),1)}var dt={repetitiveness:5,beatStrength:5},gt={root:220*Math.pow(2,7/12),notesPerOctave:12,tempo:400,uniforms:dt,generators:[Y([2,3,4,5,6,7,8,9,11],[50,50,100,4,20,2,50,6,1]),v("bass",O([B(2),500],[.2,1],[0,100],[d(n=>n.clockBases?.[1],1),100],[d(n=>n.clockBases?.[2],2),50])),v("snare",O([C(.5,2),500],[.2,1],[0,10],[d(n=>n.clockBases?.[1],1),100],[d(n=>n.clockBases?.[2],2),50])),v("hi-hat",O([1,_(B(1),()=>10)],[1,_(C(.5,1),()=>10)],[0,10],[d(n=>n.clockBases?.[1],1),100],[d(n=>n.clockBases?.[2],2),50]))]},H=new A(gt),xt=[new M("snare",[2,0,660,,,.09,3,,,,,,.2,2,,,,1.1]),new M("bass",[4,0,80,,,.2,1,4,-2,6,50,.15,,6]),new M("hi-hat",[,0,3520,,,.11,3,1.65,,,,,,2])];function tt(){let n=60/H.data.tempo;H.step().forEach(r=>{r.instrument&&xt.find(e=>e.id===r.instrument)?.play(r,n)}),Mt.textContent=JSON.stringify(H.state,void 0,2),setTimeout(tt,n*1e3)}var nt=n=>document.querySelector(n),J=nt("#start"),Mt=nt("#data");J.addEventListener("click",()=>{J.remove(),tt()});
//# sourceMappingURL=ramu.js.map
