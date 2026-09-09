import { escapeHtml } from './render-progress.mjs';

export function completionPresentation(completion) {
  if (completion == null) return { attributes: '', statusHtml: '', statusText: '' };
  if (!['complete', 'milestone-complete'].includes(completion.state)) throw new Error('Completion needs an explicit supported state');
  if (!completion.label?.trim() || !completion.scope?.trim() || !/^#[a-z][a-z0-9-]*$/.test(completion.evidenceHref)) throw new Error('Completion needs a label, scope and canonical evidence anchor');
  if (completion.state === 'milestone-complete' && !completion.remainingLabel?.trim()) throw new Error('Milestone completion must name remaining work');
  if (completion.state === 'complete' && completion.remainingLabel) throw new Error('Remaining initiative work is not full completion');
  return {
    attributes: ` data-completion-state="${completion.state}" data-completion-scope="${escapeHtml(completion.scope)}" data-completion-evidence="${escapeHtml(completion.evidenceHref)}"`,
    statusHtml: `<span class="rm-completion-label">${escapeHtml(completion.label)}</span>${completion.remainingLabel ? `<span class="rm-completion-remaining">${escapeHtml(completion.remainingLabel)}</span>` : ''}`,
    statusText: [completion.label, completion.remainingLabel].filter(Boolean).join(' · '),
  };
}
