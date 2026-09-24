# A-Z Care analytics event schema

Schema version: **1**  
Consent version: **3**

The website loads Google Analytics and sends events only after a visitor explicitly enables
optional analytics. Rejection leaves the prototype fully usable. Events are validated against a
fixed allowlist before they reach `gtag`; unknown event names, missing required parameters and
unapproved parameter values are discarded.

## Data minimisation

The event layer must never send message text, form values, health readings, contact names, precise
location, email addresses, phone numbers, URLs entered by a visitor or other free-form values.
Automatic GA4 page views remain enabled after consent.

## Current events

| Event                   | Trigger                                                       | Allowed parameters               |
| ----------------------- | ------------------------------------------------------------- | -------------------------------- |
| `navigation_select`     | A measured header, hero or footer navigation link is selected | `destination`, `placement`       |
| `project_link_open`     | The public GitHub repository link is selected                 | `placement=header`               |
| `specifications_open`   | Full specifications are opened from the landing page or phone | `source=landing\|phone`          |
| `demo_screen_view`      | A screen is opened inside the interactive phone               | `screen_name`, `previous_screen` |
| `scenario_start`        | A scam, fall or SOS simulation is started                     | `scenario_name`                  |
| `scenario_complete`     | A simulation reaches a defined outcome                        | `scenario_name`, `result`        |
| `privacy_settings_open` | Privacy settings are opened after analytics consent           | `source`                         |

### Scenario values

- `scenario_name`: `scam_message`, `fall`, `sos`
- `result`: `warning_shown`, `ok`, `help_requested`, `no_response`, `simulation_complete`

## Reserved for Survey v2

`survey_start` and `survey_complete` are defined but are not emitted until Survey v2 exists. They
accept only `source=landing`; answers and free text must never be sent as analytics parameters.

## GA4 configuration after deployment

Register event-scoped custom dimensions for `destination`, `placement`, `source`, `screen_name`,
`previous_screen`, `scenario_name` and `result`. Mark `scenario_complete` as a key event. When Survey
v2 is launched, verify its implementation first and then mark `survey_complete` as a key event.
