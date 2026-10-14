# Interaction matrix — v0.7 (work in progress)

| Page       | Control                          | Expected result                             | Cross-device effect         | Automated test               |
| ---------- | -------------------------------- | ------------------------------------------- | --------------------------- | ---------------------------- |
| Home       | Navigation menu                  | Toggle accessible mobile menu               | None                        | site.spec.js                 |
| Home       | Home / Phone / Watch / Ecosystem | Navigate to the selected destination        | None                        | site.spec.js (partial)       |
| Device Lab | Phone app icons                  | Open app without resizing phone             | Shared state where relevant | device-lab.spec.js (partial) |
| Device Lab | Phone Home / Back                | Return to phone home                        | None                        | device-lab.spec.js (partial) |
| Device Lab | Watch arrows / swipe / keyboard  | Navigate simulated watch readings           | None                        | device-lab.spec.js           |
| Device Lab | Phone SOS                        | Countdown then simulated dispatch or cancel | Watch + event timeline      | device-lab.spec.js           |
| Device Lab | Watch SOS                        | Preserve WATCH origin                       | Phone + timeline            | device-lab.spec.js           |
| Device Lab | Fall detection                   | Initiate shared simulated SOS               | Phone + timeline            | device-lab.spec.js (partial) |
| Device Lab | Network                          | Switch online/offline                       | Offline SOS queue and retry | device-lab.spec.js           |
| Device Lab | Location consent                 | Explicit opt-in or revoke                   | Location and privacy        | device-lab.spec.js           |
| Device Lab | Battery saver                    | Simulated 20% battery mode                  | Watch battery indicator     | device-lab.spec.js           |
| Device Lab | Investor walkthrough             | Advance through scam / fall / offline SOS   | Phone + timeline            | **TODO**                     |
| Device Lab | Scenario buttons                 | Initialize relevant simulated scenario      | Phone/watch state           | **TODO: full enumeration**   |
| Device Lab | Reset                            | Restore initial simulation                  | Both devices + timeline     | device-lab.spec.js           |
| Device Lab | Clear timeline                   | Remove visible events                       | Timeline                    | **TODO**                     |

This is a live audit inventory, not a claim of complete test coverage. All simulated emergency and medical features must remain clearly labeled.
