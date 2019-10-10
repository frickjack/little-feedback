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

### Pizza or Tacos

Mary wants to know how many of her team want pizza or tacos for lunch.

## UX breakdown

Inkscape demo

### InBox

### OutBox

### Teams

Filter users by label

## Questions 

### Is this better than chat?

Just put everyone in Google Chat or Slack.
Could implement some kind of a bot?

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


## State machine

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
