import WaitForElement from "@root/helpers/WaitForElement";

const querySelectors = [
  ".js-web-to-app-banner",
  ".js-mobile-add-question",
  `[class*="BrainlyPlusToaster__section-"]`,
  ".brn-qpage-next-banner",
  ".brn-ads-box",
];

export default function RemoveJunkElements() {
  querySelectors.forEach(async selector => {
    const element = await WaitForElement(selector, {
      expireIn: 5,
      noError: true,
    });

    element.remove();
  });
}
