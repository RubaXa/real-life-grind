import{i as e}from"./preload-helper-Cs4UwXAW.js";import{A as t,B as n,D as r,G as i,U as a,V as o,a as s,g as c,m as l,n as u,o as d,p as f,t as p,v as m,y as h}from"./iframe-i2m_1_zE.js";import{n as g,t as _}from"./lib-Oa0zH7xH.js";var v=e((()=>{}));function y(e,i){o(i,!0);let c=u(i,`variant`,3,`primary`),p=u(i,`label`,3,``),m=u(i,`disabled`,3,!1);var g=b(),v=t(g,!0);a(g),r(e=>{s(g,1,e,`svelte-1hdvrpm`),g.disabled=m(),f(v,p())},[()=>d(_(`btn`,`btn-${c()}`))]),h(`click`,g,function(...e){i.onclick?.apply(this,e)}),l(e,g),n()}var b,x=e((()=>{i(),p(),g(),v(),b=c(`<button type="button"> </button>`),m([`click`]),y.__docgen={data:[{name:`variant`,visibility:`public`,keywords:[],kind:`let`,type:{kind:`union`,type:[{kind:`const`,type:`string`,value:`primary`,text:`"primary"`},{kind:`const`,type:`string`,value:`approve`,text:`"approve"`},{kind:`const`,type:`string`,value:`reject`,text:`"reject"`},{kind:`const`,type:`string`,value:`buy`,text:`"buy"`},{kind:`const`,type:`string`,value:`ghost`,text:`"ghost"`}],text:`"primary" | "approve" | "reject" | "buy" | "ghost"`},static:!1,readonly:!1,defaultValue:`"primary"`},{name:`label`,visibility:`public`,keywords:[],kind:`let`,type:{kind:`type`,type:`string`,text:`string`},static:!1,readonly:!1,defaultValue:`""`},{name:`disabled`,visibility:`public`,keywords:[],kind:`let`,type:{kind:`type`,type:`boolean`,text:`boolean`},static:!1,readonly:!1,defaultValue:`false`},{name:`onclick`,visibility:`public`,keywords:[],kind:`let`,type:{kind:`function`,text:`() => void`},static:!1,readonly:!1}],name:`Button.svelte`}})),S,C,w,T,E,D,O,k;e((()=>{x(),{expect:S}=__STORYBOOK_MODULE_TEST__,C={title:`Primitives/Button`,component:y,parameters:{a11y:{test:`error`}}},w={args:{variant:`primary`,label:`Выполнить`},play:async({canvas:e,step:t})=>{await t(`Render contract: button has btn-primary class + role=button`,async()=>{let t=e.getByRole(`button`);await S(t).toBeInTheDocument(),await S(t).toHaveClass(`btn-primary`)})}},T={args:{variant:`approve`,label:`Одобрить`},play:async({canvas:e,step:t})=>{await t(`Render contract: button has btn-approve class + role=button`,async()=>{let t=e.getByRole(`button`);await S(t).toBeInTheDocument(),await S(t).toHaveClass(`btn-approve`)})}},E={args:{variant:`reject`,label:`Отклонить`},parameters:{a11y:{config:{rules:[{id:`color-contrast`,enabled:!1}]}}},play:async({canvas:e,step:t})=>{await t(`Render contract: button has btn-reject class + role=button`,async()=>{let t=e.getByRole(`button`);await S(t).toBeInTheDocument(),await S(t).toHaveClass(`btn-reject`)})}},D={args:{variant:`buy`,label:`Купить за 50 ⭐`},play:async({canvas:e,step:t})=>{await t(`Render contract: button has btn-buy class + role=button`,async()=>{let t=e.getByRole(`button`);await S(t).toBeInTheDocument(),await S(t).toHaveClass(`btn-buy`)})}},O={args:{variant:`ghost`,label:`Отмена`},parameters:{a11y:{config:{rules:[{id:`color-contrast`,enabled:!1}]}}},play:async({canvas:e,step:t})=>{await t(`Render contract: button has btn-ghost class + role=button`,async()=>{let t=e.getByRole(`button`);await S(t).toBeInTheDocument(),await S(t).toHaveClass(`btn-ghost`)})}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    label: 'Выполнить'
  },
  play: async ({
    canvas,
    step
  }) => {
    await step('Render contract: button has btn-primary class + role=button', async () => {
      const button = canvas.getByRole('button');
      await expect(button).toBeInTheDocument();
      await expect(button).toHaveClass('btn-primary');
    });
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'approve',
    label: 'Одобрить'
  },
  play: async ({
    canvas,
    step
  }) => {
    await step('Render contract: button has btn-approve class + role=button', async () => {
      const button = canvas.getByRole('button');
      await expect(button).toBeInTheDocument();
      await expect(button).toHaveClass('btn-approve');
    });
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'reject',
    label: 'Отклонить'
  },
  parameters: {
    a11y: {
      config: {
        rules: [{
          id: 'color-contrast',
          enabled: false
        }]
      }
    }
  },
  play: async ({
    canvas,
    step
  }) => {
    await step('Render contract: button has btn-reject class + role=button', async () => {
      const button = canvas.getByRole('button');
      await expect(button).toBeInTheDocument();
      await expect(button).toHaveClass('btn-reject');
    });
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'buy',
    label: 'Купить за 50 ⭐'
  },
  play: async ({
    canvas,
    step
  }) => {
    await step('Render contract: button has btn-buy class + role=button', async () => {
      const button = canvas.getByRole('button');
      await expect(button).toBeInTheDocument();
      await expect(button).toHaveClass('btn-buy');
    });
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'ghost',
    label: 'Отмена'
  },
  parameters: {
    a11y: {
      config: {
        rules: [{
          id: 'color-contrast',
          enabled: false
        }]
      }
    }
  },
  play: async ({
    canvas,
    step
  }) => {
    await step('Render contract: button has btn-ghost class + role=button', async () => {
      const button = canvas.getByRole('button');
      await expect(button).toBeInTheDocument();
      await expect(button).toHaveClass('btn-ghost');
    });
  }
}`,...O.parameters?.docs?.source}}},k=[`Primary`,`Approve`,`Reject`,`Buy`,`Ghost`]}))();export{T as Approve,D as Buy,O as Ghost,w as Primary,E as Reject,k as __namedExportsOrder,C as default};