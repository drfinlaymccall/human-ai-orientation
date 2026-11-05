## Change

Explain the learner/operator problem and resulting behaviour. Link the parent issue and bounded HOC work block. State documentation and CONTROL.md impact.

## Verification

Record actual commands/results, tested revision/environment and remaining limits. Keep source review, synthetic functionality, physical-device checks and human observations distinct. Native changes preserve IDs, attempts/answers and completion; use synthetic accounts/captured mail.

## Claude CLI review before merge

Follow [the review procedure](../docs/operations/claude-pr-review.md). Attach a sanitised receipt to this PR; keep raw streams/private data out of GitHub.

- [ ] Current repository/PR, base, merge-base and head are pinned and still match.
- [ ] Complete material scope/partitions, bundle digest, CLI version and actual model/capabilities are recorded.
- [ ] Review completed with valid output and coverage; unavailable/incomplete is not a pass.
- [ ] Findings are fixed/tested/re-reviewed or explicitly adjudicated with evidence/linked deferrals; no accepted P0/P1 remains.
- [ ] No new head/base is using a stale review. The integrator has verified merge readiness.

This is a procedural gate until a required GitHub check/ruleset is installed and verified. A clean model review does not authorise merge or deployment by itself.
