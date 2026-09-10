# Planning notes, from the quarterly review

Three things came out of the review, in the order the room ranked them.

**Device onboarding is the bottleneck.** A new operator takes eleven days to get
their first vehicle reporting, and nine of those are spent waiting on us to
hand-provision certificates. Self-serve enrolment is the fix everyone agreed on.
No date was set.

**Alerting has no owner and no on-call.** It was split out of the console in
June to stop alert storms taking the app down with them. That worked. What it
also did is leave a service nobody is paged for. The room did not decide
whether to staff it or fold it back in.

**The console's map redraws the whole fleet on every telemetry tick.** Fine at
40 vehicles, visibly bad at 400, and the largest prospect in the pipeline runs
about 900. Nobody has measured where it actually breaks.

Not discussed and deliberately out of scope this quarter: the mobile app, the
billing rebuild, and anything touching the device firmware.
