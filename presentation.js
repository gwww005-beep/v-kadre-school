(() => {
 const list=document.querySelector('.module-tabs');
 if(!list)return;
 const cards=[...document.querySelectorAll('.module-card')];
 const mobile=matchMedia('(max-width:620px)');
 let current=0;
 const select=(index,focus=false)=>{current=index;render();if(focus)list.children[index].focus();};
 cards.forEach((card,index)=>{
  card.id='module-panel-'+index;
  const b=document.createElement('button');b.type='button';b.id='module-tab-'+index;b.textContent=card.dataset.module;
  b.setAttribute('role','tab');b.setAttribute('aria-controls',card.id);list.append(b);
  b.addEventListener('click',()=>select(index));
  b.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(index+1)%cards.length;if(e.key==='ArrowLeft')next=(index+cards.length-1)%cards.length;if(e.key==='Home')next=0;if(e.key==='End')next=cards.length-1;if(next===undefined)return;e.preventDefault();select(next,true);});
 });
 function render(){list.hidden=!mobile.matches;cards.forEach((card,i)=>{card.hidden=mobile.matches&&i!==current;list.children[i].setAttribute('aria-selected',String(i===current));list.children[i].tabIndex=i===current?0:-1;if(mobile.matches){card.setAttribute('role','tabpanel');card.setAttribute('aria-labelledby','module-tab-'+i);}else{card.removeAttribute('role');card.removeAttribute('aria-labelledby');}});}
 mobile.addEventListener('change',render);render();
})();
