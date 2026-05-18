import{i as e}from"./preload-helper-Cs4UwXAW.js";import{A as t,B as n,D as r,G as i,M as a,O as o,U as s,V as c,c as l,f as u,g as d,h as f,j as p,m,n as h,p as g,r as _,t as v}from"./iframe-i2m_1_zE.js";import{n as y,t as b}from"./builders-C1PCE6Yb.js";var x=e((()=>{}));function S(e,i){c(i,!0);let d=h(i,`open`,15,!1),v=h(i,`title`,3,``),b=new y({open:d(),onOpenChange:e=>d(e)});o(()=>{b.open=d()});var x=w(),S=p(x);_(S,()=>({...b.overlay,class:`modal-overlay`}),void 0,void 0,void 0,`svelte-11k3zbc`);var T=a(S,2);_(T,()=>({...b.content,class:`modal-content`}),void 0,void 0,void 0,`svelte-11k3zbc`);var E=t(T),D=t(E),O=e=>{var n=C(),i=t(n,!0);s(n),r(()=>g(i,v())),m(e,n)};l(D,e=>{v()&&e(O)}),_(a(D,2),()=>({...b.trigger,class:`modal-close`,"aria-label":`Закрыть`}),void 0,void 0,void 0,`svelte-11k3zbc`),s(E);var k=a(E,2),A=t(k),j=e=>{var t=f();u(p(t),()=>i.children),m(e,t)};l(A,e=>{i.children&&e(j)}),s(k),s(T),m(e,x),n()}var C,w,T=e((()=>{i(),v(),b(),x(),C=d(`<h2 class="modal-title svelte-11k3zbc"> </h2>`),w=d(`<div></div> <dialog><div class="modal-header svelte-11k3zbc"><!> <button>✕</button></div> <div class="modal-body svelte-11k3zbc"><!></div></dialog>`,1),S.__docgen={data:[{name:`open`,visibility:`public`,keywords:[],kind:`let`,type:{kind:`type`,type:`boolean`,text:`boolean`},static:!1,readonly:!1,defaultValue:`...`},{name:`title`,visibility:`public`,keywords:[],kind:`let`,type:{kind:`type`,type:`string`,text:`string`},static:!1,readonly:!1,defaultValue:`""`},{name:`children`,visibility:`public`,keywords:[],kind:`let`,type:{kind:`function`,text:`Snippet<[]>`},static:!1,readonly:!1}],name:`Modal.svelte`}})),E,D,O,k,A,j;e((()=>{T(),{expect:E,screen:D}=__STORYBOOK_MODULE_TEST__,O={title:`Primitives/Modal`,component:S,parameters:{a11y:{test:`error`}}},k={args:{open:!0,title:`Уведомление`},play:async({step:e})=>{await e(`Render contract: dialog is visible via screen.getByRole`,async()=>{await E(D.getByRole(`dialog`)).toBeVisible()})}},A={args:{open:!1,title:`Уведомление`},play:async({step:e})=>{await e(`Render contract: dialog is not accessible when closed`,async()=>{await E(D.queryByRole(`dialog`)).toBeNull()})}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    open: true,
    title: 'Уведомление'
  },
  play: async ({
    step
  }) => {
    await step('Render contract: dialog is visible via screen.getByRole', async () => {
      const dialog = screen.getByRole('dialog');
      await expect(dialog).toBeVisible();
    });
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    open: false,
    title: 'Уведомление'
  },
  play: async ({
    step
  }) => {
    await step('Render contract: dialog is not accessible when closed', async () => {
      await expect(screen.queryByRole('dialog')).toBeNull();
    });
  }
}`,...A.parameters?.docs?.source}}},j=[`Open`,`Closed`]}))();export{A as Closed,k as Open,j as __namedExportsOrder,O as default};