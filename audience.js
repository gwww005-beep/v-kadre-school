(() => {
  'use strict';
  const tabs=[...document.querySelectorAll('[data-age]')];
  const panel=document.querySelector('#age-panel');
  if(!tabs.length || !panel)return;
  const profiles={
    teen:{kicker:'Для подростка и родителей',title:'Проявить себя. Найти свой голос.',copy:'Хочется смелее выступать, пробовать себя перед камерой и общаться в творческой среде? Начнём с движений, игровых упражнений и позирования. Для родителей заранее объясним программу и условия.',benefits:['Упражнения на выразительность и внимание','Движение и работа перед камерой','Практика общения с партнёром']},
    young:{kicker:'Для нового опыта и собственной подачи',title:'Попробовать моделинг. Почувствовать себя в кадре.',copy:'Хотите освоить позирование, свободнее говорить о себе или сделать первый шаг в моделинге? Начнём с базы и практики, на которой можно пробовать разные роли.',benefits:['Позы и ракурсы, которые подходят вам','Походка, осанка и выразительность','Опыт выступления и самопрезентации']},
    adult:{kicker:'Для себя — среди обычных дел',title:'Выбрать время, которое принадлежит вам.',copy:'Можно прийти без планов стать моделью. Чтобы попробовать творческое занятие, познакомиться с новыми людьми и почувствовать себя свободнее перед камерой и в общении.',benefits:['Работа с осанкой и пластикой','Позирование без поиска «идеальной» внешности','Творческая практика и новые знакомства']},
    mature:{kicker:'Для нового взгляда на себя',title:'Выйти из привычной роли. Попробовать другую.',copy:'Если давно хотелось оказаться перед камерой, освоить красивую подачу или попробовать актёрские упражнения — опыт можно получить сейчас. Начнём с понятных заданий и обсудим комфортный темп.',benefits:['Осанка, походка и выразительность','Новые ракурсы и опыт перед камерой','Практика самопрезентации в группе']},
    silver:{kicker:'Для творчества, движения и общения',title:'Добавить в жизнь ещё один интересный сюжет.',copy:'Новая практика, люди и возможность проявить себя. Попробуем движение, позирование и актёрские упражнения. На знакомстве обсудим ваши задачи и подходящий формат занятий.',benefits:['Движение и работа с подачей','Возможность попробовать себя в кадре','Живое общение и творческие упражнения']}
  };
  const select=(tab,focus=false)=>{
    const p=profiles[tab.dataset.age];if(!p)return;
    tabs.forEach(button=>{const active=button===tab;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;});
    panel.setAttribute('aria-labelledby',tab.id);
    document.querySelector('#age-kicker').textContent=p.kicker;
    document.querySelector('#age-title').textContent=p.title;
    document.querySelector('#age-copy').textContent=p.copy;
    document.querySelector('#age-benefits').replaceChildren(...p.benefits.map(value=>{const li=document.createElement('li');li.textContent=value;return li;}));
    if(focus)tab.focus();
  };
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>select(tab));
    tab.addEventListener('keydown',event=>{
      let next=index;
      if(event.key==='ArrowRight')next=(index+1)%tabs.length;
      else if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;
      else if(event.key==='Home')next=0;
      else if(event.key==='End')next=tabs.length-1;
      else return;
      event.preventDefault();select(tabs[next],true);
    });
  });
})();
