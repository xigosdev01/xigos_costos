/* ============================================================
   PERSONAL Y VENTANAS: analista/soporte, gráficas del reporte y apertura/cierre de ventanas.
   (Script clásico: comparte el ámbito global con los demás archivos de js/; el orden de carga está en index.html.)
   ============================================================ */
function staffTable(){
 const N=S.ui.N,o=calc(N,S.ui.prof,S); const trm=S.t.trm;
 const R=(n,q,usdm,note)=>`<tr><td class="l">${n}</td><td>${q}</td><td>${m(usdm)}</td><td>${m(usdm*12)}</td><td>${alt(usdm)}</td><td>${alt(usdm*12)}</td><td class="l small">${note||''}</td></tr>`;
 const no=calc(N,S.ui.prof,{...S,ui:{...S.ui,analyst:0}}), yes=calc(N,S.ui.prof,{...S,ui:{...S.ui,analyst:1}});
 const scal=S.ui.scales.map(n=>{ const a=calc(n,S.ui.prof,{...S,ui:{...S.ui,analyst:0}}), b=calc(n,S.ui.prof,{...S,ui:{...S.ui,analyst:1}}); const pc=a.total/n, pw=b.total/n;
  return `<tr><td class="l">${int(n)}</td><td>${int(b.n_analysts)}</td><td>${m(b.analyst_raw)}</td><td>${m(pc)}</td><td>${m(pw)}</td><td>${fmt(pc?((pw/pc-1)*100):0,0)} %</td><td>${m(pw*12)}</td></tr>`; }).join('');
 return `<p>${S.ui.analyst?'<b>El analista SÍ está sumado</b> al cálculo.':'El analista <b>NO está sumado</b> al cálculo; actívelo arriba para que afecte el promedio.'} ${S.g.analyst_salary_cop>0?'':'<span style="color:var(--bad)"><b>Falta escribir el sueldo mensual.</b></span>'}</p>
 <table><tr><th class="l">Cargo</th><th>Cantidad</th><th>${CU()} al mes</th><th>${CU()} al año</th><th>${CA()} al mes</th><th>${CA()} al año</th><th class="l">Nota</th></tr>
 ${R('Analista de inteligencia',o.n_analysts,o.analyst_raw,'Sueldo × factor × cantidad'+(S.ui.analyst?'':' (no incluido)'))}
 ${S.ui.sd_on?R('Soporte técnico',int(N*o.p.support_h)+' h',o.support,'Horas × tarifa'):''}${S.ui.sd_on?R('Operación (DevOps)',fmt(S.g.devops_base_h+N*S.g.devops_h_client,1)+' h',o.devops,'Horas × tarifa'):''}
 ${R('<b>TOTAL personal incluido</b>','',o.staff,'')}</table>
 <p><b>Efecto en el promedio con ${int(N)} cliente(s):</b> costo por cliente al mes sin analista <b>${usd(no.total/N)}</b>; con analista <b>${usd(yes.total/N)}</b> (aumenta ${usd(yes.total/N-no.total/N)} por cliente al mes y ${o.devices>0?' y '+usd((yes.total-no.total)/o.devices)+' por dispositivo':''}).</p>
 <h3>Cómo cambia el costo promedio según el número de clientes</h3>
 <table><tr><th class="l">Clientes</th><th>Analistas</th><th>Costo del analista ${CU()}/mes</th><th>Costo por cliente al mes SIN analista</th><th>… CON analista</th><th>Aumento</th><th>Por cliente al año CON analista</th></tr>${scal}</table>
 <p class="small">A más clientes, el sueldo se reparte entre más y el efecto por cliente baja (mientras no se contraten más analistas).</p>`;
}
MODALS.personal=()=>({title:'Personal: analista de inteligencia',html:`${repChk('personal','Incluir en el reporte: personal')}${SCEN({unit:0})}
 <div class="box info"><b>Analista de inteligencia:</b> persona que aprueba y controla las rutas y los informes de los clientes antes de que salgan. Cuando lo habilita, su sueldo se suma al costo mensual y cambia el costo promedio por cliente. <b>Soporte técnico y DevOps no se cuentan por ahora.</b></div>
 <div class="ctl">${chk('ui.analyst','<b>Incluir al analista de inteligencia en el cálculo</b>')}</div>
 <div class="fields"><label>Sueldo mensual por analista (COP)${inp('g.analyst_salary_cop',100000)}</label>
  <label>Factor sobre el sueldo (1 = solo el sueldo; use más de 1 si desea sumar prestaciones y cargas)${inp('g.analyst_factor',0.01)}</label>
  <label>Cantidad de analistas${inp('g.analyst_count',1)}</label>
  <label>Clientes que atiende cada analista (0 = usar la cantidad fija)${inp('g.analyst_per_clients',1)}</label></div>
 <h3>Soporte técnico y DevOps (por ahora NO se cuentan)</h3>
 <div class="ctl">${chk('ui.sd_on','Incluir soporte técnico y DevOps en el cálculo')}</div>
 <div class="fields"><label>Tarifa por hora (USD)${inp('g.labor_rate')}</label><label>Horas fijas de operación al mes${inp('g.devops_base_h')}</label><label>Horas de operación extra por cliente${inp('g.devops_h_client',0.05)}</label></div>
 <p class="small">Las horas de soporte por cliente y de instalación están en «Supuestos y tamaños de uso».</p>
 <h3>Resultado</h3><div id="m-staff"></div>`});
