setInterval(async () => {
  if (await isNotiActive() && await isReminded() != new Date().getDate()) {
    let dataRemind = await getRemindList();
    let remindList = checkRemind(dataRemind);
    remindList.forEach((item) => {
      let now = new Date();
      let anniDate = new Date(item.date);
      let daysLeft = Math.floor((anniDate - now) / (1000 * 60 * 60 * 24));
      let options = {
        title: `${daysLeft == 0 ? "Tomorrow: " : daysLeft + " days left: "}${
          item.title
        }`,
        message: `${item.content}`,
        iconUrl: "./assets/ext-icon.png",
        type: "basic",
      };
      showNotify(options);
    });
    setIsReminded(new Date().getDate());
  }
}, 1000 * 60);

//create notification
function showNotify(options) {
  chrome.notifications.create("", options);
}
function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function getRemindList() {
  return new Promise((resolve) => {
    // Asynchronously fetch all data from storage.sync.
    chrome.storage.sync.get("dataRemind", (res) => {
      resolve(res.dataRemind ? res.dataRemind : []);
    });
  });
}
function isNotiActive() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["RemindNotiActive"], function (result) {
      resolve(result.RemindNotiActive);
    });
  });
}
function isReminded(){
  return new Promise(resolve => {
    chrome.storage.sync.get(["isReminded"], function (result) {
      resolve(result.isReminded ? result.isReminded : "");
    });
  })
}
function setIsReminded(date){
  return new Promise(resolve => {
    chrome.storage.sync.set({ isReminded: date }, function () {
      resolve("done");
    });
  })
}
function checkRemind(data) {
  let remindList = [];
  data.forEach((item) => {
    let today = new Date();
    let anniDate = new Date(item.date);
    let remindDate = new Date(
      anniDate.setDate(anniDate.getDate() - parseInt(item.inAdvance))
    );
    if (remindDate.getMonth() <= today.getMonth()) {
      if (remindDate.getDate() == today.getDate()) {
        remindList = [item, ...remindList];
      }
      if (remindDate.getDate() < today.getDate() && item.repeat) {
        remindList = [item, ...remindList];
      }
    }
  });
  return remindList;
}
// onInstalled
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.storage.local.get(["RemindNotiActive"], function (result) {
      console.log(result.RemindNotiActive);
      if (!result.RemindNotiActive) {
        chrome.storage.local.set({ RemindNotiActive: true }, function () {
          console.log("set done ");
        });
      } else {
        console.log("get value success: " + result.RemindNotiActive);
      }
    });
  }
});

// keep alive
// let lifeline;

// keepAlive();

// chrome.runtime.onConnect.addListener((port) => {
//   if (port.name === "keepAlive") {
//     lifeline = port;
//     setTimeout(keepAliveForced, 295e3); // 5 minutes minus 5 seconds
//     port.onDisconnect.addListener(keepAliveForced);
//   }
// });

// function keepAliveForced() {
//   lifeline?.disconnect();
//   lifeline = null;
//   keepAlive();
// }

// async function keepAlive() {
//   if (lifeline) return;
//   for (const tab of await chrome.tabs.query({ url: "*://*/*" })) {
//     try {
//       await chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         function: () => chrome.runtime.connect({ name: "keepAlive" }),
//         // `function` will become `func` in Chrome 93+
//       });
//       chrome.tabs.onUpdated.removeListener(retryOnTabUpdate);
//       return;
//     } catch (e) {}
//   }
//   chrome.tabs.onUpdated.addListener(retryOnTabUpdate);
// }

// async function retryOnTabUpdate(tabId, info, tab) {
//   if (info.url && /^(file|https?):/.test(info.url)) {
//     keepAlive();
//   }
// }
