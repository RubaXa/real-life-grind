import{i as e}from"./preload-helper-Cs4UwXAW.js";import{A as t,B as n,D as r,G as i,L as a,N as o,S as s,U as c,V as l,g as u,m as d,n as f,p,r as m,s as h,t as g}from"./iframe-VFTqNNlo.js";import{n as _,t as v}from"./lib-Oa0zH7xH.js";import{r as y,t as b}from"./builders-D_fQ1t1Z.js";var x=e((()=>{}));function S(e,i){l(i,!0);let u=f(i,`options`,27,()=>o([])),g=f(i,`value`,15,``);var _=w();h(_,21,u,e=>e.id,(e,n)=>{let i=a(()=>new y({value:()=>g()===s(n).id,onValueChange:e=>{e?g(s(n).id):g()===s(n).id&&g(``)}}));var o=C();m(o,e=>({...s(i).trigger,class:e,type:`button`,"aria-label":s(n).label}),[()=>v(`segment-option`,g()===s(n).id&&`segment-active`)],void 0,void 0,`svelte-1ygwj7i`);var l=t(o,!0);c(o),r(()=>p(l,s(n).label)),d(e,o)}),c(_),d(e,_),n()}var C,w,T=e((()=>{i(),g(),b(),_(),x(),C=u(`<button> </button>`),w=u(`<div class="segment-control svelte-1ygwj7i"></div>`),S.__docgen={data:[{name:`options`,visibility:`public`,keywords:[],kind:`let`,type:{kind:`type`,type:`array`,text:`{ id: string; label: string; }[]`},static:!1,readonly:!1,defaultValue:`...`},{name:`value`,visibility:`public`,keywords:[],kind:`let`,type:{kind:`type`,type:`string`,text:`string`},static:!1,readonly:!1,defaultValue:`...`}],name:`SegmentControl.svelte`}})),E,D,O,k,A,j;e((()=>{T(),{expect:E}=__STORYBOOK_MODULE_TEST__,D={title:`Primitives/SegmentControl`,component:S,parameters:{a11y:{test:`error`}}},O=[{id:`tasks`,label:`Задачи`},{id:`grades`,label:`Оценки`},{id:`shop`,label:`Магазин`}],k={args:{options:O,value:`tasks`},play:async({canvas:e,step:t})=>{await t(`Render contract: tasks pill has segment-active class`,async()=>{let t=e.getAllByRole(`button`);await E(t).toHaveLength(3),await E(t[0]).toHaveClass(`segment-active`),await E(t[1]).not.toHaveClass(`segment-active`),await E(t[2]).not.toHaveClass(`segment-active`)})}},A={args:{options:O,value:`shop`},play:async({canvas:e,step:t})=>{await t(`Render contract: shop pill has segment-active class`,async()=>{let t=e.getAllByRole(`button`);await E(t).toHaveLength(3),await E(t[0]).not.toHaveClass(`segment-active`),await E(t[1]).not.toHaveClass(`segment-active`),await E(t[2]).toHaveClass(`segment-active`)})}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    options,
    value: 'tasks'
  },
  play: async ({
    canvas,
    step
  }) => {
    await step('Render contract: tasks pill has segment-active class', async () => {
      const buttons = canvas.getAllByRole('button');
      await expect(buttons).toHaveLength(3);
      await expect(buttons[0]).toHaveClass('segment-active');
      await expect(buttons[1]).not.toHaveClass('segment-active');
      await expect(buttons[2]).not.toHaveClass('segment-active');
    });
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    options,
    value: 'shop'
  },
  play: async ({
    canvas,
    step
  }) => {
    await step('Render contract: shop pill has segment-active class', async () => {
      const buttons = canvas.getAllByRole('button');
      await expect(buttons).toHaveLength(3);
      await expect(buttons[0]).not.toHaveClass('segment-active');
      await expect(buttons[1]).not.toHaveClass('segment-active');
      await expect(buttons[2]).toHaveClass('segment-active');
    });
  }
}`,...A.parameters?.docs?.source}}},j=[`Morning`,`Evening`]}))();export{A as Evening,k as Morning,j as __namedExportsOrder,D as default};