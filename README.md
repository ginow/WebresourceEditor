## Important Note

This is v2.0 and is currently under development, please switch to v1.0 for fully working release.

## Introduction

Modifying webresources in D365 CRM is a cumbersome process. If we directly edit the scripts in CRM then intellisense and formatting options aren't available and syntax errors aren't detected. So normally we download and open these webresources in code editors like VS Code and then upload it back into CRM.
The solution for above problem is to have an editor like VS Code in the CRM itself. This is achievable by using the Monaco editor which is what powers VS Code, and is open sourced by Microsoft.

## Demo

## Installation

- Download and import the managed solution `WebresourceEditor_managed.zip` from the `Releases` section of this project.

## Usage

- Navigate to `Solutions` under settings and click on the `Webresource Editor` button

  ![solutions](resources/solutions.png)

## References

- Monaco editor: https://microsoft.github.io/monaco-editor/playground.html
