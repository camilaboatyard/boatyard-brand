// Boatyard brand survey — delivery settings
//
// Responses are sent by the first route below that is filled in.
//
//   formsubmit : automatic email via FormSubmit. The value is an alias token,
//                so your real address never appears in this public file.
//   web3forms  : alternative automatic email. Free key from web3forms.com.
//                Fill this in and it takes priority over formsubmit.
//   endpoint   : Apps Script URL. Writes into your Google Sheet and is the
//                only route that collects everything in one place.
//   email      : optional. Only used if every route above fails — adds a
//                one-click "email it yourself" button to the fallback screen.
//                Leave blank to keep your address out of this file entirely;
//                people then get a copy-the-code button instead.

window.BY_CONFIG = {
  formsubmit: "a61e37cf65202b997aee16904e015c51",
  web3forms:  "",
  endpoint:   "https://script.google.com/macros/s/AKfycbwKipztdV37vvvpNn1cvQ1Tcs_77hoLqIEH-MOIu--BA2JlctX-Xki_Rmoi34eRKFDkqw/exec",
  email:      ""
};
