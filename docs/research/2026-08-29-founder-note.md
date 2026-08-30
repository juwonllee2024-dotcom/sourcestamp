# SourceStamp founder note

## Problem

People regularly move one useful sentence from a web page, PDF, or AI conversation into a brief, issue, or chat. The repeated failure is not discovery; it is losing the source and the exact wording during handoff.

## Four independent candidates

| Candidate | Pain | Novelty | Build today | Shareability | Open-source fit | Total | Decision |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| SourceStamp | 5 | 4 | 5 | 5 | 5 | 24 | choose |
| PlaceOnce | 4 | 3 | 5 | 4 | 5 | 21 | reject: copy/sync tools already cover the broad job |
| BackToIt | 4 | 3 | 5 | 4 | 4 | 20 | reject: tab, session, and focus products are crowded |
| BugProof | 5 | 2 | 4 | 5 | 4 | 20 | reject: Devtriage, repropack-cli, and OpenJam overlap directly |

## Evidence checked

- [GitHub Trending, monthly](https://github.com/trending?since=monthly) showed continued attention around local-first AI workspaces, agent memory/skills, and inspectable developer tooling.
- [A browser automation discussion](https://www.reddit.com/r/chrome_extensions/comments/1vsfa1g/need_a_reliable_browser_automation_tool_for_multi/) described repeated movement across Chrome tabs and local files.
- [A copy-paste discussion](https://www.reddit.com/r/SoftwareandApps/comments/1vi2s81/anyone_else_get_annoyed_by_constant_alt-tabbing/) described the repeated Alt-Tab, copy, paste, and form-fill loop.
- [A productivity discussion](https://www.reddit.com/r/ProductivityGuide/comments/1tnj5sj/i_stopped_trying_to_come_up_with_the_perfect/) described copying messy PDF/web content into decks and briefs.
- Existing products such as [ResearchBinder](https://chromewebstore.google.com/detail/researchbinder-local-rese/okffjkknpmeemedaehpfllihmoaadeda) and [PageStow](https://plugin.tiybai.com/) validate demand for preserving context, but they are libraries/workspaces rather than an ephemeral receipt at the moment of copy.
- Existing failure-bundle tools such as [Devtriage](https://github.com/DevMubarak1/Devtriage) and [repropack-cli](https://socket.dev/npm/package/repropack-cli) made BugProof a poor new-repository wedge.

## Innovation hypothesis

If a user can create a visible, source-linked receipt in one popup without creating an account or a collection, they will attach provenance to more of the claims they share because the cost is lower than reopening the source later.

The one thing different from a web clipper is the product boundary: SourceStamp does not build a library, crawl pages, or sync data. It creates a reviewable artifact and stops.

## First users and business hypothesis

The first ten users are researchers, students, support writers, and developers who paste web material into briefs, issues, or AI chats. They can be reached through small research/productivity communities and open-source browser-extension communities. A possible future paid path is team receipt templates or local verification workflows, but revenue is untested and not required for the MVP.

## Seven-day experiment

Give the extension to ten people who move browser research into another document. Count receipts created, receipts reused, and the number of people who can explain the source fingerprint without help. A strong signal is three receipts per person in seven days with no tutorial; a weak signal means the capture/export step needs fixing before adding features.

## Limits

This is a hypothesis, not a claim of market fit or 100K stars. The most important unknown is whether a receipt is valuable enough to become a habit instead of being perceived as extra formatting.
