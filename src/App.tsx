"use client";

import { useMemo, useState } from "react";

type Outcome = { title: string; short: string; detail: string; grade: string; boost: [string, number]; eliminated?: boolean };
type Stage = { id: string; label: string; question: string; options: Outcome[] };

const stages: Stage[] = [
  { id:"potential", label:"POTENCIAL", question:"Que tipo de jogador nasceu dentro de você?", options:[
    {title:"GÊNIO",short:"Muta o futebol",detail:"Você possui uma anomalia única. O mundo precisa se adaptar ao seu talento, não o contrário.",grade:"SS",boost:["Ego",18]},
    {title:"TALENTOSO",short:"Aprende e domina",detail:"Sua leitura e capacidade de reproduzir técnicas transformam experiência em evolução acelerada.",grade:"S",boost:["Visão",14]},
    {title:"RAÇUDO",short:"Recusa-se a morrer",detail:"Nada veio fácil. Você constrói cada arma no limite e supera talentos através de obsessão pura.",grade:"A",boost:["Físico",15]},
  ]},
  { id:"position", label:"POSIÇÃO", question:"Onde o seu ego destrói melhor uma defesa?", options:[
    {title:"CENTROAVANTE",short:"Finalizador central",detail:"Você vive entre os zagueiros e converte a menor brecha em gol.",grade:"ST",boost:["Chute",15]},
    {title:"PONTA DIREITA",short:"Ameaça invertida",detail:"Parte da direita, corta por dentro e força a defesa a escolher como será destruída.",grade:"RW",boost:["Velocidade",13]},
    {title:"PONTA ESQUERDA",short:"Isolador letal",detail:"Você caça duelos no corredor e invade a área no ponto cego do lateral.",grade:"LW",boost:["Drible",13]},
    {title:"SEGUNDO ATACANTE",short:"Caçador de espaços",detail:"Flutua atrás do nove, conecta jogadas e aparece onde ninguém consegue acompanhá-lo.",grade:"SS",boost:["Visão",12]},
    {title:"MEIA-ATACANTE",short:"Cérebro ofensivo",detail:"Controla o último terço e transforma o movimento dos outros em suas próprias oportunidades.",grade:"CAM",boost:["Passe",14]},
  ]},
  { id:"ego", label:"EGO", question:"Qual desejo governa o seu futebol?", options:[
    {title:"PROTAGONISMO ABSOLUTO",short:"Ego individualista",detail:"Você precisa ser o autor do gol decisivo. Uma vitória sem o seu nome parece uma derrota.",grade:"S",boost:["Ego",16]},
    {title:"LIBERDADE IMPREVISÍVEL",short:"Ego livre",detail:"Seu melhor futebol nasce quando o campo deixa de impor respostas e você inventa uma nova.",grade:"A",boost:["Drible",14]},
    {title:"DESTRUIR O MAIS FORTE",short:"Ego restritivo",detail:"Quanto maior o obstáculo, mais cruel você fica. Seu prazer é esmagar o símbolo de superioridade.",grade:"S",boost:["Físico",13]},
    {title:"CONTROLAR O CAMPO",short:"Ego de mundo",detail:"Você deseja que os vinte e um jogadores se movam conforme a história que enxerga.",grade:"SS",boost:["Visão",17]},
  ]},
  { id:"style", label:"ESTILO", question:"Como você transforma posse em ameaça?", options:[
    {title:"FINALIZADOR PREDATÓRIO",short:"Poucos toques, muitos gols",detail:"Economiza movimentos até encontrar o segundo exato de atacar a última linha.",grade:"S",boost:["Chute",16]},
    {title:"DRIBLADOR CAÓTICO",short:"Duelos e improviso",detail:"Quebra sistemas vencendo um corpo por vez, sem repetir o mesmo ritmo duas vezes.",grade:"S",boost:["Drible",17]},
    {title:"ARMADOR DEVORADOR",short:"Leitura e manipulação",detail:"Usa aliados e rivais como peças, cria a jogada e chega para terminá-la.",grade:"SS",boost:["Visão",17]},
    {title:"TANQUE DE PRESSÃO",short:"Contato e imposição",detail:"Protege a bola, arrasta a marcação e abre o campo na força bruta.",grade:"A",boost:["Físico",18]},
    {title:"VELOCISTA VERTICAL",short:"Ataque à profundidade",detail:"Uma passada muda o lance. Você joga no limite da linha e transforma espaço em pânico.",grade:"S",boost:["Velocidade",18]},
  ]},
  { id:"weapon", label:"ARMA INICIAL", question:"Qual arma garante a sua sobrevivência?", options:[
    {title:"CHUTE DIRETO",short:"Finalização sem domínio",detail:"Converte cruzamentos, sobras e passes rápidos antes que a defesa reorganize o corpo.",grade:"A",boost:["Chute",16]},
    {title:"DRIBLE ELÁSTICO",short:"Mudança de centro",detail:"Seu tronco vende uma direção enquanto os pés já atacam a outra.",grade:"A",boost:["Drible",16]},
    {title:"DOMÍNIO MORTAL",short:"Primeiro toque perfeito",detail:"Você mata qualquer passe em uma posição que já prepara a próxima ação.",grade:"S",boost:["Domínio",17]},
    {title:"PASSE DE RUPTURA",short:"Perfura linhas",detail:"Sua bola atravessa o espaço entre defensor e intenção.",grade:"A",boost:["Passe",15]},
    {title:"ACELERAÇÃO EXPLOSIVA",short:"Primeiros metros",detail:"Antes do marcador reagir, a disputa já ficou para trás.",grade:"S",boost:["Velocidade",17]},
  ]},
  { id:"first", label:"1ª SELEÇÃO", question:"O primeiro teste separa sonho de sobrevivência", options:[
    {title:"ARTILHEIRO DO BLOCO",short:"Classificado em 1º",detail:"Você assumiu o ataque do time e saiu da primeira seleção como a ameaça que todos memorizam.",grade:"S",boost:["Chute",14]},
    {title:"REAÇÃO QUÍMICA",short:"Classificado em equipe",detail:"Seu ego encontrou outro ego compatível e os dois destruíram o equilíbrio do bloco.",grade:"A",boost:["Passe",12]},
    {title:"GOL NO ÚLTIMO SEGUNDO",short:"Classificado no limite",detail:"Com a eliminação a um toque de distância, você escolheu chutar — e sobreviveu.",grade:"S",boost:["Ego",15]},
    {title:"ELIMINADO",short:"Rank 274",detail:"Sua arma não evoluiu a tempo. A porta do Blue Lock se fecha e a sua jornada termina aqui.",grade:"X",boost:["Ego",0],eliminated:true},
  ]},
  { id:"second", label:"2ª SELEÇÃO", question:"Agora, até seus aliados podem ser roubados", options:[
    {title:"VOCÊ DEVOROU UM GÊNIO",short:"Classificado 4–3",detail:"No lance final, usou a maior arma do rival contra ele e conquistou o jogador que faltava.",grade:"SS",boost:["Ego",18]},
    {title:"ESCOLHIDO PELO RIVAL",short:"Derrota com promoção",detail:"Seu time perdeu, mas o vencedor reconheceu que o seu ego era indispensável.",grade:"A",boost:["Visão",13]},
    {title:"NOVO TRIO DOMINANTE",short:"Sequência perfeita",detail:"Três egos incompatíveis encontraram uma fórmula de gols que ninguém conseguiu decifrar.",grade:"S",boost:["Passe",15]},
    {title:"ELIMINADO",short:"Sem ninguém para escolhê-lo",detail:"Depois da última derrota, nenhum rival viu valor suficiente para roubar você. Fim de projeto.",grade:"X",boost:["Ego",0],eliminated:true},
  ]},
  { id:"u20", label:"BLUE LOCK XI", question:"Você conquistou espaço contra o Japão Sub-20?", options:[
    {title:"TITULAR E DECISIVO",short:"Participação em gol",detail:"Você começou entre os onze e alterou o placar no maior jogo da sua vida.",grade:"SS",boost:["Ego",18]},
    {title:"CORINGA DO SEGUNDO TEMPO",short:"Mudou a partida",detail:"Entrou quando o sistema travou e criou o caos que o Blue Lock precisava.",grade:"S",boost:["Drible",14]},
    {title:"RESERVA APROVADO",short:"Convocado para a NEL",detail:"Não entrou em campo, mas seus números nos treinos preservaram uma última oportunidade.",grade:"B",boost:["Domínio",9]},
    {title:"ELIMINADO",short:"Fora dos 35",detail:"Ego escolheu outros nomes. Sem vaga na fase seguinte, sua carreira no Blue Lock termina.",grade:"X",boost:["Ego",0],eliminated:true},
  ]},
  { id:"club", label:"CLUBE NEL", question:"Qual filosofia remodela o seu futebol?", options:[
    {title:"BASTARD MÜNCHEN",short:"Alemanha • Racionalidade",detail:"O ambiente exige números, lógica e a capacidade brutal de provar seu valor em cada jogada.",grade:"BM",boost:["Visão",14]},
    {title:"PARIS X GEN",short:"França • Talento",detail:"Você é lançado entre monstros e prodígios para descobrir qual talento consegue tomar o centro.",grade:"PXG",boost:["Ego",15]},
    {title:"UBERS",short:"Itália • Estratégia",detail:"Cada movimento recebe uma função. Você aprende a vencer através de planos e transições fatais.",grade:"UB",boost:["Físico",13]},
    {title:"MANSHINE CITY",short:"Inglaterra • Corpo",detail:"Seu físico é reconstruído ao redor da sua arma ideal, aumentando tudo que já o tornava especial.",grade:"MC",boost:["Velocidade",15]},
    {title:"FC BARCHA",short:"Espanha • Criatividade",detail:"A liberdade técnica remove seus limites e transforma prazer em futebol imprevisível.",grade:"FCB",boost:["Drible",15]},
  ]},
  { id:"evolution", label:"EVOLUÇÃO", question:"Em que a sua arma se transforma?", options:[
    {title:"CHUTE IMPOSSÍVEL",short:"Arma evoluída",detail:"Seu disparo agora funciona sob pressão, sem equilíbrio e em ângulos que deveriam estar mortos.",grade:"SS",boost:["Chute",20]},
    {title:"DRIBLE SEM CENTRO",short:"Arma evoluída",detail:"Seu corpo elimina o próprio eixo. O marcador não encontra referência para antecipar você.",grade:"SS",boost:["Drible",20]},
    {title:"DOMÍNIO CRIATIVO",short:"Arma evoluída",detail:"Cada recepção se torna uma finta, um passe ou uma preparação de chute diferente.",grade:"S",boost:["Domínio",19]},
    {title:"VELOCIDADE DE ARRANCADA",short:"Arma evoluída",detail:"Você identifica a pausa do defensor e explode dentro dela antes que o espaço desapareça.",grade:"S",boost:["Velocidade",20]},
    {title:"PASSE REFLEXIVO",short:"Arma evoluída",detail:"Você conecta com o movimento do atacante antes mesmo de ele entender a própria corrida.",grade:"S",boost:["Passe",19]},
  ]},
  { id:"metavision", label:"META-VISÃO", question:"Sua leitura alcança o campo inteiro?", options:[
    {title:"META-VISÃO DESPERTA",short:"Visão periférica total",detail:"Você coleta movimentos com a visão periférica e atualiza o futuro do lance continuamente.",grade:"SS",boost:["Visão",22]},
    {title:"OLHAR DO PREDADOR",short:"Leitura do goleiro",detail:"Você não domina todo o campo, mas enxerga a microbrecha exata para finalizar.",grade:"S",boost:["Chute",18]},
    {title:"INSTINTO PURO",short:"Sem Meta-Visão",detail:"Seu futebol rejeita cálculos. Você alcança o Flow confiando em sensações que ninguém consegue copiar.",grade:"A",boost:["Drible",15]},
    {title:"VISÃO EM DESENVOLVIMENTO",short:"Meta-Visão incompleta",detail:"Você percebe as peças, mas ainda perde informações quando a pressão sobe.",grade:"B",boost:["Visão",10]},
  ]},
  { id:"status", label:"STATUS FINAL", question:"Que jogador saiu do outro lado do projeto?", options:[
    {title:"NEW GEN WORLD XI",short:"Status mundial",detail:"Seu valor rompeu a barreira da promessa. Você agora está entre os onze maiores talentos da nova geração.",grade:"SSS",boost:["Ego",24]},
    {title:"ÁS DA SELEÇÃO SUB-20",short:"Titular absoluto",detail:"O Japão veste o seu número nas arquibancadas. O ataque da seleção começa e termina no seu ego.",grade:"SS",boost:["Chute",20]},
    {title:"PROFISSIONAL EUROPEU",short:"Contrato internacional",detail:"Você conquistou uma proposta e inicia a carreira profissional dentro de um gigante europeu.",grade:"S",boost:["Domínio",17]},
    {title:"RESERVA DA SELEÇÃO",short:"Ainda evoluindo",detail:"Você sobreviveu e está no elenco, mas a batalha para tomar uma vaga só começou.",grade:"A",boost:["Físico",12]},
  ]},
];

