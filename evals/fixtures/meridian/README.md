# Meridian

Fleet telemetry for regional freight operators. Two services: `ingest` (device
telemetry, MQTT to Postgres) and `console` (the operator web app). A third
deployable, `alerting`, was split out of `console` in June and is the only one
with no owner.

Synthetic fixture. Every name, number and ticket here is invented for skill
evaluation; it describes no real company, product or person.
