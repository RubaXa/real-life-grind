import{i as e}from"./preload-helper-Cs4UwXAW.js";import{n as t,t as n}from"./Badge-D0973x1i.js";var r,i,a,o,s,c;e((()=>{t(),{expect:r}=__STORYBOOK_MODULE_TEST__,i={title:`Primitives/Badge`,component:n,parameters:{a11y:{test:`error`}}},a={args:{variant:`points`,label:`+50 ⭐`},parameters:{a11y:{config:{rules:[{id:`color-contrast`,enabled:!1}]}}},play:async({canvas:e,step:t})=>{await t(`Render contract: badge has badge-points class + label text`,async()=>{let t=e.getByText(`+50 ⭐`);await r(t).toBeInTheDocument(),await r(t).toHaveClass(`badge-points`)})}},o={args:{variant:`penalty`,label:`-10 ⭐`},parameters:{a11y:{config:{rules:[{id:`color-contrast`,enabled:!1}]}}},play:async({canvas:e,step:t})=>{await t(`Render contract: badge has badge-penalty class + label text`,async()=>{let t=e.getByText(`-10 ⭐`);await r(t).toBeInTheDocument(),await r(t).toHaveClass(`badge-penalty`)})}},s={args:{variant:`count`,label:`3`},play:async({canvas:e,step:t})=>{await t(`Render contract: badge has badge-count class + label text`,async()=>{let t=e.getByText(`3`);await r(t).toBeInTheDocument(),await r(t).toHaveClass(`badge-count`)})}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'points',
    label: '+50 ⭐'
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
    await step('Render contract: badge has badge-points class + label text', async () => {
      const badge = canvas.getByText('+50 ⭐');
      await expect(badge).toBeInTheDocument();
      await expect(badge).toHaveClass('badge-points');
    });
  }
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'penalty',
    label: '-10 ⭐'
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
    await step('Render contract: badge has badge-penalty class + label text', async () => {
      const badge = canvas.getByText('-10 ⭐');
      await expect(badge).toBeInTheDocument();
      await expect(badge).toHaveClass('badge-penalty');
    });
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'count',
    label: '3'
  },
  play: async ({
    canvas,
    step
  }) => {
    await step('Render contract: badge has badge-count class + label text', async () => {
      const badge = canvas.getByText('3');
      await expect(badge).toBeInTheDocument();
      await expect(badge).toHaveClass('badge-count');
    });
  }
}`,...s.parameters?.docs?.source}}},c=[`Points`,`Penalty`,`Count`]}))();export{s as Count,o as Penalty,a as Points,c as __namedExportsOrder,i as default};