const baseStats: Record<string,number> = {Chute:48,Drible:48,Passe:45,Domínio:47,Velocidade:49,Visão:46,Físico:50,Ego:55};
const colors = ["#165dff","#071b54","#d7ff00","#202632","#603cff"];

export default function App(){
  const [name,setName]=useState("VROK");
  const [results,setResults]=useState<Record<string,Outcome>>({});
  const [active,setActive]=useState(0);
  const [spinning,setSpinning]=useState(false);
  const [rotation,setRotation]=useState(0);
  const eliminatedIndex=stages.findIndex(s=>results[s.id]?.eliminated);
  const ended=eliminatedIndex>=0;
  const completed=!ended&&Object.keys(results).length===stages.length;
  const current=stages[active];
  const stats=useMemo(()=>{const next={...baseStats};Object.values(results).forEach(r=>next[r.boost[0]]=Math.min(99,(next[r.boost[0]]||45)+r.boost[1]));return next},[results]);
  const overall=Math.round(Object.values(stats).reduce((a,b)=>a+b,0)/Object.values(stats).length);
  const wheelBackground=`conic-gradient(${current.options.map((_,i)=>`${colors[i%colors.length]} ${i*100/current.options.length}% ${(i+1)*100/current.options.length}%`).join(",")})`;
  function reset(){setResults({});setActive(0);setRotation(0);setSpinning(false)}
  function roll(){if(spinning||ended)return;const chosen=Math.floor(Math.random()*current.options.length);setSpinning(true);setRotation(old=>old+1440+(360-chosen*(360/current.options.length))+Math.floor(Math.random()*20));setTimeout(()=>{setResults(old=>({...old,[current.id]:current.options[chosen]}));setSpinning(false)},2300)}
  function next(){if(active<stages.length-1&&!ended)setActive(active+1)}
  function fullJourney(){const all:Record<string,Outcome>={};let stop=stages.length-1;for(let i=0;i<stages.length;i++){const s=stages[i];const chosen=s.options[Math.floor(Math.random()*s.options.length)];all[s.id]=chosen;if(chosen.eliminated){stop=i;break}}setResults(all);setActive(stop);setRotation(old=>old+1800)}
  return <main>
    <header className="topbar"><a className="brand" href="#top"><span className="brandMark">E</span><span>EGOIST<br/><b>ROULETTE</b></span></a><div className="status"><i/> CAREER SIMULATION // ONLINE</div><button className="ghost" onClick={reset}>NOVA JORNADA ↗</button></header>
    <section id="top" className="hero"><div className="heroCopy"><p className="label">BLUE LOCK // EGO GENERATOR</p><h1>GIRE.<br/><em>DEVORE.</em><br/>EVOLUA.</h1><p className="intro">Uma carreira inteira decidida pela roleta. Seu potencial, ego, armas, clube, evolução e destino dentro do Blue Lock.</p><label className="nameField">CODINOME<input value={name} maxLength={18} onChange={e=>setName(e.target.value.toUpperCase())}/></label><button className="primary" onClick={fullJourney}>SIMULAR JORNADA COMPLETA <span>↗</span></button></div><div className="heroVisual" aria-hidden="true"><div className="target t1"/><div className="target t2"/><div className="slash"/><div className="playerNo">299</div><div className="egoWord">EGO</div><div className="silhouette"><span className="head"/><span className="body"/><span className="leg l"/><span className="leg r"/></div><div className="scanline">CALCULATING EGO — NO SECOND CHANCES</div></div></section>
    <section className="journey"><div className="sectionHead"><div><p className="label">CAREER ROULETTE</p><h2>SUA JORNADA</h2></div><p>Gire uma etapa por vez. Se você for eliminado, a roleta para e tudo que viria depois permanece bloqueado.</p></div><div className="progress">{stages.map((s,i)=><button key={s.id} className={`${active===i?"active":""} ${results[s.id]?"done":""}`} disabled={spinning||(ended&&i>eliminatedIndex)} onClick={()=>setActive(i)}><small>{String(i+1).padStart(2,"0")}</small><span>{s.label}</span><b>{results[s.id]?.eliminated?"×":results[s.id]?"✓":"·"}</b></button>)}</div>
      <div className="roulettePanel"><div className="stageInfo"><p className="label">ETAPA {String(active+1).padStart(2,"0")} / {stages.length}</p><h3>{current.label}</h3><p>{current.question}</p>{ended?<div className="eliminatedMsg">JORNADA ENCERRADA<br/><small>Você foi eliminado do Blue Lock.</small></div>:<button className="primary" disabled={spinning} onClick={roll}>{spinning?"GIRANDO...":results[current.id]?"GIRAR NOVAMENTE":"GIRAR ROLETA"}<span>↻</span></button>}</div>
        <div className="wheelArea"><div className="pointer">▼</div><div className="wheel" style={{background:wheelBackground,transform:`rotate(${rotation}deg)`}}>{current.options.map((o,i)=><span key={o.title} style={{transform:`translate(-50%,-50%) rotate(${i*360/current.options.length+180/current.options.length}deg) translateY(-135px)`}}>{o.title}</span>)}<b>EGO</b></div></div>
        <div className={`resultCard ${results[current.id]?"revealed":"empty"} ${results[current.id]?.eliminated?"lost":""}`}>{results[current.id]?<><div className="resultTop"><span>{results[current.id].short}</span><b>{results[current.id].grade}</b></div><h4>{results[current.id].title}</h4><p>{results[current.id].detail}</p>{results[current.id].eliminated?<div className="endStamp">BLUE LOCK // ELIMINADO</div>:<><div className="boost">▲ +{results[current.id].boost[1]} {results[current.id].boost[0]}</div>{active<stages.length-1&&<button className="nextBtn" onClick={next}>PRÓXIMA ETAPA →</button>}</>}</>:<><div className="lock">?</div><h4>DESTINO BLOQUEADO</h4><p>Gire a roleta para revelar esta parte da sua carreira.</p></>}</div></div>
    </section>
    <section className="profile"><div className="profileTitle"><p className="label">PLAYER FILE // {ended?"ELIMINATED":completed?"COMPLETE":"IN PROGRESS"}</p><h2>{name||"SEM NOME"}</h2><span>{results.position?.title||"POSIÇÃO DESCONHECIDA"} • {results.potential?.title||"POTENCIAL NÃO AVALIADO"}</span></div><div className="overall"><small>OVERALL</small><strong>{overall}</strong><span>{ended?"ELIMINADO":overall>=85?"WORLD CLASS":overall>=75?"ELITE":"PROSPECT"}</span></div><div className="stats">{Object.entries(stats).map(([k,v])=><div key={k}><span>{k}</span><b>{v}</b><i><u style={{width:`${v}%`}}/></i></div>)}</div><div className="summary"><p className="label">DOSSIÊ</p><div><span>EGO</span><b>{results.ego?.title||"—"}</b></div><div><span>ESTILO</span><b>{results.style?.title||"—"}</b></div><div><span>ARMA</span><b>{results.weapon?.title||"—"}</b></div><div><span>EVOLUÇÃO</span><b>{results.evolution?.title||"—"}</b></div><div><span>CLUBE</span><b>{results.club?.title||"—"}</b></div><div><span>META-VISÃO</span><b>{results.metavision?.title||"—"}</b></div><div><span>STATUS</span><b>{ended?"ELIMINADO":results.status?.title||"—"}</b></div></div></section>
    <footer><span>EGOIST ROULETTE</span><p>O maior egoísta do mundo só existe enquanto continuar sobrevivendo.</p><small>UNOFFICIAL FAN EXPERIENCE</small></footer>
  </main>
}
