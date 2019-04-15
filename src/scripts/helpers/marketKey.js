export default () => {
  let result = false;

  if (System.data.meta.marketName == "")
    console.error("Cannot get marketName");
  else if (!((window.dataLayer && window.dataLayer.length > 0 && window.dataLayer[0].user.id) || System.data.Brainly.userData.user.id))
    console.error("Cannot get user id");
  else
    result = System.data.meta.marketName + "_" + ((window.dataLayer && window.dataLayer.length > 0 && window.dataLayer[0].user.id) || System.data.Brainly.userData.user.id);

  return result;
}
