// Boatyard brand survey — delivery settings
//
// Responses are sent by the first route below that is filled in.
//
//   formsubmit : automatic email. No signup. Needs one activation click,
//                triggered by your own first test submission.
//   web3forms  : automatic email, more reliable. Free access key from
//                web3forms.com — paste it here to use this instead.
//   endpoint   : Apps Script URL. Writes straight into your Google Sheet
//                and is the only route that collects everything in one place.
//   email      : fallback only. If every route above fails, the survey shows
//                a code and a "send it yourself" button pointed here.

window.BY_CONFIG = {
  formsubmit: "camila.boatyard@gmail.com",
  web3forms:  "",
  endpoint:   "PASTE_YOUR_EXEC_URL_HERE",
  email:      "camila.boatyard@gmail.com"
};
