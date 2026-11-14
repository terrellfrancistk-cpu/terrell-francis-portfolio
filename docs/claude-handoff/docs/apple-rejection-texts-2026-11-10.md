# Apple's App Review rejection texts, copied word for word (pulled Nov 10, 2026, 11:44 AM CT by House QA 1, looked only)

## Zilt 1.9.9 (b142), OurPeople 1.9.9 (b126), NOIR 1.9.9 (b147), APEX 1.9.9 (b201): identical 4.3(a) text
- Zilt: msg Nov 3 10:57 AM, submission 3c61955a-3123-4c4f-bdcb-9171a064796c
- OurPeople: msg Nov 3 10:57 AM, sub ca32750d-18a5-4174-9aa6-933d0827b04a
- NOIR: msg Nov 3 10:59 AM, sub 5a4a1c5d-d352-4239-9506-87e0def830e2. 11 IAP/subscription items show Ready for Review; only the app version is Rejected.
- APEX: msg Nov 5 11:45 AM, sub 3b8346dd-a23c-475a-a75c-a9647e7b25ba (API user HLK49BTA37)

```
Guideline 4.3(a) - Design - Spam

Issue Description

We noticed the app shares a similar binary, metadata, and/or concept as apps submitted to the App Store by you or other developers, with only minor differences.

Submitting similar or repackaged apps is a form of spam that creates clutter and makes it difficult for users to discover new apps.

Next Steps

Since we do not accept spam apps on the App Store, we encourage you to review the app concept and submit a unique app with distinct content and functionality.

Resources

Some factors that contribute to a spam rejection may include:

- Submitting an app with the same source code or assets as other apps already submitted to the App Store
- Creating and submitting multiple similar apps using a repackaged app template
- Purchasing an app template with problematic code from a third party
- Submitting several similar apps across multiple accounts

Learn more about our requirements to prevent spam in guideline 4.3.

Extended Review: This app was found to include one or more issues that present significant safety, security, or quality concerns to users. Repeated submissions of apps with these issues will result in extended review times. Accounts that repeatedly submit apps that do not follow the App Review Guidelines and the Apple Developer Program License Agreement face removal from the Apple Developer Program.
```
WARNING: "Extended Review" and the account-removal risk mean repeated resubmissions without substantial change put the whole developer account at risk.

## Booked 1.9.9 (build 1.9.8 (181)) and Curb 1.9.9 (build 1.9.5 (190)): identical 4.3 + 4.2.6 text
- Booked: msg Oct 29 11:27 AM, sub da0e5a44-1531-4fec-9a8a-454c9dbe1196 (earlier Apple msg Oct 13; Terrell replied Oct 29; neither read yet)
- Curb: msg Oct 29 11:26 AM, sub 78c0431d-bc3c-4a5e-903f-8bf0b40a8637 (earlier Apple msg Oct 13)
- NOTE: the build attached is OLD (Booked 1.9.8, Curb 1.9.5) even though the version is 1.9.9.

```
Guidelines 4.3 - Spam and 4.2.6 - App Generation Services

Issue Description

The app does not appear to meet App Store requirements to prevent the distribution of spam submissions.

Specifically, the app appears to match one or more of the following kinds of spam, which make it harder for users to find the apps they want:

- Apps that duplicate content or functionality already on the App Store. See guideline 4.3(a).
- Apps that are indistinguishable from what's already widely available or is an opportunistic variant of an existing category or popular app. See guideline 4.3(b).
- Apps that are created from a commercialized template or app generation service but are not submitted directly by the provider of the app's content. See guideline 4.2.6.

Next Steps

If any of the above descriptions apply to this submission, do not resubmit for review until significant changes have been made to resolve this issue. If the app is resubmitted without substantial improvements, it will be rejected again, and may be rejected for additional issues.

If you believe the app already meets the requirements of guidelines 4.3(a), 4.3(b) and 4.2.6, do not resubmit the app. Instead, reply to this message and answer all of the following questions in full:

1. Describe in detail what this app does and the primary problem it solves for users. Do not use the App Store marketing description as your response.
2. Who is the intended user of this app? Provide a detailed description of the specific target audience.
3. What need or gap in the market does this app address that existing apps do not currently address, or address less effectively? Provide a detailed, substantive explanation.
4. What beta testing did you conduct before submitting the app for review? Provide examples of user feedback provided in beta that was applied to the production build.
5. Is this app intended to function as a standalone product, or is it part of a suite of related apps published under your developer account? If part of a suite, provide a detailed description of how this app's scope and functionality differ from each other app in the suite.
6. Could the functionality of this app be fully delivered as an in-app purchase, feature expansion, or content addition within any other app on your developer account? If so, provide a detailed explanation of why this functionality was not consolidated into that existing app.
7. Does this app's binary share any significant code, frameworks, or assets with any other app on your developer account, beyond standard third-party frameworks? If so, identify each shared component and describe its role in detail.
8. Does this app share any codebase, SDK, or content library with any third-party app, beyond standard third-party frameworks? If so, identify the shared component and provide a detailed explanation of the original functionality this app adds beyond it.
9. Was this app created for a client, partner, or other third party who provided the app's content, concept, or branding? If so, identify who provided the content and provide a detailed explanation of why the app is submitted under your developer account rather than theirs. Note that guideline 4.2.6 requires apps built from a commercial template or app generation service to be submitted directly by the provider of the app's content, not on their behalf by the template or service provider.

Resources
- Learn more about requirements to prevent spam on the App Store in guideline 4.3.
- Learn more about requirements for apps created from a template or app generation service in guideline 4.2.6.
- Use TestFlight to share the app with beta testers and gather feedback before resubmitting.
```

## WRACE 1.9.2 (b96)
Sub a525c097-91cd-4061-a716-c293176da843, reviewed Oct 6, 2026 on iPhone 17 Pro Max (iOS 27.0) + Apple Watch.
- 2.1(a): "The app displayed an error message at Sign in with Apple login." (Apple attached Screenshot-1006-164458.png in ASC.)
- 4 Design: "The app icon does not appear circular because your Apple Watch app icon's background color is black." Fix: "Modify the app's Apple Watch app icon to include a lighter background color to ensure that it is recognizable and appears circular on Apple Watch."

Screenshots are in House QA 1's assets folder (paths in the restore log).
