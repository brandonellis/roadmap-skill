# Where the data lives, and what that costs us

Telemetry lands in one Postgres table partitioned by month. Retention is
indefinite because nobody has decided a window, which means the oldest partition
is now larger than the newest fourteen combined.

The console reads that table directly. There is no aggregate layer, so a
fleet-wide view is a scan. This is the single fact behind both the map
performance complaint and the reporting latency complaint; they are the same
problem seen from two windows.

Certificates for device enrolment are issued by hand from a runbook. The runbook
is accurate. It is also the reason onboarding takes eleven days.
