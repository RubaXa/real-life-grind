import{i as e}from"./preload-helper-Cs4UwXAW.js";import{A as t,D as n,G as r,L as i,M as a,S as o,U as s,_ as c,a as l,g as u,i as d,m as f,n as p,o as m,t as h}from"./iframe-i2m_1_zE.js";import{n as g,t as _}from"./Badge-D0973x1i.js";function v(e,t){let r=p(t,`size`,3,24),i=p(t,`class`,3,``),a=p(t,`ariaLabel`,3,`Звезда`);var o=y();n(()=>{d(o,`width`,r()),d(o,`height`,r()),d(o,`aria-label`,a()),l(o,0,m(i()))}),f(e,o)}var y,b=e((()=>{r(),h(),y=c(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" role="img"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>`),v.__docgen={data:[{name:`size`,visibility:`public`,keywords:[],kind:`let`,type:{kind:`type`,type:`number`,text:`number`},static:!1,readonly:!1,defaultValue:`24`},{name:`class`,visibility:`public`,keywords:[],kind:`let`,type:{kind:`type`,type:`string`,text:`string`},static:!1,readonly:!1},{name:`ariaLabel`,visibility:`public`,keywords:[],kind:`let`,type:{kind:`type`,type:`string`,text:`string`},static:!1,readonly:!1,defaultValue:`"Звезда"`}],name:`Star.svelte`}})),x=e((()=>{}));function S(e,n){let r=p(n,`points`,3,0),c=i(()=>String(r()));var l=C(),u=t(l);v(u,{size:16,class:`points-badge__icon`}),_(a(u,2),{variant:`points`,get label(){return o(c)}}),s(l),f(e,l)}var C,w=e((()=>{r(),h(),g(),b(),x(),C=u(`<span class="points-badge svelte-10phm26"><!> <!></span>`),S.__docgen={data:[{name:`points`,visibility:`public`,keywords:[],kind:`let`,type:{kind:`type`,type:`number`,text:`number`},static:!1,readonly:!1,defaultValue:`0`}],name:`PointsBadge.svelte`}})),T,E,D,O,k,A;e((()=>{w(),{expect:T}=__STORYBOOK_MODULE_TEST__,E={title:`Components/PointsBadge`,component:S,parameters:{a11y:{test:`error`}}},D={args:{points:240},parameters:{a11y:{config:{rules:[{id:`color-contrast`,enabled:!1}]}}},play:async({canvas:e,step:t})=>{await t(`Render contract: points=240 text + star visible + role=img`,async()=>{await T(e.getByText(`240`)).toBeInTheDocument(),await T(e.getByRole(`img`,{name:`Звезда`})).toBeVisible()})}},O={args:{points:9999},parameters:{a11y:{config:{rules:[{id:`color-contrast`,enabled:!1}]}}},play:async({canvas:e,step:t})=>{await t(`Render contract: points=9999 text + star visible + role=img`,async()=>{await T(e.getByText(`9999`)).toBeInTheDocument(),await T(e.getByRole(`img`,{name:`Звезда`})).toBeVisible()})}},k={args:{points:0},play:async({canvas:e,step:t})=>{await t(`Render contract: points=0 text + star visible + role=img`,async()=>{await T(e.getByText(`0`)).toBeInTheDocument(),await T(e.getByRole(`img`,{name:`Звезда`})).toBeVisible()})}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    points: 240
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
    await step('Render contract: points=240 text + star visible + role=img', async () => {
      const text = canvas.getByText('240');
      await expect(text).toBeInTheDocument();
      const star = canvas.getByRole('img', {
        name: 'Звезда'
      });
      await expect(star).toBeVisible();
    });
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    points: 9999
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
    await step('Render contract: points=9999 text + star visible + role=img', async () => {
      const text = canvas.getByText('9999');
      await expect(text).toBeInTheDocument();
      const star = canvas.getByRole('img', {
        name: 'Звезда'
      });
      await expect(star).toBeVisible();
    });
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    points: 0
  },
  play: async ({
    canvas,
    step
  }) => {
    await step('Render contract: points=0 text + star visible + role=img', async () => {
      const badge = canvas.getByText('0');
      await expect(badge).toBeInTheDocument();
      const star = canvas.getByRole('img', {
        name: 'Звезда'
      });
      await expect(star).toBeVisible();
    });
  }
}`,...k.parameters?.docs?.source}}},A=[`Default`,`LargeNumber`,`Empty`]}))();export{D as Default,k as Empty,O as LargeNumber,A as __namedExportsOrder,E as default};