var b=r=>e=>typeof r=="number"?r:r(e),R=class{#t;state;generators;constructor(e,n){this.#t=e,this.state={},this.generators=n}send(e){Object.assign(this.#t,e)}step(){let e=[];for(let n of this.generators){let t=n.next(Object.assign(this.state,this.#t));if(t.done)throw new Error("NoteGenerator can never finish");t&&(Object.assign(this.state,t.value?.state??{}),t.value?.notes&&e.push(...t.value.notes))}return e}};function tt(r){let t=r-1;return St(10*3.1*t/G(1+G(10)*G(t)))}var St=Math.abs,G=r=>r**2,yt=4*Math.exp(-1/2)*Math.SQRT2,H=class{random=Math.random;randrange(e,n){return Math.floor(this.random()*(n-e))+e}choose(e,n){if(n){if(n.length!=e.length)throw new Error("Weights array is not the same length as values array")}else return e[this.randrange(0,e.length)];let t=n.reduce((a,c)=>a+c,0),o=this.randrange(0,t);for(var u=0,s=0;s<e.length;s++)if(u+=n[s],u>o)return e[s];throw new Error("unreachable")}percent(e){return e>=this.randrange(1,101)}pickOne(e,n,t){let o=1/(1+Math.exp(-t));return this.choose([e,n],[1-o,o])}gaussian(e,n){var t;do{var o=this.random(),u=1-this.random();t=yt*(o-1/2)/u;var s=t*t/4}while(s>-Math.log(u));return e+t*n}},k=new H;function*et(r,e=4){var n=[0,0,0,0,0];let t=[0,0,0,0,0],o=()=>{for(var c=0;c<n.length;c++)n[c]=r[c]({})};o();for(var u=0,s=yield;;){s=yield{state:{clock:t,clockBases:n,invClock:t.map((c,E)=>n[E]-c),clockRollover:u,timeSlice:60/s.tempo/n[0]}},t[0]++,u=0;for(var a=0;a<t.length&&t[a]>=n[a];a++)t[a]=0,u++,a+1<t.length&&(t[a+1]++,a+1===e&&o())}}function*nt(r,e=!0){for(yield;;)yield{state:r},e&&(r=void 0)}function*rt(r,e,n){for(var t=yield,o=n(t);;)t.clockRollover>=e&&(o=n(t)),t=yield{state:{[r]:o}}}function*F(r,e){let n=[];for(var t=yield;;){let o=e({...t,history:n});n.push(o??0),t=yield{notes:o&&o>0?[{instrument:r,volume:o,duration:1}]:[]}}}function*ot(r,e){for(var n=yield,t=n.root;;){if(n.clockRollover>=r){let o=Math.pow(2,Math.round(e(n))/n.notesPerOctave);t*=k.pickOne(o,-o,.5)}n=yield{state:{root:t}}}}var st={volume:.3,sampleRate:44100,x:new AudioContext,play:function(...r){return this.playSamples(this.buildSamples(...r))},playSamples:function(...r){let e=this.x.createBuffer(r.length,r[0].length,this.sampleRate),n=this.x.createBufferSource();return r.map((t,o)=>e.getChannelData(o).set(t)),n.buffer=e,n.connect(this.x.destination),n.start(),n},buildSamples:function(r=1,e=.05,n=220,t=0,o=0,u=.1,s=0,a=1,c=0,E=0,T=0,W=0,S=0,ct=0,Z=0,mt=0,p=0,z=1,A=0,q=0,N=0){let h=Math.PI*2,C=Et=>Et<0?-1:1,m=this.sampleRate,ht=c*=500*h/m/m,D=n*=(1+e*2*Math.random()-e)*h/m,I=[],d=0,lt=0,i=0,B=1,ft=0,pt=0,l=0,P,y,dt=2,Q=h*Math.abs(N)*2/m,_=Math.cos(Q),X=Math.sin(Q)/2/dt,O=1+X,bt=-2*_/O,gt=(1-X)/O,$=(1+C(N)*_)/2/O,Mt=-(C(N)+_)/O,xt=$,K=0,V=0,Y=0,J=0;for(t=t*m+9,A*=m,o*=m,u*=m,p*=m,E*=500*h/m**3,Z*=h/m,T*=h/m,W*=m,S=S*m|0,r*=this.volume,y=t+A+o+u+p|0;i<y;I[i++]=l*r)++pt%(mt*100|0)||(l=s?s>1?s>2?s>3?Math.sin(d*d):Math.max(Math.min(Math.tan(d),1),-1):1-(2*d/h%2+2)%2:1-4*Math.abs(Math.round(d/h)-d/h):Math.sin(d),l=(S?1-q+q*Math.sin(h*i/S):1)*C(l)*Math.abs(l)**a*(i<t?i/t:i<t+A?1-(i-t)/A*(1-z):i<t+A+o?z:i<y-p?(y-i-p)/u*z:0),l=p?l/2+(p>i?0:(i<y-p?1:(y-i)/p)*I[i-p|0]/2/r):l,N&&(l=J=xt*K+Mt*(K=V)+$*(V=l)-gt*Y-bt*(Y=J))),P=(n+=c+=E)*Math.cos(Z*lt++),d+=P+P*ct*Math.sin(i**5),B&&++B>W&&(n+=T,D+=T,B=0),S&&!(++ft%S)&&(n=D,c=ht,B=B||1);return I},getNote:function(r=0,e=440){return e*2**(r/12)}};var vt=[1,.05,220,0,0,.1,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0];var v=class{id;zzArray;constructor(e,n){this.zzArray=vt.map((t,o)=>n[o]??t),this.id=e}play(e,n){let t=this.zzArray.slice();return t[0]*=e.volume??1,st.play(...t)}};function w(r=0){return e=>+(e.clockRollover>=r)}function j(r,e=0){let n=w(e-1);return t=>{if(!n(t))return 0;let o=t.clock[e];return t.clockBases[e]*r>o?1:0}}function L(r){return e=>2-tt(Math.pow(2,-e.notesPerOctave)*r)}function g(r,e=2){let n=b(r);return t=>{let o=n(t);if(!o)return;let u=o*t.clockBases.slice(e).reduce((s,a)=>s*a,1);return t.history.at(-u)}}function M(r,e){let n=b(r),t=b(e);return o=>{let u=o.history,s=Math.round(t(o)),a=u.slice(-s),c=n(o),E=a.reduce((T,W)=>T+W,0)/a.length-c;return 1/(1+Math.exp(-E))}}function f(...r){let e=r.map(n=>Array.isArray(n)?[b(n[0]),b(n[1])]:[b(n),()=>1]);return n=>{let t=e.map(([s,a])=>[s(n),a(n)??1]),o=t.flatMap(([s,a])=>s!==void 0&&!isNaN(a)?[s]:[]),u=t.flatMap(([s,a])=>s!==void 0&&!isNaN(a)?[a]:[]);if(!(o.length===0||u.every(s=>s===0)))return k.choose(o,u)}}function x(...r){let e=r.map(b);return n=>e.map(t=>t(n)).reduce((t,o)=>(t??0)*(o??0),1)}var At={},U=new R(At,[nt({root:220*Math.pow(2,7/12),notesPerOctave:12,tempo:128}),et({0:f([4,2],[3,1]),1:f([2,50],[3,50],[4,100],[5,4],[6,20],[7,2],[8,50],[9,6],[11,1]),2:f([4,10],[5,2],[8,2]),3:f([4,10],[2,1],[6,2],[1,5]),4:()=>1}),F("bass",f([1,x(500,w(1))],[.2,1],[0,100],[M(.25,4),x(M(.25,4),20)],[g(r=>r.clockBases?.[1],1),100],[g(r=>r.clockBases?.[2],2),50])),F("snare",f([j(.5,2),500],[.2,1],[0,10],[M(.2,4),x(M(.8,4),20)],[g(r=>r.clockBases?.[1],1),100],[g(r=>r.clockBases?.[2],2),50])),F("hi-hat",f([1,x(w(1),10)],[.8,x(j(.5,1),10)],[0,10],[M(.8,4),x(M(.2,4),20)],[g(r=>r.clockBases?.[1],1),100],[g(r=>r.clockBases?.[2],2),50])),rt("notesPerOctave",4,f([12,1e3],[24,200],[31,2],[33,2],[43,3])),ot(4,f([1,L(1)],[2,L(2)],[3,L(3)]))]),Bt=[new v("snare",[2,0,660,,,.09,3,,,,,,.2,2,,,,1.1]),new v("bass",[4,0,80,,,.2,1,4,-2,6,50,.15,,6]),new v("hi-hat",[,0,3520,,,.11,3,1.65,,,,,,2])];function ut(){U.step().forEach(e=>{e.instrument&&Bt.find(n=>n.id===e.instrument)?.play(e,U.state.timeSlice)}),Wt.textContent=JSON.stringify(U.state,void 0,2),setTimeout(ut,U.state.timeSlice*1e3)}var it=r=>document.querySelector(r),at=it("#start"),Wt=it("#data");at.addEventListener("click",()=>{at.remove(),ut()});
//# sourceMappingURL=ramu.js.map
