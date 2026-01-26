import { Directive, Input, Optional, inject } from '@angular/core';

/**
 * Attach to any container element to define a default Focusly group for all descendant
 * `focusly` directives (unless they explicitly set [focuslyGroup] themselves).
 *
 * Usage:
 *   <section [focuslyGroupHost]="1"> ... </section>
 *   <table [focuslyGroupHost]="2"> ... </table>
 *
 * Descendants can inject this directive to resolve their group via DI inheritance:
 *   private readonly host = inject(FocuslyGroupHostDirective, { optional: true });
 */
@Directive({
  selector: '[focuslyGroupHost]',
  exportAs: 'focuslyGroupHost',
  standalone: true,
})
export class FocuslyGroupHostDirective {

  @Input({ required: true })  focuslyGroupHost!: number;

//   /**
//    * Optional parent host for nested groups.
//    * Useful for debugging/dev warnings, or if you ever want to “bubble” context.
//    */
//   readonly parent: FocuslyGroupHostDirective | null = inject(FocuslyGroupHostDirective, {
//     optional: true,
//     skipSelf: true,
//   });

  /**
   * Resolve the effective group for this host.
   * At the moment this is just the local input, but keeping a method makes future evolution easy
   * (e.g., supporting "inherit" sentinel values, merging config, etc).
   */
  resolveGroup(): number {
    return this.focuslyGroupHost;
  }
}
