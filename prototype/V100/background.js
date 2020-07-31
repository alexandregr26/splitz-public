// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

chrome.commands.onCommand.addListener(function (command) {
  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    // Sort tabs according to their index in the window.
    tabs.sort((a, b) => { return a.index < b.index; });
    let activeIndex = tabs.findIndex((tab) => { return tab.active; });
    let lastTab = tabs.length - 1;
    let newIndex = -1;

    // Closing Tab (CTRL+UP)
    if (command === 'close-tab') {
      chrome.tabs.remove(tabs[activeIndex].id, function () { });
    }

    // Next Tab (CTRL+RIGHT)
    if (command === 'flip-tabs-forward') {
      newIndex = activeIndex === 0 ? lastTab : activeIndex - 1;
    } else if (command === 'flip-tabs-backwards') {  // Next Tab (CTRL+LEFT)
      newIndex = activeIndex === lastTab ? 0 : activeIndex + 1;
    }
    chrome.tabs.update(tabs[newIndex].id, { active: true, highlighted: true });
  });
});