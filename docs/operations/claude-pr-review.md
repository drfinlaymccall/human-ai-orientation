# Claude CLI review before merge

Updated: 24 October 2026 (Australia/Sydney). Owner: the integrating agent/operator, with Finlay retaining merge/release decisions. Tracking: [#23](https://github.com/drfinlaymccall/human-ai-orientation/issues/23), under [delivery quality #20](https://github.com/drfinlaymccall/human-ai-orientation/issues/20). This is the required **procedural** review gate for every PR, including documentation changes; a checkbox is not GitHub-enforced branch protection.

## Gate and division of responsibility

Implementation → appropriate checks → independent Claude CLI source review → finding adjudication → fixes and focused checks → review the changed candidate → integrator verifies current refs and merge readiness. Claude never merges, deploys or certifies learner competence. The independent review supplements the existing code review and synthetic/human QA; it cannot replace them.

Before merging, the integrator needs a valid receipt for the current repository, PR, base, merge-base, head and complete material scope. Any changed head or base makes the receipt stale until the changed context is reassessed and, where needed, reviewed again. Never reuse an earlier clean review as approval of later edits. A moved base requires an explicit revalidation record even if the integrator establishes that relevant source is unchanged.

Every finding gets a disposition: accepted/fixed with verification; rejected with source evidence; or explicitly deferred with a linked issue, owner and reason. Accepted P0/P1 defects block merge until corrected. Lower-priority deferrals must be visible; they are not silently discarded. A fresh CLI exit, empty finding list, no native test failure or a human tick alone is insufficient evidence.

## 1. Pin the candidate and prepare a public-source bundle

Record repo/PR URL, base branch/tip SHA, merge-base, head branch/SHA, changed-file manifest, included context and validation evidence. Verify the PR is open and the refs still match. Build from pinned Git objects in a clean checkout or export, **never from the dirty live runtime**. Existing open PRs may have different bases; verify them rather than assume main.

Use the full changed patch and only the contextual source needed to assess it. Exclude private/runtime material: `trial/`, `docs/private/`, credentials/configuration, databases, captured email, learner/support records, recordings/logs, `node_modules/` and runtime/vendor copies. Source code containing fictional test data is distinct from real runtime data. If a changed file cannot safely be supplied, mark a coverage gap and arrange a safe alternative; do not silently omit it and call the whole PR reviewed.

Large PRs need partitions. Start with a compact bundle around 80 KB, then adjust to the observed model/context budget. Split by substantive concerns (for example, backend ownership/privacy, client account/draft races, publication/navigation), include necessary boundary contracts/dependencies in each, and record the union of all covered files. Generated outputs need explicit source/generation/drift coverage rather than repeated full copies. A final integration pass checks cross-partition contracts. A single successful partition is not whole-PR approval. Record exact bundle digest(s); do not equate byte limits with a guaranteed token count.

## 2. Use the installed VPS CLI deliberately

The audited binary is `/home/finlay/.local/bin/claude`, version **2.1.293** on 24 October. Supported `auth status --json` confirmed stored Claude OAuth login; identity fields were withheld. Login does not establish quota, model entitlement or completed inference. Do not read tokens/config secrets, reinstall/upgrade the CLI or change the account merely to make review work.

Use a private empty working directory and an argument-list subprocess, supplying the bundle on stdin. The reviewed prompt is [the source-review prompt](../../prompts/claude-pr-review.md). Installed help and the [official CLI reference](https://code.claude.com/docs/en/cli-reference) ground the flags; recheck them when the installed version changes.

Representative argv for the audited version (values are separate arguments, not shell interpolation):

```text
/home/finlay/.local/bin/claude
--print
--safe-mode
--restricted
--setting-sources ""
--settings {"disableAllHooks":true,"autoContinueAtUsageLimit":false,"promptSuggestionEnabled":false,"permissions":{"deny":["Read"]}}
--tools ""
--disallowedTools mcp__*
--strict-mcp-config
--mcp-config {"mcpServers":{}}
--disable-slash-commands
--no-chrome
--no-session-persistence
--permission-mode dontAsk
--permission-prompts none
--effort low
--max-turns 1
--max-budget-usd 1.00
--output-format stream-json
--verbose
--include-hook-events
--system-prompt <trusted prompt text as one argument>
```

The quoted empty values mean empty argv strings. Use a supported explicitly selected model or record the CLI default and the actual served model from final usage; don't guess a current model ID. Record any fallback and reassess it rather than silently calling it the requested review.

Set process-local output/retry bounds, for example `CLAUDE_CODE_MAX_OUTPUT_TOKENS=6000`, `CLAUDE_CODE_MAX_RETRIES=0`, `CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION=false` and `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1`; remove a retry-watchdog override if inherited. Enforce a process timeout (for example, 180 seconds for a small partition); a durable runner should terminate the process group. These trial values are operating examples, not a promise that every review will fit.

Use the network-enabled VPS execution context. A restricted orchestration sandbox can produce EAI_AGAIN without contacting the API; authorise only the bounded public-source request through its normal network permission mechanism. Do not weaken live site protections or expose credentials to solve that problem.

## 3. Prevent unintended context and inspect actual capabilities

Safe mode, an empty cwd, empty setting sources and explicit tools/MCP restrictions reduce ordinary project/customisation loading. They do not prove an operating-system sandbox or exclusion of administrator-managed policy. Inspect startup events; record actual tools, MCP servers, hooks/plugins and model.

The audited CLI reported `tools=[]` and `mcp_servers=[]`, but retained two shipped plugins: `cc-plugin-agents-md` and `cc-plugin-plugin-authoring`, explicitly marked with `path=builtin` and their corresponding builtin source. An operator may allow exactly those observed builtin entries while recording them; arbitrary external plugin paths are not equivalent. No supported flag disabling all builtins was established. Unexpected tools/MCP/custom plugins or hook activity invalidate the run until understood. Do not claim that empty tools establishes no private reads by all managed policy.

Implicit file mentions are another input path: an at-sign reference can attach file contents without a Read call. For version 2.1.293, JSON-encode the entire source bundle, escape every literal at-sign, and verify that decoding preserves the source:

```python
wire = json.dumps(bundle, ensure_ascii=False).replace("@", "\\u0040")
assert "@" not in wire
assert json.loads(wire) == bundle
```

Assert that the trusted system prompt also has no literal at-sign, and keep Read denied as an additional control. The documented disable-file-mentions switch requires a newer version than the audited installation; don't rely on it here. See the [official hooks reference](https://code.claude.com/docs/en/hooks).

Do not use bare mode with the existing stored OAuth login. For literal empty-tool review, omit `--json-schema`: it injects an output-only StructuredOutput tool. Request JSON text and validate it locally instead. See [official structured outputs](https://platform.claude.com/docs/en/agent-sdk/structured-outputs).

## 4. Validate the result and record evidence

Parse the NDJSON stream and require a successful final result with **is_error=false**, not merely exit status or `subtype=success`. The trial produced a success subtype with an API error flag, so either shortcut can falsely pass. Check actual inference/model usage, expected startup capabilities and no tool/hook activity. Handle auth/quota/network failure, turn/budget/output exhaustion, timeout, refusal and malformed/missing results as **unavailable/incomplete**, not clean reviews. The dollar flag is an estimated API-list-cost guard, can overshoot within a request and does not reserve subscription quota. See [official headless operation](https://code.claude.com/docs/en/headless).

Validate the model's JSON against this contract before adjudicating findings:

- Exact repo, PR, base, merge-base and head values; verdict `no_findings`, `findings` or `incomplete`.
- `reviewed_files` restricted to the supplied manifest and equal to the declared covered scope; partitions reconcile against the full PR manifest externally.
- Findings contain priority P0–P3, file, exact line, short title, explanation, evidence and recommended correction. File/line must exist in supplied source; speculative claims become limitations, not invented facts.
- Caveats record missing context/verification. Findings and verdict agree. Missing files or invalid output fail coverage, even when the model says no findings.

Attach a **sanitised receipt outside the commit being reviewed** (for example in the PR body/review evidence). Required fields: reviewed refs, manifest/digest/partitions, CLI version, actual model/capabilities, run status, finding dispositions, verification actually performed, remaining limits, reviewer/operator and date. Keep raw prompts/streams in a private operator directory; they repeat source and can contain diagnostics. A receipt-only commit changes its own reviewed head and must not create a self-invalidating loop.

Immediately before merge, re-fetch PR refs and check every required partition/result/disposition. If missing, stale, incomplete or blocked, leave the PR unmerged and name the next action. A model's `no_findings` is source-review evidence; it is never autonomous approval to merge.

## 5. Procedural gate versus enforcement

AGENTS.md/CONTRIBUTING.md and the PR template make this a repository working rule now. A durable runner, trusted status publisher and required check/ruleset are additional implementation in #23/#20 and need repository permissions. #10 separately tracks ordinary GitHub Actions activation. Until a real check and rule are verified, do not claim GitHub prevents bypass or that a local CLI receipt is CI. Never publish OAuth credentials to a workflow.

## Verification record — 24 October

The installed CLI, supported flags and authenticated state were checked. A restricted-network trial did not reach the API. A network-enabled PR17 trial did reach Claude (`claude-sonnet-5-5`) but exhausted the deliberately small budget/output allowance on its oversized bundle: no review result was produced. This validates access and failure handling, **not PR17 approval**. Its report estimated $1.26302 against a $1 guard; that is estimated list usage, not a claim about subscription billing. The smaller PR18 methodology proof completed with valid seven-file coverage and no findings in supplied source; it ran no browser/native tests and is not merge approval. Its actual SHA/model/capability/scope limits are in the [dated triage receipt](../releases/2026-10-24-hoc-improvement-triage.md). Earlier release receipts that explicitly lacked external cross-model review do not satisfy this new gate.
