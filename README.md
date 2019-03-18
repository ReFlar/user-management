# User Management by ReFlar 
### [Deprecated as of Flarum Beta 8]

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/reflar/user-management/blob/master/LICENSE.md) [![Latest Stable Version](https://img.shields.io/packagist/v/reflar/user-management.svg)](https://packagist.org/packages/reflar/user-management) [![Total Downloads](https://img.shields.io/packagist/dt/reflar/user-management.svg)](https://packagist.org/packages/reflar/user-management)  

A [Flarum](http://flarum.org) extension that allows you to manage every aspect of your users, with style!

This extension allows you to give users strikes for posts if they violate rules. Those strikes are kept and can be viewed at any time by anyone with permission. This extension also allows you to disable the email registration option, as well as giving you the ability to add an age and gender field to the user registration modal. The user's age and gender is shown on their profile page. You can also manually activate users from the admin interface, or from the users page.

![gif](http://i.imgur.com/pkMM6aA.gif)


![gif](http://i.imgur.com/dfHaFwL.gif)

## Compatibility

This extension might not be compatible with other extensions that make change to the sign up modal as well. If an extension is not listed below, please try it on a test forum first and let us know if it works.

**Works With:**

- All ReFlar extensions  

**Does Not Work With:**

- [Flagrow Terms](https://github.com/flagrow/terms) (should be compatible again in future version 0.2) see [ReFlar/user-management#20](https://github.com/ReFlar/user-management/issues/20) for more details.

## Goals

- To provide an easy and intuitive User Management solution.
- To make registration more customizable.
- To log user incidents.

## Usage

- User Management from the Admin CP.
- Moderators can assign strikes to posts.
- Strikes can be tracked from admin page or directly from the user page.
- Remove email registration.
- Added age and gender.

## Installation

Install it with composer:

```bash
composer require reflar/user-management
```

Then login and enable the extension.

## Developer Guide

You have 2 events to listen for "UserWillBeGivenStrike" as well as "UserWasGivenStike" which both contain the offending post, the user being struck, the strike issuer, and the reason.

You also have the api/strike post route to give a user a strike, /API strike/{userId} get route to get a user's strikes, and /api/strike/{id} delete route to delete the strike.

You can also post to /api/reflar/usermanagement/attributes to set a user's gender and age.

## To Do

- Requests?

## Issues

- Incompatibility with [Flagrow's Terms](https://github.com/flagrow/terms) extension (should be compatible again in future version 0.2) see [ReFlar/user-management#20](https://github.com/ReFlar/user-management/issues/20) for more details.


## Links

- [on github](https://github.com/ReFlar/user-management)
- [on packagist](https://packagist.org/packages/ReFlar/user-management)
- [issues](https://github.com/ReFlar/user-management/issues)
