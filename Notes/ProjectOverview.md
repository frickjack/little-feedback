# TL;DR

little-feedback provides a simple API and tools for interacting with simple state machines, and triggering events for state changes.

## User stories

### J needs to schedule overtime

J has a staffing shortfall in this week's calendar.  He wants to offer overtime to select members of his team.  

J logs into the app.

![login-page](./img/login-page.svg)

J opens the "publish" tool.  He sees that he has no outstanding overtime offers.
He clicks the `New Offer` button.

### Automated CICD

An automated CICD pipeline needs approval before updating production.

## UX breakdown

## Data model

* Inbox
* Outbox
* Offer
    - expiration
    - type
    - team
    - filter
* User
* Org
    - permissions
    - team


## Offer State machine

* Open
* Applied
* Accepted
* Rejected
* Expired
* Canceled

![state machine](./img/stateMachine.svg)

## Business Model

* Premium
    - number of team members
    - organization identity provider