MODALS.graficas=()=>({title:'Gráficas del reporte',html:`${repChk('graficas','Incluir las gráficas en el reporte impreso')}${SCEN({N:0,prof:0,arch:0})}
 <p class="small">Marque cuáles gráficas salen en el PDF. En la pestaña «Resumen interactivo» siempre se ven todas.</p>
 ${CH.map(c=>`<label class="chk repchk" style="display:flex;align-items:flex-start;margin:6px 0"><input type="checkbox" data-b="rep.gr_${c.id}" ${bget('rep.gr_'+c.id)?'checked':''}> <span><b>${c.title}</b><br><span class="small">${c.what}${c.cond?' (solo aparece si el analista está activado)':''}</span></span></label>`).join('')}`});
let curModal=null;
function openModal(id){ const m=MODALS[id]; if(!m) return; const x=m(); curModal=id; document.getElementById('mt').textContent=x.title; document.getElementById('mbody').innerHTML=x.html;
 document.getElementById('modal').hidden=false; document.body.classList.add('modal-open'); document.getElementById('mbody').scrollTop=0; update(); }
function closeModal(){ curModal=null; document.getElementById('modal').hidden=true; document.body.classList.remove('modal-open'); document.getElementById('mbody').innerHTML=''; update(); }

/* ----- Ventana para ajustar la operación de UN cliente (km², usuarios, horas, correos…) ----- */
// Edita la operación que esté elegida en el selector. «Personalizada» es la pensada para ajustarla sin tocar los tres niveles de ejemplo.
function opFields(){
 const k=S.ui.prof;
 const rows=PROFROWS.map(([key,label,why])=>`<tr><td class="l"><b>${label}</b><div class="small">${why}</div></td><td>${inp('p.'+key+'.'+k,'any','w')}</td></tr>`).join('');
 return `<p>Está editando la operación <b>${PROF_NAMES[k]}</b>.${k<3?' <span class="small">Para no cambiar los valores de ese nivel de ejemplo, elija «Personalizada» en el selector de arriba.</span>':''}</p>
 <div class="scroll"><table><tr><th class="l">Dato de UN cliente (promedio)</th><th>Valor</th></tr>${rows}</table></div>`;
}
MODALS.operacion=()=>({title:'Operación del cliente: ajustar a su medida',html:`${SCEN({N:0,arch:0,unit:0})}
 <div class="box info"><b>Para qué sirve:</b> describe cómo usa XiGOS UN cliente promedio. Con eso se calculan las consultas a proveedores (tráfico, clima, rutas), los datos guardados y los correos. <b>No incluye cuántos dispositivos tiene</b> (se registran en las fichas de dispositivos). Para estimar el territorio en km²: largo de sus rutas (km) × ancho de la franja que quiere vigilar (km); por ejemplo, 100 km de ruta con 30 km de ancho son 3.000 km². Debajo de cada dato está de dónde sale el valor de ejemplo y cómo obtener el dato real.</div>
 <div id="op-fields">${opFields()}</div>`});