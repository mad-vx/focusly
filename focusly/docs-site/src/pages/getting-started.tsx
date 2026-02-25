import React from 'react';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';

export default function GettingStartedPage() {
  return (
    <Layout title="Getting Started" description="Getting started with Focusly for Angular">
      <main style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
        <h1>Getting Started with Focusly</h1>

        <hr />

        <h2>1. Register a Focus Target</h2>

        <p>
          Add the <code>focusly-focus</code> directive to any focusable element.
        </p>
        <p>
          Each target must have a <code>focuslyElementId</code> for programmatic focus.
        </p>

        <CodeBlock language="html">{`
<div [focuslyGroupHost]="1">
  <input
    focusly-focus
    [focuslyElementId]="'firstName'"
    placeholder="First name"
  />

  <input
    focusly-focus
    [focuslyElementId]="'lastName'"
    placeholder="Last name"
  />

  <button
    focusly-focus
    [focuslyElementId]="'saveBtn'"
  >
    Save
  </button>
</div>
        `}</CodeBlock>

        <p>
          The optional <code>focuslyGroupHost</code> directive provides a default group for targets
          inside the container (targets can also set <code>focuslyGroup</code> directly).
        </p>

        <hr />

        <h2>2. Programmatic Focus</h2>

        <p>
          Inject the <code>FOCUSLY_SERVICE_API</code> and request focus using <code>setFocusByElementId</code>.
        </p>

        <CodeBlock language="ts">{`
import { Component, inject } from '@angular/core';
import { FOCUSLY_SERVICE_API } from '@zaybu/focusly';

@Component({
  standalone: true,
  template: \`
    <button (click)="focusSave()">Focus Save</button>
  \`
})
export class DemoComponent {
  private readonly focuslyService = inject(FOCUSLY_SERVICE_API);

  focusSave() {
    // If your button is in group 1, you can optionally pass the group:
    // this.focuslyService.setFocusByElementId('saveBtn', 1);

    this.focuslyService.setFocusByElementId('saveBtn');
  }
}
        `}</CodeBlock>

        <hr />

        <h2>3. Keyboard Navigation</h2>

        <p>
          Use the <code>focusly</code> directive when you want keyboard navigation. It extends{' '}
          <code>focusly-focus</code> and adds <code>focuslyRow</code> + <code>focuslyColumn</code>
          so Focusly can move around your layout with defined keys.
        </p>
        <p>
            Optionally use <code>focuslyElementId</code> for programmatic focus.
        </p>
        <CodeBlock language="html">{`
<select
  focusly
  [focuslyGroup]="1"
  [focuslyRow]="2"
  [focuslyColumn]="3"
>
  <option>Buy</option>
  <option>Sell</option>
</select>
        `}</CodeBlock>

        <p>
          Tip: If you use <code>focuslyGroupHost</code> you can omit <code>focuslyGroup</code> on each element.
        </p>

        <hr />

        <h2>4. Keyboard Shortcuts</h2>

        <p>
          Focusly shortcuts are declared with <code>focuslyShortcut</code>, and captured by a
          container using <code>focuslyShortcutHost</code>.
        </p>

        <h3>Shortcut host</h3>
        <p>
          Add <code>focuslyShortcutHost</code> to a container that should listen for shortcut key presses
          (it listens on <code>keydown</code> using capture).
        </p>

        <CodeBlock language="html">{`
<div [focuslyGroupHost]="1" focuslyShortcutHost>
  ...
</div>
        `}</CodeBlock>

        <h3>Group-scoped shortcut (default scope)</h3>
        <p>
          The default scope for <code>focuslyShortcut</code> is <code>'group'</code>. If you don’t provide{' '}
          <code>focuslyGroup</code> on the shortcut, the host/group host group is used.
        </p>

        <CodeBlock language="html">{`
<div
  [focuslyGroupHost]="1"
  focuslyShortcutHost
  focuslyShortcut
  [focuslyKey]="'enter'"
  (focuslyAction)="onEnterKey($event)"
>
  ...
</div>
        `}</CodeBlock>

        <h3>Global shortcut</h3>
        <p>
          Global shortcuts work regardless of the active group.
        </p>

        <CodeBlock language="html">{`
<div focuslyShortcutHost>
  <button
    focuslyShortcut
    [focuslyKey]="'ctrl+k'"
    [focuslyShortcutScope]="'global'"
    (focuslyAction)="openCommandPalette($event)"
  >
    Command Palette
  </button>
</div>
        `}</CodeBlock>

        <h3>Element-scoped shortcut</h3>
        <p>
          Element shortcuts require an <code>elementId</code>. You can provide it explicitly via{' '}
          <code>focuslyElementId</code>.
        </p>

        <CodeBlock language="html">{`
<input
  focusly-focus
  [focuslyGroup]="1"
  [focuslyElementId]="'searchBox'"
/>

<button
  focuslyShortcut
  [focuslyKey]="'escape'"
  [focuslyShortcutScope]="'element'"
  [focuslyElementId]="'searchBox'"
  (focuslyAction)="clearSearch($event)"
>
  Clear search
</button>
        `}</CodeBlock>

        <h3>Prevent shortcuts while typing</h3>
        <p>
          Use <code>focuslyPreventInTextActions</code> to prevent a shortcut triggering while the user is typing in
          an input/textarea/contenteditable.
        </p>

        <CodeBlock language="html">{`
<div
  [focuslyGroupHost]="1"
  focuslyShortcutHost
  focuslyShortcut
  [focuslyKey]="'enter'"
  [focuslyPreventInTextActions]="true"
  (focuslyAction)="submit($event)"
>
  ...
</div>
        `}</CodeBlock>

        <h3>Priority</h3>
        <p>
          If multiple shortcuts match the same key chord in the same scope, Focusly uses the highest{' '}
          <code>focuslyPriority</code>.
        </p>

        <CodeBlock language="html">{`
<button
  focuslyShortcut
  [focuslyKey]="'enter'"
  [focuslyShortcutScope]="'global'"
  [focuslyPriority]="10"
  (focuslyAction)="doImportantThing($event)"
>
  Important action
</button>
        `}</CodeBlock>


<hr />

<h2>Tab Navigation with Shortcuts</h2>

<p>
  Focusly works well with dynamic UI such as tab systems.  
  In this example (using NgZorro <code>nz-tabs</code>), each tab is assigned its own group,
  and <code>Alt + 1–5</code> switches tabs and focuses the first field inside the tab.
</p>

<h3>Template</h3>

<CodeBlock language="html">{`
<nz-tabs
  [focuslyGroupHost]="3"
  focuslyShortcutHost
  [focuslyShortcuts]="focuslyShortcuts"
  [nzSelectedIndex]="selectedIndex()"
  (nzSelectedIndexChange)="selectedIndex.set($event)"
>
  <nz-tab nzTitle="Trading Data">
    <app-trading-ticket></app-trading-ticket>
  </nz-tab>

  <nz-tab nzTitle="Customer Data">
    <app-customer></app-customer>
  </nz-tab>

  <nz-tab nzTitle="Analysis">
    <app-market-analysis></app-market-analysis>
  </nz-tab>

  <nz-tab nzTitle="Risk">
    <app-risk-limits></app-risk-limits>
  </nz-tab>

  <nz-tab nzTitle="Audit">
    <app-audit-compliance></app-audit-compliance>
  </nz-tab>
</nz-tabs>
`}</CodeBlock>

<h3>Component</h3>

<CodeBlock language="ts">{`
import { inject, signal } from '@angular/core';
import { FOCUSLY_SERVICE_API, FocuslyShortcuts } from '@zaybu/focusly';

export class TradingPageComponent {
  private readonly focuslyService = inject(FOCUSLY_SERVICE_API);

  selectedIndex = signal(0);

  focuslyShortcuts: FocuslyShortcuts = {
    'alt+1': () => {
      this.selectIndex(0);
      this.focuslyService.setFocusByElementId('tradingFirstField');
    },
    'alt+2': () => {
      this.selectIndex(1);
      this.focuslyService.setFocusByElementId('customerFirstField');
    },
    'alt+3': () => {
      this.selectIndex(2);
      this.focuslyService.setFocusByElementId('marketFirstField');
    },
    'alt+4': () => {
      this.selectIndex(3);
      this.focuslyService.setFocusByElementId('riskFirstField');
    },
    'alt+5': () => {
      this.selectIndex(4);
      this.focuslyService.setFocusByElementId('auditFirstField');
    }
  };

  selectIndex(index: number) {
    this.selectedIndex.set(index);
  }
}
`}</CodeBlock>

<p>
  When a shortcut is triggered:
</p>

<ul>
  <li>The tab index is changed.</li>
  <li>The new tab renders its content.</li>
  <li>Focusly requests focus for the target field.</li>
  <li>The directive confirms DOM focus before updating application state.</li>
</ul>

        <hr />

        <h2>5. Styling the Active Element</h2>

        <p>
          Focusly applies <code>.focusly-active</code> to the currently active target.
        </p>

        <CodeBlock language="css">{`
.focusly-active {
  outline: 2px solid blue;
  outline-offset: 2px;
}
        `}</CodeBlock>
      </main>
    </Layout>
  );
